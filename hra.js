(()=>{'use strict';
const $=id=>document.getElementById(id),norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const rooms={clearing:{title:'Rozcestí pod horou',art:0,exits:{n:'bridge',w:'mill'},text:'Noc nad údolím. Po letech stále krutějších zim přišel další mráz a sevřel i poslední cesty. Na rozcestníku sedí havran. Na západ stojí mlýn; na sever vede cesta k mostu.'},mill:{title:'Mlýn bez mlynáře',art:1,exits:{e:'clearing'},text:'Zamrzlé kolo mlčí. U dveří visí lano s železným hákem, na stole stojí lucerna a olejnička. Vrátit se můžeš na východ.'},bridge:{title:'Stržený most',art:2,exits:{s:'clearing',n:'tower'},text:'Mezi pilíři zůstala černá propast. Pod tebou praská led. Severní cesta pokračuje k věži; na jihu je rozcestí.'},tower:{title:'Nádvoří hvězdáře',art:3,exits:{s:'bridge',w:'crypt',n:'cave'},text:'Na nádvoří stojí sluneční kotouč. Od schodů do krypty táhne studený vzduch; dole už dávno vyhasly nástěnné louče. Dveře věže nesou mosazný zámek. Západní schody klesají do krypty, severní stezka míří do jeskyně, most je na jihu.'},crypt:{title:'Krypta',art:4,exits:{e:'tower'},text:'V kryptě je taková tma, že sotva rozeznáš sloupy a obrys sarkofágu. Louče na stěnách dávno vyhasly. Ve vzduchu je cítit vlhký kámen. Schody na východ vedou zpátky na nádvoří.'},observatory:{title:'Síň posledního paprsku',art:5,exits:{s:'tower'},text:'Mezi trámy prasklé kopule svítí hvězdy. Dalekohled míří do tmy a na stole leží zápisník. Jižními dveřmi se vrátíš ven.'},cave:{title:'Jeskyně ledového čaroděje',art:6,exits:{s:'tower'},text:'Nad cestou se tyčí čaroděj na ledovém sloupu. Na jeho rouchu se otevírají oči. Kolem leží těla padlých ledových trpaslíků. Cesta se stáčí k temnému portálu vpravo nahoře. Zpět k věži se vrátíš na jih.'}};
const entities={
rope:{name:'lano s železným hákem',loc:'mill',portable:true,gender:'m',mat:'fiber',words:'lano lana lanu lanem provaz provazu provazem snura snuru rope',look:'Pevné konopné lano. Na jeho konci je připevněný těžký železný hák.',detail:'Hák je pevně spojený s lanem, jde o jeden předmět. Mohl by se zachytit za vzdálený pilíř. Lano vypadá dost dlouhé na propast.'},
oil:{name:'olejnička',loc:'mill',portable:true,gender:'f',mat:'metal',words:'olej oleje olejem olejnicka olejnicku olejnicky olejnicce olejnickou lahvicka lahvicku oil',look:'V plechové olejničce něco šplouchá.',detail:'Lampový olej. Na lucerně je stejně široké plnicí hrdlo.'},
lamp:{name:'lucerna',loc:'mill',portable:true,gender:'f',mat:'metal',words:'lucerna lucernu lucerny lucerne lucernou lampa lampu lampy svitilna svitilnu svetlo lantern lamp',look:'Stará lucerna s křesadlem na řetízku.',detail:'Křesadlo funguje. Suchý knot potřebuje olej, potom můžeš lucernu rozsvítit.'},
key:{name:'mosazný klíč',loc:'crypt',portable:true,gender:'m',mat:'metal',words:'klic klice klicem klici key',look:'Mosazný klíč se slunečním znakem.',detail:'Zuby klíče připomínají paprsky. Na věži je stejný znak.'},
lens:{name:'čočka',loc:'observatory',portable:true,gender:'f',mat:'glass',words:'cocka cocku cocky cocce cockou sklicko sklicka sklickem lens',look:'Těžká čočka v objímce dalekohledu.',detail:'Soustředí světlo do jediného horkého bodu. Lze ji vyjmout z objímky.'},
pod:{name:'tepelná kapsle',loc:'tower',portable:true,gender:'f',mat:'glass',words:'kapsle kapsli kapslou kapslem ampule ampuli ampulkou uhlik uhliku uhlikem pod thermal',look:'Skleněná kapsle uvnitř tiše září.',detail:'Tepelná kapsle uvolní svou energii po nárazu. Dokud ji nerozbiješ, nehřeje.'},
sword:{name:'meč',loc:'inventory',portable:true,gender:'m',mat:'metal',words:'mec mece mecem meci zbran zbrani zbranou sword',look:'Krátký meč, který sis vzal na cestu.',detail:'Ostrá čepel, ale malý dosah. Proti kouzlům ti sama o sobě nepomůže.'},
pendant:{name:'hvězdářův přívěsek',loc:'bridge',portable:true,gender:'m',mat:'metal',words:'privesek privesku priveskem amulet amuletu amuletem medailon medailonu medailonem',look:'Malý bronzový přívěsek, v jehož povrchu je vyryto sedm hvězd.',detail:'Na rubu přívěsku je nepatrný vryp. Nikdo ho nevyrobil jako talisman proti zimě; připomíná spíš drobný dárek, který člověk nosí celý život.'},
cryptLetter:{name:'složený lístek',loc:'crypt',portable:true,gender:'m',mat:'paper',words:'listek listku listkem dopis dopisu dopisem psani psani pergamen pergamenu pergamenem zaznam zaznamu',look:'Zažloutlý lístek je pečlivě přeložený. Na obálce je jen malý znak sedmi hvězd.',detail:'Písmo patřilo hvězdáři: „Ne všechno, co chráníme, lze zamknout. Až půjdu naposledy přes most, nechám na cestě znamení. Kdo je najde, ať si vzpomene i na toho, kdo čeká na rozcestí.“'},
coin:{name:'stříbrná mince',loc:'mill',portable:true,gender:'f',mat:'metal',words:'mince minci mincou stribrna stribrnou stribrne minci peniz penizkem',look:'Ohlazená stříbrná mince. Na jedné straně je sotva patrné mlýnské kolo.',detail:'Na rubu je stará, téměř setřená letopočtová značka. Proti mrazu ti nepomůže, ale někdo ji kdysi schoval jako něco cenného.'},
horseshoe:{name:'rezavá podkova',loc:'mill',portable:true,gender:'f',mat:'metal',words:'podkova podkovu podkovy podkove podkovou rezava rezavou podkovicka podkovicku',look:'Stará podkova s drobnými otvory po hřebech. Rez se mísí s leskem namrzlého železa.',detail:'Nad zápražím ji kdysi někdo pověsil pro štěstí. Zůstala na volném háčku a dá se opatrně sejmout.'},
bridge:{name:'most',loc:'bridge',gender:'m',mat:'wood',words:'most mostu mostem bridge',look:'Prkna chybí, ale kamenné pilíře stojí.',detail:'Mezeru nepřeskočíš. Lano s hákem by umožnilo bezpečný přechod.'},
pillar:{name:'pilíř',loc:'bridge',gender:'m',mat:'stone',words:'pilir pilire piliri pilirem kotevni anchor',look:'Pevný pilíř se širokou hlavicí.',detail:'Za hlavici vzdáleného pilíře můžeš zachytit hák. Druhý konec lana přivážeš zde.'},
chasm:{name:'propast',loc:'bridge',gender:'f',mat:'stone',words:'propast propasti propastem prurva prurvu chasm',look:'Hluboko dole se leskne zamrzlá voda.',detail:'Sestup by byl nebezpečný. Potřebuješ cestu přes propast, ne na její dno.'},
raven:{name:'havran',loc:'clearing',gender:'m',mat:'living',words:'havran havrana havranovi havranem ptak ptaka ptakem vrana vranu raven bird',look:'Havran tě sleduje jedním okem.',detail:'Na noze má kroužek se slunečním znakem. Možná patřil hvězdáři.'},
sign:{name:'rozcestník',loc:'clearing',gender:'m',mat:'wood',words:'rozcestnik rozcestniku cedule ceduli cedulku cedulka cedulce cedulkou ukazatel ukazatele sign',look:'MLÝN ←  MOST ↑',detail:'Na rubu je vyryto: „Hvězdář odpočívá pod věží. Klíč si nechal u sebe.“'},
door:{name:'dveře věže',loc:'tower',places:['tower','observatory'],gender:'p',mat:'wood',words:'dvere dveri dverim dvermi brana branu door',look:'Těžké dveře s mosazným zámkem.',detail:'Klíčová dírka má tvar slunce. Dveře jsou příliš pevné na vykopnutí.'},
lock:{name:'zámek',loc:'tower',gender:'m',mat:'metal',words:'zamek zamku zamkem dirka dirku dirky zamcena lock keyhole',look:'Zámek nese sluneční znak.',detail:'Potřebuješ správný klíč; kroucení mečem by mohlo poškodit čepel.'},
sun:{name:'sluneční kotouč',loc:'tower',gender:'m',mat:'stone',words:'kotouc kotouce kotouci kotoucem podstavec podstavce podstavci drzak drzaku drzaku slunce slunci sun sundial',look:'V kamenném kotouči září slabý paprsek slunce, který zde hvězdář uchoval ještě před příchodem noci.',detail:'V dutině je skleněná ampule. Nad ní kruhový držák čeká na čočku, která zachycené světlo soustředí.'},
tomb:{name:'sarkofág',loc:'crypt',gender:'m',mat:'stone',words:'sarkofag sarkofagu sarkofagem hrob hrobu hrobem viko vika viku vikem rakev rakve rakvi tomb coffin',look:'Na sarkofágu je sluneční znak.',detail:'Víko není zapečetěné. V jeho hraně jsou hluboké prohlubně pro ruce, ale bez vlastního světla je v temné kryptě nenajdeš.'},
book:{name:'zápisník',loc:'observatory',gender:'m',mat:'paper',words:'zapisnik zapisniku zapisnikem kniha knihu knihy knize knizka knizku denik deniku svitek svitku book notes',look:'Zápisník hvězdáře je otevřený.',detail:'Na stránkách jsou výpočty, kresby noční oblohy a několik podtržených slov o posledním paprsku. Pod jedním nákresem je poznámka: „I zimě můžeš něco vzít. Musíš však vědět co.“'},
scope:{name:'dalekohled',loc:'observatory',gender:'m',mat:'metal',words:'dalekohled dalekohledu dalekohledem teleskop teleskopu objimka objimky telescope',look:'Mosazný dalekohled míří skrz kopuli.',detail:'Čočku z přední objímky lze vyjmout. Ostatní části jsou pevně přišroubované.'},
wizard:{name:'ledový čaroděj',loc:'cave',gender:'m',mat:'living',words:'carodej carodeje carodeji carodejem kouzelnik kouzelnika kouzelnikovi kouzelnikem strazce strazci strazcem wizard sorcerer',look:'Čaroděj stojí na ledovém sloupu. Čtyři oči v jeho modrém těle tě nepřestávají sledovat, zatímco se žezlo chvěje.',detail:'Čaroděj tě pozoruje ze sloupu tak vysoko, že na něj čepelí nedosáhneš. Čtyři velké oči se pohybují nezávisle na sobě, další menší oko vykukuje z ledového hřebene nad nimi. Na kameni pod ním nevidíš žádné stopy.'},
scepter:{name:'ledové žezlo',loc:'cave',gender:'n',mat:'ice',words:'zezlo zezla zezlu zezlem hul hole holi scepter staff',look:'Na vrcholu žezla se otáčí ledová hvězda.',detail:'Čaroděj drží žezlo mimo tvůj dosah. Ve hvězdě se hromadí chlad.'},
ice:{name:'ledový sloup',loc:'cave',gender:'m',mat:'ice',words:'led ledu ledem sloup sloupu sloupem pillar ice',look:'Vysoký sloup z ledu nese čaroděje.',detail:'Po průsvitných stěnách sloupu se sunou drobné stříbrné praskliny. Led se zdá pevný, přesto jím občas proběhne chvění, jako by něco uvnitř dýchalo.'},
dwarfs:{name:'padlí trpaslíci',loc:'cave',gender:'p',mat:'body',words:'trpaslici trpasliku trpaslik trpaslika trpasliky tela tel telo telem mrtvola mrtvoly mrtvolu dwarf dwarfs dwarves bodies',look:'Na stezce leží padlí ledoví trpaslíci.',detail:'Jejich výbava přimrzla ke skále. Jsou varováním před čarodějovým žezlem.'},
portal:{name:'portál',loc:'cave',gender:'m',mat:'stone',words:'portal portalu portalem vchod vchodu vstup vstupu entrance exit',look:'Vpravo nahoře je temný průchod.',detail:'Za portálem se ozývá vítr. Cestu k němu ovládá čaroděj.'},
wheel:{name:'mlýnské kolo',loc:'mill',gender:'n',mat:'wood',words:'kolo kola kolem wheel',look:'Mlýnské kolo stojí v zamrzlém náhonu.',detail:'Lopatky jsou přimrzlé. Než povolí mráz, kolo se nepohne.'},
table:{name:'stůl',loc:'mill',places:['mill','observatory'],gender:'m',mat:'wood',words:'stul stolu stole stolem stolek stolku table',look:'Hrubý pracovní stůl.',detail:'Nese jen to, co na něm vidíš. Tajnou zásuvku nenajdeš.'}
};
const verbs={look:'podivej podivat koukni kouknete kouknout mrkni mrknout koukat koukam divat podivam podivejte look l',inspect:'prozkoumej prozkoumat prozkoumam prozkoumejte prohledni prohlednete prohlidni prohlidnout prohlednout prohlizej prohledej prohledat prohledam zkoumej zjisti examine inspect search x',take:'vezmi vezmete vezmu vzit vem vemte seber sebrat seberu zvedni zvednout zvednu ber sbirej take get grab collect pick vyjmi vyjmout vyndej vyndat sejmout sundej sundat',drop:'pust pustit pustim poloz polozit odloz odlozit zahod zahodit drop discard',use:'pouzij pouzit pouziju pouzivej vyuzij vyuzit use apply',open:'otevri otevrit otevru otevrete odklop odklopit otevirej open',close:'zavri zavrit zavru zavrete priklop priklopit close shut',unlock:'odemkni odemknout odemknu odemknete unlock',lock:'zamkni zamknout zamknu lock',light:'zapal zapalit zapalim zapalte rozsvit rozsvitit rozsvitim rozsvette rozzni rozznout zapni zapnout light ignite',extinguish:'zhasni zhasnout zhasnu vypni vypnout uhas uhasit sfoukni sfouknout extinguish',fill:'napln naplnit naplnim nalij nalit naliju nalej nalejt dolij dolit dolej dopln doplnit prelij prelit fill pour',tie:'uvaz uvazat uvazu privaz privazat privazu pripevni pripevnit zahakni zahaknout uchyt uchytit tie attach fasten',untie:'rozvaz rozvazat odvaz odvazat uvolni uvolnit untie detach',insert:'vloz vlozit vlozim vlozte dej dat dam davej strc strcit nasad nasadit zasun zasunout umisti umistit insert put place',throw:'hod hodit hodim hodte vrhni vrhnout mrskni mrstit throw toss',melt:'rozpust rozpustit rozpustim roztav roztavit rozmraz rozmrazit zahrej zahrat melt heat thaw',push:'odsun odsunout odsuneme posun posunout zatlac zatlacit tlac tlacit odtlac odtlacit push move',pull:'tahni tahnout zatahej zatahnout vytahni vytahnout pull',read:'precti precist prectu cti cist prectete read',talk:'mluv mluvit promluv promluvit oslov oslovit zeptej zeptat povidej pokecej zavolej zavolat talk speak ask greet',go:'jdi jit jdu jdete bez bezte vydej vyraz pokracuj prejdi prejit vrat vratit go walk travel enter',climb:'vylez vylezt vysplhej splhej splhat lez lezt slez slezt climb',jump:'skoc skocit preskoc preskocit skakej jump leap',cut:'rizni riznout rozrizni rozriznout prerez prerezat prerizni preriznout usekni useknout sekni seknout cut slice chop',attack:'utoc utocit zautoc zautocit uder uderit prast prastit kopni kopnout rozbij rozbit zasahni zasahnout zabij zabit attack hit kill kick break',touch:'dotkni dotknout sahni sahnout osahej osahat pohlad pohladit touch feel stroke',listen:'poslouchej poslouchat naslouchej naslouchat slysim listen hear',smell:'pricichni pricichnout ocichej ocichat cuchni cuchat smell sniff',taste:'ochutnej ochutnat olizni oliznout taste lick',eat:'snez snist jez jist eat',drink:'vypij vypit pij pit drink',wait:'cekej cekat pockej pockat wait',sit:'sedni sednout sed sedet sit',stand:'vstan vstat stand',sleep:'spi spat usni usnout sleep',give:'daruj darovat podej podat dej dat give offer',wear:'oblec oblect oblekni nasad nasadit vybav vybavit wear equip',help:'pomoc napoveda help hint',inventory:'inventar inventory inv batoh vak kapsy i',map:'mapa map',undo:'zpet undo',save:'ulozit uloz save',load:'nacist nacti load',restart:'restart reset'};
const extraVerbs={"look": "koukej podivejme porozhledni porozhlednout obhledni", "inspect": "prozkoumavej prozkoumat prohlizet prohlidnout obhlidni obhlidnout omrkni omrknout zkontroluj zkontrolovat prover proverte over overit ohledej ohledat propatrej propatrat probadej probadat", "take": "sebral sebrala vzal vzala popadni popadnout popadnu uchop uchopit uchopim zvednete posbirej posbirat posbiram sesbirej sesbirat sbirej sbirat vyzvedni vyzvednout odnes odnest odeber odebrat vytahnete vyndat vytahnout", "drop": "odhod odhodit odhodim upust upustit upustim odlozim polozim polozte odkladej zahazuji vyhod vyhodit", "use": "pouzivejte pouzijte pouzit uplatni aplikuj aplikovat vyuziju vyuzijte", "open": "pootevri pootevrit rozevri rozevrit odklopte otevreme otevirejte", "close": "privri privrit zaklapni zaklapnout zavirej zavirejte uzavri uzavrit", "unlock": "odemikej odemikat odemkneme odjisti odjistit", "lock": "zamknete zamkneme uzamkni uzamknout zajisti zajistit", "light": "rozzni rozzhnout rozzhni rozzhavit zazehni zazehnout rozzehni rozzehnout rozsviceni zapaleni zapalme", "extinguish": "uhaste uhaste zhasnete zhasnout sfouknete zhasnuti", "fill": "naplnte naplnime doplnte dolejte nalejte dolijte nalijte dolejt doplnim napust napustit", "tie": "privazte uvazte pripevnete upevni upevnit upevnete omotej omotat zahaknete zaklesni zaklesnout zachyt zachytit", "untie": "odvazte rozvazte odpoj odpojit odepni odepnout odvazej odmotat odmotej", "insert": "vlozme zastrc zastrcit zastrcim zasunte vsun vsunout vsad vsadit upevnete umistete polozte", "throw": "hodime hodit hodte mrsknete mrsknout svihni svihnout vymrst vymrstit vrhnete hodim", "melt": "rozmrazte rozehrej rozehrat ohrej ohrat ohrejte roztop roztopit rozehrejte rozmrazim roztavte rozpustte", "push": "odsunout odsunte posunte odstrc odstrcit odval odvalit odhrn odhrnout odtiskni zatlacte poodsun poodsunout", "pull": "pritahni pritahnout potahni potahnout tahat zatahnout zatahneme vytahnete", "read": "prectete precist prelistuj prolistuj prolistovat listuj lusti vylusti precist", "talk": "pozdrav pozdravit zdravim ahoj nazdar zeptejme popovidej popovidat pohovor pohovorit oslovte promluvte zavolejte vyzpovidej vyzpovidat vyptavej vyptavat", "go": "dojdi dojit prejdi prejdete prejit odkracej odejdi odejit vydejme vyrazit vyrazime vyrazte vratme vratte vyjdi vyjit projdi projit probehni probehnout utikej utikat kracej kracet pobez", "climb": "vysplhat vysplhejme vysplhejte prelez prelezt vylezte slezte slezt seplhej seplhat", "jump": "preskocte doskoc doskocit vyskoc vyskocit seskoc seskocit skakejte", "cut": "preriznete prerezni rozsekni rozseknout presmikni presmiknout useknete seknete sekat rezat", "attack": "uderme uderte prastete napadni napadnout bodni bodnout bodat probodni probodnout sejmi znic znicit rozmlat rozmlatit prasti bouchnout bouchni kopnete nakop nakopnout", "touch": "pohladte pohladit pohladim pohladkani ohmatej ohmatat hmatej dotek", "listen": "poslouchejte naslouchejte zaposlouchej zaposlouchat poslouchani", "smell": "ocuchej ocuchat privon privonet privonej pricichnete cuchani", "taste": "ochutnejte oliz oliznout lizni liznout ochutnavat", "eat": "snezt zkonzumuj zkonzumovat sezrat sezer sneste ochutnat", "drink": "napij napit napijte lokni loknout vypijte", "wait": "vyckej vyckat vyckejte pockejte vyckame cekejte postuj postat", "sit": "posed posedet odpocin odpocinout odpocivej odpocivat sednete", "stand": "vstante postav postavit narovnej narovnat", "sleep": "zdriemni zdriimni zdrimni zdrimnout vyspi vyspat usnete", "give": "nabidni nabidnout venuj venovat predej predat podejte darujte", "wear": "obleknout oblecte obleknete navlec navlect vystroj vystrojit", "help": "rada rady prikazy slovnik ovladani pomocnik", "inventory": "vybava vybaveni zavazadlo kapsa kapsicky", "map": "plan planek", "undo": "zpetny undo", "restart": "restartuj restartovat"};
for(const [id,ws] of Object.entries(extraVerbs))verbs[id]+=" "+ws;
const extraNouns={"rope": "snury snurou provazek provazku provazkem provazky hak hakem haku", "oil": "olejicku olejicek olejickem lahvicky lahvicce lahvickou olejnickach", "lamp": "lampou lampe svitilny svitilne svitilnou lucernicka lucernicku lucernickou", "key": "klicek klicku klickem", "lens": "cockach sklo skla sklem optika optiku optikou", "pod": "ampulka ampulku ampulce ampulky kapslicka kapslicku kapslickou kapslemi", "sword": "cepel cepeli cepele mecik mecikem", "raven": "havrane krkavec krkavce krkavci krkavcem ptaku ptacku ptacek ptacka ptackem vrany vrane vranou", "sign": "smerovka smerovku smerovce smerovky napis napisu tabule tabuli", "door": "vrata vrat vraty branou brane", "lock": "zamecek zamecku zameckem dirce dirkou", "sun": "kotoucem podstavcem drzaku drzakem cifernik ciferniku cifernikem", "book": "zapisnicky zapisky zapisku zapiskum zapisky denicek denicku denickem knihou knizkou knizce", "wizard": "mag maga magovi magem carodejnik carodejnika carodejnikovi kouzelniku kouzelnicek", "scepter": "hulka hulku hulkou hulce", "dwarfs": "trpaslikum trpaslicim mrtvolam telum neboztici neboztiku", "portal": "pruchod pruchodu pruchodem", "tomb": "nahrobek nahrobku nahrobkem sarkofazy hrobka hrobku hrobky"};
for(const [id,ws] of Object.entries(extraNouns))entities[id].words+=" "+ws;
entities.millDoor={name:'dveře mlýna',loc:'mill',gender:'p',mat:'wood',
 words:'dvere dveri dverim dvermi vrata vrat vraty vstup vchod',look:'Silné dubové dveře jsou zavřené.',detail:'Dveře jsou zevnitř zapřené těžkou závorou. Vstup do opuštěné budovy není průchozí; mlynář nechal vybavení venku na pracovním stole.'};
for(const [intent,ws]of Object.entries(adventureLanguage.verbs))verbs[intent]=(verbs[intent]||'')+' '+norm(ws);
for(const [id,name,mat,where,words,look,detail]of adventureLanguage.scenery)entities[id]={name,mat,loc:where.split(' ')[0],places:where.split(' '),words,look,detail,scenery:true};
const wordIntent=new Map();for(const [intent,ws] of Object.entries(verbs))for(const w of ws.split(' '))if(!wordIntent.has(w))wordIntent.set(w,intent);
const initial=()=>({room:'clearing',previous:null,spot:null,inv:['sword'],flags:{},dropped:{},turn:0,won:false,lost:false,lastEntity:null,lastWorld:null,visited:['clearing'],hints:{},caveHits:0,wizard:{approaches:0,exchanges:0,topics:{}},raven:{met:false,trust:0,thanks:0,greetings:0,apologies:0,harmed:0,lastProgress:0,epilogueDone:false,helpOffered:0,helpAsked:0,promiseMade:false,lastAsideAt:0,asideCount:0,pending:null,topics:{}}});let state=initial(),undo=[],history=[],historyIndex=0,pending=null,effect=null,walkStart=0,crtEnabled=false,scopeView=false,journalView=false,ravenEmote={start:-10000,kind:'idle'},lastPlayerInputAt=Date.now();const f=()=>state.flags,has=id=>state.inv.includes(id),gameAudio=typeof window==='undefined'?null:window.lastLightAudio;
function visible(id){if(!entities[id])return false;if(has(id))return true;if(id==='pendant'&&!f().pendantRevealed)return false;if(id==='coin'&&!f().crateBroken)return false;if(id==='cryptLetter'&&!f().cryptChestOpen)return false;if(id==='rope'&&state.room==='bridge'&&f().bridge&&!state.dropped.rope)return true;if(id==='lens'&&state.room==='tower'&&f().lensInSun)return true;if(state.dropped[id])return state.dropped[id]===state.room;if(entities[id].places){if(!entities[id].places.includes('*')&&!entities[id].places.includes(state.room))return false;}else if(entities[id].loc!==state.room)return false;if(state.room==='crypt'&&!f().lit&&id==='key')return false;if(id==='key')return f().tomb&&!f().keyTaken;if(id==='pod')return f().charged&&!f().podTaken;if(entities[id].portable)return !f()[id+'Taken'];return true}
function log(t,c=''){if(c!=='cmd')lastReply=t;let p=document.createElement('p');p.textContent=t;p.className=c;$('log').append(p);$('log').scrollTop=$('log').scrollHeight}
function dialog(title,text){$('dialogTitle').textContent=title;$('dialogBody').textContent=text;$('dialog').showModal()}
function persist(){try{localStorage.setItem('lastlight-v04',JSON.stringify(state))}catch(e){}}
function sync(){$('place').textContent=rooms[state.room].title.toUpperCase();$('turn').textContent='TAH '+state.turn;$('inventory').textContent='VAK: '+state.inv.map(x=>entities[x].name).join(' · ')+(f().lit?' · lucerna svítí':'');gameAudio?.setScene(state.room,state.won);persist()}
function describe(){
 if(state.won){
  log({clearing:'Na rozcestí se ještě drží sníh. Mezi smrky ale voní vlhká hlína a z cedule se ozve známé kráknutí. Havran je stále tady. K mlýnu vede cesta na západ, k mostu na sever.',mill:'Mlýnské kolo je pořád zledovatělé, ale hluboko pod ním už zurčí první voda. Dubové dveře zůstávají zavřené. Na východ vede cesta k rozcestí.',bridge:'Přes propast vede tvé pevně uvázané lano. Z útesů po kapkách stéká tající led. Za mostem na sever stojí věž, na jihu se vrátíš k havranovi.',tower:'Kamenné nádvoří pomalu osychá. Věžní dveře jsou '+(f().door?'otevřené':'zavřené')+'. Západní schodiště vede ke kryptě, cesta na sever do jeskyně a most je na jihu.',crypt:'V kryptě je pořád chladno a ticho. Hvězdářův sarkofág zůstává na svém místě. Zpět na nádvoří vede východní schodiště.',observatory:'Skrz prasklou kopuli proniká první příslib rána. Mosazný dalekohled a hvězdářův zápisník zůstávají na svých místech. Jižní cestou sestoupíš na nádvoří.',cave:'Ledová vláda skončila. Z portálu proudí svítání a první kapky dopadají na cestu. Zpět k věži vede cesta na jih.'}[state.room]);return;
 }
 let d=rooms[state.room].text;
 if(state.room==='mill')d='Zamrzlé mlýnské kolo mlčí. Těžké dubové dveře jsou zavřené a zevnitř zapřené. U zdi stojí pracovní stůl.'+(visible('rope')?' Na trámu visí smotané lano s těžkým železným hákem na konci.':'')+' Na východě se vrátíš na rozcestí.';
 if(state.room==='cave')d='Nad ledovou cestou se na vysokém sloupu tyčí modrý čaroděj. Čtyři velké oči se na tebe upírají z jeho těla a páté vykukuje z ledového hřebene. V levé ruce svírá žezlo s růžově zářící hvězdou. Kolem leží padlí ledoví trpaslíci; cesta pokračuje k temnému portálu vpravo nahoře, zpět k věži na jih.';
if(state.room==='observatory')d='Do prasklé kopule proniká měsíční světlo. Uprostřed stojí mosazný dalekohled s okulárem, napravo pracovní stůl se zápisníkem. Jižními dveřmi se vrátíš ven.';
 log(d);
 if(state.room!=='crypt'||f().lit){
  const vista=globalThis.adventureWorld117?.glimpse(state.room,f());if(vista)log(vista);
 }
 if(state.room==='crypt')log(f().lit?'Světlo tvé lucerny dopadá na kamenné reliéfy a úchyty víka. Sarkofág je '+(f().tomb?'otevřený.':'zavřený.'):'Bez lucerny saháš do tmy. Žádný z držáků pochodní nehoří.');
 if(state.room==='bridge'&&f().bridge)log('Mezi pilíři drží napnuté lano; cesta na sever je nyní bezpečná.');
 if(state.room==='bridge'&&f().pendantRevealed&&!f().pendantTaken)log('Ve skalní dutině na hraně útesu je vidět drobný bronzový přívěsek.');
 if(state.room==='crypt'&&f().lit&&f().cryptChestOpen)log(f().cryptLetterTaken?'Ve výklenku zůstala otevřená prázdná okovaná schránka.':'Ve výklenku je vypáčená okovaná schránka s úhledně složeným lístkem.');
 if(state.room==='mill'&&f().crateBroken)log('Pod stolem leží rozštípnuté zbytky staré bedýnky.');
 if(state.room==='mill'&&f().millDoorScars)log('V dubových dveřích zůstává čerstvý zásek od tvého meče.');
 if(state.room==='tower'&&f().door)log('Věžní dveře jsou otevřené. Můžeš vstoupit do observatoře.');
}
const replyCounts={};
function sayVariant(key,lines){let n=replyCounts[key]||0;replyCounts[key]=n+1;log(lines[n%lines.length]);}
function towerEntryReaction(topic){
 state.lastEntity='door';
 if(f().door){
  log(topic==='window'||topic==='climb'?'Zkoušíš očima najít cestu nahoru, ale pak se zarazíš. Vždyť věžní dveře už stojí otevřené. Stačí projít.':'Věžní dveře už jsou otevřené. Není důvod je dál dobývat.');return;
 }
 if(f().doorUnlocked&&topic==='push'){
  f().door=true;state.spot='door';walkStart=performance.now();
  log('Opřeš se do dveří. Tentokrát povolí: zámek už není zajištěný. Těžké křídlo zaskřípe a otevře cestu do věže.','good');
  gameAudio?.cue('key');effect={type:'reach',start:performance.now()};return;
 }
 const locked=f().doorUnlocked?'odjištěné, ale těžké':'zamčené';
 if(topic==='kick'){
  sayVariant('tower:kick',[
   'Rozběhneš se a vší silou kopneš do věžních dveří. Podrážka zaduní o silné dřevo. Zámek ani panty nepovolí; ucouvneš s bolavým chodidlem.',
   'Zkusíš to znovu, tentokrát blíž k zámku. Mosazné kování zazvoní, ale dveře se sotva zachvějí. Bolest ti vystřelí až ke kolenu.',
   'Třetí kopnutí už je spíš projev vzdoru. Ze schodů se sesype trochu jinovatky. Za dveřmi je stále ticho. Botu raději šetříš.'
  ]);
  effect={type:'attack',start:performance.now()};return;
 }
 if(topic==='batter'){
  sayVariant('tower:batter',[
   'Rozběhneš se proti věžním dveřím a vrazíš do nich ramenem. Ozve se tupá rána. Dřevo vydrží a ty se s bolestivým nádechem odrazíš zpátky na schody.',
   'Opět narazíš do dveří. Z mosazného kování se sesype jinovatka, ale sluneční zámek zůstává pevně uzavřený. Rameno protestuje.',
   'Znovu se chystáš k nárazu, ale naposledy se zapřeš spíš opatrně. Dveře drží. Další prudký útok by zlomil něco na tobě, ne na věži.'
  ]);
  effect={type:'attack',start:performance.now()};return;
 }
 if(topic==='prySword'||topic==='keyholeSword'){
  const key=topic==='keyholeSword'?'tower:keyholeSword':'tower:prySword';
  sayVariant(key,topic==='keyholeSword'?[
   'Přiložíš špičku meče ke sluneční klíčové dírce. Je příliš úzká a jemná; čepel nedostaneš k západce. Na mosazi jen zůstane drobný škrábanec.',
   'Zkusíš meč trochu pootočit, ale hrot narazí na pevnou přepážku. Kdybys zabral víc, ulomíš špičku dřív, než pohneš zámkem.'
  ]:[
   'Zasunuješ čepel mezi křídlo a kamenné ostění. Mosazný štít zámku brání najít páku; meč se nebezpečně prohne. Raději tlak povolíš.',
   'Zkusíš ostří u pantů. Ty jsou zapuštěné hluboko do kamene. Kov o kov bolestivě zaskřípe, ale vrata se ani nehnou.',
   'Meč není páčidlo. Po dalším pokusu máš v dlani jen otlačený jílec a před sebou stále '+locked+' dveře.'
  ]);return;
 }
 if(topic==='pry'){
  sayVariant('tower:pry',[
   'Prohlédneš spáru kolem zámku a zkusíš se do ní dostat prsty. Je příliš úzká. Železné panty jsou ukotvené hluboko v kameni.',
   'Zapřeš se za okraj křídla, ale nenajdeš žádné místo, kde bys dokázal dveře nadzvednout. Starý stavitel svou práci odvedl dobře.'
  ]);return;
 }
 if(topic==='cut'){
  sayVariant('tower:cut',[
   'Sekneš do silného dřeva. Zůstane jen světlá rýha; mosazné pásy drží prkna pohromadě. Takto se dovnitř neprosekáš.',
   'Další úder odštípne třísku. Za křídlem však stále drží zámek a meč bys rychle otupil.'
  ]);effect={type:'attack',start:performance.now()};return;
 }
 if(topic==='push'){
  sayVariant('tower:push',[
   'Opřeš dlaně o dveře a pomalu zatlačíš. Pod vahou tvého těla slabě zapraská dřevo, ale zamčený zámek nepovolí.',
   'Zkusíš vzít za kliku a trhnout. Ozve se jen krátké kovové cvaknutí; západka zůstává zajištěná.',
   'Zatlačíš celou vahou. Věž se ani nehne. Tohle není překážka, kterou překonáš silou.'
  ]);return;
 }
 if(topic==='window'){
  sayVariant('tower:window',[
   'Obejdeš patu věže a zadíváš se nahoru. Vysoko ve zdi jsou úzké okenní otvory, ale od země k nim nevede žádná římsa ani schodiště. Okno, kterým by ses protáhl, odsud nedosáhneš.',
   'Zkoušíš najít nižší okénko či uvolněnou okenici. Kámen je hladký a pokrytý ledem; všechny otvory jsou daleko nad hlavou. Vrátíš se před dveře.'
  ]);return;
 }
 if(topic==='climb'){
  sayVariant('tower:climb',[
   'Prohlédneš si stěnu věže od paty až po střechu. Kamenné bloky jsou sevřené bez širších spár a nahoře je obaluje led. Bez opory nevylezeš ani k prvnímu oknu.',
   'Zkusíš se vytáhnout za vystouplý kámen. Rukavice ti podklouzne na námraze a seskočíš zpátky na nádvoří. Věž nemá přístupný průlez zvenčí.'
  ]);return;
 }
 if(topic==='wall'){
  sayVariant('tower:wall',[
   'Oťukáš zdivo věže. Kameny drží pevně a pod mrazem jsou spojené téměř jako jediný blok. Tudy žádný rychlý otvor neuděláš.',
   'Zkusíš prohlédnout patu zdi, zda v ní není dutina. Nacházíš jen promrzlou hlínu a neporušený kámen.'
  ]);return;
 }
 if(topic==='fire'){
  sayVariant('tower:fire',[
   'Vybavíš si, jak silné jsou dveře a jak blízko stojí staré trámy věže. Navíc mokré, namrzlé dřevo jen tak nechytne. Oheň by mohl zničit právě to, co zde hledáš.',
   'Mráz zalézá do spár a z dřeva stéká voda. Pokus o zapálení nic nevyřeší; necháš věž v klidu.'
  ]);return;
 }
}
function localNPC(){return state.room==='clearing'?'raven':state.room==='cave'&&!state.won?'wizard':null}
function ravenMemory(){if(!state.raven)state.raven=initial().raven;return state.raven;}
function wizardMemory(){if(!state.wizard||typeof state.wizard!=='object')state.wizard={approaches:0,exchanges:0,topics:{}};if(!state.wizard.topics||typeof state.wizard.topics!=='object')state.wizard.topics={};return state.wizard;}
function ravenSocial(kind){
 const b=ravenMemory(),lines=adventureReactions.ravenSocial[kind]||adventureLanguage.social[kind];
 ravenEmote={start:performance.now(),kind};
 if(kind==='thanks'||kind==='hello')gameAudio?.cue('raven');
 b.met=true;
 if(kind==='thanks'){
  b.thanks++;if(b.thanks<=2)b.trust=Math.min(8,b.trust+1);
  if(state.won&&b.epilogueDone){sayVariant('raven-after:thanks',[
   'Havran se zarazí. „Ne. Tentokrát děkuji já tobě. Vrátil jsi údolí něco, co už jsem si skoro nedovolil pamatovat.“',
   '„Za co mi děkuješ?“ zeptá se měkce. „Já jen seděl na ceduli. Ty jsi šel dál.“',
   'Havran tiše krákne. „Tak dobře. Poděkujeme si navzájem a budeme tomu říkat přátelství.“']);return;}
  if(b.harmed>b.apologies&&b.thanks===1){log('Havran tě ostražitě pozoruje. „Za slova děkuji. Ale tvoje ruka by si mohla příště odpustit meč.“');return;}
  if(b.thanks>=3&&b.thanks%3===0){log('Havran sklopí zobák. „Víš, dlouho mi nikdo nepoděkoval víckrát než jednou. Asi tu zůstanu, dokud se nevrátíš.“');return;}
  const topic=state.dialogue?.room==='clearing'&&state.dialogue?.speaker==='raven'?state.dialogue.topic:null;
  if(topic==='crypt'&&b.thanks>1){log('„Za hvězdáře nemusíš děkovat,“ zašeptá havran. „Byl to můj přítel. Jen buď u jeho hrobu opatrný.“');return;}
  if(topic==='bridge'&&f().bridge){log('„Uzly jsi uvázal sám,“ řekne havran. „Za to vděčíš svým rukám. Ale děkuji, že sis na mě vzpomněl.“');return;}
 }
 if(kind==='hello'){b.greetings++;if(b.greetings===1)b.trust=Math.min(8,b.trust+1);}
 if(kind==='sorry'){
  const genuinelyHurt=b.harmed>b.apologies;
  if(genuinelyHurt){b.apologies++;b.trust=Math.min(8,b.trust+1);}
  if(genuinelyHurt&&b.harmed&&b.apologies===1){log('Havran na chvíli odvrátí hlavu. „Meč si pamatuji. Ale omluvu také. Dám ti ještě šanci.“');return;}
 }
 if(kind==='bye'){delete state.dialogue;b.pending=null;}
 sayVariant('raven-social:'+kind,lines);
}
function ravenReturn(){
 const b=ravenMemory();if(!b.met&&!has('pendant'))return;
 if(has('pendant')&&!b.pendantSeen){
  b.met=true;b.pendantSeen=true;b.trust=Math.min(8,b.trust+1);
  log('Havran se náhle zarazí. Z výšky se zadívá na přívěsek ve tvé dlani. „Hvězdář ho nikdy nesundával. Ani když spal.“');
  log('Sletí na nejnižší větev. „Myslel jsem, že ho má pořád u sebe.“ Pak se dlouho dívá směrem k mostu.');
 }
 if(b.awaitingReturn){
  b.awaitingReturn=false;b.returns=(b.returns||0)+1;
  if(b.promiseMade&&!b.promiseHonored){
   b.promiseHonored=true;b.trust=Math.min(8,b.trust+2);
   log('Havran se napřímí. „Pamatoval jsem si tvoje slovo. A ty jsi ho dodržel.“ Poprvé k tobě popoletí sám.');
  }else if(b.returns===2&&b.trust>=3)log('Havran si tě všimne dřív, než dojdeš k ceduli. „Zase ty,“ zakráká. Tentokrát v tom zní radost.');
 }
 if(state.won&&!b.epilogueDone){
  b.epilogueDone=true;ravenEmote={start:performance.now(),kind:'recognize'};
  gameAudio?.cue('raven');
  log('Havran tě zpočátku jen pozoruje. Potom se z dalekých hor ozve slabé zahřmění tajícího ledu. „Takže... tys to opravdu dokázal,“ hlesne.');
  if(b.trust>=3)log('Seskočí z cedule skoro až k tvým botám. „Já na tebe čekal,“ přizná. „Nevěděl jsem, jestli se vrátíš. Ale čekal jsem.“');
  else log('Havran pokývne hlavou. „Hvězdář by měl radost. A já mám také.“');
  log('Ze stromu ukápne voda. Havran se na chvíli zadívá k věži. „Ráno,“ řekne tiše, jako by to slovo zkoušel po mnoha letech znovu.');
  return;
 }
 const progress=f().charged?6:f().lensTaken?5:f().doorUnlocked?4:f().keyTaken?3:f().bridge?2:has('rope')?1:0;
 if(progress<=b.lastProgress)return;b.lastProgress=progress;ravenEmote={start:performance.now(),kind:'recognize'};
 if(progress>=6)log('Havran zahlédne světlo odrážející se od tvé výstroje. „Ty jsi našel hvězdářův poslední paprsek! Snad to ještě stihneme.“');
 else if(progress>=4){b.pending={kind:'towerRecognition'};log('Havran si tě přeměří. „Ten sluneční znak už znám. Dokázal ses dostat do věže, že?“');}
 else if(progress>=2)log('„Vrátil ses přes most,“ poznamená havran, tentokrát bez žertu. „Takže lano opravdu drží. Jsem rád.“');
 else log('Havran zahlédne hák u tvého pasu. „Tak jsi ve mlýně něco našel. Dobře. Dávej pozor na uzly.“');
}
// Havran občas sám přeruší dlouhé ticho. Nikdy nepřeruší psaný příkaz,
// rozehranou otázku ani rozhovor; stejné poznámky neopakuje hned po sobě.
function maybeRavenAside(){
 const b=ravenMemory(),now=Date.now();
 if(document.hidden!==true&&state.room==='clearing'&&b.met&&!state.lost&&!b.pending&&!pending&&
    now-lastPlayerInputAt>75000&&(!b.lastAsideAt||now-b.lastAsideAt>170000)){
  const pool=state.won?adventureReactions.ravenAsides?.spring:adventureReactions.ravenAsides?.winter;
  if(pool?.length){
   log(pool[b.asideCount%pool.length]);b.asideCount++;b.lastAsideAt=now;
   ravenEmote={start:performance.now(),kind:'talk'};lastPlayerInputAt=now;
   gameAudio?.cue('raven');persist();
  }
 }
 setTimeout(maybeRavenAside,19000);
}
// Otázky na cestu nejsou příkazy k chůzi. A osobní otázky havranovi
// mají přednost před běžným slovníkem sloves a doplňujícími otázkami.
const ravenDeepTopics=[
 ['waitingTime',/\b(jak (?:dlouho|douho) (?:tu|tady|na ceste) (?:jsi|sedis|cekas|budes|zustanes)|jak dlouho (?:jeste )?(?:budes cekat|tu zustanes|jeste zustanes|se chystas cekat)|jak (?:dlouho|douho) uz cekas|kolik let tu cekas|kolik let tu jsi|jak dlouho jeste budes cekat)\b/],
 ['duty',/\b(musis (?:tu|tady) (?:byt|zustat)|proc (?:tu|tady) musis (?:byt|zustat)|(?:ty )?nevis proc (?:tu|tady) musis (?:byt|zustat)|kdo te tu drzi|kdo te tu nuti|proc nemuzes odejit|nesmis odejit|muzes odejit|proc tu porad sedis|proc ses rozhodl zustat|mas povinnost tu byt|co kdybys odletel|co kdybys odesel)\b/],
 ['bridgeSafety',/\b(je (?:ten |tento )?most (?:bezpecny|nebezpecny|pevny)|je (?:ten |tento )?most (?:jeste )?bezpecny|jak (?:bezpecny|nebezpecny) je most|muze se most zritit|spadnu z mostu|je prechod pres most nebezpecny|muze me most unest|udrzi me most|mam se bat mostu|je bezpecne prejit most|prejdu most bezpecne)\b/],
 ['danger',/\b(je (?:to|tam|tady) nebezpecne|neni to nebezpecne|jak moc je to nebezpecne|hrozi mi nebezpeci|jsem v nebezpeci|co mi hrozi|bojim se ze spadnu|je tam nebezpecno)\b/],
 ['stargazer',/\b(kdo (?:vlastne )?(?:je|byl) hvezdar|kym (?:je|byl) hvezdar|jaky (?:byl|je) hvezdar|co pro tebe (?:byl|znamenal|znamena) hvezdar|co ti (?:hvezdar udelal|udelal hvezdar)|proc jsi mel hvezdare rad|mel te hvezdar rad|hvezdar te mel rad|byl hvezdar (?:dobry|zly|hodny|spravedlivy|moudry)|jaky to byl clovek|jaky byl jako clovek|co bylo na hvezdari dobre|co bylo na hvezdari spatne|mel hvezdar chyby|jake mel hvezdar chyby|proc ti hvezdar tolik chybi|proc ses na hvezdare zlobil)\b/],
 ['mission',/^(?:co je (?:muj|moje|nas|nasim|mym) (?:ukol|poslani|cilem)|co je mym ukolem|co je mym poslanim|jaky (?:mam|je muj) (?:ukol|quest|cil)|jaky mam vlastne ukol|jake je me poslani|jakou mam misi|jaky je muj quest|mam (?:tu|tady|vubec )?neco delat|co mam (?:ted |tedy |dal )?(?:delat|udelat)|co se ode me ceka|co mam dokazat|proc jsem (?:sem|tady|tu)|co je smyslem me cesty|jak mam pokracovat|nevim kam jit)\??$/],
 ['askHelp',/\b(pomuzes mi|pomohl bys mi|muzes mi pomoct|muzes mi pomoci|mohl bys mi pomoct|pomoz mi|poradis mi|porad mi|potrebuji (?:tvoji |nejakou )?(?:pomoc|pomoci|pomoct|radu|poradit)|potrebuju (?:tvoji |nejakou )?(?:pomoc|pomoci|pomoct|radu|poradit)|potreboval bych (?:pomoc|radu|poradit)|das mi (?:nejakou |prosim )?radu|mas pro me (?:nejakou )?radu|mohl bys mi poradit|ukazes mi cestu|muzes mi poradit|nevim si rady havrane)\b/],
 ['offerHelp',/\b(pomuzu ti|pomohu ti|muzu ti pomoct|mohu ti pomoci|muzu ti pomoci|mohu ti pomoct|chci ti pomoct|chci ti pomoci|rad ti pomuzu|rad ti pomohu|cim ti muzu pomoct|cim ti mohu pomoci|jak ti muzu pomoct|jak ti mohu pomoci|co pro tebe muzu udelat|co pro tebe mohu udelat|muzu pro tebe neco udelat|potrebujes pomoc|potrebujes mou pomoc|chces pomoct|chces pomoc|jak ti pomuzu)\b/],
 ['promise',/\b(slibuji|slibuju|slibim|slibis|dam ti slib|vratim se za tebou|vratim se pro tebe|urcite se vratim|neopustim svuj slib|dodrzim slib|co pro tebe znamena slib)\b/],
 ['companionship',/\b(zustanu s tebou|zustanu tu s tebou|pojd se mnou|poletis se mnou|pujdes se mnou|pujdu s tebou|nechci te nechat samotneho|muzu tu zustat|mohu tu zustat|nechces jit se mnou|chces se mnou jit|neopustim te|muzu si k tobe sednout|posadim se vedle tebe|chci ti delat spolecnost)\b/],
 ['forgiveness',/\b(odpustis mi|promines mi|muzes mi odpustit|uz se nezlobis|jsi na me nastvany|jsi na me rozzlobeny|mas na me vztek|co kdyz udelam chybu|jak odpoustis)\b/],
 ['truth',/\b(lzes|lzes mi|rikas pravdu|muze se ti verit|muzu ti verit|mohu ti verit|taji[s]? mi neco|muzes mi rict pravdu|jsi uprimny|nelzi mi|jsi lh ar|jsi lhar)\b/],
 ['motive',/\b(proc mi pomahas|proc mi radis|co z toho mas|proc to delas|pro koho to delas|proc se o me bojis|proc ti na me zalezi|co ode me chces|proc chces abych uspel)\b/],
 ['band',/\b(proc mas krouzek|co je to na noze|co mas na noze|kdo ti dal krouzek|co znamena krouzek|znak na tve noze|slunecni znak na noze|proc nosis krouzek|krouzek na noze)\b/],
 ['voice',/\b(proc mluvis|jak to ze mluvis|jak to ze umis mluvit|jaktoze umis mluvit|jakto ze umis mluvit|kdo te naucil mluvit|jak ses naucil mluvit|jak jsi se naucil mluvit|umi havrani mluvit|proc umis mluvit|kde ses naucil slova|neni zvlastni ze umis mluvit|havrani nemluvi)\b/],
 ['name',/\b(jak se jmenujes|jak se jmenujs|mas jmeno|mas nejake jmeno|jake mas jmeno|jak ti rikali|jak ti mam rikat|mohu ti nejak rikat|muzu ti nejak rikat|jak te oslovovat|nevis jak se jmenujes)\b/],
 ['chatEnjoyment',/\b(povidas si rad|povidas rad|rad si povidas|mluvis rad|mluvis rad s lidmi|bavi te mluvit|bavi te povidat|rad mluvis|chces si se mnou povidat|rad si povidas s lidmi|povidas si rad s lidmi)\b/],
 ['age',/\b(kolik je ti let|jak jsi stary|jak dlouho zijes|kolik ti je|kolik jar pamatujes)\b/],
 ['family',/\b(mas rodinu|mas deti|mas mladat|mas rodice|kde je tve hejno|mas hejno|jsou tu dalsi havrani|jsi jediny havran|mas sourozence|kde jsou ostatni havrani)\b/],
 ['home',/\b(kde bydlis|kde spis|mas hnizdo|kde mas hnizdo|kde je tvuj domov|kam chodis spat|kde jsi doma|kde jsi zil|kde nocujes)\b/],
 ['flight',/\b(proc neodletis|umis letat|proc neletis pryc|proletis se|muzes odletet|proc zustavas|co vidis z vysky|co vidis kdyz letis|kam bys letel|kdy odletis)\b/],
 ['loss',/\b(chybi ti hvezdar|sty ska se ti|styska se ti|chybi ti nekdo|koho postradas|jak zemrel hvezdar|proc hvezdar zemrel|co se stalo hvezdari|je ti lito hvezdare|smutnis za hvezdarem)\b/],
 ['mortality',/\b(bojis se smrti|bojis se umrit|co je smrt|co bude az zemres|umres nekdy|jsi smrtelny|proc lide umiraji|co je po smrti)\b/],
 ['memory',/\b(co je vzpominka|co si pamatujes|bojis se zapomenuti|bojis se ze zapomenes|zapominas|mas dobre vzpominky|jak funguje pamet|co si pamatujes z minula)\b/],
 ['dreams',/\b(mas sny|o cem snis|co se ti zda|co by sis pral|jake mas prani|jaky je tvuj sen|co si prejes|co bys chtel nejvic)\b/],
 ['secret',/\b(mas tajemstvi|co prede mnou skryvas|co mi nerikas|co mi tajis|tajemstvi hvezdare|vis neco tajneho|je neco co mi nechces rict)\b/],
 ['stories',/\b(povez mi pribeh|vypravej mi pribeh|vypravej pribeh|rekni mi pribeh|povidej mi neco|povez nejakou historku|povid ej mi o minulosti|povidej mi o minulosti|vypravej o starych casech)\b/],
 ['solitude',/\b(jsi osamely|proc jsi sam|samota|samotny|jak snasis samotu|nejsi tu osamely|vadi ti samota|nemas s kym mluvit)\b/],
 ['silence',/\b(proc jsi zticha|proc je ticho|mas rad ticho|proc mlcis|ticho ti vadi|chces chvili mlcet|co je ticho)\b/],
 ['time',/\b(co je cas|vratil bys cas|vratit cas|zastavit cas|vratil bys minulost|chtel bys vratit cas|cas je zvlastni|co znamena cas)\b/],
 ['fate',/\b(osud|veris na osud|je to predurceno|veris v predurceni|je nase cesta dana|existuje nahoda)\b/],
 ['choice',/\b(mame na vyber|co je spravne|jak poznas spravnou cestu|jakou mam vybrat cestu|co je rozhodnuti|je moje volba spravna|jak poznat dobro)\b/],
 ['philosophy',/\b(smysl zivota|ma zivot smysl|co je smysl|co je stesti|co je svoboda|co je dobro|proc existujeme|co je zivot|co je lidskost|co je pravda v zivote|co je moudrost|povez neco filozofickeho|rekni mi nejakou myslenku)\b/],
 ['hope',/\b(je jeste nadeje|veris ze to zvladneme|dokazeme to|prezijeme to|ma to smysl|bude zase jaro|vrati se jaro|veris v nadeji|mame sanci|co ti dava nadeji)\b/],
 ['riddles',/\b(mas hadanku|dej mi hadanku|rekni mi hadanku|chci hadanku|zahrajeme si hadanku|hadej co|chces si hrat|zahrajeme si)\b/],
 ['questions',/\b(muzu se te ptat|mohu se te ptat|chces se me na neco zeptat|mas na me otazku|zeptej se me na neco|na co by ses me zeptal|ty se me zeptej|zajima te neco o me)\b/]
];
const routeInquiry=/^(?:kam (?:vede|vedou|to vede|tudy dojdu|se jde|se dostanu|mam jit|smeruje|jit|mam namireno)|kudy (?:vede|vedou|se jde|muzu jit|mam jit|se dostanu|tudy|mam pokracovat)|kde (?:vede cesta|cesta vede|je cesta|je stezka)|ktera cesta vede|co (?:je|lezi|najdu|se nachazi) (?:na|za) (?:severu|jihu|vychode|zapade)|co (?:je|se nachazi) za (?:mostem|mlynem|vezi)|kam ukazuje (?:rozcestnik|cedule|smerovka)|jakou cestou se dostanu|jak se dostanu (?:k|ke|do|na)|jak mam jit (?:k|ke|do|na)|jak pujdu (?:k|ke|do|na)|kde najdu cestu (?:k|ke|do|na))/;
// „Mám jít?“ / „Myslíš, že mám jít?“ se nesmí zvrhnout na pohyb.
// Otazník se při normalizaci odstraňuje, proto pracujeme i s původní větou.
const routeVerbMention=/\b(jit|jdi|jdu|pujdu|pujdeme|vyrazit|vyrazim|vydat|vydam|pokracovat|pokracuji|prejit|prejdu|prekonat|dostat se|dostanu se|vstoupit|vstoupim|vykrocit|navstivit|navstivim|odejit|odejdu|opustit)\b/;
const routePlaceMention=/\b(mlyn|mlyna|mlynu|most|mostu|mostem|vez|veze|vezi|krypta|krypty|kryptu|jeskyne|jeskyni|rozcesti|nadvori|observator|sever|severu|severni|jih|jihu|jizni|zapad|zapadu|zapadni|vychod|vychodu|vychodni|stranu|breh|brehu|tam|tudy|cestu|cesta|stezka|stezkou|stezce|cestou)\b/;
const routeAdviceLead=/^(?:mam|mel bych|mela bych|mame|meli bychom|mohl bych|mohla bych|muzu|mohu|smim|myslis|myslite|myslis si|doporucujes|poradil bys|porad mi|radis mi|mam radsi|mam radeji|je lepsi|bylo by lepsi|ma smysl|ma cenu|co kdybych|mam se|povazujes za dobre|rekni mi jestli|rekni jestli|havrane)/;
const routeAdvicePhrase=/\b(?:mam|mame|mel bych|mela bych|meli bychom|smim|muzu|mohu|je lepsi|ma smysl|ma cenu) (?:se |tam |uz |ted |hned |radeji |radsi )?(?:jit|jdi|jdu|pujdu|vyrazit|vydat|pokracovat|prejit|vstoupit|navstivit)\b/;
// Kontextové otázky jsou plnohodnotný rozhovor, nikoli pokus o použití předmětu.
// Věta nemusí znovu obsahovat slovo „havran“ a skloňování není povinné.
function ravenContextParse(text){
 if(state.room!=='clearing')return null;
 const queries=[
  ['feather',/^(?:proc jsi (?:tu|tady) (?:mel|musel) zustat|proc te (?:tu|tady) nechal|proc jsi mu to slibil)$/],
  ['weight',/^(?:(?:a )?ted je (?:to )?tezke|je (?:to )?pro tebe tezke(?: (?:tu|tady) zustat)?|je pro tebe tezke (?:tu|tady) zustat|tizi te (?:ten )?slib|neni ten slib tezky)$/],
  ['destination',/^(?:cestu kam|kam (?:mas|bys mel) ukazovat cestu|kam (?:ta |tvoje )?cesta (?:vede|miri)|komu mas ukazovat cestu)$/],
  ['words',/^(?:(?:a )?co ti (?:hvezdar )?rekl(?: hvezdar)?|co ti vlastne rekl|co ti rekl naposledy|jaka byla jeho posledni slova)$/],
  ['abandon',/^(?:opustil te|nechal te (?:tu|tady)|rekl ti (?:at|aby) (?:tu|tady) zustanes a odesel|on proste odesel|takze te opustil|nechal te samotneho)$/],
  ['friends',/^(?:byl tvuj pritel|jste pratele|jste byli pratele|byli jste pratele|byl hvezdar tvuj pritel|mels ho rad)$/],
  ['find',/^(?:mam hvezdare najit|chces ab(?:ych|ch) hvezdare nasel|mam hledat hvezdare|prejes si abych ho nasel|chces ho najit)$/],
  ['waiting',/^(?:co (?:tam|tu|tady) delas(?: havrane)?|proc (?:tu|tady) jsi|proc cekas(?: (?:tu|tady))?)$/],
  ['stargazerMagic',/^(?:umel hvezdar kouzlit|umel hvezdar carovat|byl hvezdar kouzelnik|znal hvezdar kouzelnika|znal hvezdar carodeje|znal hvezdar carokneznika|ovladal hvezdar magii)$/],
  ['next',/^(?:co mam (?:ted |tedy |dal )?(?:delat|udelat)|nevim[, ]+co (?:mam )?(?:ted |dal )?delat|nevim kam jit|jak mam pokracovat)$/]
 ];
 const found=queries.find(([,re])=>re.test(text));
 return found?{intent:'ravenContext',ids:['raven'],topic:found[0],t:text}:null;
}
function ravenContextAnswer(topic){
 const b=ravenMemory();b.met=true;b.pending=null;pending=null;
 state.dialogue={speaker:'raven',room:'clearing',topic:['waiting','feather'].includes(topic)?'duty':topic==='nameConfirm'?'name':topic==='voiceConfirm'?'voice':topic==='stargazerMagic'?'stargazer':topic,stage:0};
 state.lastEntity='raven';ravenEmote={start:performance.now(),kind:'talk'};
 const lines={
  feather:'„Ten slib jsem dal, když ještě nebyl sníh. Tehdy se mi zdál lehký jako pírko.“',
  weight:'Havran si načechrá promrzlé peří. „Někdy ano. Ale když slib odložíš jen proto, že ztěžkl, nebyl by to už slib, nemyslíš?“',
  destination:'„K mostu a pak k věži,“ odpoví. „Aspoň tak jsem tomu rozuměl. Hvězdář už mi neřekl, jestli tam bude čekat on sám.“',
  words:'Havran zavře jedno oko. „Řekl mi: Zůstaň na cestě. A kdyby přišel někdo, kdo hledá světlo, ukaž mu směr.“ Chvíli mlčí. „To bylo naposledy.“',
  abandon:'„Nevím, co si tehdy myslel,“ řekne havran po chvíli. „Vím jen, co jsem mu slíbil. To za mě nikdo nerozhodl.“',
  friends:'„Byl můj přítel. Ne můj pán,“ opraví tě jemně. „Občas zapomínal jíst. Já mu to připomínal. To přátelé dělají.“',
  find:'„Jestli půjdeš k jeho hrobu, buď tam opatrný,“ řekne havran. „A jestli najdeš něco z jeho práce, třeba mi o tom jednou povíš.“',
  waiting:'„Čekám, protože jsem to slíbil,“ řekne havran. „Když hvězdář odešel naposledy, řekl: Zůstaň na cestě.“',
  stargazerMagic:'Havran zatřese peřím. „Kouzlit? Hvězdář uměl lépe počítat hvězdy než čarovat. O kouzelníkovi mluvil zřídka — a když už, nikdy se přitom neusmíval.“',
  nameConfirm:'Havran zakráká a pobaveně potřese hlavou. „To nebylo jméno, rytíři. Takový zvuk vydávám, když se ozvu. Hvězdář mi říkával kamaráde. Žádné jiné jméno jsem ti neřekl.“',
  voiceConfirm:'Havran se uchechtne. „Pro obyčejného havrana bych byl trochu upovídaný. Hvězdář mě učil opakovat slova, až jsem začal chápat i otázky. Neznamená to ale, že znám všechny odpovědi.“',
  next:'Havran se podívá na dvě cesty. „Já bych se rozhlédl, co tu po lidech zůstalo. Jen nečekej, že za tebe některá z věcí udělá první krok.“'
 };
 if(topic==='abandon')b.trust=Math.min(8,b.trust+1);
 gameAudio?.cue('raven');log(lines[topic]||'Havran si tě chvíli prohlíží. „Pověz mi víc.“');
}
// Čaroděj má stejně jako havran vlastní slovník témat a kontextových otázek.
// Řazení je úmyslné: konkrétní otázka na bránu či hvězdáře má přednost
// před obecnými výrazy „zima“, „proč“ a „co“.
function wizardTopicFor(text,previous){
 const t=norm(text);
 if(/^(?:(?:a |no )?(?:proc|jak to myslis|co tim myslis|co jeste|a co jeste|rekni vic|povez vic|pokracuj|vazne|opravdu|a potom|co se stane potom|a co dal))$/.test(t)&&previous?.speaker==='wizard')return previous.topic;
 const questions=[
  ['guard',/^(?:co (?:tu|tady|tam) delas(?: carodeji)?|proc (?:tu|tady|tam) (?:porad )?(?:stojis|sedis|hlidas|jsi|cekas)|proc (?:tu|tady|tam) vlastne jsi|proc jsi (?:tu|tady|tam)|proc (?:tohle misto|tady) hlidas|proc hlidas (?:ten |tento )?(?:portal|pruchod|branu)|proc mi branis(?: projit)?|proc me nechces pustit|co tady vlastne delas|proc (?:tu|tady) zustavas)$/],
  ['portalBeyond',/\b(?:co (?:je|se skryva|lezi|ceka) za (?:tim |temnym )?(?:portalem|pruchodem)|kam (?:vede|usti|miri) (?:ten |tento |temny )?(?:portal|pruchod)|co uvidim za (?:portalem|pruchodem)|co je na druhe strane|kdo je za (?:portalem|pruchodem)|co se stane az projdu (?:portalem|pruchodem))\b/],
  ['portalNature',/\b(?:co (?:je|znamena) (?:to |ten |tento )?(?:portal|pruchod)|jak funguje (?:ten |tento )?(?:portal|pruchod)|proc (?:je|existuje) (?:tu |tady )?(?:portal|pruchod)|kdo postavil (?:ten |tento )?(?:portal|pruchod)|co je to za (?:portal|pruchod|branu))\b/],
  ['stargazerFate',/\b(?:zabil jsi hvezdare|co jsi udelal hvezdari|co se stalo hvezdari|jak zemrel hvezdar|proc hvezdar zemrel|proc jsi zabil hvezdare|co se mu stalo|hvezdar je mrtvy|jak umrel hvezdar)\b/],
  ['stargazerRelation',/\b(?:znal jsi hvezdare|byl hvezdar tvuj pritel|byli jste pratele|co jsi mel s hvezdarem|proc jsi hvezdare znal|mels rad hvezdare|co ti hvezdar rekl|mluvil jsi s hvezdarem|co jsi mu rekl|mel jsi hvezdare rad)\b/],
  ['dwarfsFate',/\b(?:co se stalo (?:tem |s temi )?(?:trpaslikum|trpasliky|trpaslikum tady)|proc jsou trpaslici mrtvi|proc jsi zabil trpasliky|tys zabil trpasliky|co udelali trpaslici|proc tu lezi trpaslici|co udelali spatne)\b/],
  ['eyes',/\b(?:oci|ocima|oko|ocich|peti oci|tolik oci)\b/],
  ['scepter',/\b(?:zezlo|zezlem|hvezda na zezle|hvezdou|co drzis v ruce|co je v tve ruce|proc drzis hvezdu|proc mas hvezdu)\b/],
  ['iceColumn',/\b(?:proc (?:stojis|jsi) na (?:tom |ledovem )?sloupu|jak ses dostal na sloup|proc jsi tak vysoko|co je (?:ten |to za )?sloup|seslez dolu|slez ze sloupu|proc neslezes)\b/],
  ['winterOrigin',/\b(?:proc (?:je|prisla|nastala) (?:tu |tady )?(?:zima|takova zima|mraz)|odkud se vzala zima|proc (?:tu|tady) porad mrzne|proc mrzne|kdo zpusobil zimu|proc jsi zmrazil udoli|proc jsi zmrazil vsechno|proc je vecna zima|jak jsi zpusobil zimu)\b/],
  ['past',/\b(?:odkud jsi prisel|odkud ses tu vzal|odkud jsi|kde ses tu vzal|co jsi byl predtim|jaky jsi byl driv|jaky byl tvuj zivot|povez mi o sobe|vypravej mi o sobe|povidej mi o minulosti|co bylo pred zimou)\b/],
  ['power',/\b(?:odkud mas moc|jak jsi ziskal moc|kde jsi ziskal moc|jak carujes|jak kouzlis|co je tve kouzlo|jak funguje tvoje magie|jsi mocny|jak jsi tak silny)\b/],
  ['change',/\b(?:proc nesnasis zmenu|proc se bojis zmen|proc nechces jaro|proc nechces aby bylo jaro|co je spatneho na jaru|co mas proti jaru|chces aby se nic nemenilo|proc chces vse zastavit|proc chces vse zachovat)\b/],
  ['time',/\b(?:jak dlouho tu jsi|jak dlouho tady stojis|kolik let tu jsi|kolik zim tu jsi|kolik je ti let|co je pro tebe cas|vnim as cas|vnimas cas|jak dlouho uz tu cekas)\b/],
  ['freedom',/\b(?:co je svoboda|jsi tu veznen|jsi ve vezeni|muze s odsud odejit|muzes odsud odejit|proc neodejdes|co te tu drzi|jsi uvizly|mas na vyber)\b/],
  ['fearOfLoss',/\b(?:ceho se bojis|bojis se ztraty|co jsi ztratil|o co jsi prisel|boji[s]? se neco ztratit|mas strach ze neco ztratis|co te boli uvnitr)\b/],
  ['regret',/\b(?:litujes|ceho litujes|mrzi te to|mrzi te co jsi udelal|stydi[s]? se|nebylo ti jich lito|je ti to lito)\b/],
  ['offerHelp',/\b(?:muzu ti pomoct|mohu ti pomoct|muzu ti pomoci|mohu ti pomoci|chci ti pomoct|potrebujes pomoc|jak ti mam pomoct|muzu pro tebe neco udelat|nechces pomoc|nabizim ti pomoc)\b/],
  ['friendship',/\b(?:budeme pratele|budeme kamaradi|muzeme byt pratele|mohli bychom byt pratele|chces byt muj pritel|muzu byt tvuj pritel|mohu byt tvuj pritel|mas nejake pratele|nechces se pratelit|jsme pratele|mame byt pratele|mas kamarady)\b/],
  ['morality',/\b(?:jsi zly|jsi zlo|jsi hodny|jsi dobry|proc jsi zly|jsi zloduch|jsi zruda|co je dobro|co je zlo|myslis ze jsi dobry|myslis si ze jsi dobry|proc ubli zujes|proc ublizujes)\b/],
  ['human',/\b(?:proc nenavidis lidi|co mas proti lidem|co si myslis o lidech|nemas rad lidi|proc nas nenavidis|proc nenavidis cloveka)\b/],
  ['knight',/\b(?:co si myslis o me|co si myslis o mne|co soudis o mne|vis kdo jsem|jsem rytir|proc mi rikas rytiri|mam mec|bojis se me|jsem tvuj nepritel)\b/],
  ['memory',/\b(?:co si pamatujes|na co vzpominas|mas vzpominky|pamatujes si minulost|chces zapomenout|co bys chtel zapomenout)\b/],
  ['form',/\b(?:proc tak vypadas|co jsi zac|jsi clovek|jsi jeste clovek|proc jsi modry|proc mas takovou podobu|co se ti stalo s telem)\b/],
  ['silence',/\b(?:proc je tu ticho|proc jsi zticha|proc mlcis|mas rad ticho|chces ticho|nechces mluvit|proc nemluvis)\b/],
  ['passage',/\b(?:mohu projit|muzu projit|mohu jit dal|muzu jit dal|smim projit|smim jit dal|smim pokracovat|mohu pokracovat|muzu pokracovat|mohu dal|muzu dal|mohu jit za tebe|muzu jit za tebe|mohu jit k portalu|muzu jit k portalu|mohu vstoupit do portalu|muzu vstoupit do portalu|pustis me|pust me|muzes me pustit|mohl bys me pustit|pust me projit|nech me projit|nech m projit|nech me jit|chci abys me pustil|nechas me projit|dovol mi projit|dovol mi vstoupit|dovolis mi projit|jak projit|jak se dostanu k portalu|proc me nepustis|proc nemohu projit|proc nemuzu projit|muzu kolem tebe|mohu kolem tebe|chci projit|chci jit dal|chci do portalu|jak se dostanu za tebe|co kdyz projdu)\b/],
  ['questions',/\b(?:mohu se te zeptat|muzu se te zeptat|mohu s tebou mluvit|muzu s tebou mluvit|chces si povidat|chci s tebou mluvit|povez mi neco|rekni mi neco|mas na me otazku)\b/],
  ['light',/\b(?:svetlo|svetlem|slunce|slunecni|paprsek|cocka|cocku|kapsle|kapsli|lucerna|lucernu|ohen|ohne|zar|zari)\b/],
  ['raven',/\b(?:havran|havrana|havranovi|havranem|krkavec|ptak|ptaka|rozcestnik)\b/],
  ['stargazer',/\b(?:hvezdar|hvezdare|hvezdarem|hvezdari|astronom|zapisnik)\b/],
  ['dwarfs',/\b(?:trpaslik|trpaslici|trpasliky|mrtvi|mrtve|tela|mrtvoly|padli)\b/],
  ['combat',/\b(?:mec|mecem|utok|utocit|boju|bojovat|zabiji te|zbrane|zbran|bojovat se mnou|porazit me)\b/],
  ['bargain',/\b(?:dohoda|dohodnout|vyjednavat|nabidnu|vymenou|smlouvat|obchod|zaplatim|slibim|smlouva|neco za neco)\b/],
  ['mercy',/\b(?:smiluj|slitovani|milost|prosim|usetr|usetris|neublizuj|nech me zit|odpust|nezabijej me)\b/],
  ['surrender',/\b(?:vzdej|vzdas|vzdat|odejdi|odejdes|vypadni|tahni|skonci|ustup|nech toho|prestan|prest an)\b/],
  ['threat',/\b(?:vyhrozujes|hrozis|zabijes|ublizis|co mi udelas|zabijet|co se stane|varovani|vyhruzka|nebezpecny|nepritel|porazim|zastavim)\b/],
  ['fear',/\b(?:bojis|strach|nebojim|bat|desis|zastrasit|odvaha|zbabelec)\b/],
  ['taunt',/\b(?:hlupak|hloupy|slaby|smesny|smrad|idiot|blazen|ubohe|nesnasim|nenavidim|lzes|lhari|trapny)\b/],
  ['identity',/\b(?:kdo jsi|jak se jmenujes|jmeno|jmenujes|kdo vlastne jsi|co jsi zac)\b/],
  ['loneliness',/\b(?:samota|samote|osamely|pratele|kamarad|rodina|rodinu|jsi sam|proc jsi sam)\b/],
  ['motive',/\b(?:zima|zimu|mraz|ledu|led|udoli|proc to delas|co chces|co potrebujes|proc tady jsi|vladnout|vladnes|proc jsi tady|co je tvuj cil)\b/]
 ];
 return questions.find(([,pattern])=>pattern.test(t))?.[0]||(/^\b(?:ahoj|zdravim|dobry den|dobry vecer|oslovit carodeje|promluvit s carodejem|mluvit s carodejem)\b/.test(t)?'greeting':null);
}
// Předměty, těla a boj jsou ve scéně fyzické dění. Slova „meč“, „led“
// a „mrtvoly“ nesmějí přebít sloveso a spustit čarodějův monolog.
function cavePhysicalParse(t){
 if(state.room!=='cave'||state.won)return null;
 const result=(topic,subject)=>({intent:'caveDetail',topic,subject,t});
 const bodies='(?:mrtve|mrtvych|mrtvoly|mrtvol|tela|tel|padle|padlych|trpasliky|trpasliku|trpaslici|neboztiky)';
 if(new RegExp('^(?:prohledat|prohledej|prohrabat|probrat|sahnout do kapes|podivat se do kapes)(?: (?:ty|vsechny|jejich|tem|na))? '+bodies+'(?: (?:veci|kapsy|vaky))?$').test(t))return result('searchBodies','dwarfs');
 if(new RegExp('^(?:prozkoumat|prozkoumej|prohlednout|prohlidnout|prohledni|prohlidni|podivat se na|koukni na|ohledat|ohledni)(?: (?:ty|vsechny|jejich|tem|na))? '+bodies+'$').test(t)||new RegExp('^(?:ty |ti |ta )?'+bodies+'$').test(t))return result('inspectBodies','dwarfs');
 if(/^(?:maji|meli|mely|ma nektery z nich|maji ti trpaslici|maji mrtvi|jsou u nich|najdu u nich) (?:nejake |nejakou |vubec )?(?:zbrane|zbran|zbroj|vyzbroj|mec|mece|sekeru|sekery|kopi|luk|luky|sipy|sipy s lukem)$/.test(t)||/^(?:jake zbrane (?:maji|mely)|cim byli ozbrojeni|jakou maji vyzbroj)$/.test(t))return result('weapons','dwarfs');
 if(/^(?:je|lezi|najdu|neni|nenajdu|muzu najit|je tu nekde|je tady nekde|neni tu nekde|kde je|kde najdu|ma nekdo|maji|maji u sebe|ma nektery|maji mrtvi|maji ti trpaslici|muzu vzit|je tu vubec)\b/.test(t)&&/\b(?:luk|luku|luky|sipy|sip|toulce|strelna zbran)\b/.test(t))return result('bow','dwarfs');
 if(/^(?:vytahnout|vytahni|vytahnu|tasit|tas|tasim|vytasit|vytas|pripravit|priprav) (?:svuj |svuj stary )?(?:mec|cepel)$/.test(t))return result('drawSword','sword');
 if(/^(?:bodnout|bodni|pichnout|pichni|pichat|probodnout|vypichnout|zasahnout|seknout|sekni|utocit na|zautocit na)\b/.test(t)&&/\b(?:oko|oka|oku|oci|ocima|ocich)\b/.test(t)&&/\b(?:carodej|carodeje|carodeji|kouzelnika|ho|mu|jeho)\b/.test(t))return result('attackEye','wizard');
 if(/^(?:sekat|sekni|seknout|sekej|rubat|rubej|triskat|bouchat|uderit|uder|rozsekat|rozsekej|rozbit|rozbij)\b/.test(t)){
  if(/\b(?:ledove vyvyseniny|ledovou vyvyseninu|ledoveho sloupu|ledovy sloup|ledu|led|vyvyseniny|vyvyseninu|sloupu|sloup|podstavce|podstavec)\b/.test(t))return result('cutIce','ice');
  if(/\b(?:carodeje|carodeji|kouzelnika|kouzelnikovi)\b/.test(t))return result('attackWizard','wizard');
  if(/^(?:sekat|sekej|seknout|sekni|rubat|rubej)(?: ho| do nej| ho vic| mecem| cepeli| vic| znovu| dal)?$/.test(t))
   return result(state.lastEntity==='ice'?'cutIce':'attackWizard',state.lastEntity==='ice'?'ice':'wizard');
 }
 if(/^(?:schovat se|schovej se|ukryt se|ukryj se|skryt se|skryj se|schovam se|plizit se|proplizit se)\b/.test(t)&&/\b(?:mu|pred nim|pred carodejem|carodeji|pred kouzelnikem|jemu|za nej|pred jeho ocima)\b/.test(t))return result('hideWizard','wizard');
 if(/^(?:hodit|hod|hodim|haze[tj]|hazet|hazu|mrstit|mrst|vrhnout|vrhni|odhodit|hodim si|zamerit a hodit)\b/.test(t)&&/\b(?:po nem|po carodeji|na carodeje|na kouzelnika|po kouzelnikovi|po jeho tele|po nem mecem|po nem led|po nem veci)\b/.test(t)){
  // Teplotní kapsle je součást hlavní hádanky. Její původní použití
  // prochází nezměněným herním mechanismem.
  if(/\b(?:kapsli|kapsle|ampuli|ampule|tepelna kapsle)\b/.test(t))return has('pod')?null:result('missingPod','wizard');
  if(/\b(?:mec|mecem|cepel|cepeli)\b/.test(t))return result('throwSword','wizard');
  if(/\b(?:led|ledem|kus ledu|ledovou krustu|kusy ledu|rampouch|rampouchem)\b/.test(t))return result('throwIce','wizard');
  if(/\b(?:kamen|kamenem|kaminek|kameny)\b/.test(t))return result('throwStone','wizard');
  if(/\b(?:veci|vsechno|neco|predmety|cokoli)\b/.test(t)||/^(?:hodit|hod|hazet) po (?:nem|carodeji)$/.test(t))return result('throwAsk','wizard');
 }
 // Pro obyčejné otázky na svět a fyzické úkony platí jiná cesta než
 // pro osobní rozhovor, i když obsahují slovo „led“, „meč“ nebo „trpaslíci“.
 return null;
}
// Na nádvoří se úmysl dostat dovnitř nesmí zaměnit za pouhé
// přistoupení ke dveřím. Nezasahujeme do odemykání skutečným klíčem,
// normálního vstupu ani průzkumu zámku.
function towerEntryParse(t){
 if(state.room!=='tower')return null;
 const entry=(topic)=>({intent:'towerEntry',topic,ids:['door'],t});
 const door=/\b(?:dvere|dveri|dverim|dvermi|vrata|vrat|branu|brany|brana|vezni dvere|vchod|vchodu|vstup|vstupu|zamku|zamek|kliku|kliky|panty|pantu|zavesy|zavesu|dirky|dirku|dirce|dirka|klicove dirky|klicovou dirku)\b/;
 const window=/\b(?:okno|okna|oknem|okne|oken|okenkem|okynko|okynkem|okenice)\b/;
 const climb=/^(?:vylezt|vylezu|vylez|vylezti|vysplhat|vysplham|splhat|splham|vylezt si|vylezt nahoru|vyhoupnout se|vyhoupnu se|prolezt|prolezu|prolez|vlezt|vlezu|vlez|dostat se|dostanu se|protahnout se|protahnu se|vstoupit|vejit|jit|jdi|dovnitr|proskocit|preskocit|prelezt|prelezu|obejit|obchazet|vylezt po)\b/;
 if(window.test(t)&&(climb.test(t)||/\b(?:dovnitr|do veze|do vezi|pres|skrz|skrze)\b/.test(t)))return entry('window');
 if(/^(?:vylezt|vylezu|vylez|vysplhat|splhat|vylezt si|vyhoupnout se|prelezt|dostat se|obejit|obchazet|vylezt po)\b/.test(t)&&
    /\b(?:veze|vezi|vez|zed|zdi|zidku|zidce|steny|stenu|fasade|fasadu|strechu|strese|nahoru|dovnitr|kolem veze)\b/.test(t))return entry('climb');
 if(/^(?:vlezt|vlezu|prolezt|prolezu|proplazit se|dostat se|vstoupit|vejit|projet)\b/.test(t)&&/\b(?:kominem|komin|skulinou|skulina|strechou|strechy|skrz zed|pres zed|otvorem)\b/.test(t))return entry('climb');
 if(/^(?:podkopat|podkopu|prob[oou]rat|probourat|rozbourat|zborit|vybourat|vykopat tunel|prorazit zed|prokopat se)\b/.test(t)&&/\b(?:vez|veze|vezi|zed|zdi|stenu|skalu|podlahu|tunel|dvere|dveri)\b/.test(t))return entry('wall');
 // Nejdřív konkrétní úder botou: hráč pak nedostane repliku o rameni.
 if(/^(?:rozbehnout se a |rozbehnu se a |rozbehni se a |zkusim |pokusim se )?(?:kopnout|kopni|kopnu|kopat|kopu|vykopnout|vykopnu|nakopnout|nakopnu|kopnout si|nakopavat|kopat do|vkopnout|uderit nohou|pra[sz]tit nohou|kopnout nohou|rozrazit kopem)\b/.test(t)&&door.test(t))return entry('kick');
 if(/^(?:vyrazit|vyrazim|vyraz|vyrazej|vyrazet|rozrazit|rozrazim|rozraz|rozbit|rozbij|rozmlatit|rozmlatim|roztlouct|roztriskat|roztriskam|prorazit|prorazim|proraz|rozbehnout se proti|rozbehnu se proti|narazit do|narazim do|vrazit do|vrazim do|uderit do|prazit do|pra[sz]tit do|bouchat do|bouchat na|bouchni do|ramenem do|vyrazit ramenem|rozbit ramenem)\b/.test(t)&&door.test(t))return entry(/\b(?:mec|mecem|cepel|cepeli)\b/.test(t)?'cut':'batter');
 if(/^(?:vypacit|vypacim|vypac|pacit|pacim|pac|podebrat|podeber|vysadit|vysadim|vytahnout panty|zvednout panty|vylomit zamek|vylomit zamku|odlomit zamek|odtrhnout dvere)\b/.test(t)&&door.test(t))return entry(/\b(?:mec|mecem|cepel|cepeli|ostrim)\b/.test(t)?'prySword':'pry');
 if(/^(?:strcit|strcim|strc|vsunout|vsunu|zasunout|zasunu|vlozit|vlozim|vrazit|vrazim|dat|dam|nacpat|nacpu|pichnout|pichnu|bodnout|bodnu|vrazit mec|otacet)\b/.test(t)&&
    /\b(?:mec|mecem|cepel|cepeli|ostri)\b/.test(t)&&
    /\b(?:dirky|dirku|dirce|dirka|zamku|zamek|klicove|klicovou|dvere|dveri|otvoru|otvor)\b/.test(t))return entry('keyholeSword');
 if(/^(?:sekat|sekam|sekni|seknout|sekej|rozsekat|rozsekej|rezat|rezat do|reznu|rezat mecem|rozriznout|rozriznu|mlatit mecem|rozbit mecem|uderit mecem|sekani)\b/.test(t)&&door.test(t))return entry('cut');
 if(/^(?:zap[a-z]*lit|podp[a-z]*lit|zapalit|podpalit|spalit|zapalim|podpalim|zapali[mst]?|vypalit|zapal)\b/.test(t)&&door.test(t))return entry('fire');
 if(/^(?:zatlacit|zatlacim|zatlac|tlacit|tlacim|tlac|oprit se|opru se|zaprit se|zapru se|pritlacit|pritlacim|tlacit ramenem|tahnout|tahnu|tahat|taham|zatahnout|zatahnu|trhnout|trhnu|skubat|skubu|zatrepat|zatras|zatrasit|zacloumat|zacloumam|zabrat za)\b/.test(t)&&door.test(t))return entry('push');
 return null;
}
function languageParse(raw){
let original=norm(raw);
let t=original.replace(/^(?:(?:prosim te|prosim vas|prosim|hele|tak|no tak|zkus prosim|chtel bych|chtela bych|rad bych|rada bych|mohl bych|mohla bych|muzes mi|muzes|chci) )+/,'');
// Nápověda je VÝHRADNĚ explicitní příkaz, nikoli prosba postavě o radu.
if(t==='napoveda')return {intent:'hint',ids:[],t};
// Společenské věty nejsou překlepy neznámých příkazů. Rozpoznáváme je
// před hledáním podobných sloves („měj se“ nesmí navrhnout „směj se“).
if(/^(?:mej se(?: hezky| krasne| dobre| pekne)?|opatruj se|at se ti dari|tak se mej|zase nekdy|brzy na shledanou)$/.test(t))
 return {intent:'bye',ids:[],t};
if(/^(?:ach ?jo+|ach jo|ach boze|ach ne|achich ouvej|uff+|uf)$/.test(t))
 return state.room==='clearing'?{intent:'v118Raven',topic:'sigh',ids:['raven'],t}:{intent:'wait',ids:[],t};
if(state.room==='clearing'&&/^(?:(?:ty )?jsi|ses) (?:lepsi|hodnejsi|laskavejsi|moudrejsi) nez (?:nekteri|mnozi|vetsina|spousta|dost) (?:lide|lidi|clovek|cloveku)$/.test(t))
 return {intent:'v118Raven',topic:'praiseHuman',ids:['raven'],t};
// Po přiblížení rozsvícené lucerny zná hra skutečný stav havranova
// zahřátí; navazující otázky nesmějí končit generickou hláškou.
if(state.room==='clearing'){
 // „Hodit po havranovi kámen“ není použití zdiva z jiné lokace.
 // Explicitní agresivní příkaz má samostatnou lokální reakci a následky;
 // pouhá otázka na kameny ani rozhovor stav důvěry nemění.
 if(/^(?:hod|hodit|hodim|hodim si|hodim po|vrhni|vrhnout|mrskni|mrsknout|hodim kamen|hod kamen)\b/.test(t)&&
    /\b(?:havran|havrana|havranovi|havranem)\b/.test(t)&&
    /\b(?:kamen|kameni|kamenem|kaminek|kamenek|kaminkem|oblazek|oblazkem)\b/.test(t))
  return {intent:'ravenStoneThrow',ids:['raven'],t};
 // Rozhovor je vázaný na skutečného havrana před hráčem. Přímé oslovení,
 // jeho minulost a následné otázky o čekání nesmějí spadnout do univerzální
 // odpovědi nebo do parseru pohybu. Znění je možné obměňovat přirozeně.
 if(/^(?:na co (?:tak )?(?:cumis|ziras|koukas|civis)(?: havrane)?|co (?:na me |po me |tak )?(?:cumis|ziras|koukas|civis)(?: havrane)?|proc (?:na me |po me |tak )?(?:cumis|ziras|koukas|civis)(?: havrane)?)$/.test(t))
  return {intent:'v118Raven',topic:'staring',ids:['raven'],t};
 if(/^(?:(?:ty |opravdu |fakt )?(?:umis|dokazes) mluvit|ty mluvis|ty opravdu mluvis|jakto ze mluvis|jak to ze mluvis|mluvici havran)$/.test(t))
  return {intent:'v118Raven',topic:'speaking',ids:['raven'],t};
 if(/^(?:proc (?:tu|tady|tam|na rozcestniku) (?:porad )?sedis|proc tu vlastne sedis|proc porad cekas|proc porad sedis|co te (?:tu|tady) drzi|proc jsi (?:tu|tady) zustal)$/.test(t))
  return {intent:'v118Raven',topic:'whyWaiting',ids:['raven'],t};
 if(/^(?:jak (?:dlouho|douho) (?:uz )?(?:tu|tady|tam|na rozcestniku) (?:uz )?(?:sedis|cekas|jsi)|jak (?:dlouho|douho) (?:uz )?(?:sedis|cekas) (?:tu|tady|tam)|kolik (?:let|zim) (?:uz )?(?:tu|tady|tam) (?:sedis|cekas))$/.test(t))
  return {intent:'v118Raven',topic:'waitingDuration',ids:['raven'],t};
 if(/^(?:kde ses (?:tu|tady|tam) vzal|odkud jsi (?:sem|tady|tu) (?:priletel|priletl|prisel)|odkud jsi (?:priletel|priletl)|odkud jsi prisel|jak ses (?:sem|tu|tady) dostal|kde jsi byl predtim|kde jsi zil predtim)$/.test(t))
  return {intent:'v118Raven',topic:'origin',ids:['raven'],t};
 if(/^(?:jak dlouho jeste|a jak dlouho jeste|jak dlouho budes jeste cekat|jak dlouho tu jeste budes|do kdy budes cekat|jak dlouho jeste zustanes)$/.test(t))
  return {intent:'v118Raven',topic:'howMuchLonger',ids:['raven'],t};
 if(/^(?:(?:vratit|vrat|vratim se|vrat se) kam|kam se (?:mam |muzu )?vratit|kam se mam vratit|vratit se kam)$/.test(t))
  return {intent:'v118Raven',topic:'returnWhere',ids:['raven'],t};
 if(/^(?:(?:chci |zkusim |pokusim se )?(?:ublizit|zranit|ranit) havranovi(?: mecem)?|(?:ublizim|zranim|ranim) havranovi|(?:bodnu|pobodam|pichnu|seknu) havrana)$/.test(t))
  return {intent:'attack',ids:['raven'],t};
 if(/^(?:zlobis se|zlobis se na me|jsi nastvany|jsi na me nastvany|jsi rozzlobeny|jsi na me rozzlobeny|mas na me vztek|jeste se zlobis|porad se zlobis)$/.test(t))
  return {intent:'v118Raven',topic:'angryAfterHarm',ids:['raven'],t};
 if(/^(?:odpustis mi|promines mi|dokazes mi odpustit|muzes mi odpustit|mohl bys mi odpustit|chces mi odpustit|odpustil jsi mi)$/.test(t))
  return {intent:'v118Raven',topic:'forgiveAfterHarm',ids:['raven'],t};
 if(/^(?:(?:a |uz |tak )?je ti (?:uz )?(?:lepe|lip|lip uz|trochu lip|tepleji)|(?:citis se|citits se) (?:uz )?(?:lepe|lip)|pomohlo ti (?:to|teplo|svetlo|ta lucerna)|zahrala te lucerna)$/.test(t))
  return {intent:'v118Raven',topic:'feelingBetter',ids:['raven'],t};
 if(/^(?:(?:uz|ted|tak) ti (?:uz )?neni zima|neni ti (?:uz |porad )?zima|je ti (?:jeste |porad )?zima|mrznes (?:jeste|porad)|je ti uz teplo)$/.test(t))
  return {intent:'v118Raven',topic:'stillCold',ids:['raven'],t};
 if(/^(?:(?:chces|chtel bys|nechces|mam ti|muzu ti|mohl bych ti) (?:prinest|donest|podat|dat|sehnat|nabidnout) (?:neco )?(?:tepleho|horkeho|na zahrati|teple jidlo|teply napoj|deku)|chces (?:neco )?(?:tepleho|horkeho|na zahrati)|chces se (?:jeste )?zahrat|mam te jeste zahrat)$/.test(t))
  return {intent:'v118Raven',topic:'warmOffer',ids:['raven'],t};
}
// Přirozená otázka na dosud prázdný sluneční kotouč není pokus vzít
// kapsli z inventáře. Před vyřešením ponecháváme pouze jemný optický náznak.
if(state.room==='tower'&&/^(?:jakou kapsli|jakou to kapsli|co je to za kapsli|o jakou kapsli jde|kde vezmu kapsli|kde mam vzit kapsli|odkud vezmu kapsli|kde sehnat kapsli|kde je kapsle|kde najdu kapsli)$/.test(t))
 return {intent:'sunQuestion',ids:[],t};
const towerEntry=towerEntryParse(t);
if(towerEntry)return towerEntry;
// The word "pod" here is a preposition, not the portable thermal capsule.
// The original painting has a small wooden object beneath the worktable.
if(state.room==='mill'&&/\b(?:pod|po) (?:stolem|stul|stolkem)\b/.test(t)&&
   (/^(?:co|jak|kde|podivej|podivat|koukni|koukat|prozkoumat|prozkoumej|prohlidnout|prohlednout|prohledat|prohledni)\b/.test(t)||/^(?:pod|po) (?:stolem|stul|stolkem)$/.test(t)))
 return {intent:'underTable',ids:['table'],t};
// At the bridge, the shining thing is a contextual object, not the raven
// remembered from a previous dialogue. Handle these references before lore Q&A.
if(state.room==='bridge'){
 // „Světlo“ na opuštěném mostě je odlesk z kovu ve spáře, ne
 // lucerna z jiného místa. Výslovná lucerna zůstává samostatným předmětem.
 if(/^(?:co (?:je )?(?:to |tam )?za (?:svetlo|svit|zablesk)|co je to za svetlo|odkud (?:jde|vychazi) (?:to |tam )?(?:svetlo|svit)|co (?:to |tam )?(?:sviti|zasvitilo|blika))$/.test(t))
  return {intent:'bridgeDetail',topic:'glint',ids:[],t};
 const shine=/(?:lesk|blesk|zablesk|blyst|blys|blist|trpyt|odlesk|kovov|zariv|svitiv)/;
 const parts=t.split(' ');
 const shinyForms=['leskly','leskleho','lesklemu','lesklym','blystivy','blystiveho','blystivemu','blystici','lesknouci','trpytivy','kovovy','kovoveho'];
 const shinyNouns=new Set(['predmet','predmetu','predmetem','objekt','objektu','objektem','vec','veci','kov','kovu','kovem']);
 // A single typo in the adjective is safe here: it identifies the already
 // described glint, but can never directly grant the hidden pendant.
 const glintThing=shine.test(t)||(parts.some(w=>shinyForms.some(s=>distance(w,s)<=1))&&parts.some(w=>shinyNouns.has(w)));
 const question=/^(?:co se (?:to |tam )?(?:leskne|blysti|blisti|trpyti|zableskne)|co (?:to )?(?:bleska|blika|zari)|co (?:je )?(?:to |tam )?(?:za )?(?:leskly|blystivy|trpytivy|kovovy) (?:objekt|predmet|vec))$/.test(t);
 const bare=/^(?:to co se (?:to |tam )?(?:leskne|blysti|blisti|trpyti)|(?:ten |ta |to )?(?:leskly|blystivy|blystici(?: se)?|lesknouci(?: se)?|trpytivy|trpytici(?: se)?|kovovy) (?:objekt|predmet|vec))$/.test(t)|| (glintThing&&parts.length<=4&&/^(?:leskl|lskl|blyst|blys|trpyt|kovov)/.test(t));
 const tryTake=/^(?:sebrat|seber|vezmi|vzit|vem|zvednout|zvedni|vytahnout|vytahni|vyndat|vyndej|vyjmout|vyjmi|uchopit|uchop|chytit|chytni|sahnout|sahni|dotknout se|dotkni se|vyhrabat|vyhrab|vykopej)\b/.test(t);
 const pronoun=/^(?:sebrat|seber|vezmi|vzit|vem|zvednout|zvedni|vytahnout|vytahni|vyndat|vyndej|vyjmout|vyjmi|uchopit|uchop|chytit|chytni|sahnout|sahni) (?:to|ho|ten predmet|ten objekt|tu vec)$/.test(t);
 // Meč na sponu u útesu: rozpozná i volný slovosled, opis „lesklý předmět“
 // a odkaz „to“ po přiblížení. Bez výslovně uvedeného meče se předmět
 // neodkryje; všechny ostatní lokace a použití meče běží původním parserem.
 const swordMention=/\b(?:mec|mecem|ostri|cepeli)\b/.test(t);
 const pryVerb=/\b(?:uvolnit|uvolni|uvolneni|vypacit|vypac|vyprostit|vytahnout|vytahni|vyndat|vyndej|vyjmout|vyjmi|podebrat|podeber|odtrhnout|odtrhni|odklinit|odklin|pouzit|pouzij|pouzijte)\b/.test(t);
 const sponaMention=/\b(?:spona|sponu|spony|sponou|zelezo|zeleznou|zeleznou sponu|kov|kovu|kovem|predmet|predmetu|predmetem|objekt|objektu|objektem)\b/.test(t);
 const contextObject=(state.bridgeFocus==='glint'||state.lastEntity==='pendant')&&f().ledgeInspected&&/\b(?:to|ho|jej|uvolneni)\b/.test(t);
 if(swordMention&&pryVerb&&(glintThing||sponaMention||contextObject))
  return {intent:'world',ids:[],detail:{id:'spona',intent:'cut',room:'bridge'},t};
 if(question||bare)return {intent:'bridgeDetail',topic:'glint',ids:[],t};
 if(/^(?:jit|jdi|priblizit se|pribliz se|pristoupit|pristup|jit se podivat) (?:bliz|blize|k tomu|k lesku|k odlesku|k tomu predmetu|bliz k .+)$/.test(t)&&
    (state.bridgeFocus==='glint'||glintThing)&&!/\b(pilir|piliri|most|mostu|lano|lana|rozcesti|vez|vezi)\b/.test(t))
  return {intent:'bridgeDetail',topic:'bank',ids:[],t};
 if(tryTake&&(glintThing||(state.bridgeFocus==='glint'&&pronoun)))
  return f().pendantRevealed?{intent:'take',ids:['pendant'],t}:{intent:'bridgeDetail',topic:'reachGlint',ids:[],t};
 if(/^(?:prozkoumat|prozkoumej|prohlidnout|prohlednout|podivat se|koukni)\b/.test(t)&&glintThing)
  return {intent:'bridgeDetail',topic:'glint',ids:[],t};
}
// Neexistující průlez oknem nelze vyhodnotit jako dveře a kliku.
if(state.room==='mill'&&/^(?:vl[eizt]*|vlezt|prolezt|proplazit se|vstoupit|dostat se|jit|jdi|vlez|prolez) (?:do mlyna )?(?:oknem|skrz okno|pres okno|okynkem|skrze okno|oknem dovnitr|oknem do mlyna)(?: dovnitr)?$/.test(t))
 return {intent:'millWindow',ids:[],t};
// Zájmena „to“, „ji“ a „ho“ se vážou i k právě objeveným malovaným
// předmětům, nejen k položkám inventáře. Do jiné místnosti neplatí.
const worldFocus=state.lastWorld?.room===state.room?state.lastWorld.id:null;
if(worldFocus&&['bedynka','schranka'].includes(worldFocus)&&
   /\b(?:to|ho|ji|jej|tu vec|ten predmet|tu bedynku|tu schranku|to viko)\b/.test(t)&&
   !parseBase(t).ids.some(id=>id!=='sword')){
 const verb=t.split(' ').find(w=>['prozkoumat','prozkoumej','prohlidnout','prohlednout','podivat','koukni','otevrit','otevri','odklopit','odklop','rozbit','rozbij','roztlouct','rozmlatit','vypacit','vypac','uvolnit','uvolni','pouzit','pouzij','vytahnout','vytahni','vyndat','vyndej','sahnout','sahni','dotknout'].includes(w));
 const intent=verb&&(/^(?:prozk|prohl|podiv|kouk)/.test(verb)?'inspect':/^(?:otevr|odklop)/.test(verb)?'pull':/^(?:rozb|rozml|roztl)/.test(verb)?'break':/^(?:vypac|uvol|vytah|vynd)/.test(verb)?'pull':/^(?:pouz)/.test(verb)?'use':'touch');
 if(intent)return {intent:'world',ids:[],detail:{id:worldFocus,intent,room:state.room},t};
}
// Navazující havranovy otázky se řeší ještě před starším slovníkem.
// Ten uměl poznat „hvězdář“, ale ztrácel podmět i návazné „to“.
// Smysl výpravy musí havran pochopit dříve než univerzální otázkový parser.
if(state.room==='clearing'&&ravenDeepTopics.some(([topic,re])=>['mission','askHelp'].includes(topic)&&re.test(t)))
 return {intent:'talk',ids:['raven'],t};
const raven11814=state.room==='clearing'&&
 globalThis.adventureRavenContext11814?.detect(t,state.dialogue);
if(raven11814)return {intent:'ravenContext11814',ids:['raven'],topic:raven11814,t};
const story118=globalThis.adventureStory118?.detect(original,state.room,state.dialogue);
if(story118)return story118;
const contextual=ravenContextParse(original)||ravenContextParse(t);
if(contextual)return contextual;
if(state.room==='clearing'&&/^(?:takze |a |ty )?(?:jmenujes se kra|tvoje jmeno je kra|rika se ti kra|jsi kra|rika se ti kamarade|havrani nemluvi|to je zvlastni ze mluvis|neni zvlastni ze umis mluvit|jaktoze umis mluvit|jak to ze umis mluvit|jakto ze umis mluvit)$/.test(original))
 return {intent:'ravenContext',ids:['raven'],topic:/kra|kamarade/.test(original)?'nameConfirm':'voiceConfirm',t:original};
// Jednoslovné „proč?“ navazuje na poslední rozhovor s havranem, a to i
// s otazníkem. Obecná ochrana otázek ho níže nesmí spolknout.
if(state.room==='clearing'&&state.dialogue?.speaker==='raven'&&/^(?:a |ale )?proc$/.test(original))
 return {intent:'talk',ids:['raven'],t:'proc',continuation:true};
if(state.room==='clearing'&&state.dialogue?.speaker==='raven'&&/^(?:co|coze|jak to|co tim myslis|a jak to|tomu nerozumim)$/.test(original))
 return {intent:'talk',ids:['raven'],t:'proc',continuation:true};
const personal=state.room==='clearing'&&globalThis.adventureRaven115?.detect(original);
if(personal)return {intent:'ravenNatural',topic:personal,ids:['raven'],t:original};
// Osobní dotazy havranovi musí předcházet všem generickým otázkám na cestu.
// V11.8 je chybně zachytávala až níže, pod ochranou všech otazníků.
if(state.room==='clearing'&&ravenDeepTopics.some(([,re])=>re.test(original)||re.test(t)))
 return {intent:'talk',ids:['raven'],t:original};
// Prosba o pomoc je promluva do světa, ne automatické otevření herní nápovědy.
// Na rozcestí ji zachytil havran výše. Jinde se žádná nabídka sama neotevírá.
if(state.room!=='clearing'&&/\b(?:potrebuji|potrebuju) (?:tvoji |nejakou )?(?:pomoc|pomoci|pomoct|radu|poradit)\b/.test(original))
 return {intent:'pleaForHelp',ids:[],t:original};
if(/^(?:co mam (?:ted |tedy |dal )?(?:delat|udelat)|nevim kam jit|jak mam pokracovat)$/.test(t))return {intent:'pleaForHelp',ids:[],t};
if(state.lastSurface?.room===state.room&&/^(?:(?:vezmi|vzit|vem|seber|sebrat|zvedni) (?:oboje|obe|vsechny veci|veci|vse|vsechno)(?: (?:ze|z) stolu)?|veci ze stolu|oboje)$/.test(t))return {intent:'take',ids:[],source:state.lastSurface.id,all:true,t};
// Výslovné vypáčení mlýnských dveří mečem patří ke dveřím,
// nikoli k obecné reakci na neznámé sloveso. Závora zůstává zajištěná.
if(state.room==='mill'&&/^(?:vypac|vypacit|vypacim|vypacete|podeber|podebrat)\b/.test(t)&&
   /\b(?:dvere|dveri|vrata|vrat)\b/.test(t))
 return {intent:'cut',ids:['millDoor','sword'],t};
const worldHit=globalThis.adventureWorld117?.resolve(original,state.room,f());
if(worldHit)return {intent:'world',ids:[],detail:worldHit,t:original};
// Na strženém mostě nejsou kámen v dlani a kamenné zdivo totéž.
// Volné předměty a terén se vyhodnocují před obecným slovníkem.
if(state.room==='bridge'){
 if(/^(?:prohledat|prohledej|prozkoumat|prozkoumej|prohlednout|podivat se|podivej se|koukni|zkoumat) (?:to tu|to tady|to tady kolem|okoli|okol[iy]|tady vsechno)$/.test(t))
  return {intent:'bridgeDetail',topic:'survey',ids:[],t};
 if(/^(?:zjist|prozkoum|prohlid|prohled|podiv|koukn|koukej|koukat|sled|mrkn|ohled)/.test(t)&&
    /(?:lesk|blesk|zablesk|blyst|blys|blist|trpyt|odlesk|zari|svit|kovov|neco se tam)/.test(t))
  return {intent:'bridgeDetail',topic:'glint',ids:[],t};
 if(/^(?:sahni|sahnout|dotkni se|dotknout se|vezmi|vzit|chytit|chytnout|vytahnout|vytahni) (?:po |na )?(?:to|tom|toho|leskleho|to co se tam leskne)$/.test(t)&&f().glintSeen&&!f().pendantRevealed)
  return {intent:'bridgeDetail',topic:'reachGlint',ids:[],t};
 if(f().ledgeInspected&&/^(?:vypac|vypacit|podeber|podebrat|odtrhni|odtrhnout|seknout|sekni|rozbij|rozbit|pouzij mec na) (?:to|ten kov|zelezo|to zelezo|tu vec|ten predmet)(?: mecem| mecem to)?$/.test(t))
  return {intent:'world',ids:[],detail:{id:'spona',intent:'pull',room:'bridge'},t};
 if(/^(?:rozhl|porozhl|rozhled|obhlid|obhliz)(?:[a-z]*)?(?: se)?$/.test(t))
  return {intent:'bridgeDetail',topic:'survey',ids:[],t};
 if(/^(?:prozkoum|prohled|prohlid|ohled|podiv|koukn|zkoumej|zkoumat)/.test(t)){
  if(/\b(?:breh|brehu|brehem|brehy|okraj|okraji|kraj|kraji|hrana|hranu|hrane|skala|skalu|skale|skaly|skalni spara|skalni sparu|sparu|spara|spare)\b/.test(t))
   return {intent:'bridgeDetail',topic:'bank',ids:[],t};
  if(/\b(?:sraz|srazu|srazem|propast|propasti|rokle|rokli|strz|strze|dolu)\b/.test(t))
   return {intent:'bridgeDetail',topic:'slope',ids:[],t};
  if(/\b(?:kamen|kaminek|kamene|kaminky|oblazek|oblazky|kameni)\b/.test(t))
   return {intent:'bridgeDetail',topic:'pebble',ids:[],t};
 }
 if(/^(?:hod|vrh|odhod|hodim)/.test(t)){
  if(/\b(?:sneh|snehu|snehovou|snehova|snehove|kouli|koule|koulicku)\b/.test(t))
   return {intent:'bridgeDetail',topic:'snowball',ids:[],t};
  if(/\b(?:kamen|kaminek|kamenem|kaminky|oblazek|oblazkem|oblazky|sut)\b/.test(t))
   return {intent:'bridgeDetail',topic:'throwPebble',ids:[],t};
 }
 if(/^(?:skoc|skocit|skocim|skac|seskoc|seskocit|vrhnout se|vrhni se)/.test(t)&&
    /\b(?:dolu|do propasti|do rokle|ze srazu|z okraje|pres okraj|z mostu|ze skaly|z brehu|na dno)\b/.test(t))
  return {intent:'bridgeDetail',topic:'jumpDown',ids:[],t};
}
// Skutečný příkaz „jít k havranovi“ směřuje na rozcestí; pouhá zmínka
// o havranovi v otázce nikdy hráče nepřemístí.
if(state.room!=='clearing'&&!/[?？]/.test(raw)&&/^(?:(?:jdi|jit|jdu|dojdi|dojit|vyraz|vyrazit|vrat se|vratim se|vratit se|chci jit) (?:zpet )?(?:k|za) (?:havranovi|havranem|havranovi na rozcesti|havranovi na rozcestniku)|(?:jdu|jit|vratim se|vrat se) zpatky za havranem)$/.test(original))
 return {intent:'go',ids:[],location:'clearing',t:'jdi na rozcesti'};
if(/^(?:zpatky|vrat se|vratit se|jdu zpet) (?:na|k|ke|do) (?:rozcesti|havranovi|havranu)$/.test(original))
 return {intent:'go',ids:[],location:'clearing',t:'jdi na rozcesti'};
// V jeskyni je brána skutečný viditelný cíl, nikoli alternativní název
// jižní stezky. Příkazy k portálu zůstanou fyzickým pokusem o přístup,
// otázky na průchod patří přímo čaroději. Výslovný jih je stále návrat.
if(state.room==='cave'){
 const physical=cavePhysicalParse(t);
 if(physical)return physical;
 const portal=/\b(?:portal|portalu|portalem|pruchod|pruchodu|pruchodem|vchod|vchodu|branou|brana|branu)\b/.test(t);
 const toward=/^(?:jit|jdi|jdu|dojit|dojdi|pristoupit|pristup|priblizit se|pribliz se|vykrocit|vykroc|vyrazit|vyraz|vstoupit|vstup|projit|projdi|prolezt|prejit|pokracovat|pokracuj|bez|chci jit|chci se dostat|chci vstoupit|chci projit|chci pokracovat|pujdu|kracej|vydat se|vydej se|zajit|dojit)\b/.test(t);
 const shortcut=/^(?:k|ke|do|za|skrz|pres|na) (?:temnemu |temny |temneho |temne |tomu |tento |ten )?(?:portalu|portal|portalem|pruchodu|pruchod|pruchodem|vchodu|vchod|brany|branu)$/.test(t);
 const farther=/^(?:jit dal|jdi dal|chci jit dal|jdu dal|pokracovat dal|pokracuj dal|chci pokracovat|jit nahoru|jdi nahoru|vzhuru|nahoru|na sever|sever|jdi na sever|jit na sever|projit dal|projdi dal)$/.test(t);
 if(shortcut||farther||(portal&&toward))
  return {intent:'wizardPortal',ids:['portal'],t};
 const caveRole=(!state.won&&globalThis.adventureWizardRoleplay)?globalThis.adventureWizardRoleplay.parse(t,{won:state.won,lastEntity:state.lastEntity,inv:state.inv}):null;
 // Nové pohybové a společenské záměry mají přednost před pouhou shodou
 // s klíčovým slovem v čarodějových starších tématech (např. „oko“).
 if(caveRole&&!['question','statement','gibberish'].includes(caveRole))
  return {intent:'caveRoleplay',topic:caveRole,t};
 if(!state.won){
  const physicalLead=/^(?:hod|haz|mrst|vrh|odhod|sekn|sek|rub|uder|bouch|trisk|rozbi|prohled|prozkoum|prohlid|ohled|schov|ukry|skry|pliz|vytah|vezm|vzit|seber|brat|hledat|hledam|najit|ziskat|sahat|sahnout|dat|podat|poloz|sebrat|zvedni)[a-z]*\b/;
  const worldQuestion=/^(?:maji|meli|ma nektery|jsou u nich|jake zbrane|cim byli|jakou maji|je tu nekde|je tady nekde|kde najdu|najdu tu|najdu u nich)\b/;
  const topic=!physicalLead.test(original)&&!worldQuestion.test(original)?wizardTopicFor(original,state.dialogue):null;
  if(topic)return {intent:'talk',ids:['wizard'],t:original};
  // Druhá osoba bez výslovného „čaroději“ je stále otázka na protivníka.
  if(/^(?:co|proc|jak|kdy|kde|kdo|odkud|myslis|veris|mas|jsi|chces|umis|bojis|muzes|mohu|muzu|smim|povez|rekni|vysvetli)\b/.test(t)&&
     /\b(?:jsi|ses|te|ti|tobe|tebe|tvuj|tvoje|mas|chces|umis|muzes|myslis|veris|bojis|carodej|carodeji|dovol|pust|projit)\b/.test(t))
   return {intent:'talk',ids:['wizard'],t};
  // Poslední pojistka: neznámý obrat není pokyn k pohybu ani chyba parseru.
  // Čaroděj odpoví v kontextu scény, a to i na nesmysly či překlepy.
  if(caveRole)return {intent:'caveRoleplay',topic:caveRole,t};
 }
}
if(routeInquiry.test(t))return {intent:'routeQuestion',ids:[],t};
if(routeVerbMention.test(original)&&(
 (routeAdvicePhrase.test(original))||
 (routeAdviceLead.test(t)&&routePlaceMention.test(original))||
 (/[?？]/.test(raw)&&routePlaceMention.test(original))
))return {intent:'routeQuestion',ids:[],t:original,advice:true};
// Bezpečnostní zábrana V11.8: otazník ani přímá otázka na jinou osobu
// nikdy nesmí skončit jako pohyb, útok, sebrání či použití předmětu.
if(/[?？]/.test(raw)||/^(?:chtel by ses|chtel bys|budes tu|mohl by ses|mohl bys|prejes si|chces abych|co ti|proc ti|jak ti|chybi ti|styska se ti|co se ti stalo)\b/.test(original)){
 if(state.room==='clearing'&&/^(?:chtel by ses|chtel bys|budes tu|mohl by ses|mohl bys|prejes si|chces abych|co ti|proc ti|jak ti|chybi ti|styska se ti|co se ti stalo)\b/.test(original))
  return {intent:'v118Raven',topic:'openQuestion',t:original};
 return {intent:'question',ids:parseBase(original).ids||[],t:original};
}
// V jeskyni jsou osobní otázky řečí k čaroději, nikoli příkazy hře.
// Pravidlo neplatí pro přesun, boj ani práci s předměty.
if(state.room==='cave'&&!state.won&&(
 /^(?:kdo (?:jsi|vlastne jsi|te stvoril|je hvezdar)|co (?:jsi zac|chces|ode me chces|potrebujes|je tvuj cil|mi udelas|se stane|si myslis|mas proti me)|proc (?:to delas|jsi tady|jsi tu|zabijis|jsi to udelal|se nezastavis|jsem tady)|jak (?:se jmenujes|dlouho tu budes|jsi se sem dostal|jsi to dokazal|jsi zabil|me chces zastavit)|bojis se|nebojis se|nebojim se|mam se te bat|musim se te bat|vyhrozujes mi|hrozis mi|co kdyz te napadnu|chces bojovat|chces se prat|muzu s tebou mluvit|mohu s tebou mluvit|muzeme si promluvit|muzeme se dohodnout|mohu se te zeptat|muzu se te zeptat|pustis me|propustis me|slibujes|usetris me|neublizuj mi|smiluj se|vzdej se|vzdate se|odejdi odsud|vypadni odsud|tahni pryc|mel by ses vzdat)(?:\b|$)/.test(t)||
 /^(?:rekni mi|povez mi|vysvetli mi|zeptam se te|mam otazku)\b/.test(t)||
 /^(?:jsem tvuj nepritel|nejsem tvuj nepritel|zastavim te|porazim te|nebojim se te|nechci s tebou bojovat|nechci ti ublizit|prisel jsem si pro tebe|dostanu te|co kdybych te zabil|dokazu te porazit|nech me zit|nezabijej me|prosim nezabijej me|prosim usetri me)(?:\b|$)/.test(t)||
 /^(?:co ti|co jsi|proc jsi|jak jsi|co vis o|co o nich vis|co se stalo|procs|proc je)\b/.test(t)&&/\b(?:trpaslici|trpaslik|trpasliky|mrtve|mrtvoly|tela|hvezdar|hvezdare|hvezdari|havran|havrana|ptaka)\b/.test(t)||
 /^(?:a )?(?:proc|a proc|co jeste|a co jeste|rekni vic|povez vic|jak to myslis|co tim myslis|vazne|opravdu)$/.test(t)&&state.dialogue?.speaker==='wizard'
))return {intent:'talk',ids:['wizard'],t};
// Přirozené skloňované směry: „jít severní stezkou“, „vyrazit po jižní cestě“.
// Zde jde o explicitní rozkaz. Otázky výše už byly bezpečně odfiltrovány.
const pathWalk=t.match(/^(?:(?:jdi|jit|jdu|vyraz|vyrazit|vyrazim|bez|pokracuj|pokracovat|vydej se|vydat se|chci jit|chci se vydat|pujdu|kracej)\s+)(?:po |tou |pres )?(severni|jizni|vychodni|zapadni)\s+(?:stezkou|stezce|stezku|cestou|ceste|cestu|pesinou|pesine|pesinu)(?:\s+dal)?$/);
if(pathWalk)return {intent:'go',ids:[],dir:({severni:'n',jizni:'s',vychodni:'e',zapadni:'w'})[pathWalk[1]],t};
if(/^(?:dej|dat|dam|podej|daruj|nabidni|predat|venuji)\b/.test(t)&&/\b(?:carodeji|carodejovi|kouzelnikovi|havranovi|havranu|havranovi|krkavci)\b/.test(t)){
 const gift=parseBase(t);gift.intent='give';gift.t=t;return gift;
}
if(state.room==='clearing'&&/^(?:a )?kdo (?:to|on|vlastne to) (?:je|byl)$/.test(t)&&/hvězdář|hvezdar/i.test(lastReply))
 return {intent:'talk',ids:['raven'],t:'kdo byl hvezdar'};
if(state.room==='clearing'&&state.dialogue?.topic==='stargazer'&&
   /^(?:a )?(?:co ti provedl|co ti udelal|v cem byl spatny|v cem byl dobry|v cem byl nesnesitelny|proc ses na nej zlobil|a proc ses zlobil|co jsi na nem mel rad|co jsi na nem nemel rad|co ti na nem chybi|co tim myslis|co to znamena)$/.test(t))
 return {intent:'talk',ids:['raven'],t:'co jeste',continuation:true};
// Odejít / opustit místo je jasný úmysl odejít, nikoli název nového cíle.
// Pokud má místo jediný bezpečný východ, lze ho vybrat bez další otázky.
if(/^(?:odejdi|odejit|odejdu|odejdeme|opust|opustit|opustim|vyjdi ven|jdi pryc|jit pryc|chci odejit|chci jit pryc|dostat se odsud|vypadnout odsud|pryc)(?: |$)/.test(t)&&
   !/\b(?:do|k|ke|na) (?:mlyn|mlyna|mlynu|most|mostu|vez|veze|vezi|krypta|kryptu|jeskyne|jeskyni|rozcesti|nadvori|observator)\b/.test(t))
 return {intent:'go',ids:[],dir:null,leave:true,t};
// Při přechodu mostu lze říct přirozeně „druhá strana“ nebo „přehoď lano“.
// To platí pouze u skutečné propasti; nikde jinde se cesta neteleportuje.
if(state.room==='bridge'){
 if(/^(?:muzu|mohu|da se|je mozne|jde) (?:prejit|jit|se dostat|dostat se|preskocit)/.test(t)&&/\b(most|propast|na druhou stranu|druhy breh|protejsi breh)\b/.test(t))return {intent:'routeQuestion',ids:[],t};
 if(/^(?:prehod|prehaz|hod|vrhni|vrhnout)/.test(t)&&/\b(lano|lana|lanem|provaz|provazem|hak|hakem|haku)\b/.test(t)&&!/\b(na zem|pod nohy|do vody|pryc|zahod)\b/.test(t))return {intent:'tie',ids:['rope','pillar'],t};
 if(/^(?:prejdi|prejit|prejdu|prejdeme|jdi|jit|vyraz|bez|chci prejit|chci jit|chci se dostat|dostat se|dostanu se|presun se|presunu se|prekonat|prekonam|prekon|projdi|projit|kracej|prejdem)/.test(t)&&/\b(druhou stranu|druhy breh|druhem brehu|protejsi breh|pres most|pres propast|pres lano|za most|na druhy breh|na druhou stranu|tam pres|most|propast)\b/.test(t))return {intent:'go',ids:[],dir:'n',t};
}
if(/^(kam miri|kam kouka|co uvidim v dalekohledu|co je videt dalekohledem|co ukazuje dalekohled|na co se podivat dalekohledem)/.test(t))return {intent:'viewScope',ids:['scope'],t};
if(/^(co je uvnitr|a co je uvnitr|co je v nem|co je vevnitr|co je pod vikem|co v nem lezi)$/.test(t)){
 const id=state.lastSurface?.room===state.room?state.lastSurface.id:state.lastEntity;
 if(id&&surfaces[id])return {intent:'surface',source:id,ids:[id],t};
}
if(/^(co mam delat|jak mam pokracovat|jsem zasek|nevim si rady|porad mi)/.test(t))return {intent:'pleaForHelp',ids:[],t};
if(/^(kdo jsem|jak se citim|jak jsem na tom|co je mym ukolem|kolik mam zivotu|jsem zraneny|co mam za ukol)/.test(t))return {intent:'status',ids:[],t};
if(/^(kde mam|co mam u sebe|co mam v batohu|co nesu s sebou|obsah kapes)/.test(t))return {intent:'inventory',ids:[],t};
if(/^(dobry den|dobry vecer|dobre rano|cau|ahoj|nazdar|zdravim)$/.test(t))return {intent:'hello',ids:[],t};
if(state.room==='clearing'&&/^(?:jak se mas|jak ti je|jsi sam|jsi smutny|je ti zima|neni ti zima|bojis se|mas strach|mas hlad|chces jist|chces neco k jidlu|proc tu cekas|co tu delas|jak dlouho cekas|odkud jsi|odkud ses vzal|pamatujes si me|poznas me|vratil jsem se|chyb el jsem ti|chybel jsem ti|co bude potom|co budes delat|az bude jaro|jsme kamaradi|jsme pratele|veris mi|mam te rad|jsi muj kamarad|neboj se|jsi chytry|jsi hodny)(?: |$)/.test(t))return {intent:'talk',ids:['raven'],t};
if(state.room==='clearing'&&/^(?:muzu|mohu|smi[m]?) (?:te|ho|havrana) pohladit$/.test(t))return {intent:'touch',ids:['raven'],t};
if(/^(dekuji|dekuju|dik|diky|moc dekuji|moc diky|to je od tebe hezke|jsi hodny)( |$)/.test(t))return {intent:'thanks',ids:[],t};
if(/^(do prdele|do haje|do kelu|do pytle|ty vole|to je blbost|to snad ne)$/.test(t))return {intent:'curse',ids:[],t};
if(/^(coze|nerozumim|zopakuj|opakuj radu|co jsi rikal)$/.test(t))return {intent:'repeatReply',ids:[],t};
if(/^(nic|zrusit|zrus to|nech toho|kasli na to|zapomen na to|ne)$/.test(t))return {intent:'cancel',ids:[],t};
// Negated known actions must never execute their positive form.
if(t.split(' ').some(w=>w.startsWith('ne')&&wordIntent.has(w.slice(2))))return {intent:'cancel',ids:[],t};
t=t.replace(/^chci se /,'').replace(/^(?:vydat se|vydam se|vydavam se|presunout se|presunu se) /,'jdi ').replace(/^zpatky do /,'jdi do ').replace(/^jdi (?:nahoru|dolu) po schodech$/,'jdi do '+(state.room==='crypt'?'nadvori':'krypty'));
t=t.replace(/^(?:dej|uloz|schovej|strc|hod) (.+?) do (?:sveho )?(?:batohu|vaku|kapsy|inventare)$/,'vezmi $1');
t=t.replace(/^(?:dej|poloz|odloz) (.+?) (?:na zem|na podlahu|vedle sebe)$/,'odloz $1');
t=t.replace(/^rozsvit svetlo$/,'rozsvit lucernu').replace(/^udelej svetlo$/,'rozsvit lucernu').replace(/^udelej (?:si )?prest avku$/,'cekej');
const question=/^(?:co |co znamena|k cemu|jak funguje|proc|jak |kde |kdo |muzu |mohu |da se |je |jsou )/.test(t);
let p=parseBase(t);p.raw=raw;
// Široký slovník dříve zaměňoval „pomoc“, „poradit“ a „nevím“ za
// systémovou nabídku. Ta se nesmí otevřít bez explicitního příkazu.
if(p.intent==='hint'||(p.intent==='help'&&!/^(?:navod|manual|ovladani|instrukce|jak hrat|prikazy|slovnik)$/.test(t)))
 p.intent='pleaForHelp';
// Samotný název místa ani předložková fráze nejsou souhlas s přesunem.
if(['mill','observatory'].includes(state.room)&&/\bpod (?:stul|stolem|stol|stolek|stolkem)\b/.test(t)&&/^(?:co |jak |kde |podivej|koukni|koukej|prozkoum|prohlid|prohled|nahl|ohled)/.test(t))
 return {intent:'underTable',ids:['table'],t};
if(/^(?:nahledni|nahlednout|zahledni|zahlednout) (?:se )?(?:do|skrz|pres) (?:dalekohledu|teleskopu|nej)$/.test(t))return {intent:'viewScope',ids:['scope'],t};
if(p.ids.includes('scope')&&(
  (p.intent==='look'&&/\b(?:do|skrz|pres|dalekohledem|teleskopem|okularem)\b/.test(t))||
  /\b(?:koukat|podivat|divat|kouknout) se (?:skrz|do|pres)\b/.test(t)
 ))return {intent:'viewScope',ids:['scope'],t};
const sourceMatch=t.match(/\b(?:z|ze|od|na|v|ve) (.+)$/);
let source=sourceMatch&&Object.keys(surfaces).find(id=>entities[id].words.split(' ').some(w=>sourceMatch[1].split(' ').includes(w)));
if(/\b(?:ze zeme|na zemi|z podlahy|na podlaze)\b/.test(t))source='floor';
if(!source&&/\b(?:z nej|z neho|z neho|z ni|z toho|odtamtud|z toho stolu|na nem|v nem|na ni|v ni|tam)\b/.test(t)&&state.lastSurface?.room===state.room)source=state.lastSurface.id;
if(source&&p.intent==='take'){p.source=source;p.ids=p.ids.filter(id=>id!==source);p.all=p.all||/\b(veci|predmety|obsah|vse|vsechno)\b/.test(t);const except=t.split(/\b(?:krome|vyjma|mimo)\b/)[1];if(except)p.exclude=Object.keys(entities).filter(id=>entities[id].words.split(' ').some(w=>except.trim().split(' ').includes(w)));return p;}
if(source&&/^(?:co |a co |podivej|koukni|prozkoum|prohled|prohlid)/.test(t)){p.intent='surface';p.source=source;return p;}

const speaker=p.ids.find(id=>['raven','wizard'].includes(id));
const active=state.dialogue&&state.dialogue.room===state.room&&visible(state.dialogue.speaker)?state.dialogue:null;
const follow=/^(?:(?:a |no )?(?:co treba|napriklad|treba|co jeste|co dal|a dal|dal|pokracuj|povidej dal|vypravej dal|rekni vic|povez vic|co tim myslis|jak to myslis|proc|vazne|opravdu|jak to vis|odkud to vis|co ses dozvedel|co jsi slysel|co jsi pochytil|co vsechno|co o tom vis|co o tom jeste vis|vis neco dalsiho|povez mi vic|rekni mi vic|a potom|a co potom|jak to|opravdu to vis))(?: |$)/.test(t);
const speech=/\b(vis|vi|slysel|slysela|slyseli|dozvedel|pochytil|rikal|rikala|vypravel|povidal|povis|reknes|myslis|pamatujes)\b/.test(t);
const topicQuestion=/^(?:a |no a |co |a co |co vis o |co rikas na )/.test(t)&&dialogueTopics.some(([key,re])=>re.test(t))&&!p.intent;
if((speaker&&speech)||(active&&!pending&&(follow||topicQuestion))){
 p.intent='talk';p.ids=[speaker||active.speaker];p.followup=follow;p.t=t;p.continuation=follow;return p;
}

if(t==='co dal'&&!active)return {intent:'pleaForHelp',ids:[],t};
const locationWords={clearing:'rozcesti rozcestim rozcestniku',mill:'mlyn mlyna mlynu mlynem',bridge:'most mostu mostem',tower:'vez veze vezi vezou nadvori nadvorim',crypt:'krypta kryptu krypty krypte kryptou hrobka hrobku hrobce',observatory:'observator observatore observatori sin sini sine hvezdarna hvezdarnu hvezdarne',cave:'jeskyne jeskyni jeskyn jeskyni jeskynou'};
if(/\b(mistnost|mistnosti|lokaci|lokace|okoli|prostor)\b/.test(t))p.location=state.room;
p.location=p.location||Object.keys(locationWords).find(id=>locationWords[id].split(' ').some(w=>t.split(' ').includes(w)));

if(/^(?:zept|zepte|povej|povez|rekni|povidej|vypravej|vysvetli)/.test(t)){p.intent='talk';p.t=t;}
if(question&&!['look','inventory','status','map'].includes(p.intent)){p.intent='question';p.t=t;return p;}
if(p.location&&p.location!==state.room&&p.intent==='go')p.dir=null;
if(!p.intent&&p.location&&/^(?:do |k |ke |na |v |ve )?[a-z]+$/.test(t)&&!pending&&state.room==='clearing'){
 p.intent='talk';p.ids=['raven'];p.t=t;return p;
}
if(p.intent==='talk'&&/^(?:pozdrav|pozdravit|ahoj|nazdar|zdravim)( |$)/.test(t))p.intent='hello';
if(p.intent==='talk'&&!p.ids.some(id=>['raven','wizard'].includes(id))&&localNPC())p.ids.unshift(localNPC());
if(['hello','thanks','sorry','bye','curse'].includes(p.intent))return p;
// A pronoun can refer to an earlier target even when the tool is explicitly named.
if(state.lastEntity&&/\b(na nej|na ni|s nim|s ni|do nej|do ni|jim|ji)\b/.test(t)&&!p.ids.includes(state.lastEntity))p.ids.push(state.lastEntity);
if(p.all){const exception=t.split(/\b(?:krome|vyjma|mimo)\b/)[1];if(exception)p.exclude=Object.keys(entities).filter(id=>entities[id].words.split(' ').some(w=>exception.trim().split(' ').includes(w)));}
if(!p.ids.length&&/\b(je|ty|jimi|nich)\b/.test(t)&&Array.isArray(state.lastEntities))p.ids=state.lastEntities.filter(visible);
if(p.intent==='drop'&&p.all)return p;
if(!p.intent&&p.ids.length===0){
const words=t.split(' '),first=words.find(w=>!['se','si','mi','to','ten','ta','prosim'].includes(w))||'';
const near=[...wordIntent.keys()].filter(w=>w.length>3&&distance(first,w)===1);
if(near.length){p.suggest=t.replace(first,near[0]);return p;}
}
// Unknown object spelling is suggested, never silently substituted into an action.
if(p.intent&&!p.ids.length&&!p.dir&&!p.location){const ignored=new Set(['se','si','mi','to','ten','ta','prosim','na','do','k','ke','s','ze','z','v','ve','u','o','a','vychod','zapad','sever','jih','ven','dovnitr']);for(const token of t.split(' ')){if(token.length<4||ignored.has(token)||wordIntent.has(token))continue;const candidates=Object.entries(entities).filter(([id,e])=>visible(id)).filter(([id,e])=>e.words.split(' ').some(w=>w.length>3&&distance(token,w)===1));if(candidates.length===1){p.nounSuggestion=candidates[0][1].name;break;}}}
if(p.intent&&!['talk','question','go','look','inspect','read','help'].includes(p.intent)){
const m=t.match(/\b(?:na|do|k|ke|s|se) (.+)$/);
if(m&&!/^(zem|podlahu|sebe|batohu|vaku|kapsy)$/.test(m[1])){
const tokens=m[1].split(' ').filter(w=>!['ten','tu','to','toho','tomu','tim','tou','svuj','svoji','sveho','mi','prosim','ho','ji','nej','ni','nejho','nim','je','jej','se','si'].includes(w));
const known=tokens.some(w=>Object.values(entities).some(e=>e.words.split(' ').includes(w)));
if(tokens.length&&!known&&!p.location)p.unresolved=m[1];
}}
return p;
}
function parse(raw){return languageParse(raw)}
const dialogueTopics=[
 ...ravenDeepTopics,
 ['friendship',/kamarad|pratel|mam te rad|veris mi|duvera|jsme pratele/],
 ['feelings',/jak se mas|jak ti je|jsi smutn|jsi sam|je ti zima|neni ti zima|jak se citis/],
 ['waiting',/proc tu cekas|co tu delas|jak dlouho (tu )?cekas|na koho cekas/],
 ['return',/pamatujes si me|poznas me|vratil jsem se|chybel jsem ti|vzpominas si/],
 ['fear',/bojis se|mas strach|neboj se|mas obavy/],
 ['future',/co bude potom|co budes delat|az bude jaro|az se vrati jaro/],
 ['past',/odkud jsi|odkud ses vzal|co bylo driv|jak jste se poznali/],
 ['identity',/kdo|jmen|jsi|mluvit|mluvici/],['crypt',/hvezdar|klic|krypt|hrob/],['bridge',/most|lano|provaz|propast/],['light',/lucern|lamp|olej|svetl/],['winter',/carodej|mag|led|mraz|zima/],['sun',/cock|slunc|kaps|paprsek|kotouc/],['mill',/mlyn|mlynar|stul/],['food',/jid|hlad|krm|chleb/],['journey',/pomoc|rada|kam|cesta|cil/],['weather',/pocasi|vitr|snih|mesic/],['joke',/vtip|zert|srand/]
];
// Na rozdíl od havrana si čaroděj hlídá odstup. Přesto má dlouhou paměť,
// mnoho vlastních témat a odpovědi se mění podle předchozího rozhovoru,
// pokusů dostat se k portálu a skutečného stavu hry.
function wizardConversation(t){
 const previous=state.dialogue?.speaker==='wizard'&&state.dialogue?.room==='cave'?state.dialogue:null;
 const follow=/^(?:(?:a |no )?(?:proc|a proc|jak to myslis|co tim myslis|co jeste|a co jeste|rekni vic|povez vic|pokracuj|co dal|opravdu|vazne|a potom|co se stane potom))$/.test(t);
 const b=wizardMemory();
 const topic=wizardTopicFor(t,previous)||(/\b(ahoj|zdravim|dobry den|dobry vecer|mluv|promluv|oslov|povidej)\b/.test(t)?'greeting':'unknown');
 const stage=b.topics[topic]||0;b.topics[topic]=stage+1;b.exchanges++;
 state.dialogue={speaker:'wizard',room:'cave',topic,stage};
 const depth=adventureReactions.wizardDepth?.[topic]||adventureReactions.wizardDepth?.unknown;
 if(!depth){log('„Vrať se, odkud jsi přišel.“');return;}
 if(state.caveHits>0&&stage>1&&['threat','combat','surrender','passage'].includes(topic)){
  sayVariant('wizard:escalation',[
   'Čaroděj přestane mluvit. Zvedne žezlo. „Varování skončilo.“',
   '„Už jsi na mě zaútočil. Další chybu ti neodpustím.“',
   '„Ještě jednou mě vyzkoušej a skončíš vedle těch ostatních.“']);return;
 }
 if((f().charged||has('pod'))&&topic==='light'){
  sayVariant('wizard:light-charged',[
   'Čaroděj si všimne věci v tvé ruce. „Polož to. Hned.“',
   'Oči na rouchu se otevřou současně. „Neslyšel jsi mě?“',
   '„Ještě jeden krok a nebudeš mít čas ničeho litovat.“']);return;
 }
 if(follow&&previous&&topic==='motive'){
  sayVariant('wizard:why-motive',['„Protože tak jsem rozhodl. To ti musí stačit.“','„Svět se měnil příliš dlouho. Teď už nebude.“','„Nepotřebuji tvé svolení.“']);return;
 }
 if(topic==='passage'&&b.approaches>0&&stage<3){
  sayVariant('wizard:tried-passage',[
   '„Už jsi zkusil projít,“ připomene čaroděj. „Led ti odpověděl jasněji než já.“',
   '„Pořád si myslíš, že tě pustím jen proto, že se tentokrát pěkně zeptáš?“']);return;
 }
 if(topic==='guard'&&b.approaches>1&&stage>0){
  log('Čaroděj ukáže žezlem na zatarasenou stezku. „Teď už víš, co tu dělám. A přesto pořád zkoušíš obejít můj sloup.“');return;
 }
 const entries=stage&&depth.follow?.length?depth.follow:depth.open;
 sayVariant('wizard:'+topic+':'+(stage?'follow':'open'),entries);
}
function wizardPortalAttempt(){
 if(state.room!=='cave'){log('Žádný portál tady není.');return;}
 if(state.won){
  state.lastEntity='portal';
  log('Vystoupáš ke vstupu do osvobozeného portálu. Led mizí z jeho okrajů a za temnotou se poprvé objevuje světlo. Tady první kapitola končí; průchod dál si zatím ponechává své tajemství.');return;
 }
 const b=wizardMemory();b.approaches++;
 state.lastEntity='portal';state.dialogue={speaker:'wizard',room:'cave',topic:'passage',stage:b.approaches-1};
 const lines=[
  'Vykročíš po úzké stezce vzhůru k portálu. Čaroděj pootočí žezlo; z podlahy vyrazí tenké ledové ostny a spojí se před tebou v neprůchodnou stěnu. „O krok dál už nepůjdeš,“ ozve se shora. Zůstáváš před sloupem.',
  'Zkusíš se protáhnout kolem ledové stěny. Páté oko nad čarodějovým čelem tě sleduje. Led ti přímo pod botou naroste přes cestu. „Myslel sis, že jsem si tě napoprvé nevšiml?“',
  'Znovu se vydáš směrem k portálu. Čaroděj tentokrát nepromluví; jen stiskne žezlo. Led zapraská a stezka za jeho sloupem se uzavře. Průchod je stále na dohled, ale nedosažitelný.'
 ];
 log(lines[Math.min(b.approaches-1,2)]);
 if(b.approaches>1)effect={type:'bolt',start:performance.now()};
}
function cavePhysicalReaction(topic,t){
 if(state.room!=='cave'||state.won){log('Čaroděj už na stezce nestojí.');return;}
 const bodily=['inspectBodies','searchBodies','weapons','bow'].includes(topic);
 state.lastEntity=bodily?'dwarfs':topic==='cutIce'?'ice':'wizard';
 if(topic==='drawSword'){
  state.lastEntity='sword';
  log(has('sword')?'Vytáhneš meč z pochvy. Kov ti v rukavicích studí do dlaní. Čaroděj se podívá na ostří, ale neustoupí.':'Sáhneš po jílci, ale meč u sebe právě nemáš.');return;
 }
 if(topic==='inspectBodies'){
  sayVariant('cave:inspectBodies',[
   'Přiklekneš k nejbližšímu trpaslíkovi. Na vousu má bílou krustu ledu, v promáčknuté přilbě zůstala prasklina. O kus dál leží další tělo pod převráceným štítem. Někteří stále svírají zbytky zbraní; nikdo se nehýbe.',
   'Všimneš si stop vymrzlé bitvy. Jeden z trpaslíků leží na boku, jako by se pokoušel odplazit ke skále. Jeho druh zůstal těsně u něj. Mráz oba znehybnil.',
   'Pozorněji prohlédneš padlé. Zohýbané přilby a rozbitý štít svědčí o krátkém, zoufalém střetu. Nikdo z nich už nemůže vyprávět, co se zde přesně stalo.'
  ]);return;
 }
 if(topic==='searchBodies'){
  sayVariant('cave:searchBodies',[
   'Opatrně prohledáš oděv nejbližšího padlého. Kožený váček je prázdný a ztuhlý mrazem. Krátká sekerka mu přimrzla k ruce, jinému trpaslíkovi zbyla jen zlomená násada kopí. Nic použitelného, co by sis mohl vzít, nenacházíš. Čaroděj tě tiše sleduje.',
   'Zkusíš opatrně nadzvednout okraj pláště dalšího trpaslíka. Látka přimrzla ke kameni a za opaskem má jen vyprázdněnou pochvu. Nepoškodíš tělo dalším páčením.',
   'Jejich výbavu jsi už prošel. V rozbitých přezkách, zmrzlých váčcích a úlomcích zbraní nic použitelného není. Čaroděj se na tvé počínání stále dívá z výšky.'
  ]);return;
 }
 if(topic==='weapons'){
  log('Ano. Někteří trpaslíci mají u sebe zbraně, ale vidíš jen otupenou sekerku přimrzlou k ruce a zlomenou násadu kopí. Zbytky výzbroje jsou pod vrstvou ledu a nedají se použít.');return;
 }
 if(topic==='bow'){
  log('Rozhlédneš se mezi padlými a po skalních výstupcích. Žádný luk ani použitelné šípy tu nevidíš. V ledu zůstala jen sekerka a úlomky zlomeného kopí.');return;
 }
 if(topic==='hideWizard'){
  sayVariant('cave:hideWizard',[
   'Přitiskneš se k ledové stěně a zkusíš se ztratit čaroději z dohledu. Jedno oko se zavře, ale další se pootočí přímo za tebou. „Schovávat se přede mnou můžeš,“ ozve se shora. „Neznamená to, že zmizíš.“',
   'Přesuneš se za zubatý ledový výčnělek. Na okamžik nevidíš čaroděje, jenže pak se na ledové ploše vedle tebe objeví jeho modrý odraz. „Vidím tě,“ pronese klidně.',
   'Zadržuješ dech a nehýbeš se. V tom tichu slyšíš vlastní srdce. „Není třeba šeptat,“ ozve se čaroděj. „Pořád jsi tady.“'
  ]);return;
 }
 if(topic==='throwAsk'){
  log('Čaroděj stojí vysoko nad stezkou. Opatrně odhadneš vzdálenost a sevřeš pěst. Jestli po něm chceš něco hodit, musíš se rozhodnout, co přesně obětuješ.');return;
 }
 if(topic==='missingPod'){
  log('Sáhneš po výstroji, ale žádnou takovou kapsli u sebe nemáš. Nemůžeš hodit něco, co nedržíš v ruce.');return;
 }
 if(topic==='throwSword'){
  if(!has('sword')){log('Meč už u sebe nemáš.');return;}
  effect={type:'attack',start:performance.now()};
  log('Rozmáchneš se a vyšleš meč vzhůru. Čepel se ani nepřiblíží k čarodějovu tělu; narazí do sloupu a po ledové ploše sklouzne zpátky k tvým nohám. Rychle ji zvedneš. „Marnotratné,“ pronese čaroděj.');return;
 }
 if(topic==='throwIce'){
  effect={type:'attack',start:performance.now()};
  log('Ze země odlomíš drobný kus ledu a vrhneš jej vzhůru. Rozbije se o spodní hranu sloupu v obláčku třpytek. Čaroděj se ani nepohne. „Tohle je celá tvoje strategie?“');return;
 }
 if(topic==='throwStone'){
  effect={type:'attack',start:performance.now()};
  log('Najdeš v ledové suti drobný kámen a mrštíš jím vzhůru. Odklepne se od zledovatělé skály hluboko pod čarodějem. „Příště zamiř lépe,“ ozve se posměšně.');return;
 }
 if(topic==='cutIce'){
  if(!has('sword')){log('Nemáš čím odštípnout ledový sloup.');return;}
  effect={type:'attack',start:performance.now()};
  sayVariant('cave:cutIce',[
   'Rozmáchneš se proti patě sloupu. Meč odštípne několik šupin namodralého ledu, ale pod nimi je další, stejně tvrdá vrstva.',
   'Sekneš znovu. Prasklina se rozběhne sotva na šířku dlaně a hned ji překryje tenký průsvitný led. Čaroděj se ani nepohne.',
   'Další úder ti rozvibruje paži. Ze sloupu odpadne kousek ledu, ale vysoká vyvýšenina stále stojí. Takto se k čaroději nedostaneš.'
  ]);return;
 }
 if(topic==='attackWizard'){
  action({intent:'attack',ids:['wizard'],t});return;
 }
 if(topic==='attackEye'){
  state.caveHits++;effect={type:'bolt',start:performance.now()};
  if(state.caveHits>=3){state.lost=true;log('Zkusíš prudce bodnout do jednoho z očí. Na sloup ale nedosáhneš. Čaroděj tentokrát nenechá výpad bez trestu: žezlo vyšle plný výboj a led tě uzavře do průsvitného vězení. Příkaz „zpět“ vrátí poslední tah.');}
  else log('Vyrazíš s mečem proti nejbližšímu oku. Čaroděj je příliš vysoko; oko se jen pomalu pootočí za ostřím a žezlo tě přinutí uskočit před ledovým zábleskem. „Myslíš, že jsi první, koho to napadlo?“');return;
 }
}
function conversation(target,t,followup=false){
if(!target)target=localNPC();if(!target){log('Nikdo, kdo by mohl odpovědět, tu není. Tvoje slova utichnou v prostoru.');return;}
if(!visible(target)){failReach(target);return;}
if(!['raven','wizard'].includes(target)){log('„'+entities[target].name+'“ ti neodpoví.');return;}
state.lastEntity=target;
if(target==='wizard'){wizardConversation(t);return;}
if(target==='raven')ravenMemory().met=true;
if(target==='raven')ravenEmote={start:performance.now(),kind:'talk'};
if(target==='raven'&&/\b(jsi chytry|jsi hodny|jsi skvely|dobra rada|moc mi pomahas|mam te rad)\b/.test(t)){
 const b=ravenMemory();b.praiseCount=(b.praiseCount||0)+1;if(b.praiseCount<=2)b.trust=Math.min(8,b.trust+1);
 sayVariant('raven:praise',['Havran se naježil. „Jestli mi budeš takhle lichotit, nevejdu se na ceduli.“','„Mám tě také rád,“ vyhrkne havran a hned dodá: „Tedy jako rozumného poutníka.“','Havran se překvapivě jemně usměje zobákem. „Takový rozhovor stojí za celou zimu čekání.“','„Hvězdář býval jediný, kdo mě chválil,“ řekne po chvíli. „Děkuji.“']);return;
}
const previous=state.dialogue&&state.dialogue.speaker===target&&state.dialogue.room===state.room?state.dialogue:null;
const continuation=followup||/co treba|napriklad|co jeste|co dal|a dal|pokracuj|povidej dal|vypravej dal|rekni vic|povez vic|co tim myslis|jak to myslis|^proc$|^vazne$|^opravdu$|jak to vis|odkud to vis|slysel|dozvedel|pochytil/.test(t);
const followupForm=/^(?:(?:a |no )?(?:co treba|co jeste|co dal|co jsi slysel|co ses dozvedel|jak to vis|co tim myslis|jak to myslis|proc|rekni vic|povez vic|napriklad|opravdu|vazne|a co potom))/.test(t);
const explicitTopic=continuation&&previous&&followupForm?null:dialogueTopics.find(([key,re])=>re.test(t));
const topic=explicitTopic?.[0]||(continuation&&previous?previous.topic:'journey');
const stage=previous?.topic===topic&&continuation?(previous.stage||0)+1:0;
state.dialogue={speaker:target,room:state.room,topic,stage};
if(target==='raven'&&explicitTopic){const b=ravenMemory();b.topics[topic]=(b.topics[topic]||0)+1;if(b.topics[topic]===1&&['feelings','past','waiting','friendship','fear'].includes(topic))b.trust=Math.min(8,b.trust+1);}
const depth=target==='raven'?adventureReactions.ravenDepth?.[topic]:null;
if(target==='raven'&&explicitTopic&&depth){
 const b=ravenMemory();
 if(b.topics[topic]===1&&['offerHelp','companionship','promise','truth','loss','solitude','questions'].includes(topic))b.trust=Math.min(8,b.trust+1);
 if(topic==='offerHelp')b.helpOffered++;
 if(topic==='askHelp')b.helpAsked++;
 if(topic==='promise'&&/slibuji|slibuju|slibim|vratim se|dodrzim slib/.test(t))b.promiseMade=true;
}
if(target==='raven'&&state.won&&depth?.after){sayVariant('raven-after-depth:'+topic,depth.after);return;}
if(target==='raven'&&state.won&&adventureReactions.ravenAfter[topic]){
 const lines=adventureReactions.ravenAfter[topic];
 log(lines[stage%lines.length]);return;
}
if(continuation&&!explicitTopic&&previous){
 if(target==='raven'&&/^(?:a |no )?(?:jak to vis|odkud to vis|odkud to vsechno vis|jak ses to dozvedel)$/.test(t)){
  log(depth?.evidence||adventureReactions.ravenEvidence[topic]||'„Slyšel jsem toho dost,“ řekne havran. „Ale ne všechno vím jistě.“');return;
 }
 if(target==='raven'&&/^(?:a |no )?proc$/.test(t)){
  log(depth?.why||adventureReactions.ravenWhy[topic]||'„Někdy je důležitější, co s tím uděláš, než proč se to stalo,“ odpoví havran.');return;
 }
 if(depth?.follow){log(depth.follow[(stage-1+depth.follow.length)%depth.follow.length]);return;}
 const chain=adventureReactions.dialogue[target]?.[topic];
 if(chain?.length){
  let answer=chain[(stage-1+chain.length)%chain.length];
  if(target==='raven'&&topic==='bridge'&&f().bridge&&stage===2)answer='„Už jsi to dokázal! Jištění drží mezi pilíři. Nech uzel uvázaný i pro cestu zpátky.“';
  if(target==='raven'&&topic==='light'&&f().lit&&stage===2)answer='„Vidíš? Křesadlo a olej nakonec stačily. V kryptě už teď nebudeš tápat.“';
  sayVariant('dialogue-follow:'+target+':'+topic+':'+stage,[answer]);return;
 }
 const remembered=dialogueTopics.find(([key])=>key===topic);
 if(remembered)t=({identity:'kdo',crypt:'hvezdar',bridge:'most',light:'lucerna',winter:'zima',sun:'cocka',mill:'mlyn',food:'jidlo',journey:'cesta',weather:'pocasi',joke:'vtip'})[topic];
}
if(target==='wizard'){
const answer=/kdo|jmen|jsi/.test(t)?['„Jsem ten, kvůli komu se tu i čas bojí pohnout.“','„Jméno ti cestu neotevře, rytíři.“']:/proc|zima|mraz|udoli/.test(t)?['„V ledu nic neuvadne. Ani moje vláda.“','„Vy tomu říkáte zima. Já tomu říkám pořádek.“']:/vzd|pust|prosit|mir|dohod/.test(t)?['„Odlož naději a možná tě nechám odejít stejnou cestou.“','„O průchodu se nesmlouvá.“']:/teplo|kaps|ohen|slunc/.test(t)?['Čaroděj sevře žezlo pevněji. „S tím se ke mně nepřibližuj.“','Na rouchu se naráz otevřou všechny oči.']:/trpas|mrtv|tela/.test(t)?['„Také si mysleli, že stačí meč.“','Čaroděj na těla ani nepohlédne.']:['„Tvoje slova mě nezahřejí.“','„Máš poslední příležitost se vrátit.“','Čaroděj se usměje a žezlo zapraská.'];sayVariant('wizard:'+answer[0],answer);return;}
if(target==='raven'&&depth){
 const b=ravenMemory();
 if(topic==='bridgeSafety'&&f().bridge){
  log('Havran se zadívá k severu. „Pořád je to propast. Ale teď už je mezi pilíři pevně zajištěné lano. Opatrně po něm přejít můžeš — a nezapomeň, že cesta zpátky je stejně důležitá.“');return;
 }
 if(topic==='danger'&&['bridgeSafety','bridge'].includes(previous?.topic)){
  log(f().bridge?'„Přechod je teď zajištěný, ale bezstarostný bych nebyl,“ odpoví havran. „Dávej pozor, kam šlapeš a kde máš ruce.“':
     '„Ano, právě ten most je nebezpečný,“ odpoví havran. „Žádná prkna, jen dva pilíře a hluboká propast. Jestli chceš přejít, nejdřív je spoj lanem s hákem.“');return;
 }
 if(topic==='danger'&&previous?.topic==='mill'){
  log('„U mlýna je nebezpečný hlavně led a starý náhon,“ zamyslí se havran. „U zavřených dveří nic nezískáš násilím. Ale to, co leží venku, bys měl prohlédnout.“');return;
 }
 if(b.harmed>b.apologies&&['offerHelp','companionship','truth'].includes(topic)){
  log('Havran si tě ostražitě prohlédne. „Můžeme spolu mluvit. Ale důvěru nejde přivázat jako lano a znovu ji získat jednou větou.“');return;
 }
 if(topic==='askHelp'&&b.helpAsked>1){
  // Opakovaná prosba je další rozhovor, nikoli skrytá zkratka k řešení hádanky.
  const replies=depth.follow;
  if(replies?.length){log(replies[(b.helpAsked-2)%replies.length]);return;}
 }
 if(topic==='questions'){
  const qs=adventureReactions.ravenQuestions,idx=((b.topics.questions||1)-1)%qs.length;
  b.pending={kind:'question',index:idx,attempts:0};
  sayVariant('raven-open-depth:questions',depth.open);log(qs[idx].ask);return;
 }
 if(topic==='riddles'){
  const qs=adventureReactions.ravenRiddles,idx=((b.topics.riddles||1)-1)%qs.length;
  b.pending={kind:'riddle',index:idx,attempts:0};
  sayVariant('raven-open-depth:riddles',depth.open);log(qs[idx].ask);return;
 }
 sayVariant('raven-open-depth:'+topic,depth.open);return;
}
if(adventureReactions.ravenOpen[topic]){
 let opening=adventureReactions.ravenOpen[topic];
 if(topic==='return'&&f().charged)opening=['Havran zpozorní. „To světlo na tvém plášti... Dokázal jsi probudit kotouč. Věděl jsem, že se vrátíš.“'];
 if(topic==='friendship'&&ravenMemory().trust>=4)opening=['Havran poskočí blíž. „Jestli se ptáš, jestli jsme přátelé, odpovím ano. A teď mě tím laskavě nerozmazluj.“'];
 sayVariant('raven-open:'+topic,opening);return;
}
let lines=/kdo|jmen|jsi|mluvit|mluvici/.test(t)?['„Jsem havran. Víc titulů nepotřebuji.“','„Hvězdář si se mnou povídal. Člověk pochytí ledacos. Tedy pták.“']:
/hvezdar|klic|krypt|hrob/.test(t)?['„Hvězdář odpočívá pod věží. Klíč si nechal u sebe. Bez světla tam nechoď.“','„Znak slunce na hrobě, znak slunce na zámku. Vidíš tu souvislost?“']:
/most|lano|provaz|propast/.test(t)?[f().bridge?'„Lano drží. Vidíš? Někdy stačí pořádný uzel.“':'„Já přeletím. Ty potřebuješ provaz. Hledej ve mlýně.“','„Za pevný pilíř se hák zachytí. Ale nejdřív si ověř, že máš druhý konec.“']:
/lucern|lamp|olej|svetl/.test(t)?['„Suchý knot nesvítí. Nejdřív olej, potom křesadlo.“','„Lucerna se hodí víc v ruce než na stole.“']:
/carodej|mag|led|mraz|zima/.test(t)?['„Led nemá rád teplo. Ani když na něm stojí namyšlený čaroděj.“','„Mečem na něj nedosáhneš. Rozum občas doletí dál než ocel.“']:
/cock|slunc|kaps|paprsek|kotouc/.test(t)?['„Hvězdář uměl světlo schovat do skla. Zbytek si napsal do knihy.“','„Ve věži se dívej nejen na hvězdy. Čti.“']:
/mlyn|mlynar|stul/.test(t)?['„Mlynář odešel, když zamrzlo kolo. Na stole nechal výbavu.“','„Západní cesta tě dovede ke mlýnu. Nepleť si ji s cestou k mostu.“']:
/jid|hlad|krm|chleb/.test(t)?['„Máš drobek? Ne? Tak si alespoň nezahazuj provaz.“','„Olej ani sklo nejím. A na železo nemám zobák.“']:
/pomoc|rada|kam|cesta|cil/.test(t)?['„Mlýn, most, věž. Tam začni. A do tmy vezmi světlo.“','„Když něco nejde silou, pořádně se podívej, co držíš v ruce.“']:
/pocasi|vitr|snih|mesic/.test(t)?['„Včera tu ještě tekla voda. Tahle zima není přirozená.“','„Peří zahřeje. Tobě doporučuji pohyb.“']:
/vtip|zert|srand/.test(t)?['„Proč rytíř nepřeletěl propast? Protože si místo křídel přinesl meč.“','Havran zakráká. Zdá se, že se svým vtipem je velmi spokojen.']:
['„Přes most k věži. Pod věží klíč. Ve věži vědění.“','„Už dlouho tu nikdo nešel směrem k horám. Ty jsi buď odvážný, nebo ztracený.“','„Máš s sebou něco na světlo? Bez něj bych dolů nelezl.“'];sayVariant('raven:'+lines[0],lines);
}
function answerRoute(t,advice=false){
 const dir=[['n',/\b(sever|severu|severni|severem|nahoru)\b/],['s',/\b(jih|jihu|jizni|jihem|dolu)\b/],['w',/\b(zapad|zapadu|zapadni|zapadem|vlevo)\b/],['e',/\b(vychod|vychodu|vychodni|vychodem|vpravo)\b/]].find(([,re])=>re.test(t))?.[0];
 const place=/\b(mlyn|mlyna|mlynu)\b/.test(t)?'mill':/\b(krypta|kryptu|krypty|hrobka|hrobku)\b/.test(t)?'crypt':/\b(observator|observatore|hvezdarna|hvezdarnu|dalekohled)\b/.test(t)?'observatory':/\b(vez|veze|vezi|nadvori)\b/.test(t)?'tower':/\b(jeskyne|jeskyni|carodej)\b/.test(t)?'cave':/\b(most|mostem|mostu)\b/.test(t)?'bridge':null;
 const branch=dir||(place&&Object.entries(rooms[state.room].exits).find(([,dest])=>dest===place)?.[0]);
 if(state.room==='clearing'){
  const b=ravenMemory();b.met=true;state.dialogue={speaker:'raven',room:'clearing',topic:'journey',stage:0};
  if(/^(?:kudy mam jit|kam mam jit|jakou cestou mam jit|kterou cestou mam jit)$/.test(t)){
   log(has('rope')||f().bridge?'Havran nakloní zobák k severu. „K mostu. Lano s hákem už máš, takže teď můžeš zjistit, zda pilíře udrží přechod. Ale spěchat nemusíš.“':
      'Havran zakráká tišeji. „Nejdřív západní cesta k mlýnu. Tam se vybav. Potom se vrať a vydej se na sever k mostu. Ta propast rytířům, kteří spoléhají jen na odvahu, nic neodpouští.“');return;
  }
  if(advice&&(place==='mill'||branch==='w')){
   log(has('rope')||f().bridge?
      'Havran pohlédne k mlýnu. „Tam už jsi našel to nejdůležitější. Jestli se ptáš na další cestu, zkus sever k mostu. Ale nespěchej, pokud ti tam něco chybí.“':
      'Havran se podívá k západu. „Ano, do mlýna bych se na tvém místě podíval. Dveře jsou sice zavřené, ale mlynář zanechal venku výbavu, kterou budeš potřebovat. Cesta vede na západ.“');return;
  }
  if(advice&&(place==='bridge'||branch==='n')){
   log(has('rope')||f().bridge?
     '„Na sever k mostu, ano,“ přikývne havran. „Teď už máš čím se přes propast zajistit. Jen zkontroluj uzly.“':
     'Havran se zamyslí. „K mostu můžeš jít, ale dál se bez jištění nedostaneš. Nejdřív bych se vybavil u mlýna.“');return;
  }
  if(place==='mill'||branch==='w'){sayVariant('route-mill',[
   'Havran ukáže zobákem doleva. „Na západ k mlýnu. Kolo stojí a dveře jsou zavřené, ale mlynář venku nechal něco pro poutníka.“',
   '„Mlýn je nalevo,“ odpoví havran. „Cestu poznáš podle zamrzlého náhonu. A ne, dveře se nepohnou jen proto, že na ně budeš pěkně mluvit.“']);return;}
  if(place==='bridge'||branch==='n'||place==='tower'||place==='crypt'||place==='observatory'||place==='cave'){
   log(f().bridge?'Havran kývne k severu. „Přes most se dostaneš k věži. Z jejího nádvoří vede cesta ke kryptě, do kopule i dál k jeskyni.“':
       'Havran ukáže na sever. „Tudy k mostu. Za ním stojí věž, jenže prkna chybí. Bez jištění se za pilíře nedostaneš.“');return;}
  if(branch){log('Havran se podívá mezi smrky. „Tím směrem z rozcestí žádná vychozená cesta neodbočuje. Rozcestník ukazuje západ k mlýnu a sever k mostu.“');return;}
  sayVariant('route-clearing',[
   '„Dvě cesty,“ vysvětluje havran. „Na západ k zavřenému mlýnu, na sever ke strženému mostu. Za mostem začíná cesta k věži.“',
   'Havran pohne hlavou od jedné šipky ke druhé. „Mlýn vlevo, most před tebou. Vždycky jsem měl rád, když rozcestník ukazuje pravdu.“',
   '„Kudy dál?“ Havran vydechne obláček páry. „Nejdřív zjisti, co se dá vzít z mlýna. Potom teprve zkoušej překonat propast.“']);return;
 }
 const descriptions={
  mill:{e:'Východní cesta se vrací k rozcestníku pod smrky. Dubové dveře mlýna zůstávají zevnitř zajištěné.'},
  bridge:{s:'Na jih se cesta vrací k havranovi na rozcestí.',n:()=>f().bridge?'Lano už drží mezi pilíři. Severní cesta tě bezpečně zavede na nádvoří věže.':'Severní cesta je za propastí. Pilíře stojí, ale bez jištění se tam nedostaneš.'},
  tower:{s:'Na jih vede cesta přes most zpět k rozcestí.',w:'Západní schody sestupují do krypty pod věží. V temnotě se bez světla špatně hledá.',n:()=>state.won?'Severní stezka vede k jeskyni, kde po čaroději zůstává jen tající led.':'Severní stezka stoupá do jeskyně, odkud přichází nezvyklý chlad.'},
  crypt:{e:'Východní schody vedou z krypty zpět na nádvoří hvězdáře.'},
  observatory:{s:'Jižními dveřmi sestoupíš z observatoře zpět na nádvoří.'},
  cave:{s:'Na jih vede kamenitá stezka zpátky k věži. Portál je v horní části jeskyně, nikoli na jižní cestě.'}
 };
 if(state.room==='cave'&&/portal|pruchod/.test(t)){log(state.won?'Za portálem začíná další cesta, kterou tato kapitola ještě nevypráví.':'Portál je za čarodějem. Zatím nevíš, kam vede, a ledový strážce k němu nikoho nepouští.');return;}
 if(state.room==='bridge'&&/\b(druhou stranu|druhy breh|protejsi breh|most|propast)\b/.test(t)&&/\b(prejit|dostat se|preskocit|prejit na|kudy|jak)\b/.test(t)){
  log(f().bridge?'Lano s hákem je pevně zachycené mezi pilíři. Můžeš po zajištěném přechodu vyrazit na druhý břeh.':'Zatím ne. Prkna mostu chybí a propast nepřeskočíš. Potřebuješ mezi pilíři zajistit přechod lanem s hákem.');return;
 }
 if(state.room==='tower'&&place==='observatory'){log(f().door?'Do observatoře se jde otevřenými dveřmi věže.':'Observatoř je uvnitř věže; dveře s mosazným zámkem jsou '+(f().doorUnlocked?'odjištěné, ale zavřené.':'zatím zamčené.'));return;}
 if(place&&place!==state.room&&!branch){
  const paths={mill:'přes rozcestí západním směrem',bridge:'přes rozcestí na sever',tower:'přes most na sever',crypt:'přes most k věži a po západních schodech dolů',observatory:'přes most na nádvoří a dveřmi dovnitř',cave:'přes most k věži a dál na sever'};
  log('K místu '+rooms[place].title+' se dostaneš '+paths[place]+'. Cesta se skládá z navazujících úseků, nedá se přeskočit jediným krokem.');return;
 }
 if(branch){
  const d=descriptions[state.room]?.[branch];
  log(d?(typeof d==='function'?d():d):'V tom směru tu žádná vychozená stezka nepokračuje.');return;
 }
 if(place===state.room){log('Tady už stojíš. Můžeš se rozhlédnout nebo se zeptat na cestu odtud.');return;}
 const all=Object.entries(descriptions[state.room]||{}).map(([direction,line])=>({n:'Na sever',s:'Na jih',w:'Na západ',e:'Na východ'})[direction]+' '+(typeof line==='function'?line():line));
 if(state.room==='tower')all.push(f().door?'Dovnitř do observatoře vedou otevřené dveře.':'Observatoř je za dveřmi věže.');
 log(all.join(' '));
}
function ravenPendingAnswer(t,p){
 if(state.room!=='clearing')return false;
 const b=ravenMemory(),pendingReply=b.pending;
 if(!pendingReply)return false;
 // Otevření mapy, uložení hry ani nápověda nepřeruší položenou otázku.
 if(['save','help','map'].includes(p.intent))return false;
 if(['go','restart','undo','load','talk','routeQuestion','hello','thanks','bye'].includes(p.intent)){
  b.pending=null;return false;
 }
 if(pendingReply.kind==='towerRecognition'){
  if(/^(ano|jo|jiste|urcite|samozrejme|presne tak|dostal jsem se|povedlo se|uz jsem tam byl)$/.test(t)){
   b.pending=null;log('Havranovi se na okamžik zalesknou oči. „Tak přece. Hvězdář ty dveře tolik let zamykal a nakonec jsi je otevřel ty.“ Pokývne zobákem. „Doufám, že jsi tam našel víc než jen prach. Co v té věži zůstalo, vypráví příběh, který nedokázal vyslovit.“');return true;
  }
  if(/^(ne|nikoli|jeste ne|nevim jak|zatim ne|vlastne ne)$/.test(t)){
   b.pending=null;log('„Pak jsem se ukvapil,“ přizná havran. „Sluneční znak ale poznávám. Kdo jednou nosil takový klíč, neměl ke hvězdáři daleko. Věž počká. Některé dveře čekaly déle než my dva.“');return true;
  }
  if(/^(nevim|mozna|asi|tezko rict|nechci rict|to ti nereknu)$/.test(t)){
   b.pending=null;log('Havran skloní hlavu. „Nemusíš mi odpovídat. Vždycky jsem si myslel, že tajemství je věc zamčená na klíč. Hvězdář mě naučil, že některá si zamykáme sami.“');return true;
  }
 }
 if(pendingReply.kind==='question'){
  const q=adventureReactions.ravenQuestions[pendingReply.index];
  const yes=/^(ano|jo|jiste|urcite|samozrejme|slibuji|slibuju|vratim se|ano vratim se|urcite prijdu|myslim ze ano)$/;
  const no=/^(ne|nikdy|neprijdu|nevratim se|myslim ze ne|asi ne|nesouhlasim)$/;
  const unsure=/^(nevim|netusim|mozna|asi|nedokazu rict|to nevim|tezko rict|nejsem si jisty)$/;
  let answer=null;
  if(q.id==='fear')answer=/\b(necitit|nic necitit|necitlivost|ztratim city|otupet)\b/.test(t)?q.numb:/\b(mraz|mrazu|zima|zimy|chlad|chladu)\b/.test(t)?q.cold:unsure.test(t)?q.unsure:null;
  else answer=yes.test(t)?q.yes:no.test(t)?q.no:unsure.test(t)?q.unsure:null;
  if(answer){b.pending=null;if(q.id==='return'&&yes.test(t))b.promiseMade=true;log(answer);return true;}
 }else if(pendingReply.kind==='riddle'){
  const riddle=adventureReactions.ravenRiddles[pendingReply.index];
  if(riddle.answer.test(t)){b.pending=null;log(riddle.yes);return true;}
  if(/^(nevim|netusim|vzdavam se|vzdam to|rekni odpoved)$/.test(t)){
   b.pending=null;log(pendingReply.index===0?'„Sněhová vločka,“ odpoví havran. „Až roztaje, nikdo nepozná, kde vlastně skončila.“':'„Slib,“ řekne havran. „Dává se lehce, ale některé vydrží celou zimu.“');return true;
  }
  if(!p.intent&&!p.location&&t.split(' ').length<=5){
   pendingReply.attempts++;
   if(pendingReply.attempts>=3){b.pending=null;log('Havran skloní hlavu. „To nevadí. Odpověď je '+(pendingReply.index===0?'sněhová vločka':'slib')+'. Ne každá hádanka se musí uhádnout.“');}
   else log(riddle.wrong);return true;
  }
 }
 b.pending=null;return false;
}
// Relations are world data: contents are derived from live location and puzzle state.
const surfaces={
 table:{rooms:['mill','observatory'],contents:{mill:['oil','lamp'],observatory:['book']},intro:'Přejedeš pohledem po odřených prknech stolu.',where:'Na stole',empty:'Na desce zůstaly jen tmavé skvrny a rýhy ve dřevě.'},
 tomb:{rooms:['crypt'],contents:{crypt:['key']},intro:'Nakloníš se k sarkofágu.',where:'Ve výklenku',empty:'Výklenek je prázdný.',closed:()=>!f().tomb,shut:'Kamenné víko zakrývá vnitřek. Přes něj dovnitř nevidíš.'},
 scope:{rooms:['observatory'],contents:{observatory:['lens']},intro:'Prohlédneš objímku dalekohledu.',where:'V objímce',empty:'Objímka po vyjmuté čočce zeje prázdnotou.'},
 sun:{rooms:['tower'],contents:{tower:['pod']},intro:'Prohlédneš dutinu slunečního kotouče.',where:'V kotouči',empty:'Dutina je prázdná. Na okraji kovového držáku je tenký kruhový otisk po něčem hladkém.'},
 floor:{rooms:Object.keys(rooms),contents:{},intro:'Skloníš pohled k zemi.',where:'Na zemi',empty:'Nic odloženého tu neleží.'}
};
function surfaceAvailable(id){return !!surfaces[id]?.rooms.includes(state.room)}
function contentsOf(id){const data=surfaces[id];if(!surfaceAvailable(id)||data.closed?.())return [];return Object.keys(entities).filter(item=>!has(item)&&visible(item)&&(id==='floor'?state.dropped[item]===state.room:!state.dropped[item]&&(data.contents[state.room]||[]).includes(item)));}
function describeSurface(id){if(!surfaceAvailable(id)){log('Tady to nevidíš.');return;}
const d=surfaces[id],items=contentsOf(id);state.lastSurface={id,room:state.room};state.lastEntity=id;state.lastEntities=items;
if(d.closed?.()){log(d.shut);return;}
const names=items.map(item=>entities[item].name);log(d.intro+' '+(names.length?d.where+' '+(names.length===1?'je ':'jsou ')+names.join(' a ')+'.':d.empty));}
function takeFrom(p){const source=p.source;if(!surfaceAvailable(source)){log('Tady to nevidíš.');return;}
if(surfaces[source].closed?.()){log(surfaces[source].shut);return;}
const available=contentsOf(source);let wanted=p.ids.filter(id=>id!==source);if(p.all||!wanted.length)wanted=available;
wanted=wanted.filter(id=>!p.exclude?.includes(id));
if(!wanted.length){log('Není tam nic dalšího k sebrání.');return;}
const taken=[];for(const item of wanted){if(!available.includes(item)){log('„'+entities[item].name+'“ tam neleží.');continue;}if(!entities[item].portable){log(item==='book'?'Zápisník necháš rozevřený na stole. Můžeš v něm číst.':'To odtud nevezmeš.');continue;}take(item);taken.push(item);}
state.lastSurface={id:source,room:state.room};state.lastEntities=taken;
}
function question(p){const t=p.t,id=p.ids.find(x=>!['raven','wizard'].includes(x));
if(state.room==='cave'&&!state.won&&p.ids.includes('wizard')){conversation('wizard',t);return;}
if(/^(?:a )?proc(?: to| tedy| vlastne)?$/.test(t)){
 const last=norm(lastReply||'');
 if(state.room==='clearing'){conversation('raven',t);return;}
 const lines=/zam(c|k)|dvere|vstup/.test(last)?['„Proč zamykat to, co dávno opustili?“ napadne tě. Možná hvězdář něco chránil. Nebo se něčeho bál.','Zámek dokáže udržet někoho venku. Nedokáže ale zabránit vzpomínkám dostat se dovnitř.']:
 /most|propast|lano|pilir/.test(last)?['Protože mezi odvahou a lehkomyslností bývá jen jediný krok. Tady by se za něj platilo pádem.','Ta propast tu byla dřív než tvoje cesta. Můžeš ji překonat, ale nemůžeš jí poroučet.']:
 /carodej|led|zezlo|sloup|magie/.test(last)?['Čaroděj nehledá vítězství v souboji. Chce, aby se nikdo neodvážil přiblížit. Žezlo svírá jako někdo, kdo se bojí ztratit poslední jistotu.','Možná nechce údolí zničit. Jen ho držet beze změny. Všechno živé mu pak připadá jako hrozba.']:
 /hvezdar|svetlo|paprsek|cocka|zapisnik/.test(last)?['Hvězdář uměl měřit světlo, ale důvody jeho posledních rozhodnutí v číslech nenajdeš. Zkus číst mezi řádky.','Čím déle se díváš na hvězdářovy zápisky, tím méně připomínají návod a tím více dopis někomu, kdo se ještě nenarodil.']:
 ['Chvíli nad tou otázkou přemýšlíš. Ne každá věc tu má jediný důvod; někdy najdeš odpověď, až když se odvážíš jít dál.','„Proč?“ zazní v tichu skoro hlasitěji než tvé kroky. Prohlédni si, co máš před sebou; místo může odpovědět jinak než slovy.'];
 sayVariant('why:'+state.room+':'+(state.lastEntity||'scene'),lines);return;
}
if(p.ids.some(x=>['raven','wizard'].includes(x))&&/\b(jsi|vis|reknes|poradis|jmenujes)\b/.test(t)){conversation(p.ids.find(x=>['raven','wizard'].includes(x)),t);return;}
if(/^(kde je|kde najdu|kde lezi|kde mam hledat)/.test(t)){
if(id&&has(id)){log('„'+entities[id].name+'“ máš u sebe.');return;}
if(id==='lens'){
 if(f().lensInSun){log('Čočka je už v kovovém držáku slunečního kotouče, kam jsi ji zasadil.');return;}
 const n=state.hints.lensWhere||0;state.hints.lensWhere=n+1;
 const levels=[
  'V nákresu je čočka, ale nikoli její poloha. Možná začni u věcí, které pracují se světlem. Některé vypadají obyčejně, dokud se do nich nepodíváš.',
  'Hvězdář si ji sotva schoval mezi nádobí. Kdybys chtěl sledovat hvězdy, co bys vzal do rukou? Zkus prohlédnout přístroje, které jsi cestou viděl.',
  'Nad údolím bývala hvězdárna. Zkus se tam podívat po přístroji, v němž světlo prochází sklem.',
  'Nápověda: zkus důkladně prozkoumat mosazný dalekohled a jeho přední objímku. Čočka může být jeho součástí.'
 ];log(levels[Math.min(n,levels.length-1)]);return;
}
if(id&&visible(id)){log('„'+entities[id].name+'“ je tady. '+entities[id].look);return;}
if(id&&state.dropped[id]){log('„'+entities[id].name+'“ jsi nechal v místě: '+rooms[state.dropped[id]].title+'.');return;}
if(id&&entities[id].loc&&state.visited.includes(entities[id].loc)){log('Hledej v místě: '+rooms[entities[id].loc].title+'. Nemusí být hned volně dostupný.');return;}
log('O tom zatím nemáš jistotu. Pomůže průzkum nebo otázka havranovi.');return;}
if(/^(jak|muzu|mohu|da se)/.test(t)){
if(id==='bridge'||id==='chasm'){log(f().bridge?'Lano už drží. Na sever můžeš přejít.':'Propast nepřeskočíš. Potřebuješ jištění mezi pevnými pilíři.');return;}
if(id==='lamp'){log(f().lit?'Lucerna už svítí.':f().filled?'Knot je napuštěný, stačí lucernu zapálit.':'Lucerna má křesadlo, ale potřebuje lampový olej.');return;}
if(id==='door'||id==='lock'){log(f().door?'Dveře už jsou otevřené. Můžeš vejít.':'Věž má mosazný zámek se slunečním znakem. Hledej odpovídající klíč.');return;}
if(id==='wizard'||p.ids.includes('wizard')){log('Sloup je příliš vysoký, abys k němu došel nebo na něj dosáhl. Čaroděj tě nechává mluvit, ale jeho žezlo nepřestává svítit. Nevíš ještě, co ho drží na místě.');return;}
}
if(id){examine(id,true);return;}
if(/kdo jsi|jmenujes/.test(t)){conversation(localNPC(),t);return;}
if(state.room==='clearing'&&/\b(hvezdar|hvezdare|mlynar|mlynare|carodej|carodeje|krouzek|slib)\b/.test(t)){
 conversation('raven',t);return;
}
if(state.room==='clearing'){
 sayVariant('raven:unclear-question',[
  'Havran chvíli přemýšlí. „To nevím jistě. Nechci si vymýšlet odpověď jen proto, abych vypadal moudře.“',
  '„Možná se ptáš na něco, co jsem nikdy neviděl,“ připustí havran. „Řekni mi to jinak. Rád tě vyslechnu.“',
  'Havran nakloní hlavu. „Na takovou otázku bych rád znal odpověď sám. Ale můžeme nad ní přemýšlet spolu.“'
 ]);return;
}
log('Na to zatím nemáš dost stop. Odpověď možná najdeš v okolí nebo v hvězdářových zápiscích.');
}
const flavorActions=new Set(['knock','shake','turn','repair','clean','dig','burn','freeze','break','count','weigh','point','knell','pray','sing','whistle','shout','laugh','cry','dance','sneak','hide','swim','fish','throwSnow']);
function expandedAction(p){const {intent,t}=p;let id=p.ids[0];
if(intent==='surface'){describeSurface(p.source);return true;}
if(intent==='take'&&p.source){takeFrom(p);return true;}
if(p.location&&['look','inspect','read'].includes(intent)&&(!p.ids.length||['bridge'].includes(p.ids[0]))){
if(p.location!==state.room){log('Tady nejsi v místě „'+rooms[p.location].title+'“. Prozkoumat ho můžeš, až tam dojdeš.');return true;}
if(state.room==='crypt'&&!f().lit){describe();log('Zbytky loučí na stěnách jsou studené. Bez vlastní lucerny neuvidíš pod víko ani bezpečně nenajdeš úchyty sarkofágu.');return true;}
describe();log(Object.values(entities).filter(e=>!e.portable&&!e.scenery&&e.loc===state.room).map(e=>e.look).join(' '));return true;}
if(intent==='question'){
 if(state.won&&(p.ids.includes('portal')||p.ids.includes('wizard')||p.ids.includes('scepter'))){log(p.ids.includes('portal')?'Průchod je osvobozený. Za ním čeká další cesta; zatím můžeš poslouchat, jak jeskyně taje.':'Čaroděj i jeho ledové žezlo jsou zničeni. Zbyly po nich jen úlomky.');return true;}
 if(p.location&&!p.ids.length&&p.location===state.room){describe();return true;}question(p);return true;
}
if(intent==='status'){log((state.lost?'Jsi uvězněný v ledu. „Zpět“ vrátí poslední tah.':state.won?'Údolí je osvobozené.':'Jsi promrzlý, ale schopný pokračovat. Chlad se ti zakusuje do prstů.')+' Úkol: '+(state.won?'splněn.':'najít příčinu zimy a uvolnit cestu přes jeskyni.'));return true;}
if(['hello','thanks','sorry','bye','curse'].includes(intent)){
const npc=localNPC();if(p.ids.length&&!p.ids.includes(npc)){const target=p.ids[0];if(!visible(target))failReach(target);else log('„'+entities[target].name+'“ zůstává bez odpovědi.');return true;}
if(npc==='raven')ravenSocial(intent);else if(npc==='wizard')conversation('wizard',t);else sayVariant('alone:'+intent,intent==='thanks'?['Poděkování zůstane viset v tichu.','Nikdo tu není, ale dobrá nálada se hodí.']:intent==='curse'?['Ulevíš si. Situace se tím nezmění.','Nadávka se odrazí od kamene a utichne.']:['Tvoje slova odnese ozvěna.','Nikdo neodpoví.']);return true;}
if(['look','inspect'].includes(intent)&&p.all){describe();for(const id of Object.keys(entities).filter(id=>visible(id)&&!entities[id].scenery&&!p.exclude?.includes(id)))examine(id,true);return true;}
if(['look','inspect','read'].includes(intent)&&p.ids.length>1){for(const id of p.ids)examine(id,intent!=='look');return true;}
if(intent==='wait'){sayVariant('wait:'+state.room,[...adventureLanguage.roomMood[state.room],...adventureReactions.ambient[state.room]]);return true;}
if(intent==='talk'){conversation(p.ids.find(x=>['raven','wizard'].includes(x))||id,t);return true;}
if(intent==='drop'&&p.all){const items=state.inv.filter(id=>!p.exclude?.includes(id));if(!items.length){log('Nemáš co odložit.');return true;}for(const item of items)action({intent:'drop',ids:[item],t:'odloz'});return true;}
if(intent==='combine'){if(p.ids.length<2){ask('combine',p.ids,'Které dvě věci chceš spojit?');return true;}action({...p,intent:'use'});return true;}
if(!flavorActions.has(intent))return false;
if(id&&!visible(id)){failReach(id);return true;}
if(id)state.lastEntity=id;
const gestures={knell:'Poklekneš, zkontroluješ pevnou půdu a zase se narovnáš.',pray:'Na chvíli ztišíš dech. Odpovědí je jen okolní ticho.',sing:localNPC()==='raven'?'Havran přidá falešné zakrákání. Duet z toho nebude.':'Několik tónů se rozplyne v chladném vzduchu.',whistle:localNPC()==='raven'?'Havran odpoví krátkým hvizdem.':'Hvízdnutí se odrazí od okolí.',shout:localNPC()==='wizard'?'Čaroděj tě slyší velmi dobře. Nemá důvod ustoupit.':'Křik se vrátí jako slabá ozvěna.',laugh:'Krátce se zasměješ. V mrazu se zvedne obláček páry.',cry:'Otřeš si oči a zhluboka se nadechneš. Ještě není konec.',dance:'Na kluzkém podkladu zkusíš dva opatrné kroky. Pak se raději zastavíš.',sneak:state.room==='cave'?'Oči na rouchu sledují i tvůj nejtišší krok. Tudy se neproplížíš.':'Ztišíš kroky. Nikdo ti ale v cestě nebrání.',hide:state.room==='cave'?'Žádný stín tě neschová před všemi očima čarodějova roucha.':'Na chvíli se přikrčíš. K úkrytu teď nemáš důvod.',swim:['mill','bridge'].includes(state.room)?'Pod ledem je prudký a mrazivý proud. V téhle zbroji do něj nevstoupíš.':'Tady není voda, ve které by se dalo plavat.',fish:['mill','bridge'].includes(state.room)?'Nemáš rybářské náčiní a proud zakrývá led.':'Na suchu nic neulovíš.',throwSnow:['clearing','mill','bridge','tower'].includes(state.room)?'Zmáčkneš trochu sněhu a hodíš kouli stranou. Rozpadne se o kámen.':'Na pořádnou sněhovou kouli tu není vhodný sníh.'};
if(gestures[intent]){log(gestures[intent]);return true;}
if(!id){ask(intent,[],{dig:'Kde chceš kopat?',knock:'Na co chceš zaklepat?',turn:'Čím chceš otočit?',repair:'Co chceš opravit?',combine:'Co chceš spojit?'}[intent]||'S čím chceš tuto činnost zkusit?');return true;}
if(entities[id].mat==='distant'){log('Je to příliš daleko. Můžeš to pozorovat, ale nedosáhneš tam.');return true;}
if(['raven','wizard','self'].includes(id)){log(id==='raven'?'Havran uhne. „S peřím zacházej opatrně.“':id==='wizard'?'Čaroděj stojí mimo tvůj dosah.': 'Zkontroluješ si výstroj. Všechno drží.');return true;}
const specific={
knock:{door:'Zaklepeš na dveře věže. Uvnitř nikdo neodpovídá.',millDoor:'Třikrát zaklepeš na zavřené dveře mlýna. Odpovědí je jen dunění prázdné budovy.',tomb:'Klepání se tlumeně rozlehne dutým kamenem. Žádná odpověď.',book:'Prstem poklepeš na stránku. Číst bude užitečnější.'},
shake:{oil:'V olejničce zašplouchá lampový olej.',lamp:f().filled?'Olej uvnitř lucerny zašplouchá. Držíš ji dál rovně.':'Suchý knot se pohne za sklem.',pod:'Kapsli držíš opatrně. Prudký náraz by mohl uvolnit teplo.',book:'Stránky zašustí, ale žádný další předmět nevypadne.'},
turn:{wheel:'Kolo drží v zamrzlém náhonu. Silou ho neroztočíš.',scope:'Dalekohled trochu pootočíš. Teď ti víc než hvězdy pomůže jeho čočka.',key:'Klíč otočíš mezi prsty. Vhodný zámek je na věži.',sun:'Kotouč je pevný. Pohyblivý je držák optiky.'},
repair:{bridge:'Celý most bez prken a nářadí neopravíš. Můžeš ale zajistit přechod lanem.',wheel:'Led blokuje lopatky. K opravě by bylo potřeba uvolnit celý náhon.',lamp:'Konstrukce lucerny je v pořádku. Zkontroluj olej a knot.'},
clean:{lens:'Sklo vyleštíš cípem pláště, až odráží čistý paprsek.',sign:'Setřeš námrazu z nápisu. Směry jsou opět čitelné.',book:'Opatrně odfoukneš prach, abys nepoškodil stránky.'},
dig:{snow:'Pod tenkou vrstvou sněhu najdeš jen zmrzlou půdu a kámen.',floor:'Kamennou podlahu rukama nerozkopeš.',tomb:'Do kamene nekopáš. Víko má prohlubně pro ruce.',path:'Rozhrneš sníh; pod ním je pevná stezka.'},
count:{dwarfs:'Spočítáš viditelná těla. Některá splývají s ledem; žádný z nich se nehýbe.',rope:'Několik dlouhých smyček. Na spojení pilířů by lano mělo stačit.',key:'Máš jeden klíč se slunečním znakem.'},
};
if(intent==='turn'&&p.ids.includes('key')&&(p.ids.includes('lock')||p.ids.includes('door'))){action({...p,intent:'unlock'});return true;}
if(intent==='clean'&&id==='sun'&&f().lensInSun){log('Ometáš jen obrubu kotouče. Čočku v držáku necháš, aby neztratila nastavený paprsek.');return true;}
if(intent==='count'&&id==='scope'&&f().lensTaken){log('Objímka je prázdná, protože jsi z ní přední čočku vyjmul. Zbytek optiky zůstává na stativu.');return true;}
const tailored=adventureReactions.situational[id]?.[intent];
if(tailored){sayVariant('gesture:'+state.room+':'+id+':'+intent,tailored);return true;}
if(specific[intent]?.[id]){log(specific[intent][id]);return true;}
if(intent==='burn'){log(id==='book'?'Zničil bys poznámky, které mohou zachránit údolí. Knihu necháš celou.':id==='rope'?'Spálené lano by tě přes propast neudrželo.':'Oheň tady není rozumné řešení.');return true;}
if(intent==='freeze'){log('Mrazivé magie je tu už dost. Ty ji ovládat neumíš.');return true;}
if(intent==='count'){log(entities[id].portable?'Je tu jeden takový předmět.':'Počítáním se nedozvíš nic, co by změnilo postup.');return true;}
if(intent==='weigh'){log(entities[id].portable?'Potěžkáš předmět. Uneseš ho, přesnou váhu bez vah nezjistíš.':'Tak velkou věc nezvedneš.');return true;}
if(intent==='point'){log('Ukážeš směrem k předmětu. Nic se tím nezmění.');return true;}
if(intent==='dig'){log('Tady nic nevykopeš. Nemáš nářadí ani důvod rozrušovat povrch.');return true;}
log(adventureLanguage.material[entities[id].mat]?.[intent]||'Opatrně to zkusíš. Předmět zůstane beze změny.');return true;
}

function parseBase(raw){let t=norm(raw).replace(/^(?:(?:prosim|prosimte|zkus|zkusme|chci|chtel bych|mohl bys|muzes|rad bych) )+/, '').replace(/\b(dej|dat) (si )?pauzu\b/g,'cekej').replace(/\b(dej|dat) (si )?do (batohu|vaku|kapsy|inventare)\b/g,'vezmi').replace(/\b(rozdelej|rozdelat) ohen\b/g,'zapal lucernu').replace(/\b(dostat se|dostat|presunout se|presun se)\b/g,'jdi');t=t.replace(/^(?:dej|schovej|uloz) (.+?) do (?:batohu|vaku|kapsy|inventare)$/, 'vezmi $1').replace(/^(?:podivej|koukni) (?:se )?do (?:batohu|vaku|kapsy|inventare)$/, 'inventar');let words=t.split(' ');if(/\b(nechci|nedelej|nedelat|neotevirej|nepouzivej)\b/.test(t))return {intent:'cancel',ids:[],t};if(/^(rozhl|rozhled|co vidim|kde jsem|co je (tu|tady)|okoli)/.test(t))return {intent:'look',ids:[],t};if(/^(otevri|ukaz|zobraz) (mi |si )?(inventar|batoh|vak)/.test(t))return {intent:'inventory',ids:[],t};if(/^(otevri|ukaz|zobraz) (mi |si )?map/.test(t))return {intent:'map',ids:[],t};if(/^(co (mam|nesu)|ukaz (inventar|batoh)|obsah (vaku|batohu))/.test(t))return {intent:'inventory',ids:[],t};if(/^(nova hra|zacni znovu|od zacatku)/.test(t))return {intent:'restart',ids:[],t};if(/^(vrat tah|vrat posledni|zpatky tah)/.test(t))return {intent:'undo',ids:[],t};if(/^(porad|nevim|jak dal)/.test(t))return {intent:'hint',ids:[],t};if(['ano','jo','jasne','yes','ne','no','zrus','nic'].includes(t))return {intent:'answer',ids:[],t};let v=words.find(w=>wordIntent.has(w)),intent=wordIntent.get(v)||null;
const dirs={sever:'n',severu:'n',severne:'n',north:'n',n:'n',jih:'s',jihu:'s',jizne:'s',south:'s',s:'s',vychod:'e',vychodu:'e',vychodne:'e',east:'e',e:'e',zapad:'w',zapadu:'w',zapadne:'w',west:'w',w:'w'};let dir=words.map(w=>w.length===1&&words.length>1?null:dirs[w]).find(Boolean);if(!intent&&dir)intent='go';if(words.some(w=>['vejdi','vejit','vstup','vstoupit','dovnitr','vlez'].includes(w))){intent='go';dir='in'}if(t==='ven'||t==='out'||intent==='go'&&words.includes('ven')){intent='go';dir='out'}if(t==='zpatky'||intent==='go'&&/\b(zpatky|zpet)\b/.test(t)){intent='go';dir='back'}let ids=Object.entries(entities).map(([id,e])=>({id,at:words.findIndex(w=>e.words.split(' ').includes(w))})).filter(x=>x.at>=0).sort((a,b)=>a.at-b.at).map(x=>x.id);if(state.room==='cave'&&ids.includes('pillar'))ids=ids.map(x=>x==='pillar'?'ice':x);if(!ids.length&&/\b(ho|ji|to|jej|jejich|nim|ni|nej|nejho|tim|toto|tenhle|tuhle|tuhleto|tento|tuto|tahle|ten|ta)\b/.test(t)&&state.lastEntity)ids=[state.lastEntity];ids=[...new Set(ids)];if(state.room==='mill'&&ids.includes('millDoor'))ids=ids.filter(id=>id!=='door');if(state.room!=='mill')ids=ids.filter(id=>id!=='millDoor');return {intent,ids,dir,t,v,all:/\b(vse|vsechno|vsechny|all)\b/.test(t)}}
function failReach(id){if(state.room==='crypt'&&!f().lit&&id==='key'){log('Sarkofág je ve stínu. V jeho dutině bez vlastní lucerny nic bezpečně nerozeznáš.');return false}log('„'+entities[id].name+'“ tady není na dosah.');return false}
function examine(id,deep){
 if(surfaces[id]){
  describeSurface(id);
  if(id==='scope'){log(f().lensTaken||has('lens')?'V okuláru chybí přední čočka. Skrz tubus uvidíš jen rozmazané světlo.':'Můžeš přiložit oko k okuláru a podívat se dalekohledem na oblohu.');}
  else if(id==='table'&&state.room==='observatory')log('Zápisník zůstal přichycený mosazným těžítkem. Můžeš ho číst přímo na stole.');
  if(deep&&adventureReactions.inspect[id])sayVariant('inspect:'+id+':'+state.room,adventureReactions.inspect[id]);
  return;
 }
 if(!id){if(!deep){describe();return;}pending={intent:'inspect',ids:[]};log('Co chceš prozkoumat?');return;}
 if(!visible(id)){failReach(id);return;}
 state.lastEntity=id;state.lastEntities=[id];
 if(id==='rope'&&state.room==='bridge'&&f().bridge){log('Lano je pevně uvázané mezi pilíři a tvoří jištění. Můžeš přejít na sever.');return;}
 if(id==='lens'&&state.room==='tower'&&f().lensInSun){log('Čočka sedí pevně ve slunečním kotouči. Její objímka drží světelný paprsek na ampuli; z dalekohledu jsi ji už dávno vyjmul.');return;}
 if(id==='lamp'&&f().lit){log(deep?'Plamen je stálý; oleje máš dost na zbytek cesty.':'Lucerna tiše svítí.');return;}
 if(id==='door')log(f().door?'Dveře věže jsou otevřené. Můžeš vejít.':f().doorUnlocked?'Zámek už není zamčený; kliku stačí stisknout.':'Dveře věže jsou zamčené. V zámku je sluneční otvor.');
 else if(id==='bridge'&&f().bridge)log('Jištění mezi pilíři drží. Cesta na sever je bezpečná.');
 else if(id==='millDoor')log('Dubové dveře mlýna jsou uzavřené a zevnitř zajištěné. Skrz dřevo neproniká světlo.');
 else log(entities[id][deep?'detail':'look']);
 if(deep&&adventureReactions.inspect[id])sayVariant('inspect:'+id+':'+state.room,adventureReactions.inspect[id]);
}
function move(p){
 if(p.leave){
  const choices=Object.entries(rooms[state.room].exits).filter(([,dest])=>!(state.room==='bridge'&&dest==='tower'&&!f().bridge));
  if(choices.length===1)p.dir=choices[0][0];
  else{
   const names={n:'na sever',s:'na jih',w:'na západ',e:'na východ'};
   const options=choices.map(([dir,dest])=>names[dir]+' ('+rooms[dest].title+')');
   log(choices.length?'Odejít můžeš '+options.join(' nebo ')+'. Kterou cestou se vydáš?':'Odtud zatím nemáš bezpečnou cestu ven. Rozhlédni se po okolí.');
   return;
  }
 }
 const target=p.ids?.find(id=>visible(id)||surfaceAvailable(id));
 if(target&&(!p.location||p.location===state.room)&&!p.dir){
  if(target==='millDoor'){state.spot='millDoor';walkStart=performance.now();sayVariant('mill-door-approach',adventureReactions.approach.millDoor);return;}
  const focus=target==='lock'?'door':target==='lens'?'scope':target==='oil'||target==='lamp'?'table':target==='key'?'tomb':target==='pod'?'sun':target;
  if(approachSpots[state.room]?.[focus]){
   if(state.spot===focus)log('Už stojíš u '+entities[focus].name+'.');
   else{state.spot=focus;scopeView=false;walkStart=performance.now();sayVariant('approach:'+focus,adventureReactions.approach[focus]||['Přistoupíš blíž a zastavíš se na pevném podkladu.']);}
   return;
  }
 }
 let dest=null;
 if(p.dir==='back')dest=state.previous;
 else if(p.dir==='out')dest=({mill:'clearing',observatory:'tower',crypt:'tower',cave:'tower'})[state.room];
 else if(p.dir==='in')dest=state.room==='tower'?'observatory':null;
 else if(p.dir)dest=rooms[state.room].exits[p.dir];
 else{
  const map={mill:/mlyn/,clearing:/rozcest/,bridge:/most/,tower:/vez|nadvor/,crypt:/krypt|schod/,observatory:/observator|dalekohled|sin|hvezdarn/,cave:/jeskyn|carodej/};
  for(const [r,re]of Object.entries(map))if(re.test(p.t))dest=r;
  if(dest===state.room&&dest==='tower')dest='observatory';
 }
 if(p.dir==='in'&&state.room==='mill'){log('Zkusíš kliku, ale masivní vrata mlýna drží zevnitř zajištěná. Dovnitř se nedostaneš.');return;}
 if(dest===state.room){log(state.room==='mill'?'Jsi již před mlýnem. Do zavřených dveří nevstoupíš.':'Už jsi na tomto místě.');return;}
 if(!dest){
  const dirs={n:'na sever',s:'na jih',w:'na západ',e:'na východ'};
  const paths=Object.entries(rooms[state.room].exits).map(([dir,room])=>dirs[dir]+' k místu '+rooms[room].title);
  if(state.room==='clearing')log('Na rozcestí se cesta dělí: na západ k mlýnu a na sever ke strženému mostu. Kterým směrem se vydáš?');
  else if(paths.length===1)log('Odtud vede cesta '+paths[0]+'. Chceš tam vyrazit?');
  else log('Odtud můžeš pokračovat '+paths.join(' nebo ')+'. Kterou cestou se vydáš?');
  return;
 }
 if(!Object.values(rooms[state.room].exits).includes(dest)&&!(state.room==='tower'&&dest==='observatory')){
  // Vzdálený cíl znamená jeden přirozený úsek trasy, nikoliv teleport.
  // Graf je malý, proto lze příští krok najít bezpečně prohledáním do šířky.
  const start=state.room,queue=[[start]],seen=new Set([start]);let route=null;
  while(queue.length){const walk=queue.shift(),here=walk[walk.length-1];if(here===dest){route=walk;break;}
   const neighbors=[...Object.values(rooms[here].exits),...(here==='tower'?['observatory']:[])];
   for(const next of neighbors)if(!seen.has(next)){seen.add(next);queue.push([...walk,next]);}}
  if(!route||route.length<2){log('K tomuto místu odtud zatím neznáš cestu.');return;}
  const next=route[1];
  if((start==='bridge'&&next==='tower'||start==='tower'&&next==='bridge')&&!f().bridge){log('Cestu přerušuje stržený most. Bez zajištění mezi pilíři pokračovat nemůžeš.');return;}
  if(start==='tower'&&next==='observatory'&&!f().door){log('Do hvězdárny se dostaneš dveřmi věže. Ty jsou zatím zamčené.');return;}
  log('K místu '+rooms[dest].title+' vede cesta přes '+rooms[next].title+'. Vydáš se tím směrem a zastavíš se na dalším rozcestí.');
  dest=next;
 }
 if(state.room==='bridge'&&dest==='tower'&&!f().bridge){log('Za hranou skály je propast. Zůstaneš na pevném břehu, dokud mezi pilíři nezajistíš přechod.');return;}
 if(dest==='observatory'&&!f().door){log(f().doorUnlocked?'Dveře jsou zavřené, ale odjištěné. Stiskni kliku a znovu je otevři.':'Dveře věže jsou zavřené a zamčené. Klíčová dírka má tvar slunce.');return;}
 if(state.room==='clearing'&&dest!=='clearing'&&ravenMemory().met){ravenMemory().awaitingReturn=true;ravenMemory().proximity=0;ravenMemory().handExtended=false;}
 state.previous=state.room;state.room=dest;state.spot=null;scopeView=false;state.lastEntity=null;state.lastWorld=null;state.lastEntities=[];delete state.dialogue;delete state.lastSurface;pending=null;ravenMemory().pending=null;walkStart=performance.now();
 if(!state.visited.includes(dest))state.visited.push(dest);describe();
 if(dest==='clearing')ravenReturn();
}
function take(id){if(id==='rope'&&state.room==='bridge'&&f().bridge&&!state.dropped.rope){log('Lano tvoří jištění mostu. Necháš ho uvázané pro cestu zpátky.');return;}if(id==='lens'&&state.room==='tower'&&f().lensInSun){log('Čočka sedí v kovovém držáku a soustředí světlo do kapsle. Prozatím ji necháš na místě.');return;}if(!id){pending={intent:'take',ids:[]};log('Co chceš vzít?');return}if(has(id)){log('To už neseš.');return}if(!visible(id)){failReach(id);return}if(!entities[id].portable){log(id==='raven'?'Havran přeskočí na druhý konec cedule. „Ruce pryč.“':'„'+entities[id].name+'“ si do vaku nevezmeš.');return}state.inv.push(id);delete state.dropped[id];f()[id+'Taken']=true;state.lastEntity=id;state.lastWorld=null;log('Bereš: '+entities[id].name+'.','good');if(id==='key')gameAudio?.cue('key');effect={type:'reach',start:performance.now()}}
function ask(intent,ids,text){pending={intent,ids};log(text)}
function consume(id){state.inv=state.inv.filter(x=>x!==id)}
function bridgeDetail(p){
 const flags=f(),n=flags.bridgeSurveyCount||0;
 if(['glint','reachGlint','bank'].includes(p.topic)){
  state.bridgeFocus='glint';
  if(!flags.pendantRevealed)state.lastEntity=null;
 }else state.bridgeFocus=null;
 if(p.topic==='glint'){
  flags.glintSeen=true;
  const seen=flags.glintLooks||0;flags.glintLooks=seen+1;
  if(flags.pendantRevealed){state.lastEntity='pendant';log('Ve skalní dutině na hraně útesu už jasně vidíš drobný bronzový přívěsek.');return;}
  log(seen===0?'Zastavíš pohled na levé hraně útesu. V úzké skalní spáře se cosi matně leskne. Když vítr rozfouká sníh, na okamžik se objeví kovový odlesk.':'Pozorně sleduješ odlesk. Nevychází z vody ani ze sněhu, ale z malého kousku kovu uvězněného v kamenné spáře. Z blízka bys mohl zjistit, co jej drží.');return;
 }
 if(p.topic==='reachGlint'){
  flags.glintSeen=true;
  if(!flags.ledgeInspected){log('Natáhneš se za zábleskem, ale je nebezpečně blízko propasti. Nejdřív si musíš prohlédnout okraj útesu a najít pevnou oporu.');return;}
  log('Zkusíš se dotknout kovu. Je pevně sevřený starou železnou sponou a holýma rukama jej neuvolníš.');return;
 }
 if(p.topic==='survey'){
  flags.bridgeSurveyCount=n+1;
  if(flags.pendantRevealed&&!flags.pendantTaken){
   state.lastEntity='pendant';log('Rozhlédneš se podél břehu. V odkryté skalní skrýši na levém okraji útesu teď zřetelně vidíš bronzový přívěsek.');return;
  }
  const lines=flags.pendantTaken?[
   'Podél levého břehu zůstala mělká kamenná dutina, odkud jsi vyňal přívěsek. Na druhé straně stojí nepřístupný pilíř.',
   'Sleduješ okraj skály. Lano by mohlo spojit pilíře, ale samotná prkna už most neunesou.',
   'Ve strži daleko dole proudí tmavá voda. Vítr přes ni převaluje ledový prach.'
  ]:[
   'Prohlédneš levý břeh pozorněji. Pod sněhem na hraně útesu vystupuje staré zdivo. Naproti zůstala jen část mostu.',
   'Vítr sfoukne ze skalní hrany trochu sněhu. Něco v kamenné spáře na okamžik odrazí světlo a znovu pohasne.',
   'Na levé hraně útesu cosi slabě probleskuje. Vypadá to jako drobný kousek kovu uvězněný v rozpraskaném zdivu.'
  ];
  if(!flags.pendantTaken&&n>=1)flags.glintSeen=true;
  log(lines[Math.min(n,2)]);return;
 }
 if(p.topic==='bank'){
  flags.glintSeen=true;flags.ledgeInspected=true;
  log(flags.pendantTaken?'Prohlédneš levý břeh. Na hraně útesu je prázdná skalní dutina, odkud jsi vyňal přívěsek.':
   flags.pendantRevealed?'Poklekneš u okraje srázu. Zrezlá spona je odchlíplá a v dutině v kameni vidíš bronzový přívěsek.':
   'Opatrně poklekneš u okraje levého útesu. Ve skalní spáře rozeznáš zrezlou železnou sponu. Zadržuje cosi drobného a tmavého. Holými prsty s ní zřejmě nepohneš.');return;
 }
 if(p.topic==='slope'){
  log('Přiblížíš se jen natolik, abys měl pevnou půdu pod nohama. Sráz padá téměř kolmo do temné vody; led na dně praská pod proudem. V horní části levé skalní hrany se občas cosi zaleskne.');flags.glintSeen=true;return;
 }
 if(p.topic==='pebble'){
  log('U bot leží několik drobných oblázků, uvolněných z rozpadlé zídky. Jeden bys mohl bez potíží hodit do propasti.');return;
 }
 if(p.topic==='throwPebble'){
  log('Zvedneš ze sněhu malý oblázek a hodíš ho přes okraj. Dvakrát se odrazí od skály, potom zmizí. Až po několika dlouhých vteřinách zaslechneš hluboko dole slabé šplouchnutí.');return;
 }
 if(p.topic==='snowball'){
  log('Sehrneš sníh do dlaní a uplácáš malou kouli. Hodíš ji ze srázu; vítr ji po několika metrech roztrhá na bílé cáry, které se tiše snášejí do hlubiny.');return;
 }
 if(p.topic==='jumpDown'){
  log('Opatrně nakročíš přes sněhem zakrytou hranu. Zespodu se ozve třesk ledu. Instinktivně ucukneš zpět na pevnou skálu — dole by nebylo nic, čeho se zachytit.');return;
 }
}
function action(p){scopeView=false;if(p.intent!=='bridgeDetail')state.bridgeFocus=null;if(p.intent==='bridgeDetail'){bridgeDetail(p);return;}if(p.intent==='world'){
 if(state.room==='crypt'&&!f().lit&&(['inspect','read'].includes(p.detail?.intent)||['schranka','vyklenek'].includes(p.detail?.id))){
  log('Přitáhneš si věc k očím, ale krypta je příliš temná. Bez světla nerozeznáš podrobnosti.');return;
 }
 const message=globalThis.adventureWorld117?.react(p.detail,f(),has('sword'));
 log(message||'Na chvíli to zkusíš, ale nic se nezmění.');
 state.lastWorld={id:p.detail?.id==='vyklenek'&&f().cryptNicheFound?'schranka':p.detail?.id,room:state.room};
 if(f().pendantRevealed&&!f().pendantTaken&&p.detail?.id==='spona')state.lastEntity='pendant';
 if(f().crateBroken&&!f().coinTaken&&p.detail?.id==='bedynka')state.lastEntity='coin';
 if(f().cryptChestOpen&&!f().cryptLetterTaken&&p.detail?.id==='schranka')state.lastEntity='cryptLetter';
 return;
}if(expandedAction(p))return;let {intent,ids,t}=p;let target=ids[0],tool=ids.find(has),hasTarget=id=>ids.includes(id);if(intent==='use'&&ids.includes('sword')&&ids.length>1){intent=ids.includes('wizard')?'attack':'cut';target=ids.find(id=>id!=='sword')}if(target)state.lastEntity=target;
if(['inspect','read'].includes(intent)&&target==='book'){journal118(false);return}if(intent==='look'||intent==='inspect'||intent==='read'){examine(target,intent!=='look');return}if(intent==='go'){move(p);return}if(intent==='take'){if(p.all){let items=Object.keys(entities).filter(id=>entities[id].portable&&!has(id)&&visible(id)&&!p.exclude?.includes(id));if(!items.length)log('Nic přenosného tu nezůstalo.');items.forEach(take)}else if(ids.length>1)ids.forEach(take);else take(target);return}
if(intent==='wait'){log(state.room==='cave'?'Čaroděj se zavrtí. Na okamžik zavře jedno oko na rouchu.':'Vítr přejede po kameni. Chvíli čekáš.');return}if(intent==='sit'||intent==='stand'||intent==='sleep'){log(intent==='sleep'?'Na spánek je příliš chladno.':intent==='sit'?'Na chvíli si odpočineš. Pak se zvedneš.':'Stojíš připravený pokračovat.');return}if(intent==='listen'&&!target){log({clearing:'Havran zakráká. Z hor se ozve praskání ledu.',mill:'Za mlýnským kolem tiše šplouchá voda pod ledem.',bridge:'Hluboko pod tebou hučí voda.',tower:'Z krypty stoupá ozvěna. V severní jeskyni zní tiché dunění.',crypt:'Slyšíš vlastní dech a vzdálené kapání.',observatory:'Vítr rozechvívá prasklou kopuli.',cave:'Žezlo bzučí. Čaroděj zatím mlčí.'}[state.room]);return}if(intent==='smell'&&!target){log(state.room==='mill'?'Cítíš mokré dřevo a starý olej.':state.room==='crypt'?'Vlhký kámen a prach.':'Mrazivý vzduch téměř nevoní.');return}
if(!target){if(intent==='light'&&has('lamp')){target='lamp';ids=['lamp']}else{ask(intent,[],({talk:'S kým chceš mluvit?',throw:'Co chceš hodit?',use:'Co chceš použít?',open:'Co chceš otevřít?',fill:'Co chceš naplnit?',cut:'Co chceš přeříznout?'}[intent]||'Na co chceš tuto činnost použít?'));return}}
if(intent==='talk'){target=ids.find(id=>['raven','wizard'].includes(id))||target;ids=[target]}if(['cut','attack'].includes(intent)&&target==='sword'&&ids.length>1)target=ids.find(id=>id!=='sword');
for(const id of ids)if(!visible(id)){failReach(id);return}
if(target==='millDoor'){
 if(['cut','attack'].includes(intent)){
  f().millDoorScars=(f().millDoorScars||0)+1;
  log(f().millDoorScars===1?'Rozmáchneš se a ostří se zakousne do dubových fošen. Dřevo zapraská, v povrchu zůstane dlouhý světlý zásek. Zevnitř je však stále zapřená těžká závora.':'Zasáhneš dveře znovu. Z odštípnutého dřeva vyletí třísky, ale zajištěná závora se ani nehne.');
  effect={type:'attack',start:performance.now()};return;
 }
 if(['go','open','unlock','push','pull','use','insert'].includes(intent)){
  sayVariant('mill:sealed',[
   'Zkusíš starou kliku. Dveře jsou pevně uzavřené závorou zevnitř. Není zde volný průchod; cesta pokračuje zpět na rozcestí.',
   'Opřeš se ramenem do dubových fošen. Nepovolí ani o píď. Všechny věci, které mlynář nechal poutníkům, jsou venku u stolu.',
   'Železné závěsy drží. Za těžkými dveřmi už dlouho nikdo nepracuje; necháš je zavřené a obrátíš pozornost ke dvoru.'
  ]);return;
 }
 if(['close','lock'].includes(intent)){log('Dveře mlýna jsou už zavřené a zajištěné zevnitř.');return;}
 if(intent==='knock'){sayVariant('mill:knock',['Zaklepeš třikrát. Odpovědí je jen tiché zavrzání zmrzlého dřeva.','Duté rány se rozlehnou do mlýna. Nikdo neodpoví.']);return;}
}
if(target==='scope'&&intent==='use'){viewThroughScope();return;}
if(target==='table'&&['open','pull','push'].includes(intent)){log('Prohlédneš hranu a spodní stranu stolu. Nemá zásuvky; těžkou desku není třeba nikam posouvat. Věci na ní můžeš prozkoumat nebo sebrat.');return;}
if(intent==='drop'){if(!has(target)){log('To nedržíš.');return}const wasLit=target==='lamp'&&f().lit;consume(target);state.dropped[target]=state.room;if(wasLit)f().lit=false;log('Odkládáš: '+entities[target].name+'.'+(wasLit?' Před odložením z bezpečnosti uhasíš plamínek.':''));return}
if(intent==='talk'){if(target!=='raven'&&target!=='wizard'){log('„'+entities[target].name+'“ na otázky neodpovídá.');return}if(target==='wizard'){log('Čaroděj se usměje: „Tvoje slova mě nezahřejí.“');return}if(/klic|hvezdar|krypt/.test(t))log('„Hvězdář má klíč stále u sebe,“ zakráká havran. „Odpočívá pod věží. Vezmi světlo.“');else if(/most|lano|cesta/.test(t))log('„Já přeletím. Ty si vezmi provaz,“ řekne havran.');else if(/carodej|led|teplo/.test(t))log('„Led nemá rád teplo. To se ví i mezi ptáky.“');else log('„Přes most k věži. Pod věží klíč. Ve věži vědění,“ zakráká havran. „A ve mlýně se vybav.“');return}
if(intent==='give'||intent==='insert'&&hasTarget('raven')){
 if(hasTarget('wizard')){
  const gift=ids.find(id=>id!=='wizard');
  if(!gift){log('Čaroděj si tě z výšky přeměří. „Dar? Co ode mě za něj čekáš?“');return;}
  if(!has(gift)){log('Nejprve bys musel mít předmět u sebe. Čaroděj se na svou chvíli ticha nenechá připravit.');return;}
  log(gift==='lamp'?'Pozvedneš k čaroději lucernu. Plamínek se odráží v jeho žezle. „Copak mě považuješ za poutníka, kterému dochází světlo?“ zeptá se ledově. Je příliš vysoko, abys mu ji podal.':'Nabídneš čaroději '+entities[gift].name+'. Nesestoupí. „Nech si své dary. Nepřišel jsem s tebou obchodovat.“');return;
 }
 if(!hasTarget('raven')){log('Tady není komu dar předat.');return;}
 const gift=ids.find(id=>id!=='raven');
 if(!gift){log('Havran zvědavě nakloní hlavu. „A co mi chceš vlastně dát?“');return;}
 if(!has(gift)){log('„To bych ti ochotně přijal,“ zapřemýšlí havran, „ale ty to přece ani nemáš u sebe.“');return;}
 if(gift==='pendant'){ravenMemory().pendantSeen=true;log('Havran se nakloní k tvé dlani. „Hvězdář ho nikdy nesundával. Ani když spal.“ Zlehka se dotkne přívěsku zobákem. „Nech si ho. Ty možná ještě půjdeš tam, kam já nedokážu.“');return;}
 sayVariant('raven-gift:'+gift,({sword:['Havran si meč přeměří. „S takovou věcí bych si jen zničil peří. Raději ji nos ty.“'],rope:['„Provaz?“ Havran poklepá na hák. „Kdybych ho uměl uvázat zobákem, nepotřeboval bys most.“'],oil:['Havran ucukne před olejničkou. „Tohle určitě nejsou semínka. Ne, děkuji.“'],lamp:['„Krásně svítí,“ uzná havran. „Ale v zobáku bych ji neunesl. Vezmi si ji na cestu.“'],key:['Havran si prohlédne znak slunce. „Tohle patří k věži. Měl bys splnit, proč ti ho hvězdář zanechal.“'],lens:['Havran jedním okem nakoukne skrz sklo. „Vypadám v něm ještě větší! Ale určitě je potřeba jinde.“'],pod:['Havran okamžitě ucukne. „Opatrně s tím teplem! Ještě bych se mohl naučit létat pozpátku.“']})[gift]||['Havran poděkuje ukloněním zobáku. „Nech si to u sebe. Důležitější je, že sis vzpomněl.“']);return;
}
if(intent==='touch'&&target==='raven'){
 const b=ravenMemory();
 if(b.harmed>b.apologies)log('Havran ustoupí k druhému konci cedule. „Zatím ne,“ řekne.');
 else if(b.trust>=3||b.proximity>=2){
  if(!b.stroked){b.stroked=true;b.trust=Math.min(8,b.trust+1)}
  b.proximity=2;b.handExtended=true;state.spot='raven';
  log('Havran ti dovolí jemně pohladit peří na krku. „Jen opatrně. Tahle důstojnost mi roste dlouho.“');
 }else log('Havran udělá krok stranou. „Nejdřív si spolu chvíli povídejme,“ zakráká, ale neodletí.');
 return;
}
if(intent==='listen'&&target==='raven'){
 sayVariant('raven-listen',state.won?[
  'Havran dlouze vydechne. Z jeho hrdla se ozve spokojené, skoro neslyšné zakrákání. Ze stromů pravidelně odkapává voda.',
  'Tentokrát havran chvíli mlčí. Posloucháte spolu údolí, ve kterém už zase teče voda.']:[
  'Havran si pod zobákem pobrukuje zvláštní krátkou melodii. „To mě kdysi naučil hvězdář,“ přizná, když si všimne, že posloucháš.',
  'Zaslechneš tiché cvaknutí zobáku, zašustění peří a potom: „Myslel jsem, že už nikdy neuslyším někoho zastavit se jen tak.“']);return;
}
if(intent==='touch'){log(entities[target].mat==='ice'?'Prsty tě ihned zabolí chladem. Ruku stáhneš.':target==='wizard'?'Na čaroděje nedosáhneš.':'Přejedeš rukou po povrchu. Je '+({metal:'studený a hladký',wood:'drsný',stone:'tvrdý a chladný',glass:'hladký',fiber:'pevný a hrubý',paper:'suchý a křehký'}[entities[target].mat]||'studený')+'.');return}
if(['smell','taste','eat','drink','listen','wear'].includes(intent)){log(intent==='smell'?(target==='oil'?'Olej má ostrý mastný pach.':target==='rope'?'Lano voní vlhkým konopím.':'Nic neobvyklého necítíš.'):intent==='listen'?(target==='pod'?'Uvnitř kapsle jemně praská zachycené teplo.':'Žádný hlas se neozve.'):intent==='wear'?(target==='sword'?'Meč máš připravený po ruce.':'Tohle není oblečení.'):target==='oil'?'Lampový olej se nepije. Zavřeš olejničku.':target==='ice'?'Jazyk by mohl přimrznout. Raději to nezkoušíš.':'Tohle není k jídlu ani k pití.');return}
if(intent==='cut'){if(!has('sword')){log('Nemáš čím řezat.');return}log(target==='rope'?'Přeříznutím bys zničil jedinou cestu přes propast. Lano necháš celé.':entities[target].mat==='ice'?'Meč odštípne trochu ledu. Celý sloup takhle nepřesekáš.':'Čepel by tady nic užitečného nevyřešila.');effect={type:'attack',start:performance.now()};return}
if(intent==='climb'||intent==='jump'){
 if(state.room==='mill'&&target==='wheel'){
  log('Zachytíš se ledové loukotě a zkusíš stoupnout na spodní lopatku. Námraza ti pod botou praskne; mokré dřevo klouže a pod kolem hučí hluboký náhon. Včas slezeš zpátky na bezpečný břeh.');return;
 }
 log(state.room==='bridge'?'Propast je příliš široká. Potřebuješ ji překonat s lanem.':target==='ice'||target==='wizard'?'Ledový sloup je hladký a příliš vysoký.':'Tady není bezpečné místo k lezení nebo skoku.');return;
}
if(intent==='extinguish'){if(target!=='lamp'){log('To nehoří.');return}if(!f().lit){log('Lucerna už je zhasnutá.');return}f().lit=false;log('Zavřeš přívod vzduchu a plamínek pomalu zhasne.');return}
if(intent==='close'&&target==='tomb'){if(!f().tomb)log('Sarkofág je už zavřený. Kamenné víko přesně doléhá.');else{f().tomb=false;log('Přisuneš těžké víko po opracované hraně. Výklenek zmizí pod kamenem.');}return}
if(intent==='close'&&['door','lock'].includes(target)){if(!f().door)log('Věžní dveře jsou už zavřené.');else{f().door=false;log('Dovřeš dřevěné křídlo. Zámek zůstane odjištěný, dokud ho znovu nezamkneš.');}return}
if(intent==='lock'&&['door','lock'].includes(target)){if(!has('key')){log('Potřebuješ mosazný klíč.');return}f().door=false;f().doorUnlocked=false;log('Zamykáš věž. Klíč zůstává u tebe.');return}
if(['open','push','pull','use'].includes(intent)&&target==='tomb'){if(f().tomb){log(!f().keyTaken?'Víko už je odsunuté. Ve výklenku stále leží klíč.':'Sarkofág zůstává otevřený, ale výklenek je prázdný.');return}if(!f().lit){log('Prsty přejedeš po studeném okraji. V temnotě nenahmatáš bezpečný úchop těžkého víka. Posouvat takový kámen naslepo by bylo nerozumné.');return}f().tomb=true;state.lastSurface={id:'tomb',room:state.room};log('Zapřeš se oběma rukama. Těžké víko po kameni zaskřípe a pomalu odjede do strany. '+(!f().keyTaken?'V tmavé dutině zahlédneš mosazný klíč.':'Uvnitř už nic nezůstalo.'),'good');effect={type:'reach',start:performance.now()};return}
if(['open','unlock','insert','use','push','pull'].includes(intent)&&(hasTarget('door')||hasTarget('lock')||target==='key')){if(state.room!=='tower'){log('Tady není vhodný zámek.');return}if(ids.some(id=>!['door','lock','key'].includes(id))){log('Tím se tento zámek neotevře.');return}if(f().door){log('Věžní dveře už jsou otevřené. Stačí vejít.');return}if(!f().doorUnlocked&&!has('key')){ask('unlock',['door'],'Dveře jsou zamčené. Čím je chceš odemknout?');return}const wasUnlocked=!!f().doorUnlocked;f().doorUnlocked=true;f().door=true;log(wasUnlocked?'Stiskneš kliku odjištěných dveří a otevřeš je.':'Klíč zapadne do zámku a po otočení se dveře ztěžka otevřou.','good');gameAudio?.cue('key');effect={type:'reach',start:performance.now()};return}
if(['fill','use','insert'].includes(intent)&&(hasTarget('oil')||hasTarget('lamp'))){if(ids.some(id=>!['oil','lamp'].includes(id))){log('Olej patří do lucerny. Tuhle kombinaci nepoužiješ.');return}if(!has('lamp')){log('Nejdřív vezmi lucernu.');return}if(f().filled){log('Lucerna už je naplněná.');return}if(!has('oil')){ask('fill',['lamp'],'Čím chceš lucernu naplnit?');return}consume('oil');f().filled=true;log('Naliješ olej do lucerny. Knot ho pomalu nasaje.','good');return}
if(intent==='light'||intent==='use'&&target==='lamp'){if(target!=='lamp'){log('To nechceš zapalovat.');return}if(!has('lamp')){log('Nejdřív vezmi lucernu.');return}if(!f().filled){log('Křesadlo jiskří, ale lucerna potřebuje olej.');return}if(f().lit){log('Lucerna už hoří. Plamen je klidný a jasný.');return}f().lit=true;log('Křísneš. Za sklem se rozhoří plamen.','good');return}
if(['tie','use','insert','throw'].includes(intent)&&(hasTarget('rope')||hasTarget('bridge')||hasTarget('pillar'))){if(state.room!=='bridge'){log('Lano si nech na místo, kde potřebuješ jištění.');return}if(ids.some(id=>!['rope','bridge','pillar','chasm'].includes(id))){log('K tomu lano nepřipevníš.');return}if(f().bridge){log('Lano už drží v obou pilířích.');return}if(!has('rope')){ask('tie',['bridge'],'Čím chceš pilíře spojit?');return}consume('rope');f().bridge=true;log('Přehodíš hák, zatáhneš a uvážeš uzel. Severní cesta je otevřená.','good');gameAudio?.cue('step');effect={type:'rope',start:performance.now()};return}
if(intent==='untie'&&state.room==='bridge'){if(f().bridge){log('Jištění tu necháš, abys měl i cestu zpátky.')}else log('Zatím tu žádné lano není uvázané.');return}
if(['insert','use'].includes(intent)&&(hasTarget('lens')||hasTarget('sun'))){if(state.room!=='tower'){log('Čočka potřebuje držák v paprsku slunce.');return}if(ids.some(id=>!['lens','sun'].includes(id))){log('Tato kombinace světlo nesoustředí.');return}if(f().charged){log('Čočka už sedí v držáku a kapsle je naplněná teplem. Další světlo nepotřebuje.');return}if(!has('lens')){ask('insert',['sun'],'Co chceš vložit do kruhového držáku?');return}consume('lens');f().lensInSun=true;f().charged=true;log('Zasunuješ čočku do kovového držáku. Sklo sevře hvězdářův dávno zachycený paprsek do jasného bodu a nabije tepelnou kapsli. Čočka zůstává v kotouči.','good');gameAudio?.cue('light');effect={type:'charge',start:performance.now()};return}
if(intent==='melt'){if(!['wizard','ice'].includes(target)){log('To není ledová překážka, kterou potřebuješ rozpustit.');return}if(hasTarget('pod')){win();return}if(ids.length>1){log('Tím ledovou magii nerozpustíš. Potřebuješ zdroj prudkého tepla.');return}ask('throw',['wizard'],'Čím chceš čaroděje rozpustit?');return}
if(['throw','use','insert'].includes(intent)&&hasTarget('pod')){if(!has('pod')){log('Nejdřív vezmi tepelnou kapsli.');return}if(state.room!=='cave'){log('Zde bys kapsli zbytečně promarnil. Necháš ji celou.');return}if(ids.some(id=>!['wizard','ice','pod','scepter'].includes(id))){log('Na to kapsli neplýtvej.');return}win();return}
if(intent==='attack'&&target==='raven'){
 const b=ravenMemory();b.harmed++;b.lastHarm='sword';b.trust=Math.max(-3,b.trust-3);effect={type:'attack',start:performance.now()};ravenEmote={start:performance.now(),kind:'hurt'};
 log('Havran prudce uletí na vyšší větev. „Tohle si zapamatuji,“ řekne tiše. Zpět na rozcestník se vrátí, ale drží si odstup.');return;
}
if(intent==='attack'){effect={type:'attack',start:performance.now()};if(target==='wizard'||target==='ice'||target==='scepter'){state.caveHits++;effect={type:'bolt',start:performance.now()};if(state.caveHits>=3){state.lost=true;log('Žezlo vyšle plný výboj. Led tě uzavře do průsvitného vězení. „Zpět“ vrátí poslední tah.')}else log('Meč nedosáhne. Čaroděj odpoví ledovým zábleskem. Potřebuješ jiný způsob.');return}log(target==='door'?'Dveře vydrží. Tvoje rameno by další náraz neocenilo.':'Násilím si tady nepomůžeš.');return}
if(intent==='throw'){log('„'+entities[target].name+'“ si raději necháš. Ještě se může hodit.');return}
log(({open:'Tento předmět se takhle neotevírá.',close:'Tady není co zavřít.',push:'Zatlačíš, ale nic užitečného se nepohne.',pull:'Zatáhneš, ale předmět drží pevně.',fill:'Tento předmět není nádoba.',insert:'Tyto předměty k sobě nepasují.',use:'Rozumím, co chceš použít, ale tady to nemá vhodné využití.',unlock:'Tady není vhodný zámek.'})[intent]||'Tahle činnost v této situaci nic nezmění.')}
function viewThroughScope(){
 if(state.room!=='observatory'){log('Dalekohled stojí v observatoři. Odtud do něj nahlédnout nemůžeš.');return;}
 state.spot='scope';walkStart=performance.now();scopeView=true;state.lastEntity='scope';
 if(f().lensTaken||has('lens'))log('Přiložíš oko k mosaznému okuláru. Bez přední čočky vidíš jen rozmazané stříbrné skvrny; jasný obraz zmizel.');
 else sayVariant('telescope-view',['Přiložíš oko k dalekohledu. Nad černými hřebeny zahlédneš sedm hvězd v oblouku a pod nimi vzdálený namodralý záblesk z hor.','V okuláru se objeví temný hřeben, hvězdy a slabá ledová záře severně od věže. Záře se pravidelně rozsvěcí, jako by něco v hoře dýchalo.','Skrze sklo sleduješ pomalý pohyb hvězd. Přímo nad horským průchodem je podezřelá modrá zář. Na obyčejné měsíční světlo je příliš pravidelná.']);
}
function win(){
 if(!has('pod')){log('Tepelnou kapsli nemáš u sebe.');return}
 consume('pod');state.won=true;effect={type:'win',start:performance.now()};
 gameAudio?.setScene(state.room,true);gameAudio?.cue('victory');
 log('Vrhnutá kapsle praskne o led. Teplo se rozlije po sloupu, čaroděj ztrácí tvar a jeho žezlo padá do vody.','good');
 log('Mezi kameny se objeví první pramínek vody. Z temného portálu zavane vzduch, který už není ledový.','good');
 if(state.raven?.met&&state.raven.trust>=2)log('Vzpomeneš si na havrana, který čeká na rozcestníku. Poprvé mu budeš moci přinést jinou zprávu než další varování.');
 else if(state.raven?.met)log('Vzpomeneš si na havrana a jeho rozcestník. Snad ještě pořád čeká na někoho, kdo se vrátí.');
 log('Údolí se dočká rána. KONEC PRVNÍ KAPITOLY.','good');
}
function hint(){
 let step='end';
 if(state.won)step='won';
 else if(!f().bridge)step='bridge';
 else if(!f().keyTaken&&!f().lit)step='lamp';
 else if(!f().keyTaken)step='key';
 else if(!f().doorUnlocked)step='door';
 else if(!f().lensTaken)step='lens';
 else if(!f().charged)step='sun';
 else if(!f().podTaken)step='pod';
 const hints={
  bridge:['Pilíře zůstaly pevné. Ve mlýně hledej něco pro přechod.','K přechodu potřebuješ lano s hákem.'],
  lamp:['V kryptě potřebuješ světlo. Suchý knot nechytne.','Nalij olej do lucerny a rozsviť ji.'],
  key:['Havran ví, kde hvězdář odpočívá.','V osvětlené kryptě odsuň víko sarkofágu a vezmi klíč.'],
  door:['Na klíči i zámku je sluneční znak.','Na nádvoří odemkni věž klíčem.'],
  lens:['Dalekohled obsahuje užitečnou optiku.','Vyjmi z dalekohledu přední čočku a přečti si zápisník.'],
  sun:['Kamenný kotouč uchovává poslední sluneční paprsek.','Přines k němu čočku a zasuň ji do držáku.'],
  pod:['Kotouč už soustředil světlo do ampule.','Vezmi tepelnou kapsli ze slunečního kotouče.'],
  end:['Čaroděj je mimo dosah meče. Co můžeš vrhnout?','Hoď nabitou tepelnou kapsli na čaroděje.'],
  won:['Ledová vláda skončila. Můžeš se rozhlédnout po osvobozené jeskyni.','První kapitola je dokončena. Další příběh zatím není vytvořen.']
 };
 const n=state.hints[step]||0;state.hints[step]=n+1;
 let response=hints[step][Math.min(1,n)];
 if(step==='bridge'&&state.dropped.rope)response='Odložené lano najdeš v místě: '+rooms[state.dropped.rope].title+'.';
 if(step==='sun'&&!has('lens')&&state.dropped.lens)response='Čočku jsi odložil v místě: '+rooms[state.dropped.lens].title+'. Nejprve ji zvedni.';
 if(step==='end'&&!has('pod')&&state.dropped.pod)response='Tepelnou kapsli jsi odložil v místě: '+rooms[state.dropped.pod].title+'.';
 log(response,'sys');
 if(n>=2&&step!=='won'){let items=Object.keys(entities).filter(id=>entities[id].portable&&!has(id)&&visible(id));if(items.length)log('Ještě vidíš: '+items.map(id=>entities[id].name).join(', ')+'.','sys');}
}
let lastReply='';
// Pátý nález je na konci skutečného, z větší části nepopsaného deníku.
// Stránky v něm byly celou dobu; žádná informace se do něj magicky nepřipisuje.
function journal118(lastPage=false){
 if(state.room!=='observatory'){log('Hvězdářův zápisník leží v observatoři.');return;}
 const n=state.diaryReads=(state.diaryReads||0)+1;
 state.lastEntity='book';
 const responses=[
  'Přiblížíš si zápisník. Hvězdář do něj pečlivě zakresloval pohyb hvězd a dráhy světla. Mezi výpočty je schéma slunečního kotouče a čočky, která dokáže soustředit jeho poslední zachycený paprsek.',
  'Při dalším čtení si všimneš starších dat. První záznamy mluví jen o podivně dlouhých nocích; o několik zim později už zamrzaly potoky i na místech, která dříve nikdy nezamrzala. Není to zima jediné noci.',
  'Na pozdějších stránkách se opakují výpočty směrem k severní jeskyni. Hvězdář zaznamenal, že s každým zesílením modrého světla v hoře mu bývalo hůř. Poslední řádky psal čím dál roztřesenější rukou. Vedle nákresu údolí je drobný sluneční znak u rozcestí.',
  'Znovu procházíš poznámky, výpočty i kresby. Tentokrát nenacházíš nic, čeho by sis dříve nevšiml.'
 ];
 // I při výslovném dotazu na konec zápisníku přichází osobní nález
 // až po čtyřech skutečných čteních, nikoli jako okamžitá nápověda.
 if(n>=5){
  if(!f().ravenDrawing){
   f().ravenDrawing=true;
   log('Prolistuješ zápisník až do konce. Není popsaný ani z poloviny; následuje mnoho prázdných listů. Na úplně poslední stránce je jediná drobná kresba havrana. Nic dalšího.');
  }else log('Znovu otevřeš poslední stránku zápisníku. Malá kresba havrana je pořád tam.');
  // Objev patří do stejného VGA obrazu jako pohled dalekohledem.
  // Otevře se herní detail; žádný celostránkový dialog přes prohlížeč.
  journalView=true;state.spot='book';scopeView=false;walkStart=performance.now();
 }else log(responses[n-1]);
}
function raven118(topic,t){
 if(state.room!=='clearing'){
  if(topic==='forgotBye')log('Vzpomeneš si, že ses s havranem nerozloučil. Z rozcestí už tě neslyší; můžeš se za ním vrátit.');
  else log('Havran je na rozcestí. Odtud tě neslyší.');
  return;
 }
 const b=ravenMemory();b.met=true;b.pending=null;pending=null;
 b.v118Topics ||= {};const n=b.v118Topics[topic]||0;b.v118Topics[topic]=n+1;
 state.lastEntity='raven';state.dialogue={speaker:'raven',room:'clearing',topic,stage:n};
 ravenEmote={start:performance.now(),kind:'talk'};
 let line='';
 if(topic==='approach'){
  if(b.harmed>b.apologies){line='Když vykročíš k rozcestníku, havran uskočí dál. „Zatím si drž odstup,“ řekne.';}
  else{
   b.proximity=1;state.spot='raven';walkStart=performance.now();
   line=n?'Přistoupíš k rozcestníku. Havran tě už zná a tentokrát ani neustoupí.':'Uděláš několik pomalých kroků k rozcestníku. Havran tě sleduje jedním okem. Trochu přitiskne křídla k tělu, ale neodletí.';
  }
 }else if(topic==='hand'){
  if(!b.proximity)line='Natáhneš ruku, ale havran je zatím vysoko a daleko. Můžeš k němu nejdřív přistoupit.';
  else if(b.harmed>b.apologies)line='Havran zůstane na druhém konci cedule. „Tuhle ruku si pamatuji.“';
  else{
   b.proximity=2;b.handExtended=true;state.spot='raven';walkStart=performance.now();
   if(n===0)b.trust=Math.min(8,b.trust+1);
   line='Pomalu k němu natáhneš otevřenou dlaň. Havran nakloní hlavu a pozorně si prohlédne tvoje prsty. „Co to děláš?“ zeptá se podezřívavě.';
  }
 }else if(topic==='askStroke'){
  line=b.proximity>=2?'Havran tě chvíli pozoruje. „Tak dobře. Ale pomalu.“':'„Nejdřív přijď blíž,“ řekne havran. „A hlavně žádné prudké pohyby.“';
 }else if(topic==='stepBack'){
  b.proximity=0;b.handExtended=false;state.spot=null;walkStart=performance.now();
  line='Pomalu ustoupíš. Havran se znovu pohodlně usadí na rozcestníku.';
 }else if(topic==='ringOrigin')line='Havran pozvedne nohu. „Dal mi ho hvězdář. Ten sluneční znak vyryl sám.“';
 else if(topic==='ringMeaning')line='Havran otočí nohu a prohlédne si kroužek. „Hvězdář říkal, že slunce má své místo i v nejdelší noci. Ten znak mu připomínal jeho práci.“';
 else if(topic==='ringComfort')line='„Neškrtí,“ odpoví havran. „Jen v největším mrazu studí. Už ho skoro nevnímám.“';
 else if(topic==='ringPurpose')line='Havran si kroužek jemně pootočí zobákem. „Dostal jsem ho od někoho, koho jsem měl rád. To je dostatečný důvod, nemyslíš?“';
 else if(topic==='voiceMemory')line='Havran chvíli mlčí. „Hlavně ráno. Často si při práci povídal sám pro sebe. Myslel si, že ještě spím.“';
 else if(topic==='wishReturn')line='„Kéž by to šlo,“ odpoví havran a na okamžik sklopí hlavu. „Ale slíbil jsem mu, že zůstanu tady.“';
 else if(topic==='waitForMe')line='„Budu,“ řekne havran. „Zůstávám tu proto, že jsem to slíbil. A rád uvidím, jestli se opravdu vrátíš.“';
 else if(topic==='forgotBye')line='Havran trochu napřímí peří. „Už jsem si myslel, že odejdeš bez jediného krá.“ Chvíli se na tebe dívá. „Tak tedy šťastnou cestu.“';
 else if(topic==='noLamp')line='„Pak si na ni dej pozor, až ji najdeš,“ odpoví havran. „Nechci, abys kvůli mně zůstal ve tmě.“';
 else if(topic==='lampWhere')line='„U starého mlýna bývala lucerna,“ vzpomene si havran. „Jestli tam pořád je, nevím.“';
 else if(topic==='warmWithLamp'){
  if(b.harmed>b.apologies)line='Přiblížíš lucernu, ale havran odskočí. „Zůstaň zatím tam. Ještě nevím, co od tvých rukou čekat.“';
  else if(!has('lamp'))line='Natáhneš k havranovi ruce, ale žádnou lucernu u sebe nemáš. „Na tvoje dobré úmysly si počkám,“ zakráká. „Mráz je trpělivý.“';
  else if(!f().lit)line='Přiblížíš k havranovi lucernu. „Ta je ale zhasnutá,“ poznamená. „Zahřívá mě zatím hlavně ta myšlenka.“';
  else{
   const firstWarm=!b.warmedByLamp;
   if(firstWarm){b.warmedByLamp=true;b.trust=Math.min(8,b.trust+1);}
   b.proximity=Math.max(1,b.proximity||0);state.spot='raven';walkStart=performance.now();
   line=!firstWarm?'Havran se ke světlu na okamžik obrátí bokem. „Taková maličkost. A přece člověk hned ví, že tu není sám.“':'Přistoupíš o krok blíž a podržíš lucernu v bezpečné vzdálenosti od peří. Havran nejprve ucukne, pak nepatrně roztáhne křídlo k teplu. „Jen opatrně,“ zamumlá. „Moje důstojnost je hořlavější, než vypadá.“';
  }
 }
 else if(topic==='lampPromise'){
  if(n===0)b.trust=Math.min(8,b.trust+1);
  b.lampPromise=true;
  line='Havran se trochu načepýří. „To je od tebe milé. Jen prosím opatrně. Nerad bych měl místo peří ohořelé pahýly.“';
 }else if(topic==='howHelp'){
  if(n===0)b.trust=Math.min(8,b.trust+1);
  line='Havran chvíli přemýšlí. „Nevím, jestli potřebuji, abys mě odněkud vysvobozoval. Zůstávám tu sám od sebe.“ Odmlčí se. „Ale jestli chceš, můžeme si o tom povídat.“';
 }else if(topic==='praiseHuman'){
  if(n===0)b.trust=Math.min(8,b.trust+1);
  line=n===0?'Havran se zarazí a sklopí hlavu. „Znal jsem dobré i špatné lidi,“ odpoví tiše. „Ale děkuji. Tohle mi ještě nikdo neřekl.“':'„O lidech bych tak rychle nesoudil,“ namítne havran. „Hvězdář byl člověk. A byl to nejlepší přítel, jakého jsem měl.“';
 }else if(topic==='sigh'){
  line=n===0?'Havran se na tebe podívá. „Taky bych si občas povzdechl, kdybych měl lidská ramena,“ řekne. „Copak tě trápí?“':'„To znám,“ pokývá havran zobákem. „Někdy se zdá, že ten mráz nikdy nepovolí. Ale ještě jsme tady.“';
 }else if(topic==='staring'){
  line=b.harmed>b.apologies?'Havran se od tebe odtáhne na konec rozcestníku. „Hlídám si tvoje ruce. Po tom, cos udělal, se mi snad nedivíš.“':n===0?'Havran na tebe upře černé oko. „Dívám se, jestli jsi opravdu tak odvážný, jak vypadáš. A ty? Proč civíš na mě?“':'„Když kolem projde rytíř uprostřed takové zimy,“ zakráká havran, „člověk — tedy havran — se prostě podívá.“';
 }else if(topic==='speaking'){
  line='„Slyšíš mě, ne?“ Havran nakloní hlavu. „Hvězdář mě kdysi učil slova. Nejdřív jsem je jen opakoval. Pak jsem začal rozumět, na co se vlastně ptá.“';
 }else if(topic==='whyWaiting'){
  state.dialogue.topic='duty';
  line=n===0?'Havran přešlápne na zmrzlé ceduli. „Hvězdáři jsem slíbil, že tu zůstanu a ukážu cestu tomu, kdo přijde hledat světlo. Nikdo mě tu nedrží. Jen moje slovo.“':'„Mohl bych odletět,“ řekne tiše. „Ale hvězdář mi věřil. A já ten slib nechci zahodit, dokud ještě někdo může přijít.“';
 }else if(topic==='waitingDuration'){
  state.dialogue.topic='waitingTime';
  line=n===0?'„Nejdřív jsem počítal dny,“ řekne havran a zadívá se ke smrku. „Pak zimy. Jednoho rána už jsem nevěděl, jaké číslo má přijít dál.“':'„Dlouho,“ odpoví po chvíli. „Pamatuji si, když tu ještě rostla tráva. Teď si pamatuji spíš zvuk větru ve sněhu.“';
 }else if(topic==='origin'){
  state.dialogue.topic='memory';
  line=n===0?'„Přiletěl jsem kdysi z lesa za horou,“ začne havran. „Pak jsem si poranil křídlo. Hvězdář mě našel, vzal do tepla a uzdravil. Od té doby jsem se držel poblíž něj.“':'Havran přitiskne křídlo k tělu. „Odtamtud, kde dřív bývaly stromy bez ledu. Hvězdář mě našel se zlomeným křídlem. Když jsem mohl znovu létat, stejně jsem neodletěl daleko.“';
 }else if(topic==='howMuchLonger'){
  state.dialogue.topic='duty';
  line='Havran zvedne oči k severu. „To nevím, rytíři. Čekal jsem celé zimy. Jestli se někdo vrátí se světlem, snad už ten slib konečně splním.“';
 }else if(topic==='returnWhere'){
  state.dialogue.topic='companionship';
  line='„Sem za mnou,“ kývne havran zobákem na rozcestník. „Až se vrátíš od mostu nebo od mlýna, rád uslyším, cos viděl. Nemusíš přinést nic jiného než zprávu.“';
 }else if(topic==='feelingBetter'){
  line=b.warmedByLamp?'Havran trochu povolí načepýřené peří. „Ano, je mi lépe. Od té chvíle, cos mi podržel lucernu, mě tolik nestudí křídla. Děkuji.“':'Havran se oklepe. „Ještě ne. Mráz mi zalézá pod peří. Ale že se ptáš, to mě těší.“';
 }else if(topic==='stillCold'){
  line=b.warmedByLamp?'„Úplně ne,“ přizná havran. „Ale u tvé lucerny jsem se konečně trochu prohřál. Už to není tak zlé.“':'„Pořád,“ řekne havran a přitáhne křídla k tělu. „Jestli máš lucernu, teplo z ní by se hodilo.“';
 }else if(topic==='warmOffer'){
  line=b.warmedByLamp?'Havran vděčně skloní hlavu. „To je od tebe milé. Už jsi mi pomohl tou lucernou. Nic dalšího mi nosit nemusíš; šetři síly na cestu.“':'Havran nakloní hlavu. „Něco teplého? V tomhle mrazu bych nepohrdl ani trochou tepla od lucerny. Ale nic kvůli mně neriskuj.“';
 }else if(topic==='angryAfterHarm'){
  line=b.harmed>b.apologies?'Havran se stáhne na kraj rozcestníku. „Ano, zlobím se. '+(b.lastHarm==='stone'?'Hodil jsi po mně kámen.':'Namířil jsi na mě meč.')+' A také se tě bojím. Nestačí se zeptat, jestli jsem zapomněl.“':b.harmed?'Havran se na okamžik zadívá na tvou ruku. „Už se tolik nezlobím. Ale na to, co se stalo, nezapomenu hned.“':'Havran překvapeně zvedne hlavu. „Na tebe? Proč bych se měl zlobit? Jen tu spolu stojíme v zimě.“';
 }else if(topic==='forgiveAfterHarm'){
  line=b.harmed>b.apologies?'Havran zůstane o větev výš. „Možná. Nejdřív ale potřebuju vědět, že mě znovu nenapadneš. Opravdové promiň znamená víc než otázka.“':b.harmed?'Havran pomalu přikývne. „Slyšel jsem tvoji omluvu. Odpustit dokážu, ale důvěra se nevrátí jedním mávnutím křídla.“':'Havran zamrká. „Odpustit co? Nic zlého jsi mi neudělal, rytíři.“';
 }else if(topic==='whatHappened')line='Havran se zadívá k věži. „Něco se změnilo, když se hvězdář vrátil z hory. Už nechodil tak rychle. Víc ti říct nedokážu. Tehdy jsem se neptal.“';
 else if(topic==='vow'){
  // Kontext pro bezprostřední „proč?“ musí být tentýž jako pro hloubkový
  // rozhovor o dobrovolném slibu; jinak spadne do obecné filozofické odpovědi.
  state.dialogue.topic='duty';
  line=/musis/.test(t)?'„Musím? Nikdo mě tu nezamkl. Právě proto je to tak těžké. Zůstávám, protože jsem se kdysi sám rozhodl.“':'Havran se podívá na cestu pod sebou. „Hvězdář mě požádal, abych tu zůstal a ukázal cestu těm, kdo půjdou za světlem. Slíbil jsem mu to. Nikdo mě nenutí.“';
 }
 else if(topic==='seekWizard'){
  b.questKnown=true;
  line=n===0?'Havran zpozorní. „Černokněžníka? Jestli myslíš toho, kvůli kterému údolí zamrzá, slyšel jsem o něm. Hvězdář se o něj zajímal také.“ Chvíli tě pozoruje. „Proč ho hledáš?“':'„Ten v hoře nikam nezmizel,“ odpoví havran vážně. „Nevím, jestli si s ním poradíš. Ale o cestách k němu něco vím.“';
 }
 else if(topic==='drawing'){
  if(!f().ravenDrawing)line='„Jakou kresbu?“ zeptá se havran. „To jsem od něj nečekal.“';
  else line=b.trust>=4?'Havran zmlkne. „Nakreslil mě?“ Chvíli hledí do sněhu. „Nikdy mi to neřekl.“':'Havran zvedne hlavu. „Tak on mě nakreslil.“ Chvíli mlčí. „To bych od něj nečekal.“';
 }else{
  line='Havran chvíli přemýšlí. „Nevím,“ přizná nakonec. „Ale jestli chceš, můžeme si o tom povídat.“';
 }
 if(!['approach','hand','askStroke','stepBack'].includes(topic)&&n===0&&['voiceMemory','ringComfort','drawing'].includes(topic))b.trust=Math.min(8,b.trust+1);
 if(b.trust>=5&&b.harmed<=b.apologies&&b.proximity>=2&&!b.calledFriend&&['drawing','howHelp','waitForMe','voiceMemory'].includes(topic)){
  b.calledFriend=true;line+=' „Děkuji, příteli,“ dodá po chvíli.';
 }
 gameAudio?.cue('raven');log(line);
}
function execute(raw){if(!raw.trim())return;let p=parse(raw);log('> '+raw,'cmd');history.push(raw);historyIndex=history.length;
if(journalView&&state.room==='observatory'){
 const n=norm(raw);
 if(/^(?:pryc|odejit|odejdi|odejdu|chci odejit|odstup|odstoupit|odstoupim|zavri denik|zavrit denik|zavri zapisnik|zavrit zapisnik|odloz denik|odlozit denik|odloz zapisnik|odlozit zapisnik|prestan cist|prestat cist|zpatky od deniku|odvratim se|odvrat se)$/.test(n)){
  journalView=false;state.spot=null;walkStart=performance.now();
  log('Zavřeš zápisník a opatrně jej položíš zpátky na stůl. Zůstáváš v síni.');sync();return;
 }
 if(!/\b(?:denik|deniku|zapisnik|zapisniku|stranka|stranku|stranky|listy)\b/.test(n))journalView=false;
}
// „Pryč“ v pohledu okulárem znamená odvrátit se od dalekohledu.
// Odchod ze síně se provede až dalším příkazem, nebo explicitně směrem.
if(scopeView&&state.room==='observatory'&&/^(?:pryc|odejit|odejdi|odejdu|chci odejit|odstup|odstoupit|odstoupim|odstoupit od dalekohledu|odstup od dalekohledu|odvratit se|odvrat se|odvratim se|prestat se divat|prestan se divat|zavrit pohled|zrusit pohled|uz se nechci divat)$/.test(norm(raw))){
 scopeView=false;state.spot=null;walkStart=performance.now();
 log('Odvrátíš se od okuláru a uděláš krok od dalekohledu. Zůstáváš v síni hvězdáře.');sync();return;
}
if(p.intent==='v118Raven'||p.intent==='v118Journal'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 if(p.intent==='v118Raven')raven118(p.topic,p.t);else journal118(p.last);
 undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='sunQuestion'){
 if(f().charged)log('V dutině kotouče už leží malá skleněná kapsle se zachyceným světlem. Můžeš ji opatrně vyjmout.');
 else log(/^(?:kde|odkud)/.test(p.t)?'V kotouči zatím žádná kapsle neleží. Je tu pouze prázdný držák; na jeho okraji zůstala nepatrná kruhová stopa po něčem hladkém.':'V dutině žádnou kapsli nevidíš. Nad ní je prázdné kruhové lůžko. Když nakloníš hlavu, na jeho hraně se na okamžik mihne skelný odlesk.');
 persist();return;
}
if(p.intent==='towerEntry'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 towerEntryReaction(p.topic);undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='millWindow'){
 log('Obejdeš zápraží a hledáš okno, kterým by ses protáhl dovnitř. Žádný bezpečný průlez v dosahu nenajdeš; mlýn zůstává uzavřený.');persist();return;
}
if(p.intent==='ravenStoneThrow'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 const b=ravenMemory();b.met=true;b.harmed++;b.lastHarm='stone';b.trust=Math.max(-3,b.trust-2);b.proximity=0;b.handExtended=false;
 state.lastEntity='raven';state.dialogue={speaker:'raven',room:'clearing',topic:'harm',stage:0};
 ravenEmote={start:performance.now(),kind:'hurt'};effect={type:'attack',start:performance.now()};
 log('Sehneš se pro kamínek a mrštíš jím po havranovi. Pták včas uskočí; kámen dopadne do sněhu za rozcestníkem. „Tohle sis mohl odpustit,“ řekne havran tiše a odtáhne se dál od tebe.');
 undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='wizardPortal'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 wizardPortalAttempt();undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='caveRoleplay'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 const b=wizardMemory();
 const response=globalThis.adventureWizardRoleplay.respond(p.topic,{text:p.t,memory:b,hits:state.caveHits,approaches:b.approaches,inv:state.inv});
 state.dialogue={speaker:'wizard',room:'cave',topic:'role:'+p.topic,stage:(b.topics['role:'+p.topic]||1)-1};
 state.lastEntity=['dwarfs','search'].includes(p.topic)?'dwarfs':'wizard';
 log(response);undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='caveDetail'){
 const before=JSON.parse(JSON.stringify(state));state.turn++;
 cavePhysicalReaction(p.topic,p.t);undo.push(before);if(undo.length>100)undo.shift();sync();return;
}
if(p.intent==='ravenContext11814'){
 const b=ravenMemory();b.met=true;b.pending=null;pending=null;
 const answer=globalThis.adventureRavenContext11814.respond(p.topic,b);
 const topic=p.topic.startsWith('food')?'ravenHunger':'promiseOrigin';
 state.dialogue={speaker:'raven',room:'clearing',topic,stage:answer.stage};
 state.lastEntity='raven';ravenEmote={start:performance.now(),kind:'talk'};
 if(['foodConcern','foodHelp'].includes(p.topic)&&answer.stage===0)b.trust=Math.min(8,b.trust+1);
 gameAudio?.cue('raven');log(answer.text);persist();return;
}
if(p.intent==='ravenContext'){ravenContextAnswer(p.topic);persist();return;}
if(p.intent==='ravenNatural'){
 const b=ravenMemory();b.pending=null;pending=null;
 const dialogueContext=state.dialogue?.room==='clearing'&&state.dialogue?.speaker==='raven'?state.dialogue:null;
 const answer=globalThis.adventureRaven115.respond(p.topic,p.t,b,dialogueContext);
 state.dialogue={speaker:'raven',room:'clearing',topic:p.topic,stage:b.relationCounts[p.topic]-1};
 ravenEmote={start:performance.now(),kind:['capture','harm','insult'].includes(p.topic)?'startle':'talk'};
 state.lastEntity='raven';gameAudio?.cue('raven');log(answer);persist();return;
}
if(p.unresolved){log('Co myslíš výrazem „'+p.unresolved+'“?');return;}
if(p.intent==='repeatReply'){log(lastReply||'Zatím není co zopakovat.');return;}
if(p.nounSuggestion){log('Myslíš „'+p.nounSuggestion+'“? Upřesni název.');pending={intent:p.intent,ids:[]};return;}
if(p.suggest){log('Myslíš „'+p.suggest+'“? Opravený příkaz prosím zopakuj.');return;}
if(ravenPendingAnswer(p.t,p)){persist();return;}
if(p.intent==='routeQuestion'){answerRoute(p.t,p.advice);persist();return;}
if(p.intent==='viewScope'){viewThroughScope();persist();return;}
if(p.intent==='underTable'){
 const dropped=Object.keys(state.dropped).filter(id=>state.dropped[id]===state.room);
 if(state.room==='mill'){
  log((!f().crateBroken?'Přikrčíš se u pracovního stolu. V závětří pod jeho deskou stojí nízká dřevěná bedýnka. Víko je místy odchlípnuté, ale drží na starých hřebech.':
   !f().coinTaken?'Pod stolem zůstaly třísky rozbité bedýnky. Mezi nimi se slabě leskne stříbrná mince.':
   'Pod stolem zůstaly jen třísky po rozbité bedýnce.')+
   (dropped.length?' Opodál jsi odložil: '+dropped.map(id=>entities[id].name).join(', ')+'.':''));
  state.lastEntity=null;state.lastWorld={id:'bedynka',room:'mill'};return;
 }
 log('Skloníš se a prohlédneš prostor pod stolem. Mezi jeho nohami jsou jen stíny a oděrky na podlaze.'+
 (dropped.length?' Opodál leží věci, které jsi sám odložil: '+dropped.map(id=>entities[id].name).join(', ')+'.':' Skrytá věc ani zásuvka tam není.'));
 state.lastEntity='table';return;
}
if(p.intent==='cancel'||p.intent==='answer'&&['ne','no','zrus','nic'].includes(p.t)){pending=null;log('Dobře, nic neměním.');return}
if(p.intent==='pleaForHelp'){
 log(state.room==='cave'?'Čaroděj si tě prohlédne. „O pomoc se žádá snadno,“ pronese chladně. „Já ti ji ale slíbit nemohu.“':
 'Vyslovíš svou prosbu do mrazivého ticha. Odpoví ti jen vítr a ozvěna vlastních slov. Kdyby tu někdo byl, mohl bys ho oslovit.');return;
}
if(p.intent==='help'&&p.t!=='napoveda'){dialog('Jak hrát','Piš běžně česky, s diakritikou i bez ní. Otázka sama nic nepoužije ani nespotřebuje. V rozhovoru můžeš navázat třeba „co třeba?“, „co ještě?“ nebo „proč?“. Téma platí, dokud neodejdeš nebo se nerozloučíš.\n\nMůžeš prozkoumat i celou lokaci: „prozkoumat kryptu“. Rozumím otázkám „kde je klíč“, „jak překonat most“, pozdravům i poděkování. Zkus zaklepat, zatřást, otočit, opravit, očistit, počítat, kopat, zpívat nebo se plížit.\n\nMůžeš se rozhlížet, brát a odkládat věci, otevírat, odemykat, nalévat, zapalovat, vkládat, uvazovat, řezat, házet, mluvit, ptát se, poslouchat, očichávat, dotýkat se, zkoušet útok, lezení nebo skok. Reakce závisí na místě a předmětu.\n\n„odemkni dveře klíčem“\n„klíčem otevři dveře“\n„strč klíč do zámku“\n„prohlídni lucernu“ → „vezmi ji“\n„vezmi všechno“\n„jdi do mlýna“ / „západ“\n\nJeden nebo více příkazů odděl středníkem či „a pak“. Po doplňující otázce stačí předmět. Nejasný příkaz nic neprovede.\n\nInventář, mapa, nápověda (postupně konkrétnější), zpět, uložit, načíst, restart. Šipky ↑ ↓ vracejí historii.\n\nCRT je volitelný a jeho intenzitu nastavíš posuvníkem.\n\nJde o offline slovníkový parser, nikoli jazykový model: nelze zaručit porozumění každé české větě.');return}
if(p.intent==='hint'||p.t==='napoveda'){hint();persist();return}if(p.intent==='inventory'){log('Neseš: '+(state.inv.map(x=>entities[x].name).join(', ')||'nic')+'.');return}if(p.intent==='map'){openWorldMap(state,rooms,crtEnabled);return}if(p.intent==='save'){saveFile();return}if(p.intent==='load'){$('file').click();return}
if(p.intent==='undo'){if(undo.length){state=undo.pop();pending=null;effect=null;walkStart=0;log('Poslední tah vrácen.','sys');sync()}else log('Není co vrátit.');return}
 if(p.intent==='restart'){pending={intent:'restart',ids:[]};log('Začít novou hru? Napiš ano, nebo ne.');return}if(pending?.intent==='restart'&&p.intent==='answer'){state=initial();undo=[];pending=null;effect=null;scopeView=false;journalView=false;ravenEmote={start:-10000,kind:'idle'};for(const key of Object.keys(replyCounts))delete replyCounts[key];describe();sync();return}
if(state.won&&state.room==='cave'&&p.intent==='talk'){log('Čaroděj už zmizel. V osvobozené jeskyni odpovídá jen kapání vody.');return;}
if(p.intent==='talk'){conversation(p.ids.find(id=>['raven','wizard'].includes(id))||p.ids[0],p.t,p.continuation);persist();return;}
if(['question','surface','status','hello','thanks','sorry','bye','curse'].includes(p.intent)){expandedAction(p);if(p.intent==='bye')delete state.dialogue;persist();return;}
if(p.intent==='answer'){log(pending?'Potřebuji název věci nebo místa, ne jen ano.':'Teď tu není žádná otázka na ano či ne.');return;}
if(state.won&&state.room==='cave'&&!(p.intent==='go'&&!p.ids.includes('portal'))){
 if(p.ids.includes('portal')){log(p.intent==='go'?'Přejdeš ke vstupu do osvobozeného portálu. Za ním začíná další cesta, ale první kapitola tady končí. Na chvíli se zastavíš a necháš údolí vydechnout.':'Temný portál už nestřeží čaroděj. V průchodu je vidět slabé světlo rodícího se rána a vítr už nenese mráz.');return;}
 if(p.ids.includes('wizard')||p.ids.includes('scepter')){log('Po čaroději zůstala jen voda a úlomky ledu. Jeho žezlo leží rozbité na dně.');return;}
 if(['look','inspect','read'].includes(p.intent)){describe();log('Rozlámané ledové stěny odrážejí první teplé světlo. Cesta k portálu je konečně volná.');return;}
 if(p.intent==='wait'){log('Chvíli jen posloucháš, jak kolem tebe taje led. Někde daleko v údolí se ozve první kapka ze střechy.');return;}
 log('První kapitola skončila. Můžeš se rozhlédnout, dojít k portálu nebo se vrátit jižní cestou za havranem. „Restart“ zahájí novou hru.');return;
}
if(state.lost){log('Jsi uvězněný v ledu. „Zpět“ vrátí poslední tah.');return;}
if(pending&&p.location&&!p.intent&&['inspect','look','go','read'].includes(pending.intent)){p.intent=pending.intent;pending=null;}
if(pending&&p.ids.length&&!p.intent){p.intent=pending.intent;p.ids=[...new Set([...pending.ids,...p.ids])];pending=null}else if(p.intent)pending=null;
if(!p.intent&&p.location&&!pending){log('Chceš místo „'+rooms[p.location].title+'“ prozkoumat, nebo tam jít?');return;}
if(!p.intent){if(p.ids.length){log('Co s tím chceš udělat?');return}let first=p.t.split(' ').filter(w=>!['prosim','zkus','chci','si','se','mi'].includes(w))[0]||'';let near=[...wordIntent.keys()].filter(w=>w.length>3&&Math.abs(w.length-first.length)<=1&&distance(first,w)===1);if(near.length)log('Slovesu „'+first+'“ nerozumím. Myslel jsi „'+near[0]+'“? Upřesni to prosím.','sys');else log('Nerozumím, co chceš udělat.','sys');return}
const before=JSON.parse(JSON.stringify(state));const previousPending=pending;try{state.turn++;action(p);if(p.ids.length&&!p.source&&(!['inspect','look','read'].includes(p.intent)||p.ids.length>1))state.lastEntities=p.ids.filter(visible);if(!valid(state))throw new Error('Neplatny stav');undo.push(before);if(undo.length>100)undo.shift();sync();}catch(error){state=before;pending=previousPending;effect=null;log('Příkaz se nepodařilo dokončit. Stav hry jsem vrátil před něj; zkus jiné vyjádření.','sys');sync();}}
function command(raw){lastPlayerInputAt=Date.now();let parts=raw.split(/;|\ba pak\b|\ba potom\b|\ba nasledne\b/i).map(x=>x.trim()).filter(Boolean);for(let part of parts){execute(part);if(pending||state.lost||state.won)break}}
function distance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next}return row[b.length]}
function valid(s){return s&&rooms[s.room]&&Array.isArray(s.inv)&&s.inv.every(x=>entities[x]?.portable)&&s.flags&&typeof s.flags==='object'&&s.dropped&&Object.entries(s.dropped).every(([id,r])=>entities[id]?.portable&&rooms[r])&&Number.isSafeInteger(s.turn)&&s.turn>=0&&typeof s.won==='boolean'&&typeof s.lost==='boolean'&&Array.isArray(s.visited)&&s.visited.every(x=>rooms[x])&&s.hints&&Number.isFinite(s.caveHits)}
// V10 a V11 používají stejné označení uložené hry. Doplní se jen nová stavová data.
function upgradeState(s){
 if(!('spot' in s))s.spot=null;
 if(!s.raven)s.raven=initial().raven;
 if(!('epilogueDone' in s.raven))s.raven.epilogueDone=false;
 for(const [key,value]of Object.entries(initial().raven))if(!(key in s.raven))s.raven[key]=value;
 if(!s.raven.topics||typeof s.raven.topics!=='object')s.raven.topics={};
 if(!s.wizard||typeof s.wizard!=='object')s.wizard=initial().wizard;
 if(!Number.isSafeInteger(s.wizard.approaches)||s.wizard.approaches<0)s.wizard.approaches=0;
 if(!Number.isSafeInteger(s.wizard.exchanges)||s.wizard.exchanges<0)s.wizard.exchanges=0;
 if(!s.wizard.topics||typeof s.wizard.topics!=='object')s.wizard.topics={};
 if(s.flags.charged&&!s.flags.lensInSun){s.flags.lensInSun=true;s.inv=s.inv.filter(id=>id!=='lens');}
 if(s.flags.door&&!s.flags.doorUnlocked)s.flags.doorUnlocked=true;
 return s;
}
function saveFile(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({game:'last-light-v04',state},null,2)],{type:'application/json'}));a.download='Jeskyne_v11_8_11_ulozena_hra.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);log('Soubor s uloženou hrou je připraven ke stažení.','sys')}
const canvas=$('scene'),ctx=canvas.getContext('2d'),atlas=new Image();let loaded=false;atlas.src='assets/svet.png';atlas.onload=()=>{loaded=true;draw(performance.now())};atlas.onerror=()=>log('Chybí assets/svet.png. Rozbal celý ZIP do jedné složky.','sys');
const cleanMill=new Image(),propAtlas=new Image();let cleanMillLoaded=false,propsLoaded=false;
cleanMill.onload=()=>{cleanMillLoaded=true};propAtlas.onload=()=>{propsLoaded=true};
cleanMill.src='assets/mlyn_zavreny_v11814.png';propAtlas.src='assets/predmety.png';
const scopePainting=new Image();let scopePaintingReady=false;
scopePainting.onload=()=>{scopePaintingReady=true;};
scopePainting.onerror=()=>log('Kresba výhledu dalekohledu se nenačetla; použije se jednoduchý náhradní pohled.','sys');
scopePainting.src='assets/dalekohled_vyhled.png';
// Původní, hráčem vybraný havran zůstává beze změny v assets.
// Stránku zobrazujeme přes nízké herní rozlišení a nejbližší pixely.
// Nečteme pixely z canvasu: hra tak funguje i z offline file:// na PC.
const journalPainting=new Image();let journalPaintingReady=false,journalPixels=null;
journalPainting.onload=()=>{
 journalPaintingReady=true;
 const tiny=document.createElement('canvas');tiny.width=128;tiny.height=85;
 const g=tiny.getContext('2d',{willReadFrequently:true});
 g.imageSmoothingEnabled=false;g.drawImage(journalPainting,0,0,128,85);
 journalPixels=tiny;
};
journalPainting.onerror=()=>log('Obrázek poslední stránky zápisníku chybí. Zkontroluj složku assets.','sys');
journalPainting.src='assets/posledni_strana_havran.png';
// Předem malované stavové varianty: žádné vyřezané obdélníky na původním obrazu.
const sceneVariants={};
for(const [id,file]of Object.entries({
 cryptKey:'krypta_otevrena_klic.png',cryptEmpty:'krypta_otevrena_prazdna.png',
 towerClosed:'vez_zavrena.png',bridgeRope:'most_lano.png'
})){
 const pic=new Image();sceneVariants[id]={image:pic,ready:false};
 pic.onload=()=>{sceneVariants[id].ready=true;};
 pic.onerror=()=>log('Grafická varianta '+file+' se nenačetla; zachován původní obraz.','sys');
 pic.src='assets/'+file;
}
// Originální ručně malované VGA sprity; žádné procedurální hnědé obdélníky.
// Stav bedýnky a schránky se vždy řídí skutečným stavem hádanky.
const paintedProps={};
for(const [id,file]of Object.entries({
 millCrateClosed:'bedynka_zavrena_v1188.png',millCrateBroken:'bedynka_rozbita_v1188.png',
 millCrateEmpty:'bedynka_rozbita_prazdna_v1188.png',
 cryptCasketClosed:'schranka_zavrena_v1189b.png',
 cryptCasketLetter:'schranka_otevrena_listek_v1189b.png',
 cryptCasketEmpty:'schranka_otevrena_prazdna_v1189b.png',
 horseshoe:'podkova_v1188.png',wizard:'carodej_big_reimaginace_v1188.png'
})){
 const pic=new Image();paintedProps[id]={image:pic,ready:false};
 pic.onload=()=>{paintedProps[id].ready=true;};
 pic.onerror=()=>log('Chybí malovaný herní prvek: '+file+'. Zkontroluj složku assets.','sys');
 pic.src='assets/'+file;
}
function drawPaintedProp(id,x,y,w,h,alpha=1){
 const item=paintedProps[id];if(!item?.ready)return;
 ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(item.image,x,y,w,h);ctx.restore();
}
const propFrames={rope:[205,0,335,720],oil:[803,132,528,530],lamp:[1635,4,396,696]};
function drawProp(id,x,y,w,h){if(propsLoaded)ctx.drawImage(propAtlas,...propFrames[id],x,y,w,h)}
function drawDroppedGlyph(id,x,y){
 ctx.fillStyle='#10132199';ctx.beginPath();ctx.ellipse(x+6,y+10,10,2.5,0,0,Math.PI*2);ctx.fill();
 if(id==='key'){box(x+2,y+2,6,6,'Q');box(x+4,y+4,2,2,'K');box(x+8,y+4,9,2,'G');box(x+13,y+5,2,4,'Q');box(x+16,y+5,2,3,'Q');}
 else if(id==='pendant'){box(x+5,y+1,7,2,'Q');box(x+4,y+3,9,8,'Q');box(x+6,y+4,5,5,'K');box(x+7,y+5,1,1,'W');box(x+9,y+6,1,1,'W');box(x+11,y+8,1,1,'W');}
 else if(id==='coin'){box(x+4,y+3,8,6,'A');box(x+5,y+3,6,5,'H');box(x+7,y+4,3,3,'T');box(x+6,y+4,1,1,'W');}
 else if(id==='lens'){box(x+3,y+1,9,9,'A');box(x+5,y+2,6,6,'C');box(x+6,y+3,3,4,'H');box(x+9,y+3,1,2,'W');}
 else if(id==='pod'){box(x+5,y,6,2,'G');box(x+4,y+2,8,7,'C');box(x+6,y+3,4,5,'M');box(x+5,y+9,6,2,'Q');}
 else if(id==='sword'){box(x+2,y+6,5,2,'Q');box(x+6,y+4,3,6,'G');for(let j=0;j<10;j++)box(x+9+j,y+4-j*.3,1,2,j%2?'W':'A');}
}
function worldProps(t){
if(state.room==='bridge'){
 // Nenápadná kovová spona v kamenné spáře na levé hraně útesu.
 // Původní velká spona na pilíři byla vizuální chyba a už se nekreslí.
 if(!f().pendantTaken&&!has('pendant')){
  // Záblesk leží na hraně skály; nesmí jej překrývat rytíř.
  // V11.8.2 byl jediný tmavý pixel na x=66,y=126 při běžném zvětšení neviditelný.
  const x=87,y=92;
  if(!f().pendantRevealed){
   // Neurčitý kousek zašlého kovu zůstává vidět i mezi záblesky.
   box(x,y+1,3,2,'#71533d');
   box(x+1,y,2,1,'#b99a6a');
   box(x+1,y+1,1,1,f().ledgeInspected?'#ecdaaa':'#c6a777');
   // Krátké záblesky nepravidelně po přibližně 4–5 sekundách.
   // Špičky zůstávají pixelové, bez rozmazaného kruhového záření.
   const moment=t%14200;
   const flash=Math.max(...[900,5700,10700].map(at=>Math.max(0,1-Math.abs(moment-at)/800)));
   if(flash>.08){
    ctx.save();ctx.globalAlpha=.28+flash*.69;
    box(x,y,4,3,'#c3a06c');
    if(flash>.25){
     box(x+1,y-4,2,3,'#e5cf9d');
     box(x+1,y+3,2,3,'#d7bc84');
     box(x-3,y+1,3,1,'#e2c99d');
     box(x+4,y+1,3,1,'#f1d7a1');
    }
    if(flash>.55){
     box(x,y,4,3,'#ffe6a9');
     box(x+1,y+1,2,1,'#fff5e4');
     box(x-1,y-1,1,1,'#dac49d');
     box(x+5,y+3,1,1,'#dfc596');
    }
    ctx.restore();
   }
  }else{
   // Po vypáčení spony je malý přívěsek patrný ve skalní dutině.
   box(x-3,y-1,10,1,'#1a1e2b');
   box(x-1,y,7,1,'#8b6e4b');
   box(x,y+1,5,2,'#c49b62');
   box(x-1,y+3,7,4,'#a77d45');
   box(x,y+3,5,3,'#283650');
   box(x+1,y+4,1,1,'#f1e9d0');
   box(x+3,y+5,1,1,'#d7e5ec');
   box(x+5,y+7,1,1,'#70573d');
  }
 }
}
// Schránka je ve skutečném tmavém výklenku. Teprve po odhalení a se světlem
// se objeví výtvarně sladěná varianta (zavřená, s lístkem, prázdná).
if(state.room==='crypt'&&f().lit&&has('lamp')&&f().cryptNicheFound){
 const id=!f().cryptChestOpen?'cryptCasketClosed':f().cryptLetterTaken?'cryptCasketEmpty':'cryptCasketLetter';
 // Položená na podlaze před temným obloukem, vlevo od rytíře.
 // Je to nízká schránka ve skutečném pixelovém měřítku. Otevřené víko
 // roste směrem vzhůru; spodní hrana zůstává v obou stavech na y=138.
 if(id==='cryptCasketClosed')drawPaintedProp(id,100,120,26,18,.72);
 else drawPaintedProp(id,99,112,29,26,.72);
}
if(state.room==='mill'){
if(!has('rope')&&!f().ropeTaken&&!state.dropped.rope)drawProp('rope',347,25,24,66);
if(!has('oil')&&!f().oilTaken&&!state.dropped.oil)drawProp('oil',391,85,23,23);
if(!has('lamp')&&!f().lampTaken&&!state.dropped.lamp)drawProp('lamp',442,74,19,34);
 // V malovaném pozadí zůstává pod stolem prázdno; bedýnka existuje
 // pouze jako jediný stavový sprite. Původní pozice (405,140) ji kreslila
 // vedle druhé bedýnky ve vrstvě pozadí a působila, jako by levitovala.
 // Nová spodní hrana y=158 leží ve sněhu mezi oběma nohami stolu.
 ctx.save();ctx.fillStyle='#0c102d91';ctx.beginPath();
 ctx.ellipse(382,157,20,3.5,0,0,Math.PI*2);ctx.fill();ctx.restore();
 drawPaintedProp(!f().crateBroken?'millCrateClosed':f().coinTaken?'millCrateEmpty':'millCrateBroken',362,130,42,28,1);
 // Nad zápražím visí drobná namrzlá podkova. Po sebrání se ze scény odstraní.
 if(!has('horseshoe')&&!f().horseshoeTaken&&!state.dropped.horseshoe)
  drawPaintedProp('horseshoe',328,52,13,22,.82);
}
// Dropped objects appear on the ground, rather than reappearing on the wall.
let n=0;for(const [id,room]of Object.entries(state.dropped))if(room===state.room&&!has(id)){
 const h=id==='rope'?22:id==='lamp'?20:14,w=id==='rope'?12:id==='lamp'?11:15;
 const x=heroPlacement[state.room].x+20+n*19,y=heroPlacement[state.room].y-h;
 if(id==='horseshoe')drawPaintedProp('horseshoe',x,y,11,14,.85);
 else if(propFrames[id])drawProp(id,x,y,w,h);else drawDroppedGlyph(id,x,y);
 n++;
}
}
const palette={K:'#060512',D:'#24182f',P:'#a84ee4',M:'#ed94ed',C:'#69d9ff',W:'#eee8f5',S:'#f4cdbc',B:'#474e9b',G:'#fce99e',H:'#c7e3ed',A:'#859faf',Q:'#e5ae58',T:'#44556f'};
function box(x,y,w,h,col){ctx.fillStyle=palette[col]||col;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function pixline(x,y,xx,yy,col){let dx=Math.abs(xx-x),sx=x<xx?1:-1,dy=-Math.abs(yy-y),sy=y<yy?1:-1,e=dx+dy;for(let n=0;n<1000;n++){box(x,y,1,1,col);if(x===xx&&y===yy)break;let e2=2*e;if(e2>=dy){e+=dy;x+=sx}if(e2<=dx){e+=dx;y+=sy}}}
function sprite(rows,x,y,scale=1){rows.forEach((row,j)=>[...row].forEach((c,i)=>{if(c!=='.')box(x+i*scale,y+j*scale,scale,scale,c)}))}
// Painted knight atlas; fixed body proportions, opaque armor, feet anchored to ground.
const knightImage=new Image();let knightLoaded=false;
knightImage.onload=()=>{knightLoaded=true};
knightImage.onerror=()=>log('Chybí assets/rytir.png. Rozbal celý balíček hry.','sys');
knightImage.src='assets/rytir.png';
const knightFrames={idle:{r:[365,45,230,440],foot:[500,477],h:44},walk:{r:[925,65,300,420],foot:[1080,475],h:43},throw:{r:[285,590,385,400],foot:[450,980],h:40},attack:{r:[900,508,350,485],foot:[1080,980],h:49}};
const heroPlacement={clearing:{x:235,y:164,height:62},mill:{x:260,y:166,height:96},bridge:{x:47,y:151,height:62},tower:{x:292,y:166,height:78},crypt:{x:157,y:165,height:82},observatory:{x:240,y:166,height:86},cave:{x:263,y:166,height:64}};
// Polohy jsou ručně určené v každé malované scéně. Hrdina nevstupuje na sráz.
const approachSpots={
 clearing:{raven:{x:330,y:166},sign:{x:343,y:166}},
 mill:{table:{x:409,y:168},millDoor:{x:304,y:164},wheel:{x:155,y:167}},
 bridge:{pillar:{x:83,y:154},bridge:{x:85,y:154},chasm:{x:84,y:154}},
 tower:{door:{x:355,y:166},sun:{x:235,y:167},stairs:{x:160,y:166}},
 crypt:{tomb:{x:188,y:165}},
 observatory:{scope:{x:319,y:170},table:{x:410,y:170},book:{x:402,y:170}},
 cave:{ice:{x:225,y:169},wizard:{x:224,y:169}}
};
function player(x,y,t,pose='idle'){
if(!knightLoaded)return;
const moving=t-walkStart<850&&walkStart>0;
const key=pose==='throw'?'throw':pose==='attack'?'attack':moving&&Math.floor((t-walkStart)/170)%2?'walk':'idle';
const f0=knightFrames[key],r=f0.r,k=f0.h/r[3];
ctx.save();ctx.globalAlpha=1;
const size=heroPlacement[state.room].height/44;ctx.translate(x,y);ctx.scale(size,size);x=0;y=0;
ctx.fillStyle='rgba(15,24,42,.35)';ctx.beginPath();ctx.ellipse(x,y,9,2.2,0,0,Math.PI*2);ctx.fill();
ctx.imageSmoothingEnabled=false;
ctx.drawImage(knightImage,...r,x-(f0.foot[0]-r[0])*k,y-(f0.foot[1]-r[1])*k,r[2]*k,r[3]*k);
// Small warm lamp remains separate so lighting follows the saved game state.
if(f().lit&&key==='idle'){
const lx=x-5,ly=y-25;ctx.fillStyle='rgba(250,191,87,.18)';ctx.beginPath();ctx.arc(lx,ly,5,0,Math.PI*2);ctx.fill();
box(lx-1,ly-2,3,5,'#795a35');box(lx,ly-1,1,3,'#ffd99a');}
ctx.restore();}
function raven(x,y,t){
// Pointed beak, pale eye, layered blue-black wing and two clawed feet.
const age=t-ravenEmote.start,responding=age>=0&&age<1100;
if(responding){
 if(ravenEmote.kind==='hurt')y-=Math.round(3*Math.sin(Math.min(1,age/450)*Math.PI*.7));
 else if(ravenEmote.kind==='thanks')y+=Math.round(Math.sin(age/150)*1.4);
 else y-=Math.round(Math.abs(Math.sin(age/180)));
}
const blink=Math.floor(t/170)%31===0;
const bird=[
'............HHHHK......',
'...........HBBBBBK.....',
'..........HBBHBWBKK....',
'..........KBBBBBBKAAKK.',
'.........KBBBBBBKAAAAAK',
'.......KKBBBDDDDKKKKK..',
'.....HHBBBBBDDDK.......',
'....KBBHHBBBBDDK.......',
'...HBBHBBBBBDDDK.......',
'..KBBHBBBBBDDDK........',
'.KBBBDBBBBDDDK.........',
'KBBBDDBBBDDKK..........',
'KKKKKDDDKKK............',
'.....KKKKK.............',
'......AK.AK............',
'.....AAKAAAK...........'];
sprite(blink?bird.map(r=>r.replace('W','B')):bird,x,y);
if((responding&&['hello','recognize','hurt'].includes(ravenEmote.kind))||Math.floor(t/600)%9===0){pixline(x+5,y+9,x-1,y+3,'B');pixline(x+4,y+10,x-2,y+5,'H');}
}
function wizard(x,y,t,shrink=1){
// Věrná VGA reimaginace čtyřokého čaroděje z filmu Velký. Kreslený sprite
// je ukotvený tělem na sloupu; při porážce se dál postupně smršťuje.
const item=paintedProps.wizard;if(!item?.ready)return;
ctx.save();ctx.translate(Math.round(x),Math.round(y));
if(shrink!==1)ctx.scale(1,shrink);
ctx.drawImage(item.image,-41,-68,64,68);
ctx.restore();}
// Samostatné vločky s různými hloubkami, rychlostmi, směrem a fází poryvů.
function fractional(x){return x-Math.floor(x)}
const flakes=Array.from({length:92},(_,i)=>{
 const rnd=n=>fractional(Math.sin(i*97.23+n*51.17)*43828.3467);
 return {x:rnd(1)*510,y:rnd(2)*202,speed:6+rnd(3)*15,wind:-7+rnd(4)*14,
 phase:rnd(5)*Math.PI*2,drift:2+rnd(6)*11,depth:rnd(7),size:rnd(8)>.85?2:1};
});
function drawSnow(t){
 if(!['clearing','mill','bridge','tower'].includes(state.room))return;
 const sec=t/1000;
 for(const p of flakes){
  const x=((p.x+sec*p.wind+Math.sin(sec*(.5+p.depth)+p.phase)*p.drift+5200)%510)-15;
  const y=((p.y+sec*p.speed)%202)-11;
  ctx.globalAlpha=.24+.55*p.depth;box(x,y,p.size,p.size,p.depth>.52?'W':'C');
 }
 ctx.globalAlpha=1;
}
// Pohled skutečným dalekohledem; při vyjmuté čočce se optika rozostří.
function drawScopeView(t){
 const focused=!f().lensTaken&&!has('lens'),cx=240,cy=88;
 ctx.save();ctx.fillStyle='#02030a';ctx.fillRect(0,0,480,180);
 ctx.beginPath();ctx.ellipse(cx,cy,207,79,0,0,Math.PI*2);ctx.clip();
 if(scopePaintingReady){
  ctx.save();
  // Rozmazání optiky musí odpovídat skutečně vyjmuté přední čočce.
  if(!focused)ctx.filter='blur(10px) brightness(0.45)';
  ctx.drawImage(scopePainting,0,174,scopePainting.width,660,24,4,432,170);
  ctx.restore();
 }else{
  const sky=ctx.createLinearGradient(0,0,0,170);
  sky.addColorStop(0,'#01071f');sky.addColorStop(.53,'#13224d');sky.addColorStop(1,'#602459');
  ctx.fillStyle=sky;ctx.fillRect(20,5,440,171);
 }
 if(focused){
  if(!scopePaintingReady){
   for(let i=0;i<102;i++){const x=22+fractional(Math.sin(i*72.17)*12453)*435,y=5+fractional(Math.sin(i*13.43)*8321)*128;
    const a=.28+.64*(.5+.5*Math.sin(t/550+i*1.3));ctx.fillStyle='rgba(201,237,255,'+a.toFixed(3)+')';ctx.fillRect(Math.round(x),Math.round(y),i%13===0?2:1,i%17===0?2:1);}
   const glow=ctx.createRadialGradient(319,103,4,319,103,71);glow.addColorStop(0,'#63dafa99');glow.addColorStop(.36,'#2766e955');glow.addColorStop(1,'#2b2e8a00');ctx.fillStyle=glow;ctx.fillRect(230,25,180,135);
   ctx.fillStyle='#071324';ctx.beginPath();ctx.moveTo(0,164);for(let i=0;i<=24;i++){const x=i*22-18,y=133-Math.abs(Math.sin(i*2.31)*45)-Math.sin(i*.75)*10;ctx.lineTo(x,y);}ctx.lineTo(480,180);ctx.lineTo(0,180);ctx.closePath();ctx.fill();
  }
  ctx.strokeStyle='#e0d1a66b';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(cx-147,cy);ctx.lineTo(cx-16,cy);ctx.moveTo(cx+16,cy);ctx.lineTo(cx+147,cy);ctx.moveTo(cx,cy-65);ctx.lineTo(cx,cy-11);ctx.moveTo(cx,cy+11);ctx.lineTo(cx,cy+65);ctx.stroke();
 }else{
  const haze=ctx.createRadialGradient(245,80,1,245,80,130);haze.addColorStop(0,'#99b1e368');haze.addColorStop(1,'#070c2400');ctx.fillStyle=haze;ctx.fillRect(55,0,370,180);
  if(!scopePaintingReady)for(let i=0;i<19;i++){const x=40+fractional(Math.sin(i*33.11)*9341)*400,y=24+fractional(Math.sin(i*41.9)*12245)*110;ctx.fillStyle='#8a9dc72b';ctx.beginPath();ctx.arc(x,y,3+i%3,0,Math.PI*2);ctx.fill();}
 }
 ctx.restore();
 ctx.save();ctx.strokeStyle='#120b1c';ctx.lineWidth=19;ctx.beginPath();ctx.ellipse(cx,cy,215,85,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#7a5476';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(cx,cy,208,80,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#d7b8b0';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,211,82,0,Math.PI*.15,Math.PI*.79);ctx.stroke();
 ctx.restore();
}
// Stejné rozlišení 480×180 jako ostatní VGA scény; stránka se nevynoří
// přes celou obrazovku. Text příběhu zůstává v konzoli pod herním obrazem.
function drawJournalView(){
 ctx.save();
 ctx.fillStyle='rgba(9,6,17,.86)';ctx.fillRect(0,0,480,180);
 // Hřbet otevřeného zápisníku, který drží papírový list před hráčem.
 ctx.fillStyle='#1a1427';ctx.fillRect(100,3,280,174);
 ctx.fillStyle='#5f4153';ctx.fillRect(104,5,272,170);
 ctx.fillStyle='#342338';ctx.fillRect(109,7,260,166);
 ctx.fillStyle='#b8956c';ctx.fillRect(114,8,252,164);
 if(journalPixels){
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(journalPixels,0,0,128,85,116,9,248,162);
 }else if(journalPaintingReady){
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(journalPainting,0,0,1536,1024,116,9,248,162);
 }
 ctx.fillStyle='#453043';ctx.fillRect(112,8,3,164);
 ctx.fillStyle='#795660';ctx.fillRect(115,8,1,164);
 ctx.restore();
}
// Zamčená věž musí mít skutečně dovřené křídlo. Původní kresba obsahovala
// pootevřené dveře, takže je pouze uvnitř kamenného oblouku doplní malba
// z téhož omezeného fialového/dřevěného VGA tónování. Ostatní pixely se nemění.
function drawLockedTowerDoor(){
 ctx.save();
 ctx.beginPath();ctx.moveTo(338,107);ctx.lineTo(338,58);
 ctx.quadraticCurveTo(338,43,352,42);ctx.quadraticCurveTo(367,43,368,59);
 ctx.lineTo(368,107);ctx.closePath();ctx.clip();
 ctx.fillStyle='#190f24';ctx.fillRect(337,41,32,67);
 ctx.fillStyle='#3d1a44';ctx.fillRect(340,47,27,61);
 for(let x=342;x<368;x+=5){
  ctx.fillStyle=x%2?'#51234c':'#5c2c5b';ctx.fillRect(x,45,4,63);
  ctx.fillStyle='#24132b';ctx.fillRect(x+3,45,1,63);
  ctx.fillStyle='#7a4070';ctx.fillRect(x,49,1,51);
 }
 // Dvě letité železné výztuhy a skutečný sluneční zámek.
 for(const y of [69,92]){
  ctx.fillStyle='#161725';ctx.fillRect(340,y,28,4);
  ctx.fillStyle='#657080';ctx.fillRect(341,y,25,1);
  ctx.fillStyle='#2c3342';ctx.fillRect(341,y+2,25,1);
  for(const x of [345,361]){ctx.fillStyle='#a3a9aa';ctx.fillRect(x,y+1,1,1);}
 }
 ctx.fillStyle='#392321';ctx.fillRect(359,78,6,10);
 ctx.fillStyle='#a77c40';ctx.fillRect(360,79,4,7);
 ctx.fillStyle='#dfb76c';ctx.fillRect(361,80,2,4);
 ctx.fillStyle='#34232c';ctx.fillRect(361,83,2,3);
 ctx.restore();
}
// Otevřené víko je rigidní kopie horní kamenné desky Z PŮVODNÍ MALBY.
// Celé tělo sarkofágu se nepřekresluje, proto se při přechodu mezi stavy
// nemohou posunout reliéfy, římsa, nohy ani kameny v pozadí.
function drawOpenSarcophagus(){
 ctx.save();
 ctx.beginPath();ctx.moveTo(215,70);ctx.lineTo(310,62);ctx.lineTo(350,69);
 ctx.lineTo(350,78);ctx.lineTo(314,83);ctx.lineTo(215,78);ctx.closePath();
 ctx.fillStyle='#070811';ctx.fill();
 ctx.strokeStyle='#273649';ctx.lineWidth=2;ctx.stroke();
 ctx.strokeStyle='#829aa9';ctx.lineWidth=1;
 ctx.beginPath();ctx.moveTo(215,78);ctx.lineTo(314,83);ctx.lineTo(350,78);ctx.stroke();
 // Celý pevný kamenný plát odjíždí k zadní hraně, nikde se nekroutí.
 ctx.translate(-8,-9);
 ctx.beginPath();ctx.moveTo(210,65);ctx.lineTo(310,58);ctx.lineTo(356,65);
 ctx.lineTo(356,74);ctx.lineTo(315,70);ctx.lineTo(210,77);ctx.closePath();ctx.clip();
 ctx.drawImage(atlas,0,2*(atlas.height/4),atlas.width/2,atlas.height/4,0,0,480,180);
 ctx.restore();
 if(!f().keyTaken){
  // Malý mosazný klíč v otevřené, stále stinné dutině.
  ctx.strokeStyle='#e3b65d';ctx.lineWidth=2;ctx.beginPath();
  ctx.arc(311,75,3,0,Math.PI*2);ctx.moveTo(308,75);ctx.lineTo(298,73);
  ctx.moveTo(301,73);ctx.lineTo(301,77);ctx.moveTo(304,74);ctx.lineTo(304,77);ctx.stroke();
  ctx.fillStyle='#fff1a3';ctx.fillRect(310,74,1,1);
 }
}
// V kryptě zůstaly na stěnách pouze studené držáky. Změna stavu lucerny
// rozsvítí pouze světlo u hráče, nikoli cizí pochodně.
function drawCryptLighting(source,col,row,sw,sh){
 ctx.save();
 // Zakrytí původně namalovaných plamenů místní kamennou texturou.
 for(const [toX,toY,w,h,fromX]of [[39,35,19,52,59],[171,37,18,51,151],[412,33,18,54,437]]){
  ctx.drawImage(source,col*sw+fromX*sw/480,row*sh+toY*sh/180,w*sw/480,h*sh/180,toX,toY,w,h);
 }
 const lit=Boolean(f().lit&&has('lamp'));
 const shade=ctx.createRadialGradient(155,116,lit?14:3,155,116,lit?225:175);
 if(lit){shade.addColorStop(0,'rgba(4,8,19,.15)');shade.addColorStop(.45,'rgba(4,8,19,.48)');shade.addColorStop(1,'rgba(3,5,11,.78)');}
 else{shade.addColorStop(0,'rgba(2,4,9,.73)');shade.addColorStop(1,'rgba(1,3,7,.91)');}
 ctx.fillStyle=shade;ctx.fillRect(0,0,480,180);
 if(lit){
  const lamp=ctx.createRadialGradient(155,117,1,155,117,155);
  lamp.addColorStop(0,'rgba(255,196,108,.22)');lamp.addColorStop(.34,'rgba(255,166,75,.10)');lamp.addColorStop(1,'rgba(255,166,75,0)');
  ctx.fillStyle=lamp;ctx.fillRect(0,0,330,180);
 }
 ctx.restore();
}
function draw(t){
 ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,480,180);box(0,0,480,180,'K');
 if(!loaded)return;
 const e=effect?(t-effect.start)/1000:99;
 let art=rooms[state.room].art;
 if(state.room==='cave'&&state.won&&e>2.1)art=7;
 const col=art%2,row=Math.floor(art/2),sw=atlas.width/2,sh=atlas.height/4,cave=state.room==='cave';
 let source=atlas;
 if(state.room==='mill'&&cleanMillLoaded)ctx.drawImage(cleanMill,0,0,480,180);
 else{
  let variant=null;
  // V kryptě je základem vždy nedotčená původní kresba.
  if(state.room==='tower'&&!f().door)variant='towerClosed';
  if(state.room==='bridge'&&f().bridge)variant='bridgeRope';
  if(state.room==='crypt'&&f().tomb)variant=f().keyTaken?'cryptEmpty':'cryptKey';
  source=variant&&sceneVariants[variant]?.ready?sceneVariants[variant].image:atlas;
  ctx.drawImage(source,col*sw,row*sh,sw,sh,0,0,480,180);
 }
if(state.room==='tower'&&!f().door)drawLockedTowerDoor();
if(state.room==='crypt'&&f().tomb&&!sceneVariants[f().keyTaken?'cryptEmpty':'cryptKey']?.ready)drawOpenSarcophagus();
if(state.room==='crypt')drawCryptLighting(source,col,row,sw,sh);
if(cave){if(!state.won||e<2.1)wizard(108,80,t,state.won&&e>1?Math.max(.02,1-(e-1)/1.1):1)}
// Stateful props are drawn over the painted scenery.
// Most, dveře a sarkofág jsou celkové malované stavy scén.
worldProps(t);
if(state.room==='tower'&&f().charged&&!f().podTaken){box(206,93,4,6,'G');box(207,94,2,3,Math.floor(t/160)%2?'W':'M')}
const placement=heroPlacement[state.room],spot=approachSpots[state.room]?.[state.spot]||placement;
let pos=[spot.x,spot.y];let px=pos[0];if(t-walkStart<850&&walkStart>0)px-=Math.round((1-(t-walkStart)/850)*22);
const pose=effect&&e<.85&&['win','attack','rope'].includes(effect.type)?(effect.type==='attack'?'attack':'throw'):'idle';
player(px,pos[1],t,pose);
if(state.room==='clearing'){
 const b=ravenMemory(),close=b.proximity>=2&&state.spot==='raven';
 raven(close?356:382,close?102:46,t);
 // Při natažení ruky je gesto vidět i na VGA scéně.
 if(close&&b.handExtended){
  pixline(341,125,355,112,'K');pixline(342,124,356,111,'S');
  box(355,110,6,3,'S');box(359,108,2,3,'S');
 }
}
// V kryptě hoří pouze hráčova lucerna, dokud ji skutečně drží.
if(effect){if(effect.type==='win'&&cave){if(e<1){let u=Math.min(1,e);box(250-145*u,126-46*u-Math.sin(u*Math.PI)*40,4,4,'G')}else if(e<2){for(let i=0;i<25;i++){let a=i*2.4;box(108+Math.cos(a)*(e-1)*80,80+Math.sin(a)*(e-1)*45,3,3,i%2?'C':'W')}}}if(effect.type==='bolt'&&cave&&e<.7){for(let i=0;i<7;i++)pixline(82+i*25,29+i*17+(i%2?5:0),107+i*25,46+i*17+(i%2?-5:0),'C')}if(effect.type==='charge'&&e<1.4){for(let i=0;i<9;i++)box(205+Math.sin(i*2+t/140)*12,95+Math.cos(i+t/120)*9,1,1,'W')}}
// Ledové vězení má vlastní lomené stěny. Přes hráče už nevzniká hranatý glitchnutý překryv.
if(state.lost&&cave){
 const hh=placement.height+7,ww=Math.round(hh*.66),top=pos[1]-hh-6,bottom=pos[1]+4,left=px-ww/2,right=px+ww/2;
 ctx.save();
 ctx.fillStyle='#63caff49';ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(right+5,top+12);ctx.lineTo(right,bottom-9);ctx.lineTo(px+6,bottom);ctx.lineTo(left-5,bottom-7);ctx.lineTo(left-8,top+12);ctx.closePath();ctx.fill();
 ctx.fillStyle='#b8faff35';ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(px+5,bottom);ctx.lineTo(left-5,bottom-7);ctx.lineTo(left-8,top+12);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#9cf3fa9e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(right+5,top+12);ctx.lineTo(right,bottom-9);ctx.lineTo(px+6,bottom);ctx.moveTo(px,top);ctx.lineTo(left-8,top+12);ctx.lineTo(left-5,bottom-7);ctx.moveTo(px,top);ctx.lineTo(px+5,bottom);ctx.stroke();
 ctx.strokeStyle='#f5ffffb8';ctx.beginPath();ctx.moveTo(left+1,top+16);ctx.lineTo(left+5,bottom-18);ctx.moveTo(right-3,top+19);ctx.lineTo(right-6,bottom-15);ctx.stroke();
 ctx.restore();
}
drawSnow(t);
if(scopeView&&state.room==='observatory')drawScopeView(t);
if(journalView&&state.room==='observatory')drawJournalView();
}

function applyCRT(){let monitor=$('monitor');monitor.classList.toggle('crt',crtEnabled);monitor.style.setProperty('--crt',String(Number($('strength').value)/100));$('crt').textContent=crtEnabled?'CRT: ZAPNUT':'CRT: VYPNUT';$('crt').setAttribute('aria-pressed',String(crtEnabled));try{localStorage.setItem('lastlight-crt',JSON.stringify({enabled:crtEnabled,strength:Number($('strength').value)}))}catch(e){}}
$('form').onsubmit=e=>{e.preventDefault();let raw=$('command').value;$('command').value='';command(raw);$('command').focus()};$('command').onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.max(0,Math.min(history.length,historyIndex+(e.key==='ArrowUp'?-1:1)));$('command').value=history[historyIndex]||''}};document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>command(b.dataset.cmd));$('close').onclick=()=>$('dialog').close();$('crt').onclick=()=>{crtEnabled=!crtEnabled;applyCRT()};$('strength').oninput=applyCRT;$('save').onclick=saveFile;$('load').onclick=()=>$('file').click();$('full').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.().catch(()=>log('Celá obrazovka není dostupná.'))};
$('file').onchange=async e=>{let file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error();let d=JSON.parse(await file.text());if(d.game!=='last-light-v04'||!valid(d.state))throw Error();undo.push(JSON.parse(JSON.stringify(state)));state=upgradeState(d.state);pending=null;effect=null;scopeView=false;log('Uložená hra načtena.','good');describe();sync()}catch(err){log('Soubor není platná uložená hra této série. Aktuální hra zůstává beze změny.')}e.target.value=''};
try{let s=JSON.parse(localStorage.getItem('lastlight-v04'));if(valid(s)){state=upgradeState(s);log('Pokračuješ v rozehrané hře. Nový začátek: „restart“.','sys')}let crt=JSON.parse(localStorage.getItem('lastlight-crt'));if(crt&&typeof crt.enabled==='boolean'){crtEnabled=crt.enabled;$('strength').value=String(Math.max(0,Math.min(100,crt.strength||45)))}}catch(e){}
log('Po letech sílícího chladu sevřel údolí další mráz. Hvězdář zmizel a jeho věž zůstala zamčená. Někde v hoře čeká odpověď.','good');describe();sync();applyCRT();$('startup').hidden=true;function frame(t){draw(t);requestAnimationFrame(frame)}requestAnimationFrame(frame);setTimeout(maybeRavenAside,19000);
// Při startu na PC je kurzor opravdu ve vstupním řádku; na dotykovém
// zařízení neotevíráme klávesnici bez požadavku hráče.
if(typeof window!=='undefined'&&window.matchMedia?.('(pointer: fine)').matches)
 setTimeout(()=>$('command').focus(),0);
})();
