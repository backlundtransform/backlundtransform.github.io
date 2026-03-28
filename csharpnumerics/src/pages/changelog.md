---
title: Changelog
description: Version history and breaking changes for CSharpNumerics
---

# 📋 Changelog

All notable changes to **CSharpNumerics** are documented here.  
This format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and follows [Semantic Versioning](https://semver.org/).

> **Legend:**  
> 🔴 **Breaking Change** — requires code changes when upgrading  
> 🟢 **Added** — new features  
> 🔵 **Changed** — changes in existing functionality  
> 🟡 **Deprecated** — features that will be removed in a future version  
> 🔧 **Fixed** — bug fixes  
> 🗑️ **Removed** — features that have been removed

---

## [2.7.0] – 2026-03-28

**10,056 lines added across 63 files** | Previous release: v2.6.5 (2026-03-21)

### 🟢 Added

#### Quantum Computing Engine (`CSharpNumerics.Engines.Quantum`)

- **Quantum Circuit Simulator** — `QuantumCircuit`, `QuantumState`, `QuantumSimulator`, `QuantumEnvironment` for building and simulating multi-qubit quantum circuits.
- **Fluent Circuit Builder** — `QuantumCircuitBuilder` with a chainable API for composing quantum circuits.
- **Algorithms** — `ShorAlgorithm` (integer factorization), `GroverSearch` (unstructured search), `QFT` / `InverseQFT` (Quantum Fourier Transform), `QPE` (Quantum Phase Estimation).
- **Noisy Simulation** — `NoisyQuantumSimulator` with pluggable noise channels: `DepolarizingNoise`, `DephasingNoise`, `AmplitudeDampingNoise`.
- **Quantum Error Correction** — `ErrorCorrectionSimulator`, `SyndromeDecoder`, and four codes: `BitFlipCode3`, `PhaseFlipCode3`, `SteaneCode7`, `ShorCode9`.

#### Quantum Physics Primitives (`CSharpNumerics.Physics.Quantum`)

- **Gates** — `HadamardGate`, `PauliX/Y/Z`, `PhaseGate`, `SGate`, `TGate`, `RxGate`, `RyGate`, `RzGate`, `SWAPGate`, `CNOTGate`, `CZGate`, `CPhaseGate`, `ControlledGate`, `ToffoliGate`, `FredkinGate`, `ModularMultiplyGate`, `PhaseOracle`.
- **Bloch Sphere** — `BlochVector` for single-qubit state visualisation.
- **Fidelity** — `QuantumFidelity` for state comparison metrics.
- **Noise Interfaces** — `INoiseChannel` abstraction for noise models.
- **Error Correction Interfaces** — `IQuantumErrorCorrectionCode` and four code implementations (see above).

#### GIS Engine — Exposure Analysis (`CSharpNumerics.Engines.GIS`)

- **Exposure Polygon Generator** — `ExposurePolygonGenerator` and `ExposurePolygon` for computing peak-exposure contour polygons from plume simulations.
- **GeoJSON Export** — `GeoJsonExporter` for exporting exposure polygons.
- **Scenario Enhancements** — `ScenarioResult` output model; `RiskScenarioBuilder` and `PlumeSimulator` updates.

#### Chemical Materials (`CSharpNumerics.Physics.Materials.Chemical`)

- `ChemicalSubstance` — properties and behaviour modelling for chemical substances.
- `ChemicalLibrary` — built-in library of common substances.
- Updated `Materials` base infrastructure accordingly.


---

## [2.6.5] – 2026-03-21

### 🟢 Added

#### Reinforcement Learning (`CSharpNumerics.ML.ReinforcementLearning`)

A complete RL framework under `ML/ReinforcementLearning/`:

- **Tabular Agents** – `QLearning`, `SARSA`, and `MonteCarloControl` with shared `TabularAgent` base class, Q-table access, and state-mapper support.
- **Value-Based (Deep) Agents** – `DQN` with target network and experience replay, `DoubleDQN` to reduce overestimation bias, and `DuelingDQN` with separate value/advantage streams.
- **Policy Gradient Agents** – `REINFORCE` (Monte Carlo policy gradient with optional baseline), `ActorCritic` (A2C with entropy bonus), and `PPO` (clipped surrogate + GAE).
- **Continuous Control** – `DDPG` (deterministic actor-critic with Polyak-averaged target networks).
- **Environments** – `GridWorld`, `CartPole`, `MountainCar` (discrete), and `Pendulum` (continuous torque).
- **Exploration Policies** – `EpsilonGreedy`, `SoftmaxPolicy`, `GaussianNoise`, and `OrnsteinUhlenbeck` process, all with per-episode decay and `Clone()`.
- **Replay Buffers** – `ReplayBuffer` (uniform circular buffer) and `PrioritizedReplayBuffer` (TD-error prioritized sampling).
- **Experiment API** – `RLExperiment` fluent builder with `Run()`, `RunGrid()`, and `RunMonteCarlo()` modes; `RLPipelineGrid` for hyperparameter grid search across agent types; `EpisodeEvaluator` for standalone agent evaluation with confidence intervals.
- **Diagnostics** – `QValueHeatmap` (tabular Q-value / greedy-policy maps), `PolicyVisualizer` (action probabilities, entropy, dominant action), and `ValueFunctionSurface` (1D/2D value-function sampling for deep agents).
- **Interfaces** – `IAgent`, `IEnvironment`, `IPolicy`, `IReplayBuffer`.
- **Core Types** – `Transition`, `Episode`, `TrainingResult` (return/loss/exploration curves).

#### Neural Network (`CSharpNumerics.ML.NeuralNetwork`)

- Shared `NeuralNetwork` class used by all deep RL agents and MLP models — forward pass, backpropagation, and weight management.

#### GIS-RL Integration (`CSharpNumerics.Engines.GIS.RL`)

Bridges the GIS simulation engine with the RL framework:

- **`IGISEnvironment`** – interface extending `IEnvironment` with `GeoGrid`, `TimeFrame`, `Threshold`, `ActionCost`, `MaxSteps`, and `GridSnapshot`.
- **`PlumeEnvironment`** – RL environment wrapping `PlumeSimulator` in transient mode (8-dim observation, 6 discrete actions: barriers + emission filter).
- **`ScenarioRLAnalyzer`** – fluent API for training RL agents on GIS scenarios with `For(emissionRate, position)`, `For(IGISEnvironment)`, and `For(IEnvironment)` entry points; supports physics config, environment tuning, grid search, and replay buffers.

#### Optimization (`CSharpNumerics.Numerics.Optimization`)

A numerical optimization module under `Numerics/Optimization/`:

- **Single-Objective** – `GradientDescent`, `Adam`, `CoordinateDescent`, and `Minimizer` (high-level wrapper).
- **Multi-Objective** – `NSGA2` (Non-dominated Sorting Genetic Algorithm II) and `ParetoFront` for Pareto-optimal solution sets.
- **Convergence Strategies** – `EarlyStopping`, `LearningRateSchedule`, and `MaxIterationsOrTolerance`.
- **Interfaces** – `IOptimizer`, `IObjectiveFunction`, `IConvergenceCriterion`.

#### Dimensionality Reduction – PCA (`CSharpNumerics.ML.DimensionalityReduction`)

- Reworked `PCA` implementation with power iteration and deflation for eigendecomposition. Exposes `Components`, `ExplainedVariance`, `ExplainedVarianceRatio`, and `Mean`. Integrates into both supervised and clustering pipelines via `AddReducer<PCA>()` and `WithReducer()`.

### 🔧 Fixed

- **Experiment bug** – Fixed issue in `ClusteringExperiment` (and related experiment infrastructure).
- **Supervised model corrections** – Fixes across `Logistic`, `LinearSVC`, `KernelSVC`, `MLPClassifier`, `ElasticNet`, `Lasso`, `LinearSVR`, `KernelSVR`, and `MLPRegressor` (numerical stability, hyperparameter handling, and `NeuralNetwork` integration for MLP models).

---

## [2.6.3] – 2026-03-15

### 🟢 Added

####  GIS / Geo-Engine (`CSharpNumerics.Engines.GIS`)

A full geospatial simulation engine under `Engines/GIS/`:

- **Coordinates & Projections** – `GeoCoordinate` type and `Projection` class with coordinate-system transforms.
- **GeoGrid** – `GeoGrid`, `GeoCell`, and `GridSnapshot` for spatial grid-based modelling.
- **Plume Simulation** – `PlumeSimulator` for atmospheric plume dispersion on a geo-grid, and `PlumeMonteCarloModel` for stochastic ensemble runs with `ScenarioVariation` support.
- **Scenario Analysis** – `RiskScenario`, `RiskScenarioBuilder`, `ScenarioResult`, and `TimeFrame` for building and evaluating risk scenarios.
- **Spatial Analysis** – `ProbabilityMap`, `ScenarioClusterAnalyzer`, and `TimeAnimator` for post-processing simulation results.
- **Export** – `GeoJsonExporter`, `CesiumExporter`, and `UnityBinaryExporter` for shipping results to web maps, Cesium 3D globe, or Unity.

####  Nuclear Physics (`CSharpNumerics.Physics.Materials.Nuclear`)

A nuclear-physics module under `Physics/Materials/Nuclear/`:

- **Isotopes** – `Isotope` data type and `IsotopeLibrary` with built-in entries (Cs-137, I-131, Sr-90, Co-60, etc.) and runtime registration of custom isotopes.
- **Radioactive Decay** – `Decay` class for activity, remaining mass, and time-dependent calculations.
- **Decay Chains** – `DecayChain` with Bateman-equation solver (e.g. Cs-137 → Ba-137m → Ba-137, I-131 → Xe-131).
- **Radiation Dose** – `RadiationDose` with point-source dose rate, ground-shine dose, and inhalation dose models.
- **Materials** – `Materials` helper class for physical material properties.

####  Environmental Extensions

- Added `GaussianPuff` transient dispersion model to `EnvironmentalExtensions` (time-dependent puff advecting downwind with Briggs σ).

---

## [2.6.1] — 2026-03-07

### 🟢 Added

#### Complex Linear Algebra
- `ComplexMatrix` — full complex-valued matrix type
- `ComplexVector` and `ComplexVectorN` — complex-valued vector types

#### Tensor & Scalar Fields
- `ScalarField` and `TensorField` objects
- `ElectroMagneticFieldExtensions` for electromagnetic field computations

#### Environmental Physics
- `EnvironmentalExtensions` with atmospheric/environmental calculations
- `StabilityClass` enum for atmospheric stability classification

#### Finite Difference Framework
- `BoundaryCondition`, `Grid2D`, and `GridOperators` for 2D finite difference methods

#### Time Stepping
- `ITimeStepper` interface and `TimeStepResult` model
- `EulerStepper`, `RK4Stepper`, `AdaptiveRK45Stepper`, and `VelocityVerletStepper` implementations

#### Heat Physics
- `HeatExtensions` for heat transfer computations

#### Dimensionality Reduction (ML)
- `IDimensionalityReducer` interface
- `PCA` (Principal Component Analysis) implementation
- Updated `ClusteringExperiment`, `ClusteringGrid`, `ClusteringPipeline`, `Pipeline`, and `PipelineGrid` to support dimensionality reduction

### 🔵 Changed

#### Game Physics Engine — Refactoring
- Moved physics world, collision detection/response, constraint solver, broad-phase algorithms, constraints (ball socket, distance, hinge, spring joints), and physics objects (AABB, bounding sphere, contact point) from `Physics/Applied/` to `Engines/Game/`
- Moved `FileExtensions` from `Extensions/` to `Engines/Common/Extensions/`

---

## [2.6.0] — 2026-03-12

### 🟢 Added

#### Fluid Dynamics (`CSharpNumerics.Physics`)
- Added `FluidExtensions` bridging `VectorField`/`ScalarField` to classical fluid dynamics:
  - **Navier–Stokes:** `ConvectiveAcceleration(this VectorField, (double, double, double), double)`, `ViscousTerm(this VectorField, double, (double, double, double), double)`, `PressureGradientForce(this ScalarField, (double, double, double))`, `NavierStokesResidual(this VectorField, ScalarField, double, double, (double, double, double), Vector)` (full and Euler inviscid forms), `IncompressibilityResidual(this VectorField, (double, double, double))`
  - **Bernoulli's principle:** `BernoulliConstant(this double, double, double, double)`, `BernoulliPressure(this double, double, double, double, double, double)`, `DynamicPressure(this double, double)`, `StagnationPressure(this double, double, double)`
  - **Continuity:** `MassFlux(this VectorField, double)` (constant and variable density), `ContinuityResidual(this VectorField, double, (double, double, double))`, `VolumeFlowRate(this double, double)`, `ContinuitySpeed(this double, double, double)`
  - **Vorticity & topology:** `Vorticity(this VectorField, (double, double, double))`, `Enstrophy(this VectorField, (double, double, double))`, `HelicityDensity(this VectorField, (double, double, double))`, `VelocityFromStreamFunction(this ScalarField)`
  - **Drag & lift:** `DragForce(this double, double, double, Vector)`, `LiftForce(this double, double, double, double)`, `TerminalVelocity(this double, double, double, double)`, `StokesDrag(this double, double, double)`
  - **Dimensionless numbers:** `ReynoldsNumber(this double, double, double, double)`, `MachNumber(this double, double)`, `FroudeNumber(this double, double)`, `StrouhalNumber(this double, double, double)`, `WeberNumber(this double, double, double, double)`
  - **Viscous flows:** `PoiseuilleFlowRate(this double, double, double, double)`, `PoiseuilleVelocity(this double, double, double, double, double)`
  - **Hydrostatics:** `HydrostaticPressure(this double, double, double)`, `BuoyantForce(this double, double)`, `KineticEnergyDensity(this Vector, double)`, `MomentumDensity(this Vector, double)`

#### Wave Equations (`CSharpNumerics.Physics.Waves`)
- Added `WaveEquation1D` — finite-difference solver for the 1D wave equation with fixed or open boundaries. Includes `Snapshot()`, `SpaceTimeField(double, double)`, `EnergyDensity(this Vector, Vector)`, `FrequencyContent(int, double, double)`, `StandingWaveMode(int)`, and CFL stability check
- Added `WaveEquation2D` — finite-difference solver for the 2D wave equation on a rectangular grid. Supports initial conditions, energy tracking, and 2D snapshot arrays
- Added `DampedDrivenWaveEquation1D` — 1D wave equation with damping (α) and an external driving source term
- Added `WavePacket` — Gaussian wave packet with dispersion. Computes `PhaseVelocity(double, double)`, `GroupVelocity(double, double)`, `Width(t)`, `SpreadRate(double, double)`, and `Propagate(t)`
- Added `WaveSuperposition` — harmonic superposition engine with `BeatFrequency()`, `InterferencePattern(double[], double)`, and `FourierCoefficients(double[], double)`
- Added `IWaveField` interface and `BoundaryType` enum

#### Audio Engine (`CSharpNumerics.Engines.Audio`)
- Added `SignalGenerator` — waveform generation (Sine, Square, Sawtooth, Triangle, WhiteNoise)
- Added `AudioOscillator` — stateful oscillator with continuous phase for click-free real-time synthesis
- Added `AudioBuffer` — sample container with Mix, Normalize, Trim, Fade, Reverse, Resample, and WAV export
- Added `Envelope(double)` — ADSR (Attack-Decay-Sustain-Release) amplitude shaping
- Added `Synthesizer` — additive synthesis combining multiple oscillators with ADSR envelope
- Added `AudioFilter` — frequency-domain filtering (LowPass, HighPass, BandPass) via FFT
- Added `Reverb` — Schroeder-model reverb with parallel comb filters and series all-pass filters
- Added `Delay` — circular-buffer delay line with feedback
- Added `Compressor` — dynamic range compression with attack/release envelope
- Added `SpatialAudio` — stereo panning (constant-power) and inverse-distance attenuation
- Added `SpectrumAnalyzer` — windowed FFT analysis (Hann, Hamming, Blackman, Rectangular)
- Added `PitchDetector` — fundamental frequency detection via autocorrelation or Harmonic Product Spectrum
- Added `BeatDetector` — onset detection via spectral flux with tempo (BPM) estimation

#### Fourier Series (`CSharpNumerics.Numerics.SignalProcessing`)
- Added `FourierSeries` — real Fourier coefficient analysis and synthesis with `PowerSpectrum()`, `ParsevalEnergy()`, `TimeDomainEnergy(Func<double, double>, int)`, and partial-sum reconstruction (`SynthesizeRange(double[], int)`) for Gibbs phenomenon demonstration

#### Hypothesis Testing (`CSharpNumerics.Statistics`)
- Added `HypothesisTestsExtensions` with full test infrastructure:
  - **Parametric:** `TTest(this IEnumerable<double>, double, Alternative, double)` (one-sample, two-sample with Welch correction), `PairedTTest<T>(this IEnumerable<T>, Func<T, (double before, double after)>, double)`, `ZTest<T>(this IEnumerable<T>, Func<T, double>, double, double, double)`, `FTest(this IEnumerable<double>, IEnumerable<double>, Alternative, double)`, `Anova(this IEnumerable<IEnumerable<double>>, double)`
  - **Non-parametric:** `MannWhitneyUTest(this IEnumerable<double>, IEnumerable<double>, Alternative, double)`, `WilcoxonSignedRankTest(this IEnumerable<double>, Alternative, double)`, `ChiSquaredTest<T>(this IEnumerable<T>, Func<T, (double observed, double expected)>, double)`
  - All tests return `HypothesisTestResult` with test statistic, p-value, reject/accept decision, confidence interval, effect size, and degrees of freedom
- Added `Alternative` enum (TwoSided, Less, Greater)

#### Engine Infrastructure (`CSharpNumerics.Engines.Common`)
- Added `ISimulationEngine` interface, `SimulationClock`, `EventBus`, `FieldSerializer`, and `PlatformAdapter` as shared infrastructure for simulation engines

---

## [2.5.0] — 2026-03-01

### 🟢 Added

#### Statistics — Extended Descriptive & Inferential Statistics
- New distributions: `StudentTDistribution`, `ChiSquaredDistribution`, `FDistribution` (with `InverseCdf`, `TwoTailedPValue`, `UpperTailPValue`)
- New descriptive functions: `Median`, `Percentile`, `InterquartileRange`, `Skewness`, `Kurtosis`, `SampleVariance`, `Mode`, `Range`, `CumulativeSum`, `ConfidenceIntervals`
- New inferential tests: `OneSampleTTest`, `TwoSampleTTest`, `PairedTTest`, `ZTest`, `ChiSquaredTest`, `OneWayAnova`
- New correlations: `PearsonCorrelation` (with p-value), `SpearmanCorrelation`
- New regressions: `ExponentialRegression`, `LogarithmicRegression`, `PowerRegression`, `PolynomialRegression`

#### Physics — Oscillation Framework
- `SimpleHarmonicOscillator` — position, velocity, acceleration, phase, energy (kinetic/potential/total), period, frequency
- `DampedOscillator` — underdamped/critically damped/overdamped, `DampingRegime` enum, envelope functions, energy decay, Q-factor
- `DrivenOscillator` — forced oscillation with resonance frequency, amplitude response, phase response, steady-state, transient response
- `CoupledOscillators` — N coupled oscillators, normal modes, mode frequencies, energy per oscillator, energy transfer
- `IOscillator` interface for common signature
- 2 300+ lines of tests (328 + 677 + 556 + 742)

#### ML — Supervised Experiment API
- `SupervisedExperiment` — fluent API mirroring `ClusteringExperiment` for supervised models
- `CrossValidatorConfig` — lazy factory with `KFold()`, `StratifiedKFold()`, `ShuffleSplit()`, `LeaveOneOut()`, `MonteCarlo()`, `Custom()`
- `SupervisedExperimentResult` — `Rankings`, `Best`, `BestBy(cvName)`, `BestConfusionMatrix`, `BestR2`, `CVResults`
- `ScoreDistributionSummary` — descriptive statistics (mean, median, std, IQR, skewness, kurtosis, CI) for pipeline scores
- New methods on `ClusteringExperimentResult`: `ScoreSummary()`, `ScorePercentile()`
- New methods on `SupervisedExperimentResult`: `ScoreSummary()`, `ScorePercentile()`, `RankCorrelation()`, `ScoreConsistency()`
- 818 lines of tests (721 supervised + 97 clustering)

### 🔵 Changed

- Refactored `StandardDeviation` to support both sample and population variants

---

## [2.4.0] — 2026-02-24

**75 files changed** — 9,464 insertions, 1,342 deletions

### 🟢 Added

#### Clustering (Machine Learning)
- Full clustering module with **KMeans**, **DBSCAN**, and **Agglomerative Clustering**
- `ClusteringPipeline` and `ClusteringGrid` for automated hyperparameter tuning
- `ClusteringExperiment` for running and comparing clustering configurations
- Four cluster evaluation metrics: Silhouette Score, Calinski-Harabasz Index, Davies-Bouldin Index, Inertia
- `MonteCarloClustering` for stochastic clustering analysis
- `IClusteringModel` and `IClusteringEvaluator` interfaces
- Result types: `ClusteringResult`, `ClusteringExperimentResult`, `MonteCarloClusteringResult`
- `KMeansInit` and `LinkageType` enums

#### Monte Carlo Cross-Validation (Machine Learning)
- `MonteCarloCrossValidator` for randomized train/test split validation
- `MonteCarloValidationResult` result type

#### Statistical Distributions
- Full distributions framework with `IDistribution` interface
- Six distributions: `NormalDistribution`, `BernoulliDistribution`, `BinomialDistribution`, `PoissonDistribution`, `ExponentialDistribution`, `UniformDistribution`

#### Monte Carlo Simulation (Statistics)
- `MonteCarloSimulator` with `IMonteCarloModel` interface
- `MonteCarloResult` for simulation output analysis

#### Random Number Generation
- `RandomGenerator` utility class with extended random sampling capabilities

#### Advanced Interpolation
- Five new interpolation methods: `CubicSplineInterpolation`, `PolynomialInterpolation` (Lagrange/Newton), `RationalInterpolation`, `TrigonometricInterpolation`, `MultivariateInterpolation`

#### Inferential Statistics
- `InferentialStatisticsExtensions` for hypothesis testing

### 🔵 Changed

- Renamed `StatisticsExtensions` → `DescriptiveStatisticsExtensions` for clarity
- Changed namespace for `DifferentialEquationExtensions` to `CsharpNumerics.Numerics`
- Changed namespace for`TransformExtensions` to `CsharpNumerics.Numerics`
- Changed namespace for `VectorFieldExtensions` to `CsharpNumerics.Numerics`
- Updated `InterpolationExtensions` with support for new interpolation types
- Moved `InterpolationType` enum from Statistics namespace to `CsharpNumerics.Numerics.Enums`
- Changed namespace for `DerivativeExtensions`, `IntegrationExtensions`, `LimitExtensions`, and `TrigonometryExtensions`  to `CsharpNumerics.Numerics`

### 🗑️ Removed

- Deprecated `Statistics.cs` methods class

---

<p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem'}}>
  This changelog is maintained manually. For the full commit history, see the{' '}
  <a href="https://github.com/backlundtransform/CSharpNumerics/commits/main">GitHub commit log</a>.
</p>
