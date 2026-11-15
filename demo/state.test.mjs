import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, readPreferences, constrainWidth, transition } from './state.mjs';
import { closestDrawerEdge } from './patterns.mjs';

test('untrusted display preferences cannot escape allowed values', () => {
  for (const raw of [null, '{', '[]', '{"version":2}', 'x'.repeat(2049)]) {
    assert.deepEqual(readPreferences(raw), defaults);
  }
  const prefs = readPreferences('{"version":1,"theme":"light","density":"touch","effects":true,"width":99999,"collapsed":true,"content":"private"}');
  assert.deepEqual(prefs, { ...defaults, theme:'light', density:'touch', effects:true, collapsed:true });
  assert.equal(constrainWidth(-100), 240);
  assert.equal(constrainWidth(999), 420);
  assert.equal(constrainWidth(NaN), 300);
});

test('pause freezes progress; resume, completion, cancellation and restart are bounded', () => {
  let state = transition({status:'ready', progress:0}, 'start');
  state = transition(state, 'tick');
  assert.equal(state.progress, 5);
  state = transition(state, 'pause');
  assert.deepEqual(transition(state, 'tick'), state);
  assert.equal(transition(state, 'resume').progress, 5);
  const cancelled = transition(state, 'cancel');
  assert.deepEqual(transition(cancelled, 'tick'), cancelled);
  assert.deepEqual(transition(cancelled, 'start'), {status:'running', progress:0});
  state = transition(state, 'resume');
  for (let i=0; i<25; i++) state = transition(state, 'tick');
  assert.deepEqual(state, {status:'completed', progress:100});
  assert.deepEqual(transition(state, 'tick'), state);
  assert.deepEqual(transition(state, 'pause'), state);
});

test('legacy preferences retain display choices and gain settings defaults', () => {
  const legacy = {version:1, theme:'dark', density:'compact', effects:true, width:360, collapsed:true};
  assert.deepEqual(readPreferences(JSON.stringify(legacy)), {
    ...legacy, accent:'carmine', settingsSection:'appearance', settingsPinned:false
  });
});

test('a fresh workspace starts dark with its secondary panes closed', () => {
  const fresh = readPreferences(null);
  assert.equal(fresh.theme, 'dark');
  assert.equal(fresh.collapsed, true);
  assert.equal(fresh.settingsPinned, false);
  const saved = readPreferences('{"version":1,"theme":"high-contrast","collapsed":false}');
  assert.equal(saved.theme, 'high-contrast');
  assert.equal(saved.collapsed, false);
});

test('drawer edge honors usable screen bounds, including negative-origin displays', () => {
  const monitor = { left:-1920, top:40, width:1920, height:1040 };
  const window = { left:-1890, top:230, width:850, height:650 };
  assert.equal(closestDrawerEdge(monitor, window, 'right'), 'left');
  const nearTop = { ...window, left:-1500, top:40 };
  assert.equal(closestDrawerEdge(monitor, nearTop, 'right'), 'top');
  assert.equal(closestDrawerEdge(monitor, nearTop, 'right', true), 'left');
  assert.equal(closestDrawerEdge(monitor, { ...window, left:-860, top:290 }, 'left'), 'right');
  assert.equal(closestDrawerEdge(monitor, { ...window, left:-1500, top:425 }, 'right'), 'bottom');
  assert.equal(closestDrawerEdge({ ...monitor, left:undefined }, window, 'right'), 'right');
  assert.equal(closestDrawerEdge(monitor, { ...window, left:0, top:0 }, 'bottom'), 'bottom');
  assert.equal(closestDrawerEdge(monitor, monitor, 'right'), 'right');
});

test('accent IDs persist independently of theme and invalid values fall back', () => {
  for (const theme of ['system', 'light', 'dark']) {
    for (const accent of ['carmine', 'github', 'crimson', 'blue', 'teal']) {
      const prefs = readPreferences(JSON.stringify({ version:1, theme, accent }));
      assert.equal(prefs.theme, theme);
      assert.equal(prefs.accent, accent);
    }
  }
  for (const accent of [null, [], {}, 1, '#76172A', 'Blue', 'blue; color: red']) {
    assert.equal(readPreferences(JSON.stringify({ version:1, accent })).accent, 'carmine');
  }
});

test('settings navigation fields accept only known sections and boolean pinning', () => {
  for (const settingsSection of ['appearance', 'layout', 'shortcuts']) {
    const prefs = readPreferences(JSON.stringify({version:1, settingsSection, settingsPinned:true}));
    assert.equal(prefs.settingsSection, settingsSection);
    assert.equal(prefs.settingsPinned, true);
  }
  for (const value of [null, [], {}, 1, 'unknown']) {
    const prefs = readPreferences(JSON.stringify({version:1, settingsSection:value, settingsPinned:value}));
    assert.equal(prefs.settingsSection, 'appearance');
    assert.equal(prefs.settingsPinned, false);
  }
});

test('density accepts the per-component default and keeps older stored choices', () => {
  assert.equal(defaults.density, 'auto');
  assert.equal(readPreferences('{"version":1,"density":"auto"}').density, 'auto');
  assert.equal(readPreferences('{"version":1,"density":"comfortable"}').density, 'comfortable');
  assert.equal(readPreferences('{"version":1,"density":"huge"}').density, 'auto');
});
