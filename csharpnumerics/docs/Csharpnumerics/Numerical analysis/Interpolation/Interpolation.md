---
sidebar_label: "🔗 Interpolation"
---

CSharpNumerics provides a unified interpolation API supporting linear and logarithmic scales:

* **Linear**
* **Log–Log** (log x, log y)
* **Lin–Log** (lin x, log y)
* **Log–Lin** (log x, lin y)

All methods are routed through one central function.


```csharp
public enum InterpolationType
{
    Linear,
    Logarithmic,   // log–log
    LogLin,
    LinLog
}
```

```csharp
double Interpolate<T>(
    this IEnumerable<T> source,
    Func<T, (double x, double y)> selector,
    double index,
    InterpolationType type);
```

Example:

```csharp
var data = new List<Serie>
{
    new Serie { Index = 1, Value = 10 },
    new Serie { Index = 10, Value = 100 }
};

double y = data.Interpolate(
    p => (p.Index, p.Value),
    3.5,
    InterpolationType.Linear
);
```

---

## 📐 Polynomial Interpolation

Passes a single polynomial of degree $N-1$ through all $N$ data points.

```csharp
double[] x = { 0, 1, 2, 3 };
double[] y = { 1, 2, 0, 5 };
var poly = new PolynomialInterpolation(x, y);

double val  = poly.Evaluate(1.5);             // Lagrange basis form
double val2 = poly.EvaluateNewton(1.5);       // Newton divided-difference
var (val3, err) = poly.EvaluateNeville(1.5);  // Neville with error estimate

// Or via the extension method:
double val4 = data.Interpolate(p => (p.Index, p.Value), 1.5, InterpolationType.Polynomial);
```

---

## 🌊 Cubic Spline Interpolation

Piecewise cubic polynomials with $C^2$ continuity. Three boundary conditions:

| Boundary | Description |
|----------|-------------|
| `Natural` | $S''(x_0) = S''(x_n) = 0$ (free ends) |
| `Clamped` | First derivative specified at endpoints |
| `NotAKnot` | Third derivative continuous at second & second-to-last knot |

```csharp
double[] x = { 0, 1, 2, 3, 4 };
double[] y = { 0, 1, 0, 1, 0 };

var spline = new CubicSplineInterpolation(x, y);                       // Natural
var clamped = new CubicSplineInterpolation(x, y, SplineBoundary.Clamped, 1.0, -1.0);
var nak     = new CubicSplineInterpolation(x, y, SplineBoundary.NotAKnot);

double val   = spline.Evaluate(2.5);
double dydx  = spline.Derivative(2.5);         // first derivative
double d2y   = spline.SecondDerivative(2.5);    // curvature

// Or via extension method:
double val2 = data.Interpolate(p => (p.Index, p.Value), 2.5, InterpolationType.CubicSpline);
```

---

## 🔢 Rational Interpolation

Ratio of two polynomials — handles poles and near-singularities better than polynomials.

```csharp
double[] x = { 0, 1, 2, 3, 4 };
double[] y = { 1.0, 0.5, 0.333, 0.25, 0.2 };   // ≈ 1/(1+x)
var rat = new RationalInterpolation(x, y);

var (val, err) = rat.Evaluate(1.5);              // Bulirsch–Stoer + error estimate
double val2 = rat.EvaluateFloaterHormann(1.5);   // barycentric, guaranteed pole-free
```

---

## 🎵 Trigonometric Interpolation

Best for periodic functions. Builds a trigonometric polynomial from the data.

```csharp
int N = 16;
double[] x = new double[N], y = new double[N];
for (int i = 0; i < N; i++)
{
    x[i] = 2 * Math.PI * i / N;
    y[i] = Math.Sin(x[i]) + 0.5 * Math.Cos(2 * x[i]);
}

var trig = new TrigonometricInterpolation(x, y, period: 2 * Math.PI);
double val  = trig.Evaluate(Math.PI / 3);
double dydx = trig.Derivative(Math.PI / 3);

// Fourier coefficients
double[] a = trig.CosineCoefficients;   // a_0, a_1, ..., a_M
double[] b = trig.SineCoefficients;     // b_0, b_1, ..., b_M

// Or via extension method:
double val2 = data.Interpolate(p => (p.Index, p.Value), 1.5, InterpolationType.Trigonometric);
```

---

## 🌐 Multivariate Interpolation

For scattered data in multiple dimensions.

**Inverse Distance Weighting (IDW / Shepard)**

```csharp
double[][] points = {
    new[] { 0.0, 0.0 }, new[] { 1.0, 0.0 },
    new[] { 0.0, 1.0 }, new[] { 1.0, 1.0 }, new[] { 0.5, 0.5 }
};
double[] values = points.Select(p => p[0] * p[0] + p[1] * p[1]).ToArray();

var interp = new MultivariateInterpolation(points, values);
double val = interp.EvaluateIDW(new[] { 0.25, 0.75 }, power: 2);
```

**Radial Basis Functions (RBF)**

```csharp
double val = interp.EvaluateRBF(new[] { 0.25, 0.75 }, RbfKernel.Gaussian);
```

| Kernel | Formula |
|--------|---------|
| `Gaussian` | $\phi(r) = e^{-(r/\varepsilon)^2}$ |
| `Multiquadric` | $\phi(r) = \sqrt{1 + (r/\varepsilon)^2}$ |
| `InverseMultiquadric` | $\phi(r) = 1/\sqrt{1 + (r/\varepsilon)^2}$ |
| `ThinPlateSpline` | $\phi(r) = r^2 \ln(r)$ |
| `Cubic` | $\phi(r) = r^3$ |

**Bilinear / Trilinear (Regular Grids)**

```csharp
double val2d = MultivariateInterpolation.Bilinear(xGrid, yGrid, gridValues, xi, yi);
double val3d = MultivariateInterpolation.Trilinear(xGrid, yGrid, zGrid, gridValues, xi, yi, zi);
```
