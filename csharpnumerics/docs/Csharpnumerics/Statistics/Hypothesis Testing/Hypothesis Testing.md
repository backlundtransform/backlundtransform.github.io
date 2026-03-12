---
sidebar_label: "🧪 Hypothesis Testing"
---

Cleaner extensions directly on `IEnumerable<double>` with `Alternative` enum (TwoSided, Less, Greater),
confidence intervals, and effect sizes. All return `HypothesisTestResult`.

## 🔬 One-Sample t-Test

```csharp
var sample = new[] { 12.1, 11.3, 10.8, 11.9, 12.5, 11.0 };

// One-sample t-test: H₀: μ = 10
var result = sample.TTest(mu: 10.0, alternative: Alternative.TwoSided);
result.PValue                // p-value
result.RejectNull            // true
result.ConfidenceIntervalLower / result.ConfidenceIntervalUpper
result.EffectSize            // Cohen's d

// One-sided: is the mean greater than 10?
var greater = sample.TTest(mu: 10.0, alternative: Alternative.Greater);
```

## 🔀 Two-Sample & Paired t-Tests

```csharp
// Two-sample Welch's t-test
var groupA = new[] { 10.1, 10.3, 9.8, 10.5 };
var groupB = new[] { 5.1, 4.9, 5.3, 5.0 };
var t2 = groupA.TTest(groupB, Alternative.TwoSided);

// Paired t-test
var before = new[] { 60.0, 62.0, 58.0, 65.0 };
var after  = new[] { 70.0, 73.0, 68.0, 75.0 };
var paired = before.PairedTTest(after, Alternative.Greater);
```

## 📊 Z-Test, Chi-Squared & F-Test

```csharp
// Z-test (known σ)
var z = sample.ZTest(mu: 10.0, populationStdDev: 1.5, alternative: Alternative.TwoSided);

// Chi-squared goodness-of-fit
var observed = new[] { 50.0, 30.0, 20.0 };
var expected = new[] { 40.0, 30.0, 30.0 };
var chi = observed.ChiSquaredTest(expected);

// F-test for equality of variances
var fTest = groupA.FTest(groupB, Alternative.TwoSided);
```

## 🏷️ Non-Parametric Tests & ANOVA

```csharp
// Non-parametric tests
var u = groupA.MannWhitneyUTest(groupB, Alternative.TwoSided);   // Mann-Whitney U
var w = diffs.WilcoxonSignedRankTest(Alternative.TwoSided);        // Wilcoxon signed-rank

// One-way ANOVA
var groups = new List<IEnumerable<double>> { groupA, groupB, groupC };
var anova = groups.Anova(confidenceLevel: 0.95);
anova.EffectSize   // η²
```
