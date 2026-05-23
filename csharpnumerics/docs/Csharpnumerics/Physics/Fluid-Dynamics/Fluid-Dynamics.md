---
sidebar_label: "💧 Fluid Dynamics"
---

The `FluidExtensions` class bridges `VectorField` (∇·, ∇×) and `ScalarField` (∇, ∇²) to classical fluid dynamics — Navier–Stokes equations, Bernoulli's principle, continuity, vorticity, drag/lift, dimensionless numbers, viscous pipe flow, and hydrostatics.

**Namespace:** `CSharpNumerics.Physics.FluidDynamics`

## 🌀 Navier–Stokes Equations (Incompressible)

$$\rho\!\left(\frac{\partial \mathbf{v}}{\partial t} + (\mathbf{v}\cdot\nabla)\mathbf{v}\right) = -\nabla p + \mu\nabla^2\mathbf{v} + \mathbf{f}, \qquad \nabla\cdot\mathbf{v} = 0$$

Individual terms and the full residual:

```csharp
var velocity = new VectorField(
    r => -r.y, r => r.x, r => 0);  // rigid-body rotation
var pressure = new ScalarField(
    r => 0.5 * 1000 * (r.x * r.x + r.y * r.y));
var point = (1.0, 0.0, 0.0);

// Convective acceleration: (v·∇)v
Vector conv = velocity.ConvectiveAcceleration(point);

// Viscous term: μ∇²v
Vector visc = velocity.ViscousTerm(dynamicViscosity: 1e-3, point);

// Pressure gradient force: −∇p
Vector gradP = pressure.PressureGradientForce(point);

// Full residual: ∂v/∂t = (−∇p + μ∇²v + f)/ρ − (v·∇)v
// For steady-state flow this should be ≈ 0
Vector residual = velocity.NavierStokesResidual(
    pressure, density: 1000, dynamicViscosity: 1e-3, point);

// With body force (e.g. gravity)
Vector residualG = velocity.NavierStokesResidual(
    pressure, density: 1000, dynamicViscosity: 1e-3, point,
    bodyForce: new Vector(0, 0, -9810));

// Incompressibility check: ∇·v = 0
double divV = velocity.IncompressibilityResidual(point);  // should be ≈ 0
```

## 🏛️ Euler Equations (Inviscid Flow)

Navier–Stokes with $\mu = 0$:

```csharp
Vector euler = velocity.EulerEquationResidual(
    pressure, density: 1000, point);

// With body force
Vector eulerG = velocity.EulerEquationResidual(
    pressure, density: 1000, point,
    bodyForce: new Vector(0, 0, -9810));
```

## ⚖️ Bernoulli's Principle

$$p + \tfrac{1}{2}\rho v^2 + \rho g h = \text{const}$$

Along a streamline for steady, inviscid, incompressible flow:

```csharp
// Bernoulli constant
double B = 101325.0.BernoulliConstant(density: 1000, velocity: 5.0, height: 10);

// Pressure at a second point
double p2 = 101325.0.BernoulliPressure(
    density: 1000, v1: 2.0, v2: 8.0, h1: 0, h2: 3.0);

// Dynamic pressure: q = ½ρv²
double q = 1.225.DynamicPressure(speed: 50);

// Stagnation (total) pressure: p₀ = p + ½ρv²
double p0 = 101325.0.StagnationPressure(density: 1.225, speed: 50);
```

## 🔄 Continuity Equation

$$\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\mathbf{v}) = 0$$

```csharp
// Mass flux as a vector field: ρv (constant density)
VectorField massFlux = velocity.MassFlux(density: 1000);

// Mass flux with spatially varying density
var rhoField = new ScalarField(r => 1000 + 10 * r.x);
VectorField massFlux2 = velocity.MassFlux(rhoField);

// Continuity residual: ∇·(ρv) — should be 0 for incompressible flow
double cont = velocity.ContinuityResidual(density: 1000, point);

// Volume flow rate: Q = A·v
double Q = 0.01.VolumeFlowRate(speed: 3.0);   // 0.03 m³/s

// Speed from continuity: A₁v₁ = A₂v₂
double v2 = 0.01.ContinuitySpeed(speed1: 3.0, area2: 0.005);  // 6.0 m/s
```

