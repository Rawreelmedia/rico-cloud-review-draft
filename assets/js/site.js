(() => {
  const allowedTrackingKeys = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'fbclid', 'msclkid'
  ];

  const current = new URL(window.location.href);
  const saved = new URLSearchParams(sessionStorage.getItem('ricoCloudTracking') || '');
  allowedTrackingKeys.forEach((key) => {
    const value = current.searchParams.get(key);
    if (value) saved.set(key, value);
  });
  sessionStorage.setItem('ricoCloudTracking', saved.toString());

  document.querySelectorAll('a[href]').forEach((link) => {
    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;
    const target = new URL(raw, window.location.origin);
    if (target.origin !== window.location.origin) return;
    saved.forEach((value, key) => target.searchParams.set(key, value));
    link.href = target.pathname + target.search + target.hash;
  });

  document.querySelectorAll('iframe[data-form-id]').forEach((frame) => {
    const target = new URL(frame.src);
    saved.forEach((value, key) => target.searchParams.set(key, value));
    target.searchParams.set('consent_url', window.location.href);
    target.searchParams.set('consent_user_agent', navigator.userAgent);
    target.searchParams.set('sms_consent_text_v', 'sms-consent-v1');
    frame.src = target.toString();
  });

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
