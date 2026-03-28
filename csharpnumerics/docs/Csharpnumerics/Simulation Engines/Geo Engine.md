---
sidebar_label: "🌍 Geo Engine"
sidebar_position: 3
---

A fluent simulation engine for modelling atmospheric gas dispersion over geographic areas. Combines Gaussian plume physics, Monte Carlo uncertainty quantification, ML clustering, and probability mapping into a single pipeline — with export to GeoJSON (Cesium) and Unity3D binary.

**Namespace:** `CSharpNumerics.Engines.GIS`

---

## 🔄 Pipeline Overview

```
Physics model  →  Monte Carlo (N scenarios)  →  ML clustering  →  Probability map  →  Export
```

The engine builds on existing library capabilities:

| Step | Uses |
|------|------|
| Physics | `EnvironmentalExtensions.GaussianPlume` / `GaussianPuff` |
| Monte Carlo | `MonteCarloSimulator`, `IMonteCarloModel` |
| Clustering | `ClusteringGrid`, `KMeans`, `SilhouetteEvaluator` |
| Numerics | `ScalarField`, `VectorField`, `Vector`, `Matrix` |

---

## 📐 GeoGrid — 3-D spatial grid

A uniform 3-D grid defined by axis-aligned bounds and a cell step size:

```csharp
using CSharpNumerics.Engines.GIS.Grid;

// 1 km × 1 km area, ground to 100 m altitude, 10 m resolution
var grid = new GeoGrid(
    xMin: -500, xMax: 500,
    yMin: -500, yMax: 500,
    zMin: 0,    zMax: 100,
    step: 10);

int totalCells = grid.CellCount;   // Nx × Ny × Nz
Vector centre = grid.CellCentre(5, 10, 3);  // world-space position

// Index round-trip
int flat = grid.Index(5, 10, 3);
var (ix, iy, iz) = grid.Index3D(flat);

// Find nearest cell to a world position
var (nx, ny, nz) = grid.NearestIndex(new Vector(123, -45, 8));

// Enumerate all cell centres
foreach (Vector pos in grid)
    Console.WriteLine(pos);
```

** GeoCell & GridSnapshot**

```csharp
// GridSnapshot holds scalar values for one time step
double[] values = new double[grid.CellCount];
var snapshot = new GridSnapshot(grid, values, time: 60.0, timeIndex: 1);

// Access by index
double val = snapshot[5, 10, 0];            // by (ix, iy, iz)
double val2 = snapshot.ValueAt(new Vector(200, 50, 0));  // by nearest cell

// Query
double max = snapshot.Max();
var hotCells = snapshot.CellsAbove(threshold: 1e-6);

// Iterate all cells with position + value
foreach (GeoCell cell in snapshot.AllCells())
    Console.WriteLine($"{cell.Position} = {cell.Value:E3}");
```

**TimeFrame**

```csharp
using CSharpNumerics.Engines.GIS.Scenario;

// 1 hour simulation, 1-minute steps
var tf = new TimeFrame(start: 0, end: 3600, stepSeconds: 60);

double[] times = tf.ToArray();             // [0, 60, 120, ..., 3600]
double t30min = tf.TimeAt(30);             // 1800.0
int idx = tf.NearestIndex(1800);           // 30
```

---

## 🌫️ PlumeSimulator — single-scenario physics

Evaluates the Gaussian plume (steady-state or transient puff) on a `GeoGrid` for every time step:

```csharp
using CSharpNumerics.Engines.GIS.Simulation;
using CSharpNumerics.Physics.Enums;

// Steady-state: same concentration field at every time step
var sim = new PlumeSimulator(
    emissionRate: 5.0,           // kg/s
    windSpeed: 10,               // m/s
    windDirection: new Vector(1, 0, 0),
    stackHeight: 50,             // metres
    sourcePosition: new Vector(0, 0, 50),
    stability: StabilityClass.D,
    mode: PlumeMode.SteadyState);

List<GridSnapshot> snapshots = sim.Run(grid, tf);

// Transient: puff advects downwind over time
var simTransient = new PlumeSimulator(
    emissionRate: 5.0,
    windSpeed: 10,
    windDirection: new Vector(1, 0, 0),
    stackHeight: 50,
    sourcePosition: new Vector(0, 0, 50),
    stability: StabilityClass.D,
    mode: PlumeMode.Transient);
simTransient.ReleaseSeconds = 10;

List<GridSnapshot> transientSnaps = simTransient.Run(grid, tf);

// Single time step
GridSnapshot snap = sim.RunSingle(grid, time: 300);
```

---

## 🎲 ScenarioVariation — parameter ranges for Monte Carlo

Defines how physics parameters are varied across stochastic iterations:

