const assert = require('node:assert/strict');
require('../havran_kontext_v11814.js');

const raven = globalThis.adventureRavenContext11814;
const norm = s => s.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ').trim();
const oldContext = {speaker:'raven',room:'clearing',topic:'promiseOrigin'};
const foodContext = {speaker:'raven',room:'clearing',topic:'ravenHunger'};
const otherContext = {speaker:'raven',room:'clearing',topic:'bridge'};
const examples = [
  ['hvězdář ti řekl ať zůstaneš?', null, 'promiseAsked'],
  ['hvezdar te pozadal abys tu zustal', null, 'promiseAsked'],
  ['Hvězdář ti řekl, ať tu čekáš?', null, 'promiseAsked'],
  ['proč Ti to řekl?', oldContext, 'promiseWhyAsked'],
  ['proč T to řekl?', oldContext, 'promiseWhyAsked'],
  ['a proč ti to řekl?', oldContext, 'promiseWhyAsked'],
  ['proč tě o to požádal?', oldContext, 'promiseWhyAsked'],
  ['proč ti to řekl?', otherContext, 'promiseClarify'],
  ['proč tu máš čekat?', null, 'promiseWhyWait'],
  ['proč tady musíš čekat?', null, 'promiseWhyWait'],
  ['proč tu čekáš?', null, 'promiseWhyWait'],
  ['co ti hvězdář řekl naposledy?', null, 'promiseWords'],
  ['a co potom?', oldContext, 'promiseAfter'],
  ['co když se nevrátí?', oldContext, 'promiseDoubt'],
  ['musíš něco jíst', null, 'foodConcern'],
  ['ty nejíš?', null, 'foodHabit'],
  ['ty nemusíš žrát?', null, 'foodConcern'],
  ['co tady jíš?', null, 'foodSource'],
  ['máš hlad?', null, 'foodHabit'],
  ['můžu ti přinést něco k jídlu?', null, 'foodHelp'],
  ['jak přežiješ?', foodContext, 'foodNeed'],
  ['jdi sever', oldContext, null],
  ['seber lano', oldContext, null],
  ['prozkoumat havrana', oldContext, null],
  ['použít meč na dveře', oldContext, null],
  ['co je za mostem?', oldContext, null]
];

for (const [utterance, context, expected] of examples) {
  const detected = raven.detect(norm(utterance), context);
  assert.equal(detected, expected, `${utterance}: ${detected} !== ${expected}`);
  if (detected) {
    const memory = {};
    const first = raven.respond(detected, memory);
    const second = raven.respond(detected, memory);
    assert.ok(first.text.length > 25, utterance);
    assert.notEqual(first.text, second.text, `opakování: ${utterance}`);
    assert.ok(!first.text.includes('Hvězdář odpočívá pod věží'), utterance);
  }
}
console.log(`OK: ${examples.length} vět, včetně kontextových návazností a příkazů`);
