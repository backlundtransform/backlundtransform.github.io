---
sidebar_label: "🌊 Waves"
---

The `Physics.Waves` namespace provides PDE-based wave simulation using **Method of Lines** (spatial discretisation via `GridOperators`, temporal integration via `ITimeStepper`), as well as analytical tools for superposition, wave packets, and Fourier analysis. All wave field classes implement `IWaveField`.

**Namespace:** `CSharpNumerics.Physics.Waves`

## 🔌 IWaveField Interface

```csharp
public interface IWaveField
{
    double Time { get; }
    double TotalEnergy { get; }
    void Step(double dt);
    void Reset();
    List<Serie> Snapshot();
}
```

## 🧱 BoundaryType

Wave-specific boundary conditions that map internally to the finite-difference `BoundaryCondition` enum:

```csharp
public enum BoundaryType { Fixed, Free, Periodic, Absorbing }
```

## 〰️ WaveEquation1D

Solves the 1D wave equation $\frac{\partial^2 u}{\partial t^2} = c^2 \frac{\partial^2 u}{\partial x^2}$ via MOL.

State vector: $\mathbf{y} = [u_0 \dots u_{N-1} \mid v_0 \dots v_{N-1}]$. Default stepper: Velocity Verlet (symplectic).

**Create and set initial conditions**

```csharp
using CSharpNumerics.Physics.Waves;

int n = 201;
double dx = 0.005;  // 1 m domain
double c = 340.0;   // speed of sound in air

var wave = new WaveEquation1D(n, dx, c, BoundaryType.Fixed);

// Pluck the first mode
double L = wave.Length;
wave.SetInitialCondition(
    u0: x => Math.Sin(Math.PI * x / L),
    v0: null);
```

**Simulation**

```csharp
// Single step
wave.Step(dt: 0.00001);

// Run to end time, optionally recording trajectory
TimeStepResult result = wave.Simulate(tEnd: 0.01, dt: 0.00001, recordTrajectory: true);

wave.Reset();  // restore initial conditions
```

**Properties and diagnostics**

```csharp
double t  = wave.Time;          // current simulation time
double E  = wave.TotalEnergy;   // conserved for undamped wave
double cfl = wave.CFL(dt);      // Courant number c·dt/dx — must be ≤ 1

double u3 = wave.Displacement(3);  // u at grid point 3
double v3 = wave.Velocity(3);      // ∂u/∂t at grid point 3
```

**Snapshots & field output**

```csharp
// Current displacement as (x, u) pairs
List<Serie> snap = wave.Snapshot();

// Full u(x,t) matrix — rows = spatial, columns = time steps
Matrix field = wave.SpaceTimeField(tEnd: 0.05, dt: 0.0001);

// Energy density at each grid point
List<Serie> eDensity = wave.EnergyDensity();
```

**Frequency analysis & standing wave reference**

```csharp
// FFT of u(x_i, t) at a single spatial point
List<Serie> spectrum = wave.FrequencyContent(spatialIndex: 50, tEnd: 0.1, dt: 0.0001);

// Analytic standing-wave mode shape: sin(nπx/L)
List<Serie> mode = wave.StandingWaveMode(modeNumber: 1);

// Analytic frequency: f_n = n·c/(2L)
double f1 = wave.StandingWaveFrequency(modeNumber: 1);
```

## 🌐 WaveEquation2D

Solves $\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u$ on a `Grid2D` using the 5-point Laplacian stencil.

```csharp
using CSharpNumerics.Numerics.FiniteDifference;

var grid = new Grid2D(nx: 51, ny: 51, d: 0.02);  // 1 m × 1 m
var wave2d = new WaveEquation2D(grid, c: 1.0, BoundaryType.Fixed);

double Lx = (grid.Nx - 1) * grid.Dx;
double Ly = (grid.Ny - 1) * grid.Dy;

wave2d.SetInitialCondition(
    u0: (x, y) => Math.Sin(Math.PI * x / Lx) * Math.Sin(Math.PI * y / Ly));

wave2d.Simulate(tEnd: 0.5, dt: 0.005);

// 2D snapshot as array[ix, iy]
double[,] snap = wave2d.SnapshotArray();

// Energy density per cell
double[,] eDensity = wave2d.EnergyDensityArray();

double E = wave2d.TotalEnergy;
```

