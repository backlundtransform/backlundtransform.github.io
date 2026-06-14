---
sidebar_label: "🧠 Sequence Models"
---

Sequence-specific deep-learning models live under `CSharpNumerics.ML.Sequence`.
They keep the existing `IModel` contract by interpreting each `Matrix` row as a flattened `(timesteps x features)` sample.

Currently available models:

* `CNN1DClassifier` in `CSharpNumerics.ML.Sequence.Models.Classification`
* `CNN1DRegressor` in `CSharpNumerics.ML.Sequence.Models.Regression`
* `LSTMClassifier` in `CSharpNumerics.ML.Sequence.Models.Classification`
* `LSTMRegressor` in `CSharpNumerics.ML.Sequence.Models.Regression`
* `BiLSTMClassifier` in `CSharpNumerics.ML.Sequence.Models.Classification`
* `BiLSTMRegressor` in `CSharpNumerics.ML.Sequence.Models.Regression`
* `TCNClassifier` in `CSharpNumerics.ML.Sequence.Models.Classification`
* `TCNRegressor` in `CSharpNumerics.ML.Sequence.Models.Regression`

Current sequence infrastructure:

* `ISequenceModel` in `CSharpNumerics.ML.Sequence.Interfaces`
* `ConvolutionPaddingMode` in `CSharpNumerics.ML.Sequence.Enums` — `Valid`, `Same`, `Causal`
* `Conv1DLayer` in `CSharpNumerics.ML.Sequence.Layers` — supports causal padding and dilation
* `MaxPool1DLayer` in `CSharpNumerics.ML.Sequence.Layers`
* `GlobalAvgPool1DLayer` in `CSharpNumerics.ML.Sequence.Layers`
* `FlattenLayer` in `CSharpNumerics.ML.Sequence.Layers`
* `LSTMLayer` in `CSharpNumerics.ML.Sequence.Layers`
* `BiLSTMLayer` in `CSharpNumerics.ML.Sequence.Layers`
* `ActivationLayer` in `CSharpNumerics.ML.Sequence.Layers` — parameter-free pointwise activation
* `DropoutLayer` in `CSharpNumerics.ML.Sequence.Layers` — inverted dropout (train only)
* `BatchNorm1DLayer` in `CSharpNumerics.ML.Sequence.Layers` — channel-wise normalisation
* `ResidualBlock` in `CSharpNumerics.ML.Sequence.Layers` — TCN residual block (causal + dilated)
* `TCNBlock` in `CSharpNumerics.ML.Sequence.Layers` — exponentially dilated residual stack

## 🌊 CNN1D Architecture

Default CNN1D architecture:

```text
Conv1D -> GlobalAvgPool -> Dense(hidden) -> Dense(output)
```

Optional variants:

* `UseMaxPooling = true` inserts `MaxPool1DLayer` after the convolution.
* `UseGlobalAveragePooling = false` switches to `FlattenLayer` before the dense projection.

Shared CNN1D hyperparameters:

* `TimeSteps`
* `Features`
* `Filters`
* `KernelSize`
* `ConvStride`
* `Padding` (`Same`, `Valid`)
* `UseMaxPooling`
* `PoolSize`
* `PoolStride`
* `UseGlobalAveragePooling`
* `HiddenUnits`
* `LearningRate`
* `Epochs`
* `BatchSize`
* `Activation`

Additional regression hyperparameters:

* `L2`

## 🔁 LSTM Architecture

Default LSTM architecture:

```text
LSTMLayer(returnSequences=false) -> Dense(hidden) -> Dense(output)
```

The LSTM layer implements the standard four-gate equations (forget, input, output, cell candidate) with full BPTT and gradient clipping.
Key features:

* Forget gate bias initialized to `1.0` to reduce vanishing gradients
* Configurable `ClipNorm` for gradient clipping (default: `5.0`)
* `returnSequences=false` outputs only the final hidden state

LSTM hyperparameters:

* `TimeSteps`
* `Features`
* `HiddenSize` - LSTM hidden/cell state dimension
* `HiddenUnits` - optional dense layer after LSTM
* `ClipNorm` - max gradient norm (default: `5.0`)
* `LearningRate`
* `Epochs`
* `BatchSize`
* `Activation`
* `L2`

## ↔️ Bi-LSTM Architecture

Default Bi-LSTM architecture:

```text
BiLSTMLayer(returnSequences=false) -> Dense(hidden) -> Dense(output)
```

The Bi-LSTM layer composes two `LSTMLayer` instances - one processing the input forwards, one backwards - and concatenates their hidden states per timestep so that output dimension = `2 x HiddenSize`.

When `returnSequences=false`, the output is `[h_fwd_T | h_bwd_1]`.

