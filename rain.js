'use strict'

function rnd(max, min) {
  return Math.random() * (max - min) + min
}

const sampleRate = 48000;

export function generateRainDrop() {
  const ch0 = new Float32Array(sampleRate);
  const ch1 = new Float32Array(sampleRate);
  let n0 = rnd(70, 6);
  let n1 = rnd(70, 6);
  const init0 = n0;
  const init1 = n1;
  for (let index = 0; index < sampleRate; index++) {
    n0 += rnd(0.05, 0);
    n1 += rnd(0.05, 0);
    if (init0 < 7) {
      n0 += 0.3;
    }
    if (init1 < 7) {
      n1 += 0.3;
    }
    ch0[index] = Math.random() * (rnd(3, 1) / n0) - (1 / n0)
    ch1[index] = Math.random() * (rnd(3, 1) / n1) - (1 / n1)
    ch0[index] *= rnd(35, 0);
    ch1[index] *= rnd(35, 0);
  }
  return [ch0, ch1];
}

export function generateRainDropFar() {
  const ch0 = new Float32Array(sampleRate);
  const ch1 = new Float32Array(sampleRate);
  let n0 = rnd(120, 70);
  let n1 = rnd(120, 70);
  for (let index = 0; index < sampleRate; index++) {
    n0 += rnd(0.05, 0);
    n1 += rnd(0.05, 0);
    ch0[index] = Math.random() * (rnd(3, 1) / n0) - (1 / n0)
    ch1[index] = Math.random() * (rnd(3, 1) / n1) - (1 / n1)
    ch0[index] *= rnd(40, 0);
    ch1[index] *= rnd(40, 0);
  }
  return [ch0, ch1];
}

export function noiseFilter(in0, in1) {
  function noise(input) {
    const output = new Float32Array(sampleRate);
    let lastOut = 0.0;
    for (let index = 0; index < sampleRate; index++) {
      const whiteNoise = Math.random() * 2 - 1;
      output[index] =
       ((lastOut + (rnd(0.09, 0.01) * whiteNoise)) / rnd(1.09, 1.001)) + input[index];
      lastOut = output[index];
      output[index] *= 0.21;
    }
    return output
  }
  return [noise(in0), noise(in1)]
}

export function lowPass(in0, in1, val) {
  function lowPass(input) {
    const output = new Float32Array(sampleRate);
    var lastOut = 0.0;
    for (var i = 0; i < sampleRate; i++) {
        output[i] = (input[i] + lastOut) / val;
        lastOut = output[i];
    }
    return output;
  }
  return [lowPass(in0), lowPass(in1)]
}

export function makeWind() {
  const sampleRate = 48000 * 10
  function wind() {
    const output = new Float32Array(sampleRate);
    let lastOut = 0.0;
    let lastGain = sampleRate;
    let gainRnd = ~~(rnd(6, 2));
    let gainBottom = false;
    let gainTop = true;
    for (let index = 0; index < sampleRate; index++) {
      const whiteNoise = Math.random() * 2 - 1;
      output[index] = ((lastOut + (rnd(10, 0) * whiteNoise)) / rnd(1.02, 0.99));
      lastOut = output[index];
      output[index] /= lastGain / 1400;
      if (gainTop) {
        lastGain -= 1;
        if (lastGain === (sampleRate) / gainRnd) {
          gainBottom = true;
          gainTop = false;
        }
      }
      if (gainBottom) {
        lastGain += 1;
        if (lastGain === (sampleRate)) {
          gainBottom = false;
          gainTop = true;
        }
      }
    }
    return output
  }
  return [wind(), wind()]
}
