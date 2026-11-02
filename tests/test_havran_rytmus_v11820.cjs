const assert=require('node:assert/strict');
require('../havran_v116.js');
const raven=globalThis.adventureRaven115;

const says=(topic,count)=>{
  const b={trust:0,harmed:0,apologies:0};
  return Array.from({length:count},()=>raven.respond(topic,'',b,null));
};

// Odpovědi jsou drobné vzpomínky, nikoli seznam všech funkcí havrana.
const actions=says('ravenPresentAction',6);
assert.equal(new Set(actions).size,6,'šest různých variací na otázku Co děláš?');
for(const line of actions){
  assert.ok(line.length<275,'odpověď o poslání musí být krátká');
  assert.doesNotMatch(line,/jídlo|jídlu|potrav|snědku|zobnutí|bobul/i,'téma potravy nepatří do každé odpovědi o poslání');
  assert.match(line,/slib|hvězdář|cest|poutník|přišel|stezk|čekám/i,'vztah k poslání');
}

const days=says('ravenDay',6);
assert.equal(new Set(days).size,6,'šest různých vzpomínek na každodennost');
for(const line of days)assert.ok(line.length<285,'každodennost má rozvíjet po krátkých částech');

const range=says('ravenRange',3);
assert.equal(new Set(range).size,3,'tři různá vysvětlení hlídání během letu');
assert.ok(range.some(s=>/jedno oko|vidím zpátky|odletět/i.test(s)));

const familiarity=says('ravenFamiliarity',3);
assert.equal(new Set(familiarity).size,3,'tři detaily o známém okolí');
assert.ok(familiarity.some(s=>/kámen|stezk|cest/i.test(s)));

console.log('OK: 18 krátkých, tematicky rozdělených a vzájemně odlišných havranových odpovědí');
