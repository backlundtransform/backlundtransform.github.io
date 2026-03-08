# 🗜️ Dimensionality Reduction

CSharpNumerics includes **unsupervised dimensionality reduction** as an optional preprocessing step in both supervised and clustering pipelines. Reducers implement `IDimensionalityReducer` and slot into the pipeline between feature selection and scaling.

```csharp
using CSharpNumerics.ML;
```

---

## 📋 Pipeline Order

| Pipeline | Order |
|----------|-------|
| **Supervised** | Selector → **Reducer** → Scaler → Model |
| **Clustering** | **Reducer** → Scaler → Model |


---

## 🔵 Algorithms

**Principal Component Analysis (PCA)**

Class: `PCA`

Projects data onto the top eigenvectors of the covariance matrix.
Uses power iteration with deflation for eigendecomposition.

Hyperparameters:

* `NComponents` — number of output dimensions
* `MaxIterations` — power iteration limit (default 1000)
* `Tolerance` — convergence threshold (default 1e-8)
* `Seed` — optional random seed

Exposes after fit: `Components`, `ExplainedVariance`, `ExplainedVarianceRatio`, `Mean`

---

## 🔬 Clustering Pipeline Integration

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithAlgorithm(new KMeans())
    .TryClusterCounts(2, 8)
    .WithEvaluator(new SilhouetteEvaluator())
    .WithReducer(new PCA { NComponents = 5 })
    .WithScaler(new StandardScaler())
    .Run();

Console.WriteLine(experiment.BestClusterCount);
```

---

## 🔲 Clustering Grid Integration

```csharp
var experiment = ClusteringExperiment
    .For(X)
    .WithGrid(new ClusteringGrid()
        .AddModel<KMeans>(g => g
            .Add("K", 2, 3, 4, 5)
            .AddReducer<PCA>(r => r.Add("NComponents", 2, 5, 10))
            .AddScaler<StandardScaler>(s => { })))
    .WithEvaluator(new SilhouetteEvaluator())
    .Run();
```

---

## ⚡ Supervised Pipeline Integration

```csharp
var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(new PipelineGrid()
        .AddModel<KNearestNeighbors>(g => g
            .Add("K", 3, 5, 7)
            .AddReducer<PCA>(r => r.Add("NComponents", 2, 5))
            .AddScaler<StandardScaler>(s => { }))
        .AddModel<DecisionTree>(g => g
            .Add("MaxDepth", 3, 5, 10)))
    .WithCrossValidator(CrossValidatorConfig.KFold(folds: 5))
    .Run();
```

---

## 📌 Key Points

* Reducers are **optional** — existing pipelines work unchanged
* PCA uses power iteration — no external dependencies
* `ExplainedVarianceRatio` shows how much variance each component captures
* Grid search over `NComponents` finds the optimal dimensionality automatically
* Works with both supervised and clustering pipelines
* Follows the same `FitTransform` / `Transform` / `Clone` pattern as scalers
* Implements `IHasHyperparameters` for grid search integration
