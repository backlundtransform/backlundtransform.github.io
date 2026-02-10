---
sidebar_label: "📊 Statistics"
---

```csharp
var noise = new Random().GenerateNoise(4);
double median = ts.Median(p => p.Value);
double std = ts.StandardDeviation(p => p.Value);
```
Coefficient of determination:
```csharp
var data = new[] { (1.0, 5.0), (2.0, 1.0), (3.0, 4.0), (4.0, 6.0) };
double r2 = data.CoefficientOfDetermination(p => (p.Item1, p.Item2));
```

Regression:

```csharp
var (slope, intercept, corr) = serie.LinearRegression(p => (p.Index, p.Value));
var expFunc = serie.ExponentialRegression(p => (p.Index, p.Value));
```


K-nearest neighbors:

```csharp
var data = new List<(double x, double y, int c)> { (7,7,0), (7,4,0), (3,4,1), (1,4,1) };
int classification = data.KnearestNeighbors(p => (p.x, p.y, p.c), (3,7), 3);
```



