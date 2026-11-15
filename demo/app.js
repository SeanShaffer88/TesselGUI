import { defaults, readPreferences, constrainWidth, transition } from './state.mjs';
import { installCommandPalette } from './palette.mjs';
import { drawerEdge } from './patterns.mjs';
const $ = id => document.getElementById(id);
const storageKey = 'tessel.display.v1';
let prefs;
try { prefs = readPreferences(localStorage.getItem(storageKey)); }
catch { prefs = {...defaults}; $('storage-status').textContent = 'Storage unavailable; display changes last for this visit.'; }
const narrow = matchMedia('(max-width: 900px)');
// Reserve at least 576px for primary work beside a 420px inspector and 360px Settings.
const pinFits = matchMedia('(min-width: 1640px)');
const drawer = $('details-dialog');
const inspector = $('inspector');
const inspectorSlot = $('inspector-slot');
const workArea = $('work-area');
const settings = $('settings');
const settingsDialog = $('settings-dialog');
let settingsOpen = false;
let settingsTrigger = $('show-settings');
let widthDirty = false;
let detailsTrigger = $('show-details');
let job = {status:'ready', progress:0};
let timer = null;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(prefs)); }
  catch { $('storage-status').textContent = 'Storage unavailable; display changes last for this visit.'; }
}
function applyDisplay() {
  for (const name of ['theme','accent','density']) {
    document.documentElement.dataset[name] = prefs[name];
    $(name).value = prefs[name];
  }
  document.documentElement.dataset.effects = String(prefs.effects);
  $('effects').checked = prefs.effects;
  setWidth(prefs.width);
}
function setWidth(value) {
  prefs.width = constrainWidth(value);
  workArea.style.setProperty('--inspector-width', `${prefs.width}px`);
  drawer.style.setProperty('--drawer-size', `${prefs.width}px`);
  $('resize').setAttribute('aria-valuenow', prefs.width);
  $('resize').setAttribute('aria-valuetext', `${prefs.width} pixels`);
  if (!widthDirty) $('inspector-width').value = prefs.width;
  renderWidthDraft();
}
function placeInspector() {
  const focused = inspector.contains(document.activeElement) || document.activeElement === $('resize')
    ? document.activeElement : null;
  if (drawer.open) drawer.close();
  if (inspector.parentElement !== inspectorSlot) inspectorSlot.append(inspector);
  const docked = !narrow.matches && !prefs.collapsed;
  workArea.classList.toggle('details-docked', docked);
  if (docked) workArea.dataset.detailsEdge = drawerEdge({ sidesOnly:true });
  inspectorSlot.hidden = !docked;
  $('resize').hidden = !docked;
  $('show-details').setAttribute('aria-expanded', String(docked));
  if (narrow.matches) $('show-details').setAttribute('aria-haspopup', 'dialog');
  else $('show-details').removeAttribute('aria-haspopup');
  if (focused) (docked ? focused : $('show-details')).focus();
}
function openDetailsDrawer() {
  closeSettings(false);
  $('drawer-slot').append(inspector);
  workArea.classList.remove('details-docked');
  inspectorSlot.hidden = true;
  $('resize').hidden = true;
  $('show-details').setAttribute('aria-expanded', 'true');
  $('show-details').setAttribute('aria-haspopup', 'dialog');
  drawer.dataset.edge = drawerEdge();
  drawer.showModal();
}
function showDetails(trigger = $('show-details')) {
  detailsTrigger = trigger;
  if (narrow.matches) {
    if (!drawer.open) openDetailsDrawer();
  } else {
    prefs.collapsed = false;
    placeInspector();
    save();
  }
  $('close-details').focus();
}
$('show-details').addEventListener('click', () => {
  if ($('show-details').getAttribute('aria-expanded') === 'true') closeDetails();
  else showDetails();
});
$('close-details').addEventListener('click', () => closeDetails());
function closeDetails(restoreFocus = true) {
  if (drawer.open) {
    drawer.close();
  } else if (!inspectorSlot.hidden) {
    prefs.collapsed = true;
    save();
  } else return;
  placeInspector();
  if (restoreFocus) (detailsTrigger.isConnected ? detailsTrigger : $('show-details')).focus();
}
drawer.addEventListener('cancel', event => { event.preventDefault(); closeDetails(); });
function dismissDockedDetails(event) {
  if (event.key !== 'Escape' || drawer.open || inspectorSlot.hidden) return;
  event.preventDefault();
  closeDetails();
}
inspector.addEventListener('keydown', dismissDockedDetails);
$('resize').addEventListener('keydown', dismissDockedDetails);
narrow.addEventListener('change', () => {
  const focused = document.activeElement;
  if (narrow.matches && inspector.contains(focused)) {
    openDetailsDrawer();
    focused.focus();
  } else {
    if (!narrow.matches && drawer.open) {
      prefs.collapsed = false;
      save();
    }
    placeInspector();
  }
  if (settingsOpen) placeSettings();
});
window.addEventListener('resize', () => {
  if (drawer.open) drawer.dataset.edge = drawerEdge();
  if (settingsDialog.open) settingsDialog.dataset.edge = drawerEdge();
});

