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
