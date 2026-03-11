---
sidebar_label: "∂ Calculus"
---

## 🔎 Limits

$$\lim_{x \to a^-} f(x), \quad \lim_{x \to a^+} f(x), \quad \lim_{x \to a} f(x)$$

```csharp
Func<double, double> f = x => Math.Sin(x) / x;

double left  = f.LeftLimit(0);   // f(0 - ε)
double right = f.RightLimit(0);  // f(0 + ε)
double limit = f.Limit(0);       // two-sided: returns value if left == right, else NaN
```

---

## Δ Derivative

$$\frac{d}{dx}f(x), \quad (f \cdot g)', \quad \frac{\partial f}{\partial x_i}$$

```csharp
Func<double, double> f = x => Math.Pow(x, 2);
Func<double, double> g = x => 4 * x - 3;
var result = f.Derivate(g, 1);
```

Supports **Chain**, **Product**, and **Quotient** rules via:

```csharp
var result = f.Derivate(g, Numerics.Enums.DerivateOperator.Product);
```

Multiple variables:

```csharp
Func<double[], double> func = vars => vars[0] * vars[1];
var dfdx = func.Derivate(new double[] { 2, 3 }, index: 0);
```

Or with vectors:

```csharp
Func<Vector, double> func = v => v.x * v.y;
var dfdx = func.Derivate(new Vector(2, 3, 0), Cartesian.X);
```

Derivate series:

```csharp
Func<double, double> displacement = t => 9.81 * Math.Pow(t, 2) / 2;
var velocity = displacement.GetSeries(0, 10, 1000).Derivate();
```