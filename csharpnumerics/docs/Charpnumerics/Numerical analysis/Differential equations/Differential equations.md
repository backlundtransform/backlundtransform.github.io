---
sidebar_label: "📐 Differential Equations"
---

## 📐 Differential Equations

Solve initial value problems of the form:

$$\frac{dy}{dt} = f(t, y), \quad y(t_0) = y_0$$

**Runge–Kutta (RK4)**

```csharp
Func<(double t, double y), double> f = v => Math.Tan(v.y) + 1;
var result = f.RungeKutta(1, 1.1, 0.025, 1);
```

**Euler Method**

```csharp
var result = f.EulerMetod(min: 0, max: 1, stepSize: 0.01, yInitial: 1);
```

**Trapezoidal Rule (ODE)**

```csharp
var result = f.TrapezoidalRule(min: 0, max: 1, stepSize: 0.01, yInitial: 1);
```

**Custom Butcher Tableau**

```csharp
var result = f.RungeKutta(min, max, stepSize, yInitial,
    rungeKuttaMatrix, weights, nodes);
```

---

## ⚙️ ODE System Solver

Solve systems $\mathbf{x}'(t) = A\mathbf{x}(t)$ via eigenvalue decomposition:

```csharp
var solutions = matrix.OdeSolver(new List<double> { 1, 0, 0 });
double x_t = solutions[0](t);
double y_t = solutions[1](t);
```