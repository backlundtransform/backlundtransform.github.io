---
sidebar_label: "🚀 Mechanics"
---

Classical mechanics — **kinematics, dynamics, and oscillations** in one unified module. Covers motion analysis, forces, energy, collisions, rigid bodies, and oscillator models.

**Namespace:** `CSharpNumerics.Physics.Mechanics`

**Oscillations Namespace:** `CSharpNumerics.Physics.Mechanics.Oscillations`

---

## ⬇️ Free Fall

Compute the velocity or time of a freely falling object:

$$v = \sqrt{2gh}, \quad t = \sqrt{\frac{2h}{g}}$$

```csharp
double v = 10.0.FreeFallVelocity();       // scalar: v = sqrt(2*g*h)
double t = 10.0.FreeFallTime();           // scalar: t = sqrt(2*h/g)

// Vector version with optional direction (default downward)
Vector dir = new Vector(0,0,-1);
Vector vVec = 10.0.FreeFallVelocity(dir);
```

## ➡️ Constant Velocity

Compute position given constant velocity:

$$s = s_0 + v \cdot t$$

```csharp
double s = 3.0.PositionFromConstantVelocity(time: 5, initialPosition: 2); 

Vector velocity = new Vector(2, 0, 0);
Vector initialPosition = new Vector(1, 0, 0);
Vector position = velocity.PositionFromConstantVelocity(4, initialPosition);
```

## 🚀 Constant Acceleration

Compute velocity or position under constant acceleration:

$$v = v_0 + at, \quad s = s_0 + v_0 t + \tfrac{1}{2}at^2$$

```csharp
// Scalar
double v = 2.0.VelocityFromConstantAcceleration(time: 4, initialVelocity: 1);
double s = 2.0.PositionFromConstantAcceleration(time: 3, initialVelocity: 1, initialPosition: 0);

// Vector
Vector a = new Vector(1, 0, 0);
Vector v0 = new Vector(0, 0, 0);
Vector s0 = new Vector(0, 0, 0);

Vector vVec = a.VelocityFromConstantAcceleration(3, v0);
Vector sVec = a.PositionFromConstantAcceleration(2, v0, s0);
```

## ⏱️ Time-Independent (SUVAT) Equations

Compute kinematics without explicit time:

$$v^2 = v_0^2 + 2a \cdot s, \quad s = \frac{v^2 - v_0^2}{2a}$$

```csharp
double finalV = 2.0.VelocityFromDisplacement(5, initialVelocity: 1);
double displacement = 2.0.DisplacementFromVelocities(finalVelocity: 5, initialVelocity: 1);
double t = 2.0.TimeToReachVelocity(finalVelocity: 5, initialVelocity: 1);
double sAvg = 3.0.DisplacementFromAverageVelocity(initialVelocity: 2, finalVelocity: 4);

// Vector versions are also supported
Vector a = new Vector(2, 0, 0);
Vector s = new Vector(3, 0, 0);
Vector v0 = new Vector(1, 0, 0);

Vector finalVVec = a.VelocityFromDisplacement(s, v0);
Vector displacementVec = a.DisplacementFromVelocities(finalVVec, v0);
```

## 🔄 Circular Motion

Compute centripetal acceleration:

$$a_c = \frac{v^2}{r}$$

```csharp
double a = 3.0.CentripetalAcceleration(radius: 2); // scalar

Vector velocity = new Vector(2, 0, 0);
Vector radius = new Vector(0, 3, 0);
Vector ac = velocity.CentripetalAcceleration(radius); // vector, towards center
```
Angular speed, period, and frequency:

```csharp
double omega = 10.0.AngularSpeed(radius: 5);  // ω = v/r = 2 rad/s
double T     = 10.0.Period(radius: 5);         // T = 2πr/v
double f     = 10.0.Frequency(radius: 5);      // f = v/(2πr) = 1/T
```

Angular velocity vector and tangential velocity:

```csharp
// Object at (5,0,0) moving at (0,10,0) → angular velocity along +Z
Vector omega = vel.AngularVelocity(radius);    // ω = (r × v) / |r|²

// Reverse: angular velocity → tangential velocity
Vector v = omega.TangentialVelocity(radius);   // v = ω × r
```

