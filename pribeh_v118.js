// V11.8 – cílené porozumění českému rozhovoru, nikoli generování libovolných odpovědí.
// Především chrání osobní otázky před jejich záměnou s příkazy k pohybu.
globalThis.adventureStory118 = (() => {
 const match=(t,re)=>re.test(t);
 function detect(t,room,context={}){
  if(room==='observatory'&&match(t,/\b(?:denik|deniku|zapisnik|zapisniku|knihu|kniha|knihy|stranku|stranky|listy)\b/)&&
    match(t,/\b(?:cti|cist|precti|precist|procist|prolistuj|prolistovat|listuj|listovat|nalistovat|znovu|zase|znova|otevri|otevrit|prozkoumej|prozkoumat|prohledni|prohlednout|podivej|podivat|podivam|nahlidni|nahlidnout|nahlizet|posledni|konec)\b/))
   return {intent:'v118Journal',last:match(t,/\b(?:posledni|posledniho|poslednim|konec|konci)\b/),t};
  if(match(t,/^(?:zapomnel jsem se rozloucit|zapomnel jsem ti rict sbohem|nerozloucil jsem se|jeste jsem se nerozloucil)$/))
   return {intent:'v118Raven',topic:'forgotBye',t};
  if(room!=='clearing')return null;
  if(match(t,/^(?:(?:chci |mohu |muzu |chtel bych )?(?:pristoupit|pristup|priblizit se|pribliz se|prijit|jdu|jit|jdi) (?:o neco )?(?:bliz|blize|blizko|k havranovi|k havranovi bliz|k nemu|k ptakovi)|pristoupit k havranovi|priblizit se k havranovi|udelat krok k havranovi|jdu k havranovi)$/))
   return {intent:'v118Raven',topic:'approach',t};
  if(match(t,/^(?:(?:to )?nevim[, ]+)?(?:hledam|patram po|snazim se najit) (?:toho |nejakeho |zleho |ledoveho |temneho |zleho ledoveho )*(?:cernokneznika|carodeje|kouzelnika|maga)(?: v horach| v hore| v jeskyni)?$/))
   return {intent:'v118Raven',topic:'seekWizard',t};
  if(match(t,/^(?:(?:chci |mohu |muzu )?(?:natahnout|natahni|natáhnout|podam|podat|podavam|nabidnout|vztahnout|vztahni) (?:k nemu |k havranovi |k ptakovi )?(?:ruku|dla[n]|dlan|prsty)|ukazat havranovi prazdnou dlan|natahnout k havranovi ruku)$/))
   return {intent:'v118Raven',topic:'hand',t};
  if(match(t,/^(?:chci te pohladit|chtel bych te pohladit|rad bych te pohladil|muzu te pohladit|mohu te pohladit)$/))
   return {intent:'v118Raven',topic:'askStroke',t};
  if(match(t,/^(?:ustoupit od havrana|odstoupit od havrana|jdu od havrana|dat ruku zpet|stahnout ruku|ustoupit zpatky)$/))
   return {intent:'v118Raven',topic:'stepBack',t};
  if(match(t,/^(?:nemam lucernu|ja nemam lucernu|lucernu nemam|nemam zadne svetlo)$/))
   return {intent:'v118Raven',topic:'noLamp',t};
  // Zahřát havrana není pokyn k rozpouštění ledu ani k útoku.
  if(match(t,/^(?:(?:chci |zkusim |pokusim se |rad bych )?(?:zahrat|zahrej|zahreju|ohrat|ohrej|ohreju|prih[rř]at) (?:havrana|havranovi|te|ptaka|krkavce)(?: (?:svou |moji |svoji )?(?:lucernou|lampou|u lucerny|u lampy))?|(?:priblizit|pribliz|pristavit|pristav|pridrz|pridrzet) (?:lucernu|lampu) (?:k havranovi|havranovi|k nemu|k ptakovi)|(?:posvitit|posvit) (?:havranovi|havranovi na peri|havranovi na kridla) (?:lucernou|lampou))$/))
   return {intent:'v118Raven',topic:'warmWithLamp',t};
  if(match(t,/^(?:najdu lucernu a zahreju te|prinesu lucernu a zahreju te|az najdu lucernu zahreju te|vratim se s lucernou|prinesu ti lucernu)$/))
   return {intent:'v118Raven',topic:'lampPromise',t};
  if(match(t,/^(?:kde vezmu lucernu|kde sehnat lucernu|kde najdu lucernu)$/))
   return {intent:'v118Raven',topic:'lampWhere',t};
  if(match(t,/^(?:budes tu az pujdu zpatky|budes tu az se vratim|budes tu kdyz se vratim|pockas tu na me|pockas az se vratim|jeste tu budes az prijdu zpet)$/))
   return {intent:'v118Raven',topic:'waitForMe',t};
  if(match(t,/^(?:chyb[iy] ti (?:hlas|jeho hlas|hlas hvezdare)|postradas jeho hlas|chybi ti jak mluvil)$/))
   return {intent:'v118Raven',topic:'voiceMemory',t};
  if(match(t,/^(?:chtel by ses (?:vratit|vracet) (?:k hvezdari|za hvezdarem|k nemu)|chtel bys (?:se )?(?:vratit|vracet) (?:k hvezdari|za hvezdarem|k nemu)|chtel by ses k nemu vratit|rad by ses k nemu vratil|chybi ti tolik ze by ses vratil|chces se vratit k hvezdari)$/))
   return {intent:'v118Raven',topic:'wishReturn',t};
  if(match(t,/^(?:proc ses (?:mu|hvezdari) (?:zavazal|zavazoval)|proc zustavas|proc tu zustavas|proc jsi tu zustal|musis tu zustat|musis tu byt)$/))
   return {intent:'v118Raven',topic:'vow',t};
  if(match(t,/^(?:co mam udelat abys mohl odletet|co mam delat abys mohl odletet|jak ti mohu pomoct odletet|jak te dostanu odsud|jak ti mohu pomoct|jak ti muzu pomoct|jak ti mohu pomoci|co bych pro tebe mohl udelat)$/))
   return {intent:'v118Raven',topic:'howHelp',t};
  if(match(t,/^(?:co se ti stalo|co se stalo tobe|co se vlastne stalo tobe|co se stalo mezi tebou a hvezdarem|co se mezi vami stalo|proc ti rekl at tu zustanes|proc te hvezdar nechal tady)$/))
   return {intent:'v118Raven',topic:'whatHappened',t};
  if(match(t,/^(?:nasel jsem tvuj obrazek|nasel jsem tvoji kresbu|hvezdar te nakreslil|hvezdar si te nakreslil|v deniku je tvuj obrazek|na posledni strance je havran)$/))
   return {intent:'v118Raven',topic:'drawing',t};
  const ringContext=/^(?:ring|ringOrigin|ringComfort|ringPurpose|ringMeaning)$/.test(context?.topic||'');
  if(match(t,/\b(?:krouzek|krouzku|krouzkem|krouzku|na noze|ten znak|slunecni znak)\b/)||ringContext&&match(t,/^(?:proc ho mas|proc ho mas na sobe|neboli te|neskrti te|je ti pohodlny|co znamena|kdo ti ho dal)$/)){
   if(match(t,/\b(?:skrti|neskrti|boli|netlaci|tlaci|neprekazi|prekazi)\b/))return {intent:'v118Raven',topic:'ringComfort',t};
   if(match(t,/\b(?:od hvezdare|dal|daroval|nasadil|od koho|kdo)\b/))return {intent:'v118Raven',topic:'ringOrigin',t};
   if(match(t,/\b(?:proc|pro co|k cemu|na sobe|nos[iy]s)\b/))return {intent:'v118Raven',topic:'ringPurpose',t};
   return {intent:'v118Raven',topic:'ringMeaning',t};
  }
  return null;
 }
 return {detect};
})();
