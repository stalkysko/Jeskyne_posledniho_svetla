// V0.11.8.24 – společná fyzická paměť světa.
// Deklarativní vlastnosti pro každou vedlejší rekvizitu sedmi lokací.
// Příběhové zámky a hlavní hádanky mají vždy přednost před těmito pravidly.
globalThis.adventureLivingWorld11824 = (() => {
  'use strict';
  const records = `
clearing:stopy snow trace
clearing:lavice wood fixed,seat
clearing:kamen stone fixed
clearing:vetve wood loose,fragile
clearing:zvoneni air ambient
clearing:rampouchy ice fixed,fragile
clearing:mesic distant remote
mill:bedynka wood loose,fragile,protected
mill:nahon water fixed
mill:panty metal fixed
mill:hrnek wood trace
mill:sekera wood trace
mill:privesena metal loose
mill:schudky stone fixed
mill:klice wood fixed,fragile
bridge:krovi absent absent
bridge:spona metal fixed,protected
bridge:zbytek wood fixed,fragile
bridge:ryha stone trace
bridge:vlocky snow ambient
bridge:ozvena air ambient
bridge:provazky fiber fixed,fragile
bridge:ptaci distant remote
bridge:led water remote
tower:dlazba stone fixed
tower:studna stone fixed,protected
tower:socha stone fixed
tower:horni wood remote
tower:prapor cloth remote
tower:popel ash trace
tower:brana metal fixed
crypt:vyklenek stone fixed,protected
crypt:schranka wood fixed,protected
crypt:jmena stone trace
crypt:relief stone fixed
crypt:kosti bone loose,fragile
crypt:pruvan air ambient
crypt:miska clay loose,fragile
crypt:spalene ash trace
crypt:kapky water ambient
observatory:mapa paper fixed,fragile
observatory:tezitko metal loose
observatory:kresba paper loose,fragile
observatory:prasklina stone remote
observatory:prach dust trace
observatory:hodiny metal fixed,protected
observatory:okular metal fixed
cave:stopy earth trace
cave:krystaly ice fixed,fragile
cave:praskliny ice fixed
cave:prilba metal fixed
cave:krapnik ice remote,protected
cave:dech air ambient
cave:ozvena air ambient
  `.trim().split('\n').map(line=>line.trim().split(/\s+/));
  const catalog = Object.fromEntries(records.map(([key,material,kinds])=>[key,{material,kinds:new Set(kinds.split(','))}]));
  const names = {
    'clearing:stopy':'stopách ve sněhu','clearing:lavice':'lavici',
    'clearing:kamen':'patníku','clearing:vetve':'větvičkách',
    'clearing:rampouchy':'rampouších na směrovce',
    'mill:bedynka':'bedýnce','mill:nahon':'ledu na náhonu',
    'mill:panty':'pantech','mill:hrnek':'kruzích na stole',
    'mill:sekera':'záseku v trámu','mill:privesena':'podkově',
    'mill:schudky':'schůdcích','mill:klice':'klínu',
    'bridge:spona':'sponě','bridge:zbytek':'prknech',
    'bridge:ryha':'rýhách v kameni','bridge:provazky':'útržcích lana',
    'tower:dlazba':'dlažbě','tower:socha':'soše',
    'tower:popel':'popelu','tower:brana':'starém kování',
    'crypt:miska':'misce','crypt:jmena':'nápisu',
    'crypt:relief':'reliéfu','crypt:kosti':'úlomku kosti',
    'crypt:spalene':'sazích',
    'observatory:mapa':'hvězdné mapě','observatory:tezitko':'těžítku',
    'observatory:kresba':'náčrtcích','observatory:prach':'přístrojích',
    'observatory:hodiny':'hodinách','observatory:okular':'okuláru',
    'cave:stopy':'otiscích','cave:krystaly':'krystalech',
    'cave:praskliny':'prasklinách','cave:prilba':'přilbě'
  };
  const sounds = {
    wood:'dutě zavrže dřevo',metal:'zazvoní studený kov',stone:'odpoví tlumený kamenný úder',
    glass:'ozve se křehké cinknutí',ice:'zazní ostré ledové křupnutí',cloth:'látka úder pohltí',
    paper:'ozve se jen suché zašustění',fiber:'vlákna úder utlumí',clay:'dutě zazní vypálená hlína',
    bone:'ozve se krátké suché klapnutí',snow:'sníh ztlumí každý zvuk',earth:'podklad nepatrně zapraská'
  };
  const touch = {
    wood:'Drsná vlákna se zachytávají o rukavici.',metal:'Chladný povrch klouže pod prsty.',
    stone:'Kámen je studený a nepoddajný.',ice:'Do rukavice proniká ostrý chlad.',
    cloth:'Látka je tuhá mrazem.',paper:'Papír je suchý a křehký.',
    fiber:'Hrubá vlákna škrábou o dlaň.',clay:'Povrch je tvrdý, ale na hraně křehký.',
    bone:'Povrch je suchý a lehký.',snow:'Krystalky se sypou mezi prsty.',
    ash:'Prach ti ulpí na rukavici.',dust:'Na rukavici se objeví šedá šmouha.',
    earth:'Hlína je tvrdá jako kámen.',water:'Bezprostředně pod ledem cítíš pronikavý chlad.'
  };
  const scents={wood:'mokré dřevo a pryskyřice',metal:'studené železo a stará rez',stone:'vlhký kámen',
    cloth:'stará látka a prach',paper:'starý papír',fiber:'vlhké konopí',ice:'ostrý mrazivý vzduch',
    snow:'čistý sníh',earth:'zmrzlá hlína',ash:'dávno vyhaslý popel',dust:'suchý prach',clay:'stará hlína'};
  const physical=new Set(['clean','touch','push','pull','kick','attack','break','cut','turn','shake','dig','throw','open','close','knock','take','use','burn','repair']);
  const keyOf=({room,id})=>room+':'+id;
  function profile(hit){return catalog[keyOf(hit)]||null;}
  function stateFor(flags,hit){flags.worldDetails ||= {};return flags.worldDetails[keyOf(hit)] ||= {};}
  function count(flags,hit){return flags.worldDetails?.[keyOf(hit)]?.actions?.[hit.intent]||0;}
  function generic(hit,flags,p=profile(hit)){
    if(!p)return null;
    const kind=p.kinds,material=p.material,n=count(flags,hit),intent=hit.intent;
    if(kind.has('absent'))return 'Zastavíš se a prohlédneš místo ještě jednou. Hledaná věc tu ve skutečnosti není; saháš jen do prázdného prostoru.';
    if(kind.has('ambient')&&physical.has(intent))return 'To, co vnímáš, je zvuk, proudění nebo pomíjivý jev. Nemá pevný okraj, za který bys mohl vzít.';
    if(kind.has('remote')&&physical.has(intent))return 'Z tohoto místa na to nedosáhneš. Můžeš se dívat a naslouchat, ne se toho dotknout.';
    if(kind.has('trace')&&['open','close','shake','take','push','pull','turn','kick','break'].includes(intent))return 'Je to stopa na povrchu, ne samostatná věc s víkem nebo držadlem. Zvednout ani otevřít ji nemůžeš.';
    if(intent==='inspect')return n===0?'Prohlížíš to zblízka. '+(touch[material]||'Zatím nenacházíš žádný skrytý mechanismus.'):
      'Změníš úhel pohledu a zkontroluješ spáry i okolí. Novou skrýš nenacházíš; předchozí stopy zůstávají na místě.';
    if(intent==='touch')return touch[material]||'Opatrně se toho dotkneš. Nic neobvyklého se nestane.';
    if(intent==='smell')return scents[material]?'Zblízka ucítíš '+scents[material]+'.':'Necítíš žádnou zřetelnou vůni.';
    if(intent==='listen')return material==='water'?'Pod povrchem se ozývá vzdálené proudění.':
      material==='ice'?'Z dálky slyšíš drobné praskání ledu.':
      sounds[material]?'Na chvíli zadržíš dech; '+sounds[material]+'.':'Na chvíli posloucháš, ale věc sama žádný zvuk nevydává.';
    if(intent==='knock')return n===0?'Zlehka poklepeš; '+(sounds[material]||'zvuk se ztratí v okolním tichu')+'.':
      'Zkusíš jiný rytmus a přiložíš ucho blíž; '+(sounds[material]||'odpovídá jen ticho')+'. Nic uvnitř se nepohne.';
    if(intent==='open'||intent==='close')return kind.has('protected')?'Zkusíš najít přístup k uzávěru. Zatím nic nepovolilo.':
      'Hledáš víko, západku nebo spoj. Tady ale není nic, co by šlo tímto způsobem '+(intent==='open'?'otevřít.':'zavřít.');
    if(intent==='shake')return kind.has('loose')?'Vezmeš to opatrně do rukou a zatřeseš; '+(sounds[material]||'nic se uvnitř neozve')+'. Nic skrytého nevypadne.':
      'Zapřeš se a zkusíš s tím pohnout. Je to pevnou součástí okolí a na místě to drží.';
    if(['push','pull','turn'].includes(intent))return kind.has('loose')?'Posuneš to jen o kousek a zkontroluješ prostor pod tím. Žádná tajná přihrádka se neobjeví.':
      'Zabereš oběma rukama. Konstrukce je pevná a nepohne se; zbytečně bys ji poškodil.';
    if(intent==='kick')return kind.has('loose')?'Kopneš do toho. Předmět se nepatrně pohne a ve sněhu zůstane stopa, ale nic z něj nevypadne.':
      material==='stone'||material==='metal'?'Tvrdý odpor ucítíš až v koleni. Povrch jen zaduní, další kopnutí by uškodilo hlavně tobě.':
      'Po úderu se zachvěje okolí, ale věc pevně drží. Neobjeví se žádný průchod ani obsah.';
    if(['attack','break','cut'].includes(intent))return kind.has('fragile')?'Na povrchu vznikne drobná rýha a odštípne se nepatrný kousek. Zásadní část však drží dál.':
      material==='stone'||material==='metal'?'Tvrdý povrch úder vydrží. Pokračováním bys poškodil spíš zbraň a ruce.':
      'Síla se přenese do okolí, ale předmět zůstane funkční. Neobjeví se žádný nový průchod.';
    if(intent==='clean'&&material==='water')return 'Ometáš tenkou vrstvu sněhu na ledu. Pod ním dál protéká voda; nic se tam nedá pořádně očistit.';
    if(intent==='clean')return n===0?'Ometáš povrch. Pod špínou se ukáže původní materiál, ale žádná skrytá značka.':
      'Místo už jsi očistil. Znovu přejedeš po stejném povrchu, nic nového se neodhalí.';
    if(intent==='dig')return ['snow','earth','ash','dust'].includes(material)?'Rozhrneš vrstvu na malém místě. Pod ní je jen pevný podklad; po tvém pokusu zůstává mělká stopa.':
      'Podklad je příliš tvrdý. Holýma rukama v něm žádnou skrýš nevyhloubíš.';
    if(intent==='take')return kind.has('loose')?'Na okamžik věc zvedneš, ale necháš ji tam, kam patří. Do vaku sis nic nepřidal.':
      'Zkusíš ji uchopit a zvednout, ale pevně patří k okolí. Neodneseš ji.';
    if(intent==='throw')return kind.has('loose')?'Zkusíš s věcí pohnout, ale záměrně ji nenecháš zmizet z místa. Zůstane v dosahu.':
      'Předmět je příliš pevně usazený na to, abys jej mohl odhodit.';
    if(intent==='burn')return 'Otevřený oheň by tu byl nebezpečný. Nepřikládáš plamen k okolí; nic se nevznítí.';
    if(intent==='repair')return 'Prohlédneš staré spoje. Bez nářadí a správného materiálu opravou nic nezměníš.';
    if(intent==='read')return 'Hledáš písmo a znaky. Nic dalšího čitelného zde nenacházíš.';
    if(intent==='use')return 'Zkoušíš různé úchopy, ale žádný mechanismus se neuvolní. Věc zůstává tak, jak byla.';
    return null;
  }
  function observe(hit,flags){
    const p=profile(hit);if(!p)return;
    const st=stateFor(flags,hit),n=st.actions?.[hit.intent]||0;
    st.actions ||= {};st.actions[hit.intent]=n+1;st.lastAction=hit.intent;
    if(p.kinds.has('ambient')||p.kinds.has('remote')||p.kinds.has('absent')||p.kinds.has('protected'))return;
    if(hit.intent==='clean'&&!['water','air','distant'].includes(p.material))st.cleaned=true;
    if(hit.intent==='dig'&&['snow','earth','dust','ash'].includes(p.material))st.disturbed=true;
    if(hit.intent==='kick'&&!p.kinds.has('trace'))st.scuffed=true;
    if(['break','attack','cut'].includes(hit.intent)&&p.kinds.has('fragile'))st.chipped=true;
    if(['push','pull'].includes(hit.intent)&&p.kinds.has('loose'))st.shifted=true;
    if(hit.intent==='turn'&&p.kinds.has('loose'))st.turned=true;
  }
  function memory(hit,flags){
    const st=flags.worldDetails?.[keyOf(hit)]||{};
    if(st.cleaned)return 'Na povrchu je stále vidět místo, které jsi před chvílí očistil.';
    if(st.chipped)return 'Drobná poškození po tvém předchozím zásahu nezmizela.';
    if(st.scuffed)return 'Zůstaly zde čerstvé oděrky po tvém kopnutí.';
    if(st.disturbed)return 'Na povrchu zůstala mělká stopa po tvém hledání.';
    if(st.shifted||st.turned)return 'Předmět zůstal v poloze, do níž jsi ho posunul.';
    return '';
  }
  function sceneEcho(room,flags){
    if(!flags.worldDetails)return '';
    const pieces=[];
    for(const [key,st] of Object.entries(flags.worldDetails)){
      if(!key.startsWith(room+':')||!names[key])continue;
      if(key==='mill:bedynka'&&flags.crateBroken)continue;
      const changed=st.chipped||st.scuffed||st.cleaned||st.disturbed||st.shifted||st.turned;
      if(!changed)continue;
      const detail=st.chipped?['paper','cloth','fiber'].includes(catalog[key]?.material)?'drobné trhliny':'drobné odštěpky':
        st.scuffed?'čerstvé oděrky':st.cleaned?'stopy po očištění':
        st.disturbed?'stopy po prohrabání':st.shifted?'stopy po posunutí':'stopy po pootočení';
      pieces.push('Na '+names[key]+' jsou stále patrné '+detail+'.');
      if(pieces.length===2)break;
    }
    return pieces.join(' ');
  }
  function core(hit,flags,entity){
    if(!entity)return null;
    const p={material:entity.mat||'stone',kinds:new Set(entity.portable?['loose']:entity.mat==='distant'?['remote']:['fixed'])};
    const local={room:'core_'+hit.room,id:hit.id,intent:hit.intent};
    const msg=generic(local,flags,p);
    if(msg&&['clean','kick','break','push','pull','turn','dig'].includes(hit.intent)){
      flags.worldDetails ||= {};const st=flags.worldDetails['core:'+hit.room+':'+hit.id] ||= {};
      st.actions ||= {};st.actions[hit.intent]=(st.actions[hit.intent]||0)+1;
    }
    return msg;
  }
  function ravenWitness(last,grieving){
    if(!last)return 'Havran tě pozorně sleduje. „A na co myslíš?“ zeptá se.';
    if(grieving)return 'Havran se zadívá k místu, kde ses zastavil. „Viděl jsem tě,“ řekne tiše. „Jen dnes nemám sílu na lehké poznámky.“';
    if(['kick','attack','break'].includes(last.intent))return 'Havran se podívá na místo tvého zásahu. „Dovedu pochopit netrpělivost,“ řekne. „Ale svět občas odpovídá lépe na klidnou ruku.“';
    if(last.intent==='clean')return '„Všiml jsem si,“ přikývne havran. „Málokdo se zastaví, aby po sobě něco nechal o trochu lepší.“';
    return '„Viděl jsem, co jsi zkoušel,“ odpoví havran. „Některé věci se ukážou až tomu, kdo je prozkoumá z více stran.“';
  }
  return {catalog,profile,generic,observe,memory,sceneEcho,core,ravenWitness};
})();