## 🎯 Projectile Motion

Compute projectile trajectory, time of flight, maximum height, and range:

$$\vec{r}(t) = \vec{r}_0 + \vec{v}_0 t + \tfrac{1}{2}\vec{g}\,t^2, \quad T = \frac{2v_0\sin\theta}{g}, \quad H = \frac{v_0^2\sin^2\theta}{2g}, \quad R = \frac{v_0^2\sin 2\theta}{g}$$

Create an initial velocity vector from speed and launch angle:

```csharp
// 20 m/s at 45° → v₀ = (v·cos(θ), 0, v·sin(θ))
Vector v0 = 20.0.ProjectileVelocityFromAngle(Math.PI / 4);
```

Position and velocity at any time:

```csharp
Vector pos = v0.ProjectilePosition(time: 1.5);
Vector vel = v0.ProjectileVelocity(time: 1.5);

// With initial height (e.g. launched from a 10m cliff)
Vector pos2 = v0.ProjectilePosition(time: 1.5, initialHeight: 10);
```

Time of flight, maximum height, and range:

```csharp
// Vector versions (support initial height)
double T = v0.ProjectileTimeOfFlight();
double H = v0.ProjectileMaxHeight();
double R = v0.ProjectileRange();

// With elevated launch
double T2 = v0.ProjectileTimeOfFlight(initialHeight: 10);
double R2 = v0.ProjectileRange(initialHeight: 10);

// Scalar versions (speed + angle, same-height launch)
double T3 = 20.0.ProjectileTimeOfFlight(Math.PI / 4);   // T = 2v₀sin(θ)/g
double H3 = 20.0.ProjectileMaxHeight(Math.PI / 4);      // H = v₀²sin²(θ)/(2g)
double R3 = 20.0.ProjectileRange(Math.PI / 4);           // R = v₀²sin(2θ)/g
```

## 🌍 Orbital Mechanics

Gravitational and circular-orbit calculations:

$$g = \frac{GM}{r^2}, \quad F = \frac{Gm_1 m_2}{r^2}, \quad v_{esc} = \sqrt{\frac{2GM}{r}}, \quad v_{orb} = \sqrt{\frac{GM}{r}}, \quad T = 2\pi\sqrt{\frac{r^3}{GM}}$$

Gravitational helpers:

```csharp
// Gravitational field strength at distance r from a mass: g = GM/r²
double g = PhysicsConstants.EarthMass.GravitationalFieldStrength(PhysicsConstants.EarthRadius);

// Gravitational force between two masses: F = G·m₁·m₂/r²
double F = PhysicsConstants.EarthMass.GravitationalForce(PhysicsConstants.MoonMass, 3.844e8);

// Escape velocity: v = √(2GM/r)
double vEsc = PhysicsConstants.EarthMass.EscapeVelocity(PhysicsConstants.EarthRadius);
```

Circular orbit scalars:

```csharp
double r = PhysicsConstants.EarthRadius + 408000; // ISS altitude

double speed  = PhysicsConstants.EarthMass.OrbitalSpeed(r);  // v = √(GM/r)  ≈ 7660 m/s
double period = PhysicsConstants.EarthMass.OrbitalPeriod(r);  // T = 2π√(r³/GM) ≈ 92 min
```

Position, velocity, and acceleration on a circular orbit at time $t$:

```csharp
double M = PhysicsConstants.EarthMass;
double r = 1e7; // 10 000 km radius

Vector pos = M.OrbitalPosition(r, time);      // R·(cos ωt, sin ωt, 0)
Vector vel = M.OrbitalVelocity(r, time);      // Rω·(-sin ωt, cos ωt, 0)
Vector acc = M.OrbitalAcceleration(r, time);   // -ω²R·(cos ωt, sin ωt, 0)
```

## 🔀 Relative Motion

Compute relative kinematics between two objects or reference frames:

$$\vec{v}_{rel} = \vec{v}_A - \vec{v}_B, \quad \vec{r}_{rel} = \vec{r}_A - \vec{r}_B, \quad \vec{a}_{rel} = \vec{a}_A - \vec{a}_B$$

