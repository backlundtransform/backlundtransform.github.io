---
sidebar_label: "☔ Reinforcement AutoML"
---


CSharpNumerics includes a complete **Reinforcement Learning framework** with the same philosophy as the supervised and clustering pipelines: **fluent API**, **pluggable algorithms**, **hyperparameter grid search**, and **transparent diagnostics**.

All agents implement `IAgent`, all environments implement `IEnvironment`, and all policies implement `IPolicy` — no external dependencies.

---

### ➡️ Quick Start

```csharp
var env = new GridWorld(5, 5);
var result = RLExperiment
    .For(env)
    .WithAgent(new QLearning(25, 4, env.StateToIndex))
    .WithPolicy(new EpsilonGreedy(seed: 42))
    .WithEpisodes(1000, maxStepsPerEpisode: 200)
    .WithSeed(42)
    .Run();

Console.WriteLine(result.AverageReturn);
Console.WriteLine(result.BestReturn);
```

### 🔄 Deep RL

```csharp
var result = RLExperiment
    .For(new CartPole())
    .WithAgent(new DQN
    {
        HiddenLayers = new[] { 64, 64 },
        LearningRate = 0.001,
        Gamma = 0.99,
        BatchSize = 32
    })
    .WithPolicy(new EpsilonGreedy(seed: 42))
    .WithReplayBuffer(10000, seed: 42)
    .WithEpisodes(500, maxStepsPerEpisode: 200)
    .WithEvaluation(evalEpisodes: 10, evalInterval: 50)
    .WithSeed(42)
    .Run();

Console.WriteLine($"{result.AgentName} → avg return = {result.AverageReturnLastN(50):F1}");
```

### 📐 Policy Gradient

```csharp
var result = RLExperiment
    .For(new CartPole())
    .WithAgent(new PPO
    {
        ActorHiddenLayers = new[] { 64, 64 },
        CriticHiddenLayers = new[] { 64, 64 },
        ClipEpsilon = 0.2,
        UpdateEpochs = 4
    })
    .WithEpisodes(500, maxStepsPerEpisode: 200)
    .WithSeed(42)
    .Run();
```

### 📉 Continuous Control

```csharp
var result = RLExperiment
    .For(new Pendulum())
    .WithAgent(new DDPG
    {
        ActorHiddenLayers = new[] { 64, 64 },
        CriticHiddenLayers = new[] { 64, 64 },
        ActionScale = 2.0
    })
    .WithPolicy(new OrnsteinUhlenbeck(seed: 42) { Sigma = 0.2 })
    .WithReplayBuffer(50000, seed: 42)
    .WithEpisodes(300, maxStepsPerEpisode: 200)
    .WithSeed(42)
    .Run();
```

### 🔍 Grid Search (Hyperparameter Tuning)

Search over multiple agent types and hyperparameter combinations — the RL counterpart to `SupervisedExperiment`:

```csharp
var env = new GridWorld(5, 5);
var result = RLExperiment
    .For(env)
    .WithGrid(new RLPipelineGrid()
        .AddAgent<QLearning>(() => new QLearning(25, 4, env.StateToIndex), g => g
            .Add("LearningRate", 0.1, 0.3, 0.5)
            .Add("Gamma", 0.9, 0.99))
        .AddAgent<SARSA>(() => new SARSA(25, 4, env.StateToIndex), g => g
            .Add("LearningRate", 0.1, 0.3)),
        evalEpisodes: 10)
    .WithPolicyFactory(() => new EpsilonGreedy(seed: 42))
    .WithEpisodes(500, maxStepsPerEpisode: 100)
    .WithSeed(42)
    .RunGrid();

// Ranked by evaluation return (best first)
foreach (var r in result.Rankings)
{
    Console.WriteLine(
        $"{r.Description,-40} → eval={r.AverageEvalReturn:F2}  " +
        $"({r.Duration.TotalMilliseconds:F0} ms)");
}

Console.WriteLine($"\nBest: {result.Best.Description} → {result.BestScore:F2}");
```

### 🎯 Monte Carlo Evaluation (Confidence Intervals)

Run multiple independent training runs to quantify performance variance:

```csharp
var mc = RLExperiment
    .For(new CartPole())
    .WithAgent(new DQN { HiddenLayers = new[] { 32, 32 } })
    .WithPolicy(new EpsilonGreedy(seed: 42))
    .WithReplayBuffer(5000)
    .WithEpisodes(200, maxStepsPerEpisode: 200)
    .WithMonteCarloEvaluation(runs: 10, evalEpisodesPerRun: 20)
    .WithSeed(42)
    .RunMonteCarlo();

Console.WriteLine($"Mean return: {mc.MeanReturn:F1} ± {mc.StdDev:F1}");
var (lower, upper) = mc.ConfidenceInterval(0.95);
Console.WriteLine($"95% CI: [{lower:F1}, {upper:F1}]");
```

### 🔀 Episode Evaluator (Standalone)

Evaluate a trained agent outside of the experiment loop:

```csharp
var evaluator = new EpisodeEvaluator(env, maxStepsPerEpisode: 200);
var eval = evaluator.Evaluate(agent, numEpisodes: 100, seed: 42);

Console.WriteLine($"Mean: {eval.MeanReturn:F2}, Std: {eval.StdDev:F2}");
Console.WriteLine($"Min: {eval.MinReturn:F2}, Max: {eval.MaxReturn:F2}, Median: {eval.MedianReturn:F2}");
var (lo, hi) = eval.ConfidenceInterval(0.95);
Console.WriteLine($"95% CI: [{lo:F2}, {hi:F2}]");
```
