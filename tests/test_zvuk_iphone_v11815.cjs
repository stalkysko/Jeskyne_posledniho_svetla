const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class Param {
  value = 0;
  setTargetAtTime(v) {this.value = v;}
  setValueAtTime(v) {this.value = v;}
  exponentialRampToValueAtTime(v) {this.value = v;}
  linearRampToValueAtTime(v) {this.value = v;}
}
let started = 0;
class Node {
  constructor() {this.gain = new Param(); this.frequency = new Param(); this.delayTime = new Param(); this.Q = new Param();}
  connect() {return this;}
  disconnect() {}
  start() {started++;}
  stop() {}
}
let audio;
class AudioContext {
  constructor() {audio = this; this.state = 'suspended'; this.currentTime = 3; this.sampleRate = 100; this.destination = new Node(); this.listeners = [];}
  createGain() {return new Node();}
  createOscillator() {return new Node();}
  createBufferSource() {return new Node();}
  createBiquadFilter() {return new Node();}
  createDelay() {return new Node();}
  createBuffer(_, n) {return {getChannelData: () => new Float32Array(n)};}
  addEventListener(_, callback) {this.listeners.push(callback);}
  changeState(state) {this.state = state; this.listeners.forEach(callback => callback());}
  resume() {this.changeState('running'); return Promise.resolve();}
}
function button() {
  return {textContent: '', onClick: null, setAttribute() {}, addEventListener(event, handler) {if (event === 'click') this.onClick = handler;}, click() {assert.ok(this.onClick); this.onClick();}};
}
const buttons = {sound: button(), music: button(), 'audio-test': button()};
const handlers = {};
const session = {type: 'auto'};
const world = {
  window: {AudioContext, addEventListener() {}},
  navigator: {userAgent: 'iPhone', audioSession: session},
  document: {hidden: false, getElementById: id => buttons[id], addEventListener: (event, listener) => {handlers[event] = listener;}},
  setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  Math, Object, Promise
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'zvuk.js'), 'utf8'), world);

async function test() {
  buttons['audio-test'].click();
  assert.equal(started, 6, 'čtyři ambientní zdroje a dva testovací tóny');
  assert.equal(session.type, 'playback');
  buttons.sound.click();
  buttons.music.click();
  await Promise.resolve();
  assert.equal(buttons.sound.textContent, 'ZVUK: ZAPNUT');
  assert.equal(buttons.music.textContent, 'HUDBA: ZAPNUTA');
  audio.changeState('interrupted');
  assert.equal(buttons.music.textContent, 'HUDBA: OBNOVIT');
  buttons.music.click();
  await Promise.resolve();
  assert.equal(buttons.music.textContent, 'HUDBA: ZAPNUTA', 'obnovovací klepnutí nesmí hudbu vypnout');
  buttons.music.click();
  assert.equal(buttons.music.textContent, 'HUDBA: VYPNUTA');
  buttons.sound.click();
  assert.equal(buttons.sound.textContent, 'ZVUK: VYPNUT');
  console.log('OK: test zvuku, iOS playback, obnova a vypínání');
}
test().catch(e => {console.error(e); process.exitCode = 1;});
