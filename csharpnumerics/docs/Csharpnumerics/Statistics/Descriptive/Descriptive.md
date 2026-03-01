---
sidebar_label: "📏Descriptive"
---

## 📏 Descriptive Statistics

All methods follow the generic selector pattern `IEnumerable<T>.Method(Func<T, double>)`.

```csharp
var data = new[] { 3.0, 7.0, 7.0, 2.0, 5.0, 1.0, 9.0, 4.0 };

double median   = data.Median(x => x);           // 4.5
double variance = data.Variance(x => x);          // population variance (÷n)
double sVar     = data.SampleVariance(x => x);    // sample variance (÷(n-1))
double std      = data.StandardDeviation(x => x); // population std dev
double mode     = data.Mode(x => x);              // 7.0
double range    = data.Range(x => x);             // 8.0
double p90      = data.Percentile(x => x, 90);    // 90th percentile
double iqr      = data.InterquartileRange(x => x);// Q3 - Q1
double skew     = data.Skewness(x => x);          // sample skewness
double kurt     = data.Kurtosis(x => x);          // excess kurtosis (normal = 0)
```

---

## 🔗 Bivariate Statistics

Bivariate selectors use `Func<T, (double x, double y)>`:

```csharp
var pairs = new[] { (1.0, 5.0), (2.0, 1.0), (3.0, 4.0), (4.0, 6.0) };
double cov = pairs.Covariance(p => (p.Item1, p.Item2));
double r2  = pairs.CoefficientOfDetermination(p => (p.Item1, p.Item2));
```

---

## ➕ Cumulative Sum & Confidence Intervals

```csharp
double[] cumSum = data.CumulativeSum(x => x).ToArray();
var (lo, hi) = data.ConfidenceIntervals(x => x, 0.95);
```