Bi-LSTM hyperparameters are identical to LSTM (same `HiddenSize`, `ClipNorm`, etc.). The dense layer automatically adapts to the `2 x HiddenSize` input width.

## ⏱️ TCN Architecture

A **Temporal Convolutional Network** stacks dilated **causal** convolutions inside residual blocks, giving an exponentially growing receptive field while preserving sequence length. Unlike an RNN it processes all timesteps in parallel, and unlike a plain CNN its causal padding guarantees no leakage from future timesteps.

Default TCN architecture:

```text
TCNBlock -> GlobalAvgPool -> Dense(hidden) -> Dense(output)
```

Each `TCNBlock` is a stack of `ResidualBlock`s whose dilation doubles per level (1, 2, 4, 8, …). A residual block is:

```text
Conv1D(causal, dilated) -> BatchNorm -> ReLU -> Dropout
  -> Conv1D(causal, dilated) -> BatchNorm -> Dropout -> (+ skip) -> ReLU
```

The skip connection uses a 1×1 convolution when the channel count changes, otherwise an identity. The receptive field of an `L`-level block with kernel `k` is `1 + 2(k-1)·(2^L − 1)` timesteps — e.g. 8 levels with `k = 3` cover **1021** timesteps.

TCN hyperparameters:

* `TimeSteps`
* `Features`
* `Channels` - channel width of every residual block
* `KernelSize`
* `Levels` - number of residual blocks (dilation doubles each level)
* `DropoutRate`
* `HiddenUnits` - optional dense layer after global pooling
* `Activation`
* `LearningRate`
* `Epochs`
* `BatchSize`
* `L2`

The dilated/causal layers are also usable standalone for custom architectures:

```csharp
using CSharpNumerics.ML.Sequence.Layers;
using CSharpNumerics.ML.Sequence.Enums;
using CSharpNumerics.ML.Enums;

// Causal, dilated convolution — output[t] sees only inputs at or before t
var conv = new Conv1DLayer(
    inputChannels: 1, filters: 8, kernelSize: 3, stride: 1,
    padding: ConvolutionPaddingMode.Causal, activation: ActivationType.Linear, seed: 1, dilation: 4);
int rf = conv.ReceptiveField;     // (3-1)*4 + 1 = 9

var tcn = new TCNBlock(inputChannels: 1, channels: 16, kernelSize: 3, levels: 8);
int reach = tcn.ReceptiveField;   // 1021 timesteps
```

Example with `SupervisedExperiment` (CNN1D):

```csharp
using CSharpNumerics.ML;
using CSharpNumerics.ML.Enums;
using CSharpNumerics.ML.Experiment;
using CSharpNumerics.ML.Sequence.Models.Classification;

var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(new PipelineGrid()
        .AddModel<CNN1DClassifier>(g => g
            .Add("TimeSteps", 128)
            .Add("Features", 1)
            .Add("Filters", 8)
            .Add("KernelSize", 5)
            .Add("HiddenUnits", 16)
            .Add("LearningRate", 0.01)
            .Add("Epochs", 200)
            .Add("BatchSize", 16)
            .Add("Padding", CSharpNumerics.ML.Sequence.Enums.ConvolutionPaddingMode.Same)
            .Add("Activation", ActivationType.ReLU)))
    .WithCrossValidator(CrossValidatorConfig.KFold(folds: 5))
    .Run();
```

Example with `SupervisedExperiment` (LSTM):

```csharp
using CSharpNumerics.ML;
using CSharpNumerics.ML.Enums;
using CSharpNumerics.ML.Experiment;
using CSharpNumerics.ML.Sequence.Models.Classification;

var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(new PipelineGrid()
        .AddModel<LSTMClassifier>(g => g
            .Add("TimeSteps", 128)
            .Add("Features", 1)
            .Add("HiddenSize", 32)
            .Add("HiddenUnits", 16)
            .Add("LearningRate", 0.001)
            .Add("Epochs", 200)
            .Add("BatchSize", 16)
            .Add("ClipNorm", 5.0)
            .Add("Activation", ActivationType.ReLU)))
    .WithCrossValidator(CrossValidatorConfig.KFold(folds: 5))
    .Run();
```

Example with `SupervisedExperiment` (TCN regressor):

```csharp
using CSharpNumerics.ML;
using CSharpNumerics.ML.Enums;
using CSharpNumerics.ML.Experiment;
using CSharpNumerics.ML.Sequence.Models.Regression;

var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(new PipelineGrid()
        .AddModel<TCNRegressor>(g => g
            .Add("TimeSteps", 128)
            .Add("Features", 1)
            .Add("Channels", 16)
            .Add("KernelSize", 3)
            .Add("Levels", 4)            // dilations 1, 2, 4, 8
            .Add("DropoutRate", 0.1)
            .Add("HiddenUnits", 16)
            .Add("LearningRate", 0.01)
            .Add("Epochs", 200)
            .Add("BatchSize", 16)))
    .WithCrossValidator(CrossValidatorConfig.KFold(folds: 5))
    .Run();
```

