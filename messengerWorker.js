const broadcast = new BroadcastChannel('channel-1');

function rnd(max, min) {
  return Math.floor(Math.random() * (max - min) + min)
}

onmessage = () => {
  setInterval(() => {
    if (rnd(6, 0) === 0) {
      broadcast.postMessage({ type: 'rainWorker', });
    }
  }, 20);

  setInterval(() => {
    if (rnd(6, 0) === 0) {
      broadcast.postMessage({ type: 'rainWorkerFar', });
    }
  }, 20);
}
