// 0.11.8.27 – otázky na minulost právě popsané lokace a jejich návaznosti.
// Fakta jsou pevně svázána s napsanými scénami. Žádné přidávání minulosti
// havrana, hvězdáře, padlých ani čaroděje bez opory v příběhu.
globalThis.adventurePlaceMemory11827=(()=>{
  'use strict';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
  const known=new Set(['clearing','mill','bridge','tower','crypt','observatory','cave']);
  const place='(?:tu|tady|zde|na tomhle miste|na tomto miste|na tom miste|v techto mistech|v tehle oblasti|v tomhle udoli|v tomto udoli)';
  const before='(?:(?:vlastne|asi|kdysi|driv|drive|tenkrat|pred lety|pred zimou|tehdy) )*';
  const event='(?:stalo|odehralo|prihodilo|udalo|prihodilo se)';
  const direct=[
    new RegExp('^co se (?:to )?'+place+' '+before+event+'$'),
    new RegExp('^co se '+before+event+' '+place+'$'),
    new RegExp('^co '+place+' '+before+'(?:bylo|byvalo|probe hlo|probehlo|udalo se)$'),
    new RegExp('^(?:vis|tusis|reknes mi|povez mi|dokazes rict) (?:co se '+place+' (?:stalo|odehralo)|co se stalo '+place+')$'),
    /^(?:jaka|jakou) (?:ma|je) (?:tohle misto|tohle misto ma|to misto|to misto ma) (?:historii|minulost)$/, 
    /^(?:jaka je|co je|co vis o) (?:historie|minulost|historii|minulosti) (?:tohoto mista|tohohle mista|toho mista|roz cesti|rozcesti|tady|tohoto udoli)$/,
    new RegExp('^(?:jaky pribeh|jaka udalost) (?:se )?'+place+' (?:odehral|odehrala|stal|stala)$'),
    /^(?:proc je to tu tak opustene|proc je to tady tak opustene|proc to tu vypada tak opustene|proc tu nikdo neni)$/
  ];
  // Poslední významný text patří konkrétnímu místu; následné „A proč?“
  // se smí vyhodnotit jen bezprostředně po odpovědi o jeho historii.
  const followups={
    who:/^(?:a )?(?:kdo tu byl|kdo tady byl|kdo tu zil|kdo tady zil|kdo sem chodil|kdo tudy chodil|kdo to tu udelal|kdo to zpusobil|kdo za to mohl|ci to byly stopy|komu patrily ty stopy)$/,
    when:/^(?:a )?(?:kdy se to stalo|kdy se to odehralo|kdy to bylo|jak je to dlouho|jak dlouho uz to je|pred jakou dobou|kdy se to prihodilo)$/,
    why:/^(?:a )?(?:proc|a proc|proc se to stalo|proc k tomu doslo|proc se to prihodilo|co to zpusobilo|z jakeho duvodu|jak se to stalo)$/,
    evidence:/^(?:a )?(?:jak to vis|odkud to vis|jak jsi na to prisel|kde to vidis|podle ceho to soudis|co to dokazuje|co te k tomu vede)$/,
    after:/^(?:a )?(?:co bylo potom|co se stalo pak|co se stalo dal|a potom|co se stalo nasledne|jak to dopadlo|co se s nimi stalo)$/,
    more:/^(?:a )?(?:povez vic|povez mi vic|rekni mi vic|povidej dal|co jeste|vis jeste neco|co se da jeste zjistit|vysvetli mi to)$/
  };
  function detect(raw,state){
    const room=state?.room;
    if(!known.has(room))return null;
    const t=norm(raw);
    if(!t)return null;
    if(direct.some(re=>re.test(t)))return {intent:'placeHistory11827',part:'overview',room};
    // Samostatné otázky na viditelné stopy v aktuálním prostředí.
    if(room==='clearing'&&/^(?:komu patri ty stopy|ci jsou ty stopy|kdo zanechal ty stopy|kdo tudy kdysi sel|kdo tudy chodival)$/.test(t))
      return {intent:'placeHistory11827',part:'who',room};
    if(state?.lastCommandIntent!=='placeHistory11827'&&state?.lastCommandIntent!=='placeHistoryFollowup11827')return null;
    if(state?.placeHistory?.room!==room)return null;
    for(const [part,regexp] of Object.entries(followups))if(regexp.test(t))
      return {intent:'placeHistoryFollowup11827',part,room};
    return null;
  }
  const facts={
    clearing:{
      overview:'Havran pohlédne na zapadanou lavici a na ohlazený patník. „Tudy prošlo mnoho lidí. Na kameni je to vidět lépe než ve sněhu.“ Odmlčí se. „Co se jim přihodilo dál, o tom ty stopy mlčí. A já nemohu vědět o každém, kdo šel kolem.“',
      who:'„Poutníci,“ řekne havran. „Někteří se tu zastavili, jiní prošli dál. Jména do sněhu nepíší. A kdyby ano, vítr by je už dávno smazal.“',
      when:'Havran se podívá na patník. „Ten kámen tu stojí déle, než já počítám zimy. Ale který otisk patří kterému roku? To bych si musel vymyslet.“',
      why:'„Cesty se tu sbíhají,“ odpoví havran. „To je důvod, proč sem lidé přicházeli. Proč se někdo nevrátil, ti neřeknu. Každý měl svůj příběh.“',
      evidence:'Havran kývne zobákem ke sněhu. „Lavice, patník, stopy. To všechno vidíš sám. Jejich příběhy v nich ale nepřečteš.“',
      after:'Havran chvíli hledí do směru cesty. „Některé jsem viděl odcházet. Některé znovu přicházet. Ostatní mi už vítr nepřinesl zpátky.“',
      more:'„Kdyby každá stopa uměla mluvit, nepotřeboval bys mě,“ řekne havran tiše. „Některé věci se dozvíš jen tehdy, když půjdeš dál.“'
    },
    mill:{
      overview:'Na stole zůstaly kruhy po hrncích a v náhonu pod ledem stále proudí voda. Mlýn býval místem práce a obyčejného života. Dnes stojí, dveře jsou zapřené a mráz jej drží v tichu. Proč přesně odešli jeho obyvatelé, z těchto stop nepoznáš.',
      who:'Kruhy po nádobách, otisky nástrojů a opotřebené dřevo vypovídají o lidech, kteří tu pracovali. Jména majitele ani posledního návštěvníka tu však nikde napsaná nejsou.',
      when:'Některé záseky ve dřevě vznikly dávno před současným mrazem. Jak dlouho už mlýn stojí opuštěný, ze samotného zápraží nevyčteš.',
      why:'Zamrzlé kolo prozrazuje, proč mlýn dnes nepracuje. Neprozrazuje ale, kdo odešel jako poslední ani jaké měl důvody.',
      evidence:'Prohlédneš si odřený stůl, otisky hrnků a zásek po sekeře. Každá stopa něco říká o dávné práci. Žádná sama o sobě nevysvětluje opuštění mlýna.',
      after:'Zůstaly zavřené dubové dveře, těžký pracovní stůl a voda tekoucí pod ledem. Další osudy mlynáře ti místo neprozradí.',
      more:'Starý mlýn neskrývá odpověď v jediné větě. Některé věci můžeš prozkoumat zblízka: stůl, náhon, panty a to, co pod deskou zůstalo.'
    },
    bridge:{
      overview:'Z mostu zůstaly jen pahýly trámů a zpřetrhané provazy. Je zřejmé, že se přechod kdysi zřítil. Co most přetrhlo a zda při tom někdo stál na jeho prknech, nevíš.',
      who:'Na starých trámech a zbytcích lana není jméno stavitele ani posledního poutníka. Mohli tudy chodit mnozí; bez dalšího důkazu bys jen hádal.',
      when:'Dřevo i lana už dlouho chátrají. Jejich stáří nedokážeš určit tak přesně, abys mohl říct, kdy se most zřítil.',
      why:'Mohl ho oslabit čas, mráz nebo něco jiného. Vidíš následek, nikoli příčinu; žádnou z možností si zatím nemůžeš potvrdit.',
      evidence:'Pahýly dubových trámů, vytržená lana a staré rýhy na kameni dokazují zánik přechodu. O důvodu jeho pádu ale mlčí.',
      after:'Zůstal jen přerušený přechod nad propastí. Co se stalo lidem na druhé straně, nepoznáš z prken, která tu zbyla.',
      more:'Vítr pročesává prázdné místo mezi pilíři. Prkna, kámen a staré provazy jsou skutečné stopy; zbytek příběhu zůstává neznámý.'
    },
    tower:{
      overview:'Zasypaná studna, zničená socha a vybledlý prapor ukazují, že nádvoří bývalo užívané. Dnes je opuštěné a věž stojí zamčená. Kdo odešel poslední a proč, z těchto zbytků nevyčteš.',
      who:'Kdysi tu někdo udržoval studnu, dláždění a prapor. O jménech obyvatel však poškozená socha ani opuštěné nádvoří nic jistého neříkají.',
      when:'Některé opravy dlažby jsou starší než sníh. Přesnější dobu opuštění nádvoří neznáš.',
      why:'Dnešní ticho může mít mnoho příčin. Zamčené dveře ti říkají jen to, že se dovnitř běžně nechodí; o důvodu opuštění jsou to zatím dohady.',
      evidence:'Studna je zasypaná, prapor vybledl a obličej sochy se rozpadl. Místo je staré a opuštěné. Nic z toho ještě neprozrazuje úplný příběh.',
      after:'Zůstalo nádvoří a věž, v níž se kdysi pracovalo. Co se tu stalo potom, můžeš hledat v zachovaných věcech, ne v odhadech.',
      more:'Ohlédneš se k vybledlému praporu, starému ohništi a zamčeným dveřím. Tady se minulost nedozvíš najednou.'
    },
    crypt:{
      overview:'Jména vytesaná do kamene a pohřební výklenky ukazují, že sem lidé přicházeli vzpomínat na mrtvé. Přinášeli sem světlo i drobné dary. Čí život se za jednotlivými jmény skrýval, už téměř nejde přečíst.',
      who:'Na deskách jsou zbytky jmen, ale většinu písmen odnesl čas. Nemůžeš je spojit s konkrétním příběhem bez dalších záznamů.',
      when:'Saze nad držáky pochodní jsou mnohem starší než současný mráz. Jak dlouho se tu lidé scházeli, přesně nevíš.',
      why:'Tohle místo bylo určené památce mrtvých. Proč zemřel každý z nich, však samotné desky neprozradí.',
      evidence:'Kamenné desky, reliéf hvězd, zaschlé lístky v misce a staré saze svědčí o pohřebních obřadech. Víc jistoty zatím nemáš.',
      after:'Zůstaly hroby, reliéfy a neúplné nápisy. O dalších osudech těch, kdo sem chodili, můžeš jen pátrat.',
      more:'Pod světlem lze na starých deskách rozeznat stopy rukou, které je kdysi vytesaly. Ale každé jméno, které chybí, je příběh, který si nemáš právo vymyslet.'
    },
    observatory:{
      overview:'Hvězdář tu pracoval s dalekohledem, mapami a zápisníkem. Zastavené hodiny a opuštěný stůl ukazují, že práce dávno ustala. Co se mu v jeho posledních chvílích skutečně přihodilo, však z toho samotného nevyplývá.',
      who:'Věci tu patřily hvězdáři. Za jeho práci mluví dalekohled, výpočty a náčrty. O posledním návštěvníkovi před tebou jistý důkaz nemáš.',
      when:'Zastavené hodiny datum neprozradí. Hvězdář zanechal záznamy, ale dokud je neprostuduješ, nebudeš vědět, kdy jeho práce skončila.',
      why:'Je jasné, že hvězdář pozoroval oblohu a vedl si záznamy. Proč jeho práce skončila, nemůžeš určit jen ze zastavených hodin.',
      evidence:'Na stole leží zápisky, vedle nich náčrty a nad hodinami visí mapa. To jsou skutečné doklady jeho práce. Nejsou však výpovědí o jeho smrti.',
      after:'Dalekohled zůstal stát, hodiny se zastavily a zápisky tu stále leží. O další části příběhu musíš hledat důkazy jinde.',
      more:'Hvězdářovy poznámky mohou prozradit víc než prázdná místnost. Rozhodně ale neodpovídají na každou otázku o jeho osudu.'
    },
    cave:{
      overview:'Ledovou jeskyni lemují stopy bot, padlá těla trpaslíků a praskliny ve skále. Je zřejmé, že se tu něco zlého odehrálo, ale z pohledu na mrtvé nemůžeš bez dalších důkazů určit přesný průběh jejich posledních chvil.',
      who:'U skály leží padlí ledoví trpaslíci. Kdo přesně je přivedl až sem a jak každý z nich zemřel, pouhé stopy neurčí.',
      when:'Led některé stopy uchoval, jiné zakryl. Nemáš jistotu, jak dlouho tu padlí leží.',
      why:'Čaroděj, zmrzlé stopy a mrtvá těla spolu nepochybně souvisejí s nebezpečím tohoto místa. To ale ještě nestačí k vymyšlení všech událostí.',
      evidence:'Promáčknutá přilba, otisky končící u sloupu a ledové praskliny jsou skutečné stopy. Kdo zasadil poslední ránu, z nich přímo nevyčteš.',
      after:'Těla zůstala u sloupu a portál dál střeží čaroděj. Dokud tu stojí, ani ty nemáš cestu volnou.',
      more:'V ozvěně jeskyně téměř zaniká tvůj dech. Můžeš prozkoumat stopy a výstroj padlých, ale ani led si nepamatuje každé slovo.'
    }
  };
  function reply(state,part){
    const room=state.room,content=facts[room];
    if(!content)return null;
    const key=content[part]?part:'overview';
    let output=content[key];
    // Předchozí zásah hráče není pradávná událost. Zmíním jej jen jako
    // dnešní, ověřitelnou změnu, nikoli jako nově vymyšlenou minulost.
    if(key==='overview'&&room==='mill'&&state.flags?.crateBroken)
      output+=' Rozštípnutá bedýnka pod stolem je ovšem čerstvá stopa po tvém vlastním zásahu.';
    if(key==='overview'&&room==='bridge'&&state.flags?.bridge)
      output+=' Přes propast nyní vede lano, které jsi tu upevnil ty.';
    if(key==='overview'&&room==='tower'&&state.flags?.door)
      output+=' Věžní dveře už jsou díky tobě otevřené; to je změna, kterou znáš jistě.';
    if(key==='overview'&&state.won)
      output+=' A dnes se po porážce čaroděje začíná led konečně rozpouštět.';
    state.placeHistory={room,part:key,asked:(state.placeHistory?.room===room?(state.placeHistory.asked||0):0)+1};
    return output;
  }
  return {norm,detect,reply};
})();
