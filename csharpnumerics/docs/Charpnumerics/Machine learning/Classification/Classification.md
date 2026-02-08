All classifiers implement `IClassificationModel` and operate directly on `Matrix` and `Vector` primitives.

## 📊 Logistic Regression

Class: `Logistic`

Hyperparameters:

* `LearningRate`
* `MaxIterations`
* `FitIntercept` 
* `RegularizationStrength`
* `Tolerance` 


## 🌳 Decision Tree

Class: `DecisionTree`

Hyperparameters:

* `MaxDepth`
* `MinSamplesSplit`


## 🌲 Random Forest

Class: `RandomForest`

Hyperparameters:

* `NumTrees`
* `MaxDepth`
* `MinSamplesSplit`



## 👥 K-Nearest Neighbors

Class: `KNearestNeighbors`

Hyperparameters:

* `K`

## 🎲 Naive Bayes

Class: `NaiveBayes`

Hyperparameters:
(No tunable hyperparameters)

## ➡️ Support Vector Classifier (Linear)

Class: `LinearSVC`

Hyperparameters:

* `C` (regularization strength)
* `LearningRate`
* `Epochs`

## 🎯 Support Vector Classifier (Kernel)

Class: `KernelSVC`

Hyperparameters:

* `C`
* `Kernel` (RBF, Polynomial)
* `LearningRate`
* `Epochs`
* `Gamma`
* `Degree` (for polynomial kernel)

## 🧠 Multilayer Perceptron (Classifier)

Class: `MLPClassifier`

Hyperparameters:

* `HiddenLayers` (e.g. `64`, `64,32`)
* `LearningRate`
* `Epochs`
* `Activation` (ReLU, Tanh, Sigmoid)


