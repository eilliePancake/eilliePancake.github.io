let lang = 'en';

const toggle = document.getElementById('langToggle');

toggle.addEventListener('click', () => {
  lang = lang === 'en' ? 'zh' : 'en';
  toggle.textContent = lang === 'en' ? '中文' : 'EN';
  document.documentElement.lang = lang;
  applyLang();
  document.dispatchEvent(new Event('langChanged'));
});

function applyLang() {
  // Plain text nodes
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });

  // <li> items with data attrs (skills list)
  document.querySelectorAll('li[data-en][data-zh]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
}
