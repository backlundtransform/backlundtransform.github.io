---
sidebar_label: "🔲 Finite Difference"
---


Discretize spatial domains and solve time-dependent PDEs by converting them to ODE systems. The spatial state lives in a `VectorN`, discrete operators produce the right-hand side, and the existing ODE solvers (RK4, Euler, Verlet) handle time integration.

---

## 📐 Grid2D

A uniform 2D grid that packs/unpacks between `double[,]` and flat `VectorN` (row-major).

```csharp
var grid = new Grid2D(nx: 50, ny: 50, dx: 0.1, dy: 0.1);

// Initialize from a function (cell centres)
var u0 = grid.Initialize((x, y) => Math.Exp(-(x * x + y * y)));

// Pack/unpack
double[,] field = grid.ToArray(u0);
VectorN v = grid.ToVector(field);

// Index helpers
int flat = grid.Index(ix: 10, iy: 20);
var (ix, iy) = grid.Index2D(flat);
```

---

## 🧱 Boundary Conditions

All operators accept a `BoundaryCondition` parameter:

| Type | Description |
|------|-------------|
| `Dirichlet` | u = 0 outside domain |
| `Neumann` | ∂u/∂n = 0 (zero-flux, mirrors boundary cell) |
| `Periodic` | Domain wraps around |

---

## ⚙️ Discrete Operators

**Laplacian** — $\nabla^2 u$ (3-point stencil in 1D, 5-point in 2D)

```csharp
var lap1d = GridOperators.Laplacian1D(u, dx, BoundaryCondition.Dirichlet);
var lap2d = GridOperators.Laplacian2D(u, grid, BoundaryCondition.Neumann);
```

**Gradient** — $\frac{\partial u}{\partial x}$ (central differences)

```csharp
var grad1d = GridOperators.Gradient1D(u, dx, BoundaryCondition.Periodic);
var (dux, duy) = GridOperators.Gradient2D(u, grid);
```

**Divergence** — $\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y}$

```csharp
var div = GridOperators.Divergence2D(fx, fy, grid);
```

**Advection** — $\mathbf{v} \cdot \nabla u$ (first-order upwind for stability)

```csharp
var adv = GridOperators.Advection2D(u, vx, vy, grid);
```

---

## 🔥 Examples

**2D Heat Equation**

$$\frac{\partial u}{\partial t} = \alpha \nabla^2 u$$

```csharp
double alpha = 0.01;
var grid = new Grid2D(50, 50, 0.1);

// Hot spot in the centre
var u0 = grid.Initialize((x, y) =>
    (x > 2.0 && x < 3.0 && y > 2.0 && y < 3.0) ? 100.0 : 0.0);

// RHS: spatial operator → feeds into standard ODE solver
Func<(double t, VectorN y), VectorN> rhs = args =>
    alpha * GridOperators.Laplacian2D(args.y, grid, BoundaryCondition.Dirichlet);

// Solve with existing RK4 — no new solver needed
var trajectory = rhs.RungeKuttaTrajectory(0, 10.0, 0.005, u0);

// Each frame: trajectory[i].y → grid.ToArray() → 2D heatmap
double[,] finalState = grid.ToArray(trajectory.Last().y);
```

**Advection-Diffusion**

$$\frac{\partial u}{\partial t} = \alpha \nabla^2 u - \mathbf{v} \cdot \nabla u$$

```csharp
Func<(double t, VectorN y), VectorN> rhs = args =>
    alpha * GridOperators.Laplacian2D(args.y, grid)
    - GridOperators.Advection2D(args.y, vx, vy, grid);

var result = rhs.RungeKutta(0, 5.0, 0.001, u0);
```

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

