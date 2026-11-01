// Jeskyně posledního světla 0.11.8.12 — rozpoznávání ZÁMĚRU, ne kouzelné věty.
// Modul je offline, nečte síť a nepřidává předměty ani nemění řešení hádanky.
(function(){'use strict';
 const say=(...lines)=>lines;
 const T={
  greet:say('Čaroděj k tobě obrátí jedno oko. „Na pozdrav je tu poněkud pozdě. Ale slušnost ještě nezamrzla.“','„Zdravíš strážce, kterého hodláš neposlechnout?“ Žezlo nepatrně ztichne. „Zvláštní začátek rozhovoru.“','„Znovu dobrý den? Slunce už sem roky nezavítalo. Ale budiž.“'),
  farewell:say('„Odcházíš? Výborně. Aspoň jeden z nás dnes učinil rozumné rozhodnutí.“','Čaroděj ani neuhne. „Vrať se, až budeš mít víc otázek než úderů.“','„Sbohem, rytíři.“ Po chvíli dodá: „Neber to jako pozvání zpátky.“'),
  apologize:say('„Omluva není štít,“ odpoví čaroděj. Přesto žezlo na okamžik skloní.','„Slyším tě. Odpustit a pustit tě skrz jsou dvě různé věci.“','Čaroděj se odmlčí. „Dřív jsem na taková slova dokázal reagovat lépe.“'),
  thanks:say('„Poděkování za co? Za to, že tě ještě nechávám stát?“','„Jsi první, kdo mi tu dnes děkuje. Přiznávám, že nevím, co s tím.“','„Není zač,“ odsekne. Zní to však méně ledově než před chvílí.'),
  plead:say('„Nejsem hluchý k prosbám. Jsem jen tvrdohlavější než ty.“','„Prosit můžeš. Já ale nemohu vzít zpátky všechno, co jsem slíbil sám sobě.“','„Přestaň mě přesvědčovat slovy. Ani já jsem nezačal tuto zimu slovy.“'),
  insult:say('Jedno z očí se přivře. „To mělo bolet? Zažil jsem dlouhé zimy i lepší urážky.“','„Výborně. Přišel jsi mě porazit slovníkem.“ V žezle tiše zapraská.','„Můžeš mi říkat, co chceš. Ale urážky led neroztopí.“'),
  compliment:say('„Lichotky?“ Čaroděj na okamžik zaváhá. „Moje poslední obdivovatelka byla socha. Ta aspoň nemluvila.“','Jedno oko se překvapeně rozšíří. „Zajímavé. Většinou lidé nejprve křičí.“','„Děkuji,“ řekne téměř neslyšně. „Nedělej si z toho ale špatný závěr.“'),
  joke:say('„To byl žert?“ Čaroděj nakloní žezlo. „Omlouvám se. Smích mi kdysi zamrzl.“','„Kdysi jsem znal dobrý vtip,“ řekne. „A pak jsem jej vyprávěl padesát zim tomu samému krystalu.“','Z jednoho oka steče kapička vody. „To není slza smíchu. To je kondenzace.“'),
  absurd:say('Čaroděj tě chvíli pozoruje. „Nevím, zda je to plán, nebo horečka. Obojí je tu nebezpečné.“','„Tohle jsi právě vymyslel?“ ozve se shora. „Lidé jsou ještě podivnější, než si pamatuji.“','Páté oko se otevře. „Vyslechl jsem už mnoho nesmyslů. Tenhle má vlastní kategorii.“'),
  curiosity:say('„Zeptej se,“ odpoví čaroděj. „Odpověď ti ale nemusí být po chuti.“','„Někdo sem přijde s mečem. Ty přicházíš s otázkou. To je pokrok.“','Žezlo na okamžik přestane jiskřit. „Poslouchám.“'),
  bargain:say('„A co za to?“ Čaroděj si tě změří. „Neprodávám cestu za měď ani za lichotky.“','„Obchod je možný jen tehdy, když oba dokážeme splnit slib. Ty chceš projít. Já chci, aby všechno zůstalo.“','„Nabídku jsem slyšel. Neznamená to, že máš mou důvěru.“'),
  challenge:say('„Chceš si zasoutěžit?“ Všech pět očí tě přeměří. „Mně stačí stát. Ty se mezitím snažíš přežít.“','„Na hádanky je čas u ohně. Tady se rozhoduje, co přežije zimu.“','„Dokázat mi něco nemusíš. Jen zvaž, co je důležitější než tvá pýcha.“'),
  truth:say('„Lžu?“ Čaroděj přejede prstem po žezlu. „Pravda se nemění podle toho, kdo stojí blíž k portálu.“','„Nemusíš mi věřit. Ale nesmíš si má slova upravit tak, aby se ti líbila.“','„Některé pravdy vyslovuji nerad. To z nich nedělá lež.“'),
  trust:say('„Věřit mi nemusíš. Ani já nevěřím rytíři s taseným mečem.“','„Důvěra se nezískává tím, že ji jeden z nás přikáže.“','Čaroděj se odmlčí. „Kdysi mi někdo věřil. Neptej se, jestli jsem toho byl hoden.“'),
  emotion:say('„Cítím chlad. A něco, co bývalo podobné smutku.“ Čaroděj sevře žezlo.','„Ptáš se, zda jsem šťastný? Nevím. Klid jsem si spletl se štěstím už dávno.“','„Rozhněvaný? Občas. Osamělý? To slovo už jsem téměř zapomněl.“'),
  empathy:say('Čaroděj nejprve neodpovídá. „Lítost si nech pro ty dole. Jim už ji nikdo neřekne.“','„Je těžké poslouchat někoho, kdo mě nechce jen přemoci.“ Jedno oko se pomalu zavře.','„Možná si zasloužím tvůj hněv,“ řekne. „Ale ani soucit mě nezbaví toho, co jsem udělal.“'),
  family:say('„Rodinu?“ Čaroděj se podívá za sebe. „Pamatuji hlasy. To je všechno, co ti teď řeknu.“','„Kdysi se mě lidé ptali, kdy přijdu domů. Teď už žádné dveře nečekají.“','„Nech to být, rytíři.“ Hlas je tentokrát tišší, ale ne nepřátelský.'),
  needs:say('„Jestli mám hlad?“ Věčná zima odnaučí tělo mnoha návykům. Vzpomínky však hladoví dál.','„Nespím tak, jak spíš ty. Někdy jen zavřu všech pět očí a poslouchám led.“','„Teplo, jídlo, odpočinek… Dřív to bývaly prosté věci.“'),
  color:say('„Modrý?“ Čaroděj se podívá na rukáv. „Když jsem zde zůstal, led si vzal víc než můj čas.“','„Takto jsem se nenarodil.“ Krystaly kolem něj se krátce rozzáří.','„Tělo si pamatuje místo, na kterém příliš dlouho stojí.“'),
  eyes:say('„Každé oko vidí něco jiného. Jedno tvoji zbraň, druhé cestu za tebou.“','„Páté oko jsem nedostal proto, abych byl krásný.“','„Ne, jedno ti nepůjčím,“ dodá, jako by tu otázku slyšel už předem.'),
  magic:say('„Magie tu není zadarmo. Jen účet nepřichází hned.“','„Hvězda v žezle drží chlad pohromadě. Zbytek dělá moje vůle.“','„Kouzla se naučíš snadněji než jejich následky. To mi věř.“'),
  portal:say('„Ten otvor není odměna za vytrvalost. Je to hranice.“','„Skrz portál proniká vítr, který nedokážu umlčet. Proto jej hlídám.“','„Můžeš vidět druhou stranu. Neznamená to, že ji znáš.“'),
  escape:say('„Jestli mne obejdeš? Zkus si vzpomenout, kolik očí tě sleduje.“','„Pode mnou je led. Nad tebou led. Stranou vede jen cesta zpět.“','Žezlo jednou klepne o sloup. „Stezka k portálu se stále neotevřela.“'),
  bypass:say('„Podlézt? Přelézt? V každém případě se budeš muset dostat přes můj stín.“','Čaroděj sleduje tvůj pohled po skalách. „Ani tajná stezka by nezůstala tajná před pěti očima.“','„Jestli hledáš mezeru v ledu, musíš nejdřív pochopit, proč je tam.“'),
  thaw:say('„Myslíš, že mě roztopíš dechem?“ Na okamžik se zasměje. „Aspoň budeš v teple ty.“','Po ledovém sloupu přeběhne stín. „Oheň není totéž co teplo, rytíři.“','„Zima má mnoho podob. Některé se nedají zahnat pouhým plamenem.“'),
  fakeWeapon:say('Sáhneš po věci, o které mluvíš. Nemáš ji. Čaroděj nad tvým gestem pozvedne jedno oko. „Představivost je mocná. Ale ne tak mocná.“','„To sis sem přinesl jen v hlavě?“ zeptá se. Ledový sloup zůstává netknutý.','„Až tvá vymyšlená zbraň zmrazí skutečné kameny, začnu se obávat.“'),
  throwOdd:say('Pokusíš se hodit tím, co popisuješ. Žádnou takovou věc ale u sebe nemáš. „Vynalézavé,“ suše podotkne čaroděj.','Čaroděj sleduje tvou prázdnou ruku. „Házíš výhrůžkami, nebo skutečnými předměty?“','Ve studeném vzduchu máchneš rukou. Žádný zázračně vzniklý předmět z ní nevylétne. „To mě mělo ohromit?“'),
  climb:say('Přiložíš botu ke sloupu. Led je hladký jako sklo a sráz příliš vysoký. „Vážně?“ ozve se nad tebou.','Vyzkoušíš výstupek; pod rukavicí se ihned ulomí. Čaroděj shlédne dolů. „Pády se tu počítají snadno.“','„Lez, jestli chceš,“ pronese. „Já ale nebudu předstírat, že ti roste žebřík.“'),
  touch:say('Natáhneš ruku k čaroději, ale mezi tebou a jeho rouchy je několik metrů ledu. „Z dálky jsem přístupnější,“ poznamená.','„Přibližovat se můžeš,“ ozve se ze sloupu. „Dotknout se mě je jiný příběh.“','Jedno oko sleduje tvoji dlaň. Žezlo ti připomene, jak daleko ještě jsi.'),
  affection:say('„Obejmout mě?“ Čaroděj ztuhne víc, než bys čekal. „To mi už dlouho nikdo nenabídl.“','„S polibkem počkej. Nejprve bych musel slézt. A to nehodlám.“','Čaroděj se na okamžik přestane tvářit hrozivě. „Na takovou odvahu jsem nebyl připraven.“'),
  gross:say('„Skutečně sis myslel, že sem za tímhle přijdeš?“ Čaroděj se uraženě odvrátí.','„I led má jistou úroveň hygieny,“ poznamená se suchým odporem.','Jedno oko se přivře. „Pokračuj v cestě, až se zase začneš chovat jako rytíř.“'),
  perform:say('Zahvízdáš do ledového ticha. Ozvěna se vrátí o několik tónů níž. Čaroděj ti nezatleská.','Zkusíš taneční krok na kluzkém kameni. „Oceňuji odvahu,“ řekne čaroděj. „O rovnováze pomlčím.“','Tvůj hlas se rozběhne mezi krystaly. „Kdyby mne písně dokázaly zastavit, bylo by tu už jaro.“'),
  rest:say('Posadíš se na chladný kámen. Čaroděj tě nepohání. „Odpočiň si. Rozhodnutí nikam neuteče.“','Na okamžik zavřeš oči. Mrazivá zem tě přiměje brzy vstát. Čaroděj celou dobu hlídá průchod.','„Spát tady?“ ozve se shora. „Tak přece jen máš horší plán než boj.“'),
  stare:say('Upřeš oči do čarodějova obličeje. Čtyři pohledy ti je vrátí a pátý hlídá stezku.','Čaroděj si všimne, že na něj zíráš. „Oční souboj nevyhraješ, rytíři.“','Chvíli si hledíte do očí. Nakonec zamrkáš první. „Vidíš?“ ozve se shora.'),
  listen:say('Zůstaneš tiše. V ledových stěnách něco pomalu praská a za portálem skučí vítr. Čaroděj mlčí.','Nasloucháš. Kromě vlastního dechu slyšíš tiché chrastění krystalů na žezle.','„Slyšíš?“ zeptá se čaroděj. „To není hudba. To hora pracuje i pod ledem.“'),
  search:say('Prohlédneš led pod nohama. Jsou v něm zamrzlé černé trhlinky a zbytky dávno ulomených krystalů. Nic si odtud nevezmeš.','Obejdeš dostupný kus stezky. Kromě padlých a promáčknuté přilby tu nenajdeš ukrytý vchod ani použitelnou zbraň.','Zastavíš se u okraje cesty. Před tebou je sloup, nad ním čaroděj a za ním průchod. Žádné tajné schodiště se neobjeví.'),
  dwarfs:say('Podíváš se na zmrzlé tváře. „Varoval jsem je,“ ozve se shora. „To však nic nemění na tom, že zůstali.“','U jednoho těla leží rozlámaný štít. Čaroděj sklopí pohled. „Přišli se zbraněmi. Odejít už nemohli.“','„Nejsou to moje trofeje,“ řekne čaroděj. „I kdyby to tak z dálky vypadalo.“'),
  consequence:say('„Kdybys mě zastavil?“ Čaroděj se zahledí k portálu. „Možná bys zjistil, co jsem se snažil zadržet.“','„Na každou věc existuje následek. I na tvoje hrdinství.“','„Kdybych zmizel, nezmizí sám od sebe všechen chlad.“'),
  leaveTogether:say('„Půjdu s tebou?“ Čaroděj se podívá na svůj sloup. „Nevím, zda bych ještě uměl udělat obyčejný krok.“','„Cestu do údolí znám. Cestu zpět k sobě už ne.“','„Nemohu se prostě sebrat a odejít. A jestli mi chceš pomoct, nejdřív pochop, proč tu zůstávám.“'),
  gameBreak:say('„Říkáš, že je to jen hra?“ Čaroděj poklepe žezlem o kámen. „Pak je zvláštní, jak opravdově tě studí prsty.“','„Přeskočit děj?“ Čaroděj se rozhlédne. „Dokonce ani já nedokážu přeskočit zimu.“','„Příkaz čaroději neporoučí. Ať zkusíš cokoli, musím se rozhodnout sám.“'),
  opinionGear:say('Čaroděj přejede pohledem tvou výstroj. „Proti meči nic nemám. Jen proti myšlence, že vyřeší všechno.“','„Zbroj je pěkná,“ uzná čaroděj neochotně. „Zimě je však jedno, jak se rytíř obléká.“','„Chceš hodnocení svého vybavení?“ nakloní hlavu. „Máš odvahu. To se do vaku nevejde.“'),
  summon:say('Zavoláš do ledové jeskyně. Ozvěna se vrátí, ale nikdo další nepřichází. „Jestli máš spojence, bude muset přijít po vlastních,“ řekne čaroděj.','„Volej, jak chceš,“ řekne čaroděj. „Z hor ti odpoví jen vítr.“','Na okamžik zavládne ticho. „Přivolat pomoc není totéž jako ji mít,“ poznamená čaroděj.'),
  lookBehind:say('„Za mnou?“ Jedno z čarodějových pěti očí se bez otáčení podívá dozadu. „Myslel sis, že mě rozptýlíš?“','Čaroděj se ani neotočí. Páté oko se však pomalu stočí k portálu. „Nezkoušej dětské triky.“','„Vím, co je za mnou, rytíři. Proto tu stojím.“'),
  playDead:say('Zhroutíš se na studenou zem a zadržíš dech. „Zajímavé,“ ozve se shora. „Ti opravdoví mrtví se obvykle nehýbou tak nápadně.“','Ležíš bez hnutí. Čaroděj ani o píď neustoupí. „Až se probereš, stezka bude pořád zavřená.“','„Mrtvého jsi hrál lépe, dokud ses nesnažil sledovat, jestli se dívám,“ poznamená čaroděj.'),
  time:say('„Kolik je hodin?“ Čaroděj se podívá do temnoty. „Poslední hodiny, které jsem znal, se zastavily dávno.“','„Čekat můžeš. Já čekám déle, než si dovedeš představit.“','„Zde čas měříš jen podle zvuku praskajícího ledu.“'),
  identity:say('„Čaroděj, strážce, vězeň… Záleží, kdo o mně mluví.“','„Jméno jsem míval. Jen nevím, zda mi ještě patří.“','„Pokud potřebuješ jméno pro nepřítele, říkej mi čaroději. Pokud chceš znát člověka, budeš muset poslouchat.“'),
  question:say('„Zajímavá otázka,“ odpoví po chvíli. „Nemysli si však, že na všechno musím mít odpověď.“','Čaroděj odvrátí jediné oko k portálu. „Nevím, zda bych ti řekl pravdu, kdybych ji sám znal.“','„Ptáš se věci, na které se mě tu ještě nikdo nezeptal.“ Žezlo v jeho ruce ztichne.'),
  statement:say('„Slyšel jsem tě,“ řekne čaroděj. „Nemusím s tebou souhlasit, abych tě poslouchal.“','Žezlo se sotva pohne. „Pokračuj, rytíři. Někdy jsou slova horší než meč.“','„Tvůj názor jsem zaznamenal,“ řekne téměř úředně. „A pořád stojím tady.“'),
  act:say('Zkusíš svůj nápad uskutečnit, ale led a výška sloupu tě zastaví dřív, než se čaroděje dotkneš. „Nápadů máš dost,“ poznamená.','Vykročíš a rozhlédneš se po možnostech. Čaroděj tě sleduje ze sloupu; svět kolem se tvým přáním sám nezmění.','„Opravdu?“ ozve se shora, když se pokusíš svůj záměr provést. Stezka stále vede jen k ledové bariéře.'),
  gibberish:say('Čaroděj nakloní hlavu. „To bylo zaklínadlo, urážka, nebo jsi jen zmrzl na jazyku?“','„Opakuj to, chceš-li,“ řekne. „Ale vysvětlení by bylo užitečnější než hlasitost.“','Žezlo umlkne. „Některé jazyky neznám ani já. Zkus mi ukázat, co máš na mysli.“')
 };
 const R=[
  ['greet',/^(?:ahoj|cau|zdar|nazdar|dobry (?:den|vecer)|zdravim|vitam te|nazdarek|zdravicko|hej carodeji|hal[oó]|hola)\b/],
  ['farewell',/^(?:mej se|sbohem|na shledanou|nashle|zbohem|cau zatim|tak ja jdu|opatruj se|dobrou noc)\b/],
  ['apologize',/\b(?:promin|odpust mi|omlouvam se|mrzi me to|nezlob se|nechtel jsem ti ublizit|beru to zpet|sorry)\b/],
  ['thanks',/\b(?:dekuji|diky|dekuju|dekuji ti|diky moc|vdacny)\b/],
  ['fakeWeapon',/\b(?:laser|kulomet|pistol|granat|raketomet|atomov|dynamit|motorov|tank|samopal|pusk|plamenomet|bazuka|dron|svetelny mec|carovny proutek|kouzelnou hulku)\b/],
  ['gameBreak',/\b(?:cheat|hack|debug|konzol|prikazovy radek|program|skript|javascript|html|uloz si|ulozeni|checkpoint|preskocim (?:level|dej)|restartuj svet|vypnu hru|ai model|jsi jen hra|jsi npc|jsi pixel|autora hry|tvurce hry|menu hry|administratora)\b/],
  ['gross',/\b(?:vycur|vycuram|pocur|vyser|vykad|uprd|prd|pliv|naslin|odpliv|pozvrac|olizu|lizat|snim te|sezeru te|kousnu te|ukousnu)\b/],
  ['affection',/\b(?:obejm|objim|polib|pusu|pusink|pomazl|pohlad|pohladim|miluj|mam te rad|milacku|lasku)\b/],
  ['perform',/\b(?:zazpiv|zpiv|tanc|tanec|zatanc|pisk|hvizd|zatlesk|tlesk|zasm|smich|smej se|bubn|zahrat na|recit)\b/],
  ['rest',/\b(?:spat|spim|usnu|spi se|vysp|odpocin|sednu si|lehn|polezim|posadim se|zdrim|zavru oci)\b/],
  ['throwOdd',/^(?:hod|hodim|hodit|haz|hazim|hazet|mrst|vrhn|odhod|vystrel)\b/],
  ['climb',/\b(?:vysplh|splh|vylez|lezu|polezu|prelez|vylezu|vyskrab|lez po|lezt na|sestoup|seskocim na sloup|skocim na sloup)\b/],
  ['bypass',/\b(?:podlezt|podlezu|obejdu|obehnu|propliz|prekroc|prelezu|nepozorovan|tajne proj|prokopu|podkopu|tunel|objizd|skryta cest|tajna cest|za zada|za sloup)\b/],
  ['thaw',/\b(?:sfoukn|rozfouk|dychn|dech|foukn|roztop|roztav|rozehrej|rozmraz|zapalim|ohe[nm]|podpal|zatop|rozpustim)\b/],
  ['touch',/\b(?:dotkn|sahnu na|sahni na|chytnu te|chytnu ho|popadnu|stisknu ruku|potrepat ruk|pokracim k nemu|k nemu prijdu|priblizim se k nemu)\b/],
  ['escape',/\b(?:muzu te obejit|mohu te obejit|da se te obejit|projdu kolem|obejdu te|muzu utict kolem|slo by to pres tebe|dostanu se kolem|proc me nepustis bokem)\b/],
  ['stare',/\b(?:ziram|civim|cumim|koukam (?:na nej|na tebe|mu do)|divam se (?:na nej|na tebe|mu do)|prohlizim si ho|proc na me ziras|proc na me civis)\b/],
  ['listen',/\b(?:naslouch|poslouch|co slysim|poslechnu si|nastrazim usi|zaposloucham se)\b/],
  ['search',/\b(?:hledam|hledat|prohrabu|prohledam|prohledat|podivam se kolem|kouknu kolem|zvednu prilbu|prohlidnu prilbu|zkoumam krystaly|zledovatele steny|praskliny v ledu|pod ledem|za sloupem)\b/],
  ['dwarfs',/\b(?:trpaslici|trpaslikum|mrtvoly|tela|padle|padly|neboztici)\b/],
  ['color',/\b(?:proc jsi modry|jakou mas barvu|modre telo|modrou kuzi|vypadas jak led|proc jsi tak zmrzly)\b/],
  ['needs',/\b(?:hlad|zizen|jidlo|co jis|kdy jis|co pijes|kdy spis|spis vubec|jsi unaven|je ti zima|neni ti zima|chces caj|chces polivku|potrebujes jidlo|muze[s]? spat)\b/],
  ['family',/\b(?:rodin|matk|otc|mama|tat[ai]|rodic|manzel|zen[au]|det[iy]|sourozenc|bratr|sestra|domov|doma)\b/],
  ['empathy',/\b(?:je mi te lito|lituju te|chudacku|chapu te|rozumim ti|musi ti byt smutno|musis byt sam|jsem na tve strane|nechci ti ublizit|nechci s tebou bojovat)\b/],
  ['emotion',/\b(?:stastn|smutn|osamel|samas|smutno|zlobis se|nastvan|rozcilen|milujes|radost|citis se|boli te|plac|trapis|depres|nemas strach)\b/],
  ['joke',/\b(?:vtip|zert|srand|udelam si legraci|rozesmat te|smysl pro humor|umis se smat)\b/],
  ['compliment',/\b(?:jsi hezky|jsi krasny|jsi dobry|jsi skvely|jsi zajimavy|mas hezke oci|slusi ti|obdivuji te|jsi chytry|jsi moudry|jsi lepsi nez|vypadas uzasne)\b/],
  ['insult',/\b(?:idiot|debil|blbec|hlupak|pitomec|trapak|saso|ubo[zž]|zmetek|hovno|srac|kripl|kokot|kret[eé]n|hloupy|smesny|smrad|cumo|zkurv|hajzl|coura|mrcha|nesnasim te|jsi nula|jsi trapny)\b/],
  ['plead',/\b(?:prosim te pust|prosim te nech|moc te prosim|smiluj se|prosim dovol|prosim neblazni|bud tak hodny|dej mi sanci|slituj se|prosim o milost|doprej mi projit)\b/],
  ['challenge',/\b(?:zahrajeme si|zahraj si|hru se mnou|hru s tebou|dam ti hadanku|dej mi hadanku|soutez|vyzvy|vyzivam te|co kdybychom hrali|ukaz co umis|dokaz mi)\b/],
  ['truth',/\b(?:lzes|lhars|lhari|nekecej|neverim co rikas|to neni pravda|jsi lhar|pravdu mi rekni|rekni pravdu)\b/],
  ['trust',/\b(?:mam ti verit|muzu ti verit|mohu ti verit|veris mi|duverujes mi|verim ti|neverim ti|neveris mi)\b/],
  ['time',/\b(?:kolik je hodin|kolik je casu|jak dlouho mam cekat|cekat na tebe|nemas hodiny|uz je pozde|je rano|je vecer|jsi tu dlouho)\b/],
  ['leaveTogether',/\b(?:pojdes se mnou|pujdes se mnou|pojd se mnou|pojd s nami|pojd do udoli|proc nejdes se mnou|nechces odejit se mnou|opustime to tady spolu|muzes jit se mnou)\b/],
  ['consequence',/\b(?:co kdybych te porazil|co se stane kdyz te porazim|co bude pak|co kdyz te zabiju|kdyz te zabiju|az te znicim|co kdyz zmizis|az zmizis|co kdyz zmrznes|co kdyby to skoncilo)\b/],
  ['portal',/\b(?:proc portal sviti|proc portal huci|co je za branou|co kdyz portal zmizi|slysiss ten vitr|co kdybych tam vstoupil|portal je pekny|portal je strasidelny)\b/],
  ['question',/\b(?:mam otazku|mohu se zeptat|muzu se zeptat|povidej mi|popovidejme si|rekni mi neco zajimaveho|odpovez mi|ptam se te|co bys mi rekl)\b/],
  ['identity',/\b(?:prave jmeno|kdo ses doopravdy|jak ti rikaji|jak se nazyvas|jaky mas puvod|co jsi za bytost)\b/]
 ];
 // Kmeny slov zachytí češtinu i tehdy, když hráč mění osobu, čas, pád
 // nebo skloňuje předmět. Starší slovník drží konkrétní příběhové repliky.
 const STEMS=[
  ['fakeWeapon',/\b(?:laser[a-z]*|kulomet[a-z]*|pistol[a-z]*|granat[a-z]*|raketomet[a-z]*|atomov[a-z]*|dynamit[a-z]*|motorov[a-z]*|samopal[a-z]*|bazuk[a-z]*|plamenomet[a-z]*|dron[a-z]*)\b/],
  ['gameBreak',/\b(?:npc|cheat[a-z]*|debug[a-z]*|javascript|skript[a-z]*|level[a-z]*|savegame[a-z]*|konzol[a-z]*|checkpoint[a-z]*|html|program[a-z]*|administrator[a-z]*)\b/],
  ['gross',/\b(?:pliv[a-z]*|prd[a-z]*|vycur[a-z]*|pocur[a-z]*|vyser[a-z]*|vykad[a-z]*|pozvrac[a-z]*|oliz[a-z]*|sezer[a-z]*|kousnu|ukousnu)\b/],
  ['affection',/\b(?:obejm[a-z]*|objim[a-z]*|polib[a-z]*|pusink[a-z]*|pusu|pusa|pusy|pomazl[a-z]*|pohlad[a-z]*|milu[a-z]*|milack[a-z]*)\b/],
  ['empathy',/\b(?:lituju te|lituj[iy] te|chapu te|rozumim ti|je mi te lito|chudack[a-z]*|nechci (?:s tebou bojovat|ti ublizit)|jsem na tve strane)\b/],
  ['family',/\b(?:rodin[a-z]*|matk[a-z]*|mama|tat[a-z]*|otec|otc[a-z]*|deti|dite|det[a-z]*|rodic[a-z]*|manzel[a-z]*|sourozen[a-z]*|bratr[a-z]*|sestr[a-z]*|domov[a-z]*|dom[aá])\b/],
  ['emotion',/\b(?:stastn[a-z]*|smutn[a-z]*|plac[a-z]*|trapis[a-z]*|zlobis se|nastvan[a-z]*|rozcilen[a-z]*|osamel[a-z]*|radost[a-z]*|citis[a-z]*)\b/],
  ['challenge',/\b(?:vyzyv[a-z]*|hadank[a-z]*|soutez[a-z]*|zahraj[a-z]*|hru se mnou|hru s tebou)\b/],
  ['search',/\b(?:prozkoum[a-z]*|prohled[a-z]*|zvedn[a-z]*|zkoum[a-z]*|hled[a-z]*) (?:krystal[a-z]*|prasklin[a-z]*|tajnou cestu|vybaveni|sutiny|sut|prilb[a-z]*|helmu)\b/],
  ['bypass',/\b(?:tajnou cestu|skrytou stezku|obejd[a-z]*|podlez[a-z]*|propliz[a-z]*|obehn[a-z]*|podkop[a-z]*|tunel[a-z]*)\b/],
  ['thaw',/\b(?:roztop[a-z]*|roztav[a-z]*|rozmraz[a-z]*|zahriv[a-z]*|rozehr[a-z]*|zatop[a-z]*|dychn[a-z]*|foukn[a-z]*|dech[a-z]*)\b/],
  ['listen',/\b(?:naslouch[a-z]*|poslouch[a-z]*|zaposlouch[a-z]*)\b/],
  ['apologize',/\b(?:omluv[a-z]*|promin[a-z]*|odpust mi|mrzi me to|nechtel jsem ti ublizit)\b/],
  ['opinionGear',/^(?:co si myslis|jak se ti libi|co rikas|libi se ti|co soudis|jak hodnotis).*\b(?:helm[a-z]*|prilb[a-z]*|zbroj[a-z]*|brnen[a-z]*|bot[a-z]*|vystroj[a-z]*|muj mec|moji zbran)\b/],
  ['summon',/\b(?:zavol[a-z]*|privol[a-z]*|pozv[a-z]*|poslu pro|pisknu na)\b.*\b(?:kamarad[a-z]*|pritel[a-z]*|spojenc[a-z]*|pomoc[a-z]*|voj[aá]k[a-z]*|drak[a-z]*|bratr[a-z]*)\b/],
  ['lookBehind',/\b(?:co je za tebou|podivej se za sebe|za tebou je|pozor za tebou|otoc se|ohledni se|otoc hlavu|koukni dozadu)\b/],
  ['playDead',/\b(?:predstiram ze jsem mrtvy|hraju mrtveho|delam mrtveho|lehnu si a delam mrtveho|budu delat mrtveho|predstirat smrt)\b/],
  ['friendship',/\b(?:chces byt kamarad[a-z]*|budeme kamarad[a-z]*|budeme pratel[a-z]*|chci byt tvuj kamarad[a-z]*|chci byt tvuj pritel[a-z]*|pojdm[e]? se skamaradit|skamarad[a-z]* se s tebou|pratel[a-z]* se s tebou|jsi muj pritel[a-z]*|jsi muj kamarad[a-z]*)\b/]
 ];
 T.friendship=say('„Přítel?“ Čaroděj přestane na chvíli svírat žezlo. „Kdysi jsem tím slovem nešetřil. Dnes už vím, co může stát.“','„Tvé přátelství by se zkoušelo právě tehdy, kdybych tě dál nepustil,“ řekne. „Vydrželo by?“','„Zvláštní,“ zamumlá. „Meč máš stále u pasu, ale mluvíš jako někdo, kdo přišel na návštěvu.“');
 const Q=/^(?:a |no |tak |hele |vis |rekni |povez |vysvetli |chci vedet )?(?:co|proc|procs|jak|kdy|kde|kdo|komu|ceho|jaky|jaka|jake|kolik|odkud|kam|cim|mohl|mohu|muzes|muzu|musim|smim|chces|umis|jsi|mas|mel|byl|ses|veris|bojis|napadlo te|myslis|kdyby|nebylo by|zdalipak|cozpak|uz|opravdu)\b/;
 const ACT=/^(?:(?:ja|ja bych|ja chci|chci|chtel bych|zkusim|zkus|ted|tak|no tak|hele|prosim|co kdybych) )*(?:vezm|vytah|poloz|strc|vsun|otev|sekn|rozse|prast|rozbi|kop|bod|pich|uder|zautoc|zabij|skoc|preskoc|obej|prelez|podlez|sle|zaslap|rozkop|rozmlat|prokop|odstrc|vystrel|mav|zamav|ukaz|svaz|privaz|spout|odriz|vyloup|vylom|polam|hod|haz|hazu|hodim|sah|osah|objim|obejm|vyplaz|vystrc|tah|pritah|oliz|knoc|tuk|poklep|svle|oblec|vycur|zapis|pobez|utik|vysplh|pokrac|zatanc|zpiv|kric|seber|uhni|odtah|zavolej|vycaruj|prines|predstiram|hraju|presvedc|pokusim|dam|strilim|stril|kopn|nastrel|vypich|zavru|zasunu)[a-z]*\b/;
 const PRESERVE=/^(?:inventar|mapa|pomoc|zpet|uloz|nacti|restart|zacit znovu|nova hra|co vidim|rozhlidni|rozhlidnout|rozhlizet|kricet|zakricet|zarvat|prohl[eé]dnout (?:portal|sloup|carodeje|zezlo)|prozkoumat (?:portal|sloup|carodeje|zezlo)|podivat se na (?:portal|sloup|carodeje|zezlo)|kudy zpet|jit na jih|jdi na jih|na jih|jih|odejit|odejdi|opustit|jdi pryc|jit pryc|pryc|vratit se|chci odejit|jdi do veze|jit do veze)\b/;
 const USE=/\b(?:kapsl[a-z]*|ampul[a-z]*|tepeln[a-z]*|cock[a-z]*|lucern[a-z]*|olejnick[a-z]*|zapisnik[a-z]*|privesek[a-z]*|mec(?:em|e|i)?|cepel[a-z]*|klic[a-z]*|lano|lanem|olej[a-z]*)\b/;
 function parse(t,context){
  if(!t||context?.won)return null;
  if(PRESERVE.test(t))return null;
  // Skutečné předměty a vyřešení hádanky MUSÍ zůstat původnímu enginu.
  if(USE.test(t)&&/^(?:hod|haz|vrh|mrst|pouz|vloz|vezm|vytah|rozbij|rozpust|roztav|dej|daruj|zap|rozsvit|odhod|zvedni)[a-z]*\b/.test(t))return null;
  // Přednost mají fyzické, absurdní a neverbální akce, i když zmiňují oči/led/žezlo.
  if(/\b(?:hod|haz|mrst|vrhn|odhod|vystrel)[a-z]*\b/.test(t)&&/\b(?:mec|mecem|led|ledem|kamen|kamenem|veci|kapsli)\b/.test(t))return null;
  if(/\b(?:lez|vysplh|splh|vylez|prelez|polezu|vyskrab)[a-z]*\b/.test(t)&&/\b(?:sloup|ledu|sloupu|vyvyseninu)\b/.test(t))return 'climb';
  if(/\b(?:proc na me ziras|proc na me civis|prohlizim si ho|civim na tebe)\b/.test(t))return 'stare';
  for(const [id,re]of STEMS)if(re.test(t))return id;
  for(const [id,re]of R)if(re.test(t))return id;
  // Záměr přímé řeči předbíhá obecné slovesné příkazy jen tehdy, když se skutečně ptá.
  if(/\b(?:co kdyby|a kdyby|predstav si ze|kdybych|hypoteticky|jen tak premyslim)\b/.test(t))return 'consequence';
  if(ACT.test(t)||/\b(?:zaklepu|boucham|strkam|delam|skacem|zvedam|objimam|trham|kousnu|seru|curam|tykam)\b/.test(t))return 'act';
  if(Q.test(t)||/^(?:umel|umela|umel bys|coz takhle|zda|zajimalo by me|napadlo me|rekl bys|dokazal bys|mohl bys|co myslis)\b/.test(t))return 'question';
  if(/\b(?:carodej|carodeji|kouzelniku|mag|stras|portal|ledovy|zezlo|oci|vsechno|tebe|tobe|s tebou|ti|te|tvuj|tvoje|tvoji|vase)\b/.test(t))return 'statement';
  if(t.split(' ').length>=2)return 'gibberish';
  return 'gibberish';
 }
 // Poslední záchrana dialogu nesmí být stejná věta pro otázku o skále,
 // vlastním strachu nebo příběhu. Zkoušíme smysl VĚTY, i když se nevešla
 // do žádného výslovně pojmenovaného dialogového okruhu.
 function sceneReply(id,t,stage){
  if(id==='question'){
   if(/\b(?:pribeh[a-z]*|pohadk[a-z]*|vyprav[a-z]*|vyprave[a-z]*)\b/.test(t))return [
    '„Příběh?“ Čaroděj se zadívá na trpaslíky. „Kdysi tu bývalo jaro. To je celý začátek. O konci se zatím přeme.“',
    '„Jednou sem přišel člověk, který tvrdil, že nic nemůže ztratit,“ začne čaroděj. „A právě proto byl nejnebezpečnější.“',
    '„Příběhy se mají dokončovat,“ zamumlá. „Já svůj nechal uprostřed jedné zimy.“'][stage%3];
   if(/\b(?:skal[a-z]*|kamen[a-z]*|sten[a-z]*|puklin[a-z]*)\b/.test(t))return 'Čaroděj pohlédne na stěnu. „Ta skála tu byla přede mnou. Praskliny nejsou ozdoba; hora si pod ledem dál hledá cestu.“';
   if(/\b(?:hvezd[a-z]*|obloh[a-z]*|mesic[a-z]*)\b/.test(t))return 'Čaroděj zvedne jedno oko k temnému stropu. „Hvězdy jsou daleko, protože je nemůžeš přikázat blíž. Snad proto jim hvězdář tak důvěřoval.“';
   if(/\b(?:kde|kam|odkud)\b/.test(t)&&/\b(?:domu|domov|ven|pryc|cesta|dostat|odejit)\b/.test(t))return '„Domů vede cesta za tebou,“ řekne čaroděj a ukáže žezlem k jihu. „Ale tuším, že tvá otázka není jen o chůzi.“';
   if(/\b(?:jak|co|proc)\b/.test(t)&&/\b(?:udel[a-z]*|stalo|funguj[a-z]*|souvisi|zmen[a-z]*)\b/.test(t))return '„Některé věci jdou udělat. Jiné vrátit nejdou,“ odpoví čaroděj a očima zabloudí k padlým trpaslíkům.';
  }
  if(id==='statement'){
   if(/\b(?:bojim|strach|desi|bim se)\b/.test(t))return 'Čaroděj skloní žezlo o dlaň. „Strach tě nedělá slabším. Mně trvalo dlouho, než jsem to pochopil.“';
   if(/\b(?:nemam|nevim|ztratil|chci se vratit|jsem unaveny|jsem sam)\b/.test(t))return '„Možná ti rozumím víc, než bych chtěl,“ řekne čaroděj. Oči na jeho rouchu se na chvíli přestanou pohybovat.';
   if(/\b(?:vzdavam|koncim|vzdavam se)\b/.test(t))return '„Odložit meč není ostuda. Nemusíš se tu stát dalším varováním pro příštího poutníka.“';
  }
  if(id==='act'){
   if(/\b(?:pich[a-z]*|bod[a-z]*|vypich[a-z]*|kop[a-z]*|udr[a-z]*|prast[a-z]*|rozmlat[a-z]*|zabij[a-z]*)\b/.test(t))return ['Vyrazíš proti čaroději, ale došlápneš jen ke spodnímu ledu sloupu. Žezlo se zaleskne. „Z dálky vypadám snáz dosažitelný, viď?“','Čaroděj uhne jen pohledem. „Chceš udeřit? Nejdřív by ses musel dostat nahoru.“'][stage%2];
   if(/\b(?:krad[a-z]*|ukrad[a-z]*|seber[a-z]*|vyloup[a-z]*|vezm[a-z]*|popad[a-z]*|vytrhn[a-z]*)\b/.test(t))return 'Natáhneš ruku, ale čaroděj i jeho žezlo jsou vysoko nad tebou. „Myslel sis, že se toho vzdám tak snadno?“';
   if(/\b(?:skoc[a-z]*|preskoc[a-z]*|polet[a-z]*|ulet[a-z]*)\b/.test(t))return 'Odrazíš se od ledu. Výška sloupu a uzavřená stezka ti připomenou, že vůle nedokáže nahradit křídla.';
   if(/\b(?:uhni|odtah[a-z]*|odejdi|vypadni)\b/.test(t))return '„Přikazovat mi můžeš,“ řekne čaroděj. „Já ale svou stráž neopustím jen proto, že sis to přál.“';
  }
  return null;
 }
 function respond(id,context){
  const mem=context.memory||{topics:{}};if(!mem.topics)mem.topics={};
  const key='role:'+id;const stage=mem.topics[key]||0;mem.topics[key]=stage+1;
  let relation=mem.topics['_relation']||0;
  if(['apologize','compliment','empathy','thanks','affection','trust'].includes(id))relation=Math.min(6,relation+1);
  if(['insult','gross','fakeWeapon'].includes(id))relation=Math.max(-6,relation-1);
  mem.topics['_relation']=relation;mem.exchanges=(mem.exchanges||0)+1;
  let lines=T[id]||T.gibberish;
  let line=sceneReply(id,context.text||'',stage)||lines[stage%lines.length];
  if(context.hits>0&&['apologize','empathy','trust','affection'].includes(id)&&stage===0)
   line='Čaroděj si všimne, že teď mluvíš jinak než před chvílí. „Po tom, cos na mě útočil, mě tvá slova překvapují.“ '+line;
  if(relation<=-3&&['compliment','greet','bargain'].includes(id))
   line='„Po tom všem, cos mi řekl, teď zkoušíš jiný tón?“ '+line;
  if(relation>=3&&['empathy','family','emotion','affection'].includes(id))
   line='Čaroděj se tentokrát neuchýlí k posměchu. '+line;
  return line;
 }
 globalThis.adventureWizardRoleplay={parse,respond};
})();
