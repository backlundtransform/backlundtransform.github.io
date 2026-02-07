CSharpNumerics provides a unified interpolation API supporting linear and logarithmic scales:

* **Linear**
* **Log–Log** (log x, log y)
* **Lin–Log** (lin x, log y)
* **Log–Lin** (log x, lin y)

All methods are routed through one central function.


```csharp
public enum InterpolationType
{
    Linear,
    Logarithmic,   // log–log
    LogLin,
    LinLog
}
```

```csharp
double Interpolate<T>(
    this IEnumerable<T> source,
    Func<T, (double x, double y)> selector,
    double index,
    InterpolationType type);
```

Example:

```csharp
var data = new List<Serie>
{
    new Serie { Index = 1, Value = 10 },
    new Serie { Index = 10, Value = 100 }
};

double y = data.Interpolate(
    p => (p.Index, p.Value),
    3.5,
    InterpolationType.Linear
);
```
