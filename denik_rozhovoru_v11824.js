// 0.11.8.24 – skrytý deník světa. Ukládá průběh rozhovorů, návratů a zásahů.
// Kánon postav je neměnný. Deník nesmí přepisovat hvězdářovu minulost ani
// nahrazovat ručně napsané odpovědi havrana a čaroděje.
globalThis.adventureDialogueDiary11824 = (() => {
  'use strict';

  const canon=Object.freeze({
    raven:Object.freeze({
      nature:'hrdý, věrný a někdy vtipný, ale také nejistý; není vševědoucí',
      stargazer:'hvězdář byl jeho přítel, nikdy pán',
      promise:'na rozcestí zůstává ze své vůle kvůli danému slibu',
      death:'nezná jistě hvězdářovy poslední chvíle ani totožnost viníka',
      boundaries:'o smrti přítele nežertuje, neodbočuje náhle k návodům; oslovení příteli si hráč musí zasloužit'
    }),
    wizard:Object.freeze({
      nature:'odměřený a hrdý protivník, který drží odstup',
      boundaries:'samotná zdvořilost ani opakované dotazy neruší jeho motivy, neotvírají portál a nemažou předchozí útoky'
    })
  });

  const topicTerms={
    grief:'hvězdářově smrti',stargazer:'hvězdáři',promise:'dávném slibu',
    waiting:'čekání na rozcestí',friendship:'přátelství',hope:'naději',
    journey:'tvé cestě',family:'rodině',solitude:'samotě',past:'minulosti',
    ring:'kroužku se sluncem',voice:'mluvení',name:'jméně',weather:'dlouhé zimě',
    home:'domově',flight:'létání',light:'světle',bridge:'mostě',
    crypt:'kryptě',cave:'ledové jeskyni',power:'moci',passage:'průchodu',
    choice:'rozhodování',truth:'pravdě',fear:'strachu',memory:'vzpomínkách',
    time:'čase',fate:'osudu',drawing:'kresbě',food:'jídle',
    wizard:'čaroději',riddles:'hádankách',magic:'magii'
  };
  const skipRecall=new Set(['greeting','hello','thanks','bye','sorry','curse','unknown','openQuestion','recall','actionWitness',
    'sigh','speaking','staring','praiseHuman','questions','status','weatherQuestion']);
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  function diary(state){
    if(!state.conversationJournal||typeof state.conversationJournal!=='object')
      state.conversationJournal={version:1,sequence:0,entries:[],topics:{raven:{},wizard:{}},
        milestones:{},lastDialogue:null,lastCallback:{raven:0,wizard:0},returnNoted:0};
    const d=state.conversationJournal;
    d.version=1;d.entries=Array.isArray(d.entries)?d.entries:[];
    d.topics ||= {raven:{},wizard:{}};d.topics.raven ||= {};d.topics.wizard ||= {};
    d.lastCallback ||= {raven:0,wizard:0};d.milestones ||= {};d.sequence ||= 0;
    return d;
  }
  function mood(state,speaker){
    if(speaker==='wizard')return state.caveHits>0?'rozhněvaný':
      (state.wizard?.exchanges||0)>=6?'netrpělivý':'odměřený';
    const b=state.raven||{};
    if(b.griefThread?.active)return 'zarmoucený';
    if((b.harmed||0)>(b.apologies||0))return 'ostražitý';
    if(state.won)return 'uvolněný';
    if((b.trust||0)>=5)return 'otevřený';
    return 'zdrženlivý';
  }
  function relation(state,speaker){
    if(speaker==='wizard')return state.caveHits>0?'nepřátelský':
      (state.wizard?.exchanges||0)>=5?'napjatý':'odtažitý';
    const b=state.raven||{};
    return (b.harmed||0)>(b.apologies||0)?'narušená důvěra':
      (b.trust||0)>=5?'blízký vztah':(b.trust||0)>=2?'opatrná důvěra':'nové setkání';
  }
  function speakerFor(p,room){
    if(!p)return null;
    if(p.intent==='semantic11821'){
      if(p.detail?.kind==='ravenTalk')return 'raven';
      if(p.detail?.kind==='wizardOpen')return 'wizard';
      return null;
    }
    const named=p.ids?.find(id=>id==='raven'||id==='wizard');
    const ravenIntents=new Set(['v118Raven','ravenContext11814','ravenContext','ravenNatural',
      'v118RavenContext','worldWitness','diaryRecall']);
    const wizardIntents=new Set(['caveRoleplay','wizardRoleplay','wizardOpen','wizardConversation']);
    if(ravenIntents.has(p.intent))return room==='clearing'?'raven':null;
    if(wizardIntents.has(p.intent))return room==='cave'?'wizard':null;
    if(['talk','question','hello','thanks','sorry','bye','curse','status','surface'].includes(p.intent)){
      if(named)return named;
      return room==='clearing'?'raven':room==='cave'?'wizard':null;
    }
    return null;
  }
  function topicFor(p,state,input,speaker){
    let topic=p.detail?.topic||p.topic||(state.dialogue?.speaker===speaker&&state.dialogue.topic)||'';
    topic=String(topic).replace(/^(?:role:|semantic:)/,'');
    const raw=normalize(input);
    if(['deathTruth','deathCause','killer','knewDeath','deathFollow','loss','mortality','stargazerDeath'].includes(topic))
      return 'grief';
    if(topic==='starMemory')return 'stargazer';
    if(/\b(zemrel|zemre|smrt|mrtvy|hrob|zabil|umrel|pohreb|chybi mi|postradam)\b/.test(raw)&&/hvezdar|pritel|jeho|ho|mu/.test(raw))return 'grief';
    if(/\b(slib|slibil|slibuji|vratim se|zvazek)\b/.test(raw))return 'promise';
    if(/\b(hvezdar|hvezdare|hvezdari|hvezdarem)\b/.test(raw)&&
      !/\b(krypta|kryptu|krypte|hrob|hrobu)\b/.test(raw)&&['crypt','journey','unknown'].includes(topic))return 'stargazer';
    if(/\b(hvezdar|hvezdare|hvezdari|hvezdarem)\b/.test(raw)&&!topicTerms[topic])return 'stargazer';
    if(/\b(ceka|cekas|cekat|cekani|zustat|zustavas)\b/.test(raw)&&!topicTerms[topic])return 'waiting';
    if(topic==='loss'||topic==='mortality'||topic==='death'||topic==='stargazerDeath')return 'grief';
    if(topic==='duty'||topic==='whyWaiting'||topic==='waitingDuration'||topic==='howMuchLonger')return 'waiting';
    if(topic==='friends'||topic==='friend')return 'friendship';
    if(topic==='stargazerMagic')return 'magic';
    if(topic==='band'||topic==='ringComfort')return 'ring';
    if(topic==='offerHelp'||topic==='askHelp'||topic==='mission')return 'journey';
    if(topic==='voiceMemory')return 'voice';
    if(topic==='angryAfterHarm'||topic==='forgiveAfterHarm')return 'truth';
    if(topic==='openQuestion')return 'unknown';
    if(p.intent==='worldWitness')return 'actionWitness';
    return topic||'unknown';
  }
  function append(d,entry){
    d.entries.push({...entry,seq:++d.sequence});
    // Souhrny témat zůstávají, přestože se staré doslovné přepisy pro
    // velikost uložené hry postupně odsouvají.
    if(d.entries.length>360)d.entries.splice(0,d.entries.length-360);
  }
  function recurrence(speaker,topic,state){
    const grief=mood(state,speaker)==='zarmoucený';
    if(speaker==='wizard')return 'Čaroděj se na tebe upřeně zadívá. „Na to ses už ptal. Moje odpověď se nezměnila.“';
    if(grief||topic==='grief')return 'Havran po chvíli přikývne. „Vím. Už jsme o tom mluvili. Ale ani podruhé se mi to neříká snadněji.“';
    if(mood(state,speaker)==='ostražitý')return 'Havran ucouvne o krok. „Ano, vzpomínám si na tu otázku. Na některé věci ale nestačí jen slova.“';
    if(topic==='promise'||topic==='waiting')return 'Havran si přitáhne k tělu promrzlá křídla. „Už ses mě na to ptal. Slib se ale nezměnil jen proto, že jsme o něm mluvili.“';
    if((state.raven?.trust||0)>=4)return 'Havran tě poznává po hlase. „Tohle už jsme spolu probírali, viď?“ dodá tiše. „Nevadí. Někdy je dobré se k věcem vrátit.“';
    return 'Havran nakloní hlavu. „Na to ses mě už jednou ptal,“ poznamená bez výčitky.';
  }
  function track(state,before,p,input,lines){
    const d=diary(state),room=before.room;
    if(room!==state.room){
      append(d,{kind:'travel',from:room,to:state.room,turn:state.turn});
      if(state.room==='clearing'){
        const ravenLines=lines.filter(line=>line.includes('„')).slice(-4);
        if(ravenLines.length)append(d,{kind:'encounter',speaker:'raven',room:state.room,
          turn:state.turn,mood:mood(state,'raven'),reply:ravenLines.join('\n').slice(0,1800)});
      }
    }
    // Důležité události se pamatují navždy, i když se starý přepis po
    // stovkách tahů zkrátí. Nejde o tajnou znalost postav: havran vidí jen
    // to, co má podle původního enginu skutečně možnost zaznamenat.
    const milestones=['crateBroken','coinTaken','pendantRevealed','pendantTaken','bridge',
      'doorUnlocked','door','cryptChestOpen','cryptLetterTaken','tomb','keyTaken',
      'lensTaken','lensInSun','charged'];
    for(const name of milestones){
      if(!before.flags?.[name]&&state.flags?.[name]){
        d.milestones[name]={turn:state.turn,room:state.room};
        append(d,{kind:'milestone',name,room:state.room,turn:state.turn});
      }
    }
    if(!before.won&&state.won){
      d.milestones.victory={turn:state.turn,room:state.room};
      append(d,{kind:'milestone',name:'victory',room:state.room,turn:state.turn});
    }
    if((state.raven?.harmed||0)>(before.raven?.harmed||0))
      append(d,{kind:'relationship',speaker:'raven',change:'hurt',room,turn:state.turn});
    if((state.raven?.apologies||0)>(before.raven?.apologies||0))
      append(d,{kind:'relationship',speaker:'raven',change:'apology',room,turn:state.turn});
    if(['take','drop'].includes(p.intent)){
      const beforeInv=new Set(before.inv||[]);
      for(const id of state.inv||[]){
        if(!beforeInv.has(id))append(d,{kind:'inventory',action:'taken',id,room,turn:state.turn});
      }
      if(p.intent==='drop')for(const id of before.inv||[]){
        if(!state.inv.includes(id))append(d,{kind:'inventory',action:'left',id,room,turn:state.turn});
      }
    }
    if(p.intent==='world'&&p.detail&&['clean','kick','break','cut','attack','pull','push','turn','shake','dig','open'].includes(p.detail.intent))
      append(d,{kind:'action',room,object:p.detail.id,action:p.detail.intent,turn:state.turn});
    if(p.intent!=='world'&&p.ids?.length&&
      ['clean','kick','break','cut','attack','pull','push','turn','shake','dig','open','knock','repair'].includes(p.intent))
      append(d,{kind:'action',room,object:p.ids[0],action:p.intent,turn:state.turn});
    const speaker=speakerFor(p,room);
    if(!speaker||p.unresolved||p.nounSuggestion||state.won&&speaker==='wizard'||
      !lines.length||!lines.some(line=>/\S/.test(line))||
      lines.some(line=>/Příkaz se nepodařilo dokončit/.test(line)))return null;
    const topic=topicFor(p,state,input,speaker),previous=d.topics[speaker][topic]||null;
    const last=d.lastDialogue;
    // Konverzační slovíčka a odbočky „proč?“ pokračují v tématu, nikoli
    // v nové žádosti, proto nesmějí vyvolávat automatické „už ses ptal“.
    const continued=/^(?:a |ale |no )?(?:proc|co jeste|jak to|co tim myslis|povez vic|rekni vic|a potom|opravdu|vazne)$/.test(normalize(input));
    const repeated=!!previous&&!continued&&!skipRecall.has(topic)&&
      (!last||last.speaker!==speaker||last.topic!==topic)&&
      d.sequence-(d.lastCallback[speaker]||0)>=4;
    const entry={kind:'dialogue',speaker,topic,room,turn:state.turn,input:input.slice(0,240),
      reply:lines.join('\n').slice(0,1800),mood:mood(state,speaker),relation:relation(state,speaker)};
    append(d,entry);
    d.topics[speaker][topic]={count:(previous?.count||0)+1,
      firstTurn:previous?.firstTurn??state.turn,lastTurn:state.turn,
      lastInput:entry.input,lastReply:entry.reply,lastMood:entry.mood};
    d.lastDialogue={speaker,topic,seq:d.sequence};
    // Jen řídká osobní odezva; nejdřív zůstává kompletní autorská odpověď.
    if(repeated&&previous.count>=1&&d.topics[speaker][topic].count%2===0){
      d.lastCallback[speaker]=d.sequence;
      return recurrence(speaker,topic,state);
    }
    return null;
  }
  function lastMeaningful(d,speaker){
    for(let i=d.entries.length-1;i>=0;i--){
      const e=d.entries[i];
      if(e.kind==='dialogue'&&e.speaker===speaker&&!skipRecall.has(e.topic)&&topicTerms[e.topic])return e;
    }
    return null;
  }
  function recall(state,speaker='raven',kind='asked'){
    const d=diary(state),e=lastMeaningful(d,speaker);
    if(!e)return speaker==='raven'?'Havran přimhouří oči. „Zatím jsme spolu mnoho neprobrali. Na co myslíš?“':
      'Čaroděj zkříží ruce. „Neměli jsme spolu žádný rozhovor, ke kterému bych se chtěl vracet.“';
    const subject=topicTerms[e.topic];
    if(kind==='question'){
      const question=e.input.replace(/[.!? ]+$/,'');
      return speaker==='wizard'?'Čaroděj nepohne ani brvou. „Pamatuji si tvou otázku: ‚'+question+'‘. Nepotřebuješ ji opakovat.“':
        mood(state,'raven')==='zarmoucený'?
          'Havran ztiší hlas. „Ptal ses mě: ‚'+question+'‘. Vzpomínám si. Jen odpověď mě pořád bolí.“':
          'Havran nakloní hlavu. „Posledně ses mě ptal: ‚'+question+'‘. Pamatuji si.“';
    }
    if(speaker==='wizard')return 'Čaroděj ani nemrkne. „Pamatuji si. Mluvili jsme o '+subject+'. Nečekej, že opakováním změníš má rozhodnutí.“';
    if(mood(state,'raven')==='zarmoucený')return 'Havran chvíli mlčí. „Pamatuji si, že jsme mluvili o '+subject+'. Jen mě teď stále tíží vzpomínka na hvězdáře.“';
    if(mood(state,'raven')==='ostražitý')return 'Havran tě sleduje z bezpečné vzdálenosti. „Pamatuji si naši řeč o '+subject+'. Ale také si pamatuji, cos udělal potom.“';
    if(kind==='return')return 'Havran si tě pozorně prohlédne. „Minule jsme spolu mluvili o '+subject+',“ připomene ti. „Přemýšlel jsem o tom, když jsi byl pryč.“';
    return 'Havran se na okamžik odmlčí. „Ano. Mluvili jsme o '+subject+'. Pamatuji si to.“';
  }
  function onReturn(state){
    const d=diary(state),count=state.raven?.returns||0;
    if(count<1||d.returnNoted===count)return null;
    d.returnNoted=count;
    const entries=d.entries.filter(e=>e.kind==='dialogue'&&e.speaker==='raven');
    if(entries.length<2)return null;
    // Po návratu jen občas; příběhové setkání a bolestivé téma mají přednost.
    if(count%2===0||['zarmoucený','ostražitý'].includes(mood(state,'raven')))return null;
    return recall(state,'raven','return');
  }
  function noteAside(state,speaker,reply){
    const d=diary(state);
    append(d,{kind:'aside',speaker,room:state.room,turn:state.turn,
      reply:String(reply).slice(0,1800),mood:mood(state,speaker),relation:relation(state,speaker)});
  }
  return {canon,diary,mood,relation,speakerFor,topicFor,track,recall,onReturn,noteAside};
})();
