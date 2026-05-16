/**
 * ui.js — Модуль управления интерфейсом
 * Отвечает за вкладки, радио-кнопки, темы и отображение рекомендаций.
 */

/* Хранит последние рассчитанные рекомендации */
let lastRecs = [];

/* ================================================
   ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
   ================================================ */

function toggleTheme() {
  const html    = document.documentElement;
  const icon    = document.getElementById('themeIcon');
  const label   = document.getElementById('themeLabel');
  const current = html.getAttribute('data-theme');

  if (current === 'dark') {
    html.setAttribute('data-theme', 'light');
    icon.textContent  = '🌙';
    label.textContent = 'Тёмная';
    localStorage.setItem('wm_theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.textContent  = '☀️';
    label.textContent = 'Светлая';
    localStorage.setItem('wm_theme', 'dark');
  }
}

/* Восстановить тему при загрузке страницы */
(function applySavedTheme() {
  const saved = localStorage.getItem('wm_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('themeIcon').textContent  = '🌙';
      document.getElementById('themeLabel').textContent = 'Тёмная';
    });
  }
})();

/* ================================================
   ПЕРЕКЛЮЧЕНИЕ ГЛАВНЫХ ВКЛАДОК
   ================================================ */

function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  tabs[0].classList.toggle('active', tab === 'imt');
  tabs[1].classList.toggle('active', tab === 'calories');

  document.getElementById('tabImt').classList.toggle('hidden', tab !== 'imt');
  document.getElementById('tabCalories').classList.toggle('hidden', tab !== 'calories');
}

/* ================================================
   РАДИО-КНОПКИ (обычные и карточки телосложения)
   ================================================ */

function selectRadio(el) {
  const group = el.dataset.group;
  document.querySelectorAll('[data-group="' + group + '"]').forEach(function (btn) {
    btn.classList.remove('selected');
  });
  el.classList.add('selected');
}

function getRadioValue(group) {
  const el = document.querySelector('[data-group="' + group + '"].selected');
  return el ? el.dataset.value : null;
}

/* ================================================
   ОТОБРАЖЕНИЕ / СКРЫТИЕ РЕКОМЕНДАЦИЙ
   ================================================ */

function updateRecsVisibility() {
  const locked  = document.getElementById('recsLocked');
  const visible = document.getElementById('recsVisible');
  const badge   = document.getElementById('recsBadge');

  if (!locked || !visible) return;

  if (currentUser && lastRecs.length > 0) {
    /* Пользователь вошёл И расчёт выполнен */
    locked.classList.add('hidden');
    visible.classList.remove('hidden');
    visible.innerHTML = lastRecs.map(function (r) {
      return (
        '<div class="rec-item">' +
          '<div class="rec-icon">' + r.icon + '</div>' +
          '<div class="rec-text">' +
            '<strong>' + r.title + '</strong>' +
            r.text +
          '</div>' +
        '</div>'
      );
    }).join('');
    badge.textContent = '✓ Доступно';
    badge.classList.remove('locked');
    badge.classList.add('free');

  } else if (currentUser) {
    /* Вошёл, но расчёт ещё не выполнен */
    locked.classList.add('hidden');
    visible.classList.remove('hidden');
    visible.innerHTML = '<p style="color:var(--muted);font-size:14px;padding:16px 0;">Нажмите «Рассчитать ИМТ», чтобы увидеть рекомендации.</p>';
    badge.textContent = '✓ Доступно';
    badge.classList.remove('locked');
    badge.classList.add('free');

  } else {
    /* Не авторизован */
    locked.classList.remove('hidden');
    visible.classList.add('hidden');
    badge.textContent = '🔒 Требуется вход';
    badge.classList.add('locked');
    badge.classList.remove('free');
  }
}
