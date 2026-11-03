const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({console,Set,Map,Object,Array,JSON,String});
for(const source of ['prostor_v117.js','zivy_svet_v11824.js','denik_rozhovoru_v11824.js'])
  vm.runInContext(fs.readFileSync(path.join(root,source),'utf8'),context,{filename:source});
const world=context.adventureWorld117,living=context.adventureLivingWorld11824;
const dialogue=context.adventureDialogueDiary11824;

let checks=0;
const objects=world.listObjects(),profiles=Object.keys(living.catalog);
assert.equal(objects.length,54,'všech 54 rekvizit je v katalogu');
assert.deepEqual([...objects].sort(),[...profiles].sort(),'každá popsaná kulisa má fyzikální profil');
checks+=54;

// Každý objekt lze skutečně oslovit aspoň jedním přirozeným pojmenováním.
for(const o of world.listDescriptors()){
  const alias=o.aliases.find(a=>/^[a-z ]+$/.test(a))||o.aliases[0];
  const parsed=world.resolve('ocistit '+alias,o.room,{});
  assert.equal(parsed?.id,o.id,o.room+':'+o.id+' ('+alias+')');
  assert.equal(parsed.intent,'clean');
  const response=world.react(parsed,{},true);
  assert.equal(typeof response,'string');
  assert.ok(response.length>10);
  checks+=4;
}

// Obecný systém nesmí vracet prázdno ani odpovědi neodpovídající materiálu.
for(const key of profiles){
  const [room,id]=key.split(':'),flags={};
  for(const intent of ['inspect','touch','smell','listen','knock','shake',
    'kick','break','clean','push','pull','open','close','take','dig','burn','repair']){
    const hit={room,id,intent},reply=living.generic(hit,flags);
    assert.equal(typeof reply,'string',key+':'+intent);
    assert.ok(reply.length>15,key+':'+intent);
    assert.doesNotMatch(reply,/undefined|\[object Object\]/,key+':'+intent);
    living.observe(hit,flags);
    checks++;
  }
}

const flags={};
const bench={room:'clearing',id:'lavice',intent:'clean'};
assert.match(world.react(bench,flags,true),/lavici|rýhy/i);
living.observe(bench,flags);
assert.equal(flags.worldDetails['clearing:lavice'].cleaned,true);
assert.match(living.sceneEcho('clearing',flags),/lavici.*očištění/);
assert.equal(living.sceneEcho('mill',flags),'');
assert.match(living.memory({...bench,intent:'inspect'},flags),/očistil/);
const saved=JSON.parse(JSON.stringify(flags));
assert.match(living.sceneEcho('clearing',saved),/očištění/);
checks+=5;

for(const [phrase,intent] of [
  ['otevrit bednu','open'],['bednu chci otevrit','open'],
  ['kopnout do bedny','kick'],['rozmlatit bednu','break'],
  ['zavri bedynku','close'],['zatras bednou','shake'],
  ['zkusim prozkoumat bednu','inspect'],['vypacit viko bedny mecem','pull']
]){
  const hit=world.resolve(phrase,'mill',{});
  assert.equal(hit?.id,'bedynka',phrase);
  assert.equal(hit.intent,intent,phrase);
  assert.doesNotMatch(world.react(hit,{},true),/Co chceš|Co myslíš|Nerozumím/i,phrase);
  checks++;
}
assert.equal(world.resolve('vezmi podkovu','mill',{}),null,'podkova jde do reálného inventáře');
assert.equal(world.resolve('otevrit bednu','clearing',{}),null,'bedýnka není na rozcestí');
const protectedFlags={};
const box={room:'mill',id:'bedynka',intent:'break'};
world.react(box,protectedFlags,true);living.observe(box,protectedFlags);
assert.notEqual(protectedFlags.crateBroken,true,'beze zmínky meče žádný automatický úspěch');
assert.equal(protectedFlags.worldDetails['mill:bedynka'].chipped,undefined,'chráněné hádanky nepodléhají obecné destrukci');
world.react({...box,intent:'cut'},protectedFlags,true);
assert.notEqual(protectedFlags.crateBroken,true,'ani seknutí samo nepoužije meč z inventáře');
assert.equal(world.react({...box,intent:'cut',swordExplicit:true},protectedFlags,true).includes('mince'),true);
assert.equal(protectedFlags.crateBroken,true);
const tombFlags={};
world.react({room:'crypt',id:'schranka',intent:'inspect'},tombFlags,true);
world.react({room:'crypt',id:'schranka',intent:'pull'},tombFlags,true);
assert.notEqual(tombFlags.cryptChestOpen,true,'schránku nesmí otevřít nevyřčený meč');
world.react({room:'crypt',id:'schranka',intent:'pull',swordExplicit:true},tombFlags,true);
assert.equal(tombFlags.cryptChestOpen,true);
checks+=9;

