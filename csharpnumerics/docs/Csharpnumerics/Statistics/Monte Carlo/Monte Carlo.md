---
sidebar_label: "🎯 Monte Carlo"
---

## 🎯 Monte Carlo

The `CSharpNumerics.Statistics.MonteCarlo` namespace provides a general-purpose Monte Carlo simulation engine.

```csharp
using CSharpNumerics.Statistics.MonteCarlo;
```

---

## 🚀 Quick Start — Estimate $\pi$

```csharp
var sim = new MonteCarloSimulator(seed: 42);
var result = sim.Run(rng =>
{
    double x = rng.NextUniform(0, 1);
    double y = rng.NextUniform(0, 1);
    return x * x + y * y <= 1.0 ? 1.0 : 0.0;
}, iterations: 1_000_000);

double piEstimate = result.Mean * 4.0; // ≈ 3.1416
```

---

## ∫ Monte Carlo Integration

```csharp
// ∫₀^π sin(x) dx = 2
var result = sim.IntegrateUniform(Math.Sin, a: 0, b: Math.PI, iterations: 500_000);
// result.Mean ≈ 2.0

// E[X²] where X ~ N(0,1) → should be ≈ 1.0
var normal = new NormalDistribution(0, 1);
var result2 = sim.Integrate(x => x * x, normal, iterations: 200_000);
```

---

## 🧩 Custom Models via IMonteCarloModel

```csharp
public class TwoDiceModel : IMonteCarloModel
{
    public double Evaluate(RandomGenerator rng)
    {
        return rng.NextInt(1, 7) + rng.NextInt(1, 7);
    }
}

var result = sim.Run(new TwoDiceModel(), iterations: 200_000);
// result.Mean ≈ 7.0
```

---

## 📊 Result Analysis

`MonteCarloResult` provides descriptive statistics, percentiles, histograms and probability queries:

```csharp
result.Mean                         // Sample mean
result.Variance                     // Sample variance (n-1)
result.StandardDeviation            // √Variance
result.StandardError                // σ / √n (precision of estimate)
result.Median                       // 50th percentile
result.Min / result.Max

result.Percentile(95);              // 95th percentile
result.ConfidenceInterval(0.95);    // (lower, upper) from empirical percentiles
result.Probability(x => x > 10);   // Fraction of samples satisfying predicate

var histogram = result.Histogram(bins: 20);  // (binCenter, count)[]
```

---

## 🔀 Multivariate & Convergence

```csharp
// Multiple outputs per trial
var results = sim.RunMultivariate(rng => new[]
{
    rng.NextGaussian(0, 1),
    rng.NextGaussian(10, 2)
}, iterations: 100_000);
// results[0].Mean ≈ 0, results[1].Mean ≈ 10

// Track running mean to verify convergence
double[] curve = sim.ConvergenceCurve(
    rng => rng.NextGaussian(5.0, 1.0), iterations: 50_000);
```
