---
sidebar_label: "🎲 Uncertainty Estimation"
---

## 🎲 Monte Carlo Clustering

Use `MonteCarloClustering` to quantify **how stable** your clustering results are via bootstrap resampling. Two analysis modes are available.

---

## 🔁 Bootstrap — Consensus Matrix & Score Distribution

Runs the algorithm many times on bootstrap-resampled data. Produces a **consensus matrix**, per-point **stability scores**, and full **score distributions** with confidence intervals.

```csharp
var mc = new MonteCarloClustering { Iterations = 200, Seed = 42 };
var result = mc.RunBootstrap(
    data,
    new KMeans { K = 3 },
    new SilhouetteEvaluator(),
    new StandardScaler());   // optional

// Score uncertainty
var ci = result.ScoreConfidenceInterval();       // e.g. (0.68, 0.74)
double se = result.ScoreDistribution.StandardError;
var histogram = result.ScoreDistribution.Histogram(20);

// Consensus matrix (N × N) — fraction of times each pair co-clustered
Matrix consensus = result.ConsensusMatrix;

// Per-point stability [0, 1] — how consistently each point stays in its cluster
double[] stability = result.PointStability;
double[] convergence = result.ConvergenceCurve;  // running mean of score
```

---

## 🔍 Experiment — Optimal-K Distribution

Runs a full K-range experiment many times on bootstrap samples. Shows **how often each K value is selected as best**, revealing whether the optimal K is robust.

```csharp
var mc = new MonteCarloClustering { Iterations = 100, Seed = 42 };
var kResult = mc.RunExperiment(
    data,
    new KMeans(),
    new SilhouetteEvaluator(),
    minK: 2, maxK: 8);

// Which K values won across the 100 bootstrap runs?
foreach (var (k, count) in kResult.OptimalKDistribution.OrderByDescending(x => x.Value))
    Console.WriteLine($"K={k}: chosen {count}/100 times");

// Score distribution for the best K in each iteration
var ci = kResult.ScoreConfidenceInterval();
```

---

## ⚡ Fluent API Integration

Add Monte Carlo uncertainty with a single builder call:

```csharp
var result = ClusteringExperiment
    .For(data)
    .WithAlgorithm(new KMeans())
    .TryClusterCounts(2, 8)
    .WithEvaluator(new SilhouetteEvaluator())
    .WithScaler(new StandardScaler())
    .WithMonteCarloUncertainty(iterations: 200, seed: 42)
    .Run();

// Standard result
Console.WriteLine($"Best K = {result.BestClusterCount}");

// Monte Carlo result (populated automatically)
var mcResult = result.MonteCarloResult;
Console.WriteLine($"Score CI = {mcResult.ScoreConfidenceInterval()}");
Console.WriteLine($"K distribution: {string.Join(", ",
    mcResult.OptimalKDistribution.Select(kv => $"K={kv.Key}: {kv.Value}"))}");
```

---

## 📌 Key Points

* Bootstrap uses **sampling with replacement** — each iteration sees ~63% unique points
* Consensus matrix cell $(i,j)$ = fraction of runs where points $i$ and $j$ co-clustered
* Point stability = average consensus with same-cluster neighbours; close to 1.0 = very stable
* `RunExperiment` requires a K-accepting algorithm (KMeans, AgglomerativeClustering)
* All results include full `MonteCarloResult` from the statistics engine (Mean, StdDev, Percentile, Histogram, CI, StandardError)
* Reproducible when `Seed` is set
