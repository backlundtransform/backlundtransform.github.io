---
sidebar_label: "🌌 Astrophysics"
---

Astronomical utilities for **distance conversions**, **Julian date**, **sidereal time**, **coordinate transforms**, and exoplanet-oriented transit/orbit calculations.

**Namespace:** `CSharpNumerics.Physics.Astro`

## 📏 Distance Conversions

Convert between light-years, parsecs, and astronomical units:

```csharp
double pc = 4.37.LightYearsToParsecs();      // Proxima Centauri ≈ 1.34 pc
double ly = 1.0.ParsecsToLightYears();        // 1 pc ≈ 3.26 ly
double au = 1.0.LightYearsToAU();             // 1 ly ≈ 63241 AU
double au2 = 1.0.ParsecsToAU();               // 1 pc ≈ 206265 AU
```

## 📅 Julian Date

Compute Julian Date and Julian centuries since J2000.0:

```csharp
var utc = new DateTime(2024, 6, 15, 21, 0, 0, DateTimeKind.Utc);

double jd = utc.ToJulianDate();               // Julian Date
double T  = utc.JulianCenturiesSinceJ2000();  // centuries since J2000.0
```

## ⏱️ Sidereal Time

Compute Greenwich and local sidereal time from UTC, or from local time with time zone:

```csharp
var utc = new DateTime(2024, 6, 15, 21, 0, 0, DateTimeKind.Utc);

double gmst = utc.GreenwichMeanSiderealTimeHours();       // GMST in hours
double gmstDeg = utc.GreenwichMeanSiderealTimeDegrees();   // GMST in degrees

// Local sidereal time (Stockholm: 18.07° E)
double lmst = utc.LocalMeanSiderealTimeHours(18.07);

// From local time + time zone + longitude
var local = new DateTime(2024, 6, 15, 23, 0, 0);
double lst = local.LocalSiderealTimeFromLocal(
    utcOffsetHours: 2.0,       // UTC+2 (CEST)
    longitudeDegrees: 18.07);  // Stockholm
```

## ⬆️ Horizontal → Equatorial (Altitude/Azimuth → RA/Dec)

Convert what you observe (altitude, azimuth) to sky coordinates (right ascension, declination):

```csharp
// Using explicit local sidereal time
var (ra, dec) = AstronomyExtensions.HorizontalToEquatorial(
    altitudeDegrees: 45.0,
    azimuthDegrees: 180.0,     // due south
    latitudeDegrees: 51.48,    // London
    localSiderealTimeDegrees: 120.0);

// Using UTC time and longitude (LST computed automatically)
var utc = new DateTime(2024, 3, 20, 22, 0, 0, DateTimeKind.Utc);
var (ra2, dec2) = AstronomyExtensions.HorizontalToEquatorial(
    altitudeDegrees: 45.0,
    azimuthDegrees: 180.0,
    latitudeDegrees: 51.48,
    longitudeDegrees: 0.0,     // Greenwich
    utc: utc);
```

## ⬇️ Equatorial → Horizontal (RA/Dec → Altitude/Azimuth)

Find where a star appears in the sky from your location:

```csharp
var (alt, az) = AstronomyExtensions.EquatorialToHorizontal(
    rightAscensionDegrees: 200.0,
    declinationDegrees: 30.0,
    latitudeDegrees: 59.33,    // Stockholm
    localSiderealTimeDegrees: 120.0);

// Or with UTC + position
var (alt2, az2) = AstronomyExtensions.EquatorialToHorizontal(
    rightAscensionDegrees: 200.0,
    declinationDegrees: 30.0,
    latitudeDegrees: 59.33,
    longitudeDegrees: 18.07,
    utc: utc);
```

## 📐 Angle Helpers

Convert between common astronomical angle formats:

```csharp
// Right ascension: hours/min/sec ↔ degrees
double deg = AstronomyExtensions.RightAscensionToDegrees(6, 30, 0);  // → 97.5°
var (h, m, s) = AstronomyExtensions.DegreesToRightAscension(97.5);    // → (6, 30, 0.0)

// Declination: degrees/arcmin/arcsec → decimal degrees
double dec = AstronomyExtensions.DeclinationToDegrees(-16, 42, 58);   // → -16.7161°
```

