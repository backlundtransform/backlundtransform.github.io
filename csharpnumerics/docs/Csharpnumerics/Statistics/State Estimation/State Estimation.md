---
sidebar_label: "≈ State Estimation"
---

The `CSharpNumerics.Statistics.StateEstimation` namespace provides Kalman-family estimators for recursively tracking a hidden state from noisy measurements in a linear or non-linear state-space model. Built on the library's `Matrix` and `VectorN` primitives.

### 🛰️ Kalman Filter (linear)

For a linear-Gaussian model $x_k = F x_{k-1} + w$, $z_k = H x_k + v$. Alternate `Predict` (propagate through the process model) and `Update` (fold in a measurement). The state estimate $\hat x$ and covariance $P$ are exposed via `State` and `Covariance`.

```csharp
using CSharpNumerics.Statistics.StateEstimation;
using CSharpNumerics.Numerics.Objects;

// Track a noisy constant level (1-D state)
var kf = new KalmanFilter(
    initialState: new VectorN(new[] { 0.0 }),
    initialCovariance: new Matrix(new[,] { { 1.0 } }));

var F = new Matrix(new[,] { { 1.0 } });   // state transition
var Q = new Matrix(new[,] { { 1e-5 } });  // process noise
var H = new Matrix(new[,] { { 1.0 } });   // measurement matrix
var R = new Matrix(new[,] { { 0.25 } });  // measurement noise

foreach (double z in measurements)
{
    kf.Predict(F, Q);
    kf.Update(H, R, new VectorN(new[] { z }));
}

double estimate = kf.State[0];
double variance = kf.Covariance.values[0, 0];
```

A constant-velocity tracker uses a 2-D state `[position, velocity]`:

```csharp
var F = new Matrix(new[,] { { 1.0, 1.0 }, { 0.0, 1.0 } });  // dt = 1
var H = new Matrix(new[,] { { 1.0, 0.0 } });                // observe position only
// … Predict/Update with position measurements → kf.State[1] converges to the velocity
```

A control-input overload `Predict(F, Q, B, u)` is also available.

### 🔀 Extended Kalman Filter (non-linear)

For non-linear models $x_k = f(x_{k-1}) + w$, $z_k = h(x_k) + v$. Supply the non-linear functions together with their Jacobians; the covariance is propagated through the linearisation.

```csharp
double omega = 0.1;

Func<VectorN, VectorN> f    = x => new VectorN(new[] { x[0] + omega });   // phase advance
Func<VectorN, Matrix>  jacF = _ => new Matrix(new[,] { { 1.0 } });
Func<VectorN, VectorN> h    = x => new VectorN(new[] { Math.Sin(x[0]) }); // non-linear measurement
Func<VectorN, Matrix>  jacH = x => new Matrix(new[,] { { Math.Cos(x[0]) } });

var ekf = new ExtendedKalmanFilter(
    new VectorN(new[] { 0.0 }), new Matrix(new[,] { { 0.1 } }));

ekf.Predict(f, jacF, Q);
ekf.Update(h, jacH, R, new VectorN(new[] { z }));
```

### 📉 Kalman Smoother (Rauch–Tung–Striebel)

Offline fixed-interval smoother: runs a forward Kalman pass over the whole batch, then a backward recursion that refines each estimate using all later measurements. Smoothed covariances are never larger than the forward-only ones, so the track is less noisy. Assumes time-invariant `F, Q, H, R`.

```csharp
var smoother = new KalmanSmoother();
KalmanSmootherResult result = smoother.Smooth(
    measurements,                       // IReadOnlyList<VectorN>
    initialState: new VectorN(new[] { 0.0 }),
    initialCovariance: new Matrix(new[,] { { 1.0 } }),
    F, Q, H, R);

VectorN[] smoothed  = result.SmoothedStates;        // xₖ|ₙ
Matrix[]  smoothedP = result.SmoothedCovariances;    // Pₖ|ₙ (≤ filtered)
VectorN[] filtered  = result.FilteredStates;        // xₖ|ₖ for comparison
```
