const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const src = fs.readFileSync(path.join(__dirname, '../hra.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../HRA.html'), 'utf8');
const begin = src.indexOf('const ravenDeepTopics=');
const open = src.indexOf('[', begin);
const close = src.indexOf('\n];', open);
assert.ok(begin >= 0 && close > open, 'seznam témat havrana');
const topics = vm.runInNewContext(src.slice(open, close + 2));

const normalize = s => s.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ').trim();
const matchTopic = phrase => {
  const t = normalize(phrase);
  return topics.find(([, re]) => re.test(t))?.[0] || null;
};

const examples = [
  ['Potřebuju pomoct', 'askHelp'],
  ['Potřebuji pomoc', 'askHelp'],
  ['Potřebuji poradit', 'askHelp'],
  ['Pomůžeš mi?', 'askHelp'],
  ['Dáš mi nějakou radu?', 'askHelp'],
  ['Můžeš mi poradit?', 'askHelp'],
  ['Co je můj úkol?', 'mission'],
  ['Jaký mám quest?', 'mission'],
  ['Mám něco dělat?', 'mission'],
  ['Co mám dělat?', 'mission'],
  ['Co je mým úkolem?', 'mission'],
  ['Jak mám pokračovat?', 'mission'],
  ['nápověda', null],
  ['seber meč', null],
  ['jdi sever', null]
];
for (const [input, expected] of examples) {
  assert.equal(matchTopic(input), expected, `Špatně rozpoznáno: ${input}`);
}

// Spouštíme také skutečný parser z hra.js v izolovaném kontextu. Tím
// ověřujeme prioritu před staršími dialogovými a jazykovými pravidly.
const parserStart = src.indexOf('function languageParse(raw){');
const parserEnd = src.indexOf('\nfunction parse(raw){', parserStart);
assert.ok(parserStart > 0 && parserEnd > parserStart, 'hranice parseru');
const roomState = {room: 'clearing', dialogue: null, lastWorld: null, lastSurface: null};
const context = {
  state: roomState,
  norm: normalize,
  ravenDeepTopics: topics,
  towerEntryParse: () => null,
  ravenContextParse: () => null,
  f: () => ({}),
  parseBase: () => ({intent: null, ids: []}),
  globalThis: {}
};
const parse = vm.runInNewContext(`${src.slice(parserStart, parserEnd)}; languageParse`, context);
for (const [text, topic] of examples.filter(([, topic]) => topic)) {
  const result = parse(text);
  assert.equal(result.intent, 'talk', `${text} musí být rozhovor, ne nápověda`);
  assert.equal(result.ids[0], 'raven', `${text} musí být určeno havranovi`);
}
assert.equal(parse('nápověda').intent, 'hint', 'jen explicitní nápověda');
roomState.room = 'mill';
assert.equal(parse('Potřebuji pomoc').intent, 'pleaForHelp', 'mimo rozcestí neotevírat nápovědu');
roomState.room = 'clearing';

assert.match(src, /if\(t==='napoveda'\)return \{intent:'hint'/,
  'explicitní nápověda před všemi kontextovými reakcemi');
assert.match(src, /p\.intent='pleaForHelp'/,
  'obecná prosba nesmí otevřít systémovou nápovědu');
assert.match(html, /data-cmd="nápověda">NÁPOVĚDA<\/button>/,
  'tlačítko spouští explicitní příkaz');
assert.ok(!html.includes('data-cmd="pomoc"'), 'starý systémový příkaz pomoc');

globalThis.adventureReactions = {ravenDepth: {}};
require('../havran_dialogy.js');
const mission = globalThis.adventureReactions.ravenDepth.mission;
assert.ok(mission.open.length >= 3 && mission.follow.length >= 2,
  'havran potřebuje vlastní odpovědi a návaznosti o poslání');
for (const line of [...mission.open, ...mission.follow]) {
  assert.ok(line.length > 55, 'odpověď nemá být prázdná obecná výplň');
  assert.ok(!line.includes('To nevím jistě'), 'odpověď není univerzální výplň');
}

console.log(`OK: ${examples.length} testovacích vět, oddělení nápovědy a dialogu`);