```csharp
var vA = new Vector(30, 0, 0);
var vB = new Vector(-20, 0, 0);

Vector vRel = vA.RelativeVelocity(vB);        // v_A - v_B = (50, 0, 0)
Vector rRel = posA.RelativePosition(posB);     // r_A - r_B
Vector aRel = accA.RelativeAcceleration(accB); // a_A - a_B
```

---

## 🏋️ Newton's Laws

Compute acceleration from force, force from mass and acceleration, net force, and weight:

$$\vec{F} = m\vec{a}, \quad \vec{a} = \frac{\vec{F}}{m}, \quad \vec{W} = m\vec{g}$$

```csharp
// Newton's 2nd law: a = F/m
var force = new Vector(10, 0, 0);
Vector acceleration = force.Acceleration(mass: 5);    // (2, 0, 0)

// F = ma
Vector F = 10.0.Force(new Vector(0, 0, -9.8));        // (0, 0, -98)

// Sum of forces
Vector net = f1.NetForce(f2, f3);

// Weight (default direction: -Z)
Vector W = 80.0.Weight();                              // (0, 0, -784.5)
```

## 💥 Momentum & Impulse

Compute linear momentum and impulse:

$$\vec{p} = m\vec{v}, \quad \vec{J} = \vec{F}\,\Delta t = m\,\Delta\vec{v}$$

```csharp
Vector p = 5.0.Momentum(new Vector(3, 4, 0));         // (15, 20, 0)
Vector J = force.Impulse(duration: 0.5);               // F·Δt
Vector J2 = mass.ImpulseFromVelocityChange(vBefore, vAfter); // m·Δv
Vector vNew = impulse.ApplyImpulse(mass: 5, v0);       // v + J/m
```

## ⚡ Energy

Compute kinetic energy, potential energy, and mechanical energy:

$$KE = \tfrac{1}{2}mv^2, \quad PE = mgh, \quad U = -\frac{Gm_1 m_2}{r}, \quad E = KE + PE$$

```csharp
double ke = 4.0.KineticEnergy(new Vector(3, 4, 0));   // ½mv² = 50 J
double pe = 10.0.PotentialEnergy(height: 5);           // mgh
double U  = m1.GravitationalPotentialEnergy(m2, r);    // -Gm₁m₂/r
double E  = mass.MechanicalEnergy(velocity, height);   // KE + PE
double v  = mass.SpeedFromKineticEnergy(ke);            // √(2·KE/m)
```

## 🔧 Work & Power

Compute work done by a force and instantaneous or average power:

$$W = \vec{F} \cdot \vec{d}, \quad W = Fd\cos\theta, \quad P = \vec{F} \cdot \vec{v}, \quad \bar{P} = \frac{W}{\Delta t}, \quad \Delta KE = \tfrac{1}{2}m(v_2^2 - v_1^2)$$

```csharp
double W = force.Work(displacement);                   // F·d (dot product)
double W2 = 10.0.Work(5, angleRadians: Math.PI / 3);  // F·d·cos(θ) = 25 J
double P = force.Power(velocity);                      // F·v (instantaneous)
double P2 = 100.0.AveragePower(duration: 5);           // W/Δt = 20 W
double ΔKE = mass.WorkEnergyTheorem(vBefore, vAfter);  // ½m(v₂² - v₁²)
```

## 💫 Elastic & Inelastic Collisions

Compute outcomes of 1D and 3D collisions:

$$m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2', \quad e = \frac{v_2' - v_1'}{v_1 - v_2}$$

```csharp
// 1D elastic collision — both momentum and energy conserved
var (v1f, v2f) = m1.ElasticCollision(v1, m2, v2);

// Perfectly inelastic (sticky) collision
double vf = m1.InelasticCollisionVelocity(v1, m2, v2);
Vector vf3d = m1.InelasticCollisionVelocity(v1Vec, m2, v2Vec);   // 3D version
double loss = m1.InelasticCollisionEnergyLoss(v1, m2, v2);

// Coefficient of restitution: e = 1 (elastic), e = 0 (perfectly inelastic)
double e = v1Before.CoefficientOfRestitution(v2Before, v1After, v2After);
```

## 🧱 Rigid Body

Create rigid bodies from standard shapes with automatic inertia tensors:

