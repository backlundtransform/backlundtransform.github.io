---
sidebar_label: "🛡️Robust"
---



The `CSharpNumerics.Statistics.Robust` namespace provides outlier-resistant statistical methods.

## ✂️ Sigma Clipping

Iterative sigma-clipping: removes data points outside [mean − σ_low × σ, mean + σ_high × σ] and recomputes until convergence.

```csharp
using CSharpNumerics.Statistics.Robust;

var data = new[] { 1.0, 2.0, 2.5, 2.3, 100.0, 2.1, 1.9, -50.0, 2.4 };

// Full result with mask, mean, std, iteration count
ClipResult result = SigmaClipping.Clip(data, sigmaLow: 3.0, sigmaHigh: 3.0, maxIter: 10);
result.Mean           // mean of retained points
result.Std            // std of retained points
result.RetainedCount  // number of non-clipped points
result.ClippedCount   // number of removed outliers
result.Iterations     // convergence iterations
result.Mask           // bool[] — true = retained

// Symmetric shorthand
ClipResult sym = SigmaClipping.Clip(data, sigma: 2.5, maxIter: 5);

// Just get the cleaned array
double[] clean = SigmaClipping.Apply(data, sigmaLow: 3.0, sigmaHigh: 3.0);
// clean ≈ { 1.0, 2.0, 2.5, 2.3, 2.1, 1.9, 2.4 }
```

---

## 📏 Median Absolute Deviation (MAD)

A robust measure of spread: MAD = median(|xᵢ − median(x)|). The scaled MAD (k = 1.4826) estimates σ for normal data.

```csharp
using CSharpNumerics.Statistics.Robust;

var data = new[] { 1.0, 2.0, 3.0, 4.0, 5.0, 100.0 };

MadResult result = MedianAbsoluteDeviation.Compute(data);
result.Median     // median of the data
result.Mad        // median absolute deviation
result.ScaledMad  // 1.4826 × MAD (robust σ estimate)

// Custom scale constant
MadResult custom = MedianAbsoluteDeviation.Compute(data, scale: 1.0);
```

---

## ✂️ Trimmed Mean

Arithmetic mean after discarding a proportion of the smallest and largest values. α = 0 gives the ordinary mean; α → 0.5 converges on the median.

```csharp
using CSharpNumerics.Statistics.Robust;

var data = new[] { 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 100.0 };

double trimmed = TrimmedMean.Compute(data, trimRatio: 0.1);
// Trims lowest 10 % and highest 10 %, resistant to the 100.0 outlier
```

---

## 🔄 Winsorized Mean

Like trimmed mean, but replaces extreme values with boundary values instead of discarding them — preserving the original sample size.

```csharp
using CSharpNumerics.Statistics.Robust;

var data = new[] { 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 100.0 };

double winsorized = WinsorizedMean.Compute(data, trimRatio: 0.1);
// Lowest 10 % replaced with next-lowest, highest 10 % with next-highest
```

---

## 📉 Huber Loss

Robust loss function that is quadratic for small residuals and linear for large ones — a smooth blend between MSE and MAE.

```csharp
using CSharpNumerics.Statistics.Robust;

double loss = HuberLoss.Loss(residual: 0.5, delta: 1.35);   // quadratic region
double loss2 = HuberLoss.Loss(residual: 5.0, delta: 1.35);  // linear region
double grad = HuberLoss.Gradient(residual: 5.0, delta: 1.35);
double w    = HuberLoss.Weight(residual: 5.0, delta: 1.35); // for IRLS

double[] residuals = { 0.5, -0.3, 4.0, -2.0 };
double meanLoss = HuberLoss.MeanLoss(residuals, delta: 1.35);
```

---

## 🎯 RANSAC

RANdom SAmple Consensus — iterative robust model fitting that finds inlier consensus despite heavy outlier contamination.

```csharp
using CSharpNumerics.Statistics.Robust;

var x = new double[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
var y = new double[] { 2, 4, 6, 8, 10, 12, 14, 100, -50, 20 };

RansacResult result = Ransac.FitLine(x, y,
    residualThreshold: 1.0, maxIterations: 2000, seed: 42);

result.BestModel     // double[] { intercept, slope }
result.InlierMask    // bool[] — true = inlier
result.InlierCount   // number of inliers
result.Iterations    // iterations performed
```

---

## 🔍 Outlier Detection

Three complementary methods for identifying outliers in univariate data.

```csharp
using CSharpNumerics.Statistics.Robust;

var data = new[] { 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 100.0 };

// IQR fence method (k = 1.5 mild, k = 3.0 extreme)
OutlierResult iqr = OutlierDetection.Iqr(data, k: 1.5);

// Standard Z-score
OutlierResult zs = OutlierDetection.ZScore(data, threshold: 3.0);

// Modified Z-score (MAD-based, more robust)
OutlierResult mz = OutlierDetection.ModifiedZScore(data, threshold: 3.5);

iqr.OutlierMask      // bool[] — true = outlier
iqr.OutlierIndices   // int[] indices of outliers
iqr.OutlierCount     // number of outliers
iqr.Scores           // deviation scores
```
