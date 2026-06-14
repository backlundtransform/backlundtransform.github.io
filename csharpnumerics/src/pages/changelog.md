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

## [4.0.0] – 2026-06-14

Major release. **CSharpNumerics is refocused on its scientific core** — numerical analysis, statistics, machine learning, and physics — while the simulation engines move into the separate [`CSharpNumerics.Engines`](https://www.nuget.org/packages/CSharpNumerics.Engines/) NuGet package. This release also adds five new building blocks across the core domains: digital filters and wavelet transforms (Numerics), state estimation and seasonal forecasting (Statistics), temporal convolutional networks and physics-informed constrained training (Machine Learning), and the Schrödinger-equation toolkit (Physics).

### 🔴 Breaking Changes

#### Engine split

- The simulation engines (`Audio`, `Exoplanet`, `Game`, `GIS`, `Multiphysics`, `Quantum`) move out of the `CSharpNumerics` package into the separate [`CSharpNumerics.Engines`](https://www.nuget.org/packages/CSharpNumerics.Engines/) package. The `CSharpNumerics` package now ships **only** the Numerics, Statistics, ML, and Physics layers.
- Projects using simulation engines must install the new package (`dotnet add package CSharpNumerics.Engines`); the `CSharpNumerics.Engines.*` namespaces are otherwise unchanged.
- The physics primitives the engines build on (gates, aerodynamics, materials, etc.) remain in the core `CSharpNumerics.Physics` package.

### 🟢 Added

#### Numerics — Digital Filters (`CSharpNumerics.Numerics.SignalProcessing`)

- `SavitzkyGolayFilter` — local polynomial least-squares smoothing with `Apply` and `ApplyDerivative` (smoothed derivatives).
- `ButterworthFilter` — maximally-flat IIR filter as a cascade of biquads, with `FrequencyResponse`.
- `FIRFilter` — linear-phase finite impulse response with arbitrary taps, `Apply` and `ApplySymmetric` (mirror extension).
- `FilterDesign` — `DesignLowpass` / `DesignHighpass` / `DesignBandpass` (Butterworth) and `DesignFIRLowpass` / `DesignFIRHighpass` (windowed-sinc).
- `ZeroPhaseFiltFilt` — forward-backward (filtfilt) filtering for distortion-free offline analysis; complementary highpass + lowpass pair reconstructs the original signal.

#### Numerics — Wavelet Transforms (`CSharpNumerics.Numerics.SignalProcessing.Wavelets`)

- `WaveletFamily` — orthonormal `Haar`, `Daubechies4`, `Daubechies8`, `Symlet4`.
- `DiscreteWaveletTransform` — `SingleLevel` and N-level `Decompose`; `InverseWaveletTransform` for exact reconstruction.
- `WaveletDenoising` — soft/hard thresholding with VisuShrink / BayesShrink rules and robust (MAD) noise estimation.
- `MaximalOverlapDWT` (MODWT) — undecimated, shift-invariant transform with exact inverse, for any signal length.

#### Statistics — State Estimation (`CSharpNumerics.Statistics.StateEstimation`)

- `KalmanFilter` — linear Predict/Update with control-input overload, exposing `State` and `Covariance`.
- `ExtendedKalmanFilter` — Jacobian-based filtering for non-linear process/measurement models.
- `KalmanSmoother` — Rauch–Tung–Striebel fixed-interval smoother (`KalmanSmootherResult` with smoothed/filtered states and covariances).

#### Statistics — Seasonal Forecasting (`CSharpNumerics.Statistics.TimeSeriesAnalysis`)

- `HoltWintersSmoothing` — triple exponential smoothing (level/trend/seasonal) with additive and multiplicative seasonality, `Fit`, `Forecast`, and fitted-component accessors.

#### Machine Learning — Temporal Convolutional Networks (`CSharpNumerics.ML.Sequence`)

- `TCNClassifier` / `TCNRegressor` on a shared `TCNModelBase` — dilated causal convolutions with exponentially growing receptive field.
- New layers: `Conv1DLayer` gains **causal** padding and a **dilation** parameter (plus `ReceptiveField`); `ActivationLayer`, `DropoutLayer`, `BatchNorm1DLayer`, `ResidualBlock`, and `TCNBlock`.
- `ConvolutionPaddingMode` extended with `Causal`.

#### Machine Learning — Constrained Training (`CSharpNumerics.ML.Training`)

- Physics-informed loss terms implementing `ILoss`: `NonNegativityLoss`, `ConservationLoss`, `SmoothnessLoss`, and a weighted `CompositeLoss`.
- `SoftmaxConstraintHead` — parameter-free output layer producing a valid partition (outputs in [0, 1] summing to 1).
- `ConstrainedTrainer` — mini-batch SGD over a data-fidelity term plus constraint loss, with curriculum ramping of the constraint weight.

#### Physics — Quantum Mechanics / Schrödinger Equation (`CSharpNumerics.Physics.Quantum`)

- `SolveStationaryStates` — finite-difference Hamiltonian with a dedicated symmetric (Jacobi) eigensolver returning energy levels and normalised wavefunctions (`StationaryStates`).
- Analytic energy levels: `InfiniteSquareWellEnergy`, `HarmonicOscillatorEnergy`.
- Wavefunction observables: `NormSquared`, `Normalize`, `ProbabilityDensity`, `ExpectationPosition`, `ExpectationMomentum`, `PositionUncertainty`, `ToComplexWaveFunction`.
- `Evolve` — spectral (norm-conserving) time evolution of a stationary-state superposition.
- Tunnelling: `RectangularBarrierTransmission` / `RectangularBarrierReflection`.
- de Broglie relations: `DeBroglieWavelength`, `DeBroglieWavelengthFromEnergy`.
- `ReducedPlanckConstant` added to `PhysicsConstants`.

#### Engines — Game (`CSharpNumerics.Engines.Game.Rocket`)

> Ships in the [`CSharpNumerics.Engines`](https://www.nuget.org/packages/CSharpNumerics.Engines/) package (see breaking change above).

- Full 6-DOF **rocket launch simulation**: `RocketSimulationEngine`, multi-stage `RocketVehicle` / `RocketStage` / `RocketEngine` / `PropellantTank`, boosters, and `StageSeparationTrigger`.
- Guidance, navigation & control: `GuidanceComputer` with `GravityTurnGuidance`, `PEGGuidance`, and quaternion-feedback `AttitudeController`; `ThrustVectorControl`; `NavigationFilter`; `MissionProfile`.
- Tooling: `TelemetryRecorder`, `TelemetryStream` (60 fps HUD), `TrajectoryPredictor` (Kepler propagation + apsides), `TimeWarp` (1x–1000x), and `RocketUnityAdapter` (NED/ECI → Unity).
- RL environments: `RocketLandingEnv` (propulsive landing) and `AscentOptimizationEnv` (ascent trajectory optimisation).

### 🔧 Fixed

- Fixed `ComplexNumber` scalar operators (`double * complex`, `complex * double`, `complex / double` scaled only the real part; `double − complex` had the wrong imaginary sign).

---

## [3.2.0] – 2026-05-23

Feature release: game AI and flight systems, real-time fluid and terrain gameplay infrastructure, new RL environments, expanded aerodynamics and fluid-physics primitives, airfoil analysis tools, and richer face-based multiphysics boundary handling.

### 🟢 Added

- Added game AI components for training, adaptive difficulty, behavior trees, formation control, and agent orchestration.
- Added flight simulation components for aircraft configuration, aircraft state, control input handling, and flight dynamics integration.
- Added 2D and 3D game fluid simulation components, including emitters, obstacles, fluid-body coupling, and vorticity confinement.
- Added gameplay and simulation infrastructure for broad-phase collision detection, continuous collision detection, particles, and terrain interaction.
- Added performance-oriented utilities for fluid LOD, threaded fluid solving, array pooling, parallel broad-phase processing, profiling, SIMD math, and simulation recording.
- Added Unity integration bridges for AI, flight control, fluid rendering, physics synchronization, and general engine adaptation.
- Added reinforcement-learning environments for dogfighting, flight, and fluid navigation scenarios.
- Added new physics and numerics primitives, including frame transforms, atmosphere modeling, airfoil modeling, control surfaces, propulsion modeling, buoyancy, free-surface tracking, SPH fluid simulation, turbulence modeling, and soft-body mechanics.
- Added airfoil-analysis support through NACA geometry generation, panel-method solving, and an airfoil flow solver.
- Added face-based boundary condition support for multiphysics simulations.

### 🔵 Changed

- Expanded the multiphysics simulation builder to support richer boundary-condition configuration.
- Enhanced heat-transfer solvers to work with face-based boundary conditions.
- Extended multiphysics capabilities to support airfoil-flow simulation scenarios.

## [3.1.0] – 2026-05-08

Feature release: 3D finite differences, 2D finite element framework, sparse linear algebra, Kármán vortex street physics, expanded engineering materials, new multiphysics solvers (CFD, magnetostatics, plane stress, 3D heat/diffusion), and water contamination simulators (2D & volumetric 3D).

### 🟢 Added

#### Numerics — Finite Differences (3D)

- New `Grid3D` class for structured 3D grids with row-major indexing.
- New `GridOperators3D` — `Laplacian3D`, `Gradient3D`, `Divergence3D`, `Advection3D`, `SolvePoisson3D`.

#### Numerics — Finite Element (2D)

- New 2D finite element framework: `Mesh2D`, `Assembler2D`, `TriElement` (CST), `QuadElement` (bilinear Q4 with 2×2 Gauss).
- `IElement2D` interface, `ElementType` and `PlaneType` enums.

#### Numerics — Linear Algebra

- New `SparseMatrix` class (CSR format) — triplet assembly, sparse matrix-vector product, diagonal extraction, Dirichlet elimination, preconditioned conjugate gradient solver (`SolvePCG`).

#### Numerics — Vector Fields

- Extended `VectorField` with new functionality.

#### Physics — Fluid Dynamics

- New `KarmanVortexStreetExtensions` — Roshko Strouhal–Reynolds correlation, vortex shedding frequency, vortex street geometry (von Kármán stability ratio), regime classification, wake-drag coefficient.
- New `IViscousFlowModel` interface and `ViscousFlowModel` implementation for pipe flow physics.

#### Physics — Engineering Materials

- Expanded `EngineeringLibrary` with new materials: `Titanium`, `Brass`, `StainlessSteel`, `Oil`, `Glycerin`, `Wood`, `Rubber`, `Plastic`.
- Added `MagneticPermeability` property to `EngineeringMaterial`.

#### Engines — Multiphysics

New solvers:
- `CylinderFlowSolver` — 2D incompressible Navier-Stokes (Chorin projection) around a cylinder.
- `FluidFlow2DSolver` — 2D Navier-Stokes on rectangular domains (lid-driven cavity, channel flow).
- `MagneticFieldSolver` — 2D magnetostatics ($\nabla^2 A = -\mu_0 \mu_r J$).
- `PlaneStressSolver` — 2D Navier-Cauchy plane stress elasticity (SOR iterative).
- `HeatBlock3DSolver` — 3D transient heat equation with six-face Dirichlet BCs.
- `FluidDiffusion3DSolver` — 3D advection-diffusion scalar transport.
- `CylinderFlow3DSolver` — 3D incompressible Navier-Stokes around a cylinder.

Infrastructure:
- New `SimulationBuilder` and `SimulationResult` for orchestrating multiphysics simulations.
- New `MultiphysicsBinaryExporter` and `MultiphysicsJsonExporter`.
- Extended `MultiphysicsType` enum with new physics types.

#### Engines — GIS

Water contamination:
- New 2D Water Contamination simulator (`WaterContamination2DSimulator`, parameters, result, scenario builder).
- New 3D Volumetric Contamination simulator (`VolumetricContaminationSimulator`, `DepthProfile`, parameters, result, scenario builder, `ContaminationCellState3D` enum).
- New `DepthProfileCsvExporter`.

Export & analysis:
- Extended `GeoJsonExporter` with volumetric contamination, depth profile, and 2D contamination support.
- Extended `CesiumExporter` with volumetric contamination CZML animation.
- Extended `UnityBinaryExporter` with volumetric export.
- Extended `ExposurePolygonGenerator` with new contour methods.

Wildfire:
- New `WildfireMonteCarloResult` with burn probability and area statistics.
- Extended `WildfireScenarioResult` with fire perimeter generation.

Scenario:
- New `RiskScenario` fluent entry points: `ForWaterContamination2D()`, `ForVolumetricContamination()`.

---

## [3.0.1] – 2026-04-23

Patch release: robust statistics toolkit, exoplanet classification, biological materials, water contamination engine, and bug fixes.

**8 commits · 46 files changed · +7 163 / −17 lines**

### 🟢 Added

#### Robust Statistics (`CSharpNumerics.Statistics.Robust`) — 2026-04-13

- `HuberLoss` — robust loss function (quadratic/linear blend).
- `MedianAbsoluteDeviation` — MAD with scaled σ-estimate.
- `OutlierDetection` — IQR, Z-score, Modified Z-score methods.
- `Ransac` — RANSAC linear model fitting.
- `TrimmedMean` / `WinsorizedMean` — trimmed and Winsorized location estimators.
- Tests: `StatisticsRobustTests.cs` (+311 lines).
- Documentation added to Statistics README.

####  Planet Classification (`CSharpNumerics.Physics.Astro`) — 2026-04-18

- Extended `AstronomyExtensions` with new methods (+114 lines):
  - `GetSpectralFromTemp` — Harvard spectral classification (O B A F G K M L T Y).
  - `CalculateGoldilocksZone` / `CalculateGoldilocksZoneFromRadius` — habitable zone boundaries (Kopparapu et al. 2013).
  - `CalculateEsi` — Earth Similarity Index (Schulze-Makuch et al. 2011).
- New enum `SpectralType` for stellar classification.
- Tests: `AstronomyTests.cs` expanded (+148 lines).

####  Biological Materials (`CSharpNumerics.Physics.Materials.Biological`) — 2026-04-20

- `BiologicalAgent` — struct with viability decay, unit-mass conversion (kg/m³ ↔ units/m³).
- `BiologicalLibrary` — registry with `GenericVirus`, `GenericBacteria`, `GenericSpore`.
- `Materials.Biological()` — factory method on `MaterialDescriptor`.
- GIS integration: snapshot layers `bioUnits`, `viableBioUnits`, `infectiousDose`.
- Tests: `BiologicalMaterialTests.cs` (+169 lines).

####  Water Contamination Engine — 2026-04-21

**Physics models** (`Physics.Environmental.Water`):
- `LongitudinalDispersion` — 1D longitudinal dispersion in watercourses.
- `ManningEquation` — open-channel flow computation.
- `MixingZoneModel` — tributary mixing zone calculation.

**Materials** (`Physics.Materials.Water`):
- `AquaticContaminant` — aquatic contaminant descriptor with decay, adsorption, and toxicity.
- `ContaminantLibrary` — built-in contaminants (Cs-137, Sr-90, I-131, Benzene, Cyanide, Mercury, E. coli, …).
- `ContaminantType` enum.

**Terrain** (`Engines.GIS.Terrain`):
- `RiverNetwork` — flow network with nodes and segments.
- `ChannelMap` — channel map for simulation.

**Simulator** (`Engines.GIS.WaterContamination`):
- `WaterContaminationSimulator` — main simulator.
- `WaterContaminationScenarioBuilder` — fluent API.
- `WaterContaminationResult` / `WaterContaminationAnalysisResult`.
- `WaterContaminationMonteCarloResult`.
- `WaterContaminationParameters` / `WaterContaminationVariation`.
- `CellContaminationState` enum.
- Export: `CesiumExporter`, `GeoJsonExporter`, `UnityBinaryExporter`.

Tests: 4 new test files (+1 701 lines total).  
GIS README updated (+260 lines). Roadmap item moved to completed.

### 🔧 Fixed — 2026-04-22 – 2026-04-23

- Fix: terrain spread bug.
- Fix: clustering filter matrix.

---

## [3.0.0] – 2026-04-12

Major release: Exoplanet transit-detection engine, sequence ML models (CNN1D / LSTM / BiLSTM), geometric optics, time-series analysis, curve fitting, and physics model interfaces.

### 🟢 Added

#### Exoplanet Engine (`CSharpNumerics.Engines.Exoplanet`)

A complete analysis engine for exoplanet transit detection and ML-assisted classification — from raw light curve to transit prediction.

- **Data model** – `LightCurve`, `LightCurveMetadata`, `LightCurveSanitizer`, `TransitParameters`, `TransitCandidate`, `TransitFeatureSet`, `StellarProperties`.
- **Enums** – `CadenceType`, `DetrendingMethod`, `PeriodSearchMethod`, `SpectralType`, `TransitDisposition`.
- **Classical detection pipeline** – `TransitDetectionPipeline`, `LightCurvePreprocessor`, `PeriodSearcher` (BLS / Lomb-Scargle wrapper), `TransitFitter` (non-linear transit model fitting), `TransitValidator` (SNR, odd/even, secondary eclipse checks).
- **Feature extraction** – `TransitFeatureExtractor` (12 transit-specific features), `WindowedFeatureExtractor` (phase-folded windows + feature columns).
- **ML training & inference** – `TransitClassifierTrainer` (grid-search + cross-validation), `TrainedTransitModel`, `TransitInferencePipeline`, `ModelSerializer` (binary serialization for deployment), `TrainerConfig`, `TransitPrediction`.
- **Engine integration** – `ExoplanetEngine` implementing `ISimulationEngine` with event-driven batch processing, `ExoplanetEngineConfig`, `TransitDetectedEvent`.

#### Transit Physics (`CSharpNumerics.Physics.Astro`)

- `TransitModel` – Analytic transit light-curve model with limb darkening.
- `LimbDarkening` – Quadratic, linear, and nonlinear limb-darkening laws.
- `TransitGeometry` – Impact parameter, ingress/egress duration, transit depth from stellar/planetary radii.
- `KeplerOrbit` – Keplerian orbital mechanics for transit timing.
- `LimbDarkeningModel` enum.

#### Sequence ML Models (`CSharpNumerics.ML.Sequence`)

Three sequence model architectures with classification and regression variants:

- **CNN1D** – `Conv1DLayer`, `MaxPool1DLayer`, `GlobalAvgPool1DLayer`, `FlattenLayer`, `CNN1DModelBase`, `CNN1DClassifier`, `CNN1DRegressor`, `ConvolutionPaddingMode` enum.
- **LSTM** – `LSTMLayer`, `LSTMModelBase`, `LSTMClassifier`, `LSTMRegressor`.
- **BiLSTM** – `BiLSTMLayer`, `BiLSTMModelBase`, `BiLSTMClassifier`, `BiLSTMRegressor`.
- **Infrastructure** – `ISequenceModel` interface, `SequenceDataHelper`, `SequentialModel` (composable layer pipeline).

Neural-network refactoring:
- Extracted `Activations`, `DenseLayer`, `ILayer`, `OptimizerFactory` from the monolithic `NeuralNetwork` class.

#### Optics (`CSharpNumerics.Physics.Optics`)

Geometric-optics ray tracing and optical components:

- **Core** – `Ray`, `RayHit`, `RayTracer`, `OpticalScene`, `OpticalMedium`, `IOpticalSurface`.
- **Elements** – `ThinLens`, `PlaneMirror`, `SphericalMirror`, `Prism`, `CircularAperture`, `RectangularAperture`.
- **Imaging** – `ImageSensor` (projected image capture).
- **Materials** – `OpticalMaterialLibrary`, `OpticalLibrary` (refractive indices for common media).
- **Extensions** – `OpticsExtensions` (Snell's law, Brewster angle, critical angle, thin-lens equation, magnification).
- **Game engine** – `RaycastExtensions` added to `Engines.Game`.
- Enums: `LensType`, `MirrorType`.

#### Curve Fitting (`CSharpNumerics.Statistics.Fitting`)

A comprehensive fitting toolkit:

- `LeastSquaresFitter`, `WeightedLeastSquaresFitter`, `NonlinearLeastSquaresFitter` (Levenberg-Marquardt).
- `RobustFitter` with `RobustWeightFunction` (Huber, Bisquare, etc.).
- `FittingSolver` – unified solver façade.
- `GoodnessOfFit` – R², adjusted R², AIC, BIC.
- `ParameterEstimation`, `ResidualAnalysis`, `FittingResult`.

#### Time-Series Analysis (`CSharpNumerics.Statistics.TimeSeriesAnalysis`)

Signal-processing and period-detection tools:

- `BoxFittingLeastSquares` – BLS period search with `BLSResult`.
- `LombScarglePeriodogram` – for unevenly sampled data, with `PeriodogramResult`.
- `PhaseFolding` – fold time-series on a detected period.
- `TimeSeriesDetrending` – median filter, polynomial, Savitzky-Golay.
- `PeakFitting` – Gaussian/Lorentzian peak detection, `PeakResult`, `PeakShape` enum.

#### Robust Statistics (`CSharpNumerics.Statistics.Robust`)

- `SigmaClipping` – iterative sigma-clipping for outlier rejection.
- `SlidingWindowStatistics` – rolling mean/median/std with flexible windows.
- `FalseAlarmProbability` – statistical significance for periodic signals.

#### Physics Model Interfaces

Standardised interfaces for the Multiphysics engine:

- `IBeamModel` / `BeamModel` (`Physics.SolidMechanics`)
- `IHeatTransferModel` / `HeatTransferModel` (`Physics.Thermodynamics`)
- `IViscousFlowModel` / `ViscousFlowModel` (`Physics.FluidDynamics`)
- `IElectrostaticModel` / `ElectrostaticModel` (`Physics.Electromagnetism`)
- `BeamSupport` enum moved to `Physics.SolidMechanics.Enums`.

### 🔵 Changed

#### Multiphysics Engine Refactoring

- `BeamStressSolver`, `HeatPlateSolver`, `PipeFlowSolver`, `ElectricFieldSolver` refactored to use the new physics-model interfaces.
- `SimulationBuilder` updated to work with new beam support enum location.

### 🔴 Breaking Changes

- `BeamSupport` enum moved from `Physics.SolidMechanics` to `Physics.SolidMechanics.Enums` — update `using` statements accordingly.
- Multiphysics solvers now require physics-model interface instances instead of raw parameters.
- `NeuralNetwork` internals (`Activations`, `DenseLayer`, `ILayer`, `OptimizerFactory`) extracted into separate types — direct references to the monolithic class may need updating.

---

## [2.8.0] – 2026-04-03

### 🟢 Added

#### Multiphysics Engine (`CSharpNumerics.Engines.Multiphysics`)

- Introduced a new multiphysics engine with simulation builders, timeline snapshots, result objects, and solver abstractions.
- Added multiphysics solvers for beam stress, electric fields, heat plates, and pipe flow.
- Added multiphysics Monte Carlo tooling, including scenario results, parameter variation, clustering, and surrogate training.
- Added new export options for multiphysics simulations in JSON and binary formats.

#### Finite Element (`CSharpNumerics.Numerics.FiniteElement`)

- Added a finite element module with `Mesh1D`, `Assembler1D`, `BarElement`, `BeamElement`, and `IElement1D`.

#### GIS Wildfire & Terrain (`CSharpNumerics.Engines.GIS`)

- Added wildfire and terrain spread simulation support in the GIS engine, including terrain grids, fuel maps, spread snapshots, scenario builders, simulation results, and Monte Carlo outputs.
- Added wildfire export support for GeoJSON, Cesium, and Unity binary workflows.

#### Fire, Materials, and Solid Mechanics

- Added fire and engineering material models, including fuel libraries, fuel model types, and a Rothermel-based fire spread model.
- Added new solid mechanics APIs for beam analysis, section properties, and stress-strain calculations.

#### Test Coverage

- Expanded automated test coverage for multiphysics, finite elements, terrain modeling, wildfire simulation, wildfire exports, and solid mechanics.

### 🔵 Changed

- Refactored the Physics section into clearer domain-specific areas such as `Astro`, `Electromagnetism`, `Environmental`, `FluidDynamics`, `Mechanics`, `SolidMechanics`, and `Thermodynamics`.
- Split large monolithic physics extension files into smaller, focused modules for improved maintainability and discoverability.
- Updated the Numerics, Physics, GIS, and Multiphysics documentation with new examples and architecture notes.
- Extended finite-difference grid operators to support the new multiphysics and finite element workflows.
- Refined several GIS simulation and scenario components to align with the new spread and wildfire model structure.

### 🔴 Breaking Changes

- Physics namespaces were reorganized, so existing consumers may need to update `using` statements and type references.
- `AstronomyExtensions` was moved under `CSharpNumerics.Physics.Astro`.
- Mechanics-related APIs such as dynamics, kinematics, rigid body, and oscillation types were moved into `CSharpNumerics.Physics.Mechanics`.
- Previous consolidated solid mechanics functionality was restructured into more focused APIs such as `BeamExtensions`, `SectionPropertiesExtensions`, and `StressStrainExtensions`.
- Environmental, fluid, and electromagnetic extension APIs were split into dedicated modules, which may require code updates in downstream projects.

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
