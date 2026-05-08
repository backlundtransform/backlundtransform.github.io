---
sidebar_label: "🕸️ Finite Element"
---

Finite-element primitives for 1D beams/bars and 2D plane elasticity.

```csharp
using CSharpNumerics.Numerics.FiniteElement;
```

---

## 📏 1D Elements

---

## 🧱 Elements

| Element | DOFs/Node | Total DOFs | Stiffness |
|---------|-----------|------------|-----------|
| `BarElement` | 1 (u) | 2 | $(EA/L)\begin{bmatrix}1&-1\\-1&1\end{bmatrix}$ |
| `BeamElement` | 2 (w, θ) | 4 | Standard 4×4 Hermite cubic |

---

## ⚙️ 1D Mesh + Assemble + Solve

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

## 🪵 1D Bar Element Example

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

---

## 🔺 2D Plane Elasticity

| Type | Nodes | DOFs/Node | Notes |
|------|-------|-----------|-------|
| `TriElement` | 3 | 2 (`ux`, `uy`) | Constant strain triangle (CST) |
| `QuadElement` | 4 | 2 (`ux`, `uy`) | Bilinear Q4 with 2×2 Gauss integration |

Use `Mesh2D` to generate a structured rectangular mesh and `Assembler2D` to build and solve the global system with sparse storage and preconditioned conjugate gradient.

```csharp
using CSharpNumerics.Numerics.FiniteElement;
using CSharpNumerics.Numerics.FiniteElement.Enums;

double width = 2.0, height = 0.5;
int nx = 20, ny = 6;

var mesh = new Mesh2D(width, height, nx, ny, ElementType.Tri);
var asm = new Assembler2D(mesh, new TriElement(), E: 200e9, nu: 0.3, thickness: 0.01, planeStress: true);
asm.Assemble();

var bc = new Dictionary<int, double>();
for (int iy = 0; iy <= ny; iy++)
{
    int node = mesh.GetNodeIndex(0, iy);
    bc[node * 2] = 0.0;
    bc[node * 2 + 1] = 0.0;
}

int tipNode = mesh.GetNodeIndex(nx, ny / 2);
asm.ApplyNodalLoad(tipNode, direction: 1, value: -1000.0);

VectorN u = asm.Solve(bc);
```

---

## 🗄️ Sparse Matrix Backend

`SparseMatrix` stores global systems in CSR format and provides:

| Feature | API |
|---------|-----|
| Triplet assembly | `SparseMatrix.FromTriplets(...)` |
| Sparse matrix-vector product | `Multiply(VectorN x)` |
| Diagonal extraction | `Diagonal()` |
| Dirichlet elimination | `ApplyDirichlet(...)` |
| Iterative solve | `SolvePCG(...)` |