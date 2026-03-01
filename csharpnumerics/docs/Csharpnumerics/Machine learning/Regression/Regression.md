---
sidebar_label: "📉 Regression"
---

All regressors implement `IRegressionModel`.


## 📈 Linear

Class: `Linear`

| Hyperparameter | Values |
|---|---|
| `LearningRate` | Step size |
| `FitIntercept` | Include bias term |

## 🔷 Ridge Regression (L2)

Class: `Ridge`

| Hyperparameter | Values |
|---|---|
| `Alpha` | Regularization strength |
| `FitIntercept` | Include bias term |


## ✂️ Lasso Regression (L1)

Class: `Lasso`

| Hyperparameter | Values |
|---|---|
| `Alpha` | Regularization strength |
| `MaxIterations` | Convergence limit |

## 🔗 Elastic Net (L1 + L2)

Class: `ElasticNet`

| Hyperparameter | Values |
|---|---|
| `Lambda` | Regularization strength |
| `L1Ratio` | L1 vs L2 balance |

## ➡️ Support Vector Regression (Linear)

Class: `LinearSVR`

| Hyperparameter | Values |
|---|---|
| `C` | Regularization strength |
| `Epsilon` | Insensitive zone |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |

## 🎯 Support Vector Regression (Kernel)

Class: `KernelSVR`

| Hyperparameter | Values |
|---|---|
| `C` | Regularization strength |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |
| `Kernel` | `RBF`, `Polynomial` |
| `Gamma` | Kernel coefficient |
| `Degree` | Polynomial degree |


## 🧠 Multilayer Perceptron (Regressor)

Class: `MLPRegressor`

| Hyperparameter | Values |
|---|---|
| `HiddenLayers` | e.g. `64`, `64,32` |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |
| `BatchSize` | Mini-batch size |
| `L2` | L2 regularization |
| `Activation` | `ReLU`, `Tanh`, `Sigmoid` |

