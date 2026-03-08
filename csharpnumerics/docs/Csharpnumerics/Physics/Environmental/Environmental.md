# 🌿 Environmental Extensions

The `EnvironmentalExtensions` class bridges `ScalarField` (∇, ∇²) and `VectorField` to atmospheric and aquatic transport physics — Gaussian plume dispersion, Fickian diffusion, advection, and the advection–diffusion equation.

```csharp
using CSharpNumerics.Physics;
```

---

## 🌫️ Gaussian Plume

Steady-state atmospheric dispersion from a point source with ground reflection:

```csharp
using CSharpNumerics.Physics.Enums;

double Q = 10.0; // emission rate (kg/s)
var source = new Vector(0, 0, 50);     // 50 m stack
var wind   = new Vector(1, 0, 0);      // wind along +X

// Using Pasquill–Gifford stability class
ScalarField C = Q.GaussianPlume(
    windSpeed: 5.0,
    stackHeight: 50,
    sourcePosition: source,
    windDirection: wind,
    stability: StabilityClass.D);        // neutral conditions

double conc = C.Evaluate(new Vector(500, 0, 0));  // concentration 500 m downwind
Vector grad = C.Gradient((500, 0, 0));             // concentration gradient
double lap  = C.Laplacian((500, 0, 0));            // ∇²C

// Quick ground-level centerline concentration
double Cgl = Q.GaussianPlumeGroundLevel(
    windSpeed: 5.0, stackHeight: 50,
    downwindDistance: 1000,
    stability: StabilityClass.C);
```

**Custom dispersion** — supply your own σy(x), σz(x):

```csharp
ScalarField C = Q.GaussianPlume(
    windSpeed: 5.0,
    stackHeight: 50,
    sourcePosition: source,
    windDirection: wind,
    sigmaY: x => 0.22 * x / Math.Sqrt(1 + 0.0001 * x),
    sigmaZ: x => 0.20 * x);
```

**Briggs dispersion parameters** are also available directly:

```csharp
double sy = EnvironmentalExtensions.BriggsSigmaY(1000, StabilityClass.D);
double sz = EnvironmentalExtensions.BriggsSigmaZ(1000, StabilityClass.D);
```

---

## 🧪 Diffusion (Fick's Laws)

```csharp
var C = new ScalarField(r => Math.Exp(-(r.x * r.x + r.y * r.y)));
double D = 0.01; // m²/s

// Fick's first law: diffusive flux J = −D∇C → VectorField
VectorField J = C.DiffusionFlux(D);

// Fick's second law: ∂C/∂t = D∇²C → ScalarField
ScalarField dCdt = C.DiffusionRate(D);
double rate = dCdt.Evaluate((0.5, 0, 0));
```

**Analytical point-source diffusion** — 3D Gaussian spreading:

```csharp
// Mass M released at origin, evaluated at time t
ScalarField C = 1.0.DiffusionPointSource(
    diffusionCoefficient: 0.01,
    time: 100,
    sourcePosition: new Vector(0, 0, 0));
// C(r,t) = M / (4πDt)^(3/2) · exp(−|r|² / (4Dt))
```

---

## 💨 Advection

```csharp
var C = new ScalarField(r => Math.Exp(-r.x * r.x));
var wind = new VectorField(r => 2.0, r => 0, r => 0);  // uniform 2 m/s along X

// ∂C/∂t = −v·∇C
ScalarField dCdt = C.AdvectionRate(wind);
```

---

## 🌊 Advection–Diffusion

Combined transport with optional source term:

```csharp
var C = new ScalarField(r => Math.Exp(-(r.x * r.x + r.y * r.y)));
var wind = new VectorField(r => 1.0, r => 0.5, r => 0);
double D = 0.1;

// ∂C/∂t = D∇²C − v·∇C
ScalarField dCdt = C.AdvectionDiffusionRate(wind, D);

// With source term S(r)
var source = new ScalarField(r => r.x > 0 && r.x < 1 ? 0.5 : 0);
ScalarField dCdt2 = C.AdvectionDiffusionRate(wind, D, source);
```

**Péclet number** — determines transport regime:

```csharp
double Pe = 2.0.PecletNumber(characteristicLength: 100, diffusionCoefficient: 0.1);
// Pe = 2000 → advection-dominated
```
