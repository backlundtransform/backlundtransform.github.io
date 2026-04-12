---
sidebar_label: "⤴️Fitting"
---

The `CSharpNumerics.Statistics.Fitting` namespace provides a comprehensive curve-fitting toolkit: ordinary, weighted, nonlinear, and robust least squares, plus goodness-of-fit metrics, residual analysis, and parameter estimation.

### 📉 Least Squares (OLS)

Polynomial and multiple-regression fitting via the normal equations.

```csharp
using CSharpNumerics.Statistics.Fitting;
using CSharpNumerics.Numerics.Objects;

// Linear fit: y = a0 + a1x
var x = new VectorN(new[] { 1.0, 2, 3, 4, 5 });
var y = new VectorN(new[] { 2.1, 3.9, 6.2, 7.8, 10.1 });
FittingResult lr = LeastSquaresFitter.Fit(x, y, degree: 1);
// lr.Coefficients[0] -> intercept, lr.Coefficients[1] -> slope

// Polynomial fit: y = a0 + a1x + a2x^2
FittingResult poly = LeastSquaresFitter.Fit(x, y, degree: 2);

// Multiple regression with a custom design matrix (include intercept column)
double[,] X = { { 1, 2.0, 3.5 }, { 1, 4.0, 1.2 }, { 1, 6.0, 5.8 }, /* ... */ };
var response = new VectorN(new[] { 10.0, 20, 30 });
FittingResult mr = LeastSquaresFitter.Fit(X, response);
```

### ⚖️ Weighted Least Squares (WLS)

Down-weight unreliable observations.

```csharp
var weights = new VectorN(new[] { 1.0, 1, 0.01, 1, 1 }); // low weight on outlier
FittingResult wls = WeightedLeastSquaresFitter.Fit(x, y, weights, degree: 1);

// With a design matrix
FittingResult wlsM = WeightedLeastSquaresFitter.Fit(designMatrix, y, weights);
```

### 🧮 Nonlinear Least Squares (Levenberg-Marquardt)

Fit any user-defined model with numerical Jacobian.

```csharp
// Exponential model: y = a * exp(b * x)
Func<double, VectorN, double> model = (xi, p) => p[0] * Math.Exp(p[1] * xi);
var init = new VectorN(new[] { 1.0, 0.1 });

FittingResult nlr = NonlinearLeastSquaresFitter.Fit(model, x, y, init);
// nlr.Coefficients[0] -> a, nlr.Coefficients[1] -> b

// Logistic model
Func<double, VectorN, double> logistic = (xi, p) =>
    p[0] / (1.0 + Math.Exp(-p[1] * (xi - p[2])));
FittingResult logFit = NonlinearLeastSquaresFitter.Fit(logistic, x, y,
    initialParameters: new VectorN(new[] { 10.0, 1.0, 5.0 }),
    maxIterations: 500, tolerance: 1e-12);
```

### 🛡️ Robust Fitting (IRLS)

Resist outliers using Iteratively Reweighted Least Squares with configurable weight functions.

```csharp
// Huber weights (default)
FittingResult robust = RobustFitter.Fit(x, y, degree: 1);

// Tukey bisquare weights
FittingResult tukey = RobustFitter.Fit(x, y, degree: 1,
    weightFunction: RobustWeightFunction.TukeyBisquare);

// Available weight functions: Huber, TukeyBisquare, Cauchy, Andrews
// Custom tuning constant
FittingResult custom = RobustFitter.Fit(x, y, degree: 2,
    weightFunction: RobustWeightFunction.Huber, tuningConstant: 2.0);
```

### ✅ Goodness of Fit & Residual Analysis

```csharp
var observed  = new VectorN(new[] { 1.0, 2, 3, 4, 5 });
var predicted = new VectorN(new[] { 1.1, 2.0, 2.9, 4.1, 4.9 });

double r2    = GoodnessOfFit.RSquared(observed, predicted);
double adjR2 = GoodnessOfFit.AdjustedRSquared(r2, n: 5, parameterCount: 2);
double rmse  = GoodnessOfFit.RMSE(observed, predicted);
double mae   = GoodnessOfFit.MAE(observed, predicted);
double sse   = GoodnessOfFit.SSE(observed, predicted);
double sst   = GoodnessOfFit.SST(observed);
double mse   = GoodnessOfFit.MSE(observed, predicted);
double aic   = GoodnessOfFit.AIC(observed, predicted, parameterCount: 2);
double bic   = GoodnessOfFit.BIC(observed, predicted, parameterCount: 2);

// Full residual diagnostics
ResidualAnalysis ra = GoodnessOfFit.AnalyzeResiduals(observed, predicted);
ra.StandardizedResiduals   // residuals / sigma
ra.DurbinWatsonStatistic   // approx 2 -> no autocorrelation
ra.MeanResidual            // should be near 0
ra.Skewness                // 0 = symmetric
ra.Kurtosis                // 0 = normal tails
```

### 🎯 Parameter Estimation

Confidence/prediction intervals, MLE, and method-of-moments estimators.

```csharp
FittingResult fit = LeastSquaresFitter.Fit(x, y);

// 95 % confidence intervals for coefficients (returns VectorN lower/upper)
var (lower, upper) = ParameterEstimation.ConfidenceIntervals(fit, confidenceLevel: 0.95);

// Prediction interval at a new point
double[,] designMatrix = { /* the X used for fitting */ };
var xNew = new VectorN(new[] { 1.0, 3.0 }); // [intercept, x=3]
var (lo, hi) = ParameterEstimation.PredictionInterval(fit, designMatrix, xNew);

// Maximum Likelihood Estimation (numerical optimisation)
Func<VectorN, double> negLogL = theta => { /* -ln L(theta|data) */ };
VectorN mle = ParameterEstimation.MaximumLikelihoodEstimate(negLogL, initialParameters);

// Method of Moments (all accept VectorN)
var (mean, var)    = ParameterEstimation.MethodOfMomentsNormal(data);
double rate        = ParameterEstimation.MethodOfMomentsExponential(data);
double lambda      = ParameterEstimation.MethodOfMomentsPoisson(data);
var (shape, scale) = ParameterEstimation.MethodOfMomentsGamma(data);
```

### 📦 FittingResult

Every fitter returns a `FittingResult` with:

| Property | Description |
|---|---|
| `Coefficients` | `VectorN` - estimated parameters [a0, a1, ...] |
| `StandardErrors` | `VectorN` - SE for each coefficient |
| `Residuals` | `VectorN` - observed - fitted |
| `FittedValues` | `VectorN` - model predictions |
| `RSquared` | R^2 |
| `AdjustedRSquared` | Penalised R^2 |
| `RMSE` | Root mean squared error |
| `MAE` | Mean absolute error |
| `DegreesOfFreedom` | n - p |
| `ObservationCount` | n |
| `ParameterCount` | p |