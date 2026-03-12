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