## 🎶 WaveSuperposition

Analytical superposition of travelling sinusoidal waves — no PDE solver needed:

$$u(x,t) = \sum_i A_i \sin(\omega_i t - k_i x + \varphi_i)$$

```csharp
var ws = new WaveSuperposition();

// Two counter-propagating waves → standing wave
ws.AddHarmonic(amplitude: 1, angularFrequency: 10, waveNumber: 5);
ws.AddHarmonic(amplitude: 1, angularFrequency: 10, waveNumber: -5);

double u = ws.Evaluate(x: 0.5, t: 0.1);

// Field at many x-values
double[] xVals = Enumerable.Range(0, 200).Select(i => i * 0.01).ToArray();
List<Serie> field = ws.EvaluateRange(xVals, t: 0.1);

// Beat frequency for two-component superposition
double fBeat = ws.BeatFrequency();  // |ω₁ − ω₂| / 2π

// Spatial Fourier coefficients via FFT
List<Serie> coeffs = ws.FourierCoefficients(xVals, t: 0);
```

## 📦 WavePacket

FFT-based Gaussian wave packet propagation with arbitrary dispersion relation $\omega(k)$:

```csharp
int nPts = 512;
double dxp = 0.05;
double[] x = Enumerable.Range(0, nPts).Select(i => i * dxp).ToArray();

// Non-dispersive: ω = c·k → packet translates without deformation
var packet = new WavePacket(x, centerK: 10.0, sigma: 2.0,
    dispersion: k => 3.0 * k);

double vp = packet.PhaseVelocity;   // ω(k₀)/k₀ = c
double vg = packet.GroupVelocity;   // dω/dk = c  (same for linear)

// Propagate to time t and get displacement
List<Serie> field = packet.Propagate(t: 1.0);

// Measure spatial width (std dev of |u|²)
double w0 = packet.Width(0);
double w1 = packet.Width(1.0);

// Dispersive example: ω = k² → packet spreads
var dispersive = new WavePacket(x, centerK: 10.0, sigma: 2.0,
    dispersion: k => k * k);

double rate = dispersive.SpreadRate(t1: 0, t2: 2.0);
```

## 🔇 DampedDrivenWaveEquation1D

Solves the damped/driven 1D wave equation:

$$\frac{\partial^2 u}{\partial t^2} + 2\alpha \frac{\partial u}{\partial t} = c^2 \frac{\partial^2 u}{\partial x^2} + S(x, t)$$

When $\alpha = 0$ and $S = 0$ this reduces to the standard wave equation. Default stepper: RK4 (appropriate for dissipative systems).

**Damped wave — energy decay**

```csharp
var damped = new DampedDrivenWaveEquation1D(
    n: 101, dx: 0.01, c: 1.0,
    alpha: 5.0,          // damping coefficient
    boundaryType: BoundaryType.Fixed);

double L = (101 - 1) * 0.01;
damped.SetInitialCondition(u0: x => Math.Sin(Math.PI * x / L));

double e0 = damped.TotalEnergy;
damped.Simulate(tEnd: 1.0, dt: 0.005);
double eFinal = damped.TotalEnergy;   // eFinal << e0
```

**Driven wave — source injection**

```csharp
// Point-like sinusoidal source at the centre
Func<double, double, double> source = (x, t) =>
{
    double xc = 0.5;
    return 10.0 * Math.Sin(20 * t) * Math.Exp(-100 * (x - xc) * (x - xc));
};

var driven = new DampedDrivenWaveEquation1D(
    n: 101, dx: 0.01, c: 1.0,
    alpha: 0,
    source: source);

driven.SetInitialCondition();  // start from rest
driven.Simulate(tEnd: 2.0, dt: 0.005);
// Energy grows as the source injects power
```

**Damped + driven — steady state**

```csharp
var system = new DampedDrivenWaveEquation1D(
    n: 101, dx: 0.01, c: 1.0,
    alpha: 2.0,
    source: source);

system.SetInitialCondition();
system.Simulate(tEnd: 10.0, dt: 0.005);
// Energy reaches bounded steady state — damping balances input
```

**Replace source at runtime**

```csharp
system.SetSource((x, t) => 5.0 * Math.Cos(30 * t) * Math.Exp(-200 * x * x));
```
