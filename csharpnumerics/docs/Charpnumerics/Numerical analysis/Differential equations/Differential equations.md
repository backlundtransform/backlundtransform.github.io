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

## 🧭 Vector ODE (3D)

Solve $\vec{y}\,' = f(t, \vec{y})$ where $\vec{y}$ is a `Vector`:

```csharp
// Exponential decay in 3D
Func<(double t, Vector y), Vector> decay = v => -1.0 * v.y;
Vector result = decay.RungeKutta(0, 1, 0.001, new Vector(1, 2, 3));

// Euler method
Vector result2 = decay.EulerMethod(0, 1, 0.001, new Vector(1, 2, 3));

// Full trajectory
var trajectory = decay.RungeKuttaTrajectory(0, 1, 0.01, new Vector(1, 2, 3));
foreach (var (t, y) in trajectory) { /* ... */ }
```

## 📊 System ODE (VectorN)

Solve arbitrary-dimensional systems for dynamics using `VectorN`:

$$\mathbf{y}'(t) = f(t, \mathbf{y}), \quad \mathbf{y} \in \mathbb{R}^n$$

```csharp
// Free fall: state = [x, y, z, vx, vy, vz]
double g = 9.80665;
Func<(double t, VectorN y), VectorN> dynamics = v =>
    new VectorN([v.y[3], v.y[4], v.y[5], 0, 0, -g]);

var y0 = new VectorN([0, 0, 0, 10, 0, 10]);
VectorN result = dynamics.RungeKutta(0, 2, 0.001, y0);

// Euler method
VectorN result2 = dynamics.EulerMethod(0, 2, 0.001, y0);

// Full trajectory
var orbit = dynamics.RungeKuttaTrajectory(0, period, 1.0, y0);
double energy = orbit.Last().y.Dot(orbit.Last().y); // use VectorN operations
```

`double[]` convenience overloads are also available — they delegate to `VectorN` internally.

---

## ⚙️ ODE System Solver

Solve systems $\mathbf{x}'(t) = A\mathbf{x}(t)$ via eigenvalue decomposition:

```csharp
var solutions = matrix.OdeSolver(new List<double> { 1, 0, 0 });
double x_t = solutions[0](t);
double y_t = solutions[1](t);
```