function renderWidthDraft() {
  $('apply-width').disabled = !widthDirty;
  $('cancel-width').disabled = !widthDirty;
  $('width-status').textContent = widthDirty
    ? `Unapplied draft. Workspace width is ${prefs.width} pixels.`
    : `Width matches the workspace (${prefs.width} pixels).`;
}
function clearWidthError() {
  $('inspector-width').removeAttribute('aria-invalid');
  $('width-error').hidden = true;
}
$('inspector-width').addEventListener('input', () => {
  // Once edited, a draft belongs to the user until explicit Apply or Cancel.
  widthDirty = true;
  clearWidthError();
  renderWidthDraft();
});
$('width-form').addEventListener('submit', event => {
  event.preventDefault();
  const field = $('inspector-width');
  const width = field.valueAsNumber;
  if (!field.validity.valid || !Number.isInteger(width) || width < 240 || width > 420) {
    field.setAttribute('aria-invalid', 'true');
    $('width-error').hidden = false;
    field.focus();
    return;
  }
  widthDirty = false;
  clearWidthError();
  // Move focus before disabling the button that may own it.
  field.focus();
  setWidth(width); save();
});
$('cancel-width').addEventListener('click', () => {
  widthDirty = false;
  clearWidthError();
  $('inspector-width').focus();
  setWidth(prefs.width);
});

