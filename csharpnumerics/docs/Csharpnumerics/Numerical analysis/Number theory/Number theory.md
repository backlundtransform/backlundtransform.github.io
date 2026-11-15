---
sidebar_label: "🔢 Number Theory"
---

## 🔢 Number Theory

Integer and modular arithmetic, primality and factorisation, continued fractions, finite fields and the number theoretic transform, in `CSharpNumerics.Numerics.NumberTheory`. `long` is the primary type, with `BigInteger` overloads where large values matter. Results of modular operations are always in $[0, m)$, also for negative inputs.

```csharp
using CSharpNumerics.Numerics.NumberTheory;

long g = EuclideanAlgorithm.Gcd(84, 36);                // 12
long p = ModularArithmetic.Pow(4, 13, 497);             // 445
bool prime = PrimalityTesting.IsPrime(2305843009213693951); // true (2⁶¹ − 1)
var factors = IntegerFactorization.Factor(360);         // (2, 3), (3, 2), (5, 1)
```

:::warning Not for cryptography
Nothing here is constant-time, and random choices use `System.Random`. The module is meant for numerical work, simulation and teaching. Use `System.Security.Cryptography` for anything secret.
:::

---

### ➗ Euclidean Algorithm & Modular Arithmetic

```csharp
var (d, x, y) = EuclideanAlgorithm.ExtendedGcd(240, 46);     // (2, -9, 47): 240·(−9) + 46·47 = 2
long l = EuclideanAlgorithm.Lcm(4, 6);                       // 12

long m   = ModularArithmetic.Mod(-3, 7);                     // 4
long inv = ModularArithmetic.Inverse(3, 11);                 // 4
long big = ModularArithmetic.MulMod(long.MaxValue - 1, long.MaxValue - 2, long.MaxValue); // 2, no overflow

long phi    = ModularArithmetic.Totient(36);                 // 12
long lambda = ModularArithmetic.CarmichaelLambda(561);       // 80
long root   = ModularArithmetic.PrimitiveRoot(7);            // 3
long order  = ModularArithmetic.MultiplicativeOrder(2, 7);   // 3
int  jacobi = ModularArithmetic.Jacobi(2, 15);               // 1
long sqrt   = ModularArithmetic.SquareRoot(10, 13);          // 6, since 6² = 36 ≡ 10
```

`MulMod` never overflows for any `long` modulus: it multiplies directly when $m \le 3\,037\,000\,499$, uses `UInt128` on .NET 8+, and double-and-add on netstandard2.1. `SquareRoot` uses Tonelli–Shanks and returns the smaller of the two roots.

**Chinese Remainder Theorem**

```csharp
var (r, mod) = ChineseRemainderTheorem.Solve(new long[] { 2, 3, 2 }, new long[] { 3, 5, 7 }); // (23, 105)

// Moduli that are not coprime: x ≡ 1 (mod 4), x ≡ 3 (mod 6) → x ≡ 9 (mod 12)
bool ok = ChineseRemainderTheorem.TrySolve(new long[] { 1, 3 }, new long[] { 4, 6 }, out long rem, out long lcm);
```

`Solve` requires pairwise coprime moduli and throws otherwise. `TrySolve` handles any moduli and returns `false` when the system has no solution.

---

### 🎯 ModInt & Extension Methods

`ModInt` is a residue value type with the modulus attached. There are no implicit conversions, and combining residues with different moduli throws.

```csharp
var a = new ModInt(3, 7);
var b = new ModInt(5, 7);
ModInt sum  = a + b;       // 1 (mod 7)
ModInt quo  = a / b;       // 2 (mod 7)
ModInt ainv = a.Pow(-1);   // 5 (mod 7)

84L.Gcd(36);               // 12
4L.ModPow(13, 497);        // 445
3L.ModInverse(11);         // 4
1000000007L.IsPrime();     // true
```

The `long` extensions need an `L` suffix: C# does not convert the receiver of an extension method, so `79.IsPrime()` binds to the existing `int` overload in [Numeric](../Numeric/Numeric.md), which now uses the same Miller–Rabin test.

---

### 🔍 Primality & Factorisation

