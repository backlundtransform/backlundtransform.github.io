---
sidebar_label: "🕸️ Finite Element"
---

Minimal 1D FEM primitives for bar (axial) and beam (Euler-Bernoulli bending) analysis.

```csharp
using CSharpNumerics.Numerics.FiniteElement;
```

---

## 🧱 Elements

| Element | DOFs/Node | Total DOFs | Stiffness |
|---------|-----------|------------|-----------|
| `BarElement` | 1 (u) | 2 | $(EA/L)\begin{bmatrix}1&-1\\-1&1\end{bmatrix}$ |
| `BeamElement` | 2 (w, θ) | 4 | Standard 4×4 Hermite cubic |

---

## ⚙️ Mesh + Assemble + Solve

```csharp
using CSharpNumerics.Numerics.FiniteElement;

// Cantilever beam: fixed at x=0, tip load P at x=L
double EI = 1e4, L = 1.0, P = 100.0;
int nElem = 10;

var mesh = new Mesh1D(0, L, nElem);
var elements = mesh.CreateElements((_, len) => new BeamElement(EI, len));

var asm = new Assembler1D(mesh, elements);
asm.Assemble();
asm.ApplyNodalLoad(nElem, 0, P); // tip force

var bc = new Dictionary<int, double>
{
    { 0, 0.0 }, // w = 0
    { 1, 0.0 }  // θ = 0
};

VectorN u = asm.Solve(bc);
double tipDeflection = u[nElem * 2]; // ≈ PL³/(3EI)
```

---

## 🪵 Bar Element Example

```csharp
// Fixed-free bar under axial load
double EA = 1000.0, L = 2.0, P = 100.0;
var mesh = new Mesh1D(0, L, 4);
var elements = mesh.CreateElements((_, len) => new BarElement(EA, len));

var asm = new Assembler1D(mesh, elements);
asm.Assemble();
asm.ApplyNodalLoad(4, 0, P);

var u = asm.Solve(new Dictionary<int, double> { { 0, 0.0 } });
// u[i] ≈ P * x[i] / EA
```