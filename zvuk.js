/* Jeskyně posledního světla — původní hudba a prostorové ruchy.
   Neobsahuje cizí melodie, nahrávky ani externí soubory. Hraje až po kliknutí. */
(() => {
  'use strict';

  const AudioClass = window.AudioContext || window.webkitAudioContext;
  const button = document.getElementById('sound');
  const musicButton = document.getElementById('music');
  const testButton = document.getElementById('audio-test');
  if (!button || !musicButton) return;

  const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  const mobileBoost = appleMobile ? 2 : 1;

  let context = null;
  let nodes = null;
  let active = false;
  let musicActive = false;
  let room = 'clearing';
  let won = false;
  let detailTimer = null;
  let musicTimer = null;
  let nextBeat = 0;
  let nextBeatTime = 0;
  let lastCue = -10000;
  let audioProblem = false;

  // Na malém mobilním reproduktoru potřebuje kulisa větší rezervu hlasitosti.
  const locations = Object.freeze({
    clearing:    {wind: 0.043, cutoff: 620, tone: 0.010, pitch: 110.00, detail: 'whistle'},
    mill:        {wind: 0.030, cutoff: 480, tone: 0.012, pitch: 98.00,  detail: 'wood'},
    bridge:      {wind: 0.059, cutoff: 850, tone: 0.011, pitch: 92.50,  detail: 'whistle'},
    tower:       {wind: 0.036, cutoff: 720, tone: 0.016, pitch: 123.47, detail: 'ice'},
    crypt:       {wind: 0.009, cutoff: 290, tone: 0.023, pitch: 73.42,  detail: 'drop'},
    observatory: {wind: 0.031, cutoff: 960, tone: 0.018, pitch: 146.83, detail: 'ice'},
    cave:        {wind: 0.036, cutoff: 350, tone: 0.028, pitch: 65.41,  detail: 'ice'}
  });

  // Ručně komponované notové fráze: pozice v taktu, MIDI tón, délka a síla.
  // Jedna fráze má 32 dob, takže jde o delší věty s pauzami, nikoli krátké smyčky.
  // Hlavní motiv D–F–A se vrací v odlišné harmonii a při vítězství se rozjasní.
  const themes = Object.freeze({
    clearing: {bpm: 62, chords: [[50,53,57],[48,52,55],[46,50,53],[45,49,52]],
      notes: [[0,62,2,.67],[3,65,1.6,.65],[6,69,2.4,.70],[10,67,1.5,.52],[13,65,2,.55],[17,64,2,.51],[20,62,3,.65],[25,60,1.4,.48],[28,62,2.7,.57]]},
    mill: {bpm: 58, chords: [[50,53,57],[46,50,53],[48,52,55],[50,53,57]],
      notes: [[0,57,2.6,.36],[7,62,2,.42],[12,60,2,.35],[18,57,2,.37],[25,53,2.5,.37]]},
    bridge: {bpm: 66, chords: [[50,53,56],[49,52,56],[46,50,53],[45,49,52]],
      notes: [[0,62,1.3,.45],[4,65,1.2,.44],[7,68,2,.52],[12,67,1.4,.43],[16,62,2,.46],[21,61,1.5,.46],[26,65,2,.39]]},
    tower: {bpm: 59, chords: [[50,53,57],[53,57,60],[48,52,55],[46,50,53]],
      notes: [[0,69,2.3,.38],[4,72,1.5,.43],[8,74,2,.45],[13,72,1.5,.41],[18,69,2,.43],[23,67,1.6,.35],[28,65,2.5,.39]]},
    crypt: {bpm: 54, chords: [[50,53,57],[46,50,53],[43,46,50],[45,49,52]],
      notes: [[0,62,3.6,.32],[8,60,3,.32],[15,58,2.4,.31],[22,57,3.1,.36],[29,53,2.3,.29]]},
    observatory: {bpm: 60, chords: [[53,57,60],[48,52,55],[50,53,57],[53,57,60]],
      notes: [[0,72,1.8,.48],[3,77,2.5,.43],[8,76,1.6,.39],[12,72,2,.37],[17,74,1.5,.43],[20,79,2,.38],[25,77,1.4,.37],[29,72,2,.39]]},
    cave: {bpm: 67, chords: [[50,53,56],[49,52,56],[46,50,53],[45,48,52]],
      notes: [[0,62,1.1,.39],[4,61,1.4,.37],[8,68,1.2,.47],[13,65,1.3,.37],[16,62,1.8,.42],[21,61,1.2,.38],[26,56,2,.38]]},
    victory: {bpm: 61, chords: [[53,57,60],[48,52,55],[46,50,53],[53,57,60]],
      notes: [[0,65,2.3,.54],[3,69,1.6,.57],[6,72,2.5,.62],[10,70,1.7,.47],[13,69,2.1,.54],[17,67,1.8,.49],[20,65,3,.55],[25,64,1.5,.43],[28,65,3.2,.61]]}
  });

  const now = () => context.currentTime;

  function makeNoise() {
    const length = Math.floor(context.sampleRate * 6);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let low = 0;
    // Jemně zabarvený vítr, nikoli ostré syčení bílého šumu.
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      low = 0.985 * low + 0.015 * white;
      samples[i] = 0.48 * white + 1.25 * low;
    }
    // Potlačit přechodový lup při návratu na začátek smyčky.
    const blend = Math.min(Math.round(context.sampleRate * 0.07), length / 10);
    const startSample = samples[0];
    for (let i = 0; i < blend; i++) {
      const mix = (i + 1) / blend;
      const index = length - blend + i;
      samples[index] = samples[index] * (1 - mix) + startSample * mix;
    }
    return buffer;
  }

  function build() {
    context = new AudioClass();
    const master = context.createGain();
    master.gain.value = appleMobile ? 0.85 : 0.65;
    master.connect(context.destination);
    const ambienceBus = context.createGain();
    ambienceBus.gain.value = 0;
    ambienceBus.connect(master);
    const musicBus = context.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(master);
    const echoSend = context.createGain();
    echoSend.gain.value = 0.16;
    const delay = context.createDelay(1);
    delay.delayTime.value = 0.37;
    const feedback = context.createGain();
    feedback.gain.value = 0.12;
    echoSend.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(musicBus);

    const wind = context.createBufferSource();
    wind.buffer = makeNoise();
    wind.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 0.42;
    const windGain = context.createGain();
    windGain.gain.value = 0;
    wind.connect(filter);
    filter.connect(windGain);
    windGain.connect(ambienceBus);

    // Větrné poryvy se přirozeně mění, ale netvoří rytmický hudební motiv.
    const gust = context.createOscillator();
    gust.type = 'sine';
    gust.frequency.value = 0.075;
    const gustStrength = context.createGain();
    gustStrength.gain.value = 0.008;
    gust.connect(gustStrength);
    gustStrength.connect(windGain.gain);

    const drone = context.createGain();
    drone.gain.value = 0;
    drone.connect(ambienceBus);
    const bass = context.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = 110;
    const fifth = context.createOscillator();
    fifth.type = 'triangle';
    fifth.frequency.value = 164.81;
    const fifthGain = context.createGain();
    fifthGain.gain.value = 0.15;
    bass.connect(drone);
    fifth.connect(fifthGain);
    fifthGain.connect(drone);

    wind.start();
    gust.start();
    bass.start();
    fifth.start();
    nodes = {master, ambienceBus, musicBus, echoSend, filter, windGain, drone, bass, fifth};
    if (typeof context.addEventListener === 'function') {
      context.addEventListener('statechange', () => {
        if (context.state === 'running' && musicActive) resetMusicClock();
        paintButton();
      });
    }
    setScene(room, won);
  }

  function setScene(nextRoom, victory = false) {
    const changed = room !== nextRoom || won !== Boolean(victory);
    room = Object.hasOwn(locations, nextRoom) ? nextRoom : 'clearing';
    won = Boolean(victory);
    if (!nodes || !context) return;
    const setting = locations[room];
    const at = now();
    const warmth = won ? 0.61 : 1;
    nodes.windGain.gain.setTargetAtTime(setting.wind * warmth * mobileBoost, at, 1.4);
    nodes.filter.frequency.setTargetAtTime(setting.cutoff * (won ? 0.78 : 1), at, 1.8);
    nodes.drone.gain.setTargetAtTime(setting.tone * (won ? 0.46 : 1) * mobileBoost, at, 2.0);
    nodes.bass.frequency.setTargetAtTime(setting.pitch, at, 2.0);
    nodes.fifth.frequency.setTargetAtTime(setting.pitch * (won ? 1.5 : 1.4983), at, 2.0);
    if (changed && musicActive) resetMusicClock();
  }

  // Krátký tón s měkkým náběhem a dozvukem — nic hlasitého ani perkusivního.
  function note(frequency, length, volume, shape = 'sine', slide = 1) {
    if (!active || !context || context.state !== 'running') return;
    const start = now();
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = shape;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(45, frequency * slide), start + length);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume * mobileBoost, start + Math.min(length * 0.24, 0.11));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
    oscillator.connect(envelope);
    envelope.connect(nodes.ambienceBus);
    oscillator.start(start);
    oscillator.stop(start + length + 0.03);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  function detail() {
    if (!active || !context || context.state !== 'running') return;
    const type = won ? 'drop' : locations[room].detail;
    if (type === 'drop') note(870 + Math.random() * 120, 0.22, 0.022, 'sine', 0.62);
    else if (type === 'ice') note(465 + Math.random() * 160, 1.55, 0.009, 'sine', 0.89);
    else if (type === 'wood') note(143 + Math.random() * 38, 0.68, 0.009, 'triangle', 0.75);
    else note(324 + Math.random() * 95, 1.8, 0.006, 'sine', 0.90);
  }

  function scheduleDetail() {
    clearTimeout(detailTimer);
    if (!active) return;
    detailTimer = setTimeout(() => {
      detail();
      scheduleDetail();
    }, 11000 + Math.random() * 9000);
  }

  function cue(name) {
    if ((!active && !musicActive) || !context || context.state !== 'running') return;
    const at = now();
    if (at - lastCue < 0.75) return;
    lastCue = at;
    if (name === 'raven' && musicActive) {
      musicTone(74, at + 0.02, 0.40, 0.37);
      musicTone(72, at + 0.48, 0.53, 0.31);
      musicTone(69, at + 1.06, 0.82, 0.28);
    }
    if (!active) return;
    if (name === 'raven') note(392.00, 0.38, 0.008, 'sine', 1.04);
    else if (name === 'step') note(293.66, 0.32, 0.011, 'sine', 0.88);
    else if (name === 'key') note(523.25, 0.62, 0.018, 'sine', 1.03);
    else if (name === 'light') note(659.25, 1.25, 0.024, 'sine', 1.01);
    else if (name === 'victory') {
      note(220.00, 2.8, 0.020, 'sine', 1.02);
      // Zpožděná druhá nota nechá závěr zvolna doznít, bez fanfár.
      setTimeout(() => {if (active && won) note(329.63, 3.0, 0.014, 'sine', 1.02);}, 650);
    }
  }

  const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);

  function musicTone(midi, at, seconds, strength, pad = false) {
    if (!musicActive || !context || context.state !== 'running') return;
    seconds = Math.max(0.28, seconds);
    const attack = pad ? 0.63 : 0.085;
    const release = pad ? 1.05 : 0.66;
    const volume = (pad ? 0.011 : 0.028) * strength * mobileBoost;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.00001, at);
    envelope.gain.linearRampToValueAtTime(volume, at + Math.min(attack, seconds * 0.34));
    const releaseStart = at + Math.max(attack + 0.04, seconds - release);
    envelope.gain.setValueAtTime(volume * (pad ? 0.73 : 0.58), releaseStart);
    envelope.gain.exponentialRampToValueAtTime(0.00001, at + seconds);
    envelope.connect(nodes.musicBus);
    envelope.connect(nodes.echoSend);

    const voice = context.createOscillator();
    voice.type = pad ? 'sine' : 'triangle';
    voice.frequency.value = hz(midi);
    voice.connect(envelope);
    voice.start(at);
    voice.stop(at + seconds + 0.03);

    let overtone = null;
    let overtoneGain = null;
    if (!pad) {
      overtone = context.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.value = hz(midi + 12);
      overtoneGain = context.createGain();
      overtoneGain.gain.value = 0.14;
      overtone.connect(overtoneGain);
      overtoneGain.connect(envelope);
      overtone.start(at);
      overtone.stop(at + seconds + 0.03);
    }
    voice.onended = () => {
      voice.disconnect();
      if (overtone) overtone.disconnect();
      if (overtoneGain) overtoneGain.disconnect();
      envelope.disconnect();
    };
  }

  function resetMusicClock() {
    if (!context || !nodes) return;
    nextBeat = 0;
    nextBeatTime = now() + 0.65;
    if (musicActive) {
      nodes.musicBus.gain.setTargetAtTime(0.08, now(), 0.18);
      nodes.musicBus.gain.setTargetAtTime(0.85, now() + 0.40, 0.90);
    }
  }

  function musicTick() {
    if (!musicActive || !context || context.state !== 'running') return;
    const theme = themes[won ? 'victory' : room];
    const beatLength = 60 / theme.bpm;
    let scheduled = 0;
    while (nextBeatTime < now() + 0.48 && scheduled < 6) {
      const beat = nextBeat % 32;
      if (beat % 8 === 0) {
        const harmony = theme.chords[beat / 8];
        for (const pitch of harmony) {
          musicTone(pitch, nextBeatTime, beatLength * 7.65, 0.50, true);
        }
      }
      for (const [position, pitch, duration, velocity] of theme.notes) {
        if (position !== beat) continue;
        // Druhý návrat motivu se jemně mění, aby nepůsobil jako 8s smyčka.
        const cycle = Math.floor(nextBeat / 32);
        const lastNoteVariation = cycle % 2 && beat === 28 ? 2 : 0;
        musicTone(pitch + lastNoteVariation, nextBeatTime, beatLength * duration, velocity);
      }
      nextBeat++;
      nextBeatTime += beatLength;
      scheduled++;
    }
    if (nextBeatTime < now() - 2) resetMusicClock();
  }

  function running() {
    return Boolean(context && context.state === 'running');
  }

  // Safari 17+ na iPhonu podporuje režim playback pro zvuk i v tichém režimu.
  function requestPlaybackSession() {
    if (!appleMobile) return;
    try {
      if (navigator.audioSession && navigator.audioSession.type !== 'playback') {
        navigator.audioSession.type = 'playback';
      }
    } catch (_) { /* Starší WebKit nemusí audioSession podporovat. */ }
  }

  // Zkušební dvojtón je slyšitelný nezávisle na hudbě a zvucích lokace.
  // Zdroje se startují PŘÍMO při klepnutí, před jakýmkoliv await/resume().
  function confirmationTone() {
    if (!context || !nodes) return;
    const at = now() + 0.025;
    for (const [pitch, offset] of [[523.25, 0], [659.25, 0.20]]) {
      const voice = context.createOscillator();
      const envelope = context.createGain();
      const start = at + offset;
      voice.type = 'sine';
      voice.frequency.value = pitch;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.linearRampToValueAtTime(appleMobile ? 0.16 : 0.095, start + 0.035);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.36);
      voice.connect(envelope);
      envelope.connect(nodes.master);
      voice.start(start);
      voice.stop(start + 0.38);
      voice.onended = () => {voice.disconnect(); envelope.disconnect();};
    }
  }

  function paintButton() {
    const needsResume = audioProblem || (context && !running());
    button.textContent = active ? (needsResume ? 'ZVUK: OBNOVIT' : 'ZVUK: ZAPNUT') : 'ZVUK: VYPNUT';
    button.setAttribute('aria-pressed', String(active));
    button.title = needsResume ? 'Klepnutím znovu povolit zvuk v prohlížeči' :
      (active ? 'Vypnout atmosférický podkres' : 'Zapnout atmosférický podkres');
    musicButton.textContent = musicActive ? (needsResume ? 'HUDBA: OBNOVIT' : 'HUDBA: ZAPNUTA') : 'HUDBA: VYPNUTA';
    musicButton.setAttribute('aria-pressed', String(musicActive));
    musicButton.title = needsResume ? 'Klepnutím znovu povolit hudbu v prohlížeči' :
      (musicActive ? 'Vypnout původní melodie' : 'Zapnout původní hudbu v duchu VGA adventur');
  }

  function resumeContext() {
    if (!context) return;
    let requested;
    try {
      requested = context.resume();
    } catch (_) {
      audioProblem = true;
      paintButton();
      return;
    }
    Promise.resolve(requested).then(() => {
      audioProblem = !running();
      if (running() && musicActive) resetMusicClock();
      paintButton();
    }).catch(() => {
      audioProblem = true;
      paintButton();
    });
  }

  function enableSound() {
    active = true;
    nodes.ambienceBus.gain.setTargetAtTime(1, now(), 0.35);
    scheduleDetail();
  }

  function disableSound() {
    active = false;
    nodes.ambienceBus.gain.setTargetAtTime(0, now(), 0.12);
    clearTimeout(detailTimer);
  }

  function enableMusic() {
    musicActive = true;
    resetMusicClock();
    clearInterval(musicTimer);
    musicTimer = setInterval(musicTick, 120);
    musicTick();
  }

  function disableMusic() {
    musicActive = false;
    nodes.musicBus.gain.setTargetAtTime(0, now(), 0.16);
    clearInterval(musicTimer);
    musicTimer = null;
  }

  function toggle(kind) {
    if (!AudioClass) return;
    try {
      requestPlaybackSession();
      if (!context) build();
      const recovering = !running() || audioProblem;
      const enabled = kind === 'sound' ? active : musicActive;
      if (enabled && !recovering) {
        if (kind === 'sound') disableSound();
        else disableMusic();
      } else {
        if (kind === 'sound' && !active) enableSound();
        if (kind === 'music' && !musicActive) enableMusic();
        audioProblem = false;
        confirmationTone();
        resumeContext();
      }
      setScene(room, won);
      paintButton();
    } catch (_) {
      audioProblem = true;
      paintButton();
    }
  }

  function testSound() {
    if (!AudioClass) return;
    try {
      requestPlaybackSession();
      if (!context) build();
      confirmationTone();
      resumeContext();
      paintButton();
    } catch (_) {
      audioProblem = true;
      paintButton();
    }
  }

  if (!AudioClass) {
    button.textContent = 'ZVUK NEDOSTUPNÝ';
    button.disabled = true;
    musicButton.textContent = 'HUDBA NEDOSTUPNÁ';
    musicButton.disabled = true;
  } else {
    button.addEventListener('click', () => toggle('sound'));
    musicButton.addEventListener('click', () => toggle('music'));
    if (testButton) testButton.addEventListener('click', testSound);
    paintButton();
  }

  document.addEventListener('visibilitychange', () => {
    if (!context || (!active && !musicActive)) return;
    if (!document.hidden) {
      requestPlaybackSession();
      resumeContext();
    }
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted && context && (active || musicActive)) {
      requestPlaybackSession();
      resumeContext();
    }
  });

  window.lastLightAudio = {
    setScene, cue,
    diagnostic: () => ({state: context ? context.state : 'nevytvořen', sound: active,
      music: musicActive, audioSession: navigator.audioSession?.type || 'nepodporováno'})
  };
})();
