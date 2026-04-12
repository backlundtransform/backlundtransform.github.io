---
sidebar_label: "⏳Time Series Analysis"
---

The `CSharpNumerics.Statistics.TimeSeriesAnalysis` namespace provides specialised algorithms for periodic signal detection, detrending, phase folding, and peak/event fitting in time-series data — including support for **unevenly sampled** observations.

### 📡 Lomb–Scargle Periodogram

Spectral analysis for unevenly sampled data. The classical Lomb (1976) / Scargle (1982) algorithm with the Townsend τ-offset for numerical stability.

```csharp
using CSharpNumerics.Statistics.TimeSeriesAnalysis;
using CSharpNumerics.Numerics.Objects;

// Observations at irregular times
var times  = new VectorN(new[] { 0.0, 1.1, 2.3, 3.0, 4.7, 5.2, /* … */ });
var values = new VectorN(new[] { 0.1, 0.9, 0.0, -0.8, 0.2, 0.95, /* … */ });

// Frequency-range scan
PeriodogramResult ls = LombScarglePeriodogram.Compute(
    times, values,
    minFrequency: 0.01, maxFrequency: 1.0, numFrequencies: 1000);

double bestFreq   = ls.BestFrequency;   // strongest spectral peak
double bestPeriod  = ls.BestPeriod;      // 1 / bestFreq
double bestPower   = ls.BestPower;

// Period-range scan (linearly spaced in period)
PeriodogramResult lsP = LombScarglePeriodogram.ComputeByPeriod(
    times, values, minPeriod: 1, maxPeriod: 50, numPeriods: 500);

// False-alarm probability
double fap = LombScarglePeriodogram.FalseAlarmProbability(
    bestPower, numObservations: times.Length, numFrequencies: 1000);
```

### 📦 Box-fitting Least Squares (BLS)

Transit detection via the Kovács, Zucker & Mazeh (2002) algorithm. Phase-folds the light curve at each trial period and searches for the optimal box-shaped dip.

```csharp
// Search for transits between 2 and 20 days
BLSResult bls = BoxFittingLeastSquares.Compute(
    times, flux,
    minPeriod: 2, maxPeriod: 20, numPeriods: 500,
    minDurationFraction: 0.01, maxDurationFraction: 0.15, numBins: 200);

double period   = bls.BestPeriod;
double epoch    = bls.BestEpoch;          // mid-transit time
double depth    = bls.BestDepth;          // flux decrement
double durFrac  = bls.BestDurationFraction;

// Or supply explicit trial periods
var trialPeriods = new VectorN(new[] { 3.0, 5.0, 7.0, 10.0 });
BLSResult bls2 = BoxFittingLeastSquares.Compute(times, flux, trialPeriods);
```

### 🔄 Phase Folding

Fold a time series onto a single cycle of a trial period — essential for visualising periodic signals.

```csharp
// Raw fold (sorted by phase)
var (phases, vals) = PhaseFolding.Fold(times, values, period: 12.5, epoch: 0);

// Binned fold (average per bin)
var (binCenters, binMeans) = PhaseFolding.FoldAndBin(
    times, values, period: 12.5, numBins: 20);

// Binned fold with per-bin standard deviations
var (centers, means, stds) = PhaseFolding.FoldAndBinWithErrors(
    times, values, period: 12.5, numBins: 20);
```

### 📐 Trend Fitting / Detrending

Remove systematic trends before period analysis. All methods return both the detrended signal and the estimated trend.

```csharp
// Polynomial detrending (uses LeastSquaresFitter internally)
var (detrended, trend) = TimeSeriesDetrending.PolynomialDetrend(times, values, degree: 2);

// Moving-average (centred window, handles edges)
var (det, ma) = TimeSeriesDetrending.MovingAverageDetrend(values, windowSize: 15);

// Median filter (robust to outliers)
var (det2, med) = TimeSeriesDetrending.MedianFilterDetrend(values, windowSize: 15);

// Savitzky–Golay smoothing (local polynomial least squares)
var (det3, sg) = TimeSeriesDetrending.SavitzkyGolayDetrend(values, windowSize: 11, polyOrder: 3);

// Differencing (output length = n − order)
VectorN diff1 = TimeSeriesDetrending.Difference(values, order: 1);
VectorN diff2 = TimeSeriesDetrending.Difference(values, order: 2);
```

### ⛰️ Peak / Event Fitting

Detect and fit peaks (or valleys) in a time series with Gaussian or Lorentzian profiles via Levenberg-Marquardt.

```csharp
// Find peaks with prominence and distance filtering
List<int> peaks = PeakFitting.FindPeaks(values, prominence: 0.5, minDistance: 5);
List<int> dips  = PeakFitting.FindValleys(values, prominence: 0.3);

// Fit a Gaussian to a region around a known peak
PeakResult g = PeakFitting.FitGaussian(xRegion, yRegion,
    centerEstimate: 10.0, widthEstimate: 2.0);
// g.Center, g.Amplitude, g.Width, g.Baseline, g.RSquared

// Fit a Lorentzian
PeakResult lor = PeakFitting.FitLorentzian(xRegion, yRegion,
    centerEstimate: 10.0, widthEstimate: 2.0);

// Find and fit all peaks automatically
List<PeakResult> fitted = PeakFitting.FindAndFitPeaks(
    x, y, prominence: 0.5, shape: PeakShape.Gaussian, fitRadius: 15);
```

| Property | Description |
|----------|-------------|
| `Center` | Fitted peak centre (x-axis) |
| `Amplitude` | Fitted height above baseline |
| `Width` | σ (Gaussian) or γ (Lorentzian) |
| `Baseline` | Constant offset |
| `Shape` | `PeakShape.Gaussian` or `PeakShape.Lorentzian` |
| `RSquared` | Goodness-of-fit for the peak region |
| `PeakIndex` | Index in the original series |

### 🎰 False Alarm Probability

Estimate the statistical significance of periodogram peaks using analytical (Baluev 2008) or bootstrap methods.

```csharp
using CSharpNumerics.Statistics.TimeSeriesAnalysis;

// Analytical FAP (fast) — Baluev 2008 approximation
double fap = FalseAlarmProbability.AnalyticalFAP(
    peakPower: 12.5, numFrequencies: 1000, numDataPoints: 500);
// fap ≈ 0.0001 → highly significant detection

// Bootstrap FAP (accurate, slower) — shuffles values and re-evaluates periodogram
double fapBoot = FalseAlarmProbability.BootstrapFAP(
    times, values, peakPower: 12.5,
    nBootstrap: 1000, minPeriod: 1.0, maxPeriod: 50.0,
    numFrequencies: 500, seed: 42);
```

### 🪟 Sliding Window Statistics

Running (sliding window) descriptive statistics with centered windows. Edge windows are computed with fewer points. Even window sizes are incremented to the next odd value for symmetric centering.

```csharp
using CSharpNumerics.Statistics.TimeSeriesAnalysis;

var data = new[] { 1.0, 3.0, 5.0, 7.0, 2.0, 4.0, 6.0 };

double[] mean   = SlidingWindowStatistics.RunningMean(data, windowSize: 3);
double[] std    = SlidingWindowStatistics.RunningStd(data, windowSize: 3);
double[] mad    = SlidingWindowStatistics.RunningMAD(data, windowSize: 5);
double[] median = SlidingWindowStatistics.RunningMedian(data, windowSize: 3);

// All outputs have the same length as the input array
// MAD × 1.4826 ≈ standard deviation for normally distributed data
```