---

## 🪐 Transit Geometry

Compute geometric properties of planetary transits:

```csharp
using CSharpNumerics.Physics.Astro;

// Impact parameter: b = (a/R★) · cos(i)
double b = TransitGeometry.ImpactParameter(aOverRstar: 15.0, inclination: Math.PI / 2 - 0.01);

// Geometric transit probability: P = (R★ + Rp) / a
double prob = TransitGeometry.TransitProbability(a: 0.05, rStar: 0.01, rPlanet: 0.001);

// Total transit duration T14 (days)
double t14 = TransitGeometry.TransitDuration(
    period: 3.0, aOverRstar: 15.0, radiusRatio: 0.1, inclination: Math.PI / 2);

// Ingress/egress duration T12
double t12 = TransitGeometry.IngressDuration(
    period: 3.0, aOverRstar: 15.0, radiusRatio: 0.1, inclination: Math.PI / 2);

// Contact times T1-T4
var (t1, t2, t3, t4) = TransitGeometry.ContactTimes(
    period: 3.0, aOverRstar: 15.0, radiusRatio: 0.1, inclination: Math.PI / 2, epoch: 100.0);
```

## 🌗 Limb Darkening

Stellar limb darkening laws - intensity as a function of $\mu = \cos\theta$ (angle from disk centre):

```csharp
using CSharpNumerics.Physics.Astro;

double mu = 0.5;

// Linear: I(μ) = 1 − u1·(1 − μ)
double iLinear = LimbDarkening.Linear(mu, u1: 0.6);

// Quadratic: I(μ) = 1 − u1·(1−μ) − u2·(1−μ)^2
double iQuad = LimbDarkening.Quadratic(mu, u1: 0.4, u2: 0.2);

// Nonlinear four-parameter (Claret 2000)
double iNl = LimbDarkening.NonlinearFourParam(mu, c1: 0.5, c2: -0.2, c3: 0.3, c4: -0.1);

// Intensity profile for an array of μ values
double[] muArray = { 0.0, 0.25, 0.5, 0.75, 1.0 };
double[] profile = LimbDarkening.IntensityProfile(
    LimbDarkeningModel.Quadratic, new[] { 0.4, 0.2 }, muArray);
```

| Model | Enum | Coefficients |
|-------|------|-------------|
| Uniform | `LimbDarkeningModel.Uniform` | - |
| Linear | `LimbDarkeningModel.Linear` | u1 |
| Quadratic | `LimbDarkeningModel.Quadratic` | u1, u2 |
| Nonlinear 4-param | `LimbDarkeningModel.NonlinearFourParam` | c1, c2, c3, c4 |

## 🌘 Transit Model (Mandel & Agol 2002)

Analytical transit light curve - computes fractional flux drop as a planet crosses a limb-darkened stellar disk. Supports circular orbits with all limb darkening models.

```csharp
using CSharpNumerics.Physics.Astro;
using CSharpNumerics.Engines.Exoplanet.Data;

var model = new TransitModel();

// With stellar properties (a/R★ computed from Kepler's third law)
var p = new TransitParameters
{
    Period = 3.0,
    Epoch = 100.5,
    RadiusRatio = 0.1,
    ImpactParameter = 0.3,
    Duration = 0.15
};
var star = new StellarProperties { Radius = 1.0, Mass = 1.0 };

double[] times = /* observation times in days (BJD) */;
double[] flux = model.Evaluate(times, p, LimbDarkeningModel.Quadratic, new[] { 0.4, 0.2 }, star);
// flux[i] ≈ 1.0 out of transit, < 1.0 during transit

// Or specify orbital parameters directly (no stellar properties needed)
double[] flux2 = model.Evaluate(times,
    period: 3.0, epoch: 100.5, radiusRatio: 0.1,
    aOverRstar: 15.0, inclination: Math.PI / 2,
    LimbDarkeningModel.Quadratic, new[] { 0.4, 0.2 });
```

## 🛰️ Kepler Orbit

Orbital mechanics: Kepler's equation and third law.

