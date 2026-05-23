
The `HeatExtensions` class provides extension methods for heat transfer calculations — **conduction, convection, radiation, the heat equation, dimensionless numbers, lumped-capacitance transient analysis, and fins**.

**Namespace:** `CSharpNumerics.Physics.Thermodynamics`

---

## 🧊 Conduction (Fourier's Law)

```csharp
// 1-D heat flux through a slab: q = k·ΔT / L
double q = 50.0.ConductiveHeatFlux(temperatureDifference: 80, thickness: 0.2);  // W/m²

// Heat rate through a slab of area A: Q̇ = k·A·ΔT / L
double Q = 50.0.ConductiveHeatRate(area: 2.0, temperatureDifference: 80, thickness: 0.2);

// 3-D heat flux vector field: q = −k∇T
var T = new ScalarField(r => 300 + 100 * Math.Exp(-(r.x * r.x + r.y * r.y)));
VectorField heatFlux = T.ConductiveHeatFlux(thermalConductivity: 50);
```

**Thermal resistance** for common geometries:

```csharp
// Flat slab: R = L / (kA)
double Rslab = 0.1.SlabThermalResistance(thermalConductivity: 50, area: 2.0);

// Cylindrical shell: R = ln(r₂/r₁) / (2πkL)
double Rcyl = 0.05.CylindricalThermalResistance(outerRadius: 0.10, thermalConductivity: 16, length: 1.0);

// Spherical shell: R = (1/r₁ − 1/r₂) / (4πk)
double Rsph = 0.05.SphericalThermalResistance(outerRadius: 0.10, thermalConductivity: 16);

// Series and parallel resistance networks
double Rseries  = new[] { 0.01, 0.05, 0.02 }.SeriesThermalResistance();
double Rparallel = new[] { 0.05, 0.10 }.ParallelThermalResistance();
```

---

## 🌡️ Convection (Newton's Law of Cooling)

```csharp
// Heat flux: q = h·(T_s − T_∞)
double q = 25.0.ConvectiveHeatFlux(surfaceTemperature: 400, fluidTemperature: 300);

// Heat rate: Q̇ = h·A·(T_s − T_∞)
double Q = 25.0.ConvectiveHeatRate(area: 0.5, surfaceTemperature: 400, fluidTemperature: 300);

// Convective thermal resistance: R = 1/(hA)
double Rconv = 25.0.ConvectiveThermalResistance(area: 0.5);
```

---

## ☀️ Radiation (Stefan–Boltzmann)

```csharp
// Emissive power: q = εσT⁴
double q = 500.0.RadiativeHeatFlux(emissivity: 0.8);

// Net radiative flux: q_net = εσ(T_s⁴ − T_sur⁴)
double qNet = 500.0.NetRadiativeHeatFlux(surroundingTemperature: 300, emissivity: 0.8);

// Radiative heat rate: Q̇ = εσA(T_s⁴ − T_sur⁴)
double Q = 500.0.RadiativeHeatRate(surroundingTemperature: 300, area: 2.0, emissivity: 0.8);

// Linearised radiative thermal resistance
double Rrad = 500.0.RadiativeThermalResistance(surroundingTemperature: 300, area: 2.0, emissivity: 0.8);
```

---

## 🔥 Heat Equation

Robin / convection boundary correction for a boundary control volume:
$-\dfrac{h}{\rho c_p \cdot dx}(T - T_\infty)$

```csharp
// Thermal diffusivity: α = k / (ρ·c_p)
double alpha = 50.0.ThermalDiffusivity(density: 7800, specificHeat: 500);

// ∂T/∂t = α∇²T
var T = new ScalarField(r => 300 + 200 * Math.Exp(-(r.x * r.x)));
ScalarField dTdt = T.HeatEquationRate(thermalDiffusivity: alpha);

// With volumetric source: ∂T/∂t = α∇²T + q̇/(ρc_p)
var source = new ScalarField(r => 1e6);  // 1 MW/m³
ScalarField dTdt2 = T.HeatEquationRate(alpha, source, density: 7800, specificHeat: 500);

// Robin / convection boundary correction (used by HeatPlate / HeatBlock3D solvers)
double correction = heat.ConvectiveBoundaryRate(
    h: 50, density: 2700, specificHeat: 900, dx: 0.01,
    cellTemperature: 100, ambientTemperature: 20);
// < 0 — boundary cools towards ambient

// Semi-infinite solid analytical solution: T(x,t) = T_i + (T_s − T_i)·erfc(x/(2√(αt)))
double Tx = 20.0.SemiInfiniteTemperature(surfaceTemperature: 100, thermalDiffusivity: alpha,
    depth: 0.05, time: 60);
```

---

## 📊 Dimensionless Numbers

```csharp
// Biot number: Bi = hL_c / k   (Bi < 0.1 → lumped model valid)
double Bi = 25.0.BiotNumber(characteristicLength: 0.01, thermalConductivity: 50);

// Nusselt number: Nu = hL / k_f
double Nu = 25.0.NusseltNumber(characteristicLength: 0.5, fluidConductivity: 0.6);

// Fourier number: Fo = αt / L²
double Fo = 1.28e-5.FourierNumber(time: 300, characteristicLength: 0.01);

// Prandtl number: Pr = c_p·μ / k
double Pr = 4184.0.PrandtlNumber(dynamicViscosity: 8.9e-4, thermalConductivity: 0.6);

// Grashof number: Gr = gβΔTL³ / ν²
double Gr = 50.0.GrashofNumber(characteristicLength: 0.3,
    thermalExpansionCoefficient: 3.4e-3, kinematicViscosity: 1.5e-5);

// Rayleigh number: Ra = Gr·Pr = gβΔTL³ / (να)
double Ra = 50.0.RayleighNumber(characteristicLength: 0.3,
    thermalExpansionCoefficient: 3.4e-3, kinematicViscosity: 1.5e-5, thermalDiffusivity: 2.2e-5);
```

---

## ⏱️ Lumped Capacitance

```csharp
// Time constant: τ = ρVc_p / (hA)
double tau = 7800.0.ThermalTimeConstant(volume: 1e-4, specificHeat: 500,
    heatTransferCoefficient: 25, surfaceArea: 0.02);

// Temperature at time t: T(t) = T_∞ + (T₀ − T_∞)·exp(−t/τ)
double T = 500.0.LumpedCapacitanceTemperature(ambientTemperature: 300, time: 60, timeConstant: tau);

// Time to reach target temperature
double t = 500.0.LumpedCapacitanceTime(targetTemperature: 350, ambientTemperature: 300, timeConstant: tau);
```

---

## 🪶 Fins

```csharp
// Fin parameter: m = √(hP / (kA_c))
double m = 25.0.FinParameter(perimeter: 0.1, thermalConductivity: 200, crossSectionalArea: 5e-4);

// Infinite fin heat rate: Q̇ = √(hPkA_c)·(T_b − T_∞)
double Qinf = 400.0.InfiniteFinHeatRate(ambientTemperature: 300,
    heatTransferCoefficient: 25, perimeter: 0.1, thermalConductivity: 200, crossSectionalArea: 5e-4);

// Finite fin with insulated tip: Q̇ = √(hPkA_c)·(T_b − T_∞)·tanh(mL)
double Qfin = 400.0.InsulatedTipFinHeatRate(ambientTemperature: 300,
    heatTransferCoefficient: 25, perimeter: 0.1, thermalConductivity: 200,
    crossSectionalArea: 5e-4, finLength: 0.05);

// Fin efficiency: η = tanh(mL) / (mL)
double eta = m.InsulatedTipFinEfficiency(finLength: 0.05);
```
