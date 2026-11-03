const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
require('../semantika_v11821.js');
const api=globalThis.adventureSemantics11821;
let checked=0;
function caseFor(room,kind,phrases,extra={}){
  for(const phrase of phrases){
    const context={room,won:room==='clearing',dialogue:{speaker:'raven',room:'clearing',topic:'starMemory'},diaryReads:3,ledgeInspected:true,...extra};
    const result=api.detect(phrase,context);
    assert.equal(result?.kind,kind,`${room} / ${phrase} -> ${result?.kind}`);
    checked++;
  }
}
function topic(topic,phrases,extra={}){
  for(const phrase of phrases){
    const result=api.detect(phrase,{room:'clearing',won:true,dialogue:{speaker:'raven',room:'clearing',topic:'starMemory'},...extra});
    assert.equal(result?.topic,topic,`${phrase} -> ${result?.kind}/${result?.topic}`);
    checked++;
  }
}

caseFor('cave','survey',[
  'prozkoumat místnost','prozkoumat','rozhlédnout se','prozkoumat jeskyni',
  'prohlédni si místnost','rozhlédni se','porozhlédnout se','prozkoumej okolí',
  'obhlídni prostor','rozhlídnout se','prozkoumat celé okolí'
],{won:false});
caseFor('cave','wizardOpen',[
  'mluvit na černokněžníka','mluvit na čaroděje','promluvit s kouzelníkem',
  'oslov čaroděje','zeptat se čaroděje','povídat si s černokněžníkem',
  'Čaroději, chci s tebou mluvit','Černokněžníku, řekni mi něco',
  'promluv s mágem','pozdravit kouzelníka'
],{won:false});
caseFor('mill','millKnock',[
  'zatlouct na dveře','bušit na dveře','zaklepat na dveře','ťuknout na dveře',
  'zabouchat na vrata','klepat na dvere','zatlouct na vrata',
  'zabouchat pěsti na dveře','klepni na dveře','zaklepu na vrata'
]);
caseFor('mill','millBatter',[
  'vyrazit dveře','vykopnout dveře','kopnout do dveří',
  'rozrazit vrata ramenem','rozbít vrata mečem','prorazit dvere',
  'rozběhnout se a narazit do dveří','bouchat do dveří',
  'rozmlátit vrata','vrazit do dveří'
]);
caseFor('clearing','millTravel',[
  'jít k mlejnu','jít do mlejna','jdi k mlejnu','vyrazit k mlejnu',
  'půjdu k mlejnu','chci jít k mlejnu','běž do mlejna',
  'dojít k mlejnu','kráčej k mlejnu'
]);
caseFor('bridge','bridgePry',[
  'uvolnit to mečem','dostat lesklý předmět mečem','použít meč na předmět',
  'vypáčit sponu mečem','vyprostit ten předmět ostřím',
  'podsunout čepel pod sponu','vyjmout to mečem',
  'odklínit sponu mečem','podebrat to mečem',
  'vydloubnout lesklý předmět mečem','vysunout to mečem',
  'vyzvednout předmět čepelí','pohnout tou sponou mečem',
  'vystrčit to ostřím','uvolnit sponu pomocí meče',
  'seknout mečem do spony','dostat to ven mečem'
]);
caseFor('bridge','bridgeHands',[
  'uvolnit to','uvolnit sponu','vytáhnout ten předmět',
  'vypáčit sponu','vydloubnout to'
]);
caseFor('cave','stalactite',[
  'použít meč na krápník','urazit krápník mečem',
  'useknout krápník','rozbít ledový krápník mečem',
  'odlomit krápník','seknout do krápníku',
  'srazit krápník mečem','rozsekat krápníky'
],{won:false});
caseFor('observatory','journal',[
  'číst','čti','číst dál','čti dál','přečti další stránku',
  'otočit list','další stránka','pokračuj','listuj',
  'prolistovat zápisník','dočíst','číst deník',
  'co je na další straně','přečti deník'
]);

