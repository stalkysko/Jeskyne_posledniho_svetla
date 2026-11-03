// V0.11.8.21 – dotyková obrazovka a klávesnice: bez zásahu do logiky hry.
// iPhone Safari nepodporuje Element.requestFullscreen pro běžné stránky.
// Proto používáme skutečný Fullscreen API tam, kde existuje, a jinde
// vlastní režim vyplňující celý viditelný viewport.
(function () {
  'use strict';

  function measure(layoutHeight, visibleHeight, offsetTop, baselineHeight, focused) {
    const h = Math.max(1, Math.floor(Number(visibleHeight) || Number(layoutHeight) || 1));
    const top = Math.max(0, Math.floor(Number(offsetTop) || 0));
    const baseline = Math.max(h, Number(baselineHeight) || h);
    const drop = Math.max(baseline - h, (Number(layoutHeight) || h) - h - top);
    return {height: h, top, keyboardOpen: Boolean(focused && drop > 110)};
  }

  // Malý čistý výpočet umožňuje testovat iOS/Android i bez telefonu.
  if (typeof globalThis !== 'undefined') globalThis.lastLightMobile11817 = {measure};
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;
  const main = document.querySelector('main');
  const field = document.getElementById('command');
  const output = document.getElementById('log');
  const full = document.getElementById('full');
  if (!main || !field || !output || !full) return;

  const mobileQuery = window.matchMedia?.('(pointer: coarse) and (max-width: 950px)');
  const isMobile = () => Boolean(mobileQuery?.matches);
  const viewport = window.visualViewport;
  let baselineHeight = viewport?.height || window.innerHeight;
  let immersive = false;
  let nativeFullscreen = false;
  let raf = 0;
  let noticeShown = false;

  function updateViewport() {
    raf = 0;
    if (!isMobile()) {
      body.classList.remove('mobile-keyboard-open');
      return;
    }
    const focused = document.activeElement === field;
    const vh = viewport?.height || window.innerHeight;
    // Po otočení přístroje / schování klávesnice se základ musí přepočítat.
    if (!focused) baselineHeight = vh;
    const m = measure(window.innerHeight, vh, viewport?.offsetTop || 0, baselineHeight, focused);
    root.style.setProperty('--mobile-visible-height', `${m.height}px`);
    root.style.setProperty('--mobile-visible-top', `${m.top}px`);
    const hadKeyboard = body.classList.contains('mobile-keyboard-open');
    body.classList.toggle('mobile-keyboard-open', m.keyboardOpen);
    if (m.keyboardOpen && !hadKeyboard) {
      requestAnimationFrame(() => { output.scrollTop = output.scrollHeight; });
    }
  }

  function scheduleViewport() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateViewport);
  }

  // Safari aktualizuje visualViewport až po animaci klávesnice; posloucháme
  // oba její typy událostí a několik krátkých okamžiků po získání fokusu.
  field.addEventListener('focus', () => {
    scheduleViewport();
    for (const delay of [100, 300, 650]) setTimeout(scheduleViewport, delay);
  });
  field.addEventListener('blur', () => {
    scheduleViewport();
    setTimeout(scheduleViewport, 350);
  });
  field.addEventListener('input', scheduleViewport);
  // Při návratu ze zamčené obrazovky iOS někdy ponechá starou výšku.
  window.addEventListener('pageshow', scheduleViewport);
  document.addEventListener('visibilitychange', scheduleViewport);
  viewport?.addEventListener('resize', scheduleViewport);
  viewport?.addEventListener('scroll', scheduleViewport);
  window.addEventListener('resize', scheduleViewport);
  window.addEventListener('orientationchange', () => {
    baselineHeight = 0;
    scheduleViewport();
    setTimeout(scheduleViewport, 550);
    setTimeout(scheduleViewport, 900);
  });

  function reflectFullscreen() {
    const active = immersive || Boolean(document.fullscreenElement);
    full.textContent = active ? 'UKONČIT REŽIM' : 'CELÁ OBRAZOVKA';
    full.setAttribute('aria-pressed', String(active));
    full.setAttribute('title', active ? 'Vrátit běžné zobrazení' : 'Zobrazit hru v celém dostupném prostoru');
  }

  function setImmersive(active) {
    immersive = Boolean(active);
    body.classList.toggle('mobile-immersive', immersive && isMobile());
    reflectFullscreen();
    scheduleViewport();
  }

  function showIPhoneAdvice() {
    const applePhone = /iPhone|iPod/i.test(navigator.userAgent);
    const standalone = Boolean(navigator.standalone || window.matchMedia?.('(display-mode: standalone)').matches);
    if (!applePhone || standalone || noticeShown) return;
    noticeShown = true;
    const dialog = document.getElementById('dialog');
    const title = document.getElementById('dialogTitle');
    const message = document.getElementById('dialogBody');
    if (!dialog || !title || !message || dialog.open || typeof dialog.showModal !== 'function') return;
    title.textContent = 'Celá obrazovka na iPhonu';
    message.textContent = 'Hra teď vyplňuje dostupnou obrazovku. Safari ale běžné webové hře nedovolí skrýt všechny své lišty. Pro hraní skutečně bez lišt otevři stránku v Safari, klepni na Sdílet → Přidat na plochu a potom spusť Jeskyni z ikony na ploše.\n\nToto nastavení neovlivní uložené pozice.';
    dialog.showModal();
  }

  full.onclick = async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) { /* lze ukončit i pseudo režim */ }
      nativeFullscreen = false;
      setImmersive(false);
      return;
    }
    if (immersive) {
      setImmersive(false);
      return;
    }
    if (typeof main.requestFullscreen === 'function' && document.fullscreenEnabled !== false) {
      try {
        // Musí být voláno přímo z kliku, před dalším await.
        await main.requestFullscreen({navigationUI: 'hide'});
        nativeFullscreen = true;
        setImmersive(true);
        return;
      } catch (_) { /* iOS / některé prohlížeče – viditelný fallback */ }
    }
    setImmersive(true);
    showIPhoneAdvice();
  };

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && nativeFullscreen) {
      nativeFullscreen = false;
      setImmersive(false);
    } else reflectFullscreen();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && immersive && !document.fullscreenElement) setImmersive(false);
  });

  reflectFullscreen();
  scheduleViewport();
})();