## 🪟 TimeSeries Integration - SequenceDataHelper

`SequenceDataHelper` bridges `TimeSeries` (from `CSharpNumerics.Statistics.Data`) to the sequence model pipeline by creating sliding-window samples.

```csharp
using CSharpNumerics.ML.Sequence;
using CSharpNumerics.Statistics.Data;

// Load a light curve from CSV (columns: Time, Flux, Label)
var ts = TimeSeries.FromCsv("lightcurve.csv");

// Create windows of 128 timesteps, stride 1, using column 1 ("Label") as target
var (X, y) = SequenceDataHelper.CreateWindows(ts, windowSize: 128, labelColumnIndex: 1, stride: 1);
// X shape: [numWindows x 128]  (1 feature: Flux)
// y shape: [numWindows]        (label from last timestep in each window)
```

Overloads:

* `CreateWindows(TimeSeries, windowSize, labelColumnIndex, stride)` - extracts features and labels from a `TimeSeries`, excluding the label column from features.
* `CreateWindows(double[][], double[], windowSize, stride)` - works with raw column arrays when labels are computed separately.

## 🛰️ Exoplanet-Transit Detection Example

Synthetic Kepler-like light curve -> windowed samples -> CNN1D classification:

```csharp
using CSharpNumerics.ML;
using CSharpNumerics.ML.Enums;
using CSharpNumerics.ML.Experiment;
using CSharpNumerics.ML.Sequence;
using CSharpNumerics.ML.Sequence.Models.Classification;
using CSharpNumerics.Statistics.Data;

// 1. Build a TimeSeries with flux and transit labels
var ts = new TimeSeries(times, new[] { flux, labels }, new[] { "Flux", "Label" });

// 2. Window into samples
var (X, y) = SequenceDataHelper.CreateWindows(ts, windowSize: 20, labelColumnIndex: 1, stride: 5);

// 3. Train a CNN1DClassifier with grid search
var result = SupervisedExperiment
    .For(X, y)
    .WithGrid(new PipelineGrid()
        .AddModel<CNN1DClassifier>(g => g
            .Add("TimeSteps", 20)
            .Add("Features", 1)
            .Add("Filters", 8)
            .Add("KernelSize", 5)
            .Add("HiddenUnits", 8)
            .Add("LearningRate", 0.02)
            .Add("Epochs", 150)
            .Add("BatchSize", 16)
            .Add("Activation", ActivationType.ReLU)))
    .WithCrossValidator(CrossValidatorConfig.KFold(folds: 3))
    .Run();

// result.BestScore -> transit detection accuracy
```

---

## 🧩 Neural Network Building Blocks

The neural-network stack now exposes reusable components for sequence-oriented architectures without changing the existing `IModel` contract.
Reusable dense/activation orchestration remains in `CSharpNumerics.ML.NeuralNetwork`, while sequence-specific layers and models live under `CSharpNumerics.ML.Sequence`.

Available infrastructure:

* `Activations` for reusable ReLU, Sigmoid, Tanh, Linear, and Softmax transforms
* `ILayer` for modular forward/backward layer composition
* `DenseLayer` for trainable fully connected sequence steps
* `SequentialModel` for stacking layers with shared forward/backward orchestration

These types are the reusable foundation for both generic feedforward models and the sequence-specific components in `CSharpNumerics.ML.Sequence`.

Example:

```csharp
using CSharpNumerics.ML.Enums;
using CSharpNumerics.ML.NeuralNetwork;
using CSharpNumerics.ML.NeuralNetwork.Layers;
using CSharpNumerics.ML.Sequence.Models.Classification;
using CSharpNumerics.Numerics.Objects;
using CSharpNumerics.Numerics.Optimization.SingleObjective;

var model = new SequentialModel(
    new DenseLayer(4, 8, ActivationType.ReLU),
    new DenseLayer(8, 1, ActivationType.Linear));

var inputSequence = new[]
{
    new VectorN(new[] { 0.2, 0.4, 0.6, 0.8 })
};

VectorN prediction = model.ForwardSingle(inputSequence);
VectorN lossGradient = prediction - new VectorN(new[] { 1.0 });

model.BackwardSingle(lossGradient);
model.ApplyGradients(
    new GradientDescent(learningRate: 0.01),
    new GradientDescent(learningRate: 0.01),
    batchSize: 1);

var classifier = new CNN1DClassifier
{
    TimeSteps = 128,
    Features = 1,
    Filters = 8,
    KernelSize = 5,
    HiddenUnits = 16,
    LearningRate = 0.01,
    Epochs = 200
};
```