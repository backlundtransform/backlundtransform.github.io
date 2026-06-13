---
sidebar_label: "📡 Transforms"
---

## 🌊 FFT / DFT

$$X_k = \sum_{n=0}^{N-1} x_n \, e^{-i 2\pi k n / N}$$

```csharp
Func<double, double> f = t => Math.Exp(-t * t / 0.02);
var freq = f.FastFourierTransform(-0.5, 0.5, 100)
             .ToFrequencyResolution(100);

// DFT from real or complex samples
var dft = samples.DiscreteFourierTransform();
```

**Inverse FFT / DFT**

```csharp
var timeDomain = freqDomain.InverseFastFourierTransform();
var timeDomain2 = freqDomain.InverseDiscreteFourierTransform();
```

---

## 🎵 Fourier Series

Real Fourier series analysis and synthesis for periodic functions:

$$f(t) \approx \frac{a_0}{2} + \sum_{n=1}^{N} \left[ a_n \cos(n\omega t) + b_n \sin(n\omega t) \right]$$

```csharp
using CSharpNumerics.Numerics.SignalProcessing;

var fs = new FourierSeries();

// Analyse a square wave
double period = 2 * Math.PI;
Func<double, double> square = t => (t % period) < period / 2 ? 1.0 : -1.0;
fs.Analyze(square, period, nTerms: 20, nSamples: 4096);

// Coefficients
double a0 = fs.A0;        // ≈ 0 (zero mean)
double b1 = fs.Bn[0];     // ≈ 4/π (first sine coefficient)
double b3 = fs.Bn[2];     // ≈ 4/(3π)

// Reconstruct signal
double val = fs.Synthesize(t: 0.5);

// Sweep across time — vary term count for Gibbs phenomenon demo
double[] tVals = Enumerable.Range(0, 500).Select(i => i * period / 500).ToArray();
List<Serie> synth5  = fs.SynthesizeRange(tVals, maxTerms: 5);
List<Serie> synth20 = fs.SynthesizeRange(tVals, maxTerms: 20);

// Power spectrum: |cₙ|² per harmonic
List<Serie> power = fs.PowerSpectrum();

// Parseval's theorem: frequency-domain energy = time-domain energy
double eParseval = fs.ParsevalEnergy();
double eTime     = fs.TimeDomainEnergy(square, nSamples: 4096);
// eParseval ≈ eTime
```

---

## 🔄 Laplace Transform

$$F(s) = \int_0^\infty f(t)\,e^{-st}\,dt$$

```csharp
double result = f.LaplaceTransform(2.0);
double inverse = F.InverseLaplaceTransform(1.0);
```

---

## 🔉 Low-Pass Filter

```csharp
var filtered = input.LowPassFilter(output, alpha: 0.25);
```

---

## 🧹 Filtering

Digital filters for smoothing, de-noising, and frequency separation, in `CSharpNumerics.Numerics.SignalProcessing`. Every filter exposes `Apply(double[] signal)` and returns an output of the same length. Design helpers in `FilterDesign` build IIR/FIR filters from cutoff frequencies; `ZeroPhaseFiltFilt` runs any filter forward + backward for distortion-free offline analysis.

### 〰️ Savitzky–Golay

Local polynomial least-squares smoothing that preserves peak shape and higher moments far better than a moving average. Order 0 reduces to a moving average; order ≥ 1 preserves polynomial trends of that degree exactly.

```csharp
using CSharpNumerics.Numerics.SignalProcessing;

var sg = new SavitzkyGolayFilter(windowSize: 7, polynomialOrder: 2);  // window must be odd
double[] smoothed = sg.Apply(noisySignal);

// Smoothed first derivative (e.g. dQ/dt), with sample spacing dt
double[] dydt = sg.ApplyDerivative(noisySignal, spacing: 0.1);

double[] coeffs = sg.Coefficients;   // convolution kernel
```

### 🎚️ Butterworth (IIR)

Maximally flat passband, implemented as a cascade of second-order sections (biquads, Direct Form II Transposed). Design via `FilterDesign`; cutoffs are in Hz relative to `sampleRate`.

```csharp
double sampleRate = 100.0;  // Hz

// Lowpass / highpass (order = number of poles)
ButterworthFilter lp = FilterDesign.DesignLowpass(order: 4, cutoffFrequency: 5.0, sampleRate);
ButterworthFilter hp = FilterDesign.DesignHighpass(order: 4, cutoffFrequency: 0.5, sampleRate);

// Bandpass (resulting order is 2× the per-edge order)
ButterworthFilter bp = FilterDesign.DesignBandpass(order: 2, lowCutoff: 0.5, highCutoff: 5.0, sampleRate);

double[] low  = lp.Apply(signal);   // causal, forward-only (introduces phase delay)
double[] high = hp.Apply(signal);

// Inspect the response: magnitude at normalized frequencies (1.0 = Nyquist)
double[] mag = lp.FrequencyResponse(new[] { 0.05, 0.1, 0.2, 0.5 });
int order    = lp.Order;
```