## 🌪️ Vorticity & Circulation

$$\boldsymbol{\omega} = \nabla\times\mathbf{v}$$

```csharp
// Vorticity: ω = ∇×v
Vector omega = velocity.Vorticity(point);

// Enstrophy density: ½|ω|²
double enstrophy = velocity.Enstrophy(point);

// Helicity density: v·ω
double helicity = velocity.HelicityDensity(point);
```

## 🌊 Stream Function (2-D)

For incompressible 2-D flow, $v_x = \partial\psi/\partial y$, $v_y = -\partial\psi/\partial x$:

```csharp
// Create velocity field from a stream function
var psi = new ScalarField(r => r.x * r.y);  // ψ = xy → saddle flow
VectorField v = psi.VelocityFromStreamFunction();
// vx = ∂ψ/∂y = x,  vy = −∂ψ/∂x = −y → strain flow

// The resulting field is automatically divergence-free
double div = v.Divergence((1, 1, 0));  // ≈ 0
```

## 🪂 Drag & Lift

```csharp
// Drag force: F_D = ½ρv²C_D A
double drag = 0.47.DragForce(density: 1.225, speed: 30, referenceArea: 0.01);

// Lift force: F_L = ½ρv²C_L A
double lift = 1.2.LiftForce(density: 1.225, speed: 60, referenceArea: 20);

// Terminal velocity: v_t = √(2mg / (ρC_D A))
double vTerm = 0.5.TerminalVelocity(
    dragCoefficient: 0.47, density: 1.225, referenceArea: 0.01);
```

## 🔢 Dimensionless Numbers

```csharp
// Reynolds number: Re = ρvL/μ
double Re = 1000.0.ReynoldsNumber(speed: 2.0, characteristicLength: 0.1,
    dynamicViscosity: 1e-3);  // Re = 200 000

// Mach number: Ma = v/c (defaults to speed of sound in air)
double Ma = 300.0.MachNumber();           // Ma ≈ 0.875
double Ma2 = 1500.0.MachNumber(1480);    // in water

// Froude number: Fr = v/√(gL)
double Fr = 5.0.FroudeNumber(characteristicLength: 2.0);

// Strouhal number: St = fL/v
double St = 50.0.StrouhalNumber(characteristicLength: 0.1, speed: 25);

// Weber number: We = ρv²L/σ
double We = 1000.0.WeberNumber(speed: 1.0, characteristicLength: 0.001,
    surfaceTension: 0.072);
```

## 🚰 Viscous / Pipe Flow

**Hagen–Poiseuille** flow in circular pipes:

```csharp
// Volume flow rate: Q = πR⁴ΔP / (8μL)
double Q = 0.005.PoiseuilleFlowRate(
    pressureDrop: 1000, dynamicViscosity: 1e-3, length: 1.0);

// Velocity profile: v(r) = (ΔP/4μL)(R² − r²)
double vCenter = 0.005.PoiseuilleVelocity(
    pressureDrop: 1000, dynamicViscosity: 1e-3, length: 1.0,
    radialDistance: 0);    // maximum at centre

double vWall = 0.005.PoiseuilleVelocity(
    pressureDrop: 1000, dynamicViscosity: 1e-3, length: 1.0,
    radialDistance: 0.005);  // zero at wall
```

**Stokes drag** on a sphere in creeping flow:

```csharp
// F = 6πμRv
double F = 1e-3.StokesDrag(radius: 0.01, speed: 0.1);
```

## 🏊 Hydrostatics

```csharp
// Hydrostatic pressure at depth: p = p₀ + ρgh
double p = 10.0.HydrostaticPressure(density: 1025);  // 10 m depth in seawater

// Buoyant force (Archimedes): F_b = ρ_fluid · V · g
double Fb = 1025.0.BuoyantForce(displacedVolume: 0.5);  // ≈ 5025 N
```

## ⚡ Fluid Energy & Momentum

```csharp
var v = new Vector(3, 4, 0);

// Kinetic energy density: e_k = ½ρ|v|²
double ek = v.KineticEnergyDensity(density: 1000);  // 12 500 J/m³

// Momentum density: ρv
Vector mom = v.MomentumDensity(density: 1000);  // (3000, 4000, 0) kg/(m²·s)
```

