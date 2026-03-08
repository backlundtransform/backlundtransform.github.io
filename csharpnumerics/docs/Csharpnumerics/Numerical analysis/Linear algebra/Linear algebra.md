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

**Gauss Elimination**

```csharp
var matrix = new Matrix(new double[,] { { 1, -2, 3 }, { -1, 1, -2 }, { 2, -1, -1 } });
var vector = new VectorN(new double[] { 7, -5, 4 });
var solution = matrix.GaussElimination(vector);
```



