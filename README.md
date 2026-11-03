# Jeskyně posledního světla

Česká grafická textová adventura s malovanou VGA grafikou, volným psaním příkazů, rozhovory s havranem a ledovým čarodějem a volitelným CRT efektem.

**Aktuální vydání:** `0.11.8.27` (3. listopadu 2026) — **porozumění otázkám na historii právě popsaného místa**. Na úplném základu 0.11.8.26 přidává samostatné rozpoznávání otázek typu „Co se tu stalo?“ a „Co se tu odehrálo?“ pro všech sedm lokací. Nejde o univerzální repliku: každá odpověď se odvozuje z konkrétních viditelných stop a známých faktů. Následné dotazy „A kdo tu byl?“, „Kdy?“, „Proč?“ nebo „Jak to víš?“ udržují význam pouze po skutečném rozhovoru o daném místě. Kánon postav a logika hádanek zůstávají.

**Co zůstává z verze 26:** Samostatné významové rozpoznávání vzpomínek na předchozí konverzace, hovorových obměn, překlepů a odlišného slovosledu. Havran a čaroděj mají oddělené záznamy rozhovorů a pamatují si je i po opětovném načtení pozice.

**Paměť postav:** S rozhovory vzniká neviditelný záznam tématu, skutečného hráčova dotazu, odpovědi, nálady a vztahu. Zápisy zahrnují také cestu údolím, důležité nálezy a fyzické úkony. Když se hráč k otázce vrátí, může havran či čaroděj reagovat na opakování; při dalším setkání může havran připomenout předchozí rozhovor. Lze se ho také zeptat: „Pamatuješ si, o čem jsme mluvili?“ Neměnný kánon má přednost: hvězdář byl havranův přítel, havran dobrovolně dodržuje slib, nezná jistě podrobnosti jeho smrti a v bolestném rozhovoru nežertuje. Čaroděj si ponechává svou povahu a motivy. Původní dialogy, malovaná grafika, zvuk a mobilní rozhraní zůstávají.

**Vyzkoušej:** „Proč tu jsi?“ → „O čem jsme si spolu povídali posledně?“ → „O čem sjem si povídali minule?“ → „Co jsem se tě naposled ptal?“ → „Co jsi mi minule odpověděl?“ Přirozené varianty „Co sme posledně kecali?“ či „Kolikrát jsme spolu mluvili?“ vedou do stejné kroniky. U čaroděje zkus „Dokážeš mě zastavit?“ a po dalších otázkách „Pustíš mě dál?“. Odpověď zůstane v jeho charakteru a rozhovor **neotevře** průchod.

**Poznámka k rozsahu:** Jde o autorsky řízený offline svět s rozšířeným slovníkem, nikoli o generativní AI a libovolně simulovatelnou fyziku. Stopy menších zásahů jsou nyní zachyceny hlavně v textu a uloženém stavu; všechny nemají nové grafické varianty.

**Grafická oprava:** Scéna před mlýnem používá obrázek `assets/mlyn_zavreny_v11814.png`, v němž má pracovní stůl nohy dosedající do sněhu. Bedýnka je nezávislý malovaný sprite. V této verzi se kreslí menší a hlouběji pod deskou stolu; stav zavřená/rozbitá/prázdná se zobrazuje na shodném místě. Původní obrázek i sprite zůstávají zachované.

## Hrát v prohlížeči

Po zapnutí **GitHub Pages** se hra otevře přímo z adresy repozitáře. Soubor `index.html` automaticky spustí `HRA.html`.

### Zapnutí GitHub Pages

1. Nahraj všechny soubory z tohoto balíčku do **kořenové složky repozitáře**. Složku `assets` ponech pohromadě a nic nepřejmenovávej.
2. Na GitHubu otevři **Settings → Pages**.
3. V části **Build and deployment** nastav **Deploy from a branch** a vyber větev `main`, složku `/(root)`.
4. Po zveřejnění otevři adresu GitHub Pages zobrazenou na této stránce.

Hra běží jako statická stránka. Nepotřebuje serverovou část, databázi ani připojení k API.

## Spuštění bez internetu

