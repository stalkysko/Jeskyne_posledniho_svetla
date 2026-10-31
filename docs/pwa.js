// GitHub Pages build: registrace vlastní offline cache bez externích služeb.
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js', {scope:'./'});
      await navigator.serviceWorker.ready;
      const status = document.getElementById('startup');
      if (status) status.textContent = 'Hraješ webovou klasiku V11.7. Hra je uložená pro další spuštění i bez připojení (dokud prohlížeč ponechá offline soubory).';
    } catch (err) {
      // Chyba offline cache nesmí přerušit vlastní hru.
      console.warn('Offline cache není k dispozici:', err);
    }
  });
}
