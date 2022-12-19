function rnd(max, min) {
  return Math.random() * (max - min) + min
}

const sampleRate = 48000;

export function generateRainDrop() {
  const ch0 = new Float32Array(sampleRate);
  const ch1 = new Float32Array(sampleRate);
  let n0 = rnd(70, 5);
  let n1 = rnd(70, 5);
  for (let index = 0; index < sampleRate; index++) {
    n0 += rnd(rnd(0.05, 0.01), 0);
    n1 += rnd(rnd(0.05, 0.01), 0);
    ch0[index] = Math.random() * (rnd(3, 1) / n0) - (1 / n0)
    ch1[index] = Math.random() * (rnd(3, 1) / n1) - (1 / n1)
    ch0[index] *= rnd(30, 0);
    ch1[index] *= rnd(30, 0);
  }
  return [ch0, ch1];
}

export function generateRainDropFar() {
  const ch0 = new Float32Array(sampleRate);
  const ch1 = new Float32Array(sampleRate);
  let n0 = rnd(120, 70);
  let n1 = rnd(120, 70);
  for (let index = 0; index < sampleRate; index++) {
    n0 += rnd(rnd(0.05, 0.01), 0);
    n1 += rnd(rnd(0.05, 0.01), 0);
    ch0[index] = Math.random() * (rnd(3, 1) / n0) - (1 / n0)
    ch1[index] = Math.random() * (rnd(3, 1) / n1) - (1 / n1)
    ch0[index] *= rnd(30, 0);
    ch1[index] *= rnd(30, 0);
  }
  return [ch0, ch1];
}

export function brownNoiseFilter(in0, in1) {
  function brownNoise(input) {
    const output = new Float32Array(sampleRate);
    let lastOut = 0.0;
    for (let index = 0; index < sampleRate; index++) {
      const whiteNoise = Math.random() * 2 - 1;
      output[index] = ((lastOut + (0.02 * whiteNoise)) / 1.02) + input[index];
      lastOut = output[index];
      output[index] *= 0.23;
    }
    return output
  }
  return [brownNoise(in0), brownNoise(in1)]
}

export function pinkNoiseFilter(in0, in1) {
  function pinkNoise(input) {
    const output = new Float32Array(sampleRate);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let index = 0; index < sampleRate; index++) {
      b0 = 0.99886 * b0 + input[index] * 0.0555179;
      b1 = 0.99332 * b1 + input[index] * 0.0750759;
      b2 = 0.96900 * b2 + input[index] * 0.1538520;
      b3 = 0.86650 * b3 + input[index] * 0.3104856;
      b4 = 0.55000 * b4 + input[index] * 0.5329522;
      b5 = -0.7616 * b5 - input[index] * 0.0168980;
      output[index] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + input[index] * 0.5362;
      output[index] *= 0.15;
      b6 = input[index] * 0.115926;
    }
    return output
  }
  return [pinkNoise(in0), pinkNoise(in1)]
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

export function lowPass(in0, in1) {
  function lowPass(input) {
    const output = new Float32Array(sampleRate);
    var lastOut = 0.0;
    for (var i = 0; i < sampleRate; i++) {
        output[i] = (input[i] + lastOut) / 2.0;
        lastOut = output[i];
    }
    return output;
  }
  return [lowPass(in0), lowPass(in1)]
}