---
sidebar_label: "⚙️ Overview"
title: "Simulation Engines"
---

# ⚙️ Simulation Engines

Modular computational engines designed for integration with external visualization, simulation, and analysis platforms.

```csharp
namespace CSharpNumerics.Engines
```

:::info Separate package since v4.0.0
As of **CSharpNumerics 4.0.0** the simulation engines ship in their own NuGet package, [**CSharpNumerics.Engines**](https://www.nuget.org/packages/CSharpNumerics.Engines/), so the core `CSharpNumerics` package can focus on numerical analysis, statistics, machine learning, and physics. The `CSharpNumerics.Engines.*` namespaces and APIs documented below are unchanged — just add the package alongside `CSharpNumerics`:

```bash
dotnet add package CSharpNumerics.Engines
```
:::

| Module | Description |
|--------|-------------|
| 🎮 [Game Engine](Game%20Engine.md) | Collision detection, constraints, rigid-body interactions, flight dynamics, rocket launch simulation, and gameplay-oriented simulation |
| 🎧 [Audio Engine](Audio%20Engine.md) | Audio synthesis, signal processing, effects, and spectral analysis |
| 🌍 [Geo Engine](Geo%20Engine.md) | Dispersion modelling, GIS analysis, wildfire spread, probability mapping, and spatial export |
| 💻 [Quantum Engine](Quantum%20Engine.md) | Quantum circuits, core algorithms, noisy simulation, and error correction |
| ⚡ [Multiphysics Engine](Multiphysics%20Engine.md) | Multiphysics PDE solvers, materials-aware workflows, export pipelines, and Monte Carlo/ML integration |
| 🛰️ [Exoplanet Engine](Exoplanet%20Engine.md) | Transit detection, light-curve validation, feature extraction, and ML-assisted exoplanet classification |
