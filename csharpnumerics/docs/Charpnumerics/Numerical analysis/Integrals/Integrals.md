---
sidebar_label: "∫ Integrals"
---

## ∫ Integrals

$$\int_a^b f(x)\,dx$$

**Trapezoidal Rule**

```csharp
Func<double, double> f = x => Math.Sin(x);
double integral = f.Integrate(0, Math.PI);
```

**Simpson's 1/3 Rule** — O(h⁴) accuracy

```csharp
double result = f.IntegrateSimpson(0, Math.PI, subintervals: 200);
```

**Simpson's 3/8 Rule** — cubic interpolation, O(h⁴)

```csharp
double result = f.IntegrateSimpson38(0, Math.PI, subintervals: 999);
```

**Gauss-Legendre Quadrature** — 5-point per subinterval, very high accuracy

```csharp
double result = f.IntegrateGaussLegendre(0, Math.PI, subintervals: 10);
```

**Romberg Integration** — Richardson extrapolation for rapid convergence

```csharp
double result = f.IntegrateRomberg(0, Math.PI, maxLevel: 10);
```

**Adaptive Simpson** — recursive subdivision with error control

```csharp
double result = f.IntegrateAdaptive(0, Math.PI, tolerance: 1e-12);
```

---

## 🎲 Monte Carlo Integration

$$\iint_D f(x,y)\,dA, \quad \iiint_V f(x,y,z)\,dV$$

**Double integral**

```csharp
Func<(double x, double y), double> func2d = p => p.x * p.y;
double result2d = func2d.Integrate((0, 1), (0, 1));
```

**Triple integral**

```csharp
Func<Vector, double> func3d = v => v.x + v.y + v.z;
double result3d = func3d.Integrate(new Vector(-2, -2, -2), new Vector(2, 2, 2));
```

---

## 📈 Series / Time Series Integration

```csharp
List<TimeSerie> ts = ...;
double total = ts.Integrate();
double bounded = ts.Integrate(startDate, endDate);
```
