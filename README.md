# Jeskyně posledního světla

Česká grafická textová adventura s malovanou VGA grafikou, volným psaním příkazů, rozhovory s havranem a ledovým čarodějem a volitelným CRT efektem.

**Aktuální vydání:** `0.11.8.20` (2. listopadu 2026) — přepsané havranovy odpovědi o jeho poslání, čekání a životě u rozcestí. Jeho rozhovor s rytířem přímo naplňuje slib hvězdáři; jídlo hledá jen poblíž a i za letu hlídá cestu. Drobné podrobnosti se odhalují v mnoha odlišných odpovědích, nikdy jako jediný seznam. Obsahuje veškeré předchozí herní, mobilní a zvukové opravy.

**Grafická oprava:** Scéna před mlýnem používá nový obrázek `assets/mlyn_zavreny_v11814.png`, v němž má pracovní stůl nohy dosedající do sněhu. Bedýnka už není součástí pozadí: kreslí se pouze jednou, na zasněženou zem pod stolem, a nadále mění vzhled po rozbití. Původní obrázek zůstává zachovaný.

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

## Poznámka k projektu

Repozitář neobsahuje závislosti vyžadující instalaci. Autor projektu může samostatně stanovit licenci; v tomto balíčku žádná licence k dalšímu šíření udělena není.
