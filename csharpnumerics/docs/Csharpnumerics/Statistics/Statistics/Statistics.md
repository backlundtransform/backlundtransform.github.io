---
sidebar_label: "📊 Statistics"
---

## 📏 Descriptive Statistics

Compute common summary statistics from any collection using a selector:

```csharp
double median = data.Median(p => p.Value);
double variance = data.Variance(p => p.Value);
double stdDev = data.StandardDeviation(p => p.Value);
double covariance = data.Covariance(p => (p.X, p.Y));
```

---

## 🎯 Coefficient of Determination

Measures how well a model fits the data ($R^2$):

```csharp
var data = new[] { (1.0, 5.0), (2.0, 1.0), (3.0, 4.0), (4.0, 6.0) };
double r2 = data.CoefficientOfDetermination(p => (p.Item1, p.Item2));
```

---

## 📈 Regression

**Linear** and **Exponential** regression with slope, intercept, and correlation:

```csharp
var (slope, intercept, corr) = serie.LinearRegression(p => (p.Index, p.Value));
var expFunc = serie.ExponentialRegression(p => (p.Index, p.Value));
```

---

## 👥 K-Nearest Neighbors

Classify a point based on its closest neighbors:

```csharp
var data = new List<(double x, double y, int c)> { (7,7,0), (7,4,0), (3,4,1), (1,4,1) };
int classification = data.KnearestNeighbors(p => (p.x, p.y, p.c), (3,7), 3);
```

---

## 🔒 Confidence Intervals

Compute confidence intervals for a given significance level:

```csharp
var (lower, upper) = data.ConfidenceIntervals(p => p.Value, 0.95);
```

---

## ➕ Cumulative Sum

Running total over a sequence:

```csharp
var cumsum = data.CumulativeSum(p => p.Value);
```

---

## 🔔 Normal Distribution

Create a probability density function for $\mathcal{N}(\mu, \sigma)$:

```csharp
var pdf = Statistics.NormalDistribution(standardDeviation: 1, mean: 0);
double density = pdf(0.5);
```