```csharp
var sphere  = RigidBody.CreateSolidSphere(mass: 10, radius: 2);
var box     = RigidBody.CreateSolidBox(mass: 12, width: 2, height: 3, depth: 4);
var cyl     = RigidBody.CreateSolidCylinder(mass: 6, radius: 1, height: 4);
var hollow  = RigidBody.CreateHollowSphere(mass: 5, radius: 3);
var tube    = RigidBody.CreateHollowCylinder(mass: 8, innerRadius: 1, outerRadius: 2, height: 3);
var rod     = RigidBody.CreateThinRod(mass: 4, length: 5);
var wall    = RigidBody.CreateStatic(new Vector(0, 0, 0));  // immovable
```

Apply forces, torques, and query state:

```csharp
var body = RigidBody.CreateSolidSphere(10, 1);
body.Position = new Vector(0, 5, 0);
body.Velocity = new Vector(3, 0, 0);

body.ApplyForce(new Vector(0, 0, -98));           // gravity
body.ApplyForceAtPoint(                            // generates torque too
    new Vector(10, 0, 0), worldPoint: new Vector(0, 1, 0));
body.ApplyTorque(new Vector(0, 0, 5));

Vector a     = body.LinearAcceleration;            // F/m
Vector alpha = body.AngularAcceleration;           // I⁻¹τ
Vector p     = body.LinearMomentum;                // mv
Vector L     = body.AngularMomentum;               // Iω
double KE    = body.KineticEnergy;                 // ½mv² + ½ωᵀIω

body.ClearForces();  // reset accumulators after integration step
```

## ⏱️ RigidBody Integration

Three time-stepping methods advance a `RigidBody` by one `dt`. Each delegates to the corresponding ODE solver in `DifferentialEquationExtensions`, packing body state into `VectorN` internally.

```csharp
// Semi-implicit (symplectic) Euler — stable for games, first-order
// Apply forces before calling; accumulators are cleared afterwards
var body = RigidBody.CreateSolidSphere(10, 1);
body.Position = new Vector(0, 0, 100);
body.ApplyForce(new Vector(0, 0, -9.80665 * body.Mass));
body.IntegrateSemiImplicitEuler(dt: 0.001);

// Velocity Verlet — O(dt²) accuracy, excellent energy conservation
// Forces are evaluated by forceFunc (no need to pre-apply)
Func<RigidBody, (Vector force, Vector torque)> gravity = b =>
    (new Vector(0, 0, -9.80665 * b.Mass), new Vector(0, 0, 0));
body.IntegrateVelocityVerlet(gravity, dt: 0.01);

// Explicit Euler — simplest, least stable
body.ApplyForce(new Vector(0, 0, -9.80665 * body.Mass));
body.IntegrateEuler(dt: 0.001);
```

## 🧲 Common Force Models

Ready-made force functions for building simulations — combine them in a `forceFunc` for the integrators.

```csharp
// Spring (Hooke's law): F = -k·(|Δr| - L₀)·r̂
var spring = 50.0.SpringForce(restLength: 2.0, position, anchor);

// Viscous damping: F = -c·v
var damping = 0.5.DampingForce(velocity);

// Aerodynamic drag: F = -½·Cd·ρ·A·|v|·v
var drag = 0.47.DragForce(fluidDensity: 1.225, crossSectionArea: 0.01, velocity);

// Friction (kinetic — moving object)
var kinetic = 0.3.FrictionForce(normalForceMagnitude: 98, velocity);

// Friction (static — stationary object, opposes applied force up to μN)
var friction = 0.5.FrictionForce(normalForceMagnitude: 100, velocity: new Vector(0, 0, 0),
    appliedTangentialForce: new Vector(20, 0, 0));  // returns (-20, 0, 0)

// Compose forces in a Verlet simulation
Func<RigidBody, (Vector, Vector)> forces = b =>
{
    var F = 50.0.SpringForce(2.0, b.Position, new Vector(0, 0, 0))
          + 0.5.DampingForce(b.Velocity);
    return (F, new Vector(0, 0, 0));
};
body.IntegrateVelocityVerlet(forces, dt: 0.01);
```

## 🌀 Moment of Inertia (Scalar)

