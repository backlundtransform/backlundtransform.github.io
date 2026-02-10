---
sidebar_label: "📘 Algebra"
---

## 📘 Numeric Extensions

**Factorial**

```csharp
int result = 5.Factorial(); // 120
```
**Root Finding (Newton–Raphson)**

```csharp
Func<double, double> func = x => Math.Pow(x, 2) - 4;
double root = func.NewtonRaphson(); // 2
```

---
## 🧩 Complex Numbers

```csharp
var a = new ComplexNumber(3, 2);
var b = new ComplexNumber(5, 3);

var sum = a + b;
var product = a * b;
var power = a.Pow(2); // 5 + 12i
```