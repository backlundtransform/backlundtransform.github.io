---
sidebar_label: "🧩 Complex Analysis"
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