const remote={room:'clearing',id:'mesic',intent:'take'};
assert.match(living.generic(remote,{}),/nedosáhneš/);
const ambient={room:'bridge',id:'ozvena',intent:'kick'};
assert.match(living.generic(ambient,{}),/Nemá pevný okraj/);
const invisible={room:'bridge',id:'krovi',intent:'cut'};
assert.match(living.generic(invisible,{}),/není/);
checks+=3;

assert.equal(dialogue.canon.raven.stargazer,'hvězdář byl jeho přítel, nikdy pán');
assert.match(dialogue.canon.raven.death,/nezná jistě/);
assert.equal(dialogue.speakerFor({intent:'caveRoleplay'},'cave'),'wizard');
const state={turn:0,room:'clearing',raven:{met:true,trust:4,returns:0,harmed:0,apologies:0},
  wizard:{exchanges:0},caveHits:0,won:false};
function talk(topic,input,reply='Havran odpoví klidným hlasem.'){
  state.turn++;
  return dialogue.track(state,{room:'clearing'},
    {intent:'ravenNatural',topic,ids:['raven']},input,[reply]);
}
assert.equal(talk('whyWaiting','proč tu čekáš'),null);
talk('name','jak se jmenuješ');
talk('hope','je naděje');
talk('home','kde bydlíš');
const already=talk('whyWaiting','proč tu pořád čekáš');
assert.match(already,/už ses|Už ses|už jsme/i);
assert.equal(state.conversationJournal.topics.raven.waiting.count,2);
assert.equal(state.conversationJournal.entries.filter(e=>e.kind==='dialogue').length,5);
assert.match(dialogue.recall(state,'raven'),/čekání na rozcestí/);
const serialized=JSON.parse(JSON.stringify(state));
assert.equal(serialized.conversationJournal.topics.raven.waiting.count,2);
serialized.raven.returns=1;
assert.match(dialogue.onReturn(serialized),/Minule jsme spolu mluvili/);
assert.equal(dialogue.onReturn(serialized),null,'bez opakování vzpomínky při jednom návratu');
checks+=11;

// Skutečný smutek a narušená důvěra mají přednost před běžnou přívětivostí.
serialized.raven.griefThread={active:true};
assert.equal(dialogue.mood(serialized,'raven'),'zarmoucený');
assert.doesNotMatch(dialogue.recall(serialized,'raven'),/zasměje|žert|vtip/i);
serialized.raven.griefThread={active:false};
serialized.raven.harmed=2;
assert.equal(dialogue.mood(serialized,'raven'),'ostražitý');
const wizard={room:'cave',turn:4,caveHits:1,wizard:{exchanges:7},raven:{},won:false};
assert.equal(dialogue.mood(wizard,'wizard'),'rozhněvaný');
assert.match(dialogue.recall(wizard,'wizard'),/neměli jsme spolu žádný rozhovor/i);
checks+=5;

const html=fs.readFileSync(path.join(root,'HRA.html'),'utf8');
const modulePos=html.indexOf('denik_rozhovoru_v11824.js?v=0.11.8.24');
assert.ok(modulePos>0&&modulePos<html.indexOf('hra.js?v=0.11.8.24'),
  'deník se načte v herní stránce před hlavním enginem');
const mainCode=fs.readFileSync(path.join(root,'hra.js'),'utf8');
assert.match(mainCode,/file\.size>3000000/,'velikost uložené hry roste s deníkem');
checks+=3;

console.log('OK: '+checks+' kontrol živého světa a skrytého deníku (54 rekvizit, stav, paměť, kánon)');
