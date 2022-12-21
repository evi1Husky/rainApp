(() => {
  'use strict'
  
  const broadcast = new BroadcastChannel('channel-1');

  function rnd(max, min) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  let num = null;

  setInterval(() => {
    num = rnd(10, 4)
  }, 1000);

  onmessage = () => {
    setInterval(() => {
      if (rnd(num, 0) === 0) {
        broadcast.postMessage({ type: 'rainWorker', });
      }
    }, 20);

    setInterval(() => {
      if (rnd(num, 0) === 0) {
        broadcast.postMessage({ type: 'rainWorkerFar', });
      }
    }, 20);

    setInterval(() => {
      broadcast.postMessage({ type: 'windWorker', });
    }, 999 * 10);

    broadcast.postMessage({ type: 'windWorker', });
  }
})();
