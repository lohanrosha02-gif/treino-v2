/* Preferência visual independente dos registros de treino. Carregado antes do CSS para evitar piscar o tema errado. */
(function () {
  'use strict';
  var KEY = 'meu-treino-tema-v1';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var choice = null;
  try { choice = window.localStorage.getItem(KEY); } catch (error) { /* Navegação privada/bloqueio de armazenamento. */ }
  if (choice !== 'light' && choice !== 'dark') choice = null;
  var theme = choice || (media && media.matches ? 'dark' : 'light');

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    var bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute('content', theme === 'dark' ? '#000000' : '#f6f7f3');
    var button = document.getElementById('themeToggle');
    if (!button) return;
    var label = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    var visibleLabel = document.getElementById('themeToggleText');
    if (visibleLabel) visibleLabel.textContent = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
  }

  applyTheme();
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    var button = document.getElementById('themeToggle');
    if (!button) return;
    button.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      choice = theme;
      try { window.localStorage.setItem(KEY, choice); } catch (error) { /* O botão continua funcionando na sessão atual. */ }
      applyTheme();
    });
  });

  // Segue o sistema enquanto o usuário não escolhe um tema manualmente.
  if (media) {
    var onSystemChange = function (event) {
      if (choice !== null) return;
      theme = event.matches ? 'dark' : 'light';
      applyTheme();
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }
})();