Otevři `HRA.html` dvojklikem v počítači. Na mobilu je pohodlnější otevřít hru přes webové stránky GitHub Pages. Ukládání používá úložiště prohlížeče; ve hře je také možnost exportovat a znovu načíst uloženou pozici.

## Co je v balíčku

- `index.html` — vstup pro GitHub Pages.
- `HRA.html`, `hra.css`, `*.js` — samotná hra, parser a dialogy.
- `havran_kontext_v11814.js` — rozpoznávání návazných otázek a paměť dialogu.
- `havran_v116.js` — konverzační otevíráky, společenské reakce a paměť vztahu s havranem.
- `semantika_v11821.js` — nové rozpoznávání významu vět, kontextových zájmen, fyzických úkonů a postavy po závěru.
- `prostor_v117.js` a `zivy_svet_v11824.js` — vedlejší předměty, fyzikální profily a paměť zásahů.
- `denik_rozhovoru_v11824.js` — skrytá chronologie, témata, vztahový a emoční kontext, připomenutí rozhovorů.
- `pamet_souvislosti_v11826.js` — jednotné offline rozpoznávání variant rozhovorových vzpomínek a krátkých návazných otázek obou postav; nezasahuje do logiky hádanek.
- `pamet_mist_v11827.js` — konkrétní odpovědi na historii sedmi lokací, s navazujícími otázkami a zápisem skutečného pátrání do kroniky.
- `assets/` — původní grafické podklady; žádné obrázky nejsou nahrazené.
- `tests/` — ověřovací testy kontextových vět (volitelné pro vývojáře).
- `CTI_ME.txt` — historie oprav a spuštění na Windows.
- `SLOVNIK_A_PRIKLADY.txt` — příklady interakcí v češtině.
- `MOBILE_NAVOD.txt` — návod pro mobilní použití.

## Zvuk na iPhonu

Klepni na **TEST ZVUKU** — mají zaznít dva tóny, i když jsou hudba a ruchy vypnuté. Poté zapni hudbu a zvuk. Pokud Safari přehrávání přeruší, u zapnuté volby se zobrazí **OBNOVIT**. Pokud nezazní ani test, zesil hlasitost médií, zkus vypnout tichý režim a případně otevři hru v nové kartě. JavaScript nemůže s jistotou ověřit, zda reproduktor telefonu opravdu vydává zvuk.

## Celá obrazovka a psaní na mobilu

Tlačítko **CELÁ OBRAZOVKA** rozšíří hru na celý viditelný prostor. Na Androidu a podporovaných prohlížečích použije nativní fullscreen. iPhone Safari standardní fullscreen pro běžnou stránku nepodporuje: hra proto přejde na kompaktní zobrazení, ale lišty Safari nemůže sama odstranit. Bez lišt ji lze spustit přes **Safari → Sdílet → Přidat na plochu** a následné otevření ikony. Při otevření klávesnice hra skryje vedlejší ovládání, zmenší grafiku a udrží vstup i poslední zprávy nad klávesnicí. Po zavření klávesnice se rozložení obnoví. Pro návrat z herního režimu klepni na **UKONČIT REŽIM**.

**Pozor:** Toto je kompletní verze, nikoli patch. Při aktualizaci existujícího repozitáře zachovej případné vlastní soubory, které do hry nepatří, a nahraj nové herní soubory se stejnými názvy.

## Vývojářské ověření

V kořenové složce lze spustit všechny testovací soubory postupně: `for test in tests/*.cjs; do node "$test" || exit 1; done` (Bash) nebo jednotlivě `node tests/test_integrace_hry_v11821.cjs`, `node tests/test_pamet_souvislosti_v11826.cjs` a `node tests/test_zivy_svet_v11824.cjs`. Testy zahrnují doslovné hráčské přepisy, stovky obměn, živé interakce, starší uložené pozice a hlavní příběhové úkony. Jde o automatické kontroly parseru a stavů, nikoli o potvrzení vzhledu na konkrétním telefonu. Rozhovor nevyužívá online model, takže neomezenému množství českých vět nelze garantovat porozumění.

## Poznámka k projektu

Repozitář neobsahuje závislosti vyžadující instalaci. Autor projektu může samostatně stanovit licenci; v tomto balíčku žádná licence k dalšímu šíření udělena není.