```csharp
var variation = new ScenarioVariation()
    .WindSpeed(8, 12)                    // uniform [8, 12] m/s
    .WindDirectionJitter(15)             // Gaussian jitter, σ = 15°
    .EmissionRate(3, 7)                  // uniform [3, 7] kg/s
    .SetStabilityWeights(                // categorical sampling
        d: 0.6, c: 0.2, e: 0.2);

bool hasVar = variation.HasVariation;    // true
```

---

## 🎯 PlumeMonteCarloModel — N stochastic scenarios

Runs N scenarios by sampling from `ScenarioVariation` and collecting per-cell concentration distributions:

```csharp
var mcModel = new PlumeMonteCarloModel(
    emissionRate: 5.0,
    windSpeed: 10,
    windDirection: new Vector(1, 0, 0),
    stackHeight: 50,
    sourcePosition: new Vector(0, 0, 50),
    grid: grid,
    timeFrame: tf,
    variation: variation,
    stability: StabilityClass.D,
    mode: PlumeMode.SteadyState);

// Full batch: returns scenario matrix + all snapshots
MonteCarloScenarioResult result = mcModel.RunBatch(
    iterations: 1000,
    seed: 42);

// Scenario matrix: (1000 × cells·timeSteps)
Matrix scenarioMatrix = result.ScenarioMatrix;

// Per-cell distribution across all scenarios
double[] cellDist = result.GetCellDistribution(
    cellIndex: grid.NearestFlatIndex(new Vector(200, 0, 0)),
    timeIndex: 30);                    // at t = 30 min

// Single scenario vector
double[] row = result.GetScenarioVector(0);
```

**Compatible with the existing `MonteCarloSimulator`** for scalar summary statistics (peak concentration):

```csharp
using CSharpNumerics.Statistics.MonteCarlo;

var sim = new MonteCarloSimulator(seed: 42);
MonteCarloResult peakStats = sim.Run(mcModel, iterations: 1000);

double meanPeak = peakStats.Mean;
double p95 = peakStats.Percentile(95);
```

---

## 🔬 ScenarioClusterAnalyzer — ML clustering of scenarios

Finds the most probable emission scenario by clustering the Monte Carlo scenario matrix:

```csharp
using CSharpNumerics.Engines.GIS.Analysis;

var analysis = ScenarioClusterAnalyzer
    .For(mcResult)
    .WithAlgorithm(new ClusteringGrid().AddModel<KMeans>(g => g.Add("K", 3, 5)))
    .WithEvaluator(new SilhouetteEvaluator())
    .Run();

int dominant = analysis.DominantCluster;      // largest cluster
int[] members = analysis.GetClusterIterations(dominant);
List<GridSnapshot> mean = analysis.GetClusterMeanSnapshots(dominant);
```

** ProbabilityMap & TimeAnimator — probability mapping**

```csharp
// Exceedance probability per cell at one time step
var pMap = ProbabilityMap.Build(
    mcResult.Snapshots,
    timeIndex: 30,
    threshold: 1e-6,
    iterationFilter: members);   // optional: filter to dominant cluster

double pAt = pMap.At(new Vector(200, 50, 0));
var hotCells = pMap.CellsAbove(0.5);

// Time-animated probability
var animation = TimeAnimator.Build(mcResult.Snapshots, threshold: 1e-6);
double p = animation.ProbabilityAt(new Vector(200, 50, 0), timeSeconds: 1800);
double cumP = animation.CumulativeProbabilityAt(new Vector(200, 50, 0), 1800);
```

---

## 🧩 Fluent API — RiskScenario

End-to-end pipeline in a single fluent chain:

```csharp
using CSharpNumerics.Engines.GIS.Scenario;

var result = RiskScenario
    .ForGaussianPlume(5.0)
    .FromSource(new Vector(0, 0, 50))
    .WithWind(10, new Vector(1, 0, 0))
    .WithStability(StabilityClass.D)
    .WithVariation(v => v
        .WindSpeed(8, 12)
        .WindDirectionJitter(15)
        .SetStabilityWeights(d: 0.6, c: 0.2, e: 0.2))
    .OverGrid(new GeoGrid(-500, 500, -500, 500, 0, 100, 10))
    .OverTime(0, 3600, 60)
    .RunMonteCarlo(1000)
    .AnalyzeWith(
        new ClusteringGrid().AddModel<KMeans>(g => g.Add("K", 3, 5)),
        new SilhouetteEvaluator())
    .Build(threshold: 1e-6);

// Query probability at a point and time
double p = result.ProbabilityAt(new Vector(200, 50, 0), timeSeconds: 1800);
double cumP = result.CumulativeProbabilityAt(new Vector(200, 50, 0), 1800);
ProbabilityMap map = result.ProbabilityMapAt(timeIndex: 30);

// Export
result.ExportGeoJson("output/plume.geojson");
result.ExportUnity("output/plume.bin");
result.ExportCesium("output/plume.czml");
```

