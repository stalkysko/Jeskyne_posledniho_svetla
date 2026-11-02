// V0.11.8.18: návaznost řeči o hvězdářově prosbě a havranových potřebách.
// Pravidla přijímají normalizovanou češtinu. Nevydávají hráčské otázky za
// příkazy, nenabízejí řešení hádanek a pamatují si téma i mezi tahy.
globalThis.adventureRavenContext11814 = (() => {
  const memoryTopics = new Set([
    'promiseOrigin', 'duty', 'waiting', 'whyWaiting', 'vow', 'master',
    'words', 'feather', 'abandon', 'waitingTime', 'stargazerFriend',
    'ravenHunger', 'ravenPresentAction', 'ravenDay', 'ravenRange', 'ravenFamiliarity'
  ]);
  const has = (t, re) => re.test(t);

  function detect(raw, context) {
    const t = raw.replace(/^(?:(?:a|no|tak|ale|hele|havrane|prosim|takze) )+/, '').trim();
    const previous = context?.speaker === 'raven' && context.room === 'clearing'
      ? context.topic : null;
    const sameConversation = memoryTopics.has(previous);
    const promiseConversation = sameConversation && previous !== 'ravenHunger';
    const foodConversation = previous === 'ravenHunger';

    // Jídlo je předmětem rozhovoru, nikoli hledáním předmětu pro sloveso „jíst“.
    if (has(t, /\b(?:co|cim|kde|odkud|jak) (?:tu |tady |vubec |ted |v zime |v tom mrazu )?(?:jis|zeres|se zivis|se krmis|shanis jidlo|beres jidlo|hledas jidlo)\b/) ||
        has(t, /\b(?:z ceho zijes|co mas k jidlu|co tu mas k jidlu|kde beres potravu|kde sezenes jidlo|jak se uzivis|cim se nakrmis|co sezobnes)\b/))
      return 'foodSource';
    if (has(t, /\b(?:muzu|mohu|mohl bych|chci|rad bych) (?:ti )?(?:dat|prinest|nabidnout) (?:neco )?(?:k jidlu|jidlo|potravu|zradlo)\b/) ||
        has(t, /\b(?:mam ti dat neco k jidlu|chces neco k jidlu|pomohu ti sehnat jidlo)\b/))
      return 'foodHelp';
    if (has(t, /\b(?:musis|mel bys|mels bys|potrebujes|nemusis|muzes) (?:taky |take |vubec |aspon |neco |prece |se )*(?:jist|zrat|najist se|nacist se)\b/) ||
        has(t, /\b(?:nesmis hladovet|mel by ses najist|musis mit hlad|vzdyt potrebujes jidlo|nemas co jist)\b/))
      return 'foodConcern';
    if (has(t, /^(?:(?:to|ty|vubec|opravdu|porad|jeste|ani|takze|tak) )*(?:mas hlad|nemas hlad|hladovis|jsi hladovy|nejsi hladovy|uz mas hlad)(?: havrane)?$/))
      return 'foodHunger';
    if (has(t, /^(?:(?:ty|takze|tak|opravdu|vubec|vlastne) )*(?:nic nejis|nejis|nejis vubec|nezeres|zeres|jis|jis vubec|nepotrebujes jidlo|potrebujes jidlo)(?: havrane)?$/) ||
        has(t, /^(?:jak dlouho jsi nejedl|kdy jsi (?:naposledy )?jedl|kdy ses naposledy najedl)$/))
      return 'foodHabit';
    if (foodConversation && has(t, /^(?:a )?(?:jak to zvladas|a co kdyz nenajdes jidlo|mas ho dost|mas dost jidla|a co v zime|a kdyz je zima|jak prezijes|prezijes to)$/))
      return 'foodNeed';

    // Přímá otázka na prosbu hvězdáře musí mít přednost před obecným
    // slovem „hvězdář“, které jinak vyvolávalo nápovědu o kryptě a klíči.
    const mentionsRequest = has(t, /\b(?:rekl|rikal|povedel|pozadal|poprosil|prikazal|chtel|naridil|slibil|slibil jsi|prosil)\b/);
    const mentionsStay = has(t, /\b(?:zustan\w*|zustat|zustal\w*|cek\w*|cekat|pock\w*|hlid\w*|neodlet\w*)\b/);
    const mentionsStargazer = has(t, /\b(?:hvezdar\w*|on|mu|jemu)\b/);
    if (mentionsRequest && mentionsStay && mentionsStargazer &&
        has(t, /\b(?:hvezdar\w*|ti|te|tobe|mu|jemu|jsi)\b/) &&
        !has(t, /^(?:proc|z jakeho duvodu|k cemu)/))
      return 'promiseAsked';

    // Proč on požádal havrana? To je jiná otázka než proč havran dodržuje slib.
    if (has(t, /^(?:proc|z jakeho duvodu|k cemu)\b/) &&
        ((mentionsRequest && mentionsStay && mentionsStargazer) ||
         has(t, /\b(?:hvezdar\w*)\b.*\b(?:nechal|pozadal|poprosil|chtel)\b/) ||
         has(t, /\b(?:pozadal|poprosil|rekl|rikal|nechal)\b.*\b(?:hvezdar\w*)\b/)))
      return 'promiseWhyAsked';
    if (has(t, /^(?:proc|z jakeho duvodu) (?:ti |tobe |t )?(?:to |toto )?(?:rekl|rikal|povedel|naridil|prikazal)(?: ti)?(?: to)?$/) ||
        has(t, /^(?:proc|z jakeho duvodu) te (?:o to )?(?:pozadal|poprosil)$/)) {
      if (promiseConversation) return 'promiseWhyAsked';
      return 'promiseClarify';
    }

    if (has(t, /^(?:proc|z jakeho duvodu|k cemu) (?:tu|tady|na tom rozcesti) (?:mas|musis|chces|porad musis|porad mas) (?:cekat|sedet|zustat|byt|hlidat)(?: havrane)?$/) ||
        has(t, /^(?:proc (?:tu |tady )?(?:cekas|zustavas|sedis)|proc (?:tu |tady )?(?:porad )?(?:jsi|zustavas)|proc jsi mu to slibil|proc jsi mu slibil ze zustanes|proc jsi (?:se )?rozhodl zustat)$/))
      return 'promiseWhyWait';
    // „Kdo tě tu nechal?“ -> „A čekáš?“ musí navázat na právě vyslovený slib.
    // Bez předchozího hovoru o slibu krátkou otázku nepřebíráme.
    if (promiseConversation && has(t, /^(?:(?:ty|tu|tady|jeste|porad|stale|opravdu|takze|tak) )*(?:cekas|stale cekas|porad cekas|jeste cekas|cekas dal|cekas na nej|zustavas|jsi tu porad)(?: havrane)?$/))
      return 'promiseStillWaiting';
    if (has(t, /^(?:hvezdar|on) (?:ti |te )?(?:rekl|rikal|poprosil|pozadal) (?:at|aby|abys)\b/) && mentionsStay)
      return 'promiseAsked';
    if (has(t, /^(?:(?:a |tak |takze )?co ti (?:hvezdar |tehdy |naposledy )*(?:rekl|rikal)(?: (?:tehdy|naposledy|vlastne))?|jaka byla jeho posledni slova|co presne po tobe chtel)$/))
      return 'promiseWords';
    if (promiseConversation && has(t, /^(?:(?:a |tak )?(?:co pak|co potom|a co potom|a potom|co se stalo potom|co bylo pak|co se delo dal))$/))
      return 'promiseAfter';
    if (promiseConversation && has(t, /^(?:(?:a |ale )?co kdyz se nevrati|co kdyz se nikdy nevrati|co kdyz uz se nevrati|jak dlouho jeste vydrzis|prestanes nekdy cekat)$/))
      return 'promiseDoubt';
    if (promiseConversation && has(t, /^(?:(?:a |ale )?proc|proc to|proc vlastne|a proc to udelal|a proc te o to zadal|jak to myslis|co tim myslel)$/))
      return 'promiseWhyAsked';
    if (foodConversation && has(t, /^(?:a proc|proc|a jak to|jak to myslis)$/))
      return 'foodNeed';
    return null;
  }

  const replies = {
    promiseAsked: [
      'Havran na okamžik přestane přešlapovat. „Ano. Hvězdář mi řekl: Zůstaň na cestě. Kdyby sem někdo přišel hledat světlo, ukaž mu směr. Nebyl to rozkaz. Poprosil mě — a já mu to slíbil.“',
      '„Požádal mě, abych počkal,“ přikývne havran. „Byl to můj přítel, ne pán. Kdybych chtěl, mohl bych odletět. Právě proto si toho slibu tolik vážil.“'
    ],
    promiseWhyAsked: [
      'Havran se podívá na zasněženou stezku. „Řekl, že tudy možná jednou půjde někdo, kdo bude hledat světlo. Nechtěl, aby v té zimě zabloudil. Proč byl tak přesvědčený, že někdo přijde, mi už nevysvětlil. A já se tehdy nezeptal.“',
      '„Když mě o to žádal, pořád se ohlížel k horám,“ vzpomíná havran. „Myslím, že měl strach o ty, kdo přijdou po něm. Možná věděl víc. To už bych si ale jen domýšlel.“',
      'Havran sklopí zobák. „Mohl jsem se zeptat proč. Místo toho jsem řekl ano. Myslel jsem, že se vrátí a všechno mi poví. Člověk — i havran — občas promarní tu správnou otázku.“'
    ],
    promiseWhyWait: [
      '„Protože jsem mu to slíbil,“ odpoví havran. „Nejsem přivázaný k ceduli, rytíři. Každé ráno se mohu zvednout a odletět. Ale ještě sem může někdo přijít a potřebovat ukázat cestu.“',
      'Havran si načechrá peří. „Ten slib jsem dal, když ještě nebyl sníh. Tehdy se mi zdál lehký jako pírko. Dnes už tak lehký není.“',
      '„Čekám, protože jsem se tak rozhodl,“ řekne tiše. „A také proto, že zatím nevím, jak se loučí s někým, kdo se nevrátil.“'
    ],
    promiseStillWaiting: [
      '„Čekám,“ přikývne havran. „Každé ráno bych mohl odletět. Ale dal jsem mu slovo — a ještě může přijít někdo, kdo bude potřebovat ukázat cestu.“',
      'Havran se zadívá do sněhu. „Pořád. Někdy se sám sebe ptám, jestli čekám na něj, nebo na někoho, koho sem poslal. Zatím zůstávám.“',
      '„Ano,“ řekne prostě. „Slib se nedá položit na zem jako kámen a zase zvednout, až se ti zachce.“'
    ],
    promiseWords: [
      '„Zůstaň na cestě,“ zopakuje havran pomalu. „A kdyby přišel někdo, kdo hledá světlo, ukaž mu směr.“ Na okamžik zmlkne. „Tak málo slov. A kolik zim se do nich vešlo.“',
      '„Pamatuji si každé slovo,“ řekne havran. „Spíš mě tíží ta, na která jsem se nezeptal.“'
    ],
    promiseAfter: [
      '„Pak odešel,“ řekne havran. „Chvíli jsem čekal na jeho kroky. Pak na první jaro. A pak jsem přestal počítat. Nikdy mi neřekl, že mám čekat tak dlouho.“',
      'Havran zobákem setře sníh z cedule. „V létě se tu dalo spát v korunách. Teď každou noc poslouchám, jestli se někdo blíží. Občas si spletu vítr s kroky.“'
    ],
    promiseDoubt: [
      '„Té možnosti se bojím,“ připustí havran. „Ale nejsem si jistý, že odejít znamená zapomenout. Jen ještě nedokážu poznat, kdy nastal čas.“',
      '„Možná už se nevrátí,“ řekne havran. „Jednou se s tím budu muset smířit. Dnes ještě chci ukázat cestu tomu, kdo přijde.“'
    ],
    promiseClarify: [
      'Havran nakloní hlavu. „Myslíš, proč mě hvězdář požádal, abych zůstal? Pověděl mi, že sem možná přijde někdo hledat světlo. Více mi tehdy neřekl.“',
      '„Jestli mluvíš o hvězdářově prosbě, neumím říct všechno,“ odpoví havran. „Požádal mě o pomoc poutníkům. Co přesně předvídal, jsem se nedozvěděl.“'
    ],
    foodConcern: [
      'Havran překvapeně zamrká. „Musím, samozřejmě. A je od tebe hezké, že na to myslíš. Jen si představ, jak málo dobrého jídla se dá vyhrabat pod takovou vrstvou sněhu.“',
      '„Kdyby se dalo najíst slibů, byl bych nejtlustší havran v údolí,“ odvětí. „Bohužel se musí hledat něco skutečného.“'
    ],
    foodHabit: [
      '„Jím,“ opraví tě havran. „Jen ne pravidelně jako lidé u stolu. Někdy najdu semínka a zmrzlé bobule, jindy musím letět za potravou dál.“',
      '„Kdybych nejedl, dávno bych tu neseděl,“ odpoví. „Hvězdáři jsem slíbil, že zůstanu na cestě, ne že přestanu pečovat o sebe.“'
    ],
    foodHunger: [
      '„Někdy mám,“ přizná havran. „Zvlášť když přes noc napadne sníh a zakryje, co se dalo sezobnout. Pak musím vyletět hledat potravu dál.“',
      'Havran si načechrá peří. „Hlad ano. Ale ne pořád. Když se mi poštěstí něco najít, najím se. Slib přece neznamená, že mám umřít na rozcestí.“'
    ],
    foodSource: [
      '„Pár zmrzlých bobulí, semínka, občas něco pod kůrou,“ vypočítává havran. „Na rozcestí se nedá prostřít stůl. Ale pořád jsem dost vynalézavý, abych se dožil dalšího rána.“',
      '„Hledám, co se dá,“ řekne havran. „Lidé si myslí, že ptáci žijí jen ze zpěvu. Zkus to někdy říct prázdnému žaludku.“'
    ],
    foodHelp: [
      'Havran se na tebe zadívá o něco déle. „Děkuji, rytíři. Jestli někdy najdeš něco k snědku, nebudu dělat hrdinu. Ale kvůli mně se do nebezpečí nepouštěj.“',
      '„To je laskavé,“ pronese havran. „Nabídku si zapamatuji. Nemusíš pro mě ale hledat hostinu; stačí, že ses zeptal.“'
    ],
    foodNeed: [
      'Havran sevře pařáty kolem dřeva. „Hlad se dá chvíli přetrpět. Když přiletí další mráz, musím hledat o to déle. Takhle to je, i když umím mluvit.“',
      '„Nějak přežívám,“ řekne havran. „Jen bych byl raději, kdybys nemusel zkoušet totéž.“'
    ]
  };

  function respond(topic, b) {
    b.contextTalk11814 ||= {counts:{},lastIntent:null};
    const memo = b.contextTalk11814;
    const n = memo.counts[topic] || 0;
    memo.counts[topic] = n + 1;
    memo.lastIntent = topic;
    const lines = replies[topic];
    return {text:lines[n % lines.length],stage:n};
  }

  return {detect,respond};
})();
