---
sidebar_label: "🧮 Linear Algebra"
---

## 🧭 Vector

```csharp
var a = new Vector(5, 3, 0);
var b = new Vector(2, 6, 0);

var dot = a.Dot(b);
var cross = a.Cross(b);
```

From spherical coordinates:

```csharp
var v = Vector.FromSphericalCoordinates(radius, inclination, azimuth);
```

Vector of any length:

```csharp
double[] ydata =
{
    1,3,5,7,9,11,13,15,17,19
};
var y = new VectorN(ydata);
```

---

## 🧮 Matrix

```csharp
var A = new Matrix(new double[,] { { 1, 3, 7 }, { 5, 2, 9 } });
var transpose = A.Transpose();
var det = A.Determinant();
var inv = A.Inverse();
```

Arithmetic:

```csharp
var B = new Matrix(new double[,] { { 2, 5, 1 }, { 4, 3, 7 } });
var sum = A + B;
var product = A * B;
```

With vector:

```csharp
var x = new Vector(2, 1, 3);
var y = A * x;
```

---

## 📦 Tensor (multi-dimensionell)

```csharp
var tensor = new Tensor(2, 3);

tensor[0, 0] = 1;
tensor[0, 1] = 2;
tensor[0, 2] = 3;
tensor[1, 0] = 4;
tensor[1, 1] = 5;
tensor[1, 2] = 6;

tensor.Fill(10);

var tensorB = new Tensor(2, 3);
tensorB.Fill(5);

var sum = tensor + tensorB;
var diff = tensor - tensorB;
var prod = tensor * tensorB;
var div = tensor / tensorB;
```

Dot product:

```csharp
var tensor1D = new Tensor(3);
tensor1D.Values[0] = 1;
tensor1D.Values[1] = 2;
tensor1D.Values[2] = 3;

var tensor1D2 = new Tensor(3);
tensor1D2.Values[0] = 4;
tensor1D2.Values[1] = 5;
tensor1D2.Values[2] = 6;

double dot = tensor1D.Dot(tensor1D2); // 1*4 + 2*5 + 3*6 = 32
```

---



`ComplexVector`, `ComplexVectorN`, and `ComplexMatrix` mirror the real-valued types with full complex number support. Existing real types convert implicitly — no API breakage.

## 🌐 ComplexVector 

```csharp
var a = new ComplexVector(
    new ComplexNumber(1, 2),
    new ComplexNumber(3, 0),
    new ComplexNumber(0, -1));

var b = new ComplexVector(
    new ComplexNumber(2, 1),
    new ComplexNumber(0, 3),
    new ComplexNumber(1, 1));

var sum = a + b;
var dot = a.Dot(b);                  // standard complex dot product
var hermitian = a.HermitianDot(b);   // ⟨a,b⟩ = Σ conj(aᵢ)·bᵢ
var cross = a.Cross(b);

double mag = a.GetMagnitude();       // hermitian norm: √(Σ|xᵢ|²)
var conj = a.GetConjugate();
var unit = a.GetUnitVector();

// Implicit from real Vector
Vector v = new Vector(1, 2, 3);
ComplexVector cv = v;                // imaginary parts are zero
```

Vector of any length:

```csharp
var v = new ComplexVectorN(new ComplexNumber[]
{
    new ComplexNumber(1, 2),
    new ComplexNumber(3, -1),
    new ComplexNumber(0, 4)
});
```

## 🧩 ComplexMatrix 

```csharp
var A = new ComplexMatrix(new ComplexNumber[,]
{
    { new ComplexNumber(1, 0), new ComplexNumber(0, 1) },
    { new ComplexNumber(0, -1), new ComplexNumber(1, 0) }
});

var transpose = A.Transpose();
var dagger = A.ConjugateTranspose();  // hermitian adjoint (A†)
var det = A.Determinant();            // returns ComplexNumber
var inv = A.Inverse();

// Arithmetic
var B = new ComplexNumber(2, 0) * A;
var C = A * A;

// Implicit from real Matrix
Matrix real = new Matrix(new double[,] { { 1, 2 }, { 3, 4 } });
ComplexMatrix complex = real;
```

