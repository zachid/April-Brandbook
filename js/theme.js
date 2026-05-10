(function () {
  'use strict';

  const STORAGE_KEY = 'brandbook-theme';

  const THEMES = {
    dark:  { label: 'Dark',  icon: '◐' },
    light: { label: 'Light', icon: '○' },
    swiss: { label: 'Swiss', icon: '▣' },
  };

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'swiss';
  }

  function applyTheme(theme) {
    document.body.classList.remove('light', 'swiss');
    if (theme === 'light') document.body.classList.add('light');
    if (theme === 'swiss') document.body.classList.add('swiss');

    localStorage.setItem(STORAGE_KEY, theme);

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  function injectSwitcher() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = Object.entries(THEMES).map(([key, val]) => `
      <button class="theme-btn" data-theme="${key}" title="${val.label} mode">
        <span class="theme-btn-icon">${val.icon}</span>
        ${val.label}
      </button>
    `).join('');

    sidebar.appendChild(switcher);

    switcher.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });
  }

  function init() {
    injectSwitcher();
    applyTheme(getTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