$$I_{\text{solid sphere}} = \tfrac{2}{5}mr^2, \quad I_{\text{hollow sphere}} = \tfrac{2}{3}mr^2, \quad I_{\text{solid cyl}} = \tfrac{1}{2}mr^2, \quad I_{\text{rod, center}} = \tfrac{mL^2}{12}, \quad I_{\text{rod, end}} = \tfrac{mL^2}{3}$$

```csharp
double I  = 10.0.MomentOfInertiaSolidSphere(radius: 2);       // 2/5·mr²
double I2 = 10.0.MomentOfInertiaHollowSphere(radius: 2);     // 2/3·mr²
double I3 = 8.0.MomentOfInertiaSolidCylinder(radius: 3);      // ½mr²
double I4 = 6.0.MomentOfInertiaThinRod(length: 4);            // mL²/12
double I5 = 6.0.MomentOfInertiaThinRodEnd(length: 4);         // mL²/3
double I6 = 12.0.MomentOfInertiaSolidBox(sideA: 3, sideB: 4); // m/12·(a²+b²)

// Parallel axis theorem: I_new = I_cm + m·d²
double Inew = I.ParallelAxis(mass: 10, distance: 3);
```

## 🧮 Inertia Tensor (3×3 Matrix)

$$\mathbf{I}_{\text{new}} = \mathbf{I}_{\text{cm}} + m\bigl(d^2\mathbf{E} - \vec{d}\otimes\vec{d}\bigr)$$

```csharp
Matrix I  = 10.0.InertiaTensorSolidSphere(radius: 2);
Matrix Ib = 12.0.InertiaTensorSolidBox(width: 2, height: 3, depth: 4);
Matrix Ic = 6.0.InertiaTensorSolidCylinder(radius: 1, height: 4);
```

## 🧵 Soft Body Physics

The `Physics.Mechanics.SoftBody` namespace provides mass-spring deformable meshes and cloth simulation using Verlet integration with constraint projection.

**🕸️ DeformableMesh**

Mass-spring network on a triangulated mesh. Each vertex is a point mass connected to neighbours by springs.

```csharp
using CSharpNumerics.Physics.Mechanics.SoftBody;
using CSharpNumerics.Numerics.Objects;

// Create a rectangular grid mesh
var mesh = DeformableMesh.CreateGrid(
    width: 2.0, height: 2.0, resX: 20, resY: 20,
    mass: 0.1, stiffness: 0.9, origin: new Vector(0, 0, 5));

// Pin corners
mesh.Pin(0);
mesh.Pin(19);

// Step simulation
for (int i = 0; i < 1000; i++)
    mesh.Step(dt: 0.001);

// Collision with sphere
mesh.CollideWithSphere(center: new Vector(1, 1, 3), radius: 0.5);

// Collision with ground plane
mesh.CollideWithGround(height: 0);
```

| Property | Description |
|----------|-------------|
| `Gravity` | External acceleration (default (0,0,−9.81)) |
| `Damping` | Velocity damping 0–1 (default 0.99) |
| `Iterations` | Constraint iterations per step (default 5) |

Custom mesh from triangle soup:

```csharp
var verts = new Vector[] { /* positions */ };
var mesh = new DeformableMesh(verts, mass: 0.1);
mesh.GenerateSpringsFromTriangles(triangleIndices, stiffness: 0.8);
```

**🪡 ClothSimulation**

Built on `DeformableMesh` with wind force and optional self-collision.

```csharp
using CSharpNumerics.Physics.Mechanics.SoftBody;

var cloth = new ClothSimulation(
    width: 3, height: 2, resX: 30, resY: 20,
    mass: 0.05, stiffness: 0.95);

cloth.PinTopEdge();                   // fixed along top row
cloth.Wind = new Vector(2, 0, 0.5);  // wind blowing in +X

for (int i = 0; i < 500; i++)
    cloth.Step(0.002);

Vector pos = cloth.GetPosition(15, 10);  // query vertex position
```

| Property | Description |
|----------|-------------|
| `Wind` | Wind force applied to each particle |
| `EnableSelfCollision` | Toggle self-collision (default false) |
| `SelfCollisionRadius` | Distance threshold for self-collision |