## 🌀 Kármán Vortex Street

The `KarmanVortexStreetExtensions` class provides formulas for analysing periodic vortex shedding behind bluff bodies (cylinders). It covers the Roshko empirical Strouhal–Reynolds correlation, vortex street geometry (von Kármán stability ratio), regime classification, and the idealised wake-drag formula.

| Formula | Method | Description |
|---------|--------|-------------|
| $f = \mathrm{St} \cdot U / D$ | `VortexSheddingFrequency` | Shedding frequency from Strouhal number |
| $\mathrm{St} \approx 0.198(1 - 19.7/\mathrm{Re})$ | `RoshkoStrouhalNumber` | Roshko (1954) empirical correlation |
| $f = \mathrm{St}(\mathrm{Re}) \cdot U / D$ | `VortexSheddingFrequencyFromReynolds` | Shedding frequency from Reynolds number |
| $\mathrm{Ro} = f D^2 / \nu$ | `RoshkoNumber` | Roshko number (= St · Re) |
| $a = U / f$ | `VortexStreamwiseSpacing` | Longitudinal spacing between vortices |
| $h/a = \tfrac{1}{\pi}\mathrm{arccosh}(\sqrt{2})$ | `StableSpacingRatio` | Von Kármán stability criterion ≈ 0.281 |
| $h = (h/a) \cdot a$ | `VortexLateralSpacing` | Cross-stream spacing between rows |
| $U_v \approx 0.875\,U$ | `VortexConvectionVelocity` | Downstream vortex convection speed |
| — | `IsPeriodicSheddingRegime` | True if 47 < Re < 2×10⁵ |
| — | `CylinderWakeRegime` | Wake regime string from Re |
| $C_d$ (wake momentum) | `VortexStreetDragCoefficient` | Idealised wake-drag from vortex spacing |

```csharp
using CSharpNumerics.Physics.FluidDynamics;

// Roshko's Strouhal–Reynolds correlation for a circular cylinder
double Re = 1000;
double St = Re.RoshkoStrouhalNumber();           // ≈ 0.194

// Vortex shedding frequency
double U = 5.0, D = 0.05;
double f = St.VortexSheddingFrequency(U, D);     // ≈ 19.4 Hz

// Or directly from Reynolds number
double f2 = Re.VortexSheddingFrequencyFromReynolds(U, D);

// Roshko number Ro = f·D²/ν
double nu = 1e-5;
double Ro = f.RoshkoNumber(D, nu);

// Vortex street geometry
double a = U.VortexStreamwiseSpacing(f);         // streamwise spacing
double h = a.VortexLateralSpacing();             // lateral spacing ≈ 0.281·a

// Vortex convection velocity
double Uv = U.VortexConvectionVelocity();        // ≈ 0.875·U

// Regime classification
bool shedding = Re.IsPeriodicSheddingRegime();   // true
string regime = Re.CylinderWakeRegime();         // "Turbulent transition"

// Wake-drag coefficient from vortex street
double Cd = h.VortexStreetDragCoefficient(a, U, Uv, D);
```

## 🔬 Viscous Flow Model (`IViscousFlowModel`)

The `IViscousFlowModel` interface provides an abstraction for pipe flow physics used by simulation engines. The default implementation `ViscousFlowModel` encapsulates Hagen–Poiseuille physics.

