---
sidebar_label: "🕹️ RL Algorithms"
---

## 🥷 Agents

All agents implement `IAgent` and operate on `VectorN` state vectors. Tabular agents work with discrete state indices; deep agents use neural networks built on the shared `NeuralNetwork` class.

---

**Tabular Agents**

Constructor: `(int numStates, int numActions, Func<VectorN, int> stateMapper)`

**Q-Learning**

Class: `QLearning`

Off-policy TD(0) with max-Q target. The classic model-free control algorithm.

Hyperparameters:

* `LearningRate` (0.1)
* `Gamma` (0.99)

**SARSA**

Class: `SARSA`

On-policy TD(0) — updates Q using the action actually taken, not the greedy action.

Hyperparameters:

* `LearningRate` (0.1)
* `Gamma` (0.99)

**Monte Carlo Control**

Class: `MonteCarloControl`

First-visit Monte Carlo with full episode returns. Updates only at end of episode.

Hyperparameters:

* `LearningRate` (0.1)
* `Gamma` (0.99)

Exposes: `GetQTable()` → `Matrix`, `GetQValues(state)` → `VectorN`

---
**Value-Based (Deep) Agents**

Require `Initialize(observationSize, actionSize, seed)` and a replay buffer.

**DQN**

Class: `DQN`

Deep Q-Network with target network and experience replay.

Hyperparameters:

* `HiddenLayers` ([64, 64])
* `Activation` (ReLU)
* `LearningRate` (0.001)
* `Gamma` (0.99)
* `TargetUpdateFrequency` (100)
* `BatchSize` (32)
* `MinBufferSize` (64)

Exposes: `GetQValues(state)` → `VectorN`

**Double DQN**

Class: `DoubleDQN`

Extends `DQN` — selects actions with the online network, evaluates with the target network. Reduces overestimation bias.

Hyperparameters: Same as `DQN`

**Dueling DQN**

Class: `DuelingDQN`

Three-network architecture: shared → value stream + advantage stream. $Q(s,a) = V(s) + A(s,a) - \overline{A}(s)$

Hyperparameters:

* `SharedLayers` ([64])
* `ValueLayers` ([32])
* `AdvantageLayers` ([32])
* `Activation` (ReLU)
* `LearningRate` (0.001)
* `Gamma` (0.99)
* `TargetUpdateFrequency` (100)
* `BatchSize` (32)
* `MinBufferSize` (64)

---

**Policy Gradient Agents**

Learn a policy directly (no Q-table). Support entropy bonuses and baselines.

**REINFORCE**

Class: `REINFORCE`

Monte Carlo policy gradient with optional baseline. Updates at end of each episode.

Hyperparameters:

* `HiddenLayers` ([32])
* `Activation` (ReLU)
* `LearningRate` (0.01)
* `Gamma` (0.99)
* `UseBaseline` (true)

Exposes: `GetActionProbabilities(state)` → `VectorN`

**Actor-Critic (A2C)**

Class: `ActorCritic`

Per-step TD actor-critic with entropy bonus for exploration.

Hyperparameters:

* `ActorHiddenLayers` ([32])
* `CriticHiddenLayers` ([32])
* `Activation` (ReLU)
* `ActorLearningRate` (0.001)
* `CriticLearningRate` (0.002)
* `Gamma` (0.99)
* `EntropyCoefficient` (0.01)

Exposes: `GetActionProbabilities(state)` → `VectorN`, `GetValue(state)` → `double`

**PPO (Proximal Policy Optimization)**

Class: `PPO`

Clipped surrogate objective with GAE (Generalized Advantage Estimation) and mini-batch updates.

Hyperparameters:

* `ActorHiddenLayers` ([64, 64])
* `CriticHiddenLayers` ([64, 64])
* `Activation` (ReLU)
* `ActorLearningRate` (0.0003)
* `CriticLearningRate` (0.001)
* `Gamma` (0.99)
* `Lambda` (0.95) — GAE λ
* `ClipEpsilon` (0.2)
* `UpdateEpochs` (4)
* `MiniBatchSize` (64)
* `EntropyCoefficient` (0.01)

Exposes: `GetActionProbabilities(state)` → `VectorN`, `GetValue(state)` → `double`

---

**Continuous Control Agents**

**DDPG (Deep Deterministic Policy Gradient)**

Class: `DDPG`

Actor-critic for continuous action spaces. Deterministic policy with Polyak-averaged target networks.

Hyperparameters:

* `ActorHiddenLayers` ([64, 64])
* `CriticHiddenLayers` ([64, 64])
* `Activation` (ReLU)
* `ActorLearningRate` (1e-4)
* `CriticLearningRate` (1e-3)
* `Gamma` (0.99)
* `Tau` (0.005) — soft update rate
* `BatchSize` (64)
* `MinBufferSize` (128)
* `ActionScale` (1.0)

