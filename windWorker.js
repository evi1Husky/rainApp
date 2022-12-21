import { makeWind } from './rain.js';

onmessage = (event) => {
  if (event.data === 'make noise') {
    const noise = makeWind();
    postMessage(noise);
    setInterval(() => {
      const noise = makeWind();
      postMessage(noise);
    }, 960 * 10);
  }
}
