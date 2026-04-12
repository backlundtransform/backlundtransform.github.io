---
sidebar_label: "🌀 Complex Analysis"
---

## 🧩 Complex Numbers

$z = a + bi$

```csharp
var a = new ComplexNumber(3, 2);
var b = new ComplexNumber(5, 3);

var sum = a + b;
var product = a * b;
var power = a.Pow(2); // 5 + 12i
```

**Exponential form (Euler's formula)** — $e^{i\pi} = -1$

```csharp
new ComplexNumber(0, Math.PI).Exponential(); // -1
```

---

## 🌈 Complex Functions

A `ComplexFunction` represents a mapping $f: \mathbb{C} \to \mathbb{C}$ decomposed into its real and imaginary parts:

$$f(z) = u(x,y) + i\,v(x,y)$$

```csharp
namespace Numerics.Objects
```

Constructing a ComplexFunction

**From real/imaginary component functions:**

```csharp
var f = new ComplexFunction(
    re: point => point.x * point.x - point.y * point.y,   // u(x,y) = x² - y²
    im: point => 2 * point.x * point.y                     // v(x,y) = 2xy
);
```

**From a complex-valued function $f(z)$:**

```csharp
var f = new ComplexFunction(z => z.Pow(2));  // f(z) = z²
```

## 🎨 Jacobian

The Jacobian matrix of a complex function $f = u + iv$:

$$J_f = \begin{pmatrix} \frac{\partial u}{\partial x} & \frac{\partial u}{\partial y} \\ \frac{\partial v}{\partial x} & \frac{\partial v}{\partial y} \end{pmatrix}$$

```csharp
var f = new ComplexFunction(z => z.Pow(2));
Matrix jacobian = f.Jacobian((1, 2));
```

## 🌀 Analyticity (Cauchy–Riemann equations)

A complex function is **analytic** (holomorphic) at a point if and only if the Cauchy–Riemann equations hold:

$$\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \quad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$$

```csharp
var f = new ComplexFunction(z => z.Pow(2));
bool analytic = f.IsAnalytical((1, 2)); // true — z² is entire

var g = new ComplexFunction(
    re: point => point.x * point.x + point.y * point.y,  // |z|²
    im: point => 0
);
bool notAnalytic = g.IsAnalytical((1, 1)); // false — |z|² is not analytic
```


## 🔄 Quaternion

Quaternions generalize complex numbers to 4 dimensions: $$q = w + xi + yj + zk$$. They are the standard representation for 3D rotations — compact (4 doubles vs 9 for a matrix), numerically stable, and free of gimbal lock.

**Algebraic hierarchy:** $$ℝ (double) ⊂ ℂ (ComplexNumber) ⊂ ℍ (Quaternion)$$

```csharp
// Create from axis + angle
var q = Quaternion.FromAxisAngle(new Vector(0, 0, 1), Math.PI / 2); // 90° about Z

// Rotate a vector: v' = q·v·q*
var rotated = q.Rotate(new Vector(1, 0, 0)); // → (0, 1, 0)

// Compose rotations via multiplication (non-commutative)
var q2 = Quaternion.FromAxisAngle(new Vector(0, 1, 0), Math.PI / 3);
var combined = q2 * q; // q first, then q2

// Convert to/from 3×3 rotation matrix
Matrix m = q.ToMatrix();
Quaternion recovered = Quaternion.FromMatrix(m);

// Euler angles (ZYX convention)
var q3 = Quaternion.FromEulerAngles(roll: 0.3, pitch: 0.5, yaw: 0.7);
var (roll, pitch, yaw) = q3.ToEulerAngles();

// Axis-angle round-trip
var (axis, angle) = q.ToAxisAngle();
```

**Interpolation:**

```csharp
// Spherical linear interpolation (constant angular velocity)
var halfway = Quaternion.Slerp(qStart, qEnd, 0.5);

// Normalized linear interpolation (cheaper, good for small angles)
var approx = Quaternion.Lerp(qStart, qEnd, 0.5);
```

**Integration (for physics simulation):**

```csharp
// Integrate orientation with angular velocity ω over time step dt
var q = Quaternion.Identity;
var omega = new Vector(0, 0, 1); // 1 rad/s about Z
q = Quaternion.IntegrateOrientation(q, omega, dt: 0.001);
```

**Bridge from ComplexNumber:**

```csharp
// Embed ℂ into ℍ — preserves complex multiplication
var c = new ComplexNumber(3, 2);
var q = Quaternion.FromComplexNumber(c); // (3, 2, 0, 0)
```