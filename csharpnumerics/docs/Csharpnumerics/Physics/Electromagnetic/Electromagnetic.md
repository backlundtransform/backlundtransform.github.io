---
sidebar_label: "🧲 Electromagnetic"
---

The `ElectroMagneticFieldExtensions` class bridges `VectorField` (∇·, ∇×) and `VectorFieldExtensions` (∇, ∇²) to classical electrodynamics — Coulomb's law, Lorentz force, Maxwell's equations, Poynting vector, potentials, and Biot–Savart sources.

## 🔋 Point Charges

Electric field, potential, and Coulomb force from point charges:

```csharp
double q = 1e-6; // 1 μC
var pos = new Vector(0, 0, 0);
var fieldPoint = new Vector(1, 0, 0);

Vector E = q.ElectricField(pos, fieldPoint);        // E = kq/r² · r̂
double V = q.ElectricPotential(pos, fieldPoint);     // V = kq/r

// Coulomb force between two charges
double q2 = -2e-6;
Vector F = q.CoulombForce(q2, new Vector(0, 0, 0), new Vector(1, 0, 0));
```

**Superposition** — multiple charges:

```csharp
var charges = new[]
{
    (1e-6,  new Vector(-1, 0, 0)),
    (-1e-6, new Vector( 1, 0, 0))
};

Vector E = charges.ElectricFieldSuperposition(new Vector(0, 1, 0));
double V = charges.ElectricPotentialSuperposition(new Vector(0, 1, 0));
```

**VectorField** — create a field usable with ∇· and ∇×:

```csharp
// Single charge → VectorField
VectorField E = q.ElectricVectorField(pos);

// Verify Gauss's law: ρ = ε₀ ∇·E
double rho = E.ChargeDensity((2, 0, 0));

// Multiple charges → VectorField
VectorField Edipole = charges.ElectricVectorField();
```

---

## 🧲 Lorentz Force

```csharp
double q = 1.6e-19;   // proton
var v = new Vector(1e6, 0, 0);
var E = new Vector(0, 100, 0);
var B = new Vector(0, 0, 0.5);

Vector F = q.LorentzForce(v, E, B);       // F = q(E + v × B)
Vector Fe = q.ElectricForce(E);            // F = qE
Vector Fm = q.MagneticForce(v, B);         // F = q(v × B)
```

---

## 📐 Maxwell's Equations (differential form)

All four Maxwell equations are accessible through `VectorField`:

```csharp
VectorField E = /* electric field */;
VectorField B = /* magnetic field */;
var point = (1.0, 2.0, 0.0);

// (1) Gauss (electric): ρ = ε₀ ∇·E
double rho = E.ChargeDensity(point);

// (2) Gauss (magnetic): ∇·B = 0  (verification)
double divB = B.GaussMagnetic(point);    // should be ≈ 0

// (3) Faraday: ∂B/∂t = −∇×E
Vector dBdt = E.FaradayLaw(point);

// (4) Ampère–Maxwell: J + ε₀∂E/∂t = (1/μ₀)∇×B
Vector Jeff = B.AmpereLaw(point);
```

**Wave equation** — verify a time-dependent scalar field satisfies $\nabla^2 f = \mu_0 \varepsilon_0 \frac{\partial^2 f}{\partial t^2}$:

```csharp
// Plane wave: f(t)(r) = cos(kx − ωt)
double k = 2 * Math.PI;
double omega = k * PhysicsConstants.SpeedOfLight;

Func<double, Func<Vector, double>> wave = t =>
    r => Math.Cos(k * r.x - omega * t);

double residual = wave.WaveEquationResidual(t: 0, point: (0.5, 0, 0));
// residual ≈ 0 for a valid electromagnetic wave
```

---

## ⚡ Energy & Momentum

```csharp
var E = new Vector(100, 0, 0);
var B = new Vector(0, 0, 0.001);

// Electromagnetic energy density: u = ½(ε₀|E|² + |B|²/μ₀)
double u = E.EnergyDensity(B);

// Poynting vector: S = (1/μ₀)(E × B)
Vector S = E.PoyntingVector(B);

// Radiation pressure (absorption or reflection)
double P_abs = E.RadiationPressure(B);
double P_ref = E.RadiationPressure(B, reflected: true);  // 2×
```

---

## 🔌 Potentials

```csharp
// Electric field from scalar potential: E = −∇V
Func<Vector, double> V = r =>
    ElectroMagneticFieldExtensions.CoulombConstant * 1e-6 / r.GetMagnitude();

VectorField E = V.ElectricFieldFromPotential();
// E is now a full VectorField — use E.Divergence, E.Curl, etc.

// Magnetic field from vector potential: B = ∇×A
VectorField A = new VectorField(
    r => 0,
    r => 0,
    r => r.x * r.y);
Vector B = A.MagneticFieldFromVectorPotential((1, 1, 0));
```

---

## 🌀 Biot–Savart Sources

Magnetic field from common current configurations:

```csharp
// Infinite straight wire: B = μ₀I/(2πd)
double B = 10.0.MagneticFieldFromWire(distance: 0.05);  // 10 A, 5 cm away

// Wire in 3D — full vector field
Vector Bvec = 10.0.MagneticFieldFromWire(
    wireDirection: new Vector(0, 0, 1),
    wirePoint:     new Vector(0, 0, 0),
    fieldPoint:    new Vector(0.05, 0, 0));

// Circular loop center: B = μ₀I/(2R) along normal
Vector Bloop = 5.0.MagneticFieldFromLoop(
    radius: 0.1,
    normal: new Vector(0, 0, 1));

// Solenoid: B = μ₀nI along axis
Vector Bsol = 2.0.MagneticFieldFromSolenoid(
    turnsPerUnitLength: 1000,
    direction: new Vector(0, 0, 1));
```

---

## 🔄 Dipoles

```csharp
// Electric dipole moment: p = qd
var p = new Vector(0, 0, 1e-12); // 1 pC·m along Z
var dipolePos = new Vector(0, 0, 0);

double V = p.DipolePotential(dipolePos, fieldPoint: new Vector(1, 0, 0));
Vector E = p.DipoleElectricField(dipolePos, fieldPoint: new Vector(1, 0, 0));
// E = (1/4πε₀) · [3(p·r̂)r̂ − p] / r³
```