function selectSettingsSection(section) {
  prefs.settingsSection = section;
  document.querySelectorAll('[data-section]').forEach(button => {
    const selected = button.dataset.section === section;
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
    $(`settings-${button.dataset.section}`).hidden = !selected;
  });
}
document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
  selectSettingsSection(button.dataset.section); save();
}));
function placeSettings() {
  const focused = settings.contains(document.activeElement) ? document.activeElement : null;
  if (settingsDialog.open) settingsDialog.close();
  $('settings-slot').append(settings);
  const canPin = pinFits.matches;
  const pinned = settingsOpen && prefs.settingsPinned && canPin;
  const modal = !pinned;
  document.querySelector('.app-shell').classList.toggle('settings-pinned', pinned);
  $('settings-slot').hidden = !settingsOpen || modal;
  $('pin-settings').disabled = !canPin;
  $('pin-settings').setAttribute('aria-pressed', String(prefs.settingsPinned));
  $('pin-settings').textContent = prefs.settingsPinned ? 'Unpin' : 'Pin';
  $('settings-mode').textContent = pinned ? 'Pinned beside your workspace.' : 'Settings drawer.';
  if (canPin && !pinned) $('settings-mode').textContent = 'Pin to reserve workspace space.';
  if (!canPin && prefs.settingsPinned) {
    $('settings-mode').textContent = 'Your pin preference resumes when the workspace is wider.';
  }
  $('show-settings').setAttribute('aria-expanded', String(settingsOpen));
  if (prefs.settingsPinned && canPin) $('show-settings').removeAttribute('aria-haspopup');
  else $('show-settings').setAttribute('aria-haspopup', 'dialog');
  if (settingsOpen && modal) {
    if (drawer.open) closeDetails(false);
    $('settings-modal-slot').append(settings);
    // Reset confirmation temporarily owns the modal layer.
    if (!$('reset-dialog').open) {
      if ($('command-palette').open) $('command-palette').close();
      settingsDialog.dataset.edge = drawerEdge();
      settingsDialog.showModal();
    }
  }
  if (focused && settingsOpen && !$('reset-dialog').open) {
    (focused.disabled ? $('close-settings') : focused).focus();
  }
}
function closeSettings(restoreFocus = true) {
  if (!settingsOpen) return;
  settingsOpen = false;
  placeSettings();
  if (restoreFocus) (settingsTrigger.isConnected ? settingsTrigger : $('show-settings')).focus();
}
$('show-settings').addEventListener('click', event => {
  settingsTrigger = event.currentTarget;
  settingsOpen = true;
  placeSettings();
  $('close-settings').focus();
});
$('close-settings').addEventListener('click', () => closeSettings());
settingsDialog.addEventListener('cancel', event => { event.preventDefault(); closeSettings(); });
settings.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !settingsDialog.open) {
    event.preventDefault(); closeSettings();
  }
});
$('pin-settings').addEventListener('click', () => {
  prefs.settingsPinned = !prefs.settingsPinned;
  placeSettings(); save();
});
pinFits.addEventListener('change', placeSettings);
for (const name of ['theme','accent','density','effects']) $(name).addEventListener('change', event => {
  prefs[name] = name === 'effects' ? event.target.checked : event.target.value;
  applyDisplay(); save();
});
const reset = $('reset-dialog');
$('reset-layout').addEventListener('click', () => {
  if (settingsDialog.open) settingsDialog.close();
  reset.returnValue = ''; reset.showModal();
});
reset.addEventListener('close', () => {
  if (reset.returnValue === 'reset') {
    prefs.width = defaults.width; prefs.collapsed = defaults.collapsed;
    applyDisplay(); placeInspector(); save();
  }
  placeSettings();
  $('reset-layout').focus();
});
let drag = null;
const separator = $('resize');
separator.addEventListener('pointerdown', event => {
  if (event.button !== 0 || narrow.matches) return;
  drag = {id:event.pointerId, x:event.clientX, width:prefs.width,
    direction:workArea.dataset.detailsEdge === 'left' ? 1 : -1};
  separator.setPointerCapture(event.pointerId); separator.focus(); event.preventDefault();
});
separator.addEventListener('pointermove', event => {
  if (drag && event.pointerId === drag.id) setWidth(drag.width + (event.clientX - drag.x) * drag.direction);
});
for (const type of ['pointerup','pointercancel','lostpointercapture']) separator.addEventListener(type, () => {
  if (drag) { drag = null; save(); }
});
separator.addEventListener('keydown', event => {
  const step = workArea.dataset.detailsEdge === 'left' ? 10 : -10;
  const values = {ArrowLeft:prefs.width - step, ArrowRight:prefs.width + step, Home:240, End:420};
  if (Object.hasOwn(values, event.key)) { event.preventDefault(); setWidth(values[event.key]); save(); }
});

