import { generateRainDropFar } from './rain.js';
import { lowPass } from './rain.js';
import { noiseFilter } from './rain.js';

const broadcast = new BroadcastChannel('channel-1');

broadcast.onmessage = (event) => {
  if (event.data && event.data.type === 'rainWorkerFar') {
    const rainDrop = lowPass(...noiseFilter(...generateRainDropFar()));
    postMessage(rainDrop);
  }
}