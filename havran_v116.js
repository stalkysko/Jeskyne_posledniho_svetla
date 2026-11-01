// V11.6: ručně psané rozhovory a paměť vztahu. Bez cloudu a bez LLM.
// Tato vrstva rozpoznává jen společenské výroky. Příkazy k cestě a hádanky
// zůstávají v původním herním parseru.
globalThis.adventureRaven115 = (() => {
  const rules = [
    ['capture', /\b(chytit|chytim|polapit|svazat|privazat|lapit|odchytit|spoutat)\b.*\b(havran|havrana|ptaka|krkavce|lanem|provazem)\b|\b(havrana|ptaka)\b.*\b(svazat|chytit|do pytle)\b/],
    ['harm', /\b(ublizim ti|zabiju te|zabiju havrana|vytrhnu ti peri|hodim po tobe kamenem|rozmlatim ti zobak|zmlatim te)\b/],
    ['insult', /\b(hloupy havran|hloupy ptak|jsi blby|jsi hloupy|jsi k nicemu|nenavidim te|nechci te tu|sklapni zobak|drz zobak|mlc havrane)\b/],
    ['sorry', /^(promin|prominte|omlouvam se|mrzi me to|odpust mi|nechtel jsem ti ublizit|uz ti neublizim)(?: |$)/],
    ['salute', /^(havran|havrane|krkavce|ptaku|ptacku|hej havrane|halooo havrane|haloo havrane|jeste jsi tu|slysis me|jsi tam|ozvi se|co|coze)[?!. ]*$/],
    ['proud', /\b(jsi dobry havran|jsi hodny havran|jsi skvely havran|jsi statecny|jsi sikovny|jsem na tebe hrdy|mam te rad havrane|jsi muj pritel|jsi muj kamarad|mas hezke peri|jsi krasny ptak|pekny havran)\b/],
    ['ring', /\b(proc mas (?:ten |takovy )?krouzek|odkud mas krouzek|kdo ti dal ten krouzek|kdo ti dal krouzek|kdo ti nasadil krouzek|co znamena tvuj krouzek|proc mas na noze krouzek)\b/],
    ['master', /\b(kdo (?:byl|je) (?:tvuj|tvym) (?:pan|panem)|kdo te tu nechal|kdo te tady nechal|kdo ti rekl .*cek|kdo ti rekl .*zustat|kdo ti rekl .*musis (?:tu|tady) (?:byt|zustat|cekat)|kdo ti naridil .*zustat|kdo te pozadal .*zustat|kdo ti prikazal|kdo ti dal ten ukol|komu jsi slibil|pro koho tu cekas|kdo te tu nechal samotneho|nechal te tu samotneho|opustil te hvezdar|opustil te tvuj pan)\b/],
    ['stargazerFriend', /\b(byl (?:to )?(?:tvuj|tvym) (?:pritel|pritelem)|byl (?:to )?tvuj kamarad|byli jste pratele|jste pratele|byli jste kamaradi|jste kamaradi|mel jsi (?:ho|hvezdare) rad|meli jste se radi|hvezdar byl tvuj pritel|hvezdar byl tvuj kamarad|byl pro tebe pritel)\b/],
    ['findStargazer', /\b(mam hvezdare najit|mam najit hvezdare|mel bych hvezdare najit|muzu hvezdare najit|mohu hvezdare najit|chces (?:abych|abch|aby) hvezdare nasel|chtel bys (?:abych|abch) hvezdare nasel|chces at hvezdare najdu|mam hvezdare hledat|mam ho najit|chces (?:abych|abch) ho nasel|pomohlo by kdybych hvezdare nasel|mam zjistit co se stalo hvezdari|mam patrat po hvezdari)\b/],
    ['nextStep', /^(?:a )?(?:co (?:tedy |ted |vlastne )?mam udelat|co mam pro tebe udelat|co mam delat abych ti pomohl|co bych (?:pro tebe )?mel udelat|co (?:tedy )?ode me chces|jak (?:tedy |ted )?mam pomoct|jak mohu pomoci abych ti pomohl|a co dal mam udelat)$/],
    ['watch', /\b(musis (?:tu|tady) hlidat|co (?:tu|tady) hlidas|hlidas (?:tu|tady) cestu|pomahas (?:lidem|poutnikum)|ukazujes\s*cestu|radis (?:lidem|poutnikum)|jsi tu jako hlidac|jsi strazce|koho hlidas|co strazis)\b/],
    ['freedom', /\b(budes svobodny|budes volny|osvobodim te|pustim te na svobodu|az uspeju|az to dokazu|nemusis tu zustat|uz budes moct odejit|uz nebudes muset cekat|mu zes byt svobodny|muzes byt svobodny|nejsi vezen|nejsi v kleci)\b/],
    ['promise', /\b(mas me slovo|mas moje slovo|davam ti sve slovo|slibuju ze|slibuji ze|vratim se za tebou|vratim se pro tebe|az se vratim|pockej na me|prijdu zpet|urcite se vratim|nezapomenu na tebe|nezapomenu na tebe havrane|dodrzim slib)\b/],
    ['escort', /\b(muzes letet se mnou|muzes letet za mnou|mohl bys letet se mnou|muzes se mnou letet|poletis se mnou|chces jit se mnou|chces se mnou jit|muzu te vzit s sebou|mohu te vzit s sebou|muzu te vzit sebou|pujdes se mnou|polet se mnou|nepujdes se mnou|az se vratim budes moct jit se mnou|budeme cestovat spolu|pojdes se mnou)\b/],
    ['flight', /\b(muzes (?:ted )?odletet|muzes odletnout|muzes odletnout z|odletet z rozcestniku|muzes odletet z toho rozcestniku|proc jen neodletis|kam bys odletel|kde bys chtel letat|zkus se proletet|roztahni kridla)\b/],
    ['touch', /\b(muzu te pohladit|mohu te pohladit|nechas se pohladit|muzu si na tebe sahnout|muzu se te dotknout|mohu se te dotknout)\b/],
    ['warm', /\b(chces zahrat|chces se zahrat|je ti chladno|je ti zima|neni ti zima|muzu te zahrat|mohu te zahrat|prinesu ti teplo|postavim ti lucernu|muzes se ohrat|muze te lucerna zahrat|mas na sob.? snih|mas na sobe snih|jsi promrzly|nezmrznes tu|nechces pod strechu)\b/],
    ['hurt', /\b(ublizil ti nekdo|nekdo ti ublizil|nekdo te zranil|jsi zraneny|boli te neco|co te boli|stalo se ti neco zleho|ublizoval ti hvezdar)\b/],
    ['lonely', /\b(jsi opusteny|jsi osamely|jsi tu sam|jsi sam|nejsi smutny|nebud smutny|nebud smutny havrane|je ti smutno|musis byt osamely|jsi samotar|nechybi ti spolecnost|chces spolecnost)\b/],
    ['feelings', /\b(jak se citis|jakou mas naladu|trapi te neco|co te trapi|jsi v poradku|jak ti dnes je|myslis si ze to bude dobre|jsi stastny|co te rozveseli|co te rozesmeje)\b/],
    ['long', /\b(jsi tu dlouho|sedis tu dlouho|jak dlouho uz sedis|jak dlouho cekas|jak dlouho tu budes|jak dlouho jsi tu sam|pamatujes nejake jaro|musis tu sedet vecne)\b/],
    ['birds', /\b(vsichni havrani|ostatni havrani|jini havrani|ostatni ptaci|mluvi ostatni havrani|premysli havrani|ostatni krkavci|mas nejake kamarady)\b/],
    ['bird', /\b(ty nejsi clovek|jsi jen havran|jsi opravdu havran|jsi ptak|jsi clovek nebo havran|jsi kouzelny havran|proc mluvis jako clovek|jsi zacarovany|maji havrani takovou pamet)\b/],
    ['trust', /\b(duverujes mi|veris mi|dokazes mi verit|muzeme byt pratele|chces byt muj pritel|chces byt muj kamarad|muze mi verit|jsme uz kamaradi|jsme pratele|muzu se na tebe spolehnout|muze se na tebe spolehnout)\b/],
    ['together', /\b(pockam tu s tebou|budu ti delat spolecnost|sednu si k tobe|sednu vedle tebe|muzeme spolu mluvit|neopustim te|zustanu s tebou|poslechnu si te|chces si povidat)\b/],
    ['care', /\b(co pro tebe muzu udelat|co pro tebe mohu udelat|muzu ti pomoct|mohu ti pomoct|jak ti pomuzu|jak ti mohu pomoci|potrebujes moji pomoc|nechces pomoct|pomuzu ti|postaram se o tebe)\b/],
    ['guide', /\b(ukazes mi cestu|muzes mi ji ukazat|muzes mi cestu ukazat|muzes mi ukazat cestu|muzes me dovest|jak se dostanu k vezi|dovedes me|ukaz mi kudy|kudy mam jit|kudy se mam vydat|radis mi kudy jit|kam mam jit)\b/],
    ['return', /\b(vratil jsem se|zase jsem tady|jsem zpatky|pris el jsem zpet|prisel jsem zpet|slib jsem splnil|vidis jsem zpet|poznal jsi me|tesi te ze jsem zpet)\b/],
    ['weather', /\b(je ti pod snehem|pada na tebe snih|snih ti pada na hlavu|vitr ti cupuje peri|zmrzla ti kridla|mas mokre peri|jak snasis mraz)\b/],
    ['farewell', /\b(davej na sebe pozor|bud opatrny|lou cim se|lou cim|zatim havrane|uvidime se havrane|jdu ale vratim se|mej se havrane)\b/]
  ];

  const lines = {
    capture: [
      'Havran prudce odskočí. „Lano je na most, rytíři. Já nejsem kořist.“',
      'Z černých křídel odlétne sníh. „Ještě jednou po mně sáhni s provazem a uvidíš mě naposled.“',
      '„Od někoho, kdo mluvil o přátelství, bych čekal trochu jiné uzly,“ odsekne havran.'
    ],
    harm: ['Havran se vztyčí. „Tak teď už vím, že se mám bát i tebe.“','„Hvězdář mě naučil rozumět slovům. Těmhle bych raději nerozuměl.“'],
    insult: ['Havran si uhladí peří. „Kdo neumí naslouchat, tomu můj zobák mnoho neřekne.“','„Vrána by ti možná odpověděla stejně. Já mám dnes trpělivosti méně.“'],
    sorry: ['„Slyšel jsem tě,“ řekne havran opatrně. „Příště mi to raději ukaž skutky.“','Havran chvíli mlčí. „Dobrá. Ale křídla se mi ještě třesou.“'],
    salute: ['Havran se natočí k tvému hlasu. „Ano, rytíři? Stále mám uši. Tedy něco podobného.“','„Krá. Mluv. Na mráz mám času dost.“','„Slyším tě,“ odpoví. „Na tom rozcestí ještě nikdo nezmizel tak rychle jako odpověď na jednoduchou otázku.“'],
    proud: ['Havran si nadme peří. „A to říkáš dobrovolně? Zajímavé. Hvězdář mi takové věci moc neříkal.“','„Děkuji,“ odpoví zcela vážně. Pak se ošije. „Teď mi prosím dovol být zase důstojný pták.“','Havran nakloní hlavu. „Možná se s tebou nakonec nemusím jen hádat.“'],
    ring: ['Havran zvedne nohu. „Hvězdář mi ho dal, abych se mu neztratil. Teď je to spíš on, kdo se ztratil mně.“','„Vidíš slunce? Hvězdář tvrdil, že jednou ten znak poznám i potmě. Raději bych tehdy věděl, co tím myslel.“'],
    master: ['Havran ztichne. „Hvězdář. Ale nebyl můj pán. Byl můj přítel. Prosil mě, abych počkal.“','„Ten, kdo by mě mohl zavolat zpátky, už dlouho nepřišel,“ odpoví. „Jmenoval se hvězdář. Pro mě to bylo dost.“'],
    stargazerFriend: ['„Ano,“ přikývne havran. „Hvězdář mě znal dávno před touhle zimou. Nepřikázal mi zůstat. Jen mě o to poprosil.“','„Byli jsme,“ zakráká tiše. „Já mu občas překážel v práci, on mi vyprávěl o hvězdách. Ne každé přátelství potřebuje slova.“'],
    findStargazer: ['Havran sklopí hlavu. „Kdybys zjistil, co se s ním stalo, byl bych ti vděčný. Jen mi neslibuj, že ho přivedeš zpátky.“','„Zkus to,“ řekne havran. „Nečekám zázrak. Chci jen vědět, proč se nevrátil.“'],
    nextStep: ['„Jestli chceš pomoci mně, zjisti, co se stalo hvězdáři,“ řekne havran. „Já tu zatím počkám.“','„Nespěchej s přísliby,“ odpoví havran. „Zatím se rozhlédni. Ta zima nepřišla sama.“'],
    watch: ['„Hlídám cestu,“ opraví tě havran. „Ne proto, že bych musel. Protože sem stále může přijít někdo, kdo neví, co ho čeká.“','„Když jde kolem člověk, poradím. Když je to liška, raději mlčím. A když se ptá na příliš mnoho věcí, bývá to rytíř.“'],
    freedom: ['Havran se podívá k obloze. „Svobodný jsem i teď. Jen jsem si ještě nedovolil odletět.“','„Až zima skončí, zkusím se rozhodnout sám,“ odpoví. „To bude první opravdový let po mnoha letech.“'],
    promise: ['Havran přestane přešlapovat. „Se sliby opatrně, rytíři. Znějí lehce, dokud je člověk nemusí nést.“','„Budu si to pamatovat,“ pronese tiše. „A jestli se vrátíš, možná ti poprvé uvěřím hned.“'],
    escort: ['„Letět bych mohl,“ roztáhne havran křídla. „Ale ten slib mě drží tady. Alespoň prozatím.“','„Děkuji za pozvání,“ řekne havran. „Je zvláštní, když tě někdo chce s sebou, a ne jen někam poslat.“'],
    flight: ['„Odletět umím,“ zkusmo mávne křídly. „Jen ne všechno, co dokážeš, také musíš udělat.“','„Mohl bych už teď sedět na komíně mlýna. Ale kdo by tu pak nadával na špatně uvázané uzly?“'],
    warm: ['Havran se načepýří. „Zahřát? Můžeš lucernu přiblížit. Ale prosím opatrně. Ohořelý havran není příliš důstojný pohled.“','„Trochu mrznu,“ přizná. „Zkus na mě mluvit. To mi zatím pomáhá lépe než plamen.“'],
    hurt: ['„Teď ne,“ zavrtí havran hlavou. „Hvězdář mě kdysi našel se zlomeným křídlem. Uzdravil mě.“','„Někdy bolí čekání víc než rána. Ale peří i zobák mám naštěstí celé.“'],
    lonely: ['Havran se zadívá do sněhu. „Sám ano. Opuštěný? To slovo jsem si ještě netroufl použít.“','„Když si se mnou povídáš, je tu alespoň chvíli zase někdo,“ přizná tiše.'],
    feelings: ['„Dnes mi je o něco lépe,“ řekne havran. „Třeba proto, že ses zeptal.“','Havran chvíli hledá slovo. „Jsem unavený. Ale ještě nejsem bez naděje.“'],
    long: ['„Nejdřív jsem počítal dny. Pak zimy,“ řekne. „Teď raději počítám poutníky, kteří se vrátili.“','„Kdysi býval ten rozcestník zelený mechem,“ vzpomíná. „To už je dlouho.“'],
    birds: ['„Ne všichni havrani mají tolik času na přemýšlení,“ odvětí. „Většina má rozum a odletí před zimou.“','„Znal jsem celé hejno. Netuším, kde je mu konec. Ale rozhodně bych jim takhle dlouhé řeči nevykládal.“'],
    bird: ['Havran uraženě zakráká. „Samozřejmě jsem pták. Copak nevidíš peří?“','„Hvězdář mě učil slova,“ odpoví. „Ale člověkem jsem se nestal. Díkybohu, dva páry bot bych nesnesl.“'],
    trust: ['„Důvěra se pozná podle toho, co uděláš, až se otočím zády,“ praví havran.','„Jestli se vrátíš, až ti ode mě nic nebude potřeba, pak ti odpovím.“'],
    together: ['Havran poskočí o kus blíž. „Klidně si sedni. Místo na zemi je celé tvoje.“','„Za chvíli ti bude zima,“ poznamená. „Ale budu rád, když tu tu chvíli budeš.“'],
    care: ['Havran se odmlčí. „Ptáš se, jestli potřebuji pomoc já? To se tu ještě nikdo nezeptal.“','„Kdybys dokázal té zimě zabránit, pomohl bys všem,“ řekne. „Mně prozatím stačí, že mě posloucháš.“'],
    guide: ['Havran ukáže zobákem na sever. „Tam je most. Na západě stojí mlýn. Sám vyber cestu a nezapomeň se vrátit.“','„Létal jsem nad oběma cestami. Poradit ti mohu. Ale když půjdeš, budeš se muset dívat i vlastníma očima.“'],
    return: ['Havran zvedne hlavu. „Poznal jsem tvůj krok. Opravdu ses vrátil.“','„Tak vidíš,“ řekne a trochu zjihne. „Jedna věc, které jsem se bál uvěřit, se právě stala.“'],
    weather: ['Havran se oklepe a shodí z peří několik vloček. „Sníh mi nevadí. Vadí mi, že už nepřestává.“','„Mám dost peří,“ odsekne. „Ale trochu jara by se mi hodilo víc.“'],
    farewell: ['Havran tě sleduje. „Dávej pozor, rytíři. Lidé jsou na sliby lehčí než ptáci.“','„Zatím,“ zakráká. „Pokud se vrátíš, budu zase na téhle ceduli.“']
  };
  function detect(t) {
    // Příkazy jako „jdi sever“, „seber lano“ či „pohladit havrana“ mají
    // přednost v herním parseru. Výjimkou jsou pokusy o chycení ptáka.
    if(t==='vratim se'||t==='mas me slovo')return 'promise';
    return rules.find(([,pattern])=>pattern.test(t))?.[0] || null;
  }
  function respond(topic,t,b,context) {
    b.relationCounts ||= {};
    const n=b.relationCounts[topic]||0;b.relationCounts[topic]=n+1;
    b.met=true;
    const previousTopic=context?.topic||b.lastConversationTopic||null;
    if(topic!=='nextStep')b.lastConversationTopic=topic;
    if(topic==='capture'||topic==='harm') {
      b.harmed++;b.trust=Math.max(-8,b.trust-(n?1:3));b.pending=null;
    } else if(topic==='insult')b.trust=Math.max(-8,b.trust-(n?0:1));
    else if(topic==='sorry') {
      if(b.harmed>b.apologies){b.apologies++;b.trust=Math.min(8,b.trust+1)}
    } else if(['proud','warm','care','together','trust','promise','escort'].includes(topic)&&n===0) {
      b.trust=Math.min(8,b.trust+1);
    }
    if(topic==='promise')b.promiseMade=true;
    if(['care','warm'].includes(topic))b.helpOffered=(b.helpOffered||0)+1;
    if(topic==='capture'&&b.harmed===1)return lines.capture[0];
    if(b.harmed>b.apologies&&['proud','trust','together','escort','care'].includes(topic))return 'Havran poodstoupí. „Ještě si pamatuji tvoje ruce a lano. Nejdřív mi ukaž, že ti mohu věřit.“';
    if(topic==='trust'&&b.trust>=5)return 'Havran přiletí na nižší příčku cedule. „Ano. Myslím, že jsme přátelé. A raději to nikomu neříkej.“';
    if(topic==='escort'&&b.trust>=5&&b.promiseMade)return '„Když se vrátíš a ta zima skončí, možná s tebou skutečně poletím,“ přizná havran. „Dnes ještě zůstanu.“';
    if(topic==='freedom'&&b.trust>=5)return '„Až se vrátíš,“ řekne havran, „pokusím se ten slib konečně pustit. Ale musí to být moje rozhodnutí.“';
    if(topic==='return'&&b.promiseMade)return 'Havran sklouzne z cedule blíž k tobě. „Slib jsi dodržel. Na tohle si budu pamatovat déle než na jakoukoli zimu.“';
    if(topic==='nextStep'&&['care','offerHelp','stargazerFriend','master','findStargazer'].includes(previousTopic)){
      if(previousTopic==='findStargazer')return '„Jen zjisti pravdu,“ řekne havran. „Až se vrátíš, povíš mi ji. Víc po tobě nežádám.“';
      return lines.nextStep[0];
    }
    return lines[topic][n%lines[topic].length];
  }
  return {detect,respond};
})();
