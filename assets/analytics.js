/* Regarder l’Art — statistiques privées. Google Analytics avec consentement préalable. */
(function () {
  'use strict';
  const measurementId = 'G-WGG4K867X7';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
  const storageKey = 'regarder-art-statistiques-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let loaded = false;
  let currentChoice = null;
  function readChoice() {
    try {
      const item = JSON.parse(localStorage.getItem(storageKey));
      if (item && ['accepted', 'refused'].includes(item.choice) && Number.isFinite(item.time) && Date.now() >= item.time && Date.now() - item.time < maxAge) return item.choice;
    } catch (_) {}
    return null;
  }
  function loadAnalytics() {
    window['ga-disable-' + measurementId] = false;
    if (loaded) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 15552000 });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }
  function clearAnalyticsCookies() {
    const domains = ['', location.hostname];
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (cookie) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function saveChoice(choice) {
    currentChoice = choice;
    try { localStorage.setItem(storageKey, JSON.stringify({ choice: choice, time: Date.now() })); } catch (_) {}
    if (choice === 'accepted') loadAnalytics();
    else {
      window['ga-disable-' + measurementId] = true;
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearAnalyticsCookies();
    }
  }
  function init() {
    currentChoice = readChoice();
    const style = document.createElement('style');
    style.textContent = '#ra-stat-choice{position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;max-width:660px;margin:auto;padding:20px;background:#fff;color:#23252a;border:1px solid #d8e0e6;border-radius:12px;box-shadow:0 8px 35px #173c6330;font:14px/1.6 Tahoma,Arial,sans-serif}#ra-stat-choice[hidden]{display:none}#ra-stat-choice h2{font:22px/1.3 Georgia,serif;color:#173c63;margin:0 0 8px}#ra-stat-choice p{margin:8px 0 14px}#ra-stat-choice .ra-stat-actions{display:flex;gap:10px;flex-wrap:wrap}#ra-stat-choice button,#ra-stat-settings{font:14px Tahoma,Arial,sans-serif;border:1px solid #173c63;color:#173c63;background:#fff;border-radius:6px;padding:11px 15px;min-height:44px;cursor:pointer}#ra-stat-choice button:focus-visible,#ra-stat-settings:focus-visible{outline:3px solid #98643d;outline-offset:3px}#ra-stat-settings{display:block;margin:20px auto;max-width:calc(100% - 32px)}';
    document.head.appendChild(style);
    const panel = document.createElement('section');
    panel.id = 'ra-stat-choice';
    panel.setAttribute('aria-labelledby', 'ra-stat-heading');
    panel.innerHTML = '<h2 id="ra-stat-heading">Statistiques de fréquentation</h2><p>Acceptez-vous les cookies de Google Analytics pour mesurer les visites, les pages consultées et la provenance des visites ? Ces statistiques sont réservées à l’auteur du site. Vous pouvez refuser et changer votre choix à tout moment. <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">Confidentialité chez Google</a>.</p><div class="ra-stat-actions"><button type="button" data-choice="refused">Refuser</button><button type="button" data-choice="accepted">Accepter</button></div>';
    panel.hidden = currentChoice !== null;
    const settings = document.createElement('button');
    settings.id = 'ra-stat-settings';
    settings.type = 'button';
    settings.textContent = 'Préférences de statistiques';
    settings.setAttribute('aria-controls', panel.id);
    settings.setAttribute('aria-expanded', String(!panel.hidden));
    settings.addEventListener('click', function () { panel.hidden = !panel.hidden; settings.setAttribute('aria-expanded', String(!panel.hidden)); if (!panel.hidden) panel.querySelector('button').focus(); });
    panel.querySelectorAll('[data-choice]').forEach(function (button) {
      button.addEventListener('click', function () { saveChoice(button.dataset.choice); panel.hidden = true; settings.setAttribute('aria-expanded', 'false'); settings.focus(); });
    });
    document.body.appendChild(settings);
    document.body.appendChild(panel);
    if (currentChoice === 'accepted') loadAnalytics();
    else window['ga-disable-' + measurementId] = true;
    window.addEventListener('storage', function (event) {
      if (event.key !== storageKey) return;
      currentChoice = readChoice();
      if (currentChoice === 'accepted') loadAnalytics();
      else { window['ga-disable-' + measurementId] = true; if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' }); clearAnalyticsCookies(); }
      panel.hidden = currentChoice !== null;
      settings.setAttribute('aria-expanded', String(!panel.hidden));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
