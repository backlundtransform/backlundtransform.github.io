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


## 🔁 Semi-Implicit (Symplectic) Euler

Stable for oscillatory systems. State is split as `[positions | velocities]`; velocities are updated first, then positions use the new velocities.

```csharp
// Simple harmonic oscillator: state = [x, v], dy/dt = [v, -x]
Func<(double t, VectorN y), VectorN> sho = v =>
    new VectorN([v.y[1], -v.y[0]]);

var y0 = new VectorN([1, 0]);
VectorN result = sho.SemiImplicitEuler(0, 100, 0.01, y0);

// Full trajectory
var traj = sho.SemiImplicitEulerTrajectory(0, 100, 0.01, y0);
```

## 🏎️ Velocity Verlet

$$O(dt²)$$ symplectic method with excellent energy conservation. For second-order ODEs — state is `[positions | velocities]`; the acceleration function returns only accelerations (half the state length).

```csharp
// Spring: acceleration = -x (depends on position only)
Func<(double t, VectorN y), VectorN> accel = v =>
    new VectorN([-v.y[0]]);

var y0 = new VectorN([1, 0]); // [position, velocity]
VectorN result = accel.VelocityVerlet(0, 100, 0.01, y0);

// Full trajectory
var traj = accel.VelocityVerletTrajectory(0, 20, 0.01, y0);
foreach (var (t, y) in traj)
{
    double energy = 0.5 * (y[0] * y[0] + y[1] * y[1]); // bounded
}
```

`double[]` convenience overloads are available for both — they delegate to `VectorN` internally.

---

## ⏱️ Time Stepping 

The extension methods above (`RungeKutta`, `EulerMethod`, `VelocityVerlet`, etc.) are functional and convenient for simple problems. The `ITimeStepper` interface provides a **class-based alternative** for advanced scenarios: adaptive step control, trajectory recording, per-step callbacks, and diagnostics.

**Available Steppers**

| Stepper | Class | Order | Step Size | Best For |
|---------|-------|-------|-----------|----------|
| Euler | `EulerStepper` | O(h) | Fixed | Quick prototyping, reference solutions |
| RK4 | `RK4Stepper` | O(h⁴) | Fixed | General-purpose, non-stiff problems |
| Dormand-Prince 4(5) | `AdaptiveRK45Stepper` | O(h⁴)/O(h⁵) | **Adaptive** | Automatic accuracy, varying timescales |
| Velocity Verlet | `VelocityVerletStepper` | O(h²) | Fixed | Symplectic, N-body, energy conservation |

**Result Object**

Every stepper returns a `TimeStepResult`:

| Property | Description |
|----------|-------------|
| `T` | Final time reached |
| `Y` | Final state vector |
| `Trajectory` | Full `(t, y)` history (if `recordTrajectory = true`) |
| `Steps` | Total accepted steps |
| `RejectedSteps` | Rejected steps (adaptive only) |
| `FunctionEvaluations` | Total rhs evaluations |
| `LastError` | Estimated local error at final step (adaptive only) |
| `LastStepSize` | Actual step size used at final step |

**Heat Equation (Method of Lines + RK4)**

```csharp
var grid = new Grid2D(50, 50, 0.1);
VectorN u = grid.Initialize((x, y) => Math.Exp(-(x * x + y * y)));

Func<double, VectorN, VectorN> rhs = (t, state) =>
    GridOperators.Laplacian2D(state, grid, BoundaryCondition.Dirichlet);

var stepper = new RK4Stepper();
var result = stepper.Solve(rhs, 0, 1.0, u, dt: 0.0001, recordTrajectory: true);

double[,] finalField = grid.ToArray(result.Y);

```

**Adaptive Step Control (Dormand-Prince)**

No manual `dt` tuning — the stepper finds the right step size automatically:

```csharp
Func<double, VectorN, VectorN> rhs = (t, state) =>
    GridOperators.Laplacian2D(state, grid, BoundaryCondition.Neumann);

var stepper = new AdaptiveRK45Stepper
{
    AbsoluteTolerance = 1e-8,
    RelativeTolerance = 1e-8
};

var result = stepper.Solve(rhs, 0, 10.0, u, dt: 0.01);

```

**Spring System (Velocity Verlet)**

Symplectic integration for oscillatory systems — state = `[positions | velocities]`:

```csharp
// Simple harmonic oscillator: x'' = -x
Func<double, VectorN, VectorN> sho = (t, y) =>
    new VectorN([y[1], -y[0]]);  // [velocity, acceleration]

var stepper = new VelocityVerletStepper();
var result = stepper.Solve(sho, 0, 100, new VectorN([1, 0]), dt: 0.01,
    recordTrajectory: true);

// Energy is conserved over long integrations
foreach (var (t, y) in result.Trajectory)
{
    double energy = 0.5 * (y[0] * y[0] + y[1] * y[1]);
    // energy ≈ 0.5 throughout
}
```

**Per-Step Callback**

Monitor or log intermediate states without storing the full trajectory:

```csharp
double maxTemp = 0;
var stepper = new RK4Stepper();
var result = stepper.Solve(rhs, 0, 10.0, u, dt: 0.001,
    onStep: (t, y) =>
    {
        double peak = y.Values.Max();
        if (peak > maxTemp) maxTemp = peak;
    });


```

---

## ⚙️ ODE System Solver

Solve systems $\mathbf{x}'(t) = A\mathbf{x}(t)$ via eigenvalue decomposition:

```csharp
var solutions = matrix.OdeSolver(new List<double> { 1, 0, 0 });
double x_t = solutions[0](t);
double y_t = solutions[1](t);
```