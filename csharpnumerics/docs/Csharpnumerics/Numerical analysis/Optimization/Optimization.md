---
sidebar_label: "🔋 Optimization"
---

### 🔌 Interfaces

| Interface | Key method | Purpose |
|-----------|-----------|---------|
| `IOptimizer` | `VectorN Step(VectorN parameters, VectorN gradient)` | Single gradient-based update step |
| `IObjectiveFunction` | `double Evaluate(double[] x)`, `double[] Gradient(double[] x)` | Objective + gradient for `Minimizer` |
| `IConvergenceCriterion` | `bool HasConverged(int iteration, double loss, double gradNorm)` | Termination check |

### 🎯 Single-Objective Optimisers

**GradientDescent** — vanilla, momentum, Nesterov

```csharp
var gd = new GradientDescent(learningRate: 0.01, momentum: 0.9, nesterov: true);

VectorN w = new VectorN(new double[] { 0, 0, 0 });
VectorN grad = ComputeGradient(w);
w = gd.Step(w, grad);   // one update step
```

**Adam / AdamW** — adaptive moment estimation

```csharp
var adam = new Adam(learningRate: 0.001, beta1: 0.9, beta2: 0.999);
w = adam.Step(w, grad);

// AdamW (decoupled weight decay)
var adamw = new Adam(learningRate: 0.001, weightDecay: 0.01, decoupledWeightDecay: true);
```

**CoordinateDescent** — L1/L2 regularised least-squares

Minimises $\frac{1}{2}\|Xw - y\|^2 + \lambda_1\|w\|_1 + \frac{1}{2}\lambda_2\|w\|^2$ via cyclic coordinate updates with soft-thresholding. Used by `Lasso` and `ElasticNet`.

```csharp
var cd = new CoordinateDescent(maxIterations: 1000, tolerance: 1e-7);
double[] weights = cd.Solve(X, y, l1: 0.1, l2: 0.01, skipBiasRegularisation: true);
```

**Minimizer** — convenience runner

Ties an `IOptimizer`, `IConvergenceCriterion`, and `IObjectiveFunction` together:

```csharp
var minimizer = new Minimizer(
    new Adam(learningRate: 0.01),
    new MaxIterationsOrTolerance(maxIterations: 5000, tolerance: 1e-8));

VectorN x0 = new VectorN(new double[] { 5, -3 });
VectorN xMin = minimizer.Minimize(myObjective, x0);

Console.WriteLine($"Converged in {minimizer.IterationsUsed} iterations, loss = {minimizer.FinalLoss:E3}");
```

### ⚙️ Strategies

**EarlyStopping** — patience-based training halt

```csharp
var es = new EarlyStopping(patience: 10, minDelta: 1e-4);

for (int epoch = 0; epoch < maxEpochs; epoch++)
{
    double valLoss = Evaluate(model, validationData);
    if (es.Check(valLoss))
    {
        Console.WriteLine($"Early stop at epoch {epoch}");
        break;
    }
}
```

**LearningRateSchedule** — lr adjustment over training

```csharp
var schedule = new LearningRateSchedule(
    initialLr: 0.01,
    type: LearningRateSchedule.ScheduleType.CosineAnnealing,
    decaySteps: 1000);

for (int step = 0; step < 1000; step++)
{
    double lr = schedule.GetLearningRate(step);
    // use lr in optimizer
}
```

| Schedule | Formula |
|----------|---------|
| `Constant` | $\eta_0$ |
| `StepDecay` | $\eta_0 \cdot \gamma^{\lfloor t / s \rfloor}$ |
| `ExponentialDecay` | $\eta_0 \cdot \gamma^{t/s}$ |
| `InverseTimeDecay` | $\eta_0 / (1 + \gamma t)$ |
| `CosineAnnealing` | $\eta_{\min} + \frac{1}{2}(\eta_0 - \eta_{\min})(1 + \cos(\pi t / T))$ |

### 🏹 Multi-Objective: Pareto Front

`ParetoSolution` holds decision variables and objective values. `ParetoFront` provides non-dominated sorting and crowding distance computation.

```csharp
// Create solutions (all objectives are minimised)
var solutions = new List<ParetoSolution>
{
    new ParetoSolution(new[] { 1.0 }, new[] { 0.2, 0.8 }),
    new ParetoSolution(new[] { 2.0 }, new[] { 0.5, 0.5 }),
    new ParetoSolution(new[] { 3.0 }, new[] { 0.9, 0.1 }),
    new ParetoSolution(new[] { 4.0 }, new[] { 0.6, 0.7 }),  // dominated
};

// Non-dominated sorting: partition into ranked fronts
List<List<ParetoSolution>> fronts = ParetoFront.NonDominatedSort(solutions);
// fronts[0] = Pareto-optimal, fronts[1] = next rank, ...

// Or just get the Pareto-optimal front directly
List<ParetoSolution> optimal = ParetoFront.GetFront(solutions);

// Crowding distance (higher = more isolated = more diverse)
ParetoFront.ComputeCrowdingDistance(optimal);
double cd = optimal[0].CrowdingDistance;
```

**Dominance check:**

```csharp
bool dominates = solutionA.Dominates(solutionB);
// true if A ≤ B on all objectives and A < B on at least one
```

### 🧬 Multi-Objective: NSGA-II

NSGA-II (Deb et al. 2002) is a population-based evolutionary algorithm that converges towards the Pareto front while maintaining solution diversity via crowding distance. Uses SBX crossover and polynomial mutation.

```csharp
// Bi-objective: minimise f₁(x) = x² and f₂(x) = (x-2)²
var nsga2 = new NSGA2(
    evaluate: x => new[] { x[0] * x[0], (x[0] - 2) * (x[0] - 2) },
    numVariables: 1,
    lowerBounds: new[] { -5.0 },
    upperBounds: new[] { 5.0 },
    populationSize: 100,
    generations: 200,
    crossoverRate: 0.9,
    mutationRate: 0.1,
    seed: 42);

NSGA2Result result = nsga2.Run();

Console.WriteLine($"Pareto front: {result.FrontSize} solutions");
foreach (var sol in result.ParetoFront)
    Console.WriteLine($"  x = {sol.Variables[0]:F3}, f₁ = {sol.Objectives[0]:F3}, f₂ = {sol.Objectives[1]:F3}");
```

**Multi-variable, multi-objective (ZDT1 benchmark):**

```csharp
int n = 30;
var nsga2 = new NSGA2(
    evaluate: x =>
    {
        double f1 = x[0];
        double g = 1 + 9 * Enumerable.Range(1, n - 1).Sum(i => x[i]) / (n - 1);
        double f2 = g * (1 - Math.Sqrt(f1 / g));
        return new[] { f1, f2 };
    },
    numVariables: n,
    lowerBounds: Enumerable.Repeat(0.0, n).ToArray(),
    upperBounds: Enumerable.Repeat(1.0, n).ToArray(),
    populationSize: 200,
    generations: 500,
    seed: 123);

NSGA2Result result = nsga2.Run();

// result.ParetoFront contains the approximated Pareto front
// result.FinalPopulation contains the full final population
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `populationSize` | 100 | Number of individuals (rounded up to even) |
| `generations` | 200 | Evolution cycles |
| `crossoverRate` | 0.9 | SBX crossover probability per pair |
| `mutationRate` | 0.1 | Polynomial mutation probability per variable |
| `mutationScale` | 0.1 | Mutation range relative to variable bounds |
| `seed` | 42 | Random seed for reproducibility |
