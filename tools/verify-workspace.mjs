import assert from 'node:assert/strict';
import { realpath, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { withReferenceChrome, until } from './reference-chrome.mjs';

let root = process.cwd();
let screenshots;
for (let i = 2; i < process.argv.length; i += 2) {
  const flag = process.argv[i];
  const value = process.argv[i + 1];
  if (flag === '--root' && value) root = value;
  else if (flag === '--screenshots' && value && isAbsolute(value)) screenshots = await realpath(value);
  else throw new Error('Usage: node tools/verify-workspace.mjs [--root path-to-staged-site] [--screenshots existing-absolute-directory]');
}

await withReferenceChrome(root, async ({ call, origin, errors, requests, version }) => {
  async function read(expression) {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true });
    assert.equal(result.exceptionDetails, undefined, result.exceptionDetails?.text);
    return result.result.value;
  }

  const element = selector => `document.querySelector(${JSON.stringify(selector)})`;
  const attr = (selector, name) => read(`${element(selector)}.getAttribute(${JSON.stringify(name)})`);
  const focus = () => read('document.activeElement.id');
  const shown = selector => read(`!!${element(selector)}.getClientRects().length`);
  const width = selector => read(`${element(selector)}.getBoundingClientRect().width`);
  const state = () => read('document.getElementById("job-status").textContent');
  const progress = () => attr('#job-progress', 'aria-valuenow').then(Number);
  const settle = selector => until(() => read(
    `${element(selector)}.getAnimations().every(animation => animation.playState !== 'running')`,
  ), `${selector} animation`);

  async function node(selector) {
    const { root: documentNode } = await call('DOM.getDocument');
    const { nodeId } = await call('DOM.querySelector', { nodeId: documentNode.nodeId, selector });
    assert.ok(nodeId, `Missing ${selector}`);
    return nodeId;
  }

  async function center(selector) {
    const nodeId = await node(selector);
    await call('DOM.scrollIntoViewIfNeeded', { nodeId });
    return read(`(() => {
      const rect = ${element(selector)}.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
  }

  async function click(selector) {
    const point = await center(selector);
    await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  }

  async function key(key, windowsVirtualKeyCode) {
    const code = key;
    await call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key, code, windowsVirtualKeyCode });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
  }

  const resize = (width, height) => call('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: false,
  });

  async function capture(name) {
    if (!screenshots) return;
    const { data } = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(screenshots, name), Buffer.from(data, 'base64'));
  }

  async function assertNoHorizontalScroll() {
    assert.equal(await read('document.documentElement.scrollWidth <= innerWidth'), true, 'Workspace overflows horizontally');
  }

  await resize(1440, 960);
  await call('Page.navigate', { url: `${origin}/demo/` });
  await until(() => read('document.readyState === "complete" && Boolean(document.getElementById("job-status"))'), 'workspace load');
  assert.equal(await attr('html', 'data-theme'), 'dark');
  assert.equal(await attr('#show-details', 'aria-expanded'), 'false');
  assert.equal(await attr('#show-settings', 'aria-expanded'), 'false');
  assert.equal(await shown('#inspector'), false);
  assert.equal(await shown('#settings'), false);
  assert.equal(await attr('#job-progress', 'role'), 'progressbar');
  assert.equal(await progress(), 0);
  const { nodes } = await call('Accessibility.getPartialAXTree', {
    nodeId: await node('#job-progress'), fetchRelatives: false,
  });
  assert.equal(nodes[0].role.value, 'progressbar');
  assert.equal(nodes[0].name.value, 'Simulated preview progress');
  await assertNoHorizontalScroll();
  await capture('workspace-desktop.png');

  const mainWidth = await width('.primary-work');
  await click('#show-details');
  assert.equal(await shown('#inspector'), true);
  assert.equal(await focus(), 'close-details');
  assert.equal(await attr('#show-details', 'aria-expanded'), 'true');
  assert.ok(await width('.primary-work') < mainWidth, 'Details use workspace space');
  await settle('#inspector-slot');
  await capture('workspace-details-docked.png');
  await key('Escape', 27);
  assert.equal(await focus(), 'show-details');
  assert.equal(await width('.primary-work'), mainWidth);

  await click('#show-details');
  await settle('#inspector-slot');
  await click('#resize');
  assert.equal(await focus(), 'resize');
  await key('End', 35);
  assert.equal(await attr('#resize', 'aria-valuenow'), '420');
  assert.equal(await width('#inspector'), 420);
  await key('Home', 36);
  assert.equal(await attr('#resize', 'aria-valuenow'), '240');
  const start = await center('#resize');
  const dockEdge = await attr('#work-area', 'data-details-edge');
  const end = { x: start.x + (dockEdge === 'left' ? 26 : -26), y: start.y };
  await call('Input.dispatchMouseEvent', { type:'mouseMoved', ...start });
  await call('Input.dispatchMouseEvent', { type:'mousePressed', ...start, button:'left', buttons:1, clickCount:1 });
  await call('Input.dispatchMouseEvent', { type:'mouseMoved', ...end, button:'left', buttons:1 });
  await until(async () => await attr('#resize', 'aria-valuenow') === '266', 'pointer resizing');
  await call('Input.dispatchMouseEvent', { type:'mouseReleased', ...end, button:'left', buttons:0, clickCount:1 });
  await key('Escape', 27);
  assert.equal(await focus(), 'show-details');

  await click('#start');
  assert.equal(await focus(), 'pause');
  await until(async () => await progress() >= (screenshots ? 35 : 5), 'simulated progress');
  await click('#pause');
  const paused = await progress();
  assert.equal(await state(), 'Paused');
  assert.equal(await read('document.getElementById("percentage").textContent'), `${paused}%`);
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.equal(await progress(), paused);
  await capture('workspace-progress.png');
  await click('#show-settings');
  await settle('#settings-dialog');
  await click('#theme');
  await key('End', 35);
  await key('Enter', 13);
  await until(async () => await attr('html', 'data-theme') === 'high-contrast', 'built-in High Contrast theme');
  const highContrastRing = await read(`(() => {
    const ring = document.getElementById('job-progress');
    const arc = getComputedStyle(ring, '::before');
    const track = getComputedStyle(ring, '::after');
    return { sweep:arc.backgroundImage, mask:arc.maskImage, trackWidth:track.borderTopWidth,
      sweepWidth:arc.getPropertyValue('--radial-stroke').trim() };
  })()`);
  assert.match(highContrastRing.sweep, /conic-gradient\(.+rgba\(0, 0, 0, 0\)/);
  assert.match(highContrastRing.mask, /radial-gradient/);
  assert.ok(parseFloat(highContrastRing.sweepWidth) > parseFloat(highContrastRing.trackWidth));
  assert.equal(await progress(), paused);
  await click('#theme');
  await key('ArrowUp', 38);
  await key('Enter', 13);
  await until(async () => await attr('html', 'data-theme') === 'dark', 'restored dark theme');
  await click('#close-settings');
  await click('#pause');
  await until(async () => await progress() > paused, 'resume progress');
  await click('#cancel');
  assert.match(await state(), /^Cancelled/);
  assert.equal(await focus(), 'start');
  await click('#start');
  await until(async () => await state() === 'Completed · No work running', 'successful completion', 15000);
  assert.equal(await progress(), 100);
  assert.equal(await read('document.getElementById("percentage").textContent'), '100%');

  await resize(1680, 960);
  await until(() => read('innerWidth === 1680'), 'wide layout');
  await click('#show-settings');
  assert.equal(await shown('#settings-dialog'), true);
  assert.equal(await focus(), 'close-settings');
  await settle('#settings-dialog');
  await click('#pin-settings');
  assert.equal(await shown('#settings-dialog'), false);
  assert.equal(await shown('#settings-slot'), true);
  await click('#show-details');
  await assertNoHorizontalScroll();
  await key('Escape', 27);
  await click('#close-settings');
  assert.equal(await focus(), 'show-settings');

  for (const viewportWidth of [1024, 768, 320]) {
    await resize(viewportWidth, 760);
    await until(() => read(`innerWidth === ${viewportWidth}`), `${viewportWidth}px layout`);
    await assertNoHorizontalScroll();
  }
  await call('Emulation.setEmulatedMedia', { features: [
    { name:'prefers-reduced-motion', value:'reduce' },
    { name:'forced-colors', value:'active' },
  ] });
  await click('#show-settings');
  const settings = await read(`(() => {
    const dialog = document.getElementById('settings-dialog');
    const rect = dialog.getBoundingClientRect();
    return { edge:dialog.dataset.edge, animation:getComputedStyle(dialog).animationName,
      fits:[rect.left >= 0, rect.right <= innerWidth, rect.top >= 0, rect.bottom <= innerHeight].every(Boolean) };
  })()`);
  assert.deepEqual(settings, { edge: 'bottom', animation: 'none', fits: true });
  assert.equal(await focus(), 'close-settings');
  await capture('workspace-settings-narrow.png');
  await key('Escape', 27);
  assert.equal(await focus(), 'show-settings');
  await click('#show-details');
  assert.equal(await attr('#details-dialog', 'data-edge'), 'bottom');
  assert.equal(await focus(), 'close-details');
  await key('Escape', 27);
  assert.equal(await focus(), 'show-details');
  await click('[data-task="1"]');
  assert.equal(await focus(), 'close-details');
  await key('Escape', 27);
  assert.equal(await read('document.activeElement.getAttribute("data-task")'), '1');
  const ring = await read(`(() => {
    const style = getComputedStyle(document.getElementById('job-progress'), '::before');
    return { forced: style.forcedColorAdjust, image: style.backgroundImage };
  })()`);
  assert.equal(ring.forced, 'none');
  assert.match(ring.image, /conic-gradient/);
  await assertNoHorizontalScroll();

  assert.deepEqual(errors, [], 'Browser errors');
  assert.ok(requests.length > 0);
  assert.ok(requests.every(({ local }) => local), 'Workspace made an external request');
  console.log(`${version}: workspace fit, drawers, focus, resizing, progression, forced colors and reduced motion passed.`);
});
