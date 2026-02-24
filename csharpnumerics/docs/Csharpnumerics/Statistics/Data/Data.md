---
sidebar_label: "🗃️ Data"
---

## 🗃️ Data

The `CSharpNumerics.Statistics.Data` namespace provides core data structures for working with indexed and time-indexed data.

---

## 📌 Serie & TimeSerie

Simple data-point classes for single-value series:

```csharp
// Numeric index
var point = new Serie { Index = 1.0, Value = 42.0 };

// DateTime index
var tp = new TimeSerie { TimeStamp = DateTime.Now, Value = 99.5 };
```

---

## 📊 Series

Columnar data structure for multi-column numeric data with optional grouping.

```csharp
// Create from a list of Serie
var series = Series.FromSerie(serieList);

// Load from CSV (auto-indexes rows, supports target and group columns)
var csv = Series.FromCsv("data.csv", sep: ',', targetColumn: "Price", groupColumn: "Region");

// Access
int[] index     = csv.Index;
double[][] data = csv.Data;   // data[col][row]
string[] cols   = csv.Cols;
int[] groups    = csv.Groups;

// Convert to Matrix (optionally exclude a column)
Matrix m = csv.ToMatrix(excludeCol: 0);
```

---

## 📈 TimeSeries

Columnar data structure indexed by `DateTime`, designed for time-based analysis.

```csharp
// Create from a list of TimeSerie
var ts = TimeSeries.FromTimeSerie(timeSerieList, columnName: "Temperature");

// Load from CSV (first column = DateTime, remaining = features)
var csv = TimeSeries.FromCsv("timeseries.csv");

// Access
DateTime[] time = csv.Time;
double[][] data = csv.Data;   // data[col][row]
string[] cols   = csv.Cols;
int rows        = csv.RowCount;
int columns     = csv.ColumnCount;

// Convert to Matrix
Matrix m = csv.ToMatrix();
```

---

## 🔧 DataExtensions

Utility methods for generating and resampling series data.

```csharp
// Generate Serie from a function
Func<double, double> f = x => Math.Sin(x);
List<Serie> serie = f.GetSeries(minValue: 0, maxValue: 10, stepSize: 100);

// Generate TimeSerie from a function
Func<DateTime, double> g = t => t.Hour * 1.5;
List<TimeSerie> ts = g.GetTimeSeries(startTime, endTime, stepSize: 50);

// Resample a TimeSerie to equidistant steps (interpolation)
List<TimeSerie> resampled = timeSeries.GenerateTimeSerieWithEquivalentSteps(
    minutes: 15, startDate: start, endDate: end);

// Resample with grouping operator (Average, Max, Min, Sum, Median)
List<TimeSerie> grouped = timeSeries.GenerateTimeSerieWithEquivalentSteps(
    minutes: 60, startDate: start, endDate: end,
    groupOperator: GroupOperator.Average, multiplier: 1, shouldInterpolate: true);
```