---

## 🎵 Simple Harmonic Oscillator

**Namespace:** `CSharpNumerics.Physics.Mechanics.Oscillations`

Models the undamped system $\ddot{x} + \omega_0^2 x = 0$ where $\omega_0 = \sqrt{k/m}$.

Integration uses **Velocity Verlet** (symplectic, O(dt²)) — excellent energy conservation for undamped systems.

```csharp
var sho = new SimpleHarmonicOscillator(mass: 2, stiffness: 50, initialPosition: 0.5);

double w   = sho.AngularFrequency;   // ω₀ = √(k/m) = 5 rad/s
double f   = sho.Frequency;          // f₀ = ω₀/2π ≈ 0.796 Hz
double T   = sho.Period;             // T = 1/f₀ ≈ 1.257 s
double A   = sho.Amplitude;          // A = √(x₀² + (v₀/ω₀)²) = 0.5 m
double phi = sho.PhaseOffset;        // φ = atan2(-v₀/ω₀, x₀)
```

**Analytic solution** — exact reference for verification:

```csharp
double x = sho.AnalyticPosition(t: 1.0);   // A·cos(ω₀t + φ)
double v = sho.AnalyticVelocity(t: 1.0);   // -Aω₀·sin(ω₀t + φ)
```

**Simulation & visualisation**

```csharp
sho.Step(dt: 0.001);                         // advance one time step
sho.Reset();                                  // restore initial conditions

List<Serie> trajectory = sho.Trajectory(tEnd: sho.Period * 5, dt: 0.001);
List<Serie> phase      = sho.PhasePortrait(tEnd: sho.Period * 2, dt: 0.001);
```

**Energy** — conserved for undamped SHM:

```csharp
double KE = sho.KineticEnergy;      // ½mv²
double PE = sho.PotentialEnergy;     // ½kx²
double E  = sho.TotalEnergy;        // KE + PE (constant)

List<Serie> energy = sho.EnergyOverTime(tEnd: sho.Period * 10, dt: 0.001);
```

**Frequency spectrum** — FFT peak at the natural frequency $f_0$:

```csharp
List<Serie> spectrum = sho.FrequencySpectrum(tEnd: sho.Period * 20, dt: 0.01);
```

**With initial velocity**

```csharp
var sho2 = new SimpleHarmonicOscillator(mass: 1, stiffness: 25,
    initialPosition: 0, initialVelocity: 5);
Console.WriteLine(sho2.Amplitude);  // A = √(0² + (5/5)²) = 1.0 m
```

---

## 🌊 Damped Oscillator

Models $\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = 0$ where $\gamma = c/(2m)$.

Three damping regimes are automatically detected:
- **Underdamped** ($\gamma < \omega_0$) — oscillates with exponential decay
- **Critically damped** ($\gamma = \omega_0$) — fastest non-oscillatory return
- **Overdamped** ($\gamma > \omega_0$) — slow exponential decay

Integration uses **RK4** — appropriate for dissipative systems.

```csharp
var osc = new DampedOscillator(mass: 1, stiffness: 100, damping: 4, initialPosition: 1.0);

double w0    = osc.NaturalFrequency;        // ω₀ = 10 rad/s
double g     = osc.Gamma;                   // γ = 2 rad/s
double wd    = osc.DampedFrequency;         // ω_d = √96 ≈ 9.80 rad/s
double Td    = osc.DampedPeriod;            // 2π/ω_d ≈ 0.641 s
DampingRegime regime = osc.Regime;          // Underdamped
double Q     = osc.QualityFactor;           // ω₀/(2γ) = 2.5
double delta = osc.LogarithmicDecrement;    // γ·T_d ≈ 1.283
```

**Regime detection**

```csharp
var under = new DampedOscillator(1, 100,  4);  // γ=2  < ω₀=10 → Underdamped
var crit  = new DampedOscillator(1, 100, 20);  // γ=10 = ω₀=10 → CriticallyDamped
var over  = new DampedOscillator(1, 100, 40);  // γ=20 > ω₀=10 → Overdamped
```

**Analytic solution** — all three regimes:

