// Skutečný herní engine běží v simulovaném DOM. Není to test pouze regulárních
// výrazů: kontrolujeme i přechody lokací, stav předmětů a uložené rozhovory.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');

function game(saved){
  const elements=new Map(), entries=new Map();
  if(saved)entries.set('lastlight-v04',JSON.stringify(saved));
  const data={};
  const element=id=>{
    if(!elements.has(id)){
      const x={id,textContent:'',innerHTML:'',value:'',scrollHeight:100,scrollTop:0,
        style:{setProperty(){}},classList:{toggle(){},add(){},remove(){},contains(){return false}},
        setAttribute(){},append(child){(this.children||=[]).push(child)},focus(){},
        getContext(){return {}},click(){},dataset:{},hidden:false};
      elements.set(id,x);
    }
    return elements.get(id);
  };
  element('strength').value='45';
  const document={getElementById:element,createElement:tag=>({tag,textContent:'',className:'',append(){},style:{},setAttribute(){}}),
    querySelectorAll:()=>[],querySelector:()=>null,documentElement:{requestFullscreen(){return Promise.resolve()}},hidden:false};
  const localStorage={getItem:key=>entries.get(key)||null,setItem:(key,value)=>entries.set(key,value)};
  const context=vm.createContext({document,window:{matchMedia:()=>({matches:false})},localStorage,
    performance:{now:()=>1800},setTimeout:()=>0,requestAnimationFrame:()=>0,
    Image:class{set src(value){this._src=value}get src(){return this._src}},
    console,Date,Math,JSON,Array,Number,Object,String,Set,Map,RegExp,Intl,
    navigator:{userAgent:'Node test'}});
  for(const source of ['jazyk.js','reakce.js','havran_dialogy.js','havran_v116.js',
    'havran_kontext_v11814.js','carodej_dialogy.js','carodej_roleplay_v11812.js',
    'prostor_v117.js','zivy_svet_v11824.js','denik_rozhovoru_v11824.js',
    'pribeh_v118.js','semantika_v11821.js','pamet_souvislosti_v11826.js',
    'pamet_mist_v11827.js','hra.js']){
    vm.runInContext(fs.readFileSync(path.join(root,source),'utf8'),context,{filename:source});
  }
  function submit(text){
    const previous=element('log').children?.length||0;
    element('command').value=text;
    element('form').onsubmit({preventDefault(){}});
    const lines=(element('log').children||[]).slice(previous).map(x=>x.textContent);
    assert.ok(lines.length,`výstup pro ${text}`);
    return lines.join('\n');
  }
  return {submit,state:()=>JSON.parse(entries.get('lastlight-v04')),data};
}

let checks=0;
let g=game();
// 0.11.8.25: testujeme přesné hráčské přepisy, ne izolovanou detekci.
const gPromise=game();
assert.match(gPromise.submit('proč tu jsi?'),/slíbil|slib/i);checks++;
const promiseRecipient=gPromise.submit('komu jsi to slíbil?');
assert.match(promiseRecipient,/hvězdáři/i,'musí rozpoznat adresáta slibu');
assert.doesNotMatch(promiseRecipient,/Jsem havran|Víc titulů|Takovou otázku/i);checks++;
assert.equal(gPromise.state().dialogue.topic,'promiseOrigin');checks++;
assert.match(gPromise.submit('a komu?'),/hvězdáři/i);checks++;
assert.ok(gPromise.state().conversationJournal.topics.raven.promise?.count>=2,
  'deník uchová otázku na příjemce slibu');checks++;
const gPromiseReload=game(gPromise.state());
assert.match(gPromiseReload.submit('komu jsi dal slovo?'),/hvězdáři/i);checks++;

