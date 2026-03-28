---
sidebar_label: "🧬 Materials Science"
---

Nuclear isotopes, radioactive decay chains, radiation dose, and hazardous chemical substances with toxicological thresholds and unit conversions.

```csharp
using CSharpNumerics.Physics.Materials.Nuclear.Isotopes;
using CSharpNumerics.Physics.Materials.Nuclear.Decay;
using CSharpNumerics.Physics.Materials.Nuclear.DecayChains;
using CSharpNumerics.Physics.Materials.Nuclear.RadiationDose;
using CSharpNumerics.Physics.Materials.Chemical;
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

---

## 🏭 Chemical Materials

**Namespace:** `CSharpNumerics.Physics.Materials.Chemical`

Model hazardous chemical substances with toxicological thresholds (IDLH, ERPG, LC50, TLV) and unit conversions (kg/m³ ↔ ppm). Integrates with the GIS dispersion pipeline via `.WithMaterial(Materials.Chemical("Cl2"))`.

**Built-in substances**

| Formula | Name | MW (g/mol) | IDLH (ppm) | ERPG-2 (ppm) | ERPG-3 (ppm) | Phase |
|---------|------|-----------|------------|---------------|---------------|-------|
| Cl₂ | Chlorine | 70.9 | 10 | 3 | 20 | Gas |
| NH₃ | Ammonia | 17.0 | 300 | 200 | 1000 | Gas |
| H₂S | Hydrogen Sulfide | 34.1 | 50 | 30 | 100 | Gas |
| CH₄ | Methane | 16.0 | N/A* | 5000 | 50000 | Gas |
| C₃H₈ | Propane | 44.1 | 2100 | 5000 | 17000 | Liquefied gas |

*Simple asphyxiant — no toxicity-based IDLH.

**Substance lookup & custom registration**

```csharp
using CSharpNumerics.Physics.Materials.Chemical;

// Static instances
ChemicalSubstance cl = ChemicalSubstance.Chlorine;
ChemicalSubstance nh3 = ChemicalSubstance.Ammonia;

// Library lookup (case-insensitive)
ChemicalSubstance h2s = ChemicalLibrary.Get("H2S");
bool found = ChemicalLibrary.TryGet("CH4", out ChemicalSubstance methane);

// Properties
double mw = cl.MolarMass;          // 70.906 g/mol
double idlh = cl.IDLH;             // 10 ppm
double erpg2 = cl.ERPG2;           // 3 ppm
double vapDens = cl.VapourDensity;  // 2.49 (heavier than air)

// Register custom substance
ChemicalLibrary.Register(new ChemicalSubstance(
    "COCl2", "Phosgene", "75-44-5",
    98.92, 3.4, 8.3, PhaseAtSTP.Gas,
    idlh: 2, erpg2: 0.5, erpg3: 1.5, lc50: 5,
    tlvTwa: 0.1, tlvStel: 0.3));
```

**Unit conversion (kg/m³ ↔ ppm)**

```csharp
// Convert mass concentration to ppm at 20°C, 1 atm
double ppm = cl.KgM3ToPpm(2.95e-6);   // ≈ 1 ppm
double kgm3 = cl.PpmToKgM3(10);        // IDLH in kg/m³
```

**GIS pipeline integration**

```csharp
using CSharpNumerics.Physics.Materials;

// Attach chemical material to a dispersion scenario
var result = RiskScenario
    .ForGaussianPlume(5.0)
    .FromSource(new Vector(0, 0, 10))
    .WithWind(5, new Vector(1, 0, 0))
    .WithStability(StabilityClass.D)
    .WithMaterial(Materials.Chemical("Cl2"))    // ← chemical
    .OverGrid(new GeoGrid(-500, 500, -500, 500, 0, 100, 50))
    .OverTime(0, 3600, 60)
    .RunSingle();

// Snapshot layers: "ppm" and "toxicDose" (ppm·s)
double[] ppmLayer = result.Snapshots[0].GetLayer("ppm");
double[] toxDose  = result.Snapshots[0].GetLayer("toxicDose");

// IDLH exceedance polygon (Cl2 IDLH = 10 ppm)
var idlhZone = result.GeneratePeakExposurePolygon(10, "ppm");

// ERPG-2 exceedance polygon (3 ppm)
var erpg2Zone = result.GeneratePeakExposurePolygon(3, "ppm");

// Integrated toxic dose polygon
var integratedZone = result.GenerateIntegratedExposurePolygon(
    threshold: 1000, layerName: "toxicDose");  // 1000 ppm·s
```
