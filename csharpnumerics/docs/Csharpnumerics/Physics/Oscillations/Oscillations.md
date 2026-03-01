---
sidebar_label: "🔄 Oscillations"
---

The `Physics.Oscillations` namespace provides one-dimensional oscillator models with both **analytic** and **numerical** solutions. All oscillators implement `IOscillator` for a consistent API.

## 🎵 Simple Harmonic Oscillator

Models the undamped system $\ddot{x} + \omega_0^2 x = 0$ where $\omega_0 = \sqrt{k/m}$.

Integration uses **Velocity Verlet** (symplectic, O(dt²)) — excellent energy conservation for undamped systems.

```csharp
using CSharpNumerics.Physics.Oscillations;

var sho = new SimpleHarmonicOscillator(mass: 2, stiffness: 50, initialPosition: 0.5);

double w   = sho.AngularFrequency;   // ω₀ = √(k/m) = 5 rad/s
double f   = sho.Frequency;          // f₀ = ω₀/2π ≈ 0.796 Hz
double T   = sho.Period;             // T = 1/f₀ ≈ 1.257 s
double A   = sho.Amplitude;          // A = √(x₀² + (v₀/ω₀)²) = 0.5 m
double phi = sho.PhaseOffset;        // φ = atan2(-v₀/ω₀, x₀)
```

**Analytic solution** — exact reference for verification:

```csharp
double x = sho.AnalyticPosition(t: 1.0);   // A·cos(ω₀t + φ)
double v = sho.AnalyticVelocity(t: 1.0);   // -Aω₀·sin(ω₀t + φ)
```

**Simulation & visualisation**

```csharp
sho.Step(dt: 0.001);                         // advance one time step
sho.Reset();                                  // restore initial conditions

List<Serie> trajectory = sho.Trajectory(tEnd: sho.Period * 5, dt: 0.001);
List<Serie> phase      = sho.PhasePortrait(tEnd: sho.Period * 2, dt: 0.001);
```

**Energy** — conserved for undamped SHM:

```csharp
double KE = sho.KineticEnergy;      // ½mv²
double PE = sho.PotentialEnergy;     // ½kx²
double E  = sho.TotalEnergy;        // KE + PE (constant)

List<Serie> energy = sho.EnergyOverTime(tEnd: sho.Period * 10, dt: 0.001);
```

**Frequency spectrum** — FFT peak at the natural frequency $f_0$:

```csharp
List<Serie> spectrum = sho.FrequencySpectrum(tEnd: sho.Period * 20, dt: 0.01);
```

**With initial velocity**

```csharp
var sho2 = new SimpleHarmonicOscillator(mass: 1, stiffness: 25,
    initialPosition: 0, initialVelocity: 5);
Console.WriteLine(sho2.Amplitude);  // A = √(0² + (5/5)²) = 1.0 m
```

---

## 🌊 Damped Oscillator

Models $\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = 0$ where $\gamma = c/(2m)$.

Three damping regimes are automatically detected:
- **Underdamped** ($\gamma < \omega_0$) — oscillates with exponential decay
- **Critically damped** ($\gamma = \omega_0$) — fastest non-oscillatory return
- **Overdamped** ($\gamma > \omega_0$) — slow exponential decay

Integration uses **RK4** — appropriate for dissipative systems.

```csharp
var osc = new DampedOscillator(mass: 1, stiffness: 100, damping: 4, initialPosition: 1.0);

double w0    = osc.NaturalFrequency;        // ω₀ = 10 rad/s
double g     = osc.Gamma;                   // γ = 2 rad/s
double wd    = osc.DampedFrequency;         // ω_d = √96 ≈ 9.80 rad/s
double Td    = osc.DampedPeriod;            // 2π/ω_d ≈ 0.641 s
DampingRegime regime = osc.Regime;          // Underdamped
double Q     = osc.QualityFactor;           // ω₀/(2γ) = 2.5
double delta = osc.LogarithmicDecrement;    // γ·T_d ≈ 1.283
```

**Regime detection**

```csharp
var under = new DampedOscillator(1, 100,  4);  // γ=2  < ω₀=10 → Underdamped
var crit  = new DampedOscillator(1, 100, 20);  // γ=10 = ω₀=10 → CriticallyDamped
var over  = new DampedOscillator(1, 100, 40);  // γ=20 > ω₀=10 → Overdamped
```

