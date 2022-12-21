import { makeWind } from './rain.js';

(() => {
  'use strict'

  const broadcast = new BroadcastChannel('channel-1');

  broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'windWorker') {
      const noise = makeWind();
      postMessage(noise);
    }
  }
})();
