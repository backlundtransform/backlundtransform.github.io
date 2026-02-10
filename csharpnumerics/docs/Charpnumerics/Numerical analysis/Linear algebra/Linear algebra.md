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

Arithmetic:

var B = new Matrix(new double[,] { { 2, 5, 1 }, { 4, 3, 7 } });
var sum = A + B;
var product = A * B;

With vector:

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


## 📏 Linear Systems

```csharp
var result = A.LinearSystemSolver(b);
var eigenValues = A.EigenValues();
```
```csharp
var matrix = new Matrix(new double[,] { { 1, -2, 3 }, { -1, 1, -2 }, { 2, -1, -1 } });

var vector = new VectorN(new double[] { 7, -5, 4 });

var result = matrix.LinearSystemSolver(vector);

```



