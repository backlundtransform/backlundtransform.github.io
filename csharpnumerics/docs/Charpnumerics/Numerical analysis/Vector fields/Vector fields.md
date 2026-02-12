---
sidebar_label: "🌐 Vector Fields"
---

## 🌐 Vector Field

**Gradient**

```csharp
Func<Vector, double> f = p => Math.Pow(p.x, 2) * Math.Pow(p.y, 3);
var grad = f.Gradient((1, -2, 0));
```

**Laplacian**

```csharp
Func<Vector, double> f = p => p.x * p.x + p.y * p.y + p.z * p.z;
double laplacian = f.Laplacian((1, 2, 3)); // ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²
```

**Divergence**

```csharp
var field = new VectorField(p => Math.Sin(p.x * p.y),
                            p => Math.Cos(p.x * p.y),
                            p => Math.Exp(p.z));

double div = field.Divergence((1, 2, 2));
```

**Curl**

```csharp
var field = new VectorField(p => p.y, p => -p.x, p => 0);
var curl = field.Curl((1, 4, 2));
```
