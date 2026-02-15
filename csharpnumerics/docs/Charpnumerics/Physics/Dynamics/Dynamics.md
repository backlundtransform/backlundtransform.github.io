---
sidebar_label: "⚡ Dynamics"
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
