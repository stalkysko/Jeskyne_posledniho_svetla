// V11.7 – ručně psaná hloubka sedmi míst. Žádné online služby, žádné automatické nápovědy.
// Tohle jsou vedlejší interakce. Zámky, světlo, most a boj zůstávají v hlavním enginu.
globalThis.adventureWorld117 = (() => {
  const objects = {
    clearing: [
      ['stopy','stopy;otisky;slapoty','Ve sněhu se kříží stopy bot a drobné ptačí otisky.',{touch:'Přejedeš rukavicí přes jeden otisk. Okraje se sesypou; teď už nikdo nepozná, kudy vedl.',inspectAfter:'Jednu ze stop jsi setřel. Ostatní mizí pod novým sněhem.',listen:'Sníh neprozradí, kdo tudy šel. Ozývá se jen vítr.'}],
      ['lavice','lavice;lavicku;lavicku;prkno k sezeni','Pod smrkem je nízká, polozapadaná lavice.',{sit:'Sníh z lavice odhrneš a na chvíli usedneš. Mokré dřevo tě brzy vyžene na nohy.',clean:'Ometáš sníh. Na lavici jsou hluboké rýhy od nože, ale žádná čitelná zpráva.',touch:'Dřevo je nasáklé vlhkostí. V rukavici zůstane tříska.'}],
      ['kamen','patnik;meznik;kamen u cesty','U cesty stojí patník, dávno sešlapaný poutníky.',{inspect:'Na oprýskaném kameni sotva rozeznáš staré míle. Někdo je kdysi poctivě počítal.',clean:'Ze starých číslic setřeš led. Jsou tak ohlazené, že je stejně nepřečteš.',knock:'Kámen krátce zazvoní. Havran se otočí: „Zkoušíš, jestli odpovídá? V tom případě jsi na správném rozcestí.“'}],
      ['vetve','ulomena vetev;vetvicka;vetev u cesty','Ve sněhu leží odlomená větev smrku.',{touch:'Vezmeš větev do ruky. Jehličí se sype na sníh; necháš ji ležet.',break:'Suchá špička s křupnutím praskne. V hlubokém tichu to zní skoro nepatřičně.',smell:'Jehličí ještě voní po pryskyřici.'}],
      ['zvoneni','zvon;zvonek;stary zvonek','V dálce se občas zdá slyšet zvon. Možná je to jen vítr.',{listen:'Zapřísáhneš se, že jsi zaslechl jediné kovové cinknutí. Druhé už nepřijde.'}],
      ['rampouchy','led na rozcestniku;rampouch na ceduli;namraza na ceduli','Hrany směrovek pokrývá skelná jinovatka.',{clean:'Setřeš mráz z hrany. Havran si poposedne: „Děkuji. Za chvíli mi zase namrzne hřad.“',cut:'Ostří odrazí několik ledových šupinek. Cedule zůstane celá.'}],
      ['mesic','mesic nad udolim;mesicni svit','Měsíc visí nad sedlem mezi dvěma vrcholy.',{inspect:'Na okamžik se obloha vyjasní a světlo na cestě zesílí.',listen:'Na obloze je ticho. Pod tebou však vržou stromy.'}]
    ],
    mill: [
      ['nahon','led v nahonu;zamrzly nahon;nahon','Mlýnským náhonem teče pod tlustou ledovou deskou voda.',{listen:'Přiložíš ucho ke kameni. Proud uvnitř šumí, jako by se mlýn nadechoval.',attack:'Meč v ledu vyštipne sotva patrnou rýhu. Proud dole je příliš hluboko.',throw:'Oblázky po ledu poskakují a mizí u břehu.'}],
      ['panty','panty;pantu;zavesy dveri;zaves','Železné panty jsou staré, ale pevně zavrtané do kamene.',{touch:'Studené železo zanechá na rukavici rezavý prach.',cut:'Čepel cinkne o železo. Panty drží, jen do mlýna se to hlasitě rozlehne.',knock:'Závěsy dlouze zadrnčí, ale dveře se nepohnou.'}],
      ['hrnek','kruhy po hrncich;otisky hrnku;skvrny po hrnku','Na stole zůstaly tmavé kruhy od hrnků.',{touch:'Přejedeš přes zaschlé kruhy. Někdo tu ještě nedávno sedával u horkého pití.',smell:'Dřevo voní po oleji, nikoli po čaji.'}],
      ['sekera','zarezla sekera;otisk sekery;sekera ve dreve','Na trámu je hluboký zásek po staré sekeře. Nástroj už tu není.',{inspect:'Zářez je mnohem starší než současný mráz. Mlynář neměl vždycky klidné dny.',touch:'V prasklině ucítíš drsné třísky.',cut:'Zkusíš čepelí navázat na zásek. Dřevo praskne, ale nic se za ním neskrývá.'}],
      ['privesena','rezava podkova;rezavou podkovu;podkova;podkovu;podkovy;podkove;podkovou','Nad zápražím visí rezavá podkova.',{touch:'Podkova se rozhoupá a otře o stěnu.',turn:'Otočíš ji hřeby ven. Pověra se tím asi nezmění.',inspect:'Mlynář věřil na štěstí. V jeho opuštěném dvoře to působí zvláštně.'}],
      ['schudky','schudky;stupne;stupinek','U náhonu vedou dva kluzké schůdky k vodě.',{touch:'Bota ti ujede po ledu. Zachytíš se za trám a raději se vrátíš.',inspect:'Na posledním stupni zůstává tmavá hladina pod tenkým ledem.'}],
      ['klice','stary klin;dreveny klin','U stěny trčí z kamene ztrouchnivělý dřevěný klín.',{pull:'Klín drží jen silou mrazu. Při zatažení se rozpadne na třísky.',inspectAfter:'Po klínu zůstala mělká stopa v kameni.',inspect:'Mlynář si jím kdysi podkládal vratký trám.'}]
    ],
    bridge: [
      ['spona','spona;sponu;spony;sponou;rezava spona;rezavou sponu;zeleznou sponu;zeleznou sponou;kovova spona','Na boku jednoho pilíře drží úzká, zrezlá železná spona. Mohla kdysi jistit dřevěnou část mostu.',{touch:'Železo je do kamene zasazené hluboko. Prsty s ním nepohneš.',pull:'Spona se ani nehne. Zasazena je příliš hluboko.',knock:'Železo slabě zadrnčí. Zvuk se ztratí v propasti.'}],
      ['zbytek','zbytky prken;stara prkna;ulomena prkna','Ze zříceného mostu zůstalo jen několik pahýlů dubových trámů.',{touch:'Po vláknech se sype ztrouchnivělé dřevo.',cut:'Odstřihneš z trámu špičku. Zbytek drží; přechod to nevytvoří.',listen:'Prkna tiše skřípou, kdykoli zafouká do strže.'}],
      ['ryha','ryhy na kameni;stare ryhy;ryha na piliri','Na kamenné hraně jsou úzké, nerovné rýhy.',{inspect:'Jejich okraje ohladil déšť a vítr. Stopy starých oprav už nejde rozpoznat.',touch:'V kameni ucítíš žlábky široké sotva na nehet.'}],
      ['vlocky','snih nad propasti;vlocky nad propasti','Sníh padá přes okraj strže a mizí v temnotě.',{watch:'Sleduješ vločky, dokud se neztratí hluboko pod tebou.',throw:'Hodíš hrst sněhu do prázdna. Bílý obláček roztrhá vítr.'}],
      ['ozvena','ozvena;volani do propasti','Propast hlas vrací pozdě a zkresleně.',{shout:'Zavoláš do hlubiny. Odpověď přijde tak pozdě, až to zní jako cizí hlas.',listen:'Zespodu se ozve voda a dlouhé, sotva slyšitelné dunění.'}],
      ['provazky','stara uzlovina;stare provazky;zbytky lana','Mezi kameny vězí útržek dávno přetrženého lana.',{touch:'Hrubá vlákna se ti rozpadnou pod prsty. Tohle by neuneslo ani prázdný vak.',cut:'Stačí jediný pohyb čepele. Staré vlákno se přetrhne a odletí do strže.'}],
      ['ptaci','ptaci nad mostem;hejnko;vzdaleny ptak','Za mostem zakrouží pták a zmizí v mracích.',{watch:'Na okamžik tě napadne, jak snadný musí být přechod pro toho, kdo má křídla.'}],
      ['led','led pod mostem;led v propasti','Hluboko pod mostem je tmavá voda s úlomky ledu.',{throw:'Kámen dlouho padá. Když konečně dopadne, ozve se slabé šplouchnutí.',listen:'Pod tenkou krustou to v hlubině nezvykle hlasitě proudí.'}]
    ],
    tower: [
      ['dlazba','stara dlazba;starou dlazbu;vzor v dlazbe;dlazba;dlazbu;dlazby;dlazbe;dlazdice','Nádvoří je vydlážděné nepravidelnými kameny.',{touch:'Zkoušíš jeden kámen za druhým. Ani jediný se nepohne.',clean:'Ometáš prach a sníh z jednoho kamene. Pod ním zůstává stará opravená spára.'}],
      ['studna','studna;studny;studnu;okov','U zdi stojí zasypaná studna bez okovu.',{inspect:'Někdo ji zavřel dřív, než přišla zima. Těžká víka jsou pevně zadělaná.',listen:'Na dně není slyšet voda. Jen tvůj vlastní dech.'}],
      ['socha','socha;poprsi;kamena tvar','Ve výklenku stojí torzo dávno poškozené sochy.',{inspect:'Není zřejmé, koho měla připomínat. Obličej dávno odpadl.',touch:'Přejedeš po hladkém kameni. Zůstane na něm tmavý otisk rukavice.'}],
      ['horni','horni okno;okenice;okna ve vezi','V horní části věže jsou úzká okna.',{inspect:'Za sklem je tma, ale rám se někdy slabě zachvěje.',knock:'Z nádvoří na okenice nedosáhneš.'}],
      ['prapor','potrhany prapor;prapor;latka na vezi','Ze zlomené žerdě visí vybledlý prapor.',{inspect:'Barvy dávno vybledly. Zůstal jen symbol kruhu, možná kdysi slunce.',listen:'Za větru látka praská jako plamen bez ohně.'}],
      ['popel','stary popel;oh niste;ohniste','U zdi je místo po starém ohništi.',{touch:'Popel je mokrý a dávno studený.',dig:'V popelu je jen kámen a zčernalé třísky.',smell:'Slabě tu zůstává vůně dávno vyhaslého dřeva.'}],
      ['brana','kovove krouzky;stare kovani','Na zárubni je staré kování se škrábanci.',{knock:'Kovový kroužek zazvoní o dřevo. Věž neodpoví.',touch:'Kování je promrzlé. Zámek tím neotevřeš.'}]
    ],
    crypt: [
      ['jmena','vytesana jmena;jmena na kamenech;napisy na kamenech','Na několika deskách jsou sotva čitelná jména.',{read:'Přečteš jen část: „...ať ho světlo nezapomene“. Jméno už se rozpadlo s kamenem.',clean:'Ometáš prach z písmen. Vzkaz je čitelnější, ale stále neúplný.'}],
      ['relief','relief;reliefu;reliéf;kamenny relief;reliefy','Ve stěně je vytesaný obraz sedmi hvězd.',{inspect:'Hvězdy jsou rozmístěné nepravidelně. Jeden bod je téměř setřený.',touch:'Pod prstem cítíš pečlivě vysekané důlky. Kdysi sem někdo chodil vzpomínat.'}],
      ['kosti','stare kosti;ulomky kosti;kost','V prachu leží maličký úlomek kosti.',{touch:'Zvedneš jej jen na okamžik. Vrátíš ho, kde ležel.',inspect:'Patří dávno mrtvému zvířeti. Krypta bývala otevřenější, než je dnes.'}],
      ['pruvan','pruvan;studeny vzduch','Mezi dvěma kameny táhne chladný vzduch.',{listen:'Slyšíš jen tiché svištění. Otevřít druhý průchod tu nelze.',touch:'Proud studeného vzduchu ti sklouzne kolem zápěstí.'}],
      ['miska','hlinena miska;miska;obetni miska','U stěny stojí prázdná hliněná miska.',{inspect:'Na dně zůstaly zaschlé lístky. Někdo sem kdysi přinesl květiny.',touch:'Miska je studená. Přemístíš ji o píď, ale nic pod ní není.',smell:'Ze suchých lístků už žádná vůně nezůstala.'}],
      ['spalene','stopy po plameni;spalene zdi;saze','Nad držáky pochodní jsou černé šmouhy.',{inspect:'Saze jsou mnohem starší než mráz. Zdi kdysi ozařoval živý oheň.',touch:'Černý prach ulpí na rukavici.'}],
      ['kapky','kapky ze stropu;kapani;kapka','Z vysokého stropu pravidelně dopadá voda.',{listen:'Jedna kapka, druhá, třetí. V tmě se mezi nimi zdá být příliš dlouhé ticho.'}]
    ],
    observatory: [
      ['mapa','hvezdna mapa;stara mapa;mapa hvezd','Na stěně visí vybledlá hvězdná mapa.',{inspect:'Na plátně jsou kružnice a pečlivě psané letopočty. Poslední záznam končí před zimou.',touch:'Plátno je křehké; opatrně se jej dotkneš a hned ucukneš.',read:'Jméno souhvězdí ve spodním rohu chybí. Zůstaly jen tři úhledné číslice.'}],
      ['tezitko','mosazne tezitko;tezitko','Na okraji stolu leží mosazné těžítko.',{touch:'Přitiskneš jím roh zápisníku, aby jej vítr neotáčel.',turn:'Zespodu má vyryté obyčejné iniciály hvězdáře. Není to klíč ani pečeť.'}],
      ['kresba','kresba kopule;nakres kopule;stare nacrty','U dalekohledu leží několik pracovních náčrtů.',{inspect:'Na jednom je kopule ještě celá. Hvězdář ji kreslil s trpělivostí stavitele.',read:'Poznámky jsou převážně výpočty. Ne každé číslo je návod k hádance.'}],
      ['prasklina','prasklina v kopuli;trhlina ve strese','Skrz prasklinu ve střeše proniká noční obloha.',{listen:'Vítr na okamžik zahvízdá tak čistě, jako by někdo pískl jediný tón.',touch:'Na prasklinu nedosáhneš. Ve tmě není rozumné lézt po trámech.'}],
      ['prach','prach na stole;vrstva prachu','Na některých přístrojích leží vrstva šedého prachu.',{touch:'V prachu zůstane tvůj otisk. Nikdo ho hned nesmaže.',clean:'Z jednoho místa setřeš prach. Mosaz se pod ním slabě zaleskne.'}],
      ['hodiny','stare hodiny;hodiny;kyvadlo','V koutě stojí dávno zastavené kyvadlové hodiny.',{inspect:'Ručičky ukazují čas, který už nikomu nic neříká.',touch:'Dotkneš se kyvadla. Jedenkrát se zhoupne a zase utichne.',listen:'Hodiny netikají. O to hlasitěji slyšíš vlastní dech.'}],
      ['okular','stary okular;mosazny okular','Mosazný okulár je hladký od mnoha let používání.',{touch:'Kov je tam, kam hvězdář přikládal oko, ohlazený téměř do lesku.'}]
    ],
    cave: [
      ['stopy','stopy na skale;stare stopy ve skale','Ve zmrzlé hlíně jsou hluboké otisky bot.',{inspect:'Stopy končí u ledového sloupu. Dál už nikdo nedošel.',touch:'Vezmeš do ruky trochu hlíny. Je tvrdá jako kámen.'}],
      ['krystaly','ledove krystaly;krystal;krystaly','Ze stěny vyrůstají průhledné ledové krystaly.',{inspect:'Každý má jiný tvar. Ve světle žezla vrhají modré stíny.',cut:'Špičkou meče odštípneš drobný krystal. Dopadne na zem a rozsype se na jehličky.',listen:'Z ledových stěn přichází slabé, nepravidelné praskání.'}],
      ['praskliny','praskliny na zemi;rozsedliny','Pod ledem se kříží černé praskliny.',{inspect:'Některé jsou staré, jiné se prodlužují, kdykoli žezlo vyšle záblesk.',touch:'Zem pod botou tiše zapraská. Raději ustoupíš.'}],
      ['prilba','prilba trpaslika;trpaslici prilba','U padlého trpaslíka leží promáčknutá přilba.',{inspect:'Na okraji je starý erb. V příběhu této země musel někdy znamenat mnoho.',touch:'Pokusíš se ji zvednout, ale je pevně přimrzlá ke kameni.'}],
      ['krapnik','krapnik;ledovy krapnik','Z jeskynního stropu visí ostré ledové výčnělky.',{listen:'Z výšky se ozývá slabé kapání. Led je uvnitř dutý.',cut:'Na výčnělek mečem nedosáhneš. Zůstaneš na bezpečné stezce.'}],
      ['dech','tvuj dech;para od ust','Mráz mění každý výdech v bílý oblak.',{inspect:'Pára se na okamžik zakroutí a zmizí. V čarodějově blízkosti se drží déle.',touch:'Máchneš rukou skrz vlastní dech. Nedá se uchopit.'}],
      ['ozvena','ozvena v jeskyni;hlas ve skale','Každé slovo se vrací se zpožděním.',{shout:'Zakřičíš. Vrátila se jen polovina tvého hlasu, jako by druhou něco pohltilo.',listen:'Tvá ozvěna se ztrácí pod ledovým sloupem.'}]
    ]
  };
  const verbs = {
    inspect:'prozkoumat prozkoumej prohlidnout prohlidni prohlednout prohledni prohledat prohledni podivat podivej koukni kouknout zkoumat ohledat omrknout zjistit co',
    touch:'dotknout dotkni sahnout sahni osahat ohmatat vzit chytit zvednout',
    listen:'poslouchat poslouchej naslouchat naslouchej slyset zaposlouchat',
    smell:'privonet pricichnout ocichat cuchnout cuchni',
    knock:'zaklepat zaklepej tuknout klepnout zabouchat',
    cut:'seknout sekni seknu riznout prerezat rozseknout pretnout useknout rozsekej bodnout bodni',
    attack:'uderit uder prastit prast rozbit rozbij',
    push:'posunout posun odstrcit odtlacit zatlacit',
    pull:'tahnout tahni zatahnout vytahnout vypacit vypac vyhnout',
    read:'cist precist precti prectu',
    clean:'ocistit ocisti otri otrit setrit vycistit',
    turn:'otocit otoc pootoct prevratit',
    throw:'hodit hod vrhnout vhodit',
    dig:'kopat kopni vyhrabat vykopej',
    sit:'sednout sedni posadit',
    shout:'kricet zakricet zavolat',
    watch:'sledovat sleduj pozorovat pozoruj',
    break:'zlomit zlom rozlomit rozbij',
    use:'pouzit pouzij aplikovat',
  };
  const index = Object.fromEntries(Object.entries(objects).map(([room,lines])=>[room,lines.map(([id,aliases,look,actions])=>({id,aliases:aliases.split(';').sort((a,b)=>b.length-a.length),look,actions}))]));
  const vistas={
    clearing:'Pod smrkem vyčnívá ze sněhu stará lavice. U cesty ční ohlazený patník a ve zmrzlé hlíně se ztrácejí stopy dávných poutníků.',
    mill:'Na zápraží visí rezavá podkova. Kolem pantů dveří se odlupuje rez a za stojícím kolem tiše proudí voda zamrzlým náhonem.',
    bridge:'Vítr pročesává zbytky prken. V kameni jsou staré rýhy a mezi úlomky mostu zůstaly zachycené útržky dávno zpřetrhaných provazů.',
    tower:'Mezi kameny nádvoří prorůstá zmrzlá tráva. U zdi je zasypaná studna, ve výklenku torzo sochy a vysoko nad ní vybledlý prapor.',
    crypt:'Na kamenných deskách se pod světlem ztrácejí vytesaná jména. Ve stěně je reliéf sedmi hvězd a pod ním stojí zapomenutá hliněná miska.',
    observatory:'U stěny se zastavily kyvadlové hodiny. Nad nimi visí hvězdná mapa a u mosazného dalekohledu jsou rozložené pracovní náčrty.',
    cave:'U skály leží promáčknutá přilba. V ledu se táhnou černé praskliny a stěny poseté krystaly vracejí čarodějovu modrou zář.'
  };
  function resolve(raw,room) {
    const text=raw.trim();if(!text)return null;
    const first=text.split(' ')[0];
    let intent=Object.entries(verbs).find(([,list])=>list.split(' ').includes(first))?.[0];
    if(!intent&&/^(co (je|jsou) (na|pod|u)|jak vypada|co vidim na)/.test(text))intent='inspect';
    if(!intent)return null;
    for(const object of index[room]||[])for(const alias of object.aliases){
      const expr=new RegExp('(?:^| )'+alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:$| )');
      if(expr.test(text))return {id:object.id,intent,room};
    }
    return null;
  }
  function react({id,intent,room},flags,hasSword){
    const o=index[room]?.find(obj=>obj.id===id);if(!o)return null;
    flags.worldDetails ||= {};
    const k=room+':'+id;
    const used=flags.worldDetails[k] ||= {};
    if(room==='bridge'&&id==='spona'){
      if(['cut','attack','use','pull'].includes(intent)){
        if(used.open)return 'Za odchlíplou sponou už zůstala jen prázdná kamenná dutina.';
        if(intent==='pull'&&!hasSword)return o.actions.pull;
        if(!hasSword)return 'Kov drží v kameni pevně. Holýma rukama jej neodtrhneš.';
        used.open=true;flags.pendantRevealed=true;
        return 'Zasunuješ ostří meče pod zrezlou sponu. Chvíli vzdoruje, potom s ostrým prasknutím odskočí. Za ní se otevře úzká dutina v kameni. Uvnitř leží drobný přívěsek s vyrytým souhvězdím.';
      }
      if(used.open)return 'Zrezlá spona visí napůl odtržená. Za ní je mělká kamenná skrýš.';
    }
    if(intent==='inspect')return used.changed&&o.actions.inspectAfter?o.actions.inspectAfter:(o.actions.inspect||o.look);
    const special=o.actions[intent];
    if(!special){
      return intent==='cut'||intent==='attack'?'Ostří zasáhne povrch, ale nic dalšího se nestane.':
        intent==='use'?'Zkusíš s tím něco udělat. V tomto místě se nic nezmění.':
        intent==='touch'?'Dotkneš se toho. Je to skutečné, studené a staré; víc teď nezjistíš.':
        o.look;
    }
    if(['touch','clean','cut','attack','pull','break','turn'].includes(intent))used.changed=true;
    return special;
  }
  return {resolve,react,glimpse:room=>vistas[room]||''};
})();
