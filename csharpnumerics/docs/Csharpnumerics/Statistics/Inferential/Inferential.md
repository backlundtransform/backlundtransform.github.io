---
sidebar_label: "📈 Inferential"
---

## 📈 Regression

```csharp
var points = new[] { (1.0, 2.1), (2.0, 3.9), (3.0, 6.2), (4.0, 7.8) };

// Linear regression: y = slope * x + intercept
var (slope, intercept, r) = points.LinearRegression(p => (p.Item1, p.Item2));

// Exponential: y = a * e^(bx)
Func<double, double> expFit = points.ExponentialRegression(p => (p.Item1, p.Item2));

// Logarithmic: y = a + b * ln(x)
Func<double, double> logFit = points.LogarithmicRegression(p => (p.Item1, p.Item2));

// Power: y = a * x^b
Func<double, double> powFit = points.PowerRegression(p => (p.Item1, p.Item2));

// Polynomial (degree N): y = a₀ + a₁x + a₂x² + ...
var (predict, coefficients) = points.PolynomialRegression(p => (p.Item1, p.Item2), degree: 2);
double yHat = predict(2.5);
```

---

## 🔗 Correlation

```csharp
// Pearson correlation coefficient with p-value
var (r, pValue) = data.PearsonCorrelation(p => (p.X, p.Y));

// Spearman rank correlation with p-value
var (rho, pVal) = data.SpearmanCorrelation(p => (p.X, p.Y));
```

---

## 🧪 Hypothesis Tests

All tests return a `StatisticalTestResult` with `TestStatistic`, `PValue`, `RejectNull`, `ConfidenceLevel`, and `DegreesOfFreedom`.

```csharp
// One-sample t-test: is the mean equal to 50?
StatisticalTestResult t1 = scores.OneSampleTTest(s => s.Value, hypothesizedMean: 50);

// Two-sample t-test (Welch's): are two group means different?
StatisticalTestResult t2 = groupA.TwoSampleTTest(groupB, s => s.Value);

// Paired t-test: before/after comparison
StatisticalTestResult t3 = patients.PairedTTest(p => (p.Before, p.After));

// Z-test: known population standard deviation
StatisticalTestResult z = measurements.ZTest(m => m.Value, hypothesizedMean: 100, populationStdDev: 15);

// Chi-squared goodness-of-fit
var bins = new[] { (observed: 50.0, expected: 40.0), (30.0, 40.0), (20.0, 20.0) };
StatisticalTestResult chi = bins.ChiSquaredTest(b => (b.observed, b.expected));

// One-way ANOVA: compare means across groups
StatisticalTestResult anova = allSamples.OneWayAnova(s => (s.Value, s.GroupId));
```

**Inspect the result**

```csharp
Console.WriteLine(anova.TestStatistic); // F-value
Console.WriteLine(anova.PValue);        // p-value
Console.WriteLine(anova.RejectNull);    // true/false at 95% confidence
```