function renderJob() {
  const focusedOperation = [$('pause'), $('cancel')].find(control => control === document.activeElement);
  const status = job.status[0].toUpperCase() + job.status.slice(1);
  const message = status + (['completed','cancelled'].includes(job.status) ? ' · No work running' : '');
  if ($('job-status').textContent !== message) $('job-status').textContent = message;
  $('job-status').classList.toggle('success', job.status === 'completed');
  $('job-progress').setAttribute('aria-valuenow', job.progress);
  $('job-progress').style.setProperty('--progress-value', job.progress);
  $('percentage').textContent = `${job.progress}%`;
  const active = ['running','paused'].includes(job.status);
  $('start').disabled = active;
  $('pause').disabled = !active;
  $('pause').querySelector('span').textContent = job.status === 'paused' ? 'Resume' : 'Pause';
  $('pause').querySelector('use').setAttribute('href', `icons.svg#${job.status === 'paused' ? 'play' : 'pause'}`);
  $('cancel').disabled = !active;
  if (focusedOperation?.disabled) $('start').focus();
  refreshCommands();
}
function dispatch(action) {
  job = transition(job, action);
  if (job.status === 'running' && timer === null) timer = setInterval(() => dispatch('tick'), 600);
  if (job.status !== 'running' && timer !== null) { clearInterval(timer); timer = null; }
  renderJob();
}
$('start').addEventListener('click', () => { dispatch('start'); $('pause').focus(); });
$('pause').addEventListener('click', () => dispatch(job.status === 'paused' ? 'resume' : 'pause'));
$('cancel').addEventListener('click', () => { dispatch('cancel'); $('start').focus(); });
addEventListener('pagehide', () => { if (timer !== null) { clearInterval(timer); timer = null; } });
addEventListener('pageshow', event => { if (event.persisted && job.status === 'running') dispatch('pause'); });
const tasks = [
  ['Review prototype','Avery','Check hierarchy, keyboard access, and readable task states before handoff.'],
  ['Validate assets','Morgan','Review original icon paths and record image provenance.'],
  ['Prepare handoff','Jules','Record what was tested and which runtime checks remain.']
];
document.querySelectorAll('[data-task]').forEach(button => button.addEventListener('click', () => {
  const [title,owner,description] = tasks[Number(button.dataset.task)];
  $('task-title').textContent = title; $('task-owner').textContent = owner; $('task-description').textContent = description;
  document.querySelectorAll('[data-task]').forEach(item => {
    const selected = item === button;
    item.setAttribute('aria-pressed', String(selected)); item.closest('tr').classList.toggle('selected', selected);
  });
  if (narrow.matches) showDetails(button);
}));
const recovery = {
  empty:['No tasks in this example','Create an example task to return to the populated workspace.','Create example task'],
  offline:['Offline example','Connection is simulated as unavailable. Nothing has been sent or saved to a server.','Retry simulated connection'],
  error:['Could not open example workspace','This is a demonstration error. Your current selection is preserved.','Retry example']
};
function showExample() {
  const value = $('example').value;
  $('validation-example').hidden = value !== 'normal'; $('recovery-example').hidden = value === 'normal';
  $('feedback').textContent = '';
  $('recovery-example').dataset.state = value;
  $('recovery-example').classList.toggle('tessel-grid', value === 'empty');
  if (value !== 'normal') {
    const [title,copy,action] = recovery[value];
    $('recovery-title').textContent = title; $('recovery-copy').textContent = copy; $('retry').textContent = action;
  }
}
$('example').addEventListener('change', showExample);
$('retry').addEventListener('click', () => {
  $('example').value = 'normal'; showExample();
  $('feedback').textContent = 'Example recovered locally. No network request was made.'; $('example').focus();
});
$('name-form').addEventListener('submit', event => {
  event.preventDefault(); const invalid = $('workspace-name').value.trim().length < 3;
  $('workspace-name').setAttribute('aria-invalid', String(invalid)); $('name-error').hidden = !invalid;
  $('feedback').textContent = invalid ? '' : 'Name is valid for this example. It is not saved.';
  if (invalid) $('workspace-name').focus();
});
const refreshCommands = installCommandPalette();
applyDisplay(); placeInspector(); selectSettingsSection(prefs.settingsSection); placeSettings(); renderJob();
