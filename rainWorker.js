import { generateRainDrop } from './rain.js';
import { lowPass } from './rain.js';
import { noiseFilter } from './rain.js';

(() => {
  'use strict'

  const broadcast = new BroadcastChannel('channel-1');

  broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'rainWorker') {
      const rainDrop = lowPass(...noiseFilter(...generateRainDrop()));
      postMessage(rainDrop);
    }
  }
})();