topic('starMemory',[
  'hvězdář?','kdo je hvězdář?','kdo to byl?',
  'povídej o hvězdáři','jaký byl?','co měl rád?'
]);
topic('deathTruth',[
  'už není?','už nežije?','hvězdář je mrtvý?',
  'hvězdář zemřel?','žije hvězdář?','minulý čas?',
  'proč byl?','on už není?','proc rikas byl?'
]);
topic('deathCause',[
  'co se stalo hvězdáři?','co se mu stalo?',
  'stalo se mu něco zlého?','jak zemřel hvězdář?',
  'proč hvězdář zemřel?'
]);
topic('killer',[
  'ublížil mu někdo?','zabil ho někdo?',
  'zabil někdo hvězdáře?','víš kdo ho zabil?',
  'kdo za to může?','byla to vražda?',
  'myslíš, že ho zabil čaroděj?'
]);
topic('knewDeath',[
  'víš, že je hvězdář mrtvý?','takže to víš',
  'ty jsi o tom věděl?','jak to víš?'
]);
topic('future',[
  'co bude teď?','co se teď stane?',
  'co teď budeme dělat?','co bude potom?',
  'jak to bude dál?','a co teď?','co bude s námi?'
]);
topic('departure',[
  'poletíš teď pryč?','poletíš teDˇpryč?',
  'odletíš?', 'zůstaneš tady?', 'odejdeš pryč?'
]);
topic('together',[
  'půjdeš se mnou?','poletíš se mnou?',
  'budeme se vídat?','uvidíme se ještě?',
  'můžu tě navštěvovat?','vrátím se za tebou'
]);
topic('purpose',[
  'co děláš?','co tu děláš?','co teď děláš?',
  'jaké je tvé poslání?','co máš na práci?'
]);
topic('opening',[
  'havrane chci si povídat','povídat si','mluvit s havranem',
  'můžeme si povídat?','chci s tebou mluvit'
]);
topic('praise',['jsi moudrý','jsi chytrý','ty jsi hodný']);
topic('food',['jak se krmíš?','máš hlad?','co jíš?']);
topic('grief',[
  'jsi smutný?','máš vůbec srdce?','stýská se ti po něm?',
  'trápí tě to?','bojíš se, že na něj zapomeneš?'
],{griefThread:{active:true,depth:3,transitions:1}});

for(const phrase of ['kudy k mlýnu?','mám jít k mlýnu?']){
  const s=api.detect(phrase,{room:'clearing',won:false});
  assert.notEqual(s?.kind,'millTravel',`dotaz nesmí provést pohyb: ${phrase}`);checked++;
}
for(const phrase of ['zabiju hvězdáře','použij meč na čaroděje']){
  const s=api.detect(phrase,{room:'cave',won:false});
  assert.notEqual(s?.kind,'ravenTalk',`nelokální dialog: ${phrase}`);checked++;
}
for(const [topicName,count] of [['future',7],['departure',6],['killer',5],['deathTruth',5],['purpose',6],['opening',6],['together',6]]){
  const mem={trust:0};const replies=Array.from({length:count},()=>api.ravenReply(topicName,mem,{after:true}).text);
  assert.equal(new Set(replies).size,count,`bez cyklu/repliky navíc: ${topicName}`);
  assert.ok(replies.every(s=>s.length>45&&s.length<350),`dialogová délka ${topicName}`);
  checked+=count;
}
const flags={};
assert.match(api.millKnock(flags,'hard'),/zabušíš|Zabušíš/);
assert.equal(flags.millKnocks,1);
assert.equal(new Set(Array.from({length:3},()=>api.millBatter(flags,'sword'))).size,3);
assert.equal(new Set(Array.from({length:3},()=>api.stalactite(flags,true))).size,3);
assert.equal(flags.stalactiteAttempts,3);
checked+=10;

const deepMemory={trust:4};
const mourningReplies=Array.from({length:13},()=>api.ravenReply('grief',deepMemory,{after:true}).text);
assert.equal(new Set(mourningReplies).size,13,'13 různých osobních, citlivých vět');
assert.ok(mourningReplies.some(s=>s.includes('Černá mám pera')&&s.includes('Ne srdce')),'černá pera nejsou černé srdce');
assert.ok(mourningReplies.some(s=>s.includes('Ty jsi někdy přišel')),'havran umí položit hráči osobní otázku');
checked+=13;
const transitionMemory={trust:5};
api.ravenReply('deathTruth',transitionMemory,{after:true});
const sensitive=[
  api.ravenReply('future',transitionMemory,{after:true}).text,
  api.ravenReply('departure',transitionMemory,{after:true}).text,
  api.ravenReply('opening',transitionMemory,{after:true}).text
];
assert.ok(sensitive.every(s=>!(/brýle|hostin|legrac|pobaven|vtip|špatné poznámky|malý výlet|to by bylo dobrodružství/i.test(s))),
  'po bolesti nenásleduje nevysvětlený žert');
assert.equal(transitionMemory.griefThread.active,true,'citový kontext drží alespoň tři navazující odpovědi');
checked+=3;

const html=fs.readFileSync(path.join(__dirname,'../HRA.html'),'utf8');
const source=fs.readFileSync(path.join(__dirname,'../hra.js'),'utf8');
assert.ok(html.includes('semantika_v11821.js?v=0.11.8.24'),'načtení modulu');
assert.ok(source.includes("if(p.intent==='semantic11821')"),'napojení odpovědí');
assert.ok(source.includes("if(semantic.kind==='bridgePry')"),'meč v reálné herní mechanice');
assert.doesNotMatch(source,/dostat\|presunout se\|presun se/,'sloveso dostat věc není přesun');
console.log(`OK: ${checked} případů výroků, fyziky a kontextu + integrace`);
