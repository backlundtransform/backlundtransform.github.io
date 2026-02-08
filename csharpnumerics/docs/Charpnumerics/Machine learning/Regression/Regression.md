
All regressors implement `IRegressionModel`.


## 📈 Linear

Class: `Linear`

Hyperparameters:

* `LearningRate`
* `FitIntercept`

## 🔷 Ridge Regression (L2)

Class: `Ridge`

Hyperparameters:

* `Alpha`
* `FitIntercept`


## ✂️ Lasso Regression (L1)

Class: `Lasso`

Hyperparameters:

* `Alpha`
* `MaxIterations`

## 🔗 Elastic Net (L1 + L2)

Class: `ElasticNet`

Hyperparameters:

* `Lambda`
* `L1Ratio`

## ➡️ Support Vector Regression (Linear)

Class: `LinearSVR`

Hyperparameters:

* `C`
* `Epsilon`
* `LearningRate`
* `Epochs`

## 🎯 Support Vector Regression (Kernel)

Class: `KernelSVR`

Hyperparameters:

* `C`
* `LearningRate`
* `Epochs`
* `Kernel`
* `Gamma`
* `Degree`


## 🧠 Multilayer Perceptron (Regressor)

Class: `MLPRegressor`

Hyperparameters:

* `HiddenLayers`
* `LearningRate`
* `Epochs`
* `BatchSize`
* `L2`
* `Activation`

