const assert = require('node:assert/strict');
require('../havran_v116.js');

const raven = globalThis.adventureRaven115;
const norm = s => s.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ')
  .replace(/\s+/g,' ').trim();

// Hráč mluví s havranem bez povinného příkazu „mluv s havranem“.
const examples = [
  ['Jsi moudrý', 'wisdomPraise'],
  ['Ty jsi opravdu moudrý', 'wisdomPraise'],
  ['Havrane, jsi rozumný', 'wisdomPraise'],
  ['To bylo moudré', 'wisdomPraise'],
  ['Havrane chci si povídat', 'chatInvite'],
  ['Povídat si', 'chatInvite'],
  ['Chci si s tebou povídat', 'chatInvite'],
  ['Rád bych si s tebou povídal', 'chatInvite'],
  ['Můžeme si povídat', 'chatInvite'],
  ['Pojď si povídat', 'chatInvite'],
  ['Chci si promluvit', 'chatInvite'],
  ['Havrane můžu s tebou mluvit', 'chatInvite'],
  ['Povídej', 'chatStart'],
  ['Pověz mi něco', 'chatStart'],
  ['Řekni mi něco', 'chatStart'],
  ['Povídej mi o sobě', 'chatStart'],
  ['O čem si budeme povídat', 'chatTopics'],
  ['O čem chceš mluvit', 'chatTopics'],
  ['Vyber téma', 'chatTopics'],
  ['Co tě zajímá', 'chatTopics'],
  ['Máš chvilku', 'chatPermission'],
  ['Neruším tě', 'chatPermission'],
  ['Můžeš mě vyslechnout', 'chatPermission'],
  ['Mám na tebe otázku', 'chatPermission'],
  ['Jak se ti vede', 'chatSmallTalk'],
  ['A co je nového', 'chatSmallTalk'],
  ['Jak jde život', 'chatSmallTalk'],
  ['Havrane ahoj', 'chatGreeting'],
  ['Ahoj havrane', 'chatGreeting'],
  ['Zdravím tě', 'chatGreeting'],
  ['Mám strach', 'playerFear'],
  ['Bojím se, že zabloudím', 'playerFear'],
  ['Je mi smutno', 'playerSad'],
  ['Cítím se sám', 'playerSad'],
  ['Je mi zima', 'playerCold'],
  ['Jsem unavený', 'playerTired'],
  ['Jdi sever', null],
  ['Seber lano', null],
  ['Prozkoumat havrana', null],
  ['Nápověda', null],
  ['Použij meč na dveře', null],
  ['Co je za mostem', null]
];

for (const [input, expected] of examples) {
  const topic = raven.detect(norm(input));
  assert.equal(topic, expected, `${input}: ${topic} !== ${expected}`);
  if (!topic) continue;
  const b={trust:0,harmed:0,apologies:0};
  const first=raven.respond(topic,norm(input),b,null);
  const second=raven.respond(topic,norm(input),b,null);
  assert.ok(first.length>35, input);
  assert.notEqual(first, second, `opakování: ${input}`);
  assert.ok(!first.includes('Nerozumím, co chceš'), input);
  assert.ok(!first.includes('Hvězdář odpočívá pod věží'), input);
}
console.log(`OK: ${examples.length} konverzačních otevíráků a ochranných příkazů`);
