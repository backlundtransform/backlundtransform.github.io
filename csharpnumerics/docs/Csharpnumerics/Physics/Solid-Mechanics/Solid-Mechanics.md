---
sidebar_label: "🔩 Solid Mechanics"
---

The `SolidExtensions` class provides solid mechanics calculations centred on the **Euler–Bernoulli beam equation** $EI u^{\prime\prime\prime\prime} = q$, plus Hooke's law, second moment of area, the flexure formula, and analytical beam deflections.

**Namespace:** `CSharpNumerics.Physics.SolidMechanics`

## 🔩 Stress & Strain (Hooke's Law)

| Formula | Method | Description |
|---------|--------|-------------|
| $\sigma = F/A$ | `NormalStress` | Axial stress |
| $\varepsilon = \sigma/E$ | `NormalStrain` | Axial strain |
| $\sigma = E\varepsilon$ | `HookesLaw` | Hooke's law |
| $\tau = V/A$ | `ShearStress` | Average shear stress |
| $G = E / 2(1+\nu)$ | `ShearModulus` | Shear modulus |

```csharp
double sigma = force.NormalStress(area);        // σ = F/A
double eps   = sigma.NormalStrain(200e9);        // ε = σ/E  (steel)
double G     = (200e9).ShearModulus(0.3);         // ≈ 76.9 GPa
```

## 📐 Second Moment of Area

| Cross-Section | Formula | Method |
|---------------|---------|--------|
| Solid rectangle | $I = bh^3/12$ | `RectangularSecondMoment` |
| Solid circle | $I = \pi r^4/4$ | `CircularSecondMoment` |
| Hollow tube | $I = \pi(R^4 - r^4)/4$ | `TubularSecondMoment` |

```csharp
double I_rect = (0.10).RectangularSecondMoment(0.10);  // 8.33e-6 m⁴
double I_circ = (0.05).CircularSecondMoment();          // 4.91e-7 m⁴
double I_tube = (0.05).TubularSecondMoment(0.04);       // hollow tube
```

## 📏 Euler–Bernoulli Beam Equation

$$EI \frac{d^4 u}{dx^4} = q(x)$$

| Relation | Method | Description |
|----------|--------|-------------|
| $M = EI\kappa$ | `BendingMoment` | Moment from curvature |
| $\sigma = My/I$ | `BendingStress` | Flexure formula |
| $V = EI u'''$ | `BeamShearForce` | Shear from 3rd derivative |
| $q = EI u''''$ | `BeamLoadIntensity` | Load from 4th derivative |
| $r = EI d^4u/dx^4 - q$ | `EulerBernoulliResidual` | FD residual via `Biharmonic1D` |

```csharp
double M     = E.BendingMoment(I, curvature);          // M = EIκ
double sigma = M.BendingStress(y: 0.05, I);            // σ = My/I
double q     = E.BeamLoadIntensity(I, d4u);             // q = EIu⁗

// Discrete residual (should ≈ 0 for correct deflection)
var residual = u.EulerBernoulliResidual(E * I, dx, qVector);
```

## 📉 Analytical Beam Deflections

| Case | Max Deflection | Method |
|------|---------------|--------|
| Cantilever + point load P | $\delta = PL^3 / 3EI$ | `CantileverPointLoadMaxDeflection` |
| Cantilever + uniform q | $\delta = qL^4 / 8EI$ | `CantileverUniformLoadMaxDeflection` |
| Simply supported + uniform q | $\delta = 5qL^4 / 384EI$ | `SimplySupportedUniformLoadMaxDeflection` |
| Simply supported + midpoint P | $\delta = PL^3 / 48EI$ | `SimplySupportedPointLoadMaxDeflection` |

Full deflection curves are also available: `CantileverPointLoadDeflection(P, L, EI, x)`, etc.

```csharp
// Steel cantilever: 10×10 cm, 1 m, 1 kN tip load
double EI  = 200e9 * (0.10).RectangularSecondMoment(0.10);
double max = (1000.0).CantileverPointLoadMaxDeflection(1.0, EI);  // PL³/(3EI)

// Deflection curve
for (double x = 0; x <= 1.0; x += 0.1)
    Console.WriteLine($"x={x:F1}  u={1000.0.CantileverPointLoadDeflection(1.0, EI, x):E3} m");
```