### 🎛️ FIR

Finite impulse response via linear convolution; inherently stable with exact linear phase. Supply arbitrary taps directly, or design a windowed-sinc (Hamming) lowpass/highpass.

```csharp
// Arbitrary coefficients
var fir = new FIRFilter(new[] { 0.25, 0.5, 0.25 });
double[] y = fir.Apply(signal);                 // zero-padded at boundaries
double[] yMirror = fir.ApplySymmetric(signal);  // mirror extension (fewer edge artifacts)

// Windowed-sinc design (numTaps forced odd for a Type-I symmetric filter)
FIRFilter firLp = FilterDesign.DesignFIRLowpass(numTaps: 51, cutoffFrequency: 5.0, sampleRate);
FIRFilter firHp = FilterDesign.DesignFIRHighpass(numTaps: 51, cutoffFrequency: 0.5, sampleRate);
```

### ↔️ Zero-phase (filtfilt)

Eliminates phase distortion by filtering forward then backward, so peak positions are preserved (effective order is doubled). Offline use only. Works with both Butterworth and FIR filters.

```csharp
// Peak positions stay put — no group delay
double[] zeroPhase = ZeroPhaseFiltFilt.Apply(lp, signal);       // ButterworthFilter overload
double[] zeroPhaseFir = ZeroPhaseFiltFilt.Apply(firLp, signal); // FIRFilter overload
```

> **Highpass + lowpass reconstruction:** splitting a signal with a complementary `DesignLowpass` / `DesignHighpass` pair and summing the zero-phase outputs reconstructs the original within tolerance — the basis for separating slow from fast flow components.

---

## 🌊 Wavelets

The `CSharpNumerics.Numerics.SignalProcessing.Wavelets` namespace provides orthonormal wavelet transforms for multi-resolution time–frequency decomposition: a signal is split across scales into a coarse **approximation** and per-level **detail** bands. Because the periodic filter bank is orthonormal, reconstruction is exact (machine precision).

**Wavelet families** — `WaveletFamily.Haar`, `Daubechies4`, `Daubechies8`, `Symlet4`. Each exposes its decomposition low-pass (scaling) and high-pass (wavelet) filters.

### 🪜 Discrete Wavelet Transform (DWT)

Critically sampled, halving the length at each level. Signal length must be divisible by 2^levels.

```csharp
using CSharpNumerics.Numerics.SignalProcessing.Wavelets;

var dwt = new DiscreteWaveletTransform(WaveletFamily.Daubechies4);

// Single level → approximation + detail (each length N/2)
var (approximation, detail) = dwt.SingleLevel(signal);

// N-level decomposition (details finest-first)
WaveletDecomposition decomposition = dwt.Decompose(signal, levels: 4);
double[] coarse = decomposition.Approximation;
double[] finest = decomposition.Details[0];

// Exact reconstruction
var idwt = new InverseWaveletTransform(WaveletFamily.Daubechies4);
double[] reconstructed = idwt.Reconstruct(decomposition);
```

By Parseval's theorem the orthonormal transform preserves energy: `Σx² = Σapprox² + Σ(all details)²`, so a low-frequency signal concentrates its energy in the approximation band.

### 🧼 Wavelet De-noising

Decompose, threshold the detail coefficients (noise spreads thinly across coefficients; signal concentrates into a few large ones), and reconstruct. The noise level is estimated robustly from the finest detail band (MAD).

```csharp
double[] clean = WaveletDenoising.Denoise(
    noisy, WaveletFamily.Symlet4, levels: 6,
    type: ThresholdType.Soft,          // or Hard
    rule: ThresholdRule.VisuShrink);   // or BayesShrink
```

### 🔁 MODWT (Maximal Overlap DWT)

An undecimated, **shift-invariant** variant: no downsampling, so every band keeps the full signal length and a circular shift of the input produces the same shift of every coefficient. Works for any signal length and is well suited to time-series alignment.

```csharp
var modwt = new MaximalOverlapDWT(WaveletFamily.Daubechies4);
ModwtDecomposition md = modwt.Forward(signal, levels: 4);
double[] level1Detail = md.Details[0];
double[] smooth       = md.Smooth;

double[] reconstructed = modwt.Inverse(md);   // exact
```