```csharp
using CSharpNumerics.Physics.Astro;

// Solve Kepler's equation: M = E − e·sin(E) → true anomaly ν
double nu = KeplerOrbit.TrueAnomaly(meanAnomaly: 1.0, eccentricity: 0.3);

// Kepler's third law: a = (G·M★·P^2/(4π^2))^(1/3)
double a = KeplerOrbit.SemiMajorAxis(period: 259200, stellarMass: 1.989e30); // SI units
double aAU = KeplerOrbit.SemiMajorAxisAU(periodDays: 365.25, stellarMassSolar: 1.0); // ≈ 1 AU

// Mean orbital velocity: v = 2πa/P
double v = KeplerOrbit.OrbitalVelocity(a: 1.496e11, period: 3.156e7); // ≈ 29.8 km/s
```

---

### 🔭 Exoplanet Classification

Classify stars by temperature, compute habitable zones, and measure how Earth-like a planet is — all in `AstronomyExtensions`.

**Spectral Classification**

Map a stellar effective temperature to its Harvard spectral type (O B A F G K M L T Y):

```csharp
using CSharpNumerics.Physics.Astro;
using CSharpNumerics.Physics.Astro.Enums;

SpectralType sun   = AstronomyExtensions.GetSpectralFromTemp(5778);  // G
SpectralType hot   = AstronomyExtensions.GetSpectralFromTemp(30000); // O
SpectralType cool  = AstronomyExtensions.GetSpectralFromTemp(3000);  // M
SpectralType brown = AstronomyExtensions.GetSpectralFromTemp(1800);  // L
```

| Temperature (K) | Spectral Type |
|------------------|---------------|
| ≥ 30 000 | O |
| 10 000 – 29 999 | B |
| 7 500 – 9 999 | A |
| 6 000 – 7 499 | F |
| 5 200 – 5 999 | G |
| 3 700 – 5 199 | K |
| 2 400 – 3 699 | M |
| 1 300 – 2 399 | L |
| 550 – 1 299 | T |
| < 550 | Y |

**Habitable Zone (Goldilocks Zone)**

Compute the conservative habitable zone boundaries using the Kopparapu et al. (2013) parameterisation:

```csharp
// From luminosity (solar units) + effective temperature
var (inner, outer) = AstronomyExtensions.CalculateGoldilocksZone(
    stellarLuminositySolar: 1.0,
    effectiveTemperatureK: 5778);
// inner ≈ 0.99 AU, outer ≈ 1.69 AU — Earth sits comfortably inside

// From radius (solar radii) + temperature (luminosity derived via Stefan–Boltzmann)
var (inner2, outer2) = AstronomyExtensions.CalculateGoldilocksZoneFromRadius(
    stellarRadiusSolar: 1.0,
    effectiveTemperatureK: 5778);

// Red dwarf (Proxima Centauri-like)
var (innerM, outerM) = AstronomyExtensions.CalculateGoldilocksZone(0.04, 3200);
// innerM ≈ 0.19 AU, outerM ≈ 0.35 AU
```

**Earth Similarity Index (ESI)**

Quantify how Earth-like a planet is on a 0–1 scale (Schulze-Makuch et al. 2011). Uses four parameters normalised to Earth values:

```csharp
// Earth (reference) → ESI = 1.0
double esiEarth = AstronomyExtensions.CalculateEsi(
    radiusEarth: 1.0,
    densityEarth: 1.0,
    escapeVelocityEarth: 1.0,
    surfaceTemperatureK: 288);   // 1.0

// Mars: R≈0.53, ρ≈0.71, vesc≈0.45, T≈210 K
double esiMars = AstronomyExtensions.CalculateEsi(0.53, 0.71, 0.45, 210);  // ≈ 0.73

// Venus: R≈0.95, ρ≈0.95, vesc≈0.93, T≈737 K
double esiVenus = AstronomyExtensions.CalculateEsi(0.95, 0.95, 0.93, 737); // ≈ 0.44
```

| Parameter | Earth value | Weight |
|-----------|-------------|--------|
| Radius | 1.0 R⊕ | 0.57 |
| Bulk density | 1.0 ρ⊕ | 1.07 |
| Escape velocity | 1.0 v⊕ | 0.70 |
| Surface temperature | 288 K | 5.58 |
