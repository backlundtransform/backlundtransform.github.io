

## 🎯 KMeans

Class: `KMeans`

| Hyperparameter | Values |
|---|---|
| `K` | Number of clusters |
| `MaxIterations` | Convergence limit |
| `Tolerance` | Convergence threshold |
| `Seed` | Reproducibility |
| `InitMethod` | `Random`, `PlusPlus` |

Exposes after fit: `Centroids`, `Inertia`, `Iterations`

---

## 🔍 DBSCAN

Class: `DBSCAN`

| Hyperparameter | Values |
|---|---|
| `Epsilon` | Neighbourhood radius |
| `MinPoints` | Minimum density |

Discovers K automatically. Noise points labeled `-1`. Exposes `NoiseCount`.

---

## 🌳 Agglomerative Clustering

Class: `AgglomerativeClustering`

| Hyperparameter | Values |
|---|---|
| `K` | Number of clusters |
| `Linkage` | `Single`, `Complete`, `Average`, `Ward` |

Bottom-up hierarchical merging. Exposes `Dendrogram`.

---

## 📐 Clustering Evaluators

All evaluators implement `IClusteringEvaluator` where **higher score = better**.

| Evaluator | Class | Metric | Notes |
|-----------|-------|--------|-------|
| Silhouette | `SilhouetteEvaluator` | $s \in [-1, 1]$ | Higher = better |
| Inertia (Elbow) | `InertiaEvaluator` | $-W$ (negated) | Use `RawInertia()` for elbow curve |
| Davies-Bouldin | `DaviesBouldinEvaluator` | $-DB$ (negated) | Lower DB = better separation |
| Calinski-Harabasz | `CalinskiHarabaszEvaluator` | $CH$ | Higher = better, fast |