---

## 🎁 Policies (Exploration Strategies)

All policies implement `IPolicy` with `SelectAction(VectorN qValues)` for discrete and `SelectAction(VectorN mean, VectorN std)` for continuous. Each supports `Decay()` per episode and `Clone()`.

**Epsilon-Greedy**

Class: `EpsilonGreedy`

Random action with probability ε, greedy otherwise. Standard discrete exploration.

Properties:

* `Epsilon` (1.0) — current exploration rate
* `EpsilonMin` (0.01) — minimum ε
* `EpsilonDecay` (0.995) — multiplicative decay per episode

**Softmax Policy**

Class: `SoftmaxPolicy`

Boltzmann exploration — action probabilities proportional to $e^{Q(s,a) / \tau}$.

Properties:

* `Temperature` (1.0) — current temperature
* `TemperatureMin` (0.01)
* `TemperatureDecay` (0.995)

**Gaussian Noise**

Class: `GaussianNoise`

Additive i.i.d. Gaussian noise for continuous action exploration. $a = \mu + \mathcal{N}(0, \sigma^2)$

Properties:

* `Sigma` (0.1) — noise standard deviation
* `SigmaMin` (0.01)
* `SigmaDecay` (0.999)

**Ornstein-Uhlenbeck Process**

Class: `OrnsteinUhlenbeck`

Temporally correlated noise for smooth continuous exploration. Mean-reverting process.

Properties:

* `Theta` (0.15) — mean reversion rate
* `Mu` (0.0) — long-run mean
* `Sigma` (0.2) — volatility
* `SigmaMin` (0.01)
* `SigmaDecay` (1.0)
* `Dt` (1.0) — time step

---

## 🏠 Environments

All environments implement `IEnvironment` with `Reset(seed?)`, `Step(int)` (discrete), and `Step(VectorN)` (continuous). State is always `VectorN`.

**GridWorld**

Class: `GridWorld`

2D grid navigation. Start at (0,0), goal at (rows-1, cols-1). Reward: +1 at goal, -0.01 per step.

| Property | Value |
|---|---|
| Constructor | `(rows, cols, walls?, goal?)` |
| Observation | `VectorN([row, col])`, size 2 |
| Actions | 4 (Up, Right, Down, Left) |
| Discrete | ✅ |

Exposes: `StateToIndex(state)` → flat index, `StateCount` → total states

**CartPole**

Class: `CartPole`

Classic control: balance a pole on a cart. Episode ends if pole angle > 12° or cart leaves bounds.

| Property | Value |
|---|---|
| Constructor | *(none)* |
| Observation | `VectorN([x, ẋ, θ, θ̇])`, size 4 |
| Actions | 2 (Left, Right) |
| Discrete | ✅ |

**MountainCar**

Class: `MountainCar`

Drive an underpowered car up a hill. Requires momentum from both sides.

| Property | Value |
|---|---|
| Constructor | *(none)* |
| Observation | `VectorN([position, velocity])`, size 2 |
| Actions | 3 (Left, Neutral, Right) |
| Discrete | ✅ |
| Settable | `MaxSteps` (200) |

**Pendulum**

Class: `Pendulum`

Swing up and balance an inverted pendulum with continuous torque.

| Property | Value |
|---|---|
| Constructor | *(none)* |
| Observation | `VectorN([cos θ, sin θ, θ̇])`, size 3 |
| Actions | 1 (continuous torque) |
| Discrete | ❌ |
| Settable | `MaxTorque` (2.0), `MaxSpeed` (8.0), `MaxSteps` (200) |

**Plume (GIS)**

Class: `PlumeEnvironment`

RL environment wrapping the GIS Gaussian plume simulator. The agent takes mitigation actions (deploy barriers, activate filters) to minimise population exposure over a transient plume scenario.

| Property | Value |
|---|---|
| Constructor | `(emissionRate, windSpeed, windDirection, stackHeight, sourcePosition, grid, timeFrame, stability?)` |
| Observation | `VectorN([maxConc, meanConc, exposedFrac, windSpeed, windDirX, windDirY, emissionRate, normTime])`, size 8 |
| Actions | 6 (None, BarrierN, BarrierE, BarrierS, BarrierW, ActivateFilter) |
| Discrete | ✅ |
| Settable | `Threshold` (1e-6), `ActionCost` (0.05), `BarrierEfficiency` (0.4), `FilterEfficiency` (0.5) |

Exposes: `MaxSteps` → number of time steps per episode

