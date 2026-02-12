---
sidebar_label: "📘 Algebra"
---

## 🧩 Complex Numbers

```csharp
var a = new ComplexNumber(3, 2);
var b = new ComplexNumber(5, 3);

var sum = a + b;
var product = a * b;
var power = a.Pow(2); // 5 + 12i
```

**Exponential form (Euler's formula)**

```csharp
new ComplexNumber(0, Math.PI).Exponential(); // -1
```