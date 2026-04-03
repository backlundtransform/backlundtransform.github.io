
The `EnvironmentalExtensions` class bridges `ScalarField` (∇, ∇²) and `VectorField` to atmospheric and aquatic transport physics — Gaussian plume dispersion, Fickian diffusion, advection, and the advection–diffusion equation.

**Namespace:** `CSharpNumerics.Physics.Environmental`

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

## 💨 Transient Gaussian Puff

Time-dependent dispersion of an instantaneous release that advects downwind — the puff centre moves at wind speed while the cloud expands according to Briggs σ(u·t):

```csharp
double Q = 5.0;  // emission rate (kg/s)
double releaseSeconds = 10.0;  // release duration → mass = Q·Δt

ScalarField C = Q.GaussianPuff(
    releaseSeconds: releaseSeconds,
    windSpeed: 10.0,
    stackHeight: 50,
    sourcePosition: new Vector(0, 0, 50),
    windDirection: new Vector(1, 0, 0),
    time: 30.0,                          // seconds since release
    stability: StabilityClass.D);

// At t=30s, puff centre is at x = u·t = 300 m downwind
double conc = C.Evaluate(new Vector(300, 0, 50));  // peak region

// Evaluate at different times for animation
for (double t = 10; t <= 120; t += 10)
{
    var puff = Q.GaussianPuff(releaseSeconds, 10, 50,
        new Vector(0, 0, 50), new Vector(1, 0, 0), t, StabilityClass.D);
    double peak = puff.Evaluate(new Vector(10 * t, 0, 50));
}
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

---

## 🔥 Rothermel Surface Fire Spread

The `RothermelModel` static class implements the **Rothermel (1972) surface fire spread model** — the standard used by FARSITE, FlamMap, and BehavePlus. All parameters are in **SI units**.

**Namespace:** `CSharpNumerics.Physics.Environmental.Fire`

**Rate of spread:**

$$R = \frac{I_R \cdot \xi \cdot (1 + \phi_w + \phi_s)}{\rho_b \cdot \varepsilon \cdot Q_{ig}}$$

```csharp
using CSharpNumerics.Physics.Environmental.Fire;
using CSharpNumerics.Physics.Materials.Fire;
using CSharpNumerics.Physics.Materials.Fire.Enums;

// Get a standard Anderson 13 fuel model
FuelModel grass = FuelLibrary.Get(FuelModelType.ShortGrass);

// Rate of spread on flat terrain, moderate wind
double ros = RothermelModel.RateOfSpread(
    fuel: grass,
    moistureContent: 0.05,     // 5% dead fuel moisture
    windSpeed: 2.24,           // m/s (≈ 5 mph mid-flame)
    slopeRadians: 0);          // flat
// ros ≈ 23–25 m/min for Short Grass

// Individual sub-equations
double IR   = RothermelModel.ReactionIntensity(grass, moistureContent: 0.05);
double phiW = RothermelModel.WindFactor(grass, midflameWindSpeed: 2.24);
double phiS = RothermelModel.SlopeFactor(
    RothermelModel.PackingRatio(grass), slopeRadians: Math.PI / 6);
double xi   = RothermelModel.PropagatingFluxRatio(grass);
double Qig  = RothermelModel.HeatOfPreignition(moistureContent: 0.05);
double eps  = RothermelModel.EffectiveHeatingNumber(grass);

// Flame length from Byram's fireline intensity correlation
double fl = RothermelModel.FlameLength(IR, ros);  // metres
```

**Sub-equation reference:**

| Method | Symbol | Unit |
|--------|--------|------|
| `ReactionIntensity` | $I_R$ | kJ/m²·min |
| `WindFactor` | $\phi_w$ | — |
| `SlopeFactor` | $\phi_s$ | — |
| `PropagatingFluxRatio` | $\xi$ | — |
| `HeatOfPreignition` | $Q_{ig}$ | kJ/kg |
| `EffectiveHeatingNumber` | $\varepsilon$ | — |
| `PackingRatio` | $\beta$ | — |
| `OptimalPackingRatio` | $\beta_{op}$ | — |
| `FlameLength` | $L$ | m |
