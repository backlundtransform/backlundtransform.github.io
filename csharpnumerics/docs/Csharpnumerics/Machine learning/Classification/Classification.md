---
sidebar_label: "🏷️ Classification"
---

All classifiers implement `IClassificationModel` and operate directly on `Matrix` and `Vector` primitives.

## 📊 Logistic Regression

Class: `Logistic`

| Hyperparameter | Values |
|---|---|
| `LearningRate` | Step size |
| `MaxIterations` | Convergence limit |
| `FitIntercept` | Include bias term |
| `RegularizationStrength` | L2 penalty |
| `Tolerance` | Convergence threshold | 


## 🌳 Decision Tree

Class: `DecisionTree`

| Hyperparameter | Values |
|---|---|
| `MaxDepth` | Maximum tree depth |
| `MinSamplesSplit` | Minimum samples to split |


## 🌲 Random Forest

Class: `RandomForest`

| Hyperparameter | Values |
|---|---|
| `NumTrees` | Number of trees |
| `MaxDepth` | Maximum tree depth |
| `MinSamplesSplit` | Minimum samples to split |



## 👥 K-Nearest Neighbors

Class: `KNearestNeighbors`

| Hyperparameter | Values |
|---|---|
| `K` | Number of neighbors |

## 🎲 Naive Bayes

Class: `NaiveBayes`

No tunable hyperparameters.

## ➡️ Support Vector Classifier (Linear)

Class: `LinearSVC`

| Hyperparameter | Values |
|---|---|
| `C` | Regularization strength |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |

## 🎯 Support Vector Classifier (Kernel)

Class: `KernelSVC`

| Hyperparameter | Values |
|---|---|
| `C` | Regularization strength |
| `Kernel` | `RBF`, `Polynomial` |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |
| `Gamma` | Kernel coefficient |
| `Degree` | Polynomial degree |

## 🧠 Multilayer Perceptron (Classifier)

Class: `MLPClassifier`

| Hyperparameter | Values |
|---|---|
| `HiddenLayers` | e.g. `64`, `64,32` |
| `LearningRate` | Step size |
| `Epochs` | Training iterations |
| `Activation` | `ReLU`, `Tanh`, `Sigmoid` |


