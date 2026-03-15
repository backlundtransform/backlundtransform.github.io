Model radioactive isotopes, decay chains, radiation dose, and couple them to the dispersion pipeline for fallout scenarios that produce activity (Bq) and dose (Sv) maps alongside concentration.

```csharp
using CSharpNumerics.Physics.Materials.Nuclear.Isotopes;
using CSharpNumerics.Physics.Materials.Nuclear.Decay;
using CSharpNumerics.Physics.Materials.Nuclear.DecayChains;
using CSharpNumerics.Physics.Materials.Nuclear.RadiationDose;
```

---

## 🧪 Isotopes & Library

```csharp
// Built-in isotopes
Isotope cs = Isotope.Cs137;           // Cs-137: t½ = 30.17 years
Isotope iodine = Isotope.I131;        // I-131: t½ = 8.02 days

// Lookup by name
Isotope sr = IsotopeLibrary.Get("Sr90");
bool found = IsotopeLibrary.TryGet("Co60", out Isotope co);

// Properties
double halfLife = cs.HalfLifeSeconds;       // ~9.51e8 s
double lambda = cs.Lambda;                   // decay constant (ln2/t½)
double activity = cs.SpecificActivityBqKg;   // Bq per kg
bool stable = Isotope.Ba137.IsStable;        // true

// Filter by element
var caesiumIsotopes = IsotopeLibrary.ByElement(55);  // Z = 55

// Register custom isotope at runtime
IsotopeLibrary.Register(new Isotope("Pu239", 94, 239, 7.6e11, 2.3e9,
    DecayMode.Alpha, 0.0, 4.4e-5, 0));
```

---

## ⚛️ Radioactive Decay

```csharp
// Simple decay
double a0 = Decay.Activity(massKg: 0.001, Isotope.Cs137);      // initial Bq
double aT = Decay.ActivityAtTime(a0, timeSeconds: 3600, Isotope.Cs137);
double remaining = Decay.RemainingMass(0.001, 3600, Isotope.Cs137);
```

**Decay chains** — Bateman equations for sequential decay:

```csharp
// Decay chain (Bateman equations)
var chain = DecayChain.Cs137Chain();    // Cs137 → Ba137m → Ba137
double[] masses = chain.Evolve(
    initialMasses: new[] { 1.0, 0.0, 0.0 },
    timeSeconds: 3600);

double[] activities = chain.EvolveActivity(
    new[] { 1.0, 0.0, 0.0 }, 3600);  // Bq for each isotope

// I-131 chain
var iChain = DecayChain.I131Chain();   // I131 → Xe131
```

---

## ☢️ Radiation Dose

```csharp
// Point-source dose rate (inverse-square law)
double svPerHour = RadiationDose.DoseRate(
    activityBq: 1e9, distanceM: 1.0, Isotope.Cs137);

// Ground-shine dose (deposition on surface)
double sv = RadiationDose.GroundShineDose(
    depositionBqM2: 1e6, Isotope.Cs137, timeSeconds: 3600);

// Inhalation dose
double inhDose = RadiationDose.InhalationDose(
    concentrationBqM3: 100,
    breathingRateM3s: RadiationDose.DefaultBreathingRate,
    exposureTimeSeconds: 3600,
    Isotope.Cs137);
```
