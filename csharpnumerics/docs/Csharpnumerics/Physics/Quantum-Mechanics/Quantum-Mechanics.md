---
sidebar_label: "🐈 Quantum Mechanics"
---

Quantum gates, state representations, fidelity metrics, noise channels, and error-correcting codes for qubit-based computation.

```csharp
using CSharpNumerics.Physics.Quantum;
using CSharpNumerics.Physics.Quantum.NoiseModels;
using CSharpNumerics.Physics.Quantum.ErrorCorrection;
```

---

## ⚛️ Quantum Gates

**Namespace:** `CSharpNumerics.Physics.Quantum`

Quantum gates are unitary operators acting on one or more qubits. Each gate is represented by a `ComplexMatrix` and knows how to apply itself to a `ComplexVectorN` state vector.

All gates extend the abstract `QuantumGate` base class:

| Class | Qubits | Matrix | Description |
|---|---|---|---|
| `HadamardGate` | 1 | $\frac{1}{\sqrt{2}}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ | Creates equal superposition |
| `PauliXGate` | 1 | $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ | Quantum NOT — flips \|0⟩ ↔ \|1⟩ |
| `PauliYGate` | 1 | $\begin{pmatrix}0&-i\\i&0\end{pmatrix}$ | Bit + phase flip, $Y^2 = I$ |
| `PauliZGate` | 1 | $\begin{pmatrix}1&0\\0&-1\end{pmatrix}$ | Phase flip — \|1⟩ → −\|1⟩ |
| `SGate` | 1 | $\begin{pmatrix}1&0\\0&i\end{pmatrix}$ | Phase gate (π/2), $S^2 = Z$ |
| `TGate` | 1 | $\begin{pmatrix}1&0\\0&e^{i\pi/4}\end{pmatrix}$ | π/8 gate, $T^2 = S$ |
| `PhaseGate(θ)` | 1 | $\begin{pmatrix}1&0\\0&e^{i\theta}\end{pmatrix}$ | General phase gate, $P(\pi) = Z$ |
| `RxGate(θ)` | 1 | $\begin{pmatrix}\cos\frac{\theta}{2}&-i\sin\frac{\theta}{2}\\-i\sin\frac{\theta}{2}&\cos\frac{\theta}{2}\end{pmatrix}$ | Rotation about X-axis |
| `RyGate(θ)` | 1 | $\begin{pmatrix}\cos\frac{\theta}{2}&-\sin\frac{\theta}{2}\\\sin\frac{\theta}{2}&\cos\frac{\theta}{2}\end{pmatrix}$ | Rotation about Y-axis |
| `RzGate(θ)` | 1 | $\begin{pmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{pmatrix}$ | Rotation about Z-axis |
| `CNOTGate` | 2 | 4×4 permutation | Flips target qubit when control is \|1⟩ |
| `CZGate` | 2 | $\text{diag}(1,1,1,-1)$ | Phase flip on \|11⟩ |
| `CPhaseGate(θ)` | 2 | $\text{diag}(1,1,1,e^{i\theta})$ | Controlled phase, $CP(\pi) = CZ$ |
| `SWAPGate` | 2 | 4×4 permutation | Swaps two qubit states |
| `ToffoliGate` | 3 | 8×8 permutation | CCNOT — flips target when both controls are \|1⟩ |
| `FredkinGate` | 3 | 8×8 permutation | CSWAP — swaps targets when control is \|1⟩ |
| `PhaseOracle(n, states)` | n | 2ⁿ×2ⁿ diagonal | Flips phase of marked basis states: \|w⟩ → −\|w⟩ |
| `ControlledGate(U)` | n+1 | 2ⁿ⁺¹×2ⁿ⁺¹ block | Applies U when control qubit is \|1⟩ |
| `ModularMultiplyGate(a,N,n)` | n | 2ⁿ×2ⁿ permutation | \|y⟩ → \|ay mod N⟩, used in Shor's algorithm |

**QuantumGate (abstract)**

```csharp
public abstract class QuantumGate
{
    public abstract int QubitCount { get; }
    public abstract ComplexMatrix GetMatrix();
    public ComplexVectorN Apply(ComplexVectorN amplitudes, int[] qubitIndices, int totalQubits);
}
```

`Apply` uses the gate's unitary matrix to transform the relevant amplitudes in-place (tensor-product expansion) — works for arbitrary qubit counts and target indices.

**Usage**

Gates are consumed by `QuantumInstruction` and `QuantumCircuit` in the Engines Quantum section:

```csharp
using CSharpNumerics.Physics.Quantum;
using CSharpNumerics.Engines.Quantum;

var circuit = new QuantumCircuit(2);
circuit.AddInstruction(new QuantumInstruction(new HadamardGate(), new List<int> { 0 }));
circuit.AddInstruction(new QuantumInstruction(new CNOTGate(), new List<int> { 0, 1 }));

var state = new QuantumSimulator().Run(circuit);   // Bell state (|00⟩ + |11⟩)/√2
```

---

## 🌐 BlochVector

Represents a single-qubit pure state on the Bloch sphere. Given $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$:

$$x = 2\,\text{Re}(\alpha^*\beta), \quad y = 2\,\text{Im}(\alpha^*\beta), \quad z = |\alpha|^2 - |\beta|^2$$

```csharp
using CSharpNumerics.Physics.Quantum;
using CSharpNumerics.Engines.Quantum;

// From a circuit result
var circuit = new QuantumCircuit(1);
circuit.AddInstruction(new QuantumInstruction(new HadamardGate(), new List<int> { 0 }));
var state = new QuantumSimulator().Run(circuit);

BlochVector bloch = state.GetBlochVector();  // (1, 0, 0) — +X axis
double theta = bloch.Theta;                  // polar angle θ
double phi   = bloch.Phi;                    // azimuthal angle φ
double r     = bloch.Radius;                 // 1.0 for pure states
Vector v     = bloch.ToVector();             // 3D Vector for rendering

// Directly from amplitudes
var b = BlochVector.FromAmplitudes(
    new ComplexNumber(1, 0), new ComplexNumber(0, 0));  // |0⟩ → (0, 0, 1)
```

| Property | Description |
|---|---|
| `X`, `Y`, `Z` | Cartesian Bloch coordinates |
| `Theta` | Polar angle $\theta \in [0, \pi]$ from +Z |
| `Phi` | Azimuthal angle $\varphi \in (-\pi, \pi]$ |
| `Radius` | Vector length (1 for pure states) |
| `ToVector()` | Returns a 3D `Vector` for visualization |

**Canonical states on the sphere:**

| State | Bloch |
|---|---|
| $\|0\rangle$ | $(0, 0, 1)$ — north pole |
| $\|1\rangle$ | $(0, 0, -1)$ — south pole |
| $(\|0\rangle+\|1\rangle)/\sqrt{2}$ | $(1, 0, 0)$ — +X |
| $(\|0\rangle-\|1\rangle)/\sqrt{2}$ | $(-1, 0, 0)$ — −X |
| $(\|0\rangle+i\|1\rangle)/\sqrt{2}$ | $(0, 1, 0)$ — +Y |
| $(\|0\rangle-i\|1\rangle)/\sqrt{2}$ | $(0, -1, 0)$ — −Y |

---

## 📏 QuantumFidelity

Static methods for computing the overlap between quantum states. Fidelity ranges from 0 (orthogonal) to 1 (identical).

**State fidelity** — $F = |\langle\psi|\phi\rangle|^2$

```csharp
using CSharpNumerics.Physics.Quantum;
using CSharpNumerics.Engines.Quantum;

var sim = new QuantumSimulator();
var s0    = sim.Run(QuantumCircuitBuilder.New(1).Build());        // |0⟩
var sPlus = sim.Run(QuantumCircuitBuilder.New(1).H(0).Build());  // |+⟩
var s1    = sim.Run(QuantumCircuitBuilder.New(1).X(0).Build());  // |1⟩

double f1 = QuantumFidelity.Fidelity(s0, s0);     // 1.0  — identical
double f2 = QuantumFidelity.Fidelity(s0, sPlus);  // 0.5  — overlap
double f3 = QuantumFidelity.Fidelity(s0, s1);     // 0.0  — orthogonal
```

**Vector fidelity** — works directly on `ComplexVectorN`

```csharp
double f = QuantumFidelity.Fidelity(psi, phi);   // |⟨ψ|φ⟩|²
```

**Bloch fidelity** — geometric formula for single-qubit states: $F = \frac{1}{2}(1 + \hat{n}_1 \cdot \hat{n}_2)$

```csharp
var b1 = s1State.GetBlochVector();
var b2 = s2State.GetBlochVector();
double f = QuantumFidelity.BlochFidelity(b1, b2);
// Matches state fidelity for pure single-qubit states
```

---

## 🔊 Noise Models

The `Physics.Quantum.NoiseModels` namespace provides quantum noise channels using the **Kraus operator** formalism. Each channel implements `INoiseChannel` and satisfies the completeness relation $\sum E_k^\dagger E_k = I$.

| Channel | Parameter | Kraus Operators | Physical Model |
|---|---|---|---|
| `DepolarizingNoise(p)` | $p \in [0,1]$ | $E_0 = \sqrt{1 - 3p/4}\,I$, $E_{1,2,3} = \sqrt{p/4}\,\{X, Y, Z\}$ | Random Pauli error — qubit replaced by maximally mixed state with probability $p$ |
| `DephasingNoise(p)` | $p \in [0,1]$ | $E_0 = \sqrt{1-p}\,I$, $E_1 = \sqrt{p}\,Z$ | Phase-flip error — $T_2$ decoherence |
| `AmplitudeDampingNoise(γ)` | $\gamma \in [0,1]$ | $E_0 = [[1,0],[0,\sqrt{1-\gamma}]]$, $E_1 = [[0,\sqrt{\gamma}],[0,0]]$ | Energy dissipation — $\|1\rangle \to \|0\rangle$ decay ($T_1$) |

**Usage with NoisyQuantumSimulator** (from `CSharpNumerics.Engines.Quantum`):

```csharp
using CSharpNumerics.Physics.Quantum.NoiseModels;
using CSharpNumerics.Engines.Quantum;

var circuit = QuantumCircuitBuilder.New(2).H(0).CNOT(0, 1).Build();

// Ideal simulation
var ideal = new QuantumSimulator().Run(circuit);

// Noisy simulation — channels stacked, applied after each gate
var noisy = new NoisyQuantumSimulator(new Random(42))
    .WithNoise(new DepolarizingNoise(0.01))
    .WithNoise(new AmplitudeDampingNoise(0.005))
    .Run(circuit);

double fidelity = QuantumFidelity.Fidelity(ideal, noisy);
```

**INoiseChannel interface**

```csharp
public interface INoiseChannel
{
    int QubitCount { get; }
    ComplexMatrix[] GetKrausOperators();
}
```

---



## 🛡️ Quantum Error Correction — Code Definitions

**Namespace:** `CSharpNumerics.Physics.Quantum.ErrorCorrection`

The `ErrorCorrection` sub-namespace defines quantum error-correcting codes as mathematical objects — stabilizers, correction maps, and logical operators. The simulation/orchestration layer lives in `Engines.Quantum.ErrorCorrection`.

#### IQuantumErrorCorrectionCode

Interface for any [[n, k, d]] stabilizer code:

| Property / Method | Description |
|---|---|
| `PhysicalQubits` | Number of physical qubits (n) |
| `LogicalQubits` | Number of logical qubits (k) |
| `Distance` | Code distance (d) |
| `SyndromeQubits` | Number of ancilla qubits for syndrome extraction |
| `GetStabilizers()` | Returns stabilizer generators as (qubit, Pauli) lists |
| `GetCorrectionMap()` | Syndrome integer → corrective (qubit, Pauli) operations |
| `GetLogicalX(i)` | Logical X̄ operator for logical qubit i |
| `GetLogicalZ(i)` | Logical Z̄ operator for logical qubit i |

#### BitFlipCode3 — [[3,1,1]]

Encodes $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ into $\alpha|000\rangle + \beta|111\rangle$. Corrects any single-qubit X (bit-flip) error.

**Stabilizers:** $Z_0 Z_1$, $Z_1 Z_2$

| Syndrome | Error | Correction |
|---|---|---|
| 00 | None | — |
| 01 | $X_0$ | Apply X to qubit 0 |
| 10 | $X_2$ | Apply X to qubit 2 |
| 11 | $X_1$ | Apply X to qubit 1 |

**Logical operators:** $\bar{X} = X_0 X_1 X_2$, $\bar{Z} = Z_0$

#### PhaseFlipCode3 — [[3,1,1]]

Encodes $|\psi\rangle$ into $\alpha|{+}{+}{+}\rangle + \beta|{-}{-}{-}\rangle$. Corrects any single-qubit Z (phase-flip) error.

**Stabilizers:** $X_0 X_1$, $X_1 X_2$

| Syndrome | Error | Correction |
|---|---|---|
| 00 | None | — |
| 01 | $Z_0$ | Apply Z to qubit 0 |
| 10 | $Z_2$ | Apply Z to qubit 2 |
| 11 | $Z_1$ | Apply Z to qubit 1 |

**Logical operators:** $\bar{X} = X_0$, $\bar{Z} = Z_0 Z_1 Z_2$

```csharp
using CSharpNumerics.Physics.Quantum.ErrorCorrection;

var code = new BitFlipCode3();
var stabs = code.GetStabilizers();       // [{(0,'Z'),(1,'Z')}, {(1,'Z'),(2,'Z')}]
var map   = code.GetCorrectionMap();     // 0→[], 1→[(0,'X')], 2→[(2,'X')], 3→[(1,'X')]
var logX  = code.GetLogicalX();          // [(0,'X'),(1,'X'),(2,'X')]
```

#### ShorCode9 — [[9,1,3]]

Shor's 9-qubit code — the first code to correct **any** single-qubit error (X, Z, or Y). Uses three blocks of three qubits: inner bit-flip repetition within blocks, outer phase-flip repetition across blocks.

$$|0\rangle_L = \frac{(|000\rangle+|111\rangle)(|000\rangle+|111\rangle)(|000\rangle+|111\rangle)}{2\sqrt{2}}$$
$$|1\rangle_L = \frac{(|000\rangle-|111\rangle)(|000\rangle-|111\rangle)(|000\rangle-|111\rangle)}{2\sqrt{2}}$$

**8 stabilizer generators:**

| Generator | Operator | Type |
|---|---|---|
| $g_1 \ldots g_6$ | $Z_i Z_{i+1}$ within each block | Bit-flip detection |
| $g_7$ | $X_0 X_1 X_2 X_3 X_4 X_5$ | Phase-flip detection (blocks 0–1) |
| $g_8$ | $X_3 X_4 X_5 X_6 X_7 X_8$ | Phase-flip detection (blocks 1–2) |

**Correction:** The 8-bit syndrome (256 values) maps to at most one X correction + one Z correction. Each block's 2-bit sub-syndrome identifies bit-flip errors exactly as in `BitFlipCode3`. The 2-bit phase-flip sub-syndrome identifies which block suffered a Z error.

**Logical operators:** $\bar{X} = X_0 X_1 \ldots X_8$, $\bar{Z} = Z_0 Z_3 Z_6$

```csharp
var shor = new ShorCode9();
var stabs = shor.GetStabilizers();  // 8 generators
var map   = shor.GetCorrectionMap(); // 256 syndrome entries
```

#### SteaneCode7 — [[7,1,3]]

The Steane code — the smallest CSS (Calderbank-Shor-Steane) code, correcting **any** single-qubit error using only 7 physical qubits. Built from the classical [7,4,3] Hamming code and its dual [7,3,4] code.

$$|0\rangle_L = \frac{1}{\sqrt{8}} \sum_{x \in C_2} |x\rangle \qquad |1\rangle_L = \frac{1}{\sqrt{8}} \sum_{x \in C_2 + v} |x\rangle$$

where $C_2$ is the [7,3,4] dual Hamming code and $v = (1110000)$.

**6 stabilizer generators:**

| Generator | Operator | Type |
|---|---|---|
| $g_1$ | $Z_3 Z_4 Z_5 Z_6$ | X-error detection |
| $g_2$ | $Z_1 Z_2 Z_5 Z_6$ | X-error detection |
| $g_3$ | $Z_0 Z_2 Z_4 Z_6$ | X-error detection |
| $g_4$ | $X_3 X_4 X_5 X_6$ | Z-error detection |
| $g_5$ | $X_1 X_2 X_5 X_6$ | Z-error detection |
| $g_6$ | $X_0 X_2 X_4 X_6$ | Z-error detection |

**Correction:** The 6-bit syndrome has two independent 3-bit halves — Z-stabilizer syndrome (bits 0–2) identifies X errors, X-stabilizer syndrome (bits 3–5) identifies Z errors, using the Hamming decoding map: syndrome $s \to$ qubit $j$ where column $j$ of the parity-check matrix equals the binary expansion of $s$.

**Logical operators:** $\bar{X} = X_0 X_1 \ldots X_6$, $\bar{Z} = Z_0 Z_1 \ldots Z_6$

```csharp
var steane = new SteaneCode7();
var stabs  = steane.GetStabilizers();   // 6 generators (3 Z-type + 3 X-type)
var map    = steane.GetCorrectionMap();  // 64 syndrome entries
```
