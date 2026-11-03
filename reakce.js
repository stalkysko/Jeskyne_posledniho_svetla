// Ručně napsané alternativy. Žádný náhodný generátor odpovědí ani síťová služba.
// Každá varianta vychází ze skutečného místa a předmětu; stavové závislosti řeší hra.js.
globalThis.adventureReactions = {
  approach: {
    millDoor: [
      'Vystoupáš na zasněžené schody. Masivní fošny mlýnských dveří pevně dosedají do rámu. Na prahu leží čerstvá závěj.',
      'Přistoupíš až ke dveřím. V mrazu se fošny seschly a ve spárách je jinovatka. Když vezmeš za kliku, cítíš, že vrata něco pevně drží zevnitř.',
      'Opatrně dojdeš k prahu. Zevnitř není slyšet práci ani kroky; mlýn je už dlouho opuštěný.'
    ],
    table: [
      'Dojdeš až k pracovnímu stolu. Na prknech jsou zářezy, zaschlé kruhy od nádob a stopy po práci dávného majitele.',
      'Přistoupíš ke stolu a přejedeš rukou po hraně. Dřevo je drsné a ledově studené.',
      'Zastavíš se před deskou stolu. Z téhle vzdálenosti lze prohlédnout každou věc, která na ní leží.'
    ],
    scope: [
      'Přejdeš po popraskané dlažbě ke stativu dalekohledu. Mosazná trubice je namířená do prasklé kopule.',
      'Zastavíš se u okuláru. V kovu se odráží úzký proužek měsíčního svitu.',
      'Přistoupíš k dalekohledu. Stativ zůstává pevný, i když v kopuli skučí vítr.'
    ],
    tomb: [
      'Přistoupíš k sarkofágu. Výjevy na bocích znázorňují slunce, hvězdáře a dlouhou zimní noc.',
      'Kroky se rozléhají kryptou. U sarkofágu cítíš proud studeného vzduchu z jeho kamenných spár.',
      'Zastavíš se těsně u náhrobku. Kamenná deska je opracovaná s překvapivou přesností.'
    ],
    sun: [
      'Dojdeš ke slunečnímu kotouči. V úzkém držáku je místo pro optické sklo.',
      'Přistoupíš ke kotouči; na jeho obrubě rozeznáš drobné značky jednotlivých měsíců.',
      'Slabý paprsek dopadá těsně vedle dutiny. Pochopíš, že kotouč kdysi sloužil k uchovávání světla.'
    ],
    pillar: [
      'Opatrně se přiblížíš k pevnému pilíři, ale zastavíš se na bezpečné skále ještě před srázem.',
      'Dojdeš k místu, odkud vidíš hlavice obou pilířů. Na okraj propasti nevstupuješ.',
      'Na pevném podkladu prohlédneš kotevní kameny. Udrží víc než pouhý provaz.'
    ],
    wheel: [
      'Přiblížíš se k mlýnskému kolu. Voda pod ním stále teče, i když lopatky svírá led.',
      'U náhonu slyšíš temné klokotání. Na ramenou kola visí rampouchy.',
      'Zůstaneš na suchém břehu. Mezi kolo a zamrzlý žlab by bylo nebezpečné vstupovat.'
    ],
    book: [
      'Přejdeš ke stolu a nakloníš se nad hvězdářovým zápisníkem. Písmo je drobné, ale čitelné.',
      'Zastavíš se u rozevřených stránek. Na okraji je kresba kotouče a čočky.',
      'Přistoupíš k zápisníku a přidržíš stránku před větrem, který proudí kopulí.'
    ],
    raven: [
      'Přijdeš pod rozcestník. Havran tě bedlivě pozoruje a přeskakuje z nohy na nohu.',
      'Zastavíš se před cedulí; havran zakráká, jako by tě chtěl první oslovit.',
      'Přiblížíš se a havran ustoupí jen o jediný krok. Neodlétá.'
    ],
    door: [
      'Vystoupáš po schodech k věžním dveřím. Mosazné kování má tvar slunečních paprsků.',
      'Stojíš u věžního prahu. Ve dveřích je chladná železná klika a starý zámek.',
      'Přistoupíš k těžkým dveřím. Nikdo se z druhé strany neozývá.'
    ]
  },
  inspect: {
    rope: ['Kroucená konopná vlákna jsou zdravá. Hák má zpětný zub, který se při zatížení zakousne do kamene.', 'Na laně jsou uzly od zkušené ruky. Jeden konec se dá pohodlně uvázat k pilíři.', 'Když lano natáhneš mezi rukama, nevrže ani se netřepí. Hák je skutečně železný.'],
    oil: ['Uvnitř kovové nádobky je ještě dost lampového oleje. Víčko dobře těsní.', 'Tenký výtok olejničky je dělaný přesně na úzké hrdlo lucerny.', 'Na dně slyšíš šplouchání; není to voda, olej má charakteristickou vůni.'],
    lamp: ['Křesadlo je přivázané ke držadlu a na dně čeká suchý knot.', 'Skleněné tabulky lucerny jsou jen zakouřené, ne prasklé.', 'Za sklem lze rozeznat jemný knot. Před zapálením ho musí nasáknout olej.'],
    key: ['Na jedné straně je reliéf slunce, na druhé nezvyklé zuby podobné hvězdnému obrazci.', 'Mosazný klíč je těžký. Někdo jej nosil dlouho; hrany mají ohmataný lesk.', 'Oko klíče tvoří kruh s osmi paprsky. Stejný znak jsi viděl na věži.'],
    tomb: ['Na kameni jsou vyobrazené fáze slunce a hvězdy na zimní obloze.', 'Na víku jsou dvě mělké prohlubně, do nichž se dají zapřít ruce.', 'Sarkofág vytesali z jediného kusu světlého kamene. Pod ním je tmavší podstavec.'],
    scope: ['Pevný mosazný tubus drží v nastavitelném třmenu. Očnice je v úrovni tvých očí.', 'Na tubusu jsou vyryté drobné značky. Poslední směřuje k severní hvězdě.', 'Okulár je čistý a mechanismus ostření jde ztuha, ale lze jím pohnout.'],
    table: ['Na hranách stolu zůstaly stopy po noži, skvrny od oleje a kruhy od hrnků.', 'Mezi prkny jsou úzké mezery. Žádnou skrytou přihrádku nenajdeš.', 'Nohy stolu jsou zpevněné čepy. Pod deskou nic nevisí.'],
    wheel: ['Led obalil každý druhý dřevěný list. Kolo by se bez uvolnění náhonu poškodilo.', 'Těžký hřídel vede do zdi mlýna. Na jeho konci se už dlouho nic netočí.', 'Záblesky měsíce odhalují, jak silná je námraza na lopatkách.'],
    bridge: ['Stržená prkna zmizela do propasti. Kamenné pilíře a jejich kotevní hlavy však stojí.', 'Vítr píská mezi dvěma břehy. Staré závěsy mostu jsou vyrvané z dřeva.', 'Pod pravým pilířem jsou stopy po utrženém trámu. Nový most teď nepostavíš.'],
    sun: ['V kamenném kruhu je kovový držák. Na jeho vnitřní hraně se táhne sotva patrná kruhová stopa — místy hladká, jako by se tudy kdysi dotýkalo sklo.', 'Na vnitřním okraji jsou vyryté stupnice. Kotouč sleduje dráhu světla.', 'Nad dutinou zeje prázdné kruhové lůžko. Na hraně zůstalo několik nepatrných oděrek. Zbytek mechanismu je neporušený.'],
    book: ['Na straně je kresba optické čočky nad slunečním kotoučem. V okraji stojí: „Uchovat poslední paprsek.“', 'Hvězdář popisuje ledovou kletbu jako sílu, kterou zlomí prudké teplo.', 'Mezi výpočty je podtržená věta: „Teplo musí zasáhnout přímo jeho zdroj.“'],
    raven: ['Havran má stříbrně šedé peří na krku a starý kroužek se slunečním znakem.', 'V jednom oku se mu odráží měsíc. Na druhé straně zobáku je drobná jizva.', 'Střídavě tě pozoruje a čistý zobák otírá o dřevo rozcestníku.'],
    wizard: ['Příliš vysoký sloup jej chrání před mečem. Čtyři oči v modré tváři tě sledují každé jiným směrem.', 'Z jeho žezla stoupá studená záře. Když se pohne, led odpoví jemným zapraskáním.', 'Čaroděj nestojí pevně na zemi; sloup pod ním se v nepravidelných intervalech chvěje.'],
    millDoor: ['Těžká dubová vrata jsou zavřená a zevnitř zajištěná. Nikde nevidíš přístupný zámek.', 'Mezi fošnami není průhled. Sníh na prahu je neporušený.', 'Dveře drží železné pásy. Žádný klíčový otvor zvenku nemají; mlynář odešel.'],
    pillar: ['Pilíř má širokou hlavici s hranou, přes kterou se železný hák bezpečně zachytí.', 'Povrch je hrubý, ale kámen není rozpraskaný. Udrží napnuté lano.', 'Kotevní výčnělek je výš než okraj skály; hák by se dal přehodit.'],
    portal: ['Za vysokým otvorem se převaluje tma. Cesta vzhůru vede kolem čaroděje.', 'Kameny průchodu jsou hladké jako sklo, ale nesvítí. Hlídá je ledová magie.', 'Ze vzdáleného průchodu přichází zvláštní vítr. Tudy pokračuje příběh až po vítězství.']
  },
  // Reakce na méně obvyklé experimenty hráče. Nezasahují do logiky hádanek.
  // Výběr se střídá deterministicky; při stejných příkazech nevzniká náhodný nesmysl.
  situational: {
    millDoor: {
      knock: ['Zaklepeš třikrát. Za fošnami se nic nepohne; prázdný mlýn odpoví jen hlubokou ozvěnou.', 'Klepání se přenese do masivních pantů. Když přiložíš ucho ke dřevu, uslyšíš jen vodu v náhonu.', 'Zkusíš rytmus starého mlynářského klepání. Nikdo ti neotevře.'],
      shake: ['Uchopíš kliku oběma rukama. Ani se nehne; zevnitř ji blokuje závora.', 'Dveře se v rámu nepohnou. Vytřeseš jen drobné vločky ze zárubně.'],
      repair: ['Panty vypadají zdravě. Potíž není rozbitá konstrukce, nýbrž závora na nepřístupné straně.', 'Prohlédneš kování. K opravě není důvod; mlynář dveře záměrně zajistil.'],
      clean: ['Setřeš námrazu z kliky. Dřevo zůstane neprůhledné a dveře zavřené.', 'Pod sněhem jsou staré vyřezávané znaky mlýnského cechu. Vstup ti neotevřou.'],
      point: ['Ukážeš ke dveřím. Ano, vypadají lákavě; ale nejde o vstup, který by bylo možné otevřít.']
    },
    table: {
      knock: ['Poklepeš klouby na masivní desku. Zvuk je plný, bez dutiny či tajné zásuvky.', 'Prsty zkusíš okraje všech prken. Pod stolem nic cvaknutím neodpoví.'],
      shake: ['Zapřeš se do rohu. Stůl se jen nepatrně zachvěje; nohy jsou pevně spojené čepy.', 'Na desce se zachvějí drobné smítky, ale pod ní žádná skrytá věc nespadne.'],
      clean: ['Rukávem setřeš prach a jinovatku. Zjeví se staré zářezy od nože a kruhy po nádobách.', 'Odhrneš vrstvu nečistot. Je to obyčejný pracovní stůl, byť mu kdysi někdo věnoval hodně péče.'],
      count: ['Spočítáš čtyři pevné nohy stolu a několik širokých prken. Žádnou přihrádku nevidíš.'],
      repair: ['Čepy drží, deska je rovná. Stůl by další mrazivou noc vydržel i bez tvého zásahu.']
    },
    wheel: {
      knock: ['Poklepeš na led u loukotě. Zazní tupé klapnutí; mráz spojil dřevo s náhonem.', 'Zkusíš dřevěný paprsek. Kolo se ani neotočí, jen ti opadá trochu sněhu na rukavici.'],
      shake: ['Za jeden z paprsků zacloumáš. Kolo nepovolí a zpod ledu se ozve proudící voda.', 'Lopatky drží pevně v zamrzlé vodě. Další síla by spíš poškodila hřídel.'],
      clean: ['Oškrábneš námrazu z dostupné lopatky. Zbytek mechanismu zůstává sevřený ledem.', 'Z boku kola ometeš sníh. Na odhalení celého náhonu bys potřeboval dlouhé hodiny.'],
      count: ['Většinu lopatek pokrývá led. Z této strany je všechny ani nevidíš.'],
      point: ['Ukážeš na stojící kolo. Není to příčinou zimy, spíš jedna z jejích prvních obětí.']
    },
    rope: {
      count: ['Zkontroluješ konec s hákem a konec pro uzel. Konopné smyčky mají dostatečnou délku pro přechod.', 'Při přepočítávání smyček zjistíš, že lano není roztřepené ani na jediném místě.'],
      shake: ['Rozvineš jednu smyčku. Těžký hák cinkne o přezku na opasku.', 'Z lana setřeseš sníh; pevná vlákna zůstanou pružná.'],
      repair: ['Lano žádnou záplatu nepotřebuje. Zkontroluješ pouze uchycení železného háku.', 'Přejedeš prsty po opletení. Jediná oprava, kterou potřebuje, je dobrý uzel v pravou chvíli.'],
      weigh: ['V ruce váží víc než obyčejný provázek, ale na cestu ho bez potíží uneseš.']
    },
    bridge: {
      knock: ['Kamenný pilíř vrátí suchou ozvěnu. Staré prkno by se pod úderem rozpadlo.', 'Poklepeš na opěrnou zídku. Kámen je pevný navzdory větru a námraze.'],
      shake: ['Do zbytků mostu se neopíráš. Za zábradlím už čeká hluboká propast.', 'Přidržíš se bezpečné skály. Chvění cítíš jen od větru.'],
      clean: ['Ometený kámen odhalí starou drážku pro kotevní lano.', 'Seškrábneš námrazu z opěry a ucítíš pod ní drsný, pevný povrch.'],
      point: ['Ukážeš k protějšímu břehu. Cíl je jasný; teď potřebuješ bezpečnou cestu.']
    },
    pillar: {
      knock: ['Odklepneš led z hrany pilíře. Pod ním je zdrsněný kámen vhodný k zachycení háku.', 'Masivní opěra neznatelně zavibruje, ale nikde nevidíš prasklinu.'],
      shake: ['Pilíř nevyrveš; stojí na skále mnohem pevněji než tvoje boty.', 'Zapřeš se opatrně do boční strany. Kámen se ani nehne.'],
      clean: ['Očistíš hranu, aby se hák mohl zakousnout přímo do kamene.', 'Pod ledem je mělký zářez po starém laně. Lidé se tu kdysi jistili.']
    },
    sign: {
      shake: ['Na šipkách zavrže staré dřevo. Havran se na tebe pohoršeně podívá.', 'Roztřeseš ukazatel. Sníh padá z obou šipek, ale směry zůstávají stejné.'],
      clean: ['Ometeš nápis MLÝN a MOST. Teprve na rubu se ukáže skoro setřený sluneční znak.', 'Pod prstem se objeví zbytek starého nápisu. Dřevo pamatuje teplejší časy.'],
      count: ['Dvě hlavní šipky: jedna k mlýnu a druhá k mostu. Třetí je už dávno ulomená.']
    },
    raven: {
      count: ['Havran je jediný. Nakloní hlavu, jako by počítal zase tebe.', 'Počítat havraní peří by trvalo déle než cesta k mostu.'],
      point: ['Namíříš prst k havranovi. „Já tě taky vidím,“ odsekne pták.', 'Havran ucukne hlavou. „Ukazovat je snadné. Důležité je dojít.“'],
      weigh: ['Havran by se nejspíš zvážit nenechal. A i kdyby ano, nemáš váhu.']
    },
    tomb: {
      knock: ['Prsty zaklepeš na kamenné víko. Ozve se dutá, nízká rezonance.', 'Kryptou projde ozvěna. Hvězdář už ti odpovědět nemůže.'],
      clean: ['Ometeš prach z vyrytých hvězd. Mezi nimi objevíš sluneční kruh.', 'Přeleštíš reliéf na čelní straně; nevidíš v něm zámek, jen značky hvězdáře.'],
      shake: ['Sarkofág je příliš těžký. Má však víko s úchyty, které lze odsunout.', 'Zapřeš se do kamene. Tělem celého sarkofágu nepohneš.'],
      count: ['Ve výjevu jsou čtyři hvězdy a jedno slunce. Žádný číselný zámek tu nevidíš.']
    },
    book: {
      knock: ['Položíš prst na okraj papíru. Zápisník nepromluví, ale jeho stránky ano, když je přečteš.', 'Poklepání nadzvedne kousek starého prachu. Písmo zůstane čitelné.'],
      shake: ['Listy lehce zašustí. Mosazné těžítko je stále drží na stole.', 'Když stránku nadzvedneš, objeví se pokračování poznámek o čočce.'],
      clean: ['Opatrně odfoukneš šedý prach; inkoust pod ním zůstává ostrý.', 'Očistíš okraj stránky, ale staré písmo raději nevydrhneš.'],
      count: ['Zápisník má mnoho popsaných listů. Pro tebe jsou důležité hlavně nákresy optiky a kapsle.']
    },
    scope: {
      knock: ['Na mosaz poklepeš kloubem prstu. Tichý kovový tón se rozplyne v kopuli.', 'Stativ slabě zazvoní. Optické sklo uvnitř se ani nezachvěje.'],
      shake: ['Mosazný stativ drží připevněný ke kameni. Zkusíš ho jen zlehka a raději přestaneš.', 'Objímka vydrží jemné zachvění, ale na optické sklo je lepší dávat pozor.'],
      clean: ['Vyleštíš okulár měkkou částí pláště. Při pohledu skrz se musíš přiblížit až k němu.', 'Setřeš prach z okraje mosazné trubice. Značky hvězdáře se znovu lesknou.'],
      count: ['Jedna přední objímka a velký mosazný tubus. Přední čočku lze vyjmout.'],
      point: ['Ukážeš podél osy dalekohledu. Míří severně přes horské hřebeny, k podivné modré záři.']
    },
    sun: {
      knock: ['Na kamenném ciferníku zní poklep jako zvonění do tenké misky.', 'Paprsek se odráží od kovového držáku, ale rytmus klepání mechanismus nespustí.'],
      shake: ['Kotouč je pevně ukotvený. Je určen ke směrování světla, nikoli k přenášení.', 'Těžký podstavec se nepohne; uvnitř bys mohl poškodit křehkou ampuli.'],
      clean: ['Vytřeš sníh z kruhového držáku. Je v něm místo přesně pro optickou čočku.', 'Po odstranění jinovatky se na okraji objeví stupnice s osmi slunečními značkami.'],
      count: ['Osm rytých paprsků obklopuje jednu skleněnou dutinu.', 'Počítáš rysky po obvodu, ale žádná z nich není tajným tlačítkem.']
    },
    wizard: {
      count: ['Čaroděj je jeden. Čtyři velké oči v jeho tváři se na okamžik upřou přímo na tebe.', 'Jeden ledový sloup, jedno žezlo a velmi nepříjemný protivník.'],
      point: ['Namíříš na něj prst. „Konečně víš, kde stojím,“ zašeptá čaroděj.', 'Čaroděj se jen pousměje. Vysoko na sloupu je mimo dosah.'],
      knock: ['Na čaroděje z téhle výšky nedosáhneš, natož abys na něj zaklepal.']
    },
    ice: {
      knock: ['Led zazvoní jako tlusté sklo. Praskliny zůstanou jen na povrchu.', 'Zkusíš kloubem prstu okraj sloupu. Ruka tě okamžitě zabolí chladem.'],
      count: ['Sloup vyrůstá z ledové plošiny v jediném kusu. Problémem je jeho výška, ne počet.'],
      clean: ['Ometený led je ještě hladší. Vylézt po něm by bylo horší.']
    },
    pod: {
      count: ['V držáku je jediná skleněná kapsle, vytvořená pro uchování posledního paprsku.'],
      shake: ['Kapsle je křehká. Sevřeš prsty opatrněji, aby se teplo neuvolnilo předčasně.'],
      clean: ['Po skle přejedeš prstem. Uvnitř zavíří jantarově zlaté světlo.']
    }
  },
  ravenSocial: {
    thanks: [
      '„Není zač,“ zakráká havran. „A nezapomeň na cestu zpátky.“',
      'Havran se načepýří. „Slušný rytíř. To se hned pozná.“',
      '„To slovo jsem už dlouho neslyšel,“ odpoví tiše. „Hvězdář mi děkoval, když jsem mu nosil zprávy z údolí.“',
      'Havran skloní zobák. „Rada váží málo. Ale když ji člověk přijme, dokáže unést hodně.“',
      '„Nech si poděkování až na návrat,“ zakráká, ale v očích se mu mihne radost.',
      '„Prosím pěkně,“ odpoví s přehnanou důstojností. „A teď mi nespadni z mostu.“',
      '„Moc lidí se se mnou poslední dobou nebaví. Tvoje poděkování zahřálo aspoň něco.“',
      'Havran poskočí na ceduli blíž k tobě. „Jestli budeš vyprávět, že ti radil pták, požaduji pěkné jméno.“'
    ],
    hello: [
      '„Krá. Kam máš namířeno?“ ozve se z cedule.',
      'Havran kývne zobákem. „Dnes je na cestování pěkná zima.“',
      '„Ty zase?“ Havran se tváří přísně, ale posune se po ceduli blíž. „Tak povídej.“',
      '„Zdravím, rytíři. Rozcestník neodletěl a já také ne.“',
      '„Krá. Už jsem se bál, že s sebou mluví jen vítr.“'
    ],
    sorry: [
      'Havran potřese hlavou. „Dobrá. Hlavně mi nešlapej na ocas.“',
      '„Zapomenuto,“ odpoví havran. „Ale příště si rozmysli, kam saháš.“',
      '„Omluva je lehčí než kámen a někdy udělá větší práci,“ pronese havran.',
      'Havran chvíli mlčí, potom krátce kývne. „Dobrá. Půjdeme dál.“'
    ],
    bye: [
      '„Ať ti neuklouznou boty,“ rozloučí se havran.',
      'Havran roztáhne křídla. „Zase se stav.“',
      '„Sbohem zatím neříkej,“ zakráká. „Některé cesty mají dva směry.“',
      '„Dávej pozor na led. A jestli uslyšíš krákání, nejspíš jsem to já.“',
      'Havran se ukloní tak slavnostně, až z rozcestníku opadá sníh.'
    ],
    curse: [
      'Havran se zasměje: „To slovo znám. Most po něm ale nenaroste.“',
      '„Ulevilo se ti?“ zeptá se havran. „Tak teď zkus něco vymyslet.“',
      '„Hvězdář nadával jen na zamrzlé inkousty,“ prohodí pták. „Zkus být o trochu vynalézavější.“',
      'Havran nevinně zamrká. „Jestli potřebuješ, mohu ti na chvíli dělat nevděčné publikum.“'
    ]
  },
  ravenOpen: {
    feelings: [
      '„Trochu je mi zima,“ přizná havran. „Ale dokud se mohu hádat s poutníky, není to tak zlé.“',
      'Havran stáhne hlavu mezi ramena. „Od té doby, co tu chybí hvězdář, je mi spíš ticho než zima.“',
      '„Dnes lépe,“ odpoví. „Přišel někdo, kdo se mě ptá, jak mi je, a ne jen kudy vede cesta.“'
    ],
    friendship: [
      'Havran se na chvíli přestane tvářit důležitě. „Kamarád? O takové slovo se musí pečovat.“',
      '„Přátelství poznám podle toho, že se někdo vrátí i tehdy, když ode mě nic nepotřebuje.“',
      'Havran ti upřeně hledí do očí. „Možná bychom to mohli zkusit.“'
    ],
    waiting: [
      '„Čekám, protože jsem to slíbil,“ řekne havran. „Když hvězdář odešel naposledy, řekl: Zůstaň na cestě.“',
      '„Dny se počítají špatně, když je pořád stejná zima. Ale slíbil jsem, že neodletím.“',
      '„Nečekám na každého. Čekám na někoho, kdo se místo smíchu nad mluvícím ptákem zastaví a poslouchá.“'
    ],
    past: [
      '„Kdysi jsem žil na věži,“ začne havran. „Hvězdář mi nechával otevřené okno i za bouře.“',
      '„Bývalo tu jaro, vůně mouky a teplé kameny. Pamatuji si to lépe než leckterý člověk.“',
      '„Zápisník psal hvězdář, já mu připomínal, co zapomněl. Byla to dobrá dělba práce.“'
    ],
    return: [
      '„Samozřejmě že tě poznávám,“ zakráká havran. „Rytíře v tomhle počasí nepotkávám každý den.“',
      'Havran se ti ukloní. „Tak ses vrátil. To se mi líbí víc než všechny moje rady.“',
      '„Pamatuji si tě. A pamatuji si, že jsi ještě nedokončil svůj příběh.“'
    ],
    fear: [
      '„Bojím se,“ přizná havran nečekaně prostě. „Jen to neříkám tak hlasitě jako ostatní.“',
      '„Když v noci praskne led, slyším v tom kroky. Někdy raději ani neotáčím hlavu.“',
      '„Odvaha přece neznamená nemít strach. Znamená zůstat na rozcestníku, když jsi něco slíbil.“'
    ],
    future: [
      '„Až roztaje náhon, znovu uslyším mlýnské kolo,“ řekne havran. „Na to se těším.“',
      '„V létě si najdu nejvyšší strom a budu z něj vyprávět, že jsem znal rytíře, který se ptal ptáka na počasí.“',
      '„Snad budu moci znovu sedět na věži. Ale nejdřív se musí vrátit světlo.“'
    ]
  },
  ravenAfter: {
    feelings: [
      '„Jak mi je?“ Havran rozloží křídla do prvního teplejšího větru. „Asi... šťastně. To slovo jsem dlouho nepoužíval.“',
      '„Mám pořád trochu strach,“ přizná. „Ale tentokrát je to strach z toho, že dobré věci opravdu mohou začít.“',
      '„Teď už mi není ticho,“ odpoví a zaposlouchá se do kapek ze smrkových větví.'
    ],
    friendship: [
      '„Kamarádi?“ Havran natáhne krk. „Přátelé, rytíři. A slibuji, že budu nesnesitelně připomínat, kdo tě varoval před mostem.“',
      '„Vrátil ses,“ řekne prostě. „To je nejlepší odpověď, jakou jsi mi mohl dát.“',
      '„Až sem přijde další poutník, řeknu mu, že jsem jednoho rytíře znal. A on mi věřil.“'
    ],
    waiting: [
      '„Na hvězdáře už čekat nemusím,“ řekne tiše. „Slíbil jsem hlídat cestu, dokud se nevrátí světlo. A ono se vrátilo.“',
      '„Možná tu ještě chvíli zůstanu,“ přemýšlí. „Ne kvůli slibu. Kvůli tomu, že se mi tu s tebou dobře sedí.“',
      '„Teď mohu odletět,“ protáhne křídla. „Zvláštní, jak najednou nikam nepospíchám.“'
    ],
    fear: [
      '„Led už nepraská jako dřív,“ odpoví havran. „To, co slyšíš, jsou kapky. Takového zvuku se bát nemusím.“',
      '„Zítra se možná budu bát něčeho nového,“ krákne. „Ale to už bude obyčejný strach. S tím si poradím.“'
    ],
    future: [
      'Havran se podívá k mlýnu. „Nejdřív počkám, až se roztočí kolo. Chci znovu slyšet ten zvuk.“',
      '„Pak vyletím k věži,“ pokračuje. „Podívám se, jestli v pracovně hvězdáře ještě někde leží jeho brk.“',
      '„A potom? Potom začne něco nového. Tentokrát si to nenechám ujít.“'
    ],
    winter: [
      '„Čaroděj je pryč,“ řekne havran. „Cítil jsem, jak se vzduch změnil, ještě než jsem uslyšel první kapku.“',
      '„Pořád tu leží sníh. Ale už není vězením. Jen sněhem.“'
    ],
    journey: [
      '„Jestli se ptáš na cestu, dnes ti žádnou nepřikážu,“ řekne havran. „Můžeš jít, kam chceš.“',
      '„Předtím jsme potřebovali hrdinu. Teď bychom si zasloužili někoho, kdo se umí na chvíli posadit.“'
    ],
    return: [
      '„Poznávám tě,“ zakráká spokojeně. „A tentokrát nemám strach, že se nevrátíš.“',
      '„Jak bych mohl zapomenout? Celé údolí si tě bude pamatovat.“'
    ],
    sun: [
      '„Hvězdářův paprsek splnil, pro co ho schoval,“ řekne havran. „Kéž by to mohl vidět.“',
      '„Věděl, že světlo jednou někdo ponese dál. Nevím, jestli tušil, že to budeš ty.“'
    ]
  },
  ravenEvidence: {
    identity:'„Hvězdář se mnou mluvil celé roky. Neopakoval jsem jen slova; viděl jsem, co dělal, a některým věcem časem porozuměl.“',
    feelings:'„Když jsi tu sám tak dlouho, poznáš rozdíl mezi obyčejnou zimou a tichem, které po někom zůstane.“',
    friendship:'„Hvězdář se pro mě vracel i tehdy, když už ode mě žádnou zprávu nečekal. Tak jsem poznal, co je přítel.“',
    waiting:'„Byl jsem u toho, když mi řekl, abych zůstal. Poslední slib se neposuzuje podle toho, jak dlouho trvá.“',
    past:'„Žil jsem v jeho pracovně. Poznal bych ty kroky na schodech i se zavřenýma očima.“',
    return:'„Tvůj plášť, tvé kroky a ten meč jsem už jednou viděl. Jsem havran, ne zlatá rybka.“',
    fear:'„Slyšel jsem, jak v jediné noci zamrzal potok, kolo i stromy. Takový zvuk nezapomeneš.“',
    future:'„Nevím to jistě,“ připustí havran. „Ale pamatuji si, jak údolí vypadalo dřív. To je dost dobrý důvod doufat.“',
    crypt:'„Viděl jsem ho vstupovat do krypty se slunečním klíčem na krku. Později už ho nikdo neviděl vyjít.“',
    bridge:'„Přelétám nad tou propastí a znám každý pilíř. Na tvém místě bych věřil spíš kameni než starým prknům.“',
    light:'„Hvězdář si do lucerny naléval olej, když se chystal do krypty. Tohle jsem viděl z okna pracovny.“',
    winter:'„Viděl jsem první tři noci. Led se šířil od hor, nikoli od řeky. Něco ho muselo přivolat.“',
    sun:'„Přihlížel jsem, když hvězdář ukládal paprsek do kotouče. Bylo to ještě před tím, než noc pohltila údolí.“',
    mill:'„Sedával jsem na střeše mlýna. Mlynář si broukal při práci a přede mnou zavřel vrata poslední večer.“',
    food:'„Mám zobák, který si pamatuje každý drobek. Ale věř mi, že na olej chuť nemám.“',
    journey:'„Letěl jsem tudy stokrát. Tobě ale můj let nepomůže; potřebuješ pevnou cestu.“',
    weather:'„Znám tyto hory od prvního letu. Měsíc býval stejně jasný, ale vítr nikdy nenesl takový chlad.“',
    joke:'„Ten vtip jsem vymyslel sám,“ ohradí se havran. „Kdyby byl lepší, už by ho vyprávěl někdo jiný.“'
  },
  ravenWhy: {
    feelings:'„Protože někteří mlčí, když jsou smutní, a já jsem už mlčel příliš dlouho.“',
    friendship:'„Protože nechci, abys skončil jako lidé, kteří tudy šli před tebou. A protože se mi s tebou dobře mluví.“',
    waiting:'„Protože jsem to slíbil. Když někdo chybí, jeho poslední přání se stane těžším, ne lehčím.“',
    crypt:'„Hvězdář věděl, že klíč bude jednou potřeba. Nechtěl, aby padl do nesprávných rukou.“',
    winter:'„Čaroděj se bojí změny. A nejjistější způsob, jak zastavit změnu, je zamrazit celý svět.“',
    bridge:'„Protože stará prkna už neudrží ani sníh. Ale pilíře jsou stále pevné. Uvažuj jako zedník, ne jako pták.“',
    sun:'„Protože jednou přijde chvíle, kdy se nedá čekat na východ slunce. Hvězdář se na tu chvíli připravil.“',
    future:'„Protože i ten nejdelší mráz je jen část příběhu. Aspoň tomu chci věřit.“'
  },
  dialogue: {
    raven: {
      feelings: [
        '„Hvězdář mi kdysi říkal, že pták se nemusí stydět za samotu. Nevím, jestli tomu sám věřil.“',
        '„Ve mlýně bývalo teplo a vůně mouky. Teď mám jen peří, sníh a tenhle rozcestník.“',
        '„Vlastně je mi dobře, když tu s někým mluvím. Jen to nikomu neříkej.“',
        'Havran chvíli poslouchá vítr. „Že ses zeptal, to už je víc, než jsem čekal.“'
      ],
      friendship: [
        '„Hvězdář mě naučil, že přítel nemusí rozumět každému slovu. Stačí, když zůstane a poslouchá.“',
        '„Možná si myslíš, že ti jen radím cestu. Ale já chci, aby ses po ní také vrátil.“',
        '„Nebudu ti slibovat zázraky. Jsem malý havran, ale umím pamatovat a čekat.“',
        '„Jestli si na mě po všem vzpomeneš, budu vědět, že to nebyl jen sen v dlouhé zimě.“'
      ],
      waiting: [
        '„Ten slib jsem dal, když ještě nebyl sníh. Tehdy se mi zdál lehký jako pírko.“',
        '„Když všichni odešli, chtěl jsem letět za nimi. Ale hvězdář by pak nenašel nikoho, kdo by ukázal cestu.“',
        '„Každé ráno si říkám, že ještě chvíli vydržím. Jenže žádné opravdové ráno už dlouho nepřišlo.“',
        '„Dnes přišel rytíř. Třeba jsem nečekal nadarmo.“'
      ],
      past: [
        '„Hvězdář uměl naslouchat i mlčení. A když zapomněl jíst, kloval jsem mu do zápisníku.“',
        '„V jeho síni voněl prach, kov a staré knihy. V zimě mi ohříval vodu.“',
        '„Jednoho večera se vrátil z hor bledý. Tehdy poprvé řekl, že se bojí.“',
        '„Od té noci jsem ho už neviděl chodit po stezce. Jen hvězdy zůstaly stejné.“'
      ],
      return: [
        '„Máš na plášti víc sněhu než předtím. Takže jsi nebyl jen za rohem.“',
        '„Říkal jsem si, jestli se ještě ukážeš. Některé věci zkrátka nejde vědět předem.“',
        '„Ptáci mají dobrou paměť. A tvoje kroky na cestě už začínám poznávat.“',
        '„Až se vrátíš příště, možná ti už nebudu muset říkat, kudy vede most.“'
      ],
      fear: [
        '„Slyšel jsem čarodějův hlas jednou za úplňku. Dodnes se mi z něj ježí peří.“',
        '„Nejvíc se bojím, že světlo jednou zhasne a nikdo si nevzpomene, že tu bývalo léto.“',
        '„Teď už mám ale komu o zimě povědět. To je malá výhra.“',
        '„Když půjdeš do jeskyně, vezmi si s sebou něco víc než meč. A vrať se.“'
      ],
      future: [
        '„Kdyby se vrátilo jaro, chtěl bych zase slyšet děti smějící se u mlýna.“',
        '„Možná zůstanu tady. Někdo musí hlídat, aby se rozcestník neztratil pod sněhem.“',
        '„Hvězdář mi slíbil, že světlo si vždycky najde cestu. Chci zjistit, jestli měl pravdu.“',
        '„A jestli se to podaří, připravím si slavnostní zakrákání. Bez pochyb to bude hrozné.“'
      ],
      identity: [
        '„Od hvězdáře jsem pochytil, že i světlo se dá uchovat. V jeho pracovně zářilo sklo po západu slunce.“',
        '„Každý den mi četl z knihy. Netušil, že si všechno pamatuji. Nejvíc mluvil o zimní obloze.“',
        '„Když potok zamrzl uprostřed noci, hvězdář mě poslal na rozcestník. Čekám tu na někoho, kdo se vydá dál.“',
        '„Zpívajícího ptáka ze mě neuděláš. Ale průvodce? To snad ještě zvládnu.“',
        '„Hvězdář říkával, že dobré otázky jsou vzácnější než dobré odpovědi. Ptej se dál.“'
      ],
      crypt: [
        '„Když se hvězdář naposledy vracel z hory, klepaly se mu ruce. Klíč už ale z ruky nepustil.“',
        '„Pod věží jsou západní schody. Černé jako noc. Vezmi světlo, než tam sestoupíš.“',
        '„Znak na klíči není ozdoba. Stejný sluneční kruh uvidíš na věžním zámku.“',
        '„Myslím, že tušil, že jednou někdo otevře jeho hrob. Jinak by klíč ukryl mnohem lépe.“',
        '„O jeho smrti mi víc neříkej. S ním skončily i teplé večery pod střechou.“'
      ],
      bridge: [
        '„Z pevného břehu dobře uvidíš oba pilíře. Mezi nimi je místo, kde kdysi býval most.“',
        '„V mlýně visel dlouhý provaz s hákem. Člověk by ho musel dobře přivázat; já bych prostě přeletěl.“',
        '„Při zkoušení uzlu se opři zády o skálu. U samotné hrany nemáš co hledat.“',
        '„Z věže vede cesta ještě dál. Přechod si nech zajištěný, protože se budeš možná vracet.“',
        '„Kdybych měl ruce, ukázal bych ti uzel. Ale jsem havran; používám zobák a dobré rady.“'
      ],
      light: [
        '„Olej z mlýna původně sloužil k mazání stroje. Hvězdář si ho ale vždycky trochu bral do lucerny.“',
        '„Knot napij olejem dřív, než přiložíš jiskru. Jinak shoří jen konec nitě.“',
        '„Světlo není jen pro oči. Když ho zapálíš, tma v kryptě přestane skrývat, co je v ní.“',
        '„S rozsvícenou lucernou se v těch tunelech budeš cítit jako doma. Tedy pokud bys bydlel v hrobce.“',
        '„Světlo z lucerny je slabé. Světlo hvězdáře bylo mnohem podivnější.“'
      ],
      winter: [
        '„První noc zamrzl potok. Druhou noc voda u mlýna. Třetí už se nikdo neodvážil přes most.“',
        '„Čaroděj stojí nad cestou. Kolem žezla je mráz, na který zbroj ani meč nestačí.“',
        '„Nespleť si odvahu se zuřivostí. Ve výšce jeho sloupu ostří meče nic nesvede.“',
        '„Hvězdář mi jednou řekl: Led je pevný, dokud mu nedáš důvod změnit podobu.“',
        '„Až se slunce zase vrátí, poznám to první. Ptáci mají dobré hodiny.“'
      ],
      sun: [
        '„Hvězdář měl jednu čočku, kterou přemísťoval mezi dalekohledem a kamenným kotoučem.“',
        '„Do kotouče vložil pod sklo malou ampuli. Uměla schovat teplo na dobu, kdy ho nebude dost.“',
        '„Paprsek musí projít čočkou. Prázdný držák sám nic nenabije.“',
        '„Přečti si zápisník v jeho pracovně. Nakreslil tam pořadí všech částí.“',
        '„V noci se těžko hledá slunce. Poslední paprsek už ale hvězdář pro někoho zachytil.“'
      ],
      mill: [
        '„Mlynář nebyl zbabělec. Dokud voda tekla, dělil se o mouku s celým údolím.“',
        '„Dveře zavřel zevnitř a odešel zadní cestou, když se hladina náhonu začala měnit v led.“',
        '„Pracovní stůl nechal venku. Lucerna, olej a lano patřily každému, kdo potřeboval přejít hory.“',
        '„Kolo stojí pořád stejně. Nemusíš ho rozbíjet; zimu jím nezastavíš.“',
        '„Na starém mlýně není nic tajemného. Tajemná je zima, která ho umlčela.“'
      ],
      food: [
        '„Hvězdář míval suchý chléb v kapse. Drobenku mi nasypal na schod a dělal, že si toho nevšiml.“',
        '„Ne, skutečně nemám chuť na lampový olej. Ani kdybys ho podával v krásné misce.“',
        '„Mám rád ořechy. Ale od tebe teď raději vezmu dobrý příběh.“',
        '„Až se vrátí jaro, najdu si něco, co nemusím dobývat ze zmrzlé země.“'
      ],
      journey: [
        '„Na západě je mlýn s výbavou. Na severu stržený most. Věž čeká za ním.“',
        '„Když tudy šel hvězdář, vždycky se nejdřív rozhlédl. Pak teprve udělal další krok.“',
        '„Nechci ti vyřešit celou cestu. Ale kdykoliv se ztratíš, zeptej se, co jsem viděl.“',
        '„Zvláštní, že? Já umím létat, a přesto čekám. Ty musíš chodit, a stejně se dostaneš dál.“',
        '„Nemusíš spěchat. Čaroděj bude na konci cesty čekat ještě pěkně dlouho.“'
      ],
      weather: [
        '„Měsíc je dnes ostrý jako čepel. Ale vítr vane z hor, ne z obyčejných zimních mraků.“',
        '„Sněží nepravidelně, jako by někdo nahoře otvíral a zavíral velké dveře.“',
        '„U mlýna zůstává pod ledem voda. To znamená, že zem ještě není mrtvá.“',
        '„I zvuk v tomhle mrazu cestuje jinak. Slyším věžní zvon, i když věž žádný nemá.“'
      ],
      joke: [
        '„Proč se rytíř hádal s mostem? Protože si nechtěl připustit, že je mezi nimi propast.“',
        '„Vtip o čarodějově účesu? Jen kdybych chtěl být do jara ledňáčkem.“',
        '„Neslyšel jsi o havranovi, který prodával mapy? Taky nikdo. Protože neuměl držet pero.“',
        'Havran se rozchechtá tak hlasitě, až mu z rozcestníku spadne trochu sněhu.'
      ]
    },
    wizard: {
      identity: ['„Jméno jsem nechal pod ledem spolu s minulým životem.“', '„Tohle údolí si mě bude pamatovat jako zimu, která nikdy neskončila.“', '„Ptej se dál. Každé slovo ti krátí čas.“'],
      winter: ['„Lidé chtějí, aby se svět měnil. Já ho uchovám v dokonalém klidu.“', '„Led nemůže zradit, zestárnout ani zapomenout.“', '„Vidíš ty trpaslíky? Také věřili, že jaro přijde samo.“'],
      sun: ['Čaroděj sevře žezlo. „Hvězdářovo sklo už nikdy nesmí zachytit paprsek.“', '„Jeho malá ampule mě kdysi pálila. Ten trik nezopakuješ.“', 'Všechna čtyři oka se otočí k tobě. „Nedívej se na světlo. Dívej se na mě.“'],
      journey: ['„Cesta končí u mě. Ty už se dál nedostaneš.“', '„Zpátky vede stejná stezka. Ještě ti ji nezavírám.“', '„Jak dlouho vydržíš v brnění stát před ledem? Já mám celou věčnost.“'],
      crypt: ['„Hvězdář uměl položit správné otázky. Jeho chyba byla, že čekal odpovědi.“', '„Pod věží leží jeho tělo. Jeho tajemství už tam neleží.“'],
      bridge: ['„Most jsem nezničil rukama. Mráz a čas to za mě dokončily.“', '„Lano tě sem dovede. Zpátky tě ale žádný uzel nezachrání.“']
    }
  },
  ambient: {
    clearing: ['Havran si schová zobák do peří a po chvíli ho zase vytáhne.', 'Z větve se sesype prachový sníh a zmizí v modrém stínu.', 'V dáli se na okamžik zableskne led na vrcholu hory.', 'Rozcestník zlehka zavrže. Šipky ukazují stále stejně.', 'Vzduchem se snáší jednotlivé vločky, každá jinou cestou.'],
    mill: ['V hluboké spáře kola uvízl zledovatělý list.', 'Náhon pod ledem klokotá; odtud se zdá, že mlýn tiše dýchá.', 'Na stole se zableskne kapka jinovatky.', 'Zavřené dveře ani nezaskřípou, přestože se o ně opře vítr.', 'Od okapu odpadne drobná krusta sněhu.'],
    bridge: ['V propasti houkne vítr a vzápětí zmlkne.', 'Na vzdáleném pilíři se zatřpytí námraza.', 'Nad strží pomalu přeletí osamělá vločka.', 'Oprýskaný kámen zůstává pevný, i když pod ním teče voda.', 'Ozvěna tvého dechu se vrátí ze skály.'],
    tower: ['Paprsek na kotouči se posune jen o vlásek.', 'Ve věži zapraská staré dřevo.', 'Na schodech se hromadí jemný prachový sníh.', 'Skrz zamřížované okno prosvitne krátký fialový záblesk.', 'Vítr oběhne dvůr, ale k západnímu schodišti nepronikne.'],
    crypt: ['Kapka dopadne do kamenné spáry.', 'Stíny na stěnách se pod plamenem lucerny protáhnou.', 'V tichu slyšíš jen vlastní opatrné kroky.', 'Sarkofág stojí nehybně. Neodráží ani kroky, ani hlas.', 'Proud vzduchu pohne plamenem, ale nezhasne ho.'],
    observatory: ['Mezi trámy se objeví úzký pruh hvězdné oblohy.', 'Na stole se nepatrně zachvěje roh stránky.', 'Kov dalekohledu tiše cvakne, jak se v mrazu smršťuje.', 'Po popraskané podlaze přeběhne slabý odlesk měsíce.', 'Zvenku se ozve křik vzdáleného ptáka.'],
    cave: ['V ledovém sloupu se na okamžik rozsvítí bublina.', 'Čaroděj si prohlíží ostří tvého meče bez známky obav.', 'Po hladkém ledovci se sesune drobný úlomek.', 'Čaroděj pomalu zavře jedno ze čtyř očí. Ostatní tě ani na okamžik nespustí z dohledu.', 'Z žezla vychází tlumený tón podobný zvonku.']
  }
};
