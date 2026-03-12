---
sidebar_label: "💧 Fluid"
---

The `FluidExtensions` class bridges `VectorField` (∇·, ∇×) and `ScalarField` (∇, ∇²) to classical fluid dynamics — Navier–Stokes equations, Bernoulli's principle, continuity, vorticity, drag/lift, dimensionless numbers, viscous pipe flow, and hydrostatics.

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
