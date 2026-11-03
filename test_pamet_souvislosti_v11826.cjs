const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
require('../pamet_souvislosti_v11826.js');
const u=globalThis.adventureDialogueUnderstanding11826;
const html=fs.readFileSync(path.resolve(__dirname,'../HRA.html'),'utf8');
const beforeEngine=html.indexOf('pamet_souvislosti_v11826.js?v=0.11.8.27');
assert.ok(beforeEngine>0&&beforeEngine<html.indexOf('hra.js?v=0.11.8.27'),
  'sémantický modul se musí načíst před vlastním herním enginem');
const table=[
 ['o čem jsme si spolu povídali?', 'topic'],
 ['o čem jsme si spolu povídali posledně?', 'topic'],
 ['o čem jsme si spolu povídali minule?', 'topic'],
 ['o čem sjem si povídali posledně?', 'topic'],
 ['o cem sme se bavili minule', 'topic'],
 ['o čem jsme naposledy mluvili?', 'topic'],
 ['o cem jsme si povidaly?', 'topic'],
 ['co jsme minule probírali?', 'topic'],
 ['Co jsme si naposled řešili?', 'topic'],
 ['No hele, co sme posledne pokecali?', 'topic'],
 ['Pamatuješ, co jsme řešili?', 'topic'],
 ['PAMATUJES SI O CEM JSME MLUVILI', 'topic'],
 ['Vzpomeneš si, o čem jsme se bavili?', 'topic'],
 ['Připomeň mi, o čem jsme si povídali posledně.', 'topic'],
 ['Povídej mi o našem posledním rozhovoru.', 'topic'],
 ['O čem jsme debatovali předtím?', 'topic'],
 ['O jakém tématu jsme minule mluvili?', 'topic'],
 ['Co všechno jsme spolu probírali?', 'topics'],
 ['O čem všem jsme mluvili naposled?', 'topics'],
 ['Jaká témata jsme spolu řešili?', 'topics'],
 ['Na co jsem se tě naposledy ptal?', 'question'],
 ['Na co jsme se tě minule ptali?', 'question'],
 ['Na co jsem se tě posledně ptal?', 'question'],
 ['Jakou otázku jsem ti minule dal?', 'question'],
 ['Co jsi mi naposledy odpověděl?', 'reply'],
 ['Co jsi mi řekl posledně?', 'reply'],
 ['Jak jsi mi odpověděl minule?', 'reply'],
 ['Kolikrát jsme spolu mluvili?', 'count'],
 ['Co jsem ti slíbil?', 'playerPromise'],
 ['Pamatuješ na můj slib?', 'playerPromise'],
 ['O čem jsme spolu hovořili?', 'topic'],
 ['O čem jsme si vykládali?', 'topic'],
 ['Co jsme si říkali minule?', 'topic'],
 ['Mluvili jsme o něčem včera?', 'topic'],
 ['Kolik jsme toho spolu probrali?', 'count']
];
let checks=0;
for(const [phrase,mode] of table){
 const result=u.recallIntent(phrase);
 assert.equal(result?.mode,mode,phrase+': '+JSON.stringify(result));checks++;
}
// Kombinatoricky ověřit hovorové výrazy, slovosled a časovou část. Není to
// výčet všech českých vět, ale více než stovka skutečně odlišných dotazů.
for(const pronoun of ['jsme','sme','sjem']){
 for(const action of ['mluvili','povídali','bavili','probírali','řešili','kecali','pokecali','hovořili']){
  for(const when of ['minule','posledně','naposledy']){
   const phrase=`O čem ${pronoun} si ${when} ${action}?`;
   assert.equal(u.recallIntent(phrase)?.mode,'topic',phrase);checks++;
  }
 }
}
for(const phrase of [
 'prozkoumat bednu','rozmlátit bednu','jít na sever','jak se jmenuješ',
 'co o hvězdáři říkal čaroděj','pamatuješ na hvězdáře',
 'co jsme našli ve mlýně','jak se máš','jak mám projít portálem',
 'o čem jste si povídali vy dva','co bych měl dělat','jak odemknout věž',
 'jaké sliby jsi dal hvězdáři','co se stalo před zimou',
 'co jsi mi říkal o kouzle?', 'co jsme spolu našli ve mlýně?',
 'co mám použít na čaroděje?', 'počítač, řekni mi poslední číslo'
]){
 assert.equal(u.recallIntent(phrase),null,phrase);checks++;
}
const wizard={speaker:'wizard',room:'cave',topic:'guard'};
for(const phrase of ['proč mi to říkáš?','jak to myslíš?','a co ještě?','co tím myslíš?',
 'proč jsi to řekl?','vysvětli to']){
 const result=u.followupIntent(phrase,wizard);
 if(phrase==='vysvětli to')assert.equal(result,null);
 else assert.equal(result?.kind,'wizardFollowup',phrase);
 checks++;
}
assert.equal(u.followupIntent('proč mi to říkáš?',{speaker:'raven',room:'clearing',topic:'duty'}),null);
assert.equal(u.followupIntent('proč mi to říkáš?',{speaker:'wizard',room:'clearing',topic:'guard'}),null);
checks+=2;
console.log(`OK: ${checks} významových variant, překlepů a ochranných příkazů`);