**Analytic solution** — all three regimes:

```csharp
// Underdamped:  x(t) = A·e^(−γt)·cos(ω_d·t + φ)
// Critical:     x(t) = (C₁ + C₂t)·e^(−γt)
// Overdamped:   x(t) = C₁·e^(r₁t) + C₂·e^(r₂t)
double x = osc.AnalyticPosition(t: 1.0);
double v = osc.AnalyticVelocity(t: 1.0);
```

**Simulation & visualisation**

```csharp
osc.Step(dt: 0.001);
osc.Reset();

List<Serie> trajectory = osc.Trajectory(tEnd: 5.0, dt: 0.001);
List<Serie> phase      = osc.PhasePortrait(tEnd: 5.0, dt: 0.001);  // spirals to origin
```

**Energy** — monotonically decreasing:

```csharp
double E = osc.TotalEnergy;
List<Serie> energy     = osc.EnergyOverTime(tEnd: 5.0, dt: 0.001);
List<Serie> dissipated = osc.EnergyDissipation(tEnd: 5.0, dt: 0.001);  // E₀ − E(t)
```

**Envelope & spectrum**

```csharp
double env = osc.Envelope(t: 1.0);                         // A·e^(−γt)
List<Serie> envCurve = osc.EnvelopeCurve(tEnd: 5.0, dt: 0.01);
List<Serie> spectrum = osc.FrequencySpectrum(tEnd: 20.0, dt: 0.005);  // peak at ω_d
```

**Zero damping** reduces to `SimpleHarmonicOscillator` behaviour.

---

## ⚡ Driven Oscillator

Extends the damped oscillator with a harmonic driving force:

$$\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = \frac{F_0}{m}\cos(\omega_d t)$$

```csharp
var osc = new DrivenOscillator(
    mass: 1.0, stiffness: 100.0, damping: 4.0,
    driveAmplitude: 10.0, driveFrequency: 7.0,
    initialPosition: 0.0, initialVelocity: 0.0);
```

| Property | Formula | Description |
|---|---|---|
| `NaturalFrequency` | $\omega_0 = \sqrt{k/m}$ | Undamped natural frequency |
| `Gamma` | $\gamma = c/(2m)$ | Damping rate |
| `DampedFrequency` | $\omega_d = \sqrt{\omega_0^2 - \gamma^2}$ | Damped frequency |
| `Regime` | auto-detected | `Underdamped`, `CriticallyDamped`, or `Overdamped` |
| `QualityFactor` | $Q = \omega_0/(2\gamma)$ | Sharpness of resonance |
| `ResonanceFrequency` | $\omega_r = \sqrt{\omega_0^2 - 2\gamma^2}$ | Frequency of max amplitude (0 if $\omega_0^2 < 2\gamma^2$) |
| `Bandwidth` | $\Delta\omega = 2\gamma$ | Width of resonance peak |

**Steady-state response**

```csharp
double A = osc.SteadyStateAmplitude(wd);     // (F₀/m) / √((ω₀²−ωd²)² + (2γωd)²)
double φ = osc.SteadyStatePhase(wd);         // −atan2(2γωd, ω₀²−ωd²)

double Adrive = osc.SteadyStateAmplitudeAtDrive;
double φdrive = osc.SteadyStatePhaseAtDrive;
```

**Resonance curve & phase response**

```csharp
List<Serie> resonance = osc.ResonanceCurve(wMin: 0.1, wMax: 20, steps: 500);
List<Serie> phaseResp = osc.PhaseResponse(wMin: 0.1, wMax: 20, steps: 500);
```

**Transfer function**

```csharp
ComplexNumber H   = osc.TransferFunction(s);      // H(s) = 1/(s² + 2γs + ω₀²)
ComplexNumber Hiw = osc.FrequencyResponse(w);      // H(iω)
```

**Simulation**

```csharp
osc.Step(dt: 0.001);
List<Serie> traj  = osc.Trajectory(5.0, 0.001);
List<Serie> phase = osc.PhasePortrait(5.0, 0.001);
```

**Steady-state extraction**