```csharp
// Underdamped:  x(t) = A·e^(−γt)·cos(ω_d·t + φ)
// Critical:     x(t) = (C₁ + C₂t)·e^(−γt)
// Overdamped:   x(t) = C₁·e^(r₁t) + C₂·e^(r₂t)
double x = osc.AnalyticPosition(t: 1.0);
double v = osc.AnalyticVelocity(t: 1.0);
```

**Simulation & visualisation**

```csharp
osc.Step(dt: 0.001);
osc.Reset();

List<Serie> trajectory = osc.Trajectory(tEnd: 5.0, dt: 0.001);
List<Serie> phase      = osc.PhasePortrait(tEnd: 5.0, dt: 0.001);  // spirals to origin
```

**Energy** — monotonically decreasing:

```csharp
double E = osc.TotalEnergy;
List<Serie> energy     = osc.EnergyOverTime(tEnd: 5.0, dt: 0.001);
List<Serie> dissipated = osc.EnergyDissipation(tEnd: 5.0, dt: 0.001);  // E₀ − E(t)
```

**Envelope & spectrum**

```csharp
double env = osc.Envelope(t: 1.0);                         // A·e^(−γt)
List<Serie> envCurve = osc.EnvelopeCurve(tEnd: 5.0, dt: 0.01);
List<Serie> spectrum = osc.FrequencySpectrum(tEnd: 20.0, dt: 0.005);  // peak at ω_d
```

**Zero damping** reduces to `SimpleHarmonicOscillator` behaviour.

---

## ⚡ Driven Oscillator

Extends the damped oscillator with a harmonic driving force:

$$\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = \frac{F_0}{m}\cos(\omega_d t)$$

```csharp
var osc = new DrivenOscillator(
    mass: 1.0, stiffness: 100.0, damping: 4.0,
    driveAmplitude: 10.0, driveFrequency: 7.0,
    initialPosition: 0.0, initialVelocity: 0.0);
```

| Property | Formula | Description |
|---|---|---|
| `NaturalFrequency` | $\omega_0 = \sqrt{k/m}$ | Undamped natural frequency |
| `Gamma` | $\gamma = c/(2m)$ | Damping rate |
| `DampedFrequency` | $\omega_d = \sqrt{\omega_0^2 - \gamma^2}$ | Damped frequency |
| `Regime` | auto-detected | `Underdamped`, `CriticallyDamped`, or `Overdamped` |
| `QualityFactor` | $Q = \omega_0/(2\gamma)$ | Sharpness of resonance |
| `ResonanceFrequency` | $\omega_r = \sqrt{\omega_0^2 - 2\gamma^2}$ | Frequency of max amplitude (0 if $\omega_0^2 < 2\gamma^2$) |
| `Bandwidth` | $\Delta\omega = 2\gamma$ | Width of resonance peak |

**Steady-state response**

```csharp
double A = osc.SteadyStateAmplitude(wd);     // (F₀/m) / √((ω₀²−ωd²)² + (2γωd)²)
double φ = osc.SteadyStatePhase(wd);         // −atan2(2γωd, ω₀²−ωd²)

double Adrive = osc.SteadyStateAmplitudeAtDrive;
double φdrive = osc.SteadyStatePhaseAtDrive;
```

**Resonance curve & phase response**

```csharp
List<Serie> resonance = osc.ResonanceCurve(wMin: 0.1, wMax: 20, steps: 500);
List<Serie> phaseResp = osc.PhaseResponse(wMin: 0.1, wMax: 20, steps: 500);
```

**Transfer function**

```csharp
ComplexNumber H   = osc.TransferFunction(s);      // H(s) = 1/(s² + 2γs + ω₀²)
ComplexNumber Hiw = osc.FrequencyResponse(w);      // H(iω)
```

**Simulation**

```csharp
osc.Step(dt: 0.001);
List<Serie> traj  = osc.Trajectory(5.0, 0.001);
List<Serie> phase = osc.PhasePortrait(5.0, 0.001);
```

**Steady-state extraction**

```csharp
List<Serie> steady = osc.SteadyStateTrajectory(
    steadyDuration: 10.0, dt: 0.001, transientDuration: null);  // auto = 5/γ

double Ameas = osc.MeasuredSteadyStateAmplitude(dt: 0.001);
```
