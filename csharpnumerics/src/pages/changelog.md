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
