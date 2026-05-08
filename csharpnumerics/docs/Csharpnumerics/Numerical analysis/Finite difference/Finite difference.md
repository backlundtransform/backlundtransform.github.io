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

**Biharmonic (4th derivative)** — $\frac{d^4 u}{dx^4}$ (5-point central stencil, for Euler–Bernoulli beam equation)

```csharp
var d4u = GridOperators.Biharmonic1D(u, dx, BoundaryCondition.Neumann);
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

---

## 🧮 Poisson Solver (Gauss-Seidel)

Iterative solver for $\nabla^2 u = f$ on a `Grid2D` with arbitrary Dirichlet boundary masks:

```csharp
// Solve ∇²φ = rhs on a 50×50 grid with Dirichlet BCs
var grid = new Grid2D(50, 50, 0.02);
var rhs = grid.Zeros();                      // source term

// Mark boundary cells
bool[] mask = new bool[grid.Length];
double[] bcValues = new double[grid.Length];
for (int iy = 0; iy < 50; iy++)
{
    mask[grid.Index(0, iy)] = true;           // left = 0 V
    mask[grid.Index(49, iy)] = true;          // right = 100 V
    bcValues[grid.Index(49, iy)] = 100.0;
}

var (solution, iterations) = GridOperators.SolvePoisson2D(
    rhs, grid, mask, bcValues,
    tolerance: 1e-8,
    maxIterations: 20000);

// solution is a VectorN, unpack to 2D:
double[,] phi = grid.ToArray(solution);
```

---

## 📦 Grid3D — 3D Finite Difference

Structured 3D grid with row-major indexing (ix fastest, then iy, then iz):

```csharp
var grid = new Grid3D(nx: 20, ny: 20, nz: 10, dx: 0.5, dy: 0.5, dz: 0.5);

int flat = grid.Index(5, 10, 3);        // (ix, iy, iz) → flat index
var (ix, iy, iz) = grid.Index3D(flat);   // flat → (ix, iy, iz)

// Initialize from function
VectorN u = grid.Initialize((x, y, z) => x * x + y * y + z * z);

// Pack / unpack between flat VectorN and 3D array
double[,,] arr = grid.ToArray(u);
VectorN v = grid.ToVector(arr);
```

---

## ⚙️ 3D Discrete Operators

| Operator | Method | Description |
|----------|--------|-------------|
| Laplacian | `GridOperators3D.Laplacian3D(u, grid, bc)` | 7-point stencil |
| Gradient | `GridOperators3D.Gradient3D(u, grid, bc)` | Central differences |
| Divergence | `GridOperators3D.Divergence3D(fx, fy, fz, grid, bc)` | Divergence of vector field |
| Advection | `GridOperators3D.Advection3D(u, vx, vy, vz, grid, bc)` | First-order upwind |
| Poisson | `GridOperators3D.SolvePoisson3D(rhs, grid, mask, vals)` | Gauss-Seidel iterative |

```csharp
// Laplacian of a quadratic field (interior cells ≈ 6.0)
var u = grid.Initialize((x, y, z) => x * x + y * y + z * z);
var lap = GridOperators3D.Laplacian3D(u, grid, BoundaryCondition.Dirichlet);
```

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