---

## 📏 Linear Systems

Solve $A\mathbf{x} = \mathbf{b}$, eigenvalues $A\mathbf{v} = \lambda\mathbf{v}$:

```csharp
var result = A.LinearSystemSolver(b);
var eigenValues = A.EigenValues();
var eigenVector = A.EigenVector(eigenValue);
var dominant = A.DominantEigenVector();
```

> Since **4.1.0**, `LinearSystemSolver` and `Matrix.Inverse()` solve via LU decomposition internally — same API, O(n³) instead of cofactor expansion.

**Gauss Elimination**

```csharp
var matrix = new Matrix(new double[,] { { 1, -2, 3 }, { -1, 1, -2 }, { 2, -1, -1 } });
var vector = new VectorN(new double[] { 7, -5, 4 });
var solution = matrix.GaussElimination(vector);
```

---

## 🧩 Matrix Decompositions

Factorizations live in `CSharpNumerics.Numerics.LinearAlgebra` and are **cached** — factor once, solve for many right-hand sides.

**LU decomposition** — partial pivoting, $PA = LU$:

```csharp
using CSharpNumerics.Numerics.LinearAlgebra;

var A = new Matrix(new double[,] { { 2, 1, -1 }, { -3, -1, 2 }, { -2, 1, 2 } });
var lu = A.Lu();

var x = lu.Solve(new VectorN(new double[] { 8, -11, -3 }));  // (2, 3, -1)
var det = lu.Determinant();
var inv = lu.Inverse();

var L = lu.Lower;          // unit lower triangular
var U = lu.Upper;          // upper triangular
var P = lu.PermutationMatrix;
bool singular = lu.IsSingular;
```

**Cholesky decomposition** — $A = LL^T$ for symmetric positive definite matrices (≈2× faster than LU):

```csharp
var spd = new Matrix(new double[,] { { 4, 12, -16 }, { 12, 37, -43 }, { -16, -43, 98 } });
var chol = spd.Cholesky();

bool ok = chol.IsPositiveDefinite;   // symmetry + positive pivots
var y = chol.Solve(new VectorN(new double[] { 1, 2, 3 }));
var L = chol.Lower;                  // { {2,0,0}, {6,1,0}, {-8,5,3} }
```

**QR decomposition** — Householder reflections, $A = QR$. For overdetermined systems `Solve` returns the **least squares** solution $\min \lVert A\mathbf{x} - \mathbf{b} \rVert$:

```csharp
// Fit a line through (1,6), (2,0), (3,0) — no normal equations needed
var A = new Matrix(new double[,] { { 1, 1 }, { 1, 2 }, { 1, 3 } });
var qr = A.Qr();

var coeffs = qr.Solve(new VectorN(new double[] { 6, 0, 0 }));  // intercept 8, slope -3
var Q = qr.Q;              // orthonormal columns
var R = qr.R;              // upper triangular
bool fullRank = qr.IsFullRank;
```

**Eigenvalue decomposition** — $AV = VD$:

```csharp
var eigen = spd.Eigen();

// Symmetric: real eigenvalues in ascending order, orthonormal eigenvectors
double[] values = eigen.RealEigenvalues;
Matrix V = eigen.EigenVectors;       // eigenvector k in column k
Matrix D = eigen.DiagonalMatrix;

// Non-symmetric: complex conjugate pairs
var rotation = new Matrix(new double[,] { { 0, -1 }, { 1, 0 } });
var e = rotation.Eigen();
double[] re = e.RealEigenvalues;      // { 0, 0 }
double[] im = e.ImaginaryEigenvalues; // { +1, -1 }
```



