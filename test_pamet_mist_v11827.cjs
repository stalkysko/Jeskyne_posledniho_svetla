const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
require('../pamet_mist_v11827.js');
const m=globalThis.adventurePlaceMemory11827;
let checks=0;
const state={room:'clearing',flags:{},lastCommandIntent:null};
for(const phrase of [
 'co se tu stalo?', 'co se tady stalo?', 'Co se zde stalo?',
 'co se tu vlastně stalo', 'co se tu asi stalo', 'co se tu kdysi stalo',
 'co se tady odehrálo?', 'co se tu přihodilo?',
 'co se stalo tady?', 'co se stalo na tomhle místě?',
 'co se na tomto místě odehrálo?', 'co se to tady stalo?',
 'víš co se tady stalo?', 'pověz mi co se tu odehrálo',
 'co se tu dřív odehrálo', 'co se na tomto místě přihodilo?',
 'jaka je historie tohoto mista?', 'proč je to tu tak opuštěné?'
]){
 assert.equal(m.detect(phrase,state)?.part,'overview',phrase);checks++;
}
for(const phrase of ['čí jsou ty stopy?', 'komu patří ty stopy?',
 'kdo tudy kdysi šel?', 'kdo tudy chodíval?']){
 assert.equal(m.detect(phrase,state)?.part,'who',phrase);checks++;
}
// Nejde o povolení přepisovat otázky na jiné osoby a jiné události.
for(const phrase of ['co se stalo hvězdáři?', 'co se stalo trpaslíkům?',
 'co se ti stalo?', 'co se stane když otevřu dveře?',
 'prozkoumat stopy', 'rozbít lavici', 'co se tu děje?',
 'co se stalo s havranem?', 'proč jsi se tu zastavil?',
 'kde je minulost hvězdáře?', 'co jsi dělal včera?']){
 assert.equal(m.detect(phrase,state),null,phrase);checks++;
}
for(const room of ['clearing','mill','bridge','tower','crypt','observatory','cave']){
 state.room=room;state.placeHistory=null;state.lastCommandIntent=null;
 const direct=m.detect('co se tu stalo',state);
 assert.equal(direct?.room,room);checks++;
 const response=m.reply(state,direct.part);
 assert.ok(response.length>110,room);checks++;
 state.lastCommandIntent=direct.intent;
 for(const [phrase,part] of [
  ['a kdo tu byl?','who'],['a kdy se to stalo?','when'],
  ['a proč?','why'],['jak to víš?','evidence'],
  ['a co bylo potom?','after'],['pověz mi víc','more']
 ]){
  const follow=m.detect(phrase,state);
  assert.equal(follow?.part,part,room+' '+phrase);
  assert.ok(m.reply(state,part).length>40,room+' '+part);
  checks+=2;
  state.lastCommandIntent=follow.intent;
 }
 // Falešná návaznost po běžném fyzickém příkazu nesmí být přijata.
 state.lastCommandIntent='inspect';
 assert.equal(m.detect('a proč?',state),null,room);checks++;
}
const html=fs.readFileSync(path.resolve(__dirname,'../HRA.html'),'utf8');
assert.ok(html.indexOf('pamet_mist_v11827.js?v=0.11.8.27')>0&&
 html.indexOf('pamet_mist_v11827.js?v=0.11.8.27')<html.indexOf('hra.js?v=0.11.8.27'),
 'modul musí být v dokumentu zaveden dříve než engine');checks++;
console.log(`OK: ${checks} variant otázek na historii místa, jejich souvislostí a ochranných příkazů`);
