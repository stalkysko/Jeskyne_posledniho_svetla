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
    'prostor_v117.js','pribeh_v118.js','semantika_v11821.js','hra.js']){
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
for(const phrase of ['zatlouct na dveře','bušit na dveře','vyrazit dveře',
  'vykopnout dveře','rozrazit vrata ramenem']){
  const reply=g.submit(phrase);
  assert.doesNotMatch(reply,/Co s tím chceš|Nerozumím/i,phrase);
  assert.equal(g.state().room,'mill');checks++;
}
assert.equal(g.state().flags.millKnocks,2);
assert.equal(g.state().flags.millForceAttempts,3);
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

console.log(`OK: ${checks} skutečných příkazů ve hře, přesuny, rekvizity a epilog`);
