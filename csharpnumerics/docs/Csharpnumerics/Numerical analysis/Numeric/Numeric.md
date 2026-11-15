---
sidebar_label: "📘 Numeric"
---

## 📘 Numeric Extensions

**Factorial**

```csharp
int result = 5.Factorial(); // 120
```

**Root Finding (Newton–Raphson)** — $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$

```csharp
Func<double, double> func = x => Math.Pow(x, 2) - 4;
double root = func.NewtonRaphson(); // 2
```

See [Root Finding](../Root%20finding/Root%20finding.md) for Brent, bisection and the secant method, and for checking whether a solve actually converged.

---

## 🔢 Number Theory

```csharp
bool prime = 79.IsPrime();                  // true
int[] factors = 78.GetPrimeFactors();       // [2, 3, 13]
bool happy = 19.IsHappy();                  // true
bool perfect = 6.IsPerfectNumber();         // true
int decimals = 0.01.GetDecimalPlaces();     // 2
```

`IsPrime` and `GetPrimeFactors` use deterministic Miller–Rabin and Pollard–Brent rho. See [Number Theory](../Number%20theory/Number%20theory.md) for modular arithmetic, `long` and `BigInteger` primality, factorisation, continued fractions and finite fields.

---

## 📐 Trigonometry

```csharp
double rad = 180.0.DegreeToRadians(); // π
```
