---
sidebar_label: "🌊 Transforms"
---

## 🌊 FFT

```csharp
Func<double, double> f = t => Math.Exp(-t * t / 0.02);
var freq = f.FastFouriertransform(-0.5, 0.5, 100)
             .ToFrequencyResolution(100);
```

## 🔄 Laplace Transform

```csharp
double result = f.LaplaceTransform(2.0);
```