---

## 📦 Export — GeoJSON, Unity binary, Cesium CZML

```csharp
using CSharpNumerics.Engines.GIS.Export;

// GeoJSON — single snapshot or full animation
GeoJsonExporter.Save(snapshot, "snap.geojson");
GeoJsonExporter.Save(animation, "anim.geojson");
var paths = GeoJsonExporter.SavePerTimeStep(animation, "out/step");

// Unity binary — compact float[] format with GPLM header
UnityBinaryExporter.Save(snapshots, animation, "plume.bin");
var data = UnityBinaryExporter.Read("plume.bin");  // round-trip

// Cesium CZML — time-animated colour-coded entities
CesiumExporter.Save(animation, "plume.czml", name: "Plume Risk");
string json = CesiumExporter.ToGeoJsonCesium(probMap);
```

---

## 🌐 GIS Coordinates — WGS84, UTM, local tangent plane

Create geo-referenced grids from latitude/longitude bounding boxes with automatic projection:

```csharp
using CSharpNumerics.Engines.GIS.Coordinates;

// Geographic coordinate
var stockholm = new GeoCoordinate(59.3293, 18.0686, altitude: 25);
var gothenburg = new GeoCoordinate(57.7089, 11.9746);
double dist = stockholm.DistanceTo(gothenburg);  // ~398 km

// Local Tangent Plane projection
var proj = new Projection(stockholm, ProjectionType.LocalTangentPlane);
Vector local = proj.ToLocal(59.34, 18.08);        // → metres (east, north, up)
GeoCoordinate back = proj.ToGeo(local);            // → lat/lon round-trip

// UTM projection (auto-detects zone)
var utmProj = new Projection(stockholm, ProjectionType.UTM);
int zone = utmProj.UtmZone;  // 34

// Geo-referenced grid from lat/lon bounding box
var sw = new GeoCoordinate(59.32, 18.06);
var ne = new GeoCoordinate(59.34, 18.10);
var geoGrid = GeoGrid.FromLatLon(sw, ne, altMin: 0, altMax: 100, step: 50);

// Cell centres in WGS84
GeoCoordinate geo = geoGrid.CellCentreGeo(0);  // lat, lon, altitude

// GeoJSON export automatically uses [lon, lat, alt] with "crs":"WGS84"
var snapshot = new GridSnapshot(geoGrid, values, 0, 0);
string json = GeoJsonExporter.ToGeoJson(snapshot);  // WGS84 coordinates
```

---

## ☢️ Materials & Fluent Pipeline Integration

```csharp
using CSharpNumerics.Physics.Materials;

// Create a material descriptor (auto-attaches known decay chain)
var material = Materials.Radioisotope("Cs137");

// Use in the fluent pipeline — adds "activity" and "dose" layers to snapshots
var result = RiskScenario
    .ForGaussianPlume(5.0)
    .FromSource(new Vector(0, 0, 50))
    .WithWind(10, new Vector(1, 0, 0))
    .WithStability(StabilityClass.D)
    .WithMaterial(Materials.Radioisotope("Cs137"))    // ← attach isotope
    .WithVariation(v => v.WindSpeed(8, 12))
    .OverGrid(new GeoGrid(-500, 500, -500, 500, 0, 100, 10))
    .OverTime(0, 3600, 60)
    .RunMonteCarlo(1000)
    .Build(threshold: 1e-6);

// Query named layers on any snapshot
GridSnapshot snap = result.Snapshots[0];
double[] activityLayer = snap.GetLayer("activity");   // Bq/m³
double[] doseLayer = snap.GetLayer("dose");           // Sv
bool hasIt = snap.HasLayer("activity");               // true

// GeoJSON export automatically includes activity & dose properties
result.ExportGeoJson("fallout.geojson");
```

Output GeoJSON includes per-feature nuclear properties:

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [200, 50, 0] },
  "properties": {
    "concentration": 0.0012,
    "activity": 120.5,
    "dose": 0.004
  }
}
```

---

## 🔺 Exposure Polygons — Peak & Time-Integrated Contours

Generate closed polygons delineating areas where an exposure metric (peak or time-integrated)
exceeds a threshold. Works with concentration or any named layer (activity, dose).

```csharp
using CSharpNumerics.Engines.GIS.Analysis;

// Run a scenario with radioactive material
var result = RiskScenario
    .ForGaussianPlume(5.0)
    .FromSource(new Vector(0, 0, 50))
    .WithWind(10, new Vector(1, 0, 0))
    .WithStability(StabilityClass.D)
    .WithMaterial(Materials.Radioisotope("Cs137"))
    .OverGrid(new GeoGrid(-500, 500, -500, 500, 0, 100, 50))
    .OverTime(0, 3600, 60)
    .RunSingle();

