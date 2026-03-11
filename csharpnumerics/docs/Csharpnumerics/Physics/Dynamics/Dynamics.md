---
sidebar_label: "🍎 Dynamics"
---

The `DynamicsExtensions` class provides extension methods for particle dynamics — **forces, momentum, energy, work, power, and collisions**.

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

// Parallel axis theorem for 3×3 tensor: I_new = I_cm + m·(d²E - d⊗d)
Matrix Inew = I.ParallelAxis(mass: 10, offset: new Vector(3, 0, 0));
```

## 🔄 Torque & Rotational Dynamics

$$\vec{\tau} = \vec{r} \times \vec{F}, \quad \tau = Fr\sin\theta, \quad \vec{L} = \mathbf{I}\vec{\omega}, \quad \vec{\alpha} = \mathbf{I}^{-1}\vec{\tau}, \quad KE_{\text{rot}} = \tfrac{1}{2}\vec{\omega}^{\!\top}\mathbf{I}\vec{\omega}$$

```csharp
// Vector: τ = r × F
Vector tau = momentArm.Torque(force);

// Scalar: τ = F·r·sin(θ)
double tau2 = 20.0.Torque(momentArm: 3, angleRadians: Math.PI / 6);

// Angular momentum: L = Iω
Vector L = inertiaTensor.AngularMomentum(omega);
double Ls = momentOfInertia.AngularMomentum(omega);

// Angular acceleration: α = I⁻¹τ
Vector alpha = inverseInertiaTensor.AngularAcceleration(torque);

// Rotational kinetic energy: KE = ½ωᵀIω
double KE = inertiaTensor.RotationalKineticEnergy(omega);
double KEs = momentOfInertia.RotationalKineticEnergy(omega);
```
