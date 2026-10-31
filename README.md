# Jeskyně posledního světla · V11.7 — GitHub Pages

Klasická česká textová adventura s ručně kreslenou VGA grafikou. Obsahuje
rozšířené rozhovory s havranem, paměť vztahu, sedm lokací, hudbu, zvuky,
mapu a uložení rozehrané hry. Bez Ollamy, bez serverové AI a bez backendu.

**Novinky V11.7:** Přirozenější návazné otázky havranovi, zachovaná věta
o slibu lehkém jako pírko, příležitostné samovolné promluvy, blikající
retro šipka v příkazovém řádku a více než padesát drobných interakcí
napříč sedmi původními lokacemi. V jedné z nich je ukryt nepovinný
předmět, o kterém hra nepodává nápovědy. Dveře mlýna reagují na zásah
mečem, byť zůstávají neprůchozí. Stav některých změn se ukládá.
V11.6: Havran navazuje na nabídku pomoci i otázky o přátelství
s hvězdářem. Rozumí větám „co mám udělat?“, „kdo ti řekl, že tu musíš
zůstat?“, „byl tvůj přítel?“, „jste přátelé?“ a „mám hvězdáře najít?“.
Rozšířená pravidla pokrývají i překlep „chceš abch hvězdáře našel?“.
Uložené pozice z V11.5 a V11.6 jsou kompatibilní.

**Tento balík je připraven k publikaci na GitHub Pages.** Hratelné soubory
jsou ve složce `docs/`. Není potřeba nic programovat ani sestavovat.

## Nejjednodušší zveřejnění přes GitHub Desktop

1. Rozbal ZIP do vlastní složky na PC.
2. Otevři **GitHub Desktop → File → Add local repository** a vyber
   rozbalenou složku hry. Protože ještě nejde o Git repozitář, vyber
   nabízenou možnost **Create a repository here**.
3. Vytvoř místní repozitář a zkontroluj, že obsahuje složku `docs/`.
   Pokud aplikace nabídne první commit, potvrď ho.
4. Stiskni **Publish repository**. Zadej název
   `jeskyne-posledniho-svetla` a **vypni Keep this code private**, chceš-li
   hru zveřejnit zdarma přes GitHub Pages. Repozitář se tím vytvoří na
   GitHubu; **předem ho na webu nezakládej**.
5. Otevři repozitář na GitHubu → **Settings → Pages**.
6. V **Build and deployment** nastav:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/docs`
   - Potvrď **Save**.
7. Po dokončení publikace otevři adresu ve tvaru:
   `https://TVE_UZIVATELSKE_JMENO.github.io/jeskyne-posledniho-svetla/`

GitHub ve skutečnosti ukáže hotový odkaz přímo na stránce Settings → Pages.
Jméno účtu a název repozitáře v příkladu musíš nahradit svými.

## Příkazový postup (Git)

Po rozbalení otevři terminál **uvnitř kořenové složky tohoto balíku**.
Pro tuto alternativu na [GitHub.com](https://github.com/new) nejprve založ
**prázdný repozitář**, bez automatického README a dalších souborů.

```powershell
git init
git add .
git commit -m "Jeskyně posledního světla V11.7 pro GitHub Pages"
git branch -M main
git remote add origin https://github.com/TVUJ_UCET/jeskyne-posledniho-svetla.git
git push -u origin main
```

Změň `TVUJ_UCET` na své uživatelské jméno. GitHub se může zeptat na
přihlášení. Poté zapni Pages jako v bodech 5–7 výše.

## iPhone a Android

- Otevři zveřejněnou adresu hry v Safari nebo Chrome.
- Na iPhonu: **Safari → Sdílet → Přidat na plochu**.
- Na Androidu: **Chrome → nabídka → Instalovat aplikaci / Přidat na
  plochu** (podle nabídky konkrétního zařízení).
- Hra podporuje dotykové směry, velká tlačítka a české příkazy.
- Veřejná HTTPS verze zkouší po prvním úplném načtení uložit soubory
  hry pro pozdější hraní bez sítě. V prohlížeči může být offline cache
  později odstraněna, proto není garantovaná navždy.
- Uložené pozice a vztah s havranem se drží v úložišti daného prohlížeče.
  Pro přesun mezi PC a iPhonem použij herní **ULOŽIT / NAČÍST** (JSON).

## Co je veřejné

GitHub Pages publikuje statické soubory hry na internetu. Každý, kdo zná
odkaz, ji může otevřít. **Neukládej do repozitáře hesla, tokeny, osobní
uložené pozice ani jiné soukromé soubory.** Tento balík nic takového
neobsahuje. Nejde o nativní aplikaci `.ipa` nebo `.apk`.

## Struktura

```text
README.md                tento návod
docs/
  index.html             vstupní stránka GitHub Pages
  HRA.html               hlavní hra
  hra.js, hra.css        logika a rozhraní
  prostor_v117.js       vedlejší interakce a skryté objevy
  havran_*.js            autorské dialogy a vztah
  jazyk.js, reakce.js    parser
  mapa.js, zvuk.js       mapa a původní hudba
  assets/                ručně malované grafické podklady
  manifest.webmanifest   metadata pro ikonu na ploše
  icon.svg               ikona
  pwa.js, sw.js          ukládání statických souborů pro offline použití
  .nojekyll              vypnutí Jekyll transformací
```

Všechny cesty k souborům jsou relativní: hra funguje i v podadresáři
`/jmeno-repozitare/`, jaký používá GitHub Pages.

## Aktualizace hry

Při další verzi nahraď soubory ve `docs/` a pusť nový commit. Pokud by
telefon ukazoval staré soubory, otevři stránku při připojení k internetu
a načti ji znovu; offline cache bude používat nové číslo verze.