```csharp
List<Serie> steady = osc.SteadyStateTrajectory(
    steadyDuration: 10.0, dt: 0.001, transientDuration: null);  // auto = 5/γ

double Ameas = osc.MeasuredSteadyStateAmplitude(dt: 0.001);
```

**Energy & power**

```csharp
List<Serie> energy = osc.EnergyOverTime(tEnd: 5.0, dt: 0.001);
List<Serie> power  = osc.PowerInput(tEnd: 5.0, dt: 0.001);   // F(t)·v(t)
```

**Frequency spectrum** — peak at drive frequency $f_d = \omega_d / (2\pi)$:

```csharp
List<Serie> spectrum = osc.FrequencySpectrum(tEnd: 50.0, dt: 0.005);
```

**Zero driving force** reduces to `DampedOscillator` behaviour.

---

## 🔗 Coupled Oscillators

Models an N-mass spring chain with fixed walls:

$$M\ddot{\mathbf{x}} + C\dot{\mathbf{x}} + K\mathbf{x} = 0$$

```
wall —k₀— m₁ —k₁— m₂ —k₂— … —mₙ —kₙ— wall
```

**General constructor**

```csharp
var osc = new CoupledOscillators(
    masses:      new[] { 1.0, 2.0, 1.5 },
    stiffnesses: new[] { 5.0, 10.0, 8.0, 5.0 },   // N+1 springs
    dampings:    new[] { 0.1, 0.2, 0.1 },           // optional
    initialPositions:  new[] { 1.0, 0.0, -0.5 },
    initialVelocities: new[] { 0.0, 0.0, 0.0 });
```

**Uniform constructor**

```csharp
var osc = new CoupledOscillators(
    count: 5, mass: 1.0, stiffness: 4.0, damping: 0.0,
    initialPositions: new[] { 1.0, 0.0, 0.0, 0.0, 0.0 });
```

| Property | Description |
|---|---|
| `Count` | Number of masses $N$ |
| `Position(i)` / `Velocity(i)` | State of mass $i$ |
| `Positions` / `Velocities` | Copy of all current states |
| `KineticEnergy` | $\frac{1}{2}\sum m_i v_i^2$ |
| `PotentialEnergy` | $\frac{1}{2}\sum k_j (\Delta x_j)^2$ |
| `TotalEnergy` | Kinetic + Potential |

**Matrices & normal modes**

```csharp
Matrix K = osc.StiffnessMatrix();   // N×N tridiagonal symmetric
Matrix M = osc.MassMatrix();        // N×N diagonal

List<double>  frequencies = osc.NormalModes();   // ω₁ ≤ ω₂ ≤ … ≤ ωₙ
List<VectorN> shapes      = osc.ModeShapes();    // normalised eigenvectors
```

Normal modes are computed via the Jacobi eigenvalue algorithm on the symmetrised dynamical matrix $D = L^{-1}KL^{-1}$ where $L = \text{diag}(\sqrt{m_i})$.

For a uniform N-mass chain: $\omega_r = 2\sqrt{k/m}\,\sin\!\bigl(\frac{r\pi}{2(N+1)}\bigr)$

**Simulation**

```csharp
osc.Step(dt: 0.001);
osc.Reset();

List<List<Serie>> trajectories = osc.Trajectory(tEnd: 5.0, dt: 0.001);   // per mass
List<Serie> phase = osc.PhasePortrait(massIndex: 0, tEnd: 5.0, dt: 0.001);
```

**Energy analysis**

```csharp
List<Serie> energy     = osc.EnergyOverTime(tEnd: 5.0, dt: 0.001);
List<Serie> modeEnergy = osc.ModalEnergy(modeIndex: 0, tEnd: 5.0, dt: 0.001);
```

**Dispersion relation** — theoretical for uniform periodic chain: $\omega(k) = 2\sqrt{k/m}\,|\sin(ka/2)|$

```csharp
List<Serie> dispersion = osc.DispersionRelation(kValues, latticeSpacing: 1.0);
double vp = osc.PhaseVelocity(k: 1.0);   // ω/k
double vg = osc.GroupVelocity(k: 1.0);    // dω/dk
```

**Frequency spectrum** — peaks at excited normal mode frequencies:

```csharp
List<Serie> spectrum = osc.FrequencySpectrum(massIndex: 0, tEnd: 50.0, dt: 0.01);
```

