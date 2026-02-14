---
sidebar_label: "🌐 Vector Fields"
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
