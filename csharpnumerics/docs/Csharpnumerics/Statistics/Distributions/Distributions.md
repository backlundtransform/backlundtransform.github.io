---
sidebar_label: "🔔 Distributions"
---


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
| Student's t | `StudentTDistribution` | $\nu$ (degrees of freedom) |
| Chi-squared | `ChiSquaredDistribution` | $k$ (degrees of freedom) |
| F | `FDistribution` | $d_1, d_2$ (degrees of freedom) |

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

---

## 📐 Student's t, Chi-squared & F Distributions

Used by the hypothesis testing methods, but can also be used directly:

```csharp
var t = new StudentTDistribution(degreesOfFreedom: 29);
double pTwoTail = t.TwoTailedPValue(2.045);   // two-tailed p-value
double quantile  = t.InverseCdf(0.975);         // critical value

var chi2 = new ChiSquaredDistribution(degreesOfFreedom: 5);
double pUpper = chi2.UpperTailPValue(11.07);   // P(X ≥ 11.07)

var f = new FDistribution(d1: 3, d2: 20);
double pF = f.UpperTailPValue(3.10);           // P(F ≥ 3.10)
```
