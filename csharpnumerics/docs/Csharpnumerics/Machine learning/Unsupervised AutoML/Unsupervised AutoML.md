---
sidebar_label: "🔬 Unsupervised AutoML"
---


CSharpNumerics includes a full **unsupervised clustering framework** with the same philosophy as the supervised pipeline: easy API, pluggable algorithms, and transparent results.

All clustering models implement `IClusteringModel` and operate directly on `Matrix` primitives — no target vector needed.

---

## ➡️ ClusteringExperiment (Fluent API)

The simplest way to try clustering — just pick an algorithm, a range of K values, and an evaluator:

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithAlgorithm(new KMeans())
    .TryClusterCounts(2, 10)
    .WithEvaluator(new SilhouetteEvaluator())
    .WithScaler(new StandardScaler())
    .Run();

Console.WriteLine(experiment.BestClusterCount);   // e.g. 4
Console.WriteLine(experiment.BestScore);           // e.g. 0.72
VectorN labels = experiment.BestLabels;
```

---

## 🔀 Multi-Algorithm Comparison

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithAlgorithms(new KMeans(), new AgglomerativeClustering())
    .TryClusterCounts(2, 8)
    .WithEvaluators(new SilhouetteEvaluator(), new CalinskiHarabaszEvaluator())
    .WithScaler(new StandardScaler())
    .Run();

foreach (var r in experiment.Rankings)
    Console.WriteLine($"{r.AlgorithmName} K={r.ClusterCount} → {r.Scores["Silhouette"]:F3}");

var bestSilhouette = experiment.BestBy<SilhouetteEvaluator>();
var bestCH = experiment.BestBy<CalinskiHarabaszEvaluator>();
```

**Key points:**

* `TryClusterCounts(min, max)` auto-expands K for algorithms that accept it
* DBSCAN discovers K on its own — the range is **ignored**
* First evaluator added is the **primary** used for ranking
* `BestBy<T>()` retrieves the best result by a specific evaluator

---

## ➡️ Clustering Grid

Full hyperparameter grid search across multiple algorithms and scalers:

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithGrid(new ClusteringGrid()
        .AddModel<KMeans>(g => g
            .Add("K", 2, 3, 4, 5, 6, 7, 8)
            .Add("InitMethod", KMeansInit.Random, KMeansInit.PlusPlus)
            .AddScaler<StandardScaler>(s => { }))
        .AddModel<DBSCAN>(g => g
            .Add("Epsilon", 0.3, 0.5, 0.8, 1.0, 1.5)
            .Add("MinPoints", 3, 5, 10)
            .AddScaler<MinMaxScaler>(s => { }))
        .AddModel<AgglomerativeClustering>(g => g
            .Add("K", 2, 3, 4, 5)
            .Add("Linkage", LinkageType.Ward, LinkageType.Complete)))
    .WithEvaluators(
        new SilhouetteEvaluator(),
        new CalinskiHarabaszEvaluator(),
        new DaviesBouldinEvaluator())
    .Run();

foreach (var r in experiment.Rankings.Take(10))
{
    Console.WriteLine(
        $"{r.AlgorithmName,-25} K={r.ClusterCount,2}  " +
        $"Silhouette={r.Scores["Silhouette"],7:F3}  " +
        $"CH={r.Scores["CalinskiHarabasz"],10:F1}  " +
        $"({r.Duration.TotalMilliseconds:F0} ms)");
}
```



