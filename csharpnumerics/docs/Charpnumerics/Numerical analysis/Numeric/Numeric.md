---
sidebar_label: "📘 Numeric"
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

## 🔢 Number Theory

```csharp
bool prime = 79.IsPrime();                  // true
int[] factors = 78.GetPrimeFactors();       // [2, 3, 13]
bool happy = 19.IsHappy();                  // true
bool perfect = 6.IsPerfectNumber();         // true
int decimals = 0.01.GetDecimalPlaces();     // 2
```

---

## 📐 Trigonometry

```csharp
double rad = 180.0.DegreeToRadians(); // π
```
