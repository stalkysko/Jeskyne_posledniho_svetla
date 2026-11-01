# Jeskyně posledního světla

Česká grafická textová adventura s malovanou VGA grafikou, volným psaním příkazů, rozhovory s havranem a ledovým čarodějem a volitelným CRT efektem.

**Aktuální vydání:** `0.11.8.13` (1. listopadu 2026) — obsahuje také opravu věžních dveří: sluneční mosazný zámek bez vnitřní závory.

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
- `assets/` — původní grafické podklady; žádné obrázky nejsou nahrazené.
- `CTI_ME.txt` — historie oprav a spuštění na Windows.
- `SLOVNIK_A_PRIKLADY.txt` — příklady interakcí v češtině.
- `MOBILE_NAVOD.txt` — návod pro mobilní použití.

**Pozor:** Toto je kompletní verze, nikoli patch. Při aktualizaci existujícího repozitáře zachovej případné vlastní soubory, které do hry nepatří, a nahraj nové herní soubory se stejnými názvy.

## Poznámka k projektu

Repozitář neobsahuje závislosti vyžadující instalaci. Autor projektu může samostatně stanovit licenci; v tomto balíčku žádná licence k dalšímu šíření udělena není.