| Method | Description |
|--------|-------------|
| `DrivingForce(dP/dx, ρ)` | Body force per unit mass $f = -(dP/dx) / \rho$ |
| `CylindricalDiffusion(ν, d²v/dr², dv/dr, r)` | $\nu [d^2v/dr^2 + (1/r)(dv/dr)]$ |
| `SymmetryAxisDiffusion(ν, d²v/dr²)` | $2\nu \, d^2v/dr^2$ (L'Hôpital at $r=0$) |

```csharp
using CSharpNumerics.Physics.FluidDynamics;
using CSharpNumerics.Physics.FluidDynamics.Interfaces;

IViscousFlowModel flow = new ViscousFlowModel();

double driving = flow.DrivingForce(pressureGradient: -100, density: 1000);
// 0.1 m/s² driving force

double diff = flow.CylindricalDiffusion(nu: 1e-6, d2vdr2: 50, dvdr: 10, r: 0.01);
```

## ✈️ Aerodynamics

The `Physics.FluidDynamics.Aerodynamics` namespace provides models for atmospheric flight — ISA atmosphere, airfoil lift/drag, control surfaces, and propulsion. These classes are used by the Game Engine's flight dynamics system but are pure physics with no engine dependency.

**🌍 Atmosphere Model (ISA)**

International Standard Atmosphere from sea level to 86 km with all seven standard layers.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Thermodynamic properties at any altitude
double T   = AtmosphereModel.Temperature(11000);      // 216.65 K (tropopause)
double P   = AtmosphereModel.Pressure(11000);         // ~22 632 Pa
double rho = AtmosphereModel.Density(5000);           // ~0.736 kg/m³
double a   = AtmosphereModel.SpeedOfSound(0);         // 340.29 m/s at sea level

// Transport properties (Sutherland's law)
double mu  = AtmosphereModel.DynamicViscosity(10000); // Pa·s
double nu  = AtmosphereModel.KinematicViscosity(10000); // m²/s

// Sea-level reference
double rho0 = AtmosphereModel.SeaLevelDensity;        // 1.225 kg/m³
```

| Layer | Altitude | Lapse Rate |
|-------|----------|------------|
| Troposphere | 0–11 km | −6.5 K/km |
| Tropopause | 11–20 km | Isothermal |
| Stratosphere 1 | 20–32 km | +1.0 K/km |
| Stratosphere 2 | 32–47 km | +2.8 K/km |
| Stratopause | 47–51 km | Isothermal |
| Mesosphere 1 | 51–71 km | −2.8 K/km |
| Mesosphere 2 | 71–86 km | −2.0 K/km |

**🪽 Airfoil Model**

Lift and drag coefficient lookup as a function of angle of attack (AoA). Supports built-in profiles and custom lookup tables with linear interpolation.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Built-in NACA symmetric airfoil (stall modelled)
var airfoil = AirfoilModel.NACASymmetric();
double cl = airfoil.Cl(5 * Math.PI / 180);    // Cl at 5° AoA
double cd = airfoil.Cd(5 * Math.PI / 180);    // Cd at 5° AoA
double ld = airfoil.LiftToDrag(0.05);         // L/D ratio

// Built-in flat plate model
var plate = AirfoilModel.FlatPlate(cd0: 0.02);

// Custom airfoil from wind-tunnel data
var custom = new AirfoilModel("MyWing",
    alphas: new[] { -0.3, -0.1, 0.0, 0.1, 0.2, 0.3 },
    cls:    new[] { -0.8, -0.3, 0.0, 0.3, 0.6, 0.4 },
    cds:    new[] { 0.05, 0.02, 0.01, 0.02, 0.04, 0.08 });
```

The NACA symmetric model includes post-stall lift reduction: Cl rises roughly linearly up to about 15° AoA and then drops as flow separates.

**🧭 NACA Airfoil Geometry**

Generate 2D surface coordinates for NACA 4-digit series airfoils. Uses cosine spacing for leading-edge resolution.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Generate NACA 0012 with 100 panels
var (x, y) = NACAGeometry.Generate("0012", numPanels: 100, chord: 1.0);

// Cambered airfoil (2% camber at 40% chord, 12% thickness)
var (xc, yc) = NACAGeometry.Generate("2412", numPanels: 80);

// Symmetric shorthand
var (xs, ys) = NACAGeometry.GenerateSymmetric(thicknessPercent: 15);

// Rotate for angle of attack (about quarter-chord)
double alpha = 5 * Math.PI / 180;
var (xr, yr) = NACAGeometry.Rotate(x, y, alpha);
```

| Parameter | Description |
|-----------|-------------|
| 1st digit | Max camber (% of chord) |
| 2nd digit | Location of max camber (tenths of chord) |
| 3rd–4th digits | Max thickness (% of chord) |

**🪶 Panel Method (Hess-Smith)**

Solves 2D incompressible **potential flow** around arbitrary closed bodies using the Hess-Smith panel method with constant-strength source panels and uniform vortex distribution.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Generate airfoil and solve
var (x, y) = NACAGeometry.Generate("0012", 100);
double alpha = 5 * Math.PI / 180;
var (xr, yr) = NACAGeometry.Rotate(x, y, alpha);

var result = PanelMethod.Solve(xr, yr, alpha, freestream: 1.0);

// Surface pressure coefficient
double[] cp = result.Cp;        // Cp on each panel
double cl   = result.Cl;        // Integrated lift coefficient
double cm   = result.Cm;        // Quarter-chord moment coefficient
double gamma = result.Gamma;    // Circulation strength

// Velocity field at arbitrary points
var queryX = new double[] { -2.0, 0.5, 2.0 };
var queryY = new double[] { 0.5, 0.5, 0.5 };
var (u, v) = PanelMethod.VelocityField(result, xr, yr, queryX, queryY);
```

Algorithm:

1. Discretize the airfoil into N flat panels with source strength $\sigma_i$ and uniform vortex $\gamma$.
2. Apply N no-penetration boundary conditions on panel midpoints.
3. Enforce the Kutta condition at the trailing edge for smooth flow departure.
4. Solve the $(N+1) \times (N+1)$ linear system for $\sigma_i$ and $\gamma$.
5. Compute tangential velocity $V_t$ and pressure coefficient $C_p = 1 - (V_t / U_\infty)^2$.

| Output | Description |
|--------|-------------|
| `Cp` | Surface pressure coefficient distribution |
| `Vt` | Surface tangential velocity |
| `Cl` | Lift coefficient (integrated) |
| `Cm` | Moment coefficient about quarter-chord |
| `Gamma` | Vortex strength (circulation) |
| `Sigma` | Source strengths per panel |

**🎛️ Control Surface**

Models the aerodynamic effect of elevator, aileron, rudder, and flap deflections.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Built-in presets
var elevator = ControlSurface.Elevator();
var aileron  = ControlSurface.Aileron();
var rudder   = ControlSurface.Rudder();

// Incremental coefficients from deflection
double dCl = elevator.DeltaCl(0.1);    // ΔCl = τ · Cl_δ · δ
double dCd = elevator.DeltaCd(0.1);    // ΔCd = Cd_δ · δ²

// Deflection is clamped to mechanical limits
double maxDefl = elevator.MaxDeflection;  // ~25° (0.4363 rad)
```

| Property | Description |
|----------|-------------|
| `ClDelta` | Lift sensitivity dCl/dδ (1/rad) |
| `CdDelta` | Drag sensitivity dCd/dδ² (1/rad²) |
| `Tau` | Flap effectiveness factor (0–1) |
| `Axis` | Primary control axis (Pitch/Roll/Yaw) |

**🚀 Propulsion Model**

Engine thrust as a function of throttle, altitude, and airspeed. Supports jet and propeller types.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Aerodynamics;

// Jet engine: T = T_max · throttle · (ρ/ρ₀)^n
var jet = PropulsionModel.Jet(maxThrustSeaLevel: 50000, engineCount: 2);
double thrust = jet.Thrust(throttle: 1.0, altitude: 0, airspeed: 100);  // ~100 kN

// Propeller engine: T = P·η/V, capped at static thrust
var prop = PropulsionModel.Propeller(maxPower: 200000, staticThrust: 5000);
double tProp = prop.Thrust(throttle: 0.8, altitude: 1000, airspeed: 50);

// Thrust decreases with altitude (density lapse)
double tHigh = jet.Thrust(1.0, 10000, 200);  // < thrust at sea level
```

## 🌪️ Turbulence Model (Smagorinsky SGS)

Subgrid-scale turbulence model for Large Eddy Simulation. Computes eddy viscosity from the local strain rate:
$\nu_t = (C_s \cdot \Delta)^2 \cdot |S|$

```csharp
using CSharpNumerics.Physics.FluidDynamics.Turbulence;

var turb = new TurbulenceModel(gridSpacing: 0.01, cs: 0.17);

// Eddy viscosity from strain rate
double nuT = turb.EddyViscosity(strainRateMagnitude: 50.0);

// Total effective viscosity: ν + ν_t
double nuEff = turb.EffectiveViscosity(molecularViscosity: 1.5e-5, strainRateMagnitude: 50.0);

// Compute strain rate from velocity gradients
double s2d = TurbulenceModel.StrainRate2D(dudx: 10, dudy: 2, dvdx: 3, dvdy: -10);
double s3d = TurbulenceModel.StrainRate3D(
    dudx: 10, dudy: 2, dudz: 0,
    dvdx: 3, dvdy: -10, dvdz: 1,
    dwdx: 0, dwdy: -1, dwdz: 0);
```

## 🔥 Buoyancy Force (Boussinesq)

Thermal buoyancy for smoke, fire, and hot gas plume simulations. Uses the Boussinesq approximation where density variations only appear in the gravity term.

```csharp
using CSharpNumerics.Physics.FluidDynamics.Buoyancy;

// Buoyancy acceleration: a = g · β · (T − T_ref)
double a = BuoyancyForce.BoussinesqAcceleration(
    temperature: 400, referenceTemperature: 300);  // hot gas → positive (upward)

// Apply as velocity impulse
double vNew = BuoyancyForce.ApplyBuoyancy(
    velocityZ: 0, temperature: 500, referenceTemperature: 300, dt: 0.01);

// Density-based buoyancy: a = g · (ρ_ref − ρ) / ρ_ref
double aDensity = BuoyancyForce.DensityBuoyancy(density: 0.5, referenceDensity: 1.0);
```

## 💦 SPH Solver (Smoothed Particle Hydrodynamics)

Lagrangian fluid simulation for water splashes, liquid in containers, and free-surface flows. Based on Muller et al. 2003 with Poly6/Spiky/Viscosity kernels.

```csharp
using CSharpNumerics.Physics.FluidDynamics.SPH;
using CSharpNumerics.Numerics.Objects;

// Create particles in a block
var positions = new List<Vector>();
for (int i = 0; i < 10; i++)
    for (int j = 0; j < 10; j++)
        for (int k = 0; k < 10; k++)
            positions.Add(new Vector(i * 0.02, j * 0.02, k * 0.02 + 0.5));

var sph = new SPHSolver(positions);
sph.SmoothingRadius = 0.04;
sph.ParticleMass = 0.02;
sph.RestDensity = 1000;
sph.GasConstant = 2000;
sph.Viscosity = 1.0;
sph.Gravity = new Vector(0, 0, -9.81);
sph.BoundsMin = new Vector(-0.5, -0.5, 0);
sph.BoundsMax = new Vector(0.5, 0.5, 1);

// Step simulation
sph.Step(numSteps: 100);

// Query particles
foreach (var p in sph.Particles)
    Console.WriteLine($"pos={p.Position} vel={p.Velocity} density={p.Density:F1}");
```

| Property | Description |
|----------|-------------|
| `SmoothingRadius` | Kernel support radius h |
| `ParticleMass` | Mass per particle |
| `RestDensity` | Reference fluid density (kg/m³) |
| `GasConstant` | Pressure stiffness (higher = less compressible) |
| `Viscosity` | Dynamic viscosity coefficient |
| `BoundaryRestitution` | Bounce coefficient at domain walls |

## 🌊 VOF Tracker (Volume of Fluid)

Eulerian free-surface tracking using the Volume-of-Fluid method. Each cell stores a volume fraction $F \in [0,1]$: $F=0$ is empty, $F=1$ is full liquid, and $0 < F < 1$ is an interface cell.

```csharp
using CSharpNumerics.Physics.FluidDynamics.FreeSurface;

var vof = new VOFTracker(nx: 64, ny: 64, cellSize: 0.1);

// Fill a rectangular region with liquid
vof.FillRect(x0: 10, y0: 0, x1: 30, y1: 20);

// Fill a circular blob
vof.FillCircle(cx: 3.2, cy: 4.0, radius: 0.8);

// Advect with velocity field
vof.Advect(u: velocityX, v: velocityY, dt: 0.01);

// Query volume fraction
double f = vof.GetFraction(15, 10);

// Estimate surface normal at interface cells
var (nx, ny) = vof.EstimateNormal(15, 10);

// Total liquid volume (conserved quantity)
double vol = vof.TotalVolume();
```

| Property | Description |
|----------|-------------|
| `CellSize` | Size of each grid cell |
| `LiquidThreshold` | Minimum F to count as liquid present |