// Peak exceedance polygon — where the maximum dose at any time step exceeds threshold
ExposurePolygon peakDose = result.GeneratePeakExposurePolygon(
    threshold: 1e-6, layerName: "dose");

// Time-integrated exposure polygon — where cumulative dose exceeds threshold
ExposurePolygon integratedDose = result.GenerateIntegratedExposurePolygon(
    threshold: 1e-4, layerName: "dose");

// Polygon properties
List<Vector> boundary = peakDose.Boundary;      // closed ring of vertices
int cells = peakDose.ExceedanceCellCount;       // cells above threshold
double area = peakDose.AreaSquareMetres;         // approximate area (m²)
ExposureType type = peakDose.Type;               // Peak or Integrated

// Also works with plain concentration (no material needed)
var concPoly = result.GeneratePeakExposurePolygon(threshold: 1e-6);

// Export to GeoJSON Polygon
string json = GeoJsonExporter.ToGeoJson(peakDose);
GeoJsonExporter.Save(peakDose, "peak_dose_zone.geojson");

// Export multiple polygons as FeatureCollection
string fc = GeoJsonExporter.ToGeoJson(
    new List<ExposurePolygon> { peakDose, integratedDose });
```

---

## 🌍 GIS-RL Integration

Bridges **GIS simulation** with the **RL framework** through `ScenarioRLAnalyzer`. Train RL agents to learn **optimal mitigation strategies** for spatial scenarios — atmospheric plumes, floods, fires, or any GIS-based model.

| Bridge | ML module | Purpose |
|---|---|---|
| `ScenarioClusterAnalyzer` | Clustering | *What can happen?* (outcome grouping) |
| `ScenarioRLAnalyzer` | Reinforcement Learning | *What should we do?* (optimal response) |

 **Extensibility**

`ScenarioRLAnalyzer` accepts any environment:

| Entry point | Use case |
|---|---|
| `ScenarioRLAnalyzer.For(emissionRate, sourcePosition)` | Builds a `PlumeEnvironment` internally |
| `ScenarioRLAnalyzer.For(IGISEnvironment)` | Custom GIS environment (flood, fire, etc.) |
| `ScenarioRLAnalyzer.For(IEnvironment)` | Any RL environment |

Implement `IGISEnvironment` for custom spatial simulations:

```csharp
public class FloodEnvironment : IGISEnvironment
{
    public int ObservationSize => 6;
    public int ActionSize => 4;
    public double[] Reset() { /* ... */ }
    public (double[] state, double reward, bool done, Dictionary<string, object> info)
        Step(int action) { /* ... */ }

    // IGISEnvironment members
    public GeoGrid Grid { get; }
    public TimeFrame TimeFrame { get; }
    public double Threshold { get; set; }
    public double ActionCost { get; set; }
    public int MaxSteps { get; }
    public GridSnapshot LastSnapshot { get; }
}
```

 **Quick Start**

```csharp
var result = ScenarioRLAnalyzer
    .For(5.0, new Vector(0, 0, 50))
    .WithWind(10, new Vector(1, 0, 0))
    .WithStability(StabilityClass.D)
    .OverGrid(new GeoGrid(-500, 500, -500, 500, 0, 0, 50))
    .OverTime(0, 600, 10)
    .WithAgent(new DQN
    {
        HiddenLayers = new[] { 64, 64 },
        LearningRate = 0.001,
        Gamma = 0.99,
        BatchSize = 32
    })
    .WithPolicy(new EpsilonGreedy(seed: 42))
    .WithReplayBuffer(10000, seed: 42)
    .WithEpisodes(500, maxStepsPerEpisode: 60)
    .WithSeed(42)
    .Run();

Console.WriteLine($"{result.AgentName} → avg return = {result.AverageReturn:F2}");
```
 **Direct Environment Usage**

`PlumeEnvironment` implements `IEnvironment` and works with the standard `RLExperiment` API:

```csharp
var env = new PlumeEnvironment(
    emissionRate: 5.0, windSpeed: 10,
    windDirection: new Vector(1, 0, 0), stackHeight: 50,
    sourcePosition: new Vector(0, 0, 50),
    grid: new GeoGrid(-500, 500, -500, 500, 0, 0, 50),
    timeFrame: new TimeFrame(0, 600, 10),
    stability: StabilityClass.D);

var result = RLExperiment
    .For(env)
    .WithAgent(new PPO
    {
        ActorHiddenLayers = new[] { 64, 64 },
        CriticHiddenLayers = new[] { 64, 64 },
        ClipEpsilon = 0.2
    })
    .WithEpisodes(500, maxStepsPerEpisode: 60)
    .WithSeed(42)
    .Run();
```

> **Note:** When using `For(IGISEnvironment)` or `For(IEnvironment)`, physics configuration methods (`WithWind`, `WithStability`, etc.) are **disabled** — configure these on the environment before passing it in.
