import Oscilloscope from './Oscilloscope.js';

const audioContext = new AudioContext();
const analyserNode = audioContext.createAnalyser();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
gainNode.connect(analyserNode);

gainNode.gain.value = 0.5;

const oscilloscope = new Oscilloscope(analyserNode);
oscilloscope.start();

const rainWorker = new Worker('rainWorker.js', {type: 'module'});
const rainWorkerFar = new Worker('rainWorkerFar.js', {type: 'module'});
const messengerWorker = new Worker('messengerWorker.js');

const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

playButton.onclick = () => {
  audioContext.resume();
  messengerWorker.postMessage('make rain');
  playButton.style.display = 'none';
  stopButton.style.display = 'block';
}

stopButton.onclick = () => {
  window.location.reload();
}

function createRainDrop(channelData) {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(2, sampleRate, audioContext.sampleRate);
  buffer.copyToChannel(channelData[0], 0);
  buffer.copyToChannel(channelData[1], 1);
  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  return noise;
}

rainWorker.onmessage = (event) => {
  let noise = createRainDrop(event.data)
  noise.connect(gainNode);
  noise.start();
}

rainWorkerFar.onmessage = (event) => {
  let noise = createRainDrop(event.data)
  noise.connect(gainNode)
  noise.start()
}
