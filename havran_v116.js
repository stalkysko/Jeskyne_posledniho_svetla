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
    ['wisdomPraise', /\b(?:jsi (?:velmi |opravdu |fakt |docela |tak )?(?:moudry|rozumny)|ty jsi moudry|mluvis moudre|moudre mluvis|to bylo moudre|to jsi rekl hezky|to jsi rekl moudre|moudry havran|mas pravdu havrane)\b/],
    // Otevíráky záměrně přijímají celé věty; nepatří do parseru předmětů.
    ['chatInvite', /^(?:chci si (?:s tebou )?povidat|chci (?:s tebou |si s tebou )?mluvit|rad bych si (?:s tebou )?povidal|mohli bychom si (?:spolu )?povidat|muzeme si (?:spolu |s tebou )?povidat|muzes si se mnou povidat|pojd si povidat|promluv si se mnou|povidej si se mnou|povidejme si|povidat si|povidani|pokecat si|muzeme pokecat|chci si popovidat|chci si promluvit|muzu si s tebou promluvit|muzu s tebou mluvit|chci s tebou prohodit par slov)(?: havrane)?$/],
    ['chatStart', /^(?:povidej|tak povidej|povidej mi|povidej neco|povidej mi neco|povez mi neco|rekni mi neco|rekni neco|co mi povis|co mi chces rict|mas mi co rict|co bys mi rekl|zacni povidat|zacinam poslouchat|posloucham te|mluv|povidej o sobe|povidej mi o sobe|povez mi o sobe|vypravej mi neco)(?: havrane)?$/],
    ['chatTopics', /^(?:o cem (?:si )?(?:budeme|chces|by sis chtel|bys chtel|si chces) (?:povidat|mluvit)|o cem si povidat|o cem se budeme bavit|o cem si muzeme povidat|o cem bychom si mohli povidat|vyber tema|navrhni tema|co te zajima|na co se mam zeptat|o cem mluvit)(?: havrane)?$/],
    ['chatPermission', /^(?:mas (?:na me |pro me )?(?:chvilku|chvili|cas)|muzu te na chvili zdrzet|nerusim te|neobtezuji te|muzu se s tebou bavit|smim s tebou mluvit|muzes me vyslechnout|vyslechnes me|poslouchas me|muzu si s tebou popovidat|mam na tebe otazku|muzu se te na neco zeptat|chtel bych se te na neco zeptat)(?: havrane)?$/],
    ['chatSmallTalk', /^(?:jak se (?:ti )?(?:vede|dari)|jak to jde|jak jde zivot|co je noveho|co mas noveho|co se dnes stalo|co delas dnes|jak se dnes citis|jak ses dnes mel|jaky jsi mel den|co je u tebe noveho)(?: havrane)?$/],
    ['chatGreeting', /^(?:ahoj|cau|nazdar|dobry den|dobre rano|dobry vecer|zdravim|zdravim te|rad te vidim|zase se vidime|ahoj kamarade|vitam te)(?: havrane)?$/],
    ['playerFear', /^(?:mam strach|bojim se|mam obavy|bojim se ze to nezvladnu|bojim se ze zabloudim|co kdyz se ztratim|nevim jestli to zvladnu)(?: havrane)?$/],
    ['playerSad', /^(?:je mi smutno|jsem smutny|cit im se sam|citim se sam|je mi smutno z toho vseho|to je smutne|je mi te lito)(?: havrane)?$/],
    ['playerCold', /^(?:je mi zima|mrznu|je mi strasna zima|jsem promrzly|je tu hrozna zima|nejak tu mrzne)(?: havrane)?$/],
    ['playerTired', /^(?:jsem unaveny|uz nemuzu|jsem vycerpany|potrebuji si odpocinout|potrebuju si odpocinout|uz jsem z toho unaveny)(?: havrane)?$/],
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
    wisdomPraise: [
      'Havran sklopí hlavu. „Moudrý? To nevím. Kdybych byl tak moudrý, možná bych se hvězdáře zeptal na víc věcí, než odešel.“ Po chvíli dodá: „Ale děkuji.“',
      '„Možná jsem jen měl příliš mnoho času přemýšlet,“ řekne havran. „A příliš málo času říct některé věci tomu, kdo je měl slyšet.“',
      'Havran se skoro pousměje. „To říkáš teď. Počkej, až mi zase něco upadne ze zobáku. Moudrost není tak stálá, jak se zdá.“'
    ],
    chatInvite: [
      'Havran se na ceduli otočí čelem k tobě. „Tak povídej, rytíři. Dlouho jsem neměl nikoho, kdo by se zastavil jen kvůli rozhovoru.“',
      '„Rád,“ odpoví havran a složí křídla. „Ptej se, na co chceš. Jen ode mě nečekej, že znám odpovědi na všechno.“',
      'Havran poposedne blíž. „V zimě se slova neztrácejí tak rychle jako stopy ve sněhu. Nuže, poslouchám.“'
    ],
    chatStart: [
      'Havran si vybere pevnější místo na ceduli. „Hvězdář mi kdysi říkal, že člověka poznáš podle otázek. Ptej se, rytíři. Uvidíme, co se o sobě dozvíme.“',
      '„Víš, co je zvláštní?“ začne havran. „Dřív jsem měl kolem sebe celé hejno. A přesto mi nikdo nenaslouchal tak jako ty teď.“',
      'Havran chvíli sleduje vločky. „Kdysi tu na jaře kvetly žluté květy. Vzpomínám si na ně líp než na mnoho slov. O čem chceš slyšet?“'
    ],
    chatTopics: [
      '„Můžeme mluvit o hvězdáři,“ navrhne havran. „Nebo o tom, co bývalo před zimou. A třeba o tom, proč se některé sliby tak těžko odkládají.“',
      '„Zeptal ses někdy sám sebe, proč se vracíš na místa, odkud jsi odešel?“ zadívá se na tebe havran. „O tom bychom mohli mluvit. Anebo o něčem veselejším.“',
      'Havran zapřemýšlí. „Pověz mi něco o své cestě. Já ti pak možná povím o době, kdy tenhle rozcestník nebyl bílý.“'
    ],
    chatPermission: [
      '„Mám čas,“ odpoví havran. „Více času, než se mi někdy líbí. Ptej se.“',
      'Havran se pohodlněji usadí. „Nerušíš mě. Ještě se mi nestalo, že by mě trápilo příliš mnoho návštěv.“',
      '„Poslouchám,“ přikývne. „A když nebudu vědět, řeknu ti to poctivě. Hvězdář mě to tak učil.“'
    ],
    chatSmallTalk: [
      'Havran se podívá na šedé nebe. „Nového? Dnes sněžilo o něco méně než včera. A pak jsi přišel ty. To je zatím nejzajímavější část dne.“',
      '„Jde to,“ řekne havran. „Sníh je studený, dřevo tvrdé a lidé vzácní. Ale s tebou se aspoň nenudím.“',
      '„Měl jsem klidný den,“ odpoví. „Dokud ses nezačal ptát. A to nemyslím ve zlém.“'
    ],
    chatGreeting: [
      'Havran se otočí za tvým hlasem. „Zdravím, rytíři. Vítej u mého věčně zasněženého rozcestí.“',
      '„Ahoj,“ zakráká havran. „To slovo je příjemnější, když na ně člověk — nebo pták — dostane odpověď.“',
      'Havran lehce pokývne hlavou. „Dobré setkání. Co tě dnes přivádí?“'
    ],
    playerFear: [
      'Havran ztichne. „Bát se můžeš, rytíři. Já se někdy bojím také. Důležité je vědět, kdy se zastavit, rozhlédnout a znovu vykročit.“',
      '„Kdyby strach znamenal zbabělost, nikdy bych neroztáhl křídla,“ řekne havran. „Můžeš tu chvíli zůstat a popadnout dech.“'
    ],
    playerSad: [
      'Havran skloní hlavu. „To mě mrzí. Někdy je lepší chvíli nic neřešit a jen s někým být. Jestli chceš, zůstanu poslouchat.“',
      '„Vím, jaké to je, když je kolem moc ticho,“ řekne havran. „Nemusíš mi hned nic vysvětlovat.“'
    ],
    playerCold: [
      'Havran si načechrá peří. „Mně pomáhá tohle. Tobě by se hodil plášť a nějaké závětří. Dlouho tu nestůj bez pohybu.“',
      '„Zima nemá soucit ani s rytíři,“ poznamená. „Já mám peří. Ty máš aspoň nohy, kterými můžeš chodit.“'
    ],
    playerTired: [
      '„Odpočiň si,“ řekne havran. „Nikdo po tobě nechce, abys všechno zvládl jedním krokem. Ani hvězdář by to nechtěl.“',
      'Havran přestane přešlapovat. „Sedni si na chvíli do závětří. Cesta ti neuteče. Bohužel,“ dodá s náznakem úsměvu.'
    ],
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
    // Oslovení a úvodní spojky nemění téma konverzace.
    const utterance=t.replace(/^(?:(?:a|no|tak|hele|prosim|havrane|hej havrane|ptaku|takze|nuze) )+/,'').trim();
    return rules.find(([,pattern])=>pattern.test(t)||pattern.test(utterance))?.[0] || null;
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
    } else if(['proud','wisdomPraise','chatInvite','chatStart','chatTopics','chatPermission','chatSmallTalk','chatGreeting','playerFear','playerSad','playerCold','playerTired','warm','care','together','trust','promise','escort'].includes(topic)&&n===0) {
      b.trust=Math.min(8,b.trust+1);
    }
    if(topic==='promise')b.promiseMade=true;
    if(['care','warm'].includes(topic))b.helpOffered=(b.helpOffered||0)+1;
    if(topic==='capture'&&b.harmed===1)return lines.capture[0];
    if(b.harmed>b.apologies&&['proud','wisdomPraise','chatInvite','chatStart','chatTopics','chatPermission','chatSmallTalk','chatGreeting','trust','together','escort','care'].includes(topic))return 'Havran poodstoupí. „Ještě si pamatuji tvoje ruce a lano. Nejdřív mi ukaž, že ti mohu věřit.“';
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
