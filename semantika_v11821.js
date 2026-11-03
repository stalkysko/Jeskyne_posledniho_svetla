// V0.11.8.21 – kontextový český parser. Rozlišuje význam věty, mluvčího,
// přítomnou scénu a již proběhlé události. Bez sítě, deterministicky.
// Fyzické činnosti nesmějí sklouznout do přesunu, otázky do útoku.
globalThis.adventureSemantics11821 = (() => {
  'use strict';
  const norm = s => String(s || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const has = (s, re) => re.test(s);
  const creature = /\b(?:havran|havrana|havrane|havranovi|ptaku|krkavec|krkavce|krkavci)\b/;
  const star = /\b(?:hvezdar|hvezdare|hvezdari|hvezdarem|astronom|astronoma|pritel|pritele|kamarad|kamarada)\b/;
  const death = /\b(?:mrtv\w*|nezije|nezil|zije|zil|zemrel|zemrela|umrel|umrit|zemrit|zahynul|zahynout|zesnul|pochovan|pohreb|hrob|zabit|zabil|zabila|zavra\w*|ublizil|ublizit|stalo|prihodilo|osud|ztratil|odešel|odesel)\b/;
  const sword = /\b(?:mec|mece|mecem|meci|mecik|cepel|cepeli|ostri|ostrim|zbran|zbrani|jilcem|jilec|hrotem)\b/;
  const door = /\b(?:dvere|dveri|dverim|dvermi|vrata|vrat|vraty|f(os|osn)y|fo(s|sn)en|vratka|vchod|dverni)\b/;
  const crack = /\b(?:spona|sponu|spony|sponou|sp(o|a)ru|sp(a|o)re|predmet|predmetu|predmetem|veci|vec|lesk\w*|kov\w*|odlesk\w*|blesk\w*|zablesk\w*|to|ho|jej|ji|tam|ten|neco|pod ni|pod tim|zrezl\w*)\b/;
  const wizard = /\b(?:carodej\w*|cernokneznik\w*|kouzelnik\w*|mag|maga|magu|magem|magovi|nekromant\w*|zaklinac\w*|strazce|pane ledu)\b/;
  const questionStart = /^(?:co|jak|proc|kdo|kdy|kde|kam|kudy|zda|jestli|vis|vite|myslis|moh\w*|muz\w*|bude|budeme|jsem|jsi|je|neni|nebyl|uz|a|takze|opravdu|vazne)\b/;
  const cmd = (kind, t, extra={}) => ({kind,t,...extra});

  function detect(raw, context={}) {
    const t=norm(raw), room=context.room, previous=context.dialogue || null;
    if (!t) return null;
    const after=Boolean(context.won);
    // Inspekce scény není věta k NPC, i když čaroděj přímo stojí před námi.
    if (/^(?:(?:chci|zkusim|pokusim se) )?(?:prozkoumat|prozkoumej|prozkoumam|prohlidnout|prohlidni|prohlednout|rozhlidnout se|rozhlidni se|rozhlizet se|rozhlidnout|rozhlidnout se|rozhlizim se|porozhlednout se|rozhl[eia]dnout se|rozhl[eia]dni se|rozhl[eia]dnu se|podivat se kolem|kouknout se kolem|podivej se kolem|obhlidnout|obhlidni|zmapovat|zkontrolovat)(?: (?:si|tu|tady|to tady|cele|celou|celou tu|tu celou|mistnost|mistnosti|jeskyni|jeskyne|okoli|prostor|vse|vsechno|vsechno kolem|okolni prostor|co tu je|kolem sebe))*$/.test(t) ||
        /^(?:chci |zkusim )?(?:prozkoum\w*|prohl[eid]\w*|prohledn\w*|rozhl\w*|rozhled\w*|porozhled\w*|obhlid\w*|zmapov\w*|zkontrolov\w*)(?: si| se)?(?: (?:celou |cel[eé] |tu |tuhle |tohle |vsechno |zdejsi )?(?:mistnost|jeskyni|jeskyne|okoli|prostor|lokaci|misto|vsechno|kolem sebe|kolem|zde))?$/i.test(t) ||
        /^(?:prozkoumat|prozkoumej|prozkoumam|prohlidnout|prohlidni|prohlednout|rozhl[eia]dnout se|rozhl[eia]dni se|rozhlednout se|rozhledni se|rozhlednout|rozhl[eia]dnout|rozhl[eia]dni|porozhlednout se|kouknout kolem sebe|prozkoumat okoli|prozkoumat jeskyni|prozkoumat mistnost)$/.test(t))
      return cmd('survey',t);
    if (room==='observatory') {
      const explicitBook=/\b(?:denik|deniku|zapisnik|zapisniku|knihu|kniha|zapisky|list|strank\w*|text)\b/;
      const continuation=/^(?:a |tak |no |jeste )?(?:(?:cist|cti|ctu|precti|precist|prectu|docist|docti|pokracovat|pokracuj|cist dal|cti dal|precti dal|prolistovat|prolistuj|listovat|listuj|otocit|otoc|otoc dalsi|dal|dalsi|dalsi strana|dalsi stranka|dalsi list|dal bych si precetl|co je dal|co nasleduje|co je na dalsi strane|precti nasledujici|co tam pise)(?:\s+(?:dale|dal|jeste|denik|zapisnik|list|stranu|stranku|listy|dalsi stranu|dalsi stranku|dale v deniku|az do konce))?)$/;
      if (explicitBook.test(t)&&/\b(?:cist|cti|ctu|precist|precti|docist|prolistovat|listovat|otocit|otoc|co je)\b/.test(t))return cmd('journal',t);
      if (context.diaryReads>0&&(continuation.test(t)||/^(?:cist|cti|dal|dalsi|pokracuj|otoc list|otoc stranku|precti dalsi stranku)$/.test(t)))return cmd('journal',t);
    }
    if (room==='mill' && door.test(t)) {
      if (/\b(?:zatlouct|zatluct|zatloukam|klepat|zaklepat|zaklepu|zaklepej|klepni|zabouchat|bouchat|buse?t|busit|busim|bus|tukat|tuknout|tukni|zaklepat si|zatukat|zvone?n(i|it)|zabu(s|s)im)\b/.test(t)&&!/^bouchat do\b/.test(t))return cmd('millKnock',t,{force:/\b(?:busit|busim|bus|zabouchat|bouchat|silne|poradne|prudce|hlasit[e]?|pesti|zatlouct)\b/.test(t)?'hard':'soft'});
      if (/\b(?:vyrazit|vyrazim|vyraz|vyrazeni|rozrazit|rozrazim|rozraz|vykopnout|vykopnu|kopnout|kopat|kopni|kopnu|rozbit|rozbij|rozmlatit|rozmlatim|roztriskat|prorazit|prorazim|proraz|narazit|vrazit|uderit|udri|prastit|prastim|bouchat|ramenem|kopem|kopackou|rozbehnout)\b/.test(t))return cmd('millBatter',t,{method:sword.test(t)?'sword':/\b(?:kop\w*|vykop\w*|nohou|botou|kopem)\b/.test(t)?'kick':/\b(?:ramen\w*|nabehn\w*|rozbeh\w*)\b/.test(t)?'shoulder':'force'});
      if (/\b(?:otevrit|otevri|klik\w*|odemknout|odemkni|strcit|tlacit|zatlacit|vlezt|vstoupit)\b/.test(t))return null;
    }
    if (room==='clearing') {
      // Pohyb je rozkaz pouze při jasném slovesu a bez otázky.
      if (/^(?:jdi|jit|jdu|pujdu|bez|bezet|vyrazit|vyraz|vydej se|vydat se|chci jit|zajit|dojit|dojdi|kracet|kracej|pokracuj|pokracovat|presunout se|vydam se) (?:k |ke |do |na |za )?(?:tomu |staremu |opustenemu )?(?:mlejnu|mlejn|mlejna|mlyna|mlyn|mlynu)(?: prosim)?$/.test(t)&& !/[?]/.test(raw))return cmd('millTravel',t);
    }
    if (room==='bridge') {
      const focus=Boolean(context.ledgeInspected||context.bridgeFocus==='glint'||context.lastWorld==='spona'||context.glintSeen);
      const leverage=/\b(?:uvolnit|uvolni|uvolnim|vyprostit|vyprost|vyprostim|vypacit|vypac|pacit|pac|odpacit|odlepit|odloupnout|podebrat|podeber|podepr[eia]t|vyzvednout|vysunout|vystrcit|vyndat|vyndej|vyjmout|vyjmi|vytahnout|vytahni|vytahneme|dostat|dostat ven|ziskat|vydolovat|vydloubnout|vydloubni|vydobyt|vypichnout|odklinit|vyklinit|vysparat|vyskrabnout|odsoupnout|odsunout|odstrcit|pohnout|pohnu|zvednout|zvedni|odstranit|odhalit|uvolnovat|zachytit|zaseknout|pouzit|pouzij|seknout|sekni|podsunout|zasunout|strcit|vsunout|narazit|tlacit)\b/;
      const against=/\b(?:na|pod|s|se|do|o|proti|pomoci|s pomoci)\b/;
      const target=crack.test(t)||(/\b(?:predmet|vec|spon\w*|kov\w*|skry\w*|sp[aor]\w*)\b/.test(t));
      if (sword.test(t)&&leverage.test(t)&&(target||focus))return cmd('bridgePry',t);
      if (focus&&leverage.test(t)&&/\b(?:to|ho|ji|sponu|sponou|predmet|sp[aor]\w*|lesk\w*|vec)\b/.test(t)&&(!against.test(t)||!sword.test(t)))return cmd('bridgeHands',t);
    }
    if (room==='cave'&&!after) {
      if (/\b(?:krapnik\w*|ledov\w*\s+v[yý]cnelek|rampouch\w*|ledov\w*\s+spic\w*)\b/.test(t)&&
        /\b(?:urazit|urazim|uraz|useknout|usekni|odseknout|odsekni|seknout|sekni|sekat|rozseknout|rozsekat|rozsekej|zrusit|rozbit|rozbij|odlomit|ulomit|zlomit|osekat|otlouct|shodit|shod|srazit|pouzit|pouzij|bouchat|prastit|uderit|zasahnout|vyridit|prerazit|prelomit|odstipnout)\b/.test(t))return cmd('stalactite',t,{armed:sword.test(t)});
      if (/^(?:mluvit|promluvit|promluv|mluv|oslovit|oslov|povidat|povidej|pokecat|povidej si|promluvme si|popovidat|rozmlouvat|zeptej se|zeptat se|vyzpovidat|pozdravit|pozdrav|chci mluvit|chci si povidat|chci promluvit|muzu mluvit|mohu mluvit)\b/.test(t)&&wizard.test(t))return cmd('wizardOpen',t);
      if (/^(?:carodeji|cernoknezniku|kouzelniku|magu|pane ledu)(?: co| proc| jak| kdo| dobry den| ahoj| vysvetli| rekni| povez| poslechni| chci| mam| muzu| mohu| muzeme| mohl bych| chtel bych| tak| ty)\b/.test(t))return cmd('wizardOpen',t);
    }
    if (room!=='clearing')return null;
    // Na rozcestí existuje skutečný rozhovor se známým havranem. Některé
    // holé otázky se vážou k bezprostřední předchozí výpovědi, ne ke světu.
    const active=previous?.speaker==='raven'&&previous.room==='clearing';
    const mourning=Boolean(context.griefThread?.active && (context.griefThread?.transitions||0)<4);
    const aboutStar=star.test(t)||active&&(/\b(?:on|ho|mu|neho|nemu|ten|to|takze|uz|byl|zije|zemrel|zabil|stal|osud|s nim)\b/.test(t)||/^(?:proc byl|uz neni|minuly cas|uz nezije|a proc|co se stalo|takze to vis)$/.test(t));
    const killed=/\b(?:zabil|zabila|zabit|zavrazdil|vrazdil|ublizil|ublizit|zranil|napadl|otravil|umyslne|vinik|vrah|vrazi|zahubil|usmrtil|sprovodil)\b/;
    const whyDeath=/\b(?:zemrel|umrel|mrtvy|mrtveho|nezije|zije|zahynul|zabil|zavrazdil|ublizil|stalo|prihodilo|osud|nemoc|umirani|smrt|ztratil|umrit|umirani)\b/;
    if (aboutStar&&killed.test(t)&&(/\b(?:kdo|nekdo|nekoho|vis|vi|myslis|udelal|zabil|zabila|ublizil|vrah|vrazd\w*)\b/.test(t)))return cmd('ravenTalk',t,{topic:'killer'});
    if (aboutStar&&whyDeath.test(t)){
      if (/\b(?:vis|vedel|vedel jsi|tusil|tusis|rekl|dozvedel|znas|slysel)\b/.test(t)&&/\b(?:mrtv\w*|zemrel|umrel|nezije|smrt|osud)\b/.test(t))return cmd('ravenTalk',t,{topic:'knewDeath'});
      if (/^(?:hvezdar|hvezdare|tvuj pritel|on) (?:je |uz |jeste )?(?:mrtvy|po smrti|zemrel|umrel|nezije|zije|zahynul)$/.test(t))return cmd('ravenTalk',t,{topic:'deathTruth'});
      if (/^(?:co|jak|proc|kdy|kde|stalo|prihodilo)\b/.test(t)&&!/^zije|^je na zivu/.test(t))return cmd('ravenTalk',t,{topic:'deathCause'});
      return cmd('ravenTalk',t,{topic:'deathTruth'});
    }
    if (aboutStar&&/^(?:uz neni|uz nezije|neni uz|zije jeste|jeste zije|zije|je mrtvy|zemrel|umrel|minuly cas|proc byl|proc rikas byl|proc mluvis v minulem case|proc o nem mluvis v minulosti|on uz nezije|on uz neni|byl tedy mrtvy|byl|takze uz neni)$/.test(t))return cmd('ravenTalk',t,{topic:'deathTruth'});
    if ((aboutStar||active)&&/^(?:takze to vis|tys to vedel|tys o tom vedel|ty jsi o tom vedel|ty jsi to vedel|a ty to vis|vedel jsi to|to jsi vedel|jak to vis|odkud to vis|jak ses to dozvedel|takze jsi to vedel|vedels to|takze si to vedel|vazne to vis|vis to|a vedel jsi to|takze ses to dozvedel|jak jsi to zjistil|jak to muzes vedet|kdo ti to rekl)$/.test(t))return cmd('ravenTalk',t,{topic:'knewDeath'});
    if (aboutStar&&/^(?:hvezdar|hvezdare|hvezdari|astronom|tvuj pritel|a hvezdar|co hvezdar|kdo je hvezdar|kdo to byl|kdo to je|povidej o hvezdari|rekni mi o nem|jaky byl|co byl zac|a jaky byl|co mel rad|co delal|cim se zabyval|jak jste se poznali|pamatujes na nej)$/.test(t))return cmd('ravenTalk',t,{topic:'starMemory'});
    if(active&&['starMemory','deathTruth','deathCause','knewDeath','grief'].includes(previous.topic)&&/^(?:co mel rad|co nemel rad|co delal|jak vypadal|jak se choval|jaky byl|jak jste se poznali|kdy jste se poznali|byl hodny|byl moudry|povidej vic o nem)$/.test(t))return cmd('ravenTalk',t,{topic:'starMemory'});
    if (aboutStar&&/\b(?:chybi|chybel|postradas|styska|trapis|boli|smutny|smutno|rad|miloval)\b/.test(t))return cmd('ravenTalk',t,{topic:'grief'});
    if((aboutStar||mourning)&&/^(?:jsi smutny|je ti smutno|je ti to lito|chybi ti|chybi ti hvezdar|postradas ho|styska se ti po nem|trapi te to|boli te to|co citis|jak se citis|jak ti je|a co ty|mas srdce|mas vubec srdce|neni ti to jedno|proc jsi smutny|nejsi zly|jsi bezcitny|plakal jsi|umel bys plakat|bojis se ze na nej zapomenes|zapomenes na nej|byl to tvuj pritel)$/.test(t))return cmd('ravenTalk',t,{topic:'grief'});
    if (active&&/^(?:kdo za to muze|kdo je vinen|kdo je vinik|je za tim carodej|myslis ze ho zabil carodej|zpusobil to carodej|mohl ho nekdo zavrazdit|co ho zabilo|nekdo mu ublizil|byla to vrazda|mohl za to nekdo|kdo za tim stoji)$/.test(t))return cmd('ravenTalk',t,{topic:'killer'});
    if(after&&/^(?:je uz po vsem|skoncilo to|je konec|skoncila zima|vyhrali jsme|dokazali jsme to|je jaro|vratilo se jaro|slunce se vratilo|mame vyhrano|vsechno je za nami)$/.test(t))return cmd('ravenTalk',t,{topic:'victory'});
    if(after&&/^(?:pujdes se mnou|poletis se mnou|pujdeme spolu|budeme spolu|pridas se ke mne|pridas se ke mne na ceste|muze s jit se mnou|muzes jit se mnou|muzes letet se mnou|chtel bys jit se mnou|chtel bys me doprovodit|mohu te navstevovat|muzu te navstevovat|uvidime se jeste|zase se uvidime|uvidime se|znovu se potkame|vratim se za tebou|pockas na me|budeme se vidat|prijdu zas|mohu se vratit|muzu se vratit)$/.test(t))return cmd('ravenTalk',t,{topic:'together'});
    if (/^(?:co (?:tu |tady |zrovna |prave |ted )?(?:delas|provadis)|co ted delas|na cem pracujes|co je tvym ukolem|proc jsi tu|co mas na praci|co hlidas|jake je tve poslani|co je tvym poslanim)$/.test(t))return cmd('ravenTalk',t,{topic:'purpose'});
    if (/\b(?:poletis|odletis|odletet|odletis|odlet|odle[tj]|odletet|pryc|opustis|opustit|zustanes|zustat|zostanes|vratis se|vratis|kdy odletis|poletime|zaletis|zaletet|odletime|navzdy|naporad|odejdes|odejit|ostanes)\b/.test(t)&&
        /^(?:a |co |tak |uz |ted |po |az |kdy |kam |ty |proc |poletis|odletis|zustanes|odlet|odejdes|chces|muzes|mohu|pujdes|letis|letet)/.test(t)&&
        !/\b(?:mlec|mlyn|mlej|most|vez|jeskyne|krypta|vychod|zapad)\b/.test(t))return cmd('ravenTalk',t,{topic:after?'departure':'promise'});
    if (/^(?:co|a co|tak co|co tedy|no a co|jak|a jak|co si myslis|jak to bude|co myslis|co budeme|a my|co jeste|a ted|tak tedy)\b/.test(t)&&
        /\b(?:ted|potom|dal|dale|dalej|budoucnost|bude|budeme|stan(e|ou)|delat|udelame|udelat|nasleduje|nas|osud|zacne|pockame|budem)\b/.test(t))return cmd('ravenTalk',t,{topic:after?'future':'nextStep'});
    if (after&&active&&/^(?:a ted|co dal|co jeste|a potom|tak co|co ted|co s nami|a my|jak dal|takze ted|co budeme)$/.test(t))return cmd('ravenTalk',t,{topic:'future'});
    if (/^(?:proc|a proc|jak to|co tim myslis|a jak to|vazne|opravdu|coze)$/.test(t)&&active&&['killer','deathCause','deathTruth','knewDeath','starMemory','grief'].includes(previous.topic))return cmd('ravenTalk',t,{topic:'deathFollow'});
    if (has(t,/^(?:mluvit|promluvit|povidej|povidat|popovidat|popovidej|pokecat|pokecame|chci si povidat|chci mluvit|chci s tebou mluvit|chci si s tebou povidat|chci s tebou povidat|budeme si povidat|povidej si|popovidame si|rekni mi neco|povez mi neco|oslovit|oslov|mluv|promluv|ahoj havrane|havrane chci|havrane povidej|havrane rad bych si povidal)(?:\s|$)/) || /^(?:muzes si se mnou povidat|muzu s tebou mluvit|muzu s tebou povidat|chces si povidat|mohu s tebou mluvit|muzeme si povidat)$/.test(t))return cmd('ravenTalk',t,{topic:'opening'});
    if (/^(?:jsi|ty jsi|ses|opravdu jsi) (?:moudry|chytry|bystry|rozumny|moc moudry|hodny|laskavy|dobry pritel|inteligentni|zajimavy|skvely)$/.test(t))return cmd('ravenTalk',t,{topic:'praise'});
    if (/^(?:co (?:tu |tady |zrovna |prave |ted )?(?:delas|provadis)|co ted delas|na cem pracujes|co je tvym ukolem|proc jsi tu|co mas na praci|co hlidas|jake je tve poslani|co je tvym poslanim)$/.test(t))return cmd('ravenTalk',t,{topic:'purpose'});
    if (/^(?:jak se krmis|jak se z ivis|jak jis|co jis|cos jedl|co zeres|co zer es|mas hlad|nemas hlad|co zeres|nejis nic|takze nic nejis|jak shanis jidlo|co jim|kam letas pro jidlo|odkud mas jidlo|co sis dal k jidlu|jak prezivas bez jidla)$/.test(t))return cmd('ravenTalk',t,{topic:'food'});
    if (/^(?:jak daleko letas|co kdyz odletis|jak si hlidas cestu|hlidas cestu i kdyz letis|znas tady kazdy kamen|neztratis se|jak daleko muzes letet)$/.test(t))return cmd('ravenTalk',t,{topic:'range'});
    if (after&&active&&/^(?:a ty|a co ty|a co hvezdar|co jeho slib|co tvuj slib|splnil jsi slib|uz nemusis cekat|jsi volny|jsme volni|jsi stastny|jsi rad|radujes se)$/.test(t))return cmd('ravenTalk',t,{topic:'promiseFulfilled'});
    if (after&&/^(?:uz nemusis cekat|nemusis uz cekat|jiz nemusis cekat|splnil jsi slib|tvuj slib je splnen|svuj slib jsi dodrzel|uz jsi volny|ted jsi svobodny|uz nemusis hlidat cestu|bylo to k necemu|stalo to za to)$/.test(t))return cmd('ravenTalk',t,{topic:'promiseFulfilled'});
    return null;
  }

  const lines={
    // Každé téma je samostatná konverzační jednotka. Věty se nečtou jako
    // katalog; příští dotaz dostane jiný pohled na stejnou zkušenost.
    opening:[
      'Havran přešlápne na příčné desce. „To rád slyším. Tolik let jsem rozmlouval hlavně s větrem. A ten poslouchat neumí.“',
      '„Ptej se,“ pobídne tě havran. „A klidně i na věci, které nemají nic společného s cestou.“',
      'Havran si uhladí pírko na hrudi. „Hvězdář vždycky říkal, že dobrý rozhovor začíná otázkou, ne odpovědí.“',
      '„Zůstaň chvíli,“ řekne tiše. „Když spolu mluvíme, není to čekání tak prázdné.“',
      '„Poslouchám. A tentokrát nespěchám s radou,“ přizná havran.',
      'Havran se nakloní blíž. „Můžeš mi vyprávět i o sobě. Dosud jsem slyšel samé příběhy o horách.“'
    ],
    praise:[
      '„Moudrost?“ Havran nakloní hlavu. „Někdy jen dlouho sedíš na jednom místě a dáváš dobrý pozor.“',
      'Havran potěšeně skloní zobák. „Hvězdář mi říkával něco podobného. Pak ode mě chtěl, abych mu připomněl, kde nechal brýle.“',
      '„Děkuji. Ale kdybych opravdu věděl všechno, nečekal bych tak dlouho na někoho, kdo mi položí správnou otázku.“',
      'Havran chvíli mlčí. „Snažím se rozumět. To je snad víc, než se jen tvářit učeně.“'
    ],
    purpose:[
      'Havran se podívá na tebe. „Právě teď dělám přesně to, proč tu zůstávám. Někdo přišel na rozcestí a já s ním mluvím.“',
      '„Kdybych měl jen počítat kroky poutníků, mohl bych dávno odletět. Ale někdy stačí vyslechnout jednoho člověka, aby mělo čekání smysl.“',
      '„Zůstat na cestě,“ připomene havran. „Teď už vím, že nešlo jen o to sedět na ceduli. Šlo o setkání.“',
      'Havran se ti zadívá do očí. „Hvězdář mi svěřil cestu. Když se ptáš, dáváš tomu slibu obsah.“',
      '„Hlídám, jestli se někdo neztratí. Někdy v lese, jindy v sobě,“ praví tiše.',
      '„Dnes poprvé po dlouhé době nemám pocit, že čekám zbytečně,“ řekne havran a poposedne blíž.'
    ],
    food:[
      '„Jíst musím,“ podotkne havran. „Na kraji lesa zůstávají semena. Vím přesně, kde je hledat, i pod sněhem.“',
      '„Odletím jen kousek,“ řekne. „A než se pustím do zobání, ještě se ohlédnu. Rozcestí mám skoro pořád na očích.“',
      '„Někdy seženu drobeček, jindy skoro nic. Nejsem vybíravý. Hvězdář o mně tvrdil, že sním i jeho špatné poznámky.“',
      'Havran zavrtí hlavou. „Hlad znám. Horší by bylo, kdybych se vrátil a zjistil, že tu někdo čekal na odpověď.“',
      '„Za tím ohnutým smrkem bývají bobule. Ne, neprozradím ti všechny své skrýše,“ dodá s náznakem pobavení.'
    ],
    range:[
      '„Za vzdálený hřeben nelétám. Odtamtud bych neviděl, jestli se u cedule někdo zastavil.“',
      '„Znám každý kámen pod těmito smrky. Kdybys mi jeden přemístil, nejspíš bych se zlobil,“ připustí havran.',
      '„Kousek nad stromy se dá obletět celé rozcestí jediným kruhem. Ani při hledání jídla na ně nezapomínám.“',
      'Havran zamrká. „Jedním okem hledám něco do zobáku. Druhým hlídám cestu. Někdy z toho bolí hlava.“'
    ],
    starMemory:[
      '„Hvězdář?“ Havran přitáhne křídla k tělu. „Poznal bys ho podle rukou. Věčně je měl od inkoustu, ale když venku mrzlo, dokázal mi v nich ohřát zobák.“',
      '„Věděl jména hvězd, které já nikdy neviděl. A přitom někdy zapomněl mé jméno,“ řekne havran. „Vlastně mi žádné nedal. Říkal mi příteli.“',
      '„Nebyl to můj pán. Chodil za mnou k oknu a povídal mi o světle, jako bych tomu mohl rozumět.“ Havran se odmlčí. „Možná jsem nakonec rozuměl.“',
      '„Když se mu nepovedl výpočet, otevřel okno a zaklel. Pak se omlouval, jako bych tím byl uražen já.“',
      '„Rád se díval vzhůru. Občas jsem si přál, aby se podíval i na zem. Když to udělal, většinou mě našel.“'
    ],
    deathTruth:[
      'Havran se zadívá k věži. „Ano. Už nežije.“ Chvíli poslouchá vítr. „Dlouho jsem to nedokázal vyslovit nahlas.“',
      '„Viděl jsem jeho hrob,“ řekne havran. „To, že o něm mluvím v minulém čase, není náhoda.“',
      'Havran neodpoví hned. „Když se někdo nevrátí, můžeš čekat dál. Ale jednou musíš připustit, co se stalo.“',
      '„Ne,“ řekne tiše. „Hvězdář už se nevrátí. Jeho slova však zůstala se mnou.“',
      'Havran skloní hlavu. „To slovo jsi vyslovil ty. Já se mu dlouho vyhýbal. Ano, zemřel.“'
    ],
    knewDeath:[
      '„Vím, že je mrtvý. Nevím, jak vypadaly jeho poslední chvíle,“ odpoví havran. „Mezi těmi dvěma věcmi je velký rozdíl.“',
      '„Dlouho jsem doufal,“ přizná. „Pak jsem se dozvěděl o hrobě. A od té doby čekám jinak.“',
      'Havran přejede zobákem po peří. „Nikdo mi to nemusel říkat. Časem jsem poznal, že nepřijde. Ale jistotu mi dal až jeho hrob.“',
      '„Ano, tušil jsem to,“ odpoví. „Proto jsem ti o něm nedokázal vyprávět bez vzpomínek.“',
      '„Vědět není totéž co se s tím smířit,“ řekne havran. „Tomu rozumíš?“'
    ],
    deathCause:[
      'Havran svěsí hlavu. „Poslední zimy mu nebylo dobře. Víc nevím. Nebyl jsem u něj, když zemřel.“',
      '„Zeslábl,“ vzpomíná havran. „Pamatuji si třes jeho rukou. Ale co ho nakonec připravilo o život, nedokážu říct.“',
      '„Kdybych znal odpověď, nemusel bych ji skrývat,“ řekne havran. „Nemám svědectví o jeho smrti. Jen vzpomínky na poslední dny.“',
      '„V deníku možná zanechal víc, než stihl povědět mně. Já viděl hlavně to, že se mu stále hůř dýchalo v mrazu.“'
    ],
    killer:[
      '„Nevím, jestli mu někdo ublížil,“ odpoví havran vážně. „Nebudu obviňovat někoho jen proto, že mám strach z ticha.“',
      '„Mohl za to chlad? Nebo něco jiného? Nevím,“ řekne havran. „Žádného vraha jsem neviděl.“',
      'Havran prudce zatne pařáty do dřeva. „Kdybych věděl, kdo mu ublížil, řekl bych ti to. Ale nehodlám si vymyslet viníka.“',
      '„Mám podezření na tu neobyčejnou zimu,“ přizná. „To ale ještě není odpověď na otázku, zda ho někdo zabil.“',
      '„Nenávist by byla snazší, kdybych měl koho nenávidět,“ řekne tiše. „Jenže pravdu neznám.“'
    ],
    grief:[
      '„Chybí mi jeho každodenní hluk,“ odpoví havran. „Škrábání pera. Kroky po schodech. I to, jak se zlobil na průvan.“',
      'Havran se zadívá do mlhy. „Když tu někdo schází dlouho, nejdřív zapomeneš na jeho tvář. Potom tě překvapí, že si pamatuješ jeho smích.“',
      '„Ano, stýská se mi,“ připustí. „Nejtěžší je, když se ráno probudím a na okamžik čekám, že otevře okno.“',
      '„Ztratil jsem přítele. Ale něco mi zanechal,“ řekne havran. „A dnes jsem pochopil, že to nebylo jen čekání.“',
      'Havran se naježil, ale ne vztekem. „Černá mám pera, rytíři. Ne srdce.“ Potom se znovu zadívá na cestu.',
      '„Říkají, že ptáci neumějí truchlit,“ zamumlá havran. „Nevím, kdo to povídá. Nikdy se nás nezeptal.“',
      '„Někdy celé ráno mlčím, protože se bojím, že když promluvím, uslyším jeho odpověď. A pak si vzpomenu, že už ji neuslyším.“',
      'Havran se na tebe podívá. „Ty jsi někdy přišel o někoho, koho sis nedokázal představit ztratit?“',
      '„Nejvíc mi chybí maličkosti. Třeba jak si při práci broukal tón, který sám neuměl správně dozpívat.“',
      '„Dlouho jsem si myslel, že věrnost znamená nikdy neodletět,“ řekne. „Teď se ptám, jestli také neznamená umět žít s jeho nepřítomností.“',
      'Havran tě nechá chvíli stát v tichu. „Děkuji, že ses zeptal. Lidé se někdy bojí mluvit o těch, kdo už tu nejsou.“',
      '„Nečekal jsem, že mi bude chybět jeho zakašlání,“ přizná. „Znal jsem je stejně dobře jako své zakrákání.“',
      '„Jestli někdy odejdu, nevezmu si z toho místa ceduli ani kámen,“ řekne. „Vezmu si vzpomínku, že mi někdo říkal příteli.“'
    ],
    deathFollow:[
      '„Protože mi chybí. A o některých věcech se nemluví snadno, ani když máš na to celé roky,“ řekne havran.',
      'Havran mlčí. „Sám se ptám, co jsem mohl udělat jinak. Ale odpověď se nevrací s každou zimou.“',
      '„Není to tajemství, které bych ti schovával. Je to prázdné místo, kde bývala jistota,“ odpoví.',
      '„Hvězdář uměl vypočítat pohyb hvězd. Vlastní konec mi ale nevysvětlil,“ řekne havran.',
      '„Protože mi na něm záleželo,“ odpoví po dlouhé chvíli. „Někdy je to celé vysvětlení.“',
      '„Chtěl bych vědět víc,“ přizná havran. „Jen nechci zaměnit přání za pravdu.“',
      '„Kdybych tehdy přiletěl k oknu o den dřív, změnilo by se něco?“ Havran sklopí hlavu. „Tu otázku si nosím s sebou.“',
      '„Možná se tomu vyhýbám,“ uzná. „Ne proto, že bych ti nevěřil. Protože pokaždé, když o něm mluvím, je znovu na chvíli blízko.“'
    ],
    grievingFuture:[
      'Havran zůstane chvíli zticha. „Po tom, co jsme si řekli? Chtěl bych nejdřív nechat jeho památku chvíli v pokoji.“',
      '„Možná bude jaro,“ pronese. „Ale nespraví všechno, co zima vzala. Rád bych přesto viděl, co vyroste.“',
      '„Půjdeme dál,“ řekne havran nakonec. „Ne proto, že jsme zapomněli. Právě proto, že si pamatujeme.“',
      '„Já dnes zůstanu tady,“ řekne. „Nechci ti říkat, kam máš jít. Jen tě prosím, abys u věže občas vzpomněl i na něj.“',
      'Havran se tě zeptá: „Myslíš, že člověk zůstává s námi, dokud o něm někdo vypráví?“',
      '„Nevím, co bude zítra,“ připustí. „Dnes však vím, že jsme o něm konečně dokázali promluvit.“'
    ],
    grievingDeparture:[
      '„Ještě ne,“ zašeptá havran. „Nejdřív bych si chtěl sednout chvíli s tím, co jsme si o hvězdáři řekli.“',
      '„Možná jednou odletím,“ odpoví. „Ale nechci, aby můj první volný let vypadal jako útěk před vzpomínkou na něj.“',
      'Havran se zadívá na cestu. „On mi dal důvod zůstat. Třeba mi jednoho dne vzpomínka na něj dá odvahu odletět.“',
      '„Můžu odsud kdykoli,“ připomene. „Dnes mi jen připadá správné ještě chvíli zůstat.“',
      '„A kam bych letěl?“ zeptá se tiše. „Ne proto, že se bojím světa. Jen se teprve učím, že nemusím na nikoho čekat.“'
    ],
    grievingOpening:[
      'Havran přitiskne peří k tělu. „Můžeme si povídat. Jen mi promiň, jestli dnes budu chvílemi mlčet.“',
      '„Zůstaň,“ řekne havran tiše. „Když mluvíme o něm, připadá mi, že si pamatujeme každý něco jiného. To je možná dobře.“',
      '„Rád tě vyslechnu,“ odpoví. „Ale neptej se, prosím, jen proto, abych vypadal statečně.“',
      'Havran přikývne. „Nemusíme mluvit hned. Někdy stačí, když tu někdo je.“'
    ],
    grievingMemory:[
      '„Pamatuji si ho u otevřeného okna,“ začne havran. „Na stůl mu padal sníh a on dál psal. Musel jsem ho zobákem upozornit, že mu moknou výpočty.“',
      '„Když ho vidím ve vzpomínce, není to žádný velký učenec,“ řekne havran. „Je to promrzlý muž, který se mi pokouší zavázat uvolněný kroužek na noze.“',
      '„Nechával za sebou drobky, i když sám skoro nejedl. Tehdy jsem to bral jako samozřejmost,“ řekne. „Teď už ne.“',
      'Havran zavře oči. „V jeho pracovně voněl vosk a starý papír. Tu vůni jsem už několik zim necítil.“'
    ],
    nextStep:[
      '„Na cestě ještě zůstává příliš mnoho sněhu,“ poznamená havran. „Začni tím, co můžeš udělat vlastníma rukama.“',
      'Havran pohlédne k mostu. „Ne každá cesta potřebuje radu. Někdy potřebuje, abys konečně vykročil.“',
      '„Dnes zůstanu na rozcestí. A ty si vybereš směr,“ odpoví. „Mám ti ukázat cestu, ne ji projít za tebe.“'
    ],
    future:[
      'Havran naslouchá kapkám z větví. „Teď? Myslím, že poprvé po dlouhé době nemusíme nikam spěchat.“',
      '„Nevím, co všechno přinese jaro,“ přizná. „Ale dnes už můžeme zůstat chvíli spolu a dívat se, jak přichází.“',
      '„Lidé začnou znovu chodit po cestě. Možná se budou ptát, proč sedím právě tady,“ řekne havran. „A já budu mít konečně nový příběh.“',
      '„Ty můžeš jít dál. Já se musím rozhodnout, co pro mě znamená slib, když už je cesta volná,“ odpoví zamyšleně.',
      '„Kdysi jsem znal jen čekání. Teď se možná budu muset naučit něco těžšího,“ pousměje se havran. „Žít dál.“',
      'Havran roztáhne křídla a zase je složí. „Nejdřív bych si chtěl zapamatovat tenhle den. Další plán může počkat.“',
      '„Říkáš ‚budeme‘,“ všimne si havran. „To slovo se mi líbí. Nebyl jsem zvyklý do něčeho patřit.“'
    ],
    departure:[
      '„Ne hned,“ odpoví havran. „Konečně přišlo ráno. Chtěl bych je vidět z místa, kde jsem tak dlouho čekal.“',
      '„Křídla mám pořád,“ pousměje se. „Ale poprvé nevím, kam bych vlastně měl pospíchat.“',
      'Havran pohlédne k rozcestníku. „Možná jednou odletím dál než k nejbližšímu smrku. Dnes se mi odtud ještě nechce.“',
      '„Jestli odejdeš ty, možná si sám udělám malý výlet,“ připustí. „Ale vím, kde se znovu potkáme.“',
      '„Myslíš, že by se hvězdář zlobil, kdybych se konečně podíval za hory?“ zeptá se havran. „Možná se jednou odvážím.“',
      '„Můžu odletět kdykoli,“ řekne. „Jen jsem se dnes naučil, že svoboda nemusí znamenat opustit všechno, co máš rád.“'
    ],
    promiseFulfilled:[
      'Havran se podívá na probouzející se cestu. „Myslím, že dnes už můžu říct: splnil jsem to.“',
      '„Slib se nedá odškrtávat jako úkol,“ řekne havran. „Ale přišel jsi. A neztratil ses. To mi stačí.“',
      '„Dlouho jsem se bál, že slib skončí teprve se mnou,“ přizná. „Teď vím, že mohl vést až sem.“',
      '„Jestli mě hvězdář někde slyší, doufám, že pozná, proč jsem zůstal,“ řekne tiše.'
    ],
    together:[
      'Havran tě chvíli pozoruje. „Rád bych tě ještě někdy viděl. Tolik věcí jsem se dnes od tebe naučil.“',
      '„Poletět s tebou?“ Havran si prohlédne křídla. „Možná kousek. Ale dej mi čas rozloučit se s rozcestím.“',
      '„Až se vrátíš, poznám tě,“ slíbí havran. „Ne podle brnění. Podle toho, jak pokládáš otázky.“',
      'Havran se usměje po svém, krátkým zakrákáním. „Jestli půjdeš kolem, nemusíš mít žádný důvod. Můžeš se jen zastavit.“',
      '„Kdybych se vydal s tebou, musel bych se naučit spát jinde než na téhle ceduli,“ řekne. „To by bylo dobrodružství samo o sobě.“',
      '„Můžeme jít každý svou cestou a přesto zůstat přáteli,“ přemítá havran. „Hvězdář by tomu rozuměl.“'
    ],
    victory:[
      'Havran sleduje první vodu stékající po rozcestníku. „Ano. Tahle zima skončila. Ne všechny starosti světa, ale tahle ano.“',
      '„Poslouchej,“ řekne havran. „Voda. A ptáci daleko v lese. To jsem neslyšel celé roky.“',
      '„Dokázals to,“ řekne havran. „Jen nesmíme zapomenout na ty, kdo se toho rána nedožili.“',
      'Havran roztáhne křídla, jako by se chtěl ujistit, že je stále může použít. „Je konec mrazu. Teď začíná něco, co už neznám.“'
    ]
  };

  function ravenReply(topic, memory={}, context={}){
    memory.semanticCounts ||= {};
    const count=memory.semanticCounts[topic]||0;
    memory.semanticCounts[topic]=count+1;
    const mourningTopics=new Set(['deathTruth','deathCause','killer','knewDeath','grief','deathFollow']);
    memory.griefThread ||= {active:false,depth:0,transitions:0};
    const grief=memory.griefThread;
    if(mourningTopics.has(topic)){
      grief.active=true;grief.depth++;grief.transitions=0;
    }else if(grief.active){
      // Bolestná otázka nedozní jedním tahovým přepnutím na veselý dialog.
      // Přirozené odbočky stále reagují na slova hráče, ale tón zůstává
      // několik dalších odpovědí zdrženlivý. Přímá změna tématu (například
      // otázka na jídlo) se respektuje, není vynucen návrat k mrtvému.
      if(!['food','range','nextStep','victory'].includes(topic))grief.transitions++;
      else grief.transitions=4;
      if(grief.transitions>=4)grief.active=false;
    }
    let choices=lines[topic]||lines.opening;
    if(grief.active&&!mourningTopics.has(topic)){
      if(topic==='future'||topic==='nextStep')choices=lines.grievingFuture;
      else if(topic==='departure'||topic==='together'||topic==='promiseFulfilled')choices=lines.grievingDeparture;
      else if(topic==='opening'||topic==='purpose'||topic==='praise')choices=lines.grievingOpening;
      else if(topic==='starMemory')choices=lines.grievingMemory;
    }
    if (topic==='future'&&context.after&&!grief.active&&memory.trust>=4&&count===0)
      return {text:'Havran přisedne blíž. „Ať půjdeš kamkoli, rád bych slyšel, co tam najdeš. Nemusíme si teď slibovat věčnost. Stačí, když se někdy vrátíš.“',stage:count};
    if (topic==='departure'&&!grief.active&&memory.trust<0&&count===0)
      return {text:'Havran poposedne dál. „Možná odletím,“ připustí. „Ráno neznamená, že musím zůstat u každého, kdo se tu zastavil.“',stage:count};
    // Různá první setkání i návraty. Není tu náhodný výběr, který by
    // okamžitě opakoval předchozí větu, ani nepředvídatelná změna děje.
    return {text:choices[count%choices.length],stage:count};
  }
  function wizardOpening(memory={}){
    memory.semanticOpening=(memory.semanticOpening||0)+1;
    const choices=[
      'Čaroděj k tobě obrátí dvě ze svých očí. „Chceš se mnou mluvit, rytíři? Pak mluv. Ticho téhle jeskyně znám až příliš dobře.“',
      '„Přistoupils až sem, abys něco řekl?“ Žezlo na okamžik ztichne. „Poslouchám.“',
      '„Vyslov otázku,“ pobídne tě čaroděj. „Ale neočekávej, že ti každá odpověď otevře cestu.“',
      'Jedno oko v ledovém rouchu se přimhouří. „Není mnoho těch, kdo se mnou chtějí mluvit. Zpravidla raději tasí.“',
      '„Zvláštní,“ zamumlá čaroděj. „Ještě jsi neodešel. Co bys chtěl vědět?“'
    ];
    return choices[(memory.semanticOpening-1)%choices.length];
  }
  function millKnock(flags={}, force='soft') {
    flags.millKnocks=(flags.millKnocks||0)+1;
    const n=flags.millKnocks;
    if (force==='hard')return [
      'Zabušíš pěstí do vrat. V dutém dřevě se rozlehne několik ran; za dveřmi se nic nepohne.',
      'Tentokrát udeříš silněji. Z trámečku nad hlavou se sesype prach a zmrzlé jehličky, uvnitř však zůstává ticho.',
      'Bušíš tak, až tě začne bolet ruka. Odpoví ti jen ozvěna ve starém náhonu.'
    ][Math.min(n-1,2)];
    return [
      'Zaklepeš na dubové dveře. Duté ťuknutí se ztratí ve dřevě a v mlýně nikdo neodpoví.',
      'Zkusíš to znovu, o něco zřetelněji. Zpoza vrat nepřichází žádný krok ani hlas.',
      'Přiložíš ucho ke dveřím, potom ještě jednou zaklepeš. Slyšíš jen vítr kolem mlýnského kola.'
    ][Math.min(n-1,2)];
  }
  function millBatter(flags={},method='force'){
    flags.millForceAttempts=(flags.millForceAttempts||0)+1;
    const n=flags.millForceAttempts;
    const first={
      kick:'Opřeš se jednou rukou o zárubeň a prudce kopneš do spodní fošny. Z vrat se ozve tupá rána, ale nepovolí. Chodidlo tě zabolí.',
      shoulder:'Rozběhneš se proti dveřím ramenem. Náraz tě odhodí zpět na zmrzlý práh; ve dřevě jen zapraská.',
      sword:'Rozmáchneš se mečem. Čepel vyštipne z povrchu dlouhou třísku, ale silné fošny ani kování neprorazíš.',
      force:'Zabereš proti dveřím vší silou. Ve starém rámu to zasténá, ale vrata zůstanou zavřená.'
    };
    if(n===1)return first[method]||first.force;
    if(n===2)return method==='sword'?'Znovu sekneš do dubu. Přibude čerstvý zásek a několik třísek, ale dovnitř stále nevidíš.':'Zkusíš to znovu, tentokrát s větším rozmachem. Dřevo se nepatrně otřese, ale zámek i zavření drží.';
    return n%2===0?'Další pokus už mění jen otlučené dřevo a bolest tvých rukou. Takto dveře neotevřeš.':'Na prahu si na chvíli oddechneš. Vrata nepovolila; další rána by jen přidala třísky.';
  }
  function stalactite(flags={},armed=true){
    flags.stalactiteAttempts=(flags.stalactiteAttempts||0)+1;
    const n=flags.stalactiteAttempts;
    if(!armed)return 'Natáhneš se ke krápníku, ale visí příliš vysoko. Holou rukou ho neulomíš.';
    return [
      'Zvedneš meč nad hlavu a zkusíš dosáhnout na nejnižší krápník. Ostří jen škrtne o ledovou špičku; několik krystalků se rozletí po stezce. Velký krápník stále drží.',
      'Přistoupíš o krok blíž ke stěně a znovu sekneš vzhůru. Led křehce zazvoní, ale strop je příliš vysoko a nechceš ztratit půdu pod nohama.',
      'Zhodnotíš vzdálenost. Ze země na masivní krápník mečem nedosáhneš tak, abys jej bezpečně urazil. Čaroděj tě mlčky pozoruje.'
    ][Math.min(n-1,2)];
  }
  return {norm,detect,ravenReply,wizardOpening,millKnock,millBatter,stalactite};
})();
