---
sidebar_label: "🌊 Transforms"
---

## 🌊 FFT / DFT

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

## 🔄 Laplace Transform

```csharp
double result = f.LaplaceTransform(2.0);
double inverse = F.InverseLaplaceTransform(1.0);
```

---

## 🔉 Low-Pass Filter

```csharp
var filtered = input.LowPassFilter(output, alpha: 0.25);
```




