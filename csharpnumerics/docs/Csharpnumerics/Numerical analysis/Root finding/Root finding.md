---
sidebar_label: "🫚 Root Finding"
---

## 🎯 Root Finding

Solvers for $f(x) = 0$, in `CSharpNumerics.Numerics.RootFinding`. Every method returns a `RootResult` that says whether it actually converged — a failed run gives back its best estimate, never a silent `NaN`.

```csharp
using CSharpNumerics.Numerics.RootFinding;

Func<double, double> f = x => Math.Cos(x) - x;

// Brent's method — the default when you can bracket the root.
// Always converges, and nearly as fast as Newton.
var result = f.FindRoot(0, 1);
if (result.Converged)
{
    double root = result.Value;        // 0.7390851332151607
    int iterations = result.Iterations;
    double residual = result.Residual; // |f(root)|
}

// Or throw instead of branching:
double x = f.FindRoot(0, 1).EnsureConverged();
```

---

### 🧭 Choosing a Method

Pick the method to match what you know about the function:

| Method | Needs | Converges | Use when |
|--------|-------|-----------|----------|
| `RootFinder.Brent` | A bracket | Always | The default choice |
| `RootFinder.Bisection` | A bracket | Always, linearly | The function is nasty and speed does not matter |
| `RootFinder.Secant` | Two starting points | May diverge | No bracket, no derivative |
| `RootFinder.Newton` | One starting point | May diverge | A good guess, ideally with an analytic derivative |

```csharp
var bisection = RootFinder.Bisection(f, 0, 1);
var secant    = RootFinder.Secant(f, 0, 1);
var newton    = RootFinder.Newton(f, initialGuess: 0.5);

// An analytic derivative is both faster and more accurate than the
// finite-difference default.
var exact = RootFinder.Newton(f, x => -Math.Sin(x) - 1, 0.5);

// Tolerance and iteration budget are configurable on every method.
var tight = RootFinder.Brent(f, 0, 1, tolerance: 1e-15, maxIterations: 200);
```

Defaults are `tolerance = 1e-12` and `maxIterations = 100` (`RootFinder.DefaultTolerance`, `RootFinder.DefaultMaxIterations`).

**Newton's method** — $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$ — stops and reports failure where the derivative vanishes or the iterate stops being finite, rather than dividing into an infinity and iterating on `NaN`. **Bracketed methods** (Brent, bisection) throw `ArgumentException` if the interval does not contain a sign change.

---

### 📦 RootResult

| Property | Description |
|----------|-------------|
| `Value` | The approximate root — only meaningful when `Converged` is true |
| `Converged` | True if the tolerance was reached within the iteration budget |
| `Iterations` | Number of iterations actually performed |
| `Residual` | $\lvert f(\text{Value}) \rvert$ at the returned point |
| `Method` | Name of the method, e.g. `"Brent"` |
| `EnsureConverged()` | Returns `Value`, or throws `InvalidOperationException` if the run did not converge |

---

### ↩️ NewtonRaphson

The older `func.NewtonRaphson()` extension still works unchanged and now delegates to `RootFinder.Newton`, so it exits as soon as it converges instead of always running its full iteration budget.

```csharp
Func<double, double> func = x => Math.Pow(x, 2) - 4;
double root = func.NewtonRaphson(); // 2
```
