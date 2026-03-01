---
sidebar_label: "🔬 Unsupervised AutoML"
---


CSharpNumerics includes a full **unsupervised clustering framework** with the same philosophy as the supervised pipeline: easy API, pluggable algorithms, and transparent results.

All clustering models operate directly on `Matrix` primitives — no target vector needed.


## ➡️ Clustering Grid
All algoritms are implemented directly on top of the library’s **Matrix** and **Vector** primitives.

Models can be combined with:

* **Scalers** (e.g. `StandardScaler`)
* **Hyperparameter search grids**


```csharp
var clusteringGrid = new ClusteringGrid()
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
            .Add("Linkage", LinkageType.Ward, LinkageType.Complete)
```

---

## ➡️ ClusteringExperiment (Fluent API)

Run a full experiment with grid search and evaluator in one call:

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithGrid(clusteringGrid)
    .WithEvaluators(
        new SilhouetteEvaluator(),
        new CalinskiHarabaszEvaluator(),
        new DaviesBouldinEvaluator())
    .Run();
```

## 🔀 Multi-Algorithm Comparison

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithAlgorithms(new KMeans(), new AgglomerativeClustering())
    .TryClusterCounts(2, 8)
    .WithEvaluators(new SilhouetteEvaluator(), new CalinskiHarabaszEvaluator())
    .WithScaler(new StandardScaler())
    .Run();

var bestSilhouette = experiment.BestBy<SilhouetteEvaluator>();
var bestCH = experiment.BestBy<CalinskiHarabaszEvaluator>();
```

**Key points:**

* `TryClusterCounts(min, max)` auto-expands K for algorithms that accept it
* DBSCAN discovers K on its own — the range is **ignored**
* First evaluator added is the **primary** used for ranking
* `BestBy<T>()` retrieves the best result by a specific evaluator



