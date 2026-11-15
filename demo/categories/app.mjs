const theme = document.getElementById('theme');
const settingsKey = 'tessel.categories.theme';

try {
  const saved = localStorage.getItem(settingsKey);
  if (Array.from(theme.options).some(option => option.value === saved)) theme.value = saved;
} catch {}
document.documentElement.dataset.theme = theme.value;

theme.addEventListener('change', () => {
  document.documentElement.dataset.theme = theme.value;
  try { localStorage.setItem(settingsKey, theme.value); } catch {}
});
