// V11.7 – ručně psaná hloubka sedmi míst. Žádné online služby, žádné automatické nápovědy.
// Tohle jsou vedlejší interakce. Zámky, světlo, most a boj zůstávají v hlavním enginu.
globalThis.adventureWorld117 = (() => {
  const objects = {
    clearing: [
      ['stopy','stopy;otisky;slapoty','Ve sněhu se kříží stopy bot a drobné ptačí otisky.',{touch:'Přejedeš rukavicí přes jeden otisk. Okraje se sesypou; teď už nikdo nepozná, kudy vedl.',inspectAfter:'Jednu ze stop jsi setřel. Ostatní mizí pod novým sněhem.',listen:'Sníh neprozradí, kdo tudy šel. Ozývá se jen vítr.'}],
      ['lavice','lavice;lavici;lavicka;lavicku;lavicky;lavickou;prkno k sezeni','Pod smrkem je nízká, polozapadaná lavice.',{sit:'Sníh z lavice odhrneš a na chvíli usedneš. Mokré dřevo tě brzy vyžene na nohy.',clean:'Ometáš sníh. Na lavici jsou hluboké rýhy od nože, ale žádná čitelná zpráva.',touch:'Dřevo je nasáklé vlhkostí. V rukavici zůstane tříska.'}],
      ['kamen','patnik;patniku;patnikem;meznik;mezniku;kamen u cesty','U cesty stojí patník, dávno sešlapaný poutníky.',{inspect:'Na oprýskaném kameni sotva rozeznáš staré míle. Někdo je kdysi poctivě počítal.',clean:'Ze starých číslic setřeš led. Jsou tak ohlazené, že je stejně nepřečteš.',knock:'Kámen krátce zazvoní. Havran se otočí: „Zkoušíš, jestli odpovídá? V tom případě jsi na správném rozcestí.“'}],
      ['vetve','ulomena vetev;vetvicka;vetev u cesty','Ve sněhu leží odlomená větev smrku.',{touch:'Vezmeš větev do ruky. Jehličí se sype na sníh; necháš ji ležet.',break:'Suchá špička s křupnutím praskne. V hlubokém tichu to zní skoro nepatřičně.',smell:'Jehličí ještě voní po pryskyřici.'}],
      ['zvoneni','zvon;zvonek;stary zvonek','V dálce se občas zdá slyšet zvon. Možná je to jen vítr.',{listen:'Zapřísáhneš se, že jsi zaslechl jediné kovové cinknutí. Druhé už nepřijde.'}],
      ['rampouchy','led na rozcestniku;rampouch na ceduli;namraza na ceduli','Hrany směrovek pokrývá skelná jinovatka.',{clean:'Setřeš mráz z hrany. Havran si poposedne: „Děkuji. Za chvíli mi zase namrzne hřad.“',cut:'Ostří odrazí několik ledových šupinek. Cedule zůstane celá.'}],
      ['mesic','mesic nad udolim;mesicni svit','Měsíc visí nad sedlem mezi dvěma vrcholy.',{inspect:'Na okamžik se obloha vyjasní a světlo na cestě zesílí.',listen:'Na obloze je ticho. Pod tebou však vržou stromy.'}]
    ],
    mill: [
      ['bedynka','bedynka;bedynku;bedynky;bedynce;bednou;bedna;bednu;bedny;bedne;bednou;drevena bedna;drevenou bednu;stara bedna;starou bednu;dreve na zemi;drevena bedynka;drevenou bedynku;krabice;krabici;krabici pod stolem;stara bedynka;viko bedny;viko bedynky','U pracovního stolu stojí nízká dřevěná bedýnka. Několik fošen je odchlípnutých, ale víko drží.',{}],
      ['nahon','led v nahonu;zamrzly nahon;nahon','Mlýnským náhonem teče pod tlustou ledovou deskou voda.',{listen:'Přiložíš ucho ke kameni. Proud uvnitř šumí, jako by se mlýn nadechoval.',attack:'Meč v ledu vyštipne sotva patrnou rýhu. Proud dole je příliš hluboko.',throw:'Oblázky po ledu poskakují a mizí u břehu.'}],
      ['panty','panty;pantu;zavesy dveri;zaves','Železné panty jsou staré, ale pevně zavrtané do kamene.',{touch:'Studené železo zanechá na rukavici rezavý prach.',cut:'Čepel cinkne o železo. Panty drží, jen do mlýna se to hlasitě rozlehne.',knock:'Závěsy dlouze zadrnčí, ale dveře se nepohnou.'}],
      ['hrnek','kruhy po hrncich;otisky hrnku;skvrny po hrnku','Na stole zůstaly tmavé kruhy od hrnků.',{touch:'Přejedeš přes zaschlé kruhy. Někdo tu ještě nedávno sedával u horkého pití.',smell:'Dřevo voní po oleji, nikoli po čaji.'}],
      ['sekera','zarezla sekera;otisk sekery;sekera ve dreve','Na trámu je hluboký zásek po staré sekeře. Nástroj už tu není.',{inspect:'Zářez je mnohem starší než současný mráz. Mlynář neměl vždycky klidné dny.',touch:'V prasklině ucítíš drsné třísky.',cut:'Zkusíš čepelí navázat na zásek. Dřevo praskne, ale nic se za ním neskrývá.'}],
      ['privesena','rezava podkova;rezavou podkovu;podkova;podkovu;podkovy;podkove;podkovou','Nad zápražím visí rezavá podkova.',{touch:'Podkova se rozhoupá a otře o stěnu.',turn:'Otočíš ji hřeby ven. Pověra se tím asi nezmění.',inspect:'Mlynář věřil na štěstí. Podkova visí na jednoduchém železném háčku, ze kterého ji můžeš sundat.'}],
      ['schudky','schudky;stupne;stupinek','U náhonu vedou dva kluzké schůdky k vodě.',{touch:'Bota ti ujede po ledu. Zachytíš se za trám a raději se vrátíš.',inspect:'Na posledním stupni zůstává tmavá hladina pod tenkým ledem.'}],
      ['klice','stary klin;dreveny klin','U stěny trčí z kamene ztrouchnivělý dřevěný klín.',{pull:'Klín drží jen silou mrazu. Při zatažení se rozpadne na třísky.',inspectAfter:'Po klínu zůstala mělká stopa v kameni.',inspect:'Mlynář si jím kdysi podkládal vratký trám.'}]
    ],
    bridge: [
      ['krovi','krovi;ker;kerik;kere;keri;kerecky;vetve u mostu;vetvicky ve snehu;trnity ker;trni;ker u mostu','Na kraji útesu vidíš místo křoví jen sníh, kámen a rozsedlinu. Nic se tu neskrývá za větvemi.',{}],
      ['spona','spona;sponu;spony;sponou;rezava spona;rezavou sponu;zeleznou sponu;zeleznou sponou;kovova spona','V úzké spáře na hraně útesu vězí zrezlá železná spona. Pod ní je cosi tmavého.',{touch:'Železo je ve spáře pevně zaklíněné. Prsty s ním nepohneš.',pull:'Spona se ani nehne. Zaklínila se mezi kameny.',knock:'Železo slabě zadrnčí. Zvuk se ztratí v propasti.'}],
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
      ['vyklenek','vyklenek;vyklenku;vyklenkem;bocni vyklenek;vyklenek ve stene;vyklencich','Mezi dvěma sloupy je mělký pohřební výklenek. Stín v jeho dolní části má nezvykle rovné hrany.',{}],
      ['schranka','schranka;schranku;schranky;drevena schranka;starou schranku;skrinka;skrinku;skrinky;bednicka v krypte;truhlicka;truhlicku;truhla v krypte;viko schranky;viko skrinky;zetlela latka;pohrebni latka;plachta ve vyklenku','V dolní části výklenku leží malá dřevěná schránka pod zetlelou pohřební látkou. Víko drží staré, pevně zakousnuté hřeby.',{}],
      ['jmena','vytesana jmena;jmena na kamenech;napisy na kamenech','Na několika deskách jsou sotva čitelná jména.',{read:'Přečteš jen část: „...ať ho světlo nezapomene“. Jméno už se rozpadlo s kamenem.',clean:'Ometáš prach z písmen. Vzkaz je čitelnější, ale stále neúplný.'}],
      ['relief','relief;reliefu;reliéf;kamenny relief;reliefy','Ve stěně je vytesaný obraz sedmi hvězd.',{inspect:'Hvězdy jsou rozmístěné nepravidelně. Jeden bod je téměř setřený.',touch:'Pod prstem cítíš pečlivě vysekané důlky. Kdysi sem někdo chodil vzpomínat.'}],
      ['kosti','stare kosti;ulomky kosti;kost','V prachu leží maličký úlomek kosti.',{touch:'Zvedneš jej jen na okamžik. Vrátíš ho, kde ležel.',inspect:'Patří dávno mrtvému zvířeti. Krypta bývala otevřenější, než je dnes.'}],
      ['pruvan','pruvan;studeny vzduch','Mezi dvěma kameny táhne chladný vzduch.',{listen:'Slyšíš jen tiché svištění. Otevřít druhý průchod tu nelze.',touch:'Proud studeného vzduchu ti sklouzne kolem zápěstí.'}],
      ['miska','hlinena miska;miska;obetni miska','U stěny stojí prázdná hliněná miska.',{inspect:'Na dně zůstaly zaschlé lístky. Někdo sem kdysi přinesl květiny.',touch:'Miska je studená. Přemístíš ji o píď, ale nic pod ní není.',smell:'Ze suchých lístků už žádná vůně nezůstala.'}],
      ['spalene','stopy po plameni;spalene zdi;saze','Nad držáky pochodní jsou černé šmouhy.',{inspect:'Saze jsou mnohem starší než mráz. Zdi kdysi ozařoval živý oheň.',touch:'Černý prach ulpí na rukavici.'}],
      ['kapky','kapky ze stropu;kapani;kapka','Z vysokého stropu pravidelně dopadá voda.',{listen:'Jedna kapka, druhá, třetí. V tmě se mezi nimi zdá být příliš dlouhé ticho.'}]
    ],
    observatory: [
      ['mapa','hvezdna mapa;hvezdnou mapu;hvezdne mape;mapa hvezd;mapu hvezd;stara mapa;starou mapu;mapa;mapu;mape;mapy','Na stěně visí vybledlá hvězdná mapa.',{inspect:'Přistoupíš ke hvězdné mapě nad zastavenými hodinami. Na zažloutlém plátně vedou jemné kružnice mezi souhvězdími; u některých hvězd jsou dopsané letopočty drobnou rukou. Poslední záznam končí těsně před příchodem dlouhé zimy. Jeden roh mapy se odchlipuje od stěny a sotva slyšitelně šustí ve větru.',touch:'Plátno je křehké; opatrně se jej dotkneš a hned ucukneš.',read:'Jméno souhvězdí ve spodním rohu chybí. Zůstaly jen tři úhledné číslice.'}],
      ['tezitko','mosazne tezitko;tezitko','Na okraji stolu leží mosazné těžítko.',{touch:'Přitiskneš jím roh zápisníku, aby jej vítr neotáčel.',turn:'Obrátíš těžítko v ruce. Zespodu jsou drobné, trochu křivé iniciály hvězdáře. Nejde o pečeť ani o klíč; jen o znamení něčeho, co mu patřilo.'}],
      ['kresba','kresba kopule;nakres kopule;stare nacrty;pracovni nacrty;nacrty;nacrtech;nacrtky','U dalekohledu leží několik pracovních náčrtů.',{inspect:'Na jednom je kopule ještě celá. Hvězdář ji kreslil s trpělivostí stavitele.',read:'Poznámky jsou převážně výpočty. Ne každé číslo je návod k hádance.'}],
      ['prasklina','prasklina v kopuli;trhlina ve strese','Skrz prasklinu ve střeše proniká noční obloha.',{listen:'Vítr na okamžik zahvízdá tak čistě, jako by někdo pískl jediný tón.',touch:'Na prasklinu nedosáhneš. Ve tmě není rozumné lézt po trámech.'}],
      ['prach','prach na stole;vrstva prachu','Na některých přístrojích leží vrstva šedého prachu.',{touch:'V prachu zůstane tvůj otisk. Nikdo ho hned nesmaže.',clean:'Z jednoho místa setřeš prach. Mosaz se pod ním slabě zaleskne.'}],
      ['hodiny','stare hodiny;kyvadlove hodiny;hodiny;hodin;kyvadlo','V koutě stojí dávno zastavené kyvadlové hodiny.',{inspect:'Za matným sklem stojí obě ručičky bez hnutí. Mosazný ciferník pokrývá prach a kyvadlo visí jako závaží na neviditelné niti. Hvězdář nad nimi pověsil mapu noční oblohy; kdysi tu zřejmě odměřoval nejen hodiny, ale i pohyb hvězd.',touch:'Dotkneš se kyvadla. Jedenkrát se zhoupne a zase utichne.',listen:'Hodiny netikají. O to hlasitěji slyšíš vlastní dech.'}],
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
    take:'vezmi vezmete vem vzit seber sebrat zvednout zvedni zvednete uchop uchopit',
    open:'otevrit otevri otevru otevreme pootevrit pootevri odklopit odklop otevirej nadzvednout nadzvedni',
    close:'zavrit zavri privrit privri zaklapnout zaklapni',
    kick:'kopnout kopni kopnu kopat nakopnout nakopni vykopnout vykopni',
    touch:'dotknout dotkni sahnout sahni osahat ohmatat chytit odhrnout odhrn rozhrnout rozhrn rozhrni odhrni',
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
    break:'zlomit zlom rozlomit rozbij rozmlatit rozmlat rozmlatim roztlouct roztluc roztlouci roztriskat roztriskej roztriskam rozdrtit rozbijet rozbijej',
    use:'pouzit pouzij aplikovat',
    shake:'zatrasit zatras zatrast zatrasu zatres protrepat protrep zatrepat zatrep zachrastit zachrastej',
    burn:'spalit spal zapalit zapal podpalit podpal',
    repair:'opravit oprav spravit sprav',
    weigh:'potazkat potazkej zvazit zvaz',
  };
  const index = Object.fromEntries(Object.entries(objects).map(([room,lines])=>[room,lines.map(([id,aliases,look,actions])=>({id,aliases:aliases.split(';').sort((a,b)=>b.length-a.length),look,actions}))]));
  // Jen neškodné úkony lze domyslet při JEDNOM překlepu/skloňování.
  // Útok, použití meče a změny herního stavu musejí dál odpovídat přesně.
  const safeNounIntents=new Set(['inspect','touch','listen','smell','read','clean','sit','watch']);
  const ignoreWords=new Set(['se','si','na','do','za','pod','nad','u','k','ke','od','o','po','z','ze','s','ve','v','ten','ta','to','tu','tady','tam','je','jsou','mi','prosim','jeste','stary','starou']);
  function oneEdit(a,b){
    if(a===b)return true;
    if(Math.abs(a.length-b.length)>1)return false;
    let i=0,j=0,errors=0;
    while(i<a.length&&j<b.length){
      if(a[i]===b[j]){i++;j++;continue;}
      if(++errors>1)return false;
      if(a.length>b.length)i++;
      else if(b.length>a.length)j++;
      else{i++;j++;}
    }
    return errors+(a.length-i)+(b.length-j)<=1;
  }
  const vistas={
    clearing:'Pod smrkem vyčnívá ze sněhu stará lavice. U cesty ční ohlazený patník a ve zmrzlé hlíně se ztrácejí stopy dávných poutníků.',
    mill:'Na zápraží visí rezavá podkova. Kolem pantů dveří se odlupuje rez a za stojícím kolem tiše proudí voda zamrzlým náhonem.',
    bridge:'Vítr pročesává zbytky prken. V kameni jsou staré rýhy a mezi úlomky mostu zůstaly zachycené útržky dávno zpřetrhaných provazů. Na samé hraně levého útesu občas něco slabě odrazí světlo.',
    tower:'Mezi kameny nádvoří prorůstá zmrzlá tráva. U zdi je zasypaná studna, ve výklenku torzo sochy a vysoko nad ní vybledlý prapor.',
    crypt:'Na kamenných deskách se pod světlem ztrácejí vytesaná jména. Ve stěně je reliéf sedmi hvězd, opodál mělký pohřební výklenek a pod ním zapomenutá hliněná miska.',
    observatory:'U stěny se zastavily kyvadlové hodiny. Nad nimi visí hvězdná mapa a u mosazného dalekohledu jsou rozložené pracovní náčrty.',
    cave:'U skály leží promáčknutá přilba. V ledu se táhnou černé praskliny a stěny poseté krystaly vracejí čarodějovu modrou zář.'
  };
  function resolve(raw,room,flags={},pendingIntent=null) {
    const text=raw.trim().replace(/^(?:(?:zkusim|zkus|chtel bych|chtela bych|pokusim se|pokus se|prosim|mohl bych|mohla bych|rad bych|rada bych|chci) )+/, '');if(!text)return null;
    const words=text.split(' '),first=words[0];
    // Sjednocení s hlavním slovníkem: další tvary téhož slovesa nemají
    // padat do jiné logiky jen proto, že stojí před malovanou kulisou.
    const verbForms=Object.entries(verbs).map(([intent,list])=>
      [intent,new Set((list+' '+(globalThis.adventureLanguage?.verbs?.[intent]||'')).split(/\s+/))]);
    // Sloveso může být za předmětem: „bednu chci otevřít“.
    let intent=verbForms.find(([,forms])=>forms.has(first))?.[0];
    if(!intent&&words.length>1&&!/^(?:co|kde|proc|jak|kdo|kam|kudy|jestli|zda)$/.test(first))
      intent=verbForms.find(([,forms])=>words.slice(1,5).some(w=>forms.has(w)))?.[0];
    // „prozkiumat lavici“: bezpečný překlep v příkazu pro pozorování.
    // U destruktivních sloves nikdy automaticky nehádáme záměr hráče.
    if(!intent&&first.length>=6&&text.includes(' ')){
      const guesses=verbs.inspect.split(' ').filter(word=>word.length>=6&&oneEdit(first,word));
      if(guesses.length===1)intent='inspect';
    }
    if(!intent&&/^(co (je|jsou) (na|pod|u)|jak vypada|co vidim na)/.test(text))intent='inspect';
    if(!intent&&pendingIntent&&['open','inspect','take','touch','pull','push','cut','break','use','close','kick'].includes(pendingIntent))intent=pendingIntent;
    if(!intent)return null;
    // Delší název má přednost před vnořenou obecnou částí:
    // „plachta ve výklenku“ není výklenek.
    let best=null;
    for(const object of index[room]||[])for(const alias of object.aliases){
      const expr=new RegExp('(?:^| )'+alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:$| )');
      // Podkova není jen kulisa: při sebrání ji přenecháme inventářovému
      // systému, aby se hráči skutečně dostala do vaku.
      if(expr.test(text)){
        if(object.id==='privesena'&&(intent==='take'||flags.horseshoeTaken))continue;
        if(!best||alias.length>best.length)best={id:object.id,length:alias.length};
      }
    }
    if(best)return {id:best.id,intent,room,
      swordExplicit:/\b(?:mec|mece|mecem|meci|cepel|cepeli|ostri|ostrim)\b/.test(text)};
    // Jediný drobný překlep v jednoslovném názvu okolního předmětu.
    // Použít lze jen jednoznačný nález v aktuální místnosti.
    if(safeNounIntents.has(intent)){
      const words=text.split(/\s+/).slice(1).filter(word=>word.length>=5&&!ignoreWords.has(word));
      const matches=new Set();
      for(const object of index[room]||[])for(const alias of object.aliases){
        if(alias.includes(' ')||alias.length<5)continue;
        if(words.some(word=>oneEdit(word,alias)))matches.add(object.id);
      }
      if(matches.size===1)return {id:[...matches][0],intent,room};
    }
    return null;
  }
  function react({id,intent,room,swordExplicit=false},flags,hasSword){
    const o=index[room]?.find(obj=>obj.id===id);if(!o)return null;
    flags.worldDetails ||= {};
    const k=room+':'+id;
    const used=flags.worldDetails[k] ||= {};
    if(room==='observatory'&&id==='tezitko'&&intent==='inspect'){
      const inspection=used.inspections||0;used.inspections=inspection+1;
      return [
        o.look,
        'Vezmeš těžítko do dlaně. Je překvapivě těžké a na jedné hraně ohlazené, jak ho hvězdář po léta posouval po stole.',
        'Při pozornějším pohledu si všimneš mělkých rýh na spodní straně. Mohlo by tam být něco vyryté. Musel bys těžítko obrátit.',
        'Už na něm nic dalšího nenacházíš. Jen obyčejný předmět, kterého se někdo dotýkal každý den.'
      ][Math.min(inspection,3)];
    }
    if(room==='mill'&&id==='bedynka'){
      if(flags.crateBroken){
        if(intent==='close')return 'Rozštípané víko už nesložíš dohromady; bedýnka je zničená.';
        return flags.coinTaken?'Mezi rozházenými třískami leží zbytek prázdného dna. Bedýnku už znovu neotevřeš.':'Mezi rozházenými třískami se leskne stříbrná mince. Bedýnka je úplně rozštípnutá.';
      }
      if(intent==='inspect')return o.look;
      if(swordExplicit&&['open','pull','cut','attack','break','use'].includes(intent)){
        if(!hasSword)return 'Sáhneš po meči, ale nemáš ho u sebe. Víko zůstává přibité.';
        flags.crateBroken=true;
        return 'Zasunuješ ostří meče pod odchlípnutou fošnu a zabereš. Staré víko se rozletí na třísky, bedýnka se sesype do sněhu a ze dna vyklouzne drobná stříbrná mince.';
      }
      if(intent==='open'||intent==='pull'){
        const n=used.openAttempts||0;used.openAttempts=n+1;
        return n===0?'Vsuneš prsty pod odchlípnutou fošnu a zkusíš nadzvednout víko. Dřevo zavrže, ale staré hřeby je nepustí.':
          n===1?'Zabereš znovu za okraj víka. Prkno se bolestivě prohne a uvolní několik třísek, hřeby však drží dál.':
          'Víko už má otlačený okraj, ale rukama ho neotevřeš. Při dalším pokusu by ses jen pořezal o třísky.';
      }
      if(intent==='kick'){
        const n=used.kicks||0;used.kicks=n+1;
        return n===0?'Kopneš do bedýnky. Posune se ve sněhu a narazí o nohu pracovního stolu. Víko zarachotí, ale neotevře se.':
          'Další kopnutí uvolní pár třísek. Bedýnka se nakloní, hřeby však stále drží víko pohromadě.';
      }
      if(intent==='close')return 'Víko je už zavřené, i když jeho prkna odstávají. Přitlačíš je, ale hřeby se ani nepohnou.';
      if(['cut','attack','break','use'].includes(intent)){
        // Meč se nesmí „sám“ použít jen proto, že ho hráč nese ve vaku.
        return intent==='cut'?'Přejedeš prsty po odchlípnuté fošně. Holou rukou ji nepřetneš; hřeby stále drží víko.':
          'Zkusíš bedýnku rozbít holýma rukama. Fošny praskají, ale víko na hřebech nepovolí.';
      }
      if(intent==='touch')return 'Přejedeš prsty po drsném dřevě. Pod odchlípnutou fošnou nahmatáš hřebíky, ale dovnitř nedosáhneš.';
      return globalThis.adventureLivingWorld11824?.generic({id,intent,room},flags)||o.look;
    }
    if(room==='crypt'&&id==='vyklenek'){
      flags.cryptNicheFound=true;
      return flags.cryptChestOpen?'Ve výklenku leží otevřená okovaná pohřební schránka. Víko drží na starém pantu a zbytky látky leží v prachu.':'Odhrneš kus zpuchřelé pohřební látky. Pod ní objevíš malou okovanou pohřební schránku s reliéfem slunce. Zarezlý uzávěr v prstech nepovolí.';
    }
    if(room==='crypt'&&id==='schranka'){
      if(!flags.cryptNicheFound){flags.cryptNicheFound=true;return 'Přejedeš rukou po stěně výklenku a odhrneš zetlelou látku. Pod ní je stará okovaná schránka se zrezlým uzávěrem.';}
      if(flags.cryptChestOpen)return flags.cryptLetterTaken?'Víko schránky stojí odklopené na starém pantu. Uvnitř už nic nezůstalo.':'Víko schránky stojí odklopené. Uvnitř je úhledně složený zažloutlý lístek.';
      if(intent==='open')return 'Zkusíš otevřít schránku prsty, ale uzávěr je zrezlý a víko se ani nehne.';
      if(intent==='close')return 'Schránka je už pevně zavřená. Poklop drží zrezlý uzávěr.';
      if(['cut','attack','break','use','pull'].includes(intent)){
        if(!swordExplicit)return 'Zkusíš uvolnit zrezlý uzávěr rukama. Jeho hrana je ostrá, ale víko se nepohne. Bez vhodného nástroje by ses jen poranil.';
        if(!hasSword)return 'Zarezlý uzávěr drží. Potřebuješ něco pevného a ostrého, co dostaneš pod jeho okraj.';
        flags.cryptChestOpen=true;
        return 'Zasunuješ špičku meče pod zrezlý uzávěr a opatrně zatlačíš. Ozve se ostré lupnutí kovu. Víko na starém pantu povolí a pod ním objevíš pečlivě složený lístek, který tam někdo nechal dávno před mrazem.';
      }
      if(intent==='touch')return 'Prstem zkoušíš odchlípnout víko. Zarezlý uzávěr drží překvapivě pevně.';
      return globalThis.adventureLivingWorld11824?.generic({id,intent,room},flags)||o.look;
    }
    if(room==='bridge'&&id==='krovi'){
      if(flags.pendantRevealed)return 'Na okraji útesu zůstala mělká otevřená skrýš v kameni.';
      if(['inspect','touch','clean','pull','cut'].includes(intent))return 'Žádné křoví tu neroste. Zaměříš se raději na tmavou skalní spáru u okraje.';
      return o.look;
    }
    if(room==='mill'&&id==='klice'&&intent==='pull'&&used.changed)
      return 'Po klínu zůstaly v kameni jen drobné třísky. Už není za co zatáhnout.';
    if(room==='bridge'&&id==='provazky'&&intent==='cut'&&used.changed)
      return 'Zbytky starého provazu už jsi přerušil. Ve spáře zůstala jen roztřepená vlákna.';
    if(room==='bridge'&&id==='spona'){
      if(!flags.ledgeInspected){flags.ledgeInspected=true;return 'Přiklekneš u hrany útesu. Teprve teď rozeznáš, že lesk vychází ze zrezlé spony zaklíněné v úzké skalní spáře. Něco pod ní zůstalo uvězněné.';}
      if(['cut','attack','use','pull'].includes(intent)){
        if(used.open)return flags.pendantTaken?'Za odchlíplou sponou už zůstala jen prázdná kamenná dutina.':'Za odchlíplou sponou leží v dutině stále přívěsek.';
        if(intent==='pull'&&!hasSword)return o.actions.pull;
        if(!hasSword)return 'Kov drží v kameni pevně. Holýma rukama jej neodtrhneš.';
        used.open=true;flags.pendantRevealed=true;flags.ledgeInspected=true;
        return 'Zasunuješ ostří meče pod zrezlou sponu na hraně útesu. Chvíli vzdoruje, potom s ostrým prasknutím odskočí. Za ní se otevře úzká dutina v kameni. Uvnitř leží drobný přívěsek s vyrytým souhvězdím.';
      }
      if(used.open)return 'Zrezlá spona visí napůl odtržená. Za ní je mělká kamenná skrýš.';
    }
    if(intent==='inspect')return used.changed&&o.actions.inspectAfter?o.actions.inspectAfter:(o.actions.inspect||o.look);
    const special=o.actions[intent];
    if(!special){
      const living=globalThis.adventureLivingWorld11824?.generic({id,intent,room},flags);
      if(living)return living;
      return intent==='cut'||intent==='attack'?'Ostří zasáhne povrch, ale nic dalšího se nestane.':
        intent==='open'?'Zkoušíš najít víko nebo západku, ale na této věci není co otevřít.':
        intent==='close'?'Tady není nic, co bys mohl zavřít.':
        intent==='kick'?'Kopneš do toho. Odpoví ti jen tupý zvuk; na okolí se nic nezmění.':
        intent==='break'?'Pokoušíš se to rozbít, ale bez výsledku.':
        intent==='use'?'Zkusíš s tím něco udělat. V tomto místě se nic nezmění.':
        intent==='touch'?'Dotkneš se toho. Je to skutečné, studené a staré; víc teď nezjistíš.':
        o.look;
    }
    if(['touch','clean','cut','attack','pull','break','turn'].includes(intent))used.changed=true;
    return special;
  }
  return {resolve,react,
    listObjects:()=>Object.entries(index).flatMap(([room,objects])=>objects.map(o=>room+':'+o.id)),
    listDescriptors:()=>Object.entries(index).flatMap(([room,objects])=>objects.map(o=>
      ({room,id:o.id,aliases:[...o.aliases]}))),
    glimpse:(room,flags={})=>{
    const vista=vistas[room]||'';
    return room==='mill'&&flags.horseshoeTaken?vista.replace('Na zápraží visí rezavá podkova. ',''):vista;
  }};
})();
