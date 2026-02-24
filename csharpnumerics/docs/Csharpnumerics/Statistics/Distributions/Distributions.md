---
sidebar_label: "📈 Distributions"
---

## 📈 Distributions

The `CSharpNumerics.Statistics.Distributions` namespace provides probability distributions with a common `IDistribution` interface.

```csharp
using CSharpNumerics.Statistics.Distributions;
using CSharpNumerics.Statistics.Random;
```

---

## 📋 Available Distributions

| Distribution | Class | Parameters |
|---|---|---|
| Uniform | `UniformDistribution` | $a, b$ |
| Normal | `NormalDistribution` | $\mu, \sigma$ |
| Exponential | `ExponentialDistribution` | $\lambda$ |
| Poisson | `PoissonDistribution` | $\lambda$ |
| Bernoulli | `BernoulliDistribution` | $p$ |
| Binomial | `BinomialDistribution` | $n, p$ |

Every distribution exposes `Mean`, `Variance`, `StandardDeviation`, `Pdf(x)`, `Cdf(x)`, `Sample(rng)` and `Samples(rng, count)`.

---

## 🔔 Normal Distribution

```csharp
var normal = new NormalDistribution(mu: 100, sigma: 15);

double pdf = normal.Pdf(100);         // peak value
double cdf = normal.Cdf(115);         // P(X ≤ 115) ≈ 0.8413
double q   = normal.InverseCdf(0.95); // z such that P(X ≤ z) = 0.95

var rng = new RandomGenerator(42);
double[] samples = normal.Samples(rng, 10_000);
```

---

## 🎯 Poisson Distribution

```csharp
var poisson = new PoissonDistribution(lambda: 3.0);
double pmf   = poisson.Pdf(2);   // P(X = 2)
double cumul = poisson.Cdf(4);   // P(X ≤ 4)
```

---

## 🪙 Binomial Distribution

```csharp
var binomial = new BinomialDistribution(n: 10, p: 0.3);
// PMF sums to 1
double total = Enumerable.Range(0, 11).Sum(k => binomial.Pdf(k));
```
