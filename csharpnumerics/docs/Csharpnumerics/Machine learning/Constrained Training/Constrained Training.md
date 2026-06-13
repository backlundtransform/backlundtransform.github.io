---
sidebar_label: "⚖️ Constrained Training"
---

The `CSharpNumerics.ML.Training` namespace provides **physics-informed** loss terms and a trainer that enforces conservation laws and shape constraints during optimisation — the basis for decomposing a signal into components that obey domain rules (non-negative, summing to a known total, smooth).

## ⚖️ Loss Terms

All implement `ILoss` with `Compute(prediction, target)` and `Gradient(prediction, target)`:

| Loss | Penalty | Purpose |
|------|---------|---------|
| `NonNegativityLoss` | $\lambda \sum \max(-y_i, 0)^2$ | Push components towards $y_i \geq 0$ |
| `ConservationLoss` | $\lambda (\sum t_i - \sum y_i)^2$ | Predicted total matches the reference total |
| `SmoothnessLoss` | $\lambda \sum (y_{t-1} - 2y_t + y_{t+1})^2$ | Bounded second derivative (smooth series) |
| `CompositeLoss` | $\sum_k w_k L_k$ | Weighted combination of the above |

```csharp
using CSharpNumerics.ML.Training;
using CSharpNumerics.Numerics.Objects;

var components = new VectorN(new[] { 3.0, 3.0, 4.0 });   // Σ = 10
var target     = new VectorN(new[] { 5.0, 5.0 });         // Σ = 10 (reference total)

var nonNeg       = new NonNegativityLoss(weight: 1.0);
var conservation = new ConservationLoss(weight: 1.0);

double penalty = conservation.Compute(components, target);   // 0 — sums match
VectorN grad   = nonNeg.Gradient(components, target);        // 0 — all non-negative

// Combine constraints; value and gradient are the weighted sum of the terms.
var composite = new CompositeLoss()
    .Add(new NonNegativityLoss(), weight: 1.0)
    .Add(new ConservationLoss(), weight: 5.0)
    .Add(new SmoothnessLoss(), weight: 0.1);
```

## 🧮 SoftmaxConstraintHead

A parameter-free output `ILayer` that maps raw scores to a valid partition via softmax: every output is in $[0, 1]$ and the outputs sum to 1. Use it to predict the *fraction* of total flow per component, guaranteeing a valid split by construction.

```csharp
var head = new SoftmaxConstraintHead();
var ratios = head.Forward(new[] { new VectorN(new[] { 1.0, 2.0, 3.0 }) });
// ratios[0] sums to 1, each entry in [0, 1]
```

## 🎓 ConstrainedTrainer

Mini-batch SGD that fits a `SequentialModel` under a constraint loss, with optional **curriculum learning** — the constraint weight ramps linearly from 0 to full over `CurriculumWarmupEpochs`, so the model first fits the data and the constraints are tightened gradually. The data-fidelity term defaults to squared error.

```csharp
using CSharpNumerics.ML.Training;
using CSharpNumerics.ML.NeuralNetwork;
using CSharpNumerics.ML.NeuralNetwork.Layers;
using CSharpNumerics.ML.Enums;

var model = new SequentialModel(
    new DenseLayer(features, 16, ActivationType.ReLU),
    new DenseLayer(16, components, ActivationType.Linear));

var constraints = new CompositeLoss()
    .Add(new ConservationLoss(weight: 10.0))
    .Add(new NonNegativityLoss(weight: 1.0));

var trainer = new ConstrainedTrainer(constraints)
{
    Epochs = 400,
    LearningRate = 0.01,
    BatchSize = 16,
    CurriculumWarmupEpochs = 100   // ramp constraints over the first 100 epochs
};

IReadOnlyList<double> lossHistory = trainer.Train(model, X, targetComponents);
// After training, predicted components sum to within ~1% of the reference total.
```