See the [GIS-RL Integration](#-gis-rl-integration) section below for full usage.

---

## 🔁 Replay Buffers

**ReplayBuffer**

Class: `ReplayBuffer`

Uniform random sampling from a circular buffer of transitions.

Constructor: `(int capacity, int? seed = null)`

**PrioritizedReplayBuffer**

Class: `PrioritizedReplayBuffer`

Prioritized experience replay — transitions with higher TD-error are sampled more frequently.

Constructor: `(int capacity, double alpha = 0.6, double beta = 0.4, int? seed = null)`

---

## 📊 Diagnostics & Visualisation

All diagnostic tools return `List<Serie>` or `Matrix` — ready for the existing export/charting pipeline.

**Training Curves**

Built into `TrainingResult` (returned by every experiment):

```csharp
var result = RLExperiment.For(env).WithAgent(agent).WithPolicy(policy).WithEpisodes(500).Run();

List<Serie> returns = result.ReturnCurve;        // (episode, return)
List<Serie> losses = result.LossCurve;           // (step, loss)
List<Serie> exploration = result.ExplorationCurve; // (episode, ε)
```
**Q-Value Heatmap**

Visualise Q-values for tabular agents on GridWorld:

```csharp
// Max Q per state — one value per cell
List<Serie> heatmap = QValueHeatmap.GetMaxQValues(agent, env);

// Q-values for a specific action
List<Serie> actionQ = QValueHeatmap.GetQValuesForAction(agent, env, action: 1);

// Full Q-table as Matrix (states × actions)
Matrix qTable = QValueHeatmap.GetQTableMatrix(agent);

// Greedy policy — best action per state
List<Serie> policy = QValueHeatmap.GetGreedyPolicy(agent, env);
```

**Policy Visualisation**

Visualise action probabilities for any agent:

```csharp
// Action probabilities per state (one List<Serie> per action)
var probs = PolicyVisualizer.GetActionProbabilities(env,
    state => agent.GetActionProbabilities(state));

// Softmax probabilities from Q-values (tabular agents)
var softmax = PolicyVisualizer.GetSoftmaxProbabilities(agent, env, temperature: 0.5);

// Policy entropy per state (high = uncertain, low = deterministic)
var entropy = PolicyVisualizer.GetPolicyEntropy(env,
    state => agent.GetActionProbabilities(state));

// Dominant action per state
var dominant = PolicyVisualizer.GetDominantAction(env,
    state => agent.GetActionProbabilities(state));
```

**Value Function Surface**

Sample V(s) or max-Q(s) across continuous state spaces:

```csharp
// 1D slice (e.g. cart position, other dims fixed)
var vFn = ValueFunctionSurface.ValueFunction(actorCriticAgent);
List<Serie> curve = ValueFunctionSurface.Sample1D(
    s => vFn(new VectorN(new[] { s[0], 0, 0, 0 })),
    min: -2.4, max: 2.4, numPoints: 100);

// 2D surface (e.g. position × velocity)
var maxQ = ValueFunctionSurface.MaxQFunction(dqnAgent);
var surface = ValueFunctionSurface.Sample2D(maxQ,
    minX: -1.2, maxX: 0.6, numX: 50,
    minY: -0.07, maxY: 0.07, numY: 50);

// Convert to Matrix for heatmap rendering
Matrix heatmap = surface.ToMatrix();
```

**Available extractors:**

| Method | Agent type | Returns |
|---|---|---|
| `ValueFunctionSurface.MaxQFunction(DQN)` | DQN, DoubleDQN | $\max_a Q(s,a)$ |
| `ValueFunctionSurface.MaxQFunction(DuelingDQN)` | DuelingDQN | $\max_a Q(s,a)$ |
| `ValueFunctionSurface.ValueFunction(ActorCritic)` | A2C | $V(s)$ |
| `ValueFunctionSurface.ValueFunction(PPO)` | PPO | $V(s)$ |

---

## 📐 Interfaces Summary

| Interface | Purpose | Key methods |
|---|---|---|
| `IAgent` | RL agent contract | `SelectAction`, `SelectContinuousAction`, `Train`, `TrainBatch`, `EndEpisode`, `Clone`, `Get/SetHyperParameters` |
| `IEnvironment` | Environment contract | `Reset`, `Step(int)`, `Step(VectorN)`, `ObservationSize`, `ActionSize`, `IsDiscrete` |
| `IPolicy` | Exploration policy | `SelectAction(VectorN qValues)`, `SelectAction(VectorN mean, VectorN std)`, `Decay`, `Clone` |
| `IReplayBuffer` | Experience storage | `Add`, `Sample`, `Count`, `Capacity` |
