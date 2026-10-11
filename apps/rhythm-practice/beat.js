// 박자 분석: 모노 PCM -> 온셋 강도 -> BPM/박 위치(phase). 브라우저/Node 공용.
(function (root) {
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2;
          const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }

  // 스펙트럴 플럭스 온셋 곡선. 반환 {env, fps}
  function onsetEnvelope(x, sr) {
    const N = 1024, H = Math.round(sr / 100); // 약 100fps
    const win = new Float32Array(N);
    for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
    const re = new Float32Array(N), im = new Float32Array(N);
    const kLo = Math.floor(60 * N / sr), kHi = Math.min(N / 2, Math.ceil(8000 * N / sr));
    let prev = new Float32Array(kHi - kLo);
    const frames = Math.max(0, Math.floor((x.length - N) / H));
    const env = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      const o = f * H;
      for (let i = 0; i < N; i++) { re[i] = x[o + i] * win[i]; im[i] = 0; }
      fft(re, im);
      let flux = 0;
      for (let k = kLo; k < kHi; k++) {
        const m = Math.log1p(100 * Math.hypot(re[k], im[k]) / 50);
        const d = m - prev[k - kLo];
        if (d > 0) flux += d;
        prev[k - kLo] = m;
      }
      env[f] = flux;
    }
    // 지역 평균 제거 + 정규화
    const w = 50, out = new Float32Array(frames);
    let s = 0;
    for (let i = 0; i < frames; i++) {
      s += env[i]; if (i >= 2 * w + 1) s -= env[i - 2 * w - 1];
      const c = i - w;
      if (c >= 0) { const cnt = Math.min(c + w + 1, 2 * w + 1); out[c] = Math.max(0, env[c] - s / cnt); }
    }
    let mx = 0; for (let i = 0; i < frames; i++) mx = Math.max(mx, out[i]);
    if (mx > 0) for (let i = 0; i < frames; i++) out[i] /= mx;
    return { env: out, fps: sr / H };
  }

  // 빗살(comb) 점수: 주기 p(초), 위상 ph(초)에서 온셋 합
  function comb(env, fps, p, ph) {
    let s = 0;
    for (let t = ph; t * fps < env.length - 1; t += p) {
      const i = t * fps, a = Math.floor(i), fr = i - a;
      s += env[a] * (1 - fr) + env[a + 1] * fr;
    }
    return s;
  }

  function analyze(x, sr) {
    const { env, fps } = onsetEnvelope(x, sr);
    // 1) 자기상관으로 대략적 BPM (70~160 우선)
    let best = { s: -1, bpm: 100 };
    const ac = [];
    for (let bpm = 60; bpm <= 180; bpm += 0.5) {
      const lag = fps * 60 / bpm; let s = 0, n = 0;
      for (let i = 0; i + lag + 1 < env.length; i++) {
        const j = i + lag, a = Math.floor(j), fr = j - a;
        s += env[i] * (env[a] * (1 - fr) + env[a + 1] * fr); n++;
      }
      s /= n;
      const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 100) / 0.6, 2));
      ac.push([bpm, s * prior]);
      if (s * prior > best.s) best = { s: s * prior, bpm };
    }
    // 2) 미세 조정: BPM ±3 을 0.02 단위, 위상 전체 탐색 (전곡 comb 합 최대)
    let fine = { s: -1, bpm: best.bpm, ph: 0 };
    for (let bpm = best.bpm - 3; bpm <= best.bpm + 3; bpm += 0.02) {
      const p = 60 / bpm;
      for (let ph = 0; ph < p; ph += 0.005) {
        const s = comb(env, fps, p, ph);
        if (s > fine.s) fine = { s, bpm, ph };
      }
    }
    return { bpm: fine.bpm, phase: fine.ph, env, fps };
  }

  const api = { analyze, onsetEnvelope, comb };
  if (typeof module !== 'undefined') module.exports = api; else root.BeatAnalyzer = api;
})(typeof self !== 'undefined' ? self : this);