// Uživatelovy přesné příklady z 0.11.8.25. Každý dotaz musí vést ke
// kronice, nikoli k obecnému „na takovou otázku bych rád znal odpověď“.
const gChronicle=game();
gChronicle.submit('proč tu jsi?');
for(const phrase of [
 'o čem jsme si spolu povídali?',
 'o čem jsme si spolu povídali posledně?',
 'o čem jsme si spolu povídali minule?',
 'o čem sjem si povídali posledně?',
 'co sme posledne kecali?',
 'pamatuješ, co jsme řešili?',
 'co jsem se tě naposledy ptal?',
 'co jsi mi naposledy odpověděl?'
]){
 const line=gChronicle.submit(phrase);
 assert.doesNotMatch(line,/Na takovou otázku|Nevím jistě|Možná se ptáš|můžeme nad ní přemýšlet|Nerozumím/i,phrase);
 assert.match(line,/slibu|slíbil|čekání|odpověděl|ptal ses|ses mě ptal|Tehdy jsem|Takhle jsem/i,phrase);checks++;
}
assert.ok(gChronicle.state().conversationJournal.topics.raven.promise?.count>=1,
 'vzpomínky musí pocházet z reálných záznamů');checks++;
const gChronicleReload=game(gChronicle.state());
assert.match(gChronicleReload.submit('o cem jsme se bavili minule?'),/slibu|slíbil|čekání/i);checks++;
// 0.11.8.27: otázka na právě popsané rozcestí nesmí jít do náhodného
// havranova dialogu. Odpověď musí být odvozená z popsaných stop.
const placeGame=game();
placeGame.submit('rozhlédnout se');
const placeReply=placeGame.submit('co se tu stalo?');
assert.match(placeReply,/lavici|patník|poutníků|stopy|lidí/i);
assert.doesNotMatch(placeReply,/Nevím jistě|Řekni mi to jinak|Na takovou otázku|moudře/i);checks++;
assert.match(placeGame.submit('co se tu odehrálo?'),/stopy|lidí|patník|lavici/i);checks++;
assert.match(placeGame.submit('a kdo tu byl?'),/Poutníci|jména/i);checks++;
assert.match(placeGame.submit('jak to víš?'),/Lavice|patník|stopy/i);checks++;
assert.match(placeGame.submit('kdy se to stalo?'),/kámen|zimy|roku/i);checks++;
assert.ok(placeGame.state().conversationJournal.entries.some(e=>e.kind==='investigation'&&e.room==='clearing'),
  'kronika si zapíše otázku i skutečnou odpověď místa');checks++;
const reloadedPlace=game(placeGame.state());
assert.match(reloadedPlace.submit('a co bylo potom?'),/odcházet|přicházet|vrátil/i);
checks++;
placeGame.submit('západ');
assert.equal(placeGame.state().room,'mill');
assert.match(placeGame.submit('co se tady přihodilo?'),/mlýn|mlýna|mlynáře/i);checks+=2;
assert.match(placeGame.submit('proč k tomu došlo?'),/kolo|odešel|důvody/i);checks++;
assert.doesNotMatch(placeGame.submit('co se stalo hvězdáři?'),/Kruhy po nádobách|mlýn býval/i,
  'otázka na osobu nesmí přepsat významovou otázku na místo');checks++;
const gEmptyChronicle=game();
assert.match(gEmptyChronicle.submit('o čem jsme se bavili?'),/Zatím jsme spolu mnoho neprobrali|neprobrali/i);
checks++;

const gTravelers=game();
const openingTravelers=gTravelers.submit('jsi tu dlouho?');
assert.match(openingTravelers,/počítám poutníky, kteří se vrátili/i);checks++;
assert.equal(gTravelers.state().dialogue.focus,'returnedTravelers');checks++;
const travelersCount=gTravelers.submit('bylo jich hodně?');
assert.match(travelersCount,/vrátili|vrátilo|poutníků|poutníci|návrat/i);
assert.doesNotMatch(travelersCount,/Na takovou otázku|můžeme nad ní přemýšlet|Nevím, ale/i);checks++;
assert.equal(gTravelers.state().dialogue.topic,'returningTravelers');checks++;
assert.match(gTravelers.submit('kdo se vrátil?'),/poutníci|poutníků|lidé/i);checks++;
assert.ok(gTravelers.state().conversationJournal.topics.raven.returningTravelers?.count>=2,
  'vzpomínka na poutníky má vlastní téma deníku');checks++;
const gTravelersReload=game(gTravelers.state());
assert.match(gTravelersReload.submit('kolik se jich vrátilo?'),/vrátili|vrátilo|poutníků|návrat/i);
checks++;
const legacyTravelers=game();
legacyTravelers.submit('jsi tu dlouho?');
const oldDialogueSave=legacyTravelers.state();
delete oldDialogueSave.dialogue.focus; // forma uložené pozice z 0.11.8.24
assert.match(game(oldDialogueSave).submit('bylo jich hodně?'),/vrátili|vrátilo|poutníků|návrat/i);
checks++;
// Při druhé variantě úvodní repliky poutníci nezazní; hra si je nesmí domyslet.
const gNoTravelers=game();
gNoTravelers.submit('jsi tu dlouho?');
const secondLong=gNoTravelers.submit('jsi tu dlouho?');
assert.doesNotMatch(secondLong,/počítám poutníky/i);
assert.notEqual(gNoTravelers.state().dialogue.focus,'returnedTravelers');checks++;
for(const phrase of ['hvězdář?','kdo je hvězdář?','už nežije?','víš, kdo ho zabil?',
  'takže to víš','co děláš?','povídat si','jsi moudrý']){
  const reply=g.submit(phrase);
  assert.doesNotMatch(reply,/Nerozumím|Co s tím chceš|Opravený příkaz/i,phrase);
  checks++;
}
let before=g.state();
assert.equal(before.room,'clearing');
g.submit('jít k mlejnu');
assert.equal(g.state().room,'mill');checks++;
const millSurvey=g.submit('porozhlédnout se tu');
assert.match(millSurvey,/Zamrzlé mlýnské kolo|pracovní stůl/i,'rozhlédnutí má vykreslit místo');
assert.doesNotMatch(millSurvey,/Na východě se vrátíš|Vrátit se můžeš na východ/i,'žádná navigační věta uprostřed popisu');checks++;
const engine=fs.readFileSync(path.join(root,'hra.js'),'utf8');
assert.match(engine,/millCrateEmpty':'millCrateBroken',382,127,34,24,\.92\)/,'všechny stavy bedýnky kreslit pod stolem');
for(const phrase of ['zatlouct na dveře','bušit na dveře','vyrazit dveře',
  'vykopnout dveře','rozrazit vrata ramenem']){
  const reply=g.submit(phrase);
  assert.doesNotMatch(reply,/Co s tím chceš|Nerozumím/i,phrase);
  assert.equal(g.state().room,'mill');checks++;
}
assert.equal(g.state().flags.millKnocks,2);
assert.equal(g.state().flags.millForceAttempts,3);

// V0.11.8.23: každý viditelný předmět musí přijímat přirozené fyzické úkony.
// Regrese ze skutečného hráčova přepisu: otevření, kopnutí a rozmlácení bedny
// nesmějí spadnout do obecné otázky na neznámý předmět.
const crateLook=g.submit('prozkoumat bednu');
assert.match(crateLook,/bedýnka|bedna|víko/i);checks++;
for(const [phrase,expected] of [
  ['otevřít bednu¨',/prsty|víko|fošnu/i],
  ['otevřít bednu',/víko|prkno|hřeby/i],
  ['kopnout do bedny',/kopneš|kopnutí/i],
  ['rozmlátit bednu',/rozbít|fošny|víko/i],
  ['otevřít bedýnku',/víko|hřeby|prkno/i],
  ['otevři ji',/víko|hřeby|prkno/i],
  ['vypáčit bednu',/víko|hřeby|prkno/i],
  ['zavřít bednu',/víko|zavřené/i],
  ['rozbít bednu',/rozbít|fošny|víko/i]
]){
  const reply=g.submit(phrase);
  assert.match(reply,expected,phrase);
  assert.doesNotMatch(reply,/Co chceš otevřít|Co myslíš výrazem|Na co chceš tuto činnost použít|Nerozumím/i,phrase);
  assert.equal(g.state().flags.crateBroken||false,false,`bez výslovného meče: ${phrase}`);
  checks++;
}
const afterCrate=g.submit('rozbít bednu mečem');
assert.match(afterCrate,/mečem|stříbrná mince/i);
assert.equal(g.state().flags.crateBroken,true);checks++;
assert.match(g.submit('prozkoumat bednu'),/mince|třískami/i);checks++;
assert.match(g.submit('vezmi minci'),/Bereš|mince/i);
assert.equal(g.state().flags.coinTaken,true);checks++;
const gPry=game();gPry.submit('západ');
gPry.submit('prozkoumat bednu');
assert.match(gPry.submit('vypáčit víko bedny mečem'),/ostří|fošnu|mince/i);
assert.equal(gPry.state().flags.crateBroken,true);checks++;

g.submit('východ');
g.submit('sever');
assert.equal(g.state().room,'bridge');checks++;
g.submit('prozkoumat okraj útesu');
const pry=g.submit('uvolnit to mečem');
assert.doesNotMatch(pry,/Zatím tu žádné lano|Na rozcestí se cesta/i);
assert.equal(g.state().room,'bridge');checks++;
// Zásah do spony se provádí existujícím world.react. Stále je potřeba
// prověřit, zda mechanika dodržela progresivní ohledání hrany útesu.
assert.ok(g.state().flags.ledgeInspected||g.state().flags.pendantRevealed);

const saved={room:'clearing',previous:'cave',spot:null,inv:['sword'],flags:{},dropped:{},turn:20,
  won:true,lost:false,lastEntity:'raven',lastWorld:null,visited:['clearing','mill','bridge','tower','crypt','observatory','cave'],
  hints:{},caveHits:0,wizard:{approaches:0,exchanges:0,topics:{}},
  raven:{met:true,trust:6,thanks:0,greetings:0,apologies:0,harmed:0,lastProgress:0,
    epilogueDone:true,helpOffered:0,helpAsked:0,promiseMade:true,lastAsideAt:0,asideCount:0,pending:null,topics:{}}};
g=game(saved);
for(const phrase of ['co bude teď?','co teď budeme dělat?','poletíš teď pryč?',
  'uvidíme se ještě?','už nemusíš čekat','víš kdo ho zabil?',
  'víš že je hvězdář mrtvý?','takže to víš']){
  const reply=g.submit(phrase);
  assert.doesNotMatch(reply,/Nerozumím|Co s tím chceš|Možná se ptáš|Takovou otázku bych rád/i,phrase);
  assert.equal(g.state().room,'clearing');checks++;
}
assert.ok(Object.keys(g.state().raven.semanticCounts).length>=4);

// Čtení téhož deníku příkazem „číst“ musí pokračovat, nikoli se ptát na věc.
let next={...saved,room:'observatory',won:false,flags:{door:true,doorUnlocked:true},diaryReads:2};
g=game(next);
let journal=g.submit('číst');
assert.match(journal,/pozdějších stránkách|pozd[eě]jších stránkách/i);
assert.equal(g.state().diaryReads,3);checks++;
g.submit('číst dál');
assert.equal(g.state().diaryReads,4);checks++;
g.submit('otočit list');
assert.equal(g.state().diaryReads,5);checks++;
assert.equal(g.state().flags.ravenDrawing,true,'kresba až po pěti skutečných čteních');

// Čaroděj nesmí považovat běžné prozkoumání jeskyně za urážku nebo zaklínadlo.
next={...saved,room:'cave',won:false,flags:{bridge:true,door:true}};
g=game(next);
const survey=g.submit('prozkoumat místnost');
assert.doesNotMatch(survey,/zaklinadlo|urazka|mne nerozum|jazyky nezn/i);checks++;
const opening=g.submit('mluvit na čaroděje');
assert.match(opening,/Čaroděj|čaroděj|Žezlo|žezlo/);checks++;
const ice=g.submit('urazit krápník mečem');
assert.match(ice,/krápník|ledu|ostří|ledovou/i);checks++;
assert.equal(g.state().flags.stalactiteAttempts,1);

// 0.11.8.24: deník skutečně ukládá rozhovory napříč dialogovými
// parsery, umí je připomenout a přežije nové spuštění ze starého save.
g=game();
for(const phrase of ['ahoj havrane','proč tu čekáš?','jak se jmenuješ?',
  'je ještě naděje?','proč tu pořád čekáš?']){
  const reply=g.submit(phrase);
  assert.doesNotMatch(reply,/Příkaz se nepodařilo|Nerozumím/i,phrase);
  checks++;
}
let talkDiary=g.state().conversationJournal;
assert.ok(talkDiary?.entries?.length>=5,'skrytý deník se zapisuje po skutečných tazích');
assert.ok(Object.keys(talkDiary.topics.raven).length>=2,'různá témata se neslévají do jednoho');
assert.ok(talkDiary.entries.some(e=>e.kind==='dialogue'&&e.mood&&e.relation),'nálada a vztah v záznamu');
checks+=3;
const remembered=g.submit('pamatuješ si o čem jsme mluvili');
assert.match(remembered,/Mluvili jsme|Pamatuji si|dosud/i);
assert.doesNotMatch(remembered,/Nerozumím|Co chceš|Na co chceš/i);
checks++;
const rememberedQuestion=g.submit('na co jsem se tě naposledy ptal');
assert.match(rememberedQuestion,/Posledně ses mě ptal|Pamatuji si tvou otázku/i);
assert.match(rememberedQuestion,/proč tu pořád čekáš/i);
checks++;
const previousJournal=g.state().conversationJournal;
g.submit('západ');
assert.equal(g.state().room,'mill');
const homecoming=g.submit('východ');
assert.equal(g.state().room,'clearing');
assert.match(homecoming,/Minule jsme spolu mluvili/i,
  'po skutečném návratu havran sám připomene starší téma');
assert.ok(g.state().conversationJournal.entries.some(e=>e.kind==='travel'),'zapsány návraty mezi místy');
checks+=4;
g=game(g.state());
assert.ok(g.state().conversationJournal.entries.length>=previousJournal.entries.length,'zápis přežil reload hry');
assert.equal(g.state().conversationJournal.version,1);checks+=2;

// Společná paměť interakcí zůstává i po odchodu z lokace.
const cleanReply=g.submit('očistit lavici');
assert.match(cleanReply,/lavici|rýhy|Ometáš/i);
assert.equal(g.state().flags.worldDetails['clearing:lavice'].cleaned,true);
g.submit('západ');
assert.match(g.submit('východ'),/očištění|lavici/i);
assert.equal(g.state().flags.worldDetails['clearing:lavice'].cleaned,true);
checks+=4;

// Kánon a emotivní kontinuita: těžké téma nepřeruší veselá glosa.
const grievingSave=g.state();
grievingSave.raven.griefThread={active:true,depth:2,transitions:0};
g=game(grievingSave);
const griefRecall=g.submit('pamatuješ si o čem jsme mluvili');
assert.match(griefRecall,/Havran|havran/i);
assert.doesNotMatch(griefRecall,/zasměje|vtip|žert|vesele/i);
checks++;
const griefFromWords=game();
griefFromWords.submit('víš kdo ho zabil?');
assert.ok(griefFromWords.state().conversationJournal.topics.raven.grief?.count>=1,
  'deník rozumí bolestnému tématu napříč významovým parserem');
checks++;

const wizardSave={...grievingSave,room:'cave',won:false,
  raven:{...grievingSave.raven,griefThread:{active:false}},wizard:{approaches:0,exchanges:0,topics:{}}};
g=game(wizardSave);
const caveScene=g.submit('co se tady odehrálo?');
assert.match(caveScene,/trpaslíků|padlá těla/i);
assert.doesNotMatch(caveScene,/Nevím jistě|Řekni mi to jinak/i);checks++;
const wizardLine=g.submit('mluvit na čaroděje');
assert.match(wizardLine,/Čaroděj|čaroděj|Žezlo|žezlo/);
assert.ok(g.state().conversationJournal.entries.some(e=>e.kind==='dialogue'&&e.speaker==='wizard'),
  'i čaroděj píše do stejného deníku, ale s vlastní historií');
const wizardGuard=g.submit('proč mi bráníš projít?');
assert.doesNotMatch(wizardGuard,/Nerozumím|Co chceš/i);checks++;
for(const phrase of [
 'o čem jsme si spolu povídali minule?',
 'o čem sjem si povídali posledně?',
 'pamatuješ, co jsme řešili?',
 'co jsem se tě posledně ptal?'
]){
 const line=g.submit(phrase);
 assert.match(line,/průchodu|střežení|bráníš|ptal ses|ses mě ptal/i,phrase);
 assert.doesNotMatch(line,/Neměli jsme spolu žádný rozhovor|Na takovou otázku/i,phrase);
 checks++;
}
const wizardReprise=g.submit('proč mi to říkáš?');
assert.doesNotMatch(wizardReprise,/Na takovou otázku|Nevím jistě|Nerozumím/i);
assert.equal(g.state().dialogue.speaker,'wizard');checks++;
assert.ok(g.state().conversationJournal.topics.wizard.guard?.count>=1,
 'čarodějova kronika uchovává jeho vlastní téma');checks++;
const gChallenge=game(wizardSave);
gChallenge.submit('dokážeš mě zastavit?');
gChallenge.submit('co je to za portál?');
gChallenge.submit('co tu hlídáš?');
const challengeFollow=gChallenge.submit('pustíš mě dál?');
assert.match(challengeFollow,/odvaha změnit hlas|dokážu zastavit/i,
 'čaroděj si naváže na skutečnou dřívější výzvu');checks++;
assert.equal(gChallenge.state().flags.charged||false,false,'rozmluva nesmí vyřešit portál');
assert.equal(gChallenge.state().room,'cave');checks+=2;
assert.equal(gChallenge.state().conversationJournal.milestones.wizardChallengeRemembered?.originalTurn,
 gChallenge.state().conversationJournal.entries.find(e=>e.kind==='dialogue'&&e.speaker==='wizard'&&e.input==='dokážeš mě zastavit?').turn);
checks++;
assert.match(gChallenge.submit('co jsi mi naposled odpověděl?'),/odvaha změnit hlas/i,
 'kronika musí obsahovat i dřívější spontánní dodatek čaroděje');checks++;
const wizardRecall=g.submit('pamatuješ si o čem jsme mluvili');
assert.match(wizardRecall,/Čaroděj|čaroděj/);
assert.doesNotMatch(wizardRecall,/rád tě vidím|kamaráde|příteli/i);
checks+=3;

for(const room of ['bridge','tower','crypt','observatory']){
 const scenario=game({...wizardSave,room,flags:{bridge:true,door:true,lit:true}});
 const answer=scenario.submit('co se tu stalo?');
 assert.doesNotMatch(answer,/Na takovou otázku|Řekni mi to jinak|Nerozumím/i,room);
 assert.ok(answer.length>95,`konkrétní příběhová odezva pro ${room}`);
 checks++;
}

console.log(`OK: ${checks} skutečných příkazů ve hře, přesuny, rekvizity a epilog`);
