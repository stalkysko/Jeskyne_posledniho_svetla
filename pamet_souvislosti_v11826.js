// 0.11.8.26 – společné porozumění rozhovorům pro havrana i čaroděje.
// Offline, deterministické a bez vedlejších účinků. Slova slouží k rozpoznání
// záměru; samotná odpověď musí vždy vycházet ze SKUTEČNÉ kroniky a kánonu.
globalThis.adventureDialogueUnderstanding11826 = (() => {
  'use strict';

  const fold = s => String(s || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const common = new Set([
    'jsme', 'spolu', 'mluvili', 'povidali', 'povidaly', 'bavili', 'probirali',
    'resili', 'debatovali', 'kecali', 'pokecali', 'vypraveli', 'povidal',
    'ptal', 'ptala', 'ptali', 'povidal', 'rekl', 'rikal', 'rikali', 'odpovedel',
    'pamatujes', 'pamatuji', 'vzpominas', 'vzpomenes', 'vzpomenout',
    'posledne', 'posledni', 'naposledy', 'minule', 'predtim', 'drive',
    'rozhovoru', 'rozhovor', 'debate', 'debatu', 'tematu', 'temata'
  ]);
  const dictionary = [...common];
  const aliases = new Map([
    ['sme', 'jsme'], ['sjem', 'jsme'], ['jsmej', 'jsme'],
    ['povidaly', 'povidali'], ['povidalyj', 'povidali'],
    ['kecali', 'povidali'], ['pokecali', 'povidali'],
    ['debatovali', 'mluvili'], ['hovorili', 'mluvili'],
    ['hovorily', 'mluvili'], ['vykladali', 'povidali'],
    ['rikali', 'mluvili'], ['rikaly', 'mluvili'],
    ['posledni', 'posledne'], ['naposled', 'naposledy'],
    ['vzpomenes', 'pamatujes'], ['vzpominas', 'pamatujes']
  ]);
  function editDistanceOne(a, b) {
    if (Math.abs(a.length-b.length)>1) return false;
    if (a===b) return true;
    let i=0, j=0, changes=0;
    while (i<a.length && j<b.length) {
      if (a[i]===b[j]) {i++;j++;continue;}
      if (++changes>1) return false;
      if (a[i+1]===b[j] && a[i]===b[j+1]) {i+=2;j+=2;continue;}
      if (a.length>b.length) i++;
      else if (a.length<b.length) j++;
      else {i++;j++;}
    }
    return changes + (a.length-i) + (b.length-j)<=1;
  }
  function correct(word) {
    if (aliases.has(word)) return aliases.get(word);
    if (word.length<5||common.has(word)) return word;
    const candidates=dictionary.filter(w=>editDistanceOne(word,w));
    // Nejistou opravu neprovádíme. Falešně změněné slovo může zničit význam.
    return candidates.length===1?(aliases.get(candidates[0])||candidates[0]):word;
  }
  const normalize = raw => fold(raw).split(' ').filter(Boolean).map(correct).join(' ');
  const any = (t,re) => re.test(t);

  function recallIntent(raw) {
    const t=normalize(raw);
    if (!t) return null;
    const mutual=any(t,/\b(?:jsme|spolu|nasem|nasi|nas|mezi nami|s tebou|se mnou|ty a ja|ja a ty)\b/) ||
      any(t,/\b(?:jsem (?:se )?te|jsem ti|jsi mi|ty jsi mi|tys mi|sem se te)\b/);
    const history=any(t,/\b(?:minule|posledne|naposledy|predtim|drive|pred chvili|drivejsi|poslednim|posledni|vcera|pred chvilkou|predtimhle)\b/);
    const conversation=any(t,/\b(?:mluv\w*|povid\w*|bavil\w*|bavili|probral\w*|probiral\w*|probirali|resil\w*|resili|debat\w*|pokec\w*|kecal\w*|hovor\w*|vyprav\w*|vykladal\w*|rozhovor\w*|debat\w*|temat\w*)\b/);
    const questioning=any(t,/\b(?:ptal|ptala|ptali|otazk\w*|rikal\w*|rekl\w*|odpovedel\w*|odpoved\w*)\b/);
    const remembering=any(t,/\b(?:pamatujes|pamatuji|vzpominas|vzpomin\w*|vzpomen\w*|nezapomnel|pamatuj)\b/);
    const asking=any(t,/\b(?:co|cem|jak|kdy|ktera|ktere|ktery|jaka|jake|jaky|jakou|jakem|jakym|kolik|kolikrat|pamatujes|vzpomen\w*|pripomen\w*|povidej|vypravej|rekni)\b/)||
      (/\?/.test(raw)&&history&&conversation);

    const directQuestion=any(t,/^(?:na co jsem|na co jsme se te|co jsem se te|na co sem se te|jakou otazku|jaka byla moje otazka)/);
    const directReply=any(t,/^(?:co jsi mi|jak jsi mi|jaka byla tvoje odpoved)/)&&
      t.split(' ').length<=5;
    const conversationContext=history||remembering||
      any(t,/^(?:o cem|co jsme|co vsechno jsme|co vsechny jsme|na co jsme|o jakem|o jake|jaka temata|jaky rozhovor|kolik|pripomen)/);
    if (mutual&&asking&&((conversation&&conversationContext)||
      (questioning&&(history||remembering||directQuestion||directReply)))) {
      if(any(t,/\b(?:kolikrat|kolik (?:rozhovoru|debat|jsme toho)|jak casto)\b/))return {kind:'recall',mode:'count',text:t};
      if(any(t,/\b(?:vsechno|vsechny|vsechna|vsem|jaka temata|ktera temata|vse)\b/))return {kind:'recall',mode:'topics',text:t};
      if(any(t,/\b(?:na co jsem|na co jsme se te|co jsem se te|na co sem se te|jakou otazku|jaka byla moje otazka)\b/))
        return {kind:'recall',mode:'question',text:t};
      if(any(t,/\b(?:co jsi mi (?:odpovedel|odpovedela|rekl|rikal)|jak jsi mi odpovedel|jaka byla tvoje odpoved)\b/) ||
         history&&any(t,/\b(?:jsi mi|tys mi)\b/)&&any(t,/\b(?:odpovedel|odpovedela|rekl|rikal)\b/))
        return {kind:'recall',mode:'reply',text:t};
      return {kind:'recall',mode:'topic',text:t};
    }

    // Konkrétní paměť hráčova slibu. Jen pokud se ptá po VLASTNÍM slibu.
    if(any(t,/\b(?:slibil|sliboval|prislibil|slib)\b/)&&
       any(t,/\b(?:co jsem|co sem|pamatujes|vzpominas|jaky slib|na muj slib)\b/)&&
       any(t,/\b(?:ti|tobe|te|muj|me|jsem|sem)\b/))
      return {kind:'recall',mode:'playerPromise',text:t};
    return null;
  }

  // Otázka bez předmětu může mít smysl jen díky poslední promluvě.
  // Kontext nečteme od jiných postav ani přes jinou lokaci.
  function followupIntent(raw, context) {
    const t=fold(raw).replace(/^(?:(?:a|ale|no|tak|hele|vlastne|prosim) )+/, '');
    if (!context?.speaker || !context?.topic || context.room!=='cave' || context.speaker!=='wizard') return null;
    const topic=String(context.topic).replace(/^role:/,'');
    const known=new Set(['guard','portalBeyond','portalNature','stargazerFate',
      'stargazerRelation','dwarfsFate','winterOrigin','past','power','change',
      'time','freedom','fearOfLoss','regret','friendship','morality','human',
      'memory','form','silence','passage','light','raven','stargazer',
      'dwarfs','combat','bargain','mercy','surrender','threat','fear',
      'taunt','identity','loneliness','motive','portal','magic','escape',
      'greeting']);
    if(!known.has(topic))return null;
    const more=/^(?:a )?(?:co jeste|povez mi vic|rekni mi vic|pokracuj|muzes to rozvest|mluv dal|a potom|co bylo pak|co tim myslis|jak to myslis|proc to rikas|proc jsi to rekl|proc mi to rikas|proc si to myslis|a jak to vis|jak to vis|odkud to vis|to myslis vazne|a proc|proc)$/;
    if(!more.test(t))return null;
    // Zachováme původní dialogové linie včetně reakcí na útok a portál.
    return {kind:'wizardFollowup',topic,query:t};
  }

  function detect(raw, state) {
    const speaker=state?.room==='clearing'?'raven':state?.room==='cave'&&!state?.won?'wizard':null;
    if(!speaker) return null;
    const recall=recallIntent(raw);
    if(recall)return {...recall,speaker};
    return followupIntent(raw,state.dialogue);
  }
  return {normalize,recallIntent,followupIntent,detect};
})();
