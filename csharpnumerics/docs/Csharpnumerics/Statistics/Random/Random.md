---
sidebar_label: "🎲 Random"
---

## 🎲 Random

The `CSharpNumerics.Statistics.Random` namespace provides `RandomGenerator` — a seedable random number engine with advanced sampling methods built on top of `System.Random`.

```csharp
using CSharpNumerics.Statistics.Random;
```

---

## 🌱 Seedable Construction

Create a reproducible generator by supplying a seed:

```csharp
var rng = new RandomGenerator(seed: 42);
```

---

## 🎯 Continuous Distributions

**Uniform**

```csharp
double u = rng.NextUniform(2.0, 5.0);
```

**Gaussian (Box-Muller transform)**

```csharp
double g = rng.NextGaussian(mean: 0, standardDeviation: 1);
```

**Exponential (inverse transform sampling)**

```csharp
double e = rng.NextExponential(lambda: 2.0);
```

---

## 🔢 Discrete Distributions

**Poisson (Knuth / rejection)**

```csharp
int p = rng.NextPoisson(lambda: 4.0);
```

**Bernoulli**

```csharp
int coin = rng.NextBernoulli(0.5);
```

**Binomial**

```csharp
int hits = rng.NextBinomial(n: 20, p: 0.3);
```

---

## 📦 Batch Sampling

Generate large arrays of samples in a single call:

```csharp
double[] gaussianSamples = rng.GaussianSamples(1000);
double[] uniformSamples  = rng.UniformSamples(1000, min: 0, max: 10);
```

---

## 🔀 Shuffle & Sample

Randomly reorder a collection or draw without replacement:

```csharp
var deck = new[] { 1, 2, 3, 4, 5 };
rng.Shuffle(deck);
var hand = rng.Sample(deck, k: 3);
```
