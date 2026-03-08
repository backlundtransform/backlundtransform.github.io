---
sidebar_label: "🌐 Fields"
---

# 🌐 Fields

| Rank | Type | Value at point |
|---|---|---|
| 0 | `ScalarField` | `double` |
| 1 | `VectorField` | `Vector` |
| 2 | `TensorField` | `Matrix` (3×3) |

---

## 📐 Scalar Field

A `ScalarField` wraps `Func<Vector, double>` and provides instance methods for the standard vector-calculus operations that are otherwise spread across extension classes. It converts implicitly to `Func<Vector, double>`, so it can be passed to any existing API.

```csharp
var V = new ScalarField(r => Math.Pow(r.x, 2) * Math.Pow(r.y, 3));

// Evaluate
double val = V.Evaluate(new Vector(1, -2, 0));
double val2 = V.Evaluate((1, -2, 0));

// Differential operators
Vector grad = V.Gradient((1, -2, 0));          // ∇f
double lap = V.Laplacian((1, -2, 0));          // ∇²f
double dfdx = V.Derivate(new Vector(1, -2, 0), Cartesian.x);

// Gradient as a full VectorField — ∇f(r) lazily evaluated
VectorField gradField = V.GradientField();
Vector curlOfGrad = gradField.Curl((1, -2, 0)); // ≈ 0 (vector identity)

// Integration (3D Monte Carlo)
double integral = V.Integrate(new Vector(-1, -1, -1), new Vector(1, 1, 1));
```

**Arithmetic** — build composite fields from simpler ones:

```csharp
var f = new ScalarField(r => r.x * r.x);
var g = new ScalarField(r => r.y * r.y);

ScalarField sum = f + g;       // f(r) + g(r)
ScalarField diff = f - g;      // f(r) - g(r)
ScalarField prod = f * g;      // f(r) · g(r)
ScalarField scaled = 3.0 * f;  // 3 · f(r)
ScalarField neg = -f;          // −f(r)
```

**Interop** — implicit conversion to `Func<Vector, double>`:

```csharp
var V = new ScalarField(r => r.x + r.y + r.z);

// Pass directly to any method that takes Func<Vector, double>
Func<Vector, double> func = V;
```

---

## 🌐 Vector Field

**Gradient** — $\nabla f = \left(\frac{\partial f}{\partial x},\, \frac{\partial f}{\partial y},\, \frac{\partial f}{\partial z}\right)$

```csharp
Func<Vector, double> f = p => Math.Pow(p.x, 2) * Math.Pow(p.y, 3);
var grad = f.Gradient((1, -2, 0));
```

**Laplacian** — $\nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} + \frac{\partial^2 f}{\partial z^2}$

```csharp
Func<Vector, double> f = p => p.x * p.x + p.y * p.y + p.z * p.z;
double laplacian = f.Laplacian((1, 2, 3)); // ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²
```

**Divergence** — $\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}$

```csharp
var field = new VectorField(p => Math.Sin(p.x * p.y),
                            p => Math.Cos(p.x * p.y),
                            p => Math.Exp(p.z));

double div = field.Divergence((1, 2, 2));
```

**Curl** — $\nabla \times \mathbf{F}$

```csharp
var field = new VectorField(p => p.y, p => -p.x, p => 0);
var curl = field.Curl((1, 4, 2));
```

---

## 🧊 Tensor Field

A `TensorField` maps each spatial point to a 3×3 `Matrix` — the rank-2 completion of the field hierarchy.

```csharp
// Stress tensor that varies with position
var T = new TensorField(r => new Matrix(new double[,]
{
    { r.x, 0,   0   },
    { 0,   r.y, 0   },
    { 0,   0,   r.z }
}));

Matrix val = T.Evaluate((1, 2, 3));
```

**Component access:**

```csharp
ScalarField Txy = T.Component(0, 1);          // Tᵢⱼ as ScalarField
VectorField row0 = T.Row(0);                   // (T₀₁, T₀₂, T₀₃)
```

**Divergence** — $\nabla \cdot \mathbf{T} \to \text{VectorField}$, where $(\nabla \cdot \mathbf{T})_i = \sum_j \frac{\partial T_{ij}}{\partial x_j}$:

```csharp
VectorField forceDensity = T.Divergence();
Vector f = forceDensity.Curl((1, 2, 3));       // chain with existing operators
```

**Trace and contractions:**

```csharp
ScalarField tr = T.Trace();                    // Σᵢ Tᵢᵢ
VectorField Tv = T.Contract(velocityField);    // T·v
ScalarField energy = T.DoubleContract(strainField); // T : S = Σᵢⱼ TᵢⱼSᵢⱼ
```

**Jacobian** — gradient of a vector field → TensorField:

```csharp
var F = new VectorField(r => r.x * r.y, r => r.z, r => r.x);
TensorField J = TensorField.FromJacobian(F);  // (∇F)ᵢⱼ = ∂Fᵢ/∂xⱼ
```

**Arithmetic:**

```csharp
TensorField sum = T + T;
TensorField scaled = 2.0 * T;
TensorField transposed = T.Transpose();
TensorField weighted = scalarField * T;       // ScalarField × TensorField
```
