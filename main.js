import Oscilloscope from './Oscilloscope.js';

(() => {
  'use strict'

  const audioContext = new AudioContext();
  const analyserNode = audioContext.createAnalyser();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  gainNode.connect(analyserNode);

  analyserNode.fftSize = 1024;
  gainNode.gain.value = 0.5;

  const oscilloscope = new Oscilloscope(analyserNode);
  oscilloscope.idle()

  const gainKnob = document.getElementById('gain-knob');
  gainKnob.value = 50
  gainKnob.lightColor = '#bccae1'

  const gainControl = () => {
    const val = gainKnob.currentValue / 100
    gainNode.gain.value = val
  }

  gainKnob.knobEventHandler = gainControl;

  const lamp = document.querySelector('.lamp');
  lamp.analyser = analyserNode;

  const rainWorker = new Worker('rainWorker.js', {type: 'module'});
  const rainWorkerFar = new Worker('rainWorkerFar.js', {type: 'module'});
  const messengerWorker = new Worker('messengerWorker.js', {type: 'module'});
  const windWorker = new Worker('windWorker.js', {type: 'module'});

  const playButton = document.getElementById('play-button');
  const stopButton = document.getElementById('stop-button');

  playButton.onclick = () => {
    audioContext.resume();
    oscilloscope.start();
    lamp.start();
    messengerWorker.postMessage('make rain');
    playButton.style.display = 'none';
    stopButton.style.display = 'block';
  }

  stopButton.onclick = () => {
    window.location.reload();
  }

  function createSound(channelData, sampleRate) {
    const buffer = audioContext.createBuffer(2, sampleRate, audioContext.sampleRate);
    buffer.copyToChannel(channelData[0], 0);
    buffer.copyToChannel(channelData[1], 1);
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    return noise;
  }

  rainWorker.onmessage = (event) => {
    const rainDrop = createSound(event.data, audioContext.sampleRate)
    rainDrop.connect(gainNode);
    rainDrop.start();
  }

  rainWorkerFar.onmessage = (event) => {
    const rainDrop = createSound(event.data, audioContext.sampleRate)
    rainDrop.connect(gainNode)
    rainDrop.start()
  }

  windWorker.onmessage = (event) => {
    const wind = createSound(event.data, audioContext.sampleRate * 10);
    wind.connect(gainNode);
    wind.start();
  }
})();