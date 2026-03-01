---
sidebar_label: "⚡ Supervised AutoML"
---

## ➡️ Pipeline Grid
All models are implemented directly on top of the library’s **Matrix** and **Vector** primitives.

Models can be combined with:

* **Scalers** (e.g. `StandardScaler`)
* **Feature selectors** (e.g. `SelectKBest`)
* **Cross-validation strategies**
* **Hyperparameter search grids**


```csharp
var pipelineGrid = new PipelineGrid()
    .AddModel<RandomForest>(g => g
        .Add("NumTrees", 50, 100, 200)
        .Add("MaxDepth", 5, 8, 10))
    .AddModel<Logistic>(g => g
        .Add("LearningRate", 0.05, 0.1)
        .Add("MaxIterations", 1000, 2000)
        .AddScaler<StandardScaler>(s => { })
        .AddSelector<SelectKBest>(s => s
           .Add("K", 1, 2)))
    .AddModel<DecisionTree>(g => g
        .Add("MaxDepth", 3, 5, 8))
    .AddModel<KNearestNeighbors>(g => g
        .Add("K", 3, 5, 7));
```

---

## 🔬 SupervisedExperiment (Fluent API)

Run a full experiment with grid search and cross-validation in one call:

```csharp
var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(pipelineGrid)
    .WithCrossValidators(
        CrossValidatorConfig.KFold(folds: 5),
        CrossValidatorConfig.StratifiedKFold(folds: 10),
        CrossValidatorConfig.ShuffleSplit(nSplits: 10, testSize: 0.2))
    .Run();
```

**Key points:**

* `For(X, y)` takes your feature matrix and target vector
* `WithGrid` defines models and hyperparameter combinations — same grid API as `PipelineGrid`
* `WithCrossValidators` accepts one or more cross-validation strategies; the first is the **primary** used for ranking
* All combinations of model × hyperparameters × cross-validator are evaluated automatically
* Results are ranked by the primary cross-validator's mean score