```csharp
PrimalityTesting.IsPrime(561);                                  // false (Carmichael number)
PrimalityTesting.IsProbablePrime(BigInteger.Pow(2, 127) - 1);   // true
PrimalityTesting.NextPrime(100);                                // 101
PrimalityTesting.PreviousPrime(100);                            // 97

int[]  small  = PrimeSieve.PrimesUpTo(30);                      // 2, 3, 5, …, 29
long[] window = PrimeSieve.PrimesInRange(1_000_000_000, 1_000_000_100); // 1000000007, 1000000009, …

var semi    = IntegerFactorization.Factor(1000000016000000063); // (1000000007, 1), (1000000009, 1)
long[] pf   = IntegerFactorization.PrimeFactors(360);           // 2, 2, 2, 3, 3, 5
long[] divs = IntegerFactorization.Divisors(12);                // 1, 2, 3, 4, 6, 12
IntegerFactorization.DivisorCount(360);                         // 24
IntegerFactorization.DivisorSum(12);                            // 28
IntegerFactorization.Mobius(30);                                // −1
```

| Method | Algorithm | Range |
|--------|-----------|-------|
| `IsPrime(long)` | Miller–Rabin with the first 12 primes as witnesses | Deterministic for every `long` |
| `IsProbablePrime(BigInteger, rounds, seed)` | Miller–Rabin with random witnesses | Error $\le 4^{-\text{rounds}}$ |
| `PrimesUpTo(int)` | Odd-only sieve of Eratosthenes | Up to `int.MaxValue` |
| `PrimesInRange(low, high)` | Segmented sieve, Miller–Rabin for short ranges | Up to `long.MaxValue`, range length ≤ 2³¹ |
| `Factor(long)` | Trial division below 1000, then Pollard–Brent rho | Every `long` |

---

### 🪜 Continued Fractions

$$x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cdots}} = [a_0; a_1, a_2, \ldots]$$

```csharp
long[] cf = ContinuedFractions.Expand(415, 93);          // [4; 2, 6, 7]
long[] pi = ContinuedFractions.Expand(Math.PI, 5);       // [3; 7, 15, 1, 292]
var conv  = ContinuedFractions.Convergents(pi);          // 3/1, 22/7, 333/106, 355/113, 103993/33102
var best  = ContinuedFractions.BestRationalApproximation(Math.PI, 1000);      // (355, 113)
var sqrt2 = ContinuedFractions.BestRationalApproximation(Math.Sqrt(2), 100);  // (140, 99)
```

A `double` is expanded exactly, as the rational number it stores, so only the first terms match the real number it approximates (13 terms for `Math.PI`). `BestRationalApproximation` also considers semiconvergents, so the result is the closest fraction whose denominator is within the bound. Shor's algorithm in [Quantum Mechanics](../../Physics/Quantum-Mechanics/Quantum-Mechanics.md) uses the convergents to recover a period from a measurement.

---

### 🧩 Finite Fields

`PrimeField` is GF(p) with `ModInt` elements. `ExtensionField` is $\mathrm{GF}(p^n) = \mathrm{GF}(p)[x]/(f)$ for an irreducible polynomial $f$ of degree $n$; its elements are `ExtensionFieldElement` values with the usual operators. Both implement `IFiniteField<TElement>`.

```csharp
var gf7 = new PrimeField(7);
ModInt g = gf7.PrimitiveElement;                             // 3 (mod 7)
ModInt h = gf7.Inverse(gf7.Element(3));                      // 5 (mod 7)

// GF(2⁸) with the AES polynomial x⁸ + x⁴ + x³ + x + 1 (0x11B)
var aes = new ExtensionField(PrimeFieldPolynomial.FromInteger(0x11B, 2));
var product  = aes.Element(0x57) * aes.Element(0x83);        // 0xC1
long inverse = aes.Element(0x53).Inverse().ToInt64();        // 0xCA
Console.WriteLine(aes.Element(0x57));                        // x^6 + x^4 + x^2 + x + 1 in GF(2^8)

// Polynomial found automatically: the first primitive polynomial, so Root generates the group
var gf9   = new ExtensionField(3, 2);                        // x^2 + x + 2 (mod 3)
var alpha = gf9.Root;                                        // α = x mod f
long ord  = gf9.MultiplicativeOrder(alpha);                  // 8
```

`Element(index)` reads the coefficients as the base-p digits of the index, constant term first, which is the usual hexadecimal notation for GF(2⁸). Fields with at most 2¹⁶ elements multiply and invert through log/antilog tables; larger fields use polynomial arithmetic and the extended Euclidean algorithm.

| Type | Description |
|------|-------------|
| `IFiniteField<TElement>` | `Characteristic`, `Degree`, `Order`, `Zero`, `One`, `PrimitiveElement`, `Add`, `Subtract`, `Negate`, `Multiply`, `Divide`, `Inverse`, `Pow`, `Elements()` |
| `PrimeField` | GF(p) over `ModInt`, plus `Element(value)` and `MultiplicativeOrder` |
| `ExtensionField` | GF(pⁿ) from an irreducible polynomial or from `(p, n)`, plus `Root`, `Element(index)`, `FromCoefficients`, `FromPolynomial`, `MultiplicativeOrder` |
| `ExtensionFieldElement` | `+ − × ÷`, `Pow`, `Inverse`, `Coefficients`, `ToInt64`, `ToPolynomial` |

Division by zero and the inverse of zero throw `DivideByZeroException`.

**Polynomials over GF(p)**

```csharp
var f = new PrimeFieldPolynomial(new long[] { 1, 2, 1 }, 3);   // x² + 2x + 1, constant term first
var h = new PrimeFieldPolynomial(new long[] { 1, 1 }, 3);      // x + 1
var (q, r) = PrimeFieldPolynomial.DivRem(f, h);                // (x + 1, 0)
var gcd = PrimeFieldPolynomial.Gcd(f, h);                      // x + 1 (monic)
var (d, s, t) = PrimeFieldPolynomial.ExtendedGcd(f, h);        // f·s + h·t = d
long value = f.Evaluate(2);                                    // 0
bool irreducible = f.IsIrreducible();                          // false: (x + 1)²

PrimeFieldPolynomial.FindIrreducible(2, 8);                    // x^8 + x^4 + x^3 + x + 1 (0x11B)
PrimeFieldPolynomial.FindPrimitive(2, 8);                      // x^8 + x^4 + x^3 + x^2 + 1 (0x11D)
```

Irreducibility uses Rabin's test: $f$ of degree $n$ is irreducible exactly when $x^{p^n} \equiv x \pmod f$ and $\gcd(x^{p^{n/q}} - x, f) = 1$ for every prime $q$ dividing $n$. A primitive polynomial is irreducible and has $x$ of order $p^n - 1$, which needs $p^n - 1$ to fit in a `long` so it can be factored.

**Generic code over any finite field**

```csharp
using CSharpNumerics.Numerics.NumberTheory.Interfaces;

static T DotProduct<T>(IFiniteField<T> field, T[] u, T[] v)
{
    var sum = field.Zero;
    for (int i = 0; i < u.Length; i++)
        sum = field.Add(sum, field.Multiply(u[i], v[i]));
    return sum;
}
```

---

### 📡 Number Theoretic Transform

The NTT is the Fourier transform over GF(p):

$$X_k = \sum_{j=0}^{n-1} x_j\,\omega^{jk} \bmod p, \qquad \omega = g^{(p-1)/n}$$

where $g$ is the smallest primitive root modulo $p$. The length $n$ must be a power of two dividing $p - 1$; the default prime $998244353 = 119 \cdot 2^{23} + 1$ allows lengths up to $2^{23}$. The arithmetic is exact, so convolutions have no rounding error.

```csharp
long[] spectrum = NumberTheoreticTransform.Forward(new long[] { 1, 2, 3, 4 });  // mod 998244353
long[] back     = NumberTheoreticTransform.Inverse(spectrum);                    // 1, 2, 3, 4

// (1 + 2x + 3x²)(4 + 5x) = 4 + 13x + 22x² + 15x³
long[] exact = NumberTheoreticTransform.ExactConvolution(new long[] { 1, 2, 3 }, new long[] { 4, 5 });
long[] modp  = NumberTheoreticTransform.Convolution(new long[] { 1, 2, 3 }, new long[] { 4, 5 }, 7681);

// Also available as extensions next to the FFT (namespace CSharpNumerics.Numerics):
long[] same = new long[] { 1, 2, 3 }.ExactConvolution(new long[] { 4, 5 });
```

`ExactConvolution` runs the NTT modulo as many 31-bit primes as the input sizes require (up to eight) and combines the results with Garner's algorithm. Any `long` inputs work as long as each result coefficient fits in a `long`; otherwise it throws `OverflowException`.

| | FFT (`FastFourierTransform`) | NTT (`NumberTheoreticTransform`) |
|---|---|---|
| Values | `double` / `ComplexNumber` | Integers modulo a prime |
| Length | Power of two (`DiscreteFourierTransform`: any) | Power of two dividing $p - 1$ |
| Error | Floating-point rounding | Exact |
| Typical use | Spectra, filtering | Integer and polynomial multiplication |
