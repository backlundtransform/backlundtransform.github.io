---
sidebar_label: "💿 Optics"
---

The `CSharpNumerics.Physics.Optics` namespace provides geometric optics: rays, reflection/refraction (Snell's law, Fresnel equations), optical elements (mirrors, lenses, prisms), apertures, sensors, and a recursive ray tracer.

## 🧱 Core Types

| Type | Description |
|------|-------------|
| `Ray` | Light ray: origin, direction, wavelength (nm), intensity |
| `OpticalMedium` | Refractive index, absorption coefficient, Abbe number for dispersion |
| `RayHit` | Intersection result: point, normal, distance, medium |
| `IOpticalSurface` | Interface for any surface interacting with rays |

```csharp
using CSharpNumerics.Numerics.Objects;
using CSharpNumerics.Physics.Optics;

var ray = new Ray(new Vector(0, 0, 0), new Vector(0, 0, 1), wavelengthNm: 550);
var glass = OpticalMaterialLibrary.CrownGlass;  // n=1.5168, V=64.17
double nBlue = glass.RefractiveIndexAt(450);     // Cauchy dispersion
```

## 🪞 Reflection & Refraction

```csharp
double thetaIncident = Math.PI / 6;
double cosTheta = Math.Cos(thetaIncident);

// Snell's law
double? theta2 = OpticsExtensions.RefractionAngle(n1: 1.0, n2: 1.5, thetaIncident: thetaIncident);

// Total internal reflection
double critical = OpticsExtensions.CriticalAngle(n1: 1.5, n2: 1.0);
bool tir = OpticsExtensions.IsTotalInternalReflection(1.5, 1.0, thetaIncident);

// Fresnel reflectance (unpolarised)
double R = OpticsExtensions.FresnelReflectance(1.0, 1.5, thetaIncident);

// Schlick approximation (fast, game-friendly)
double Rs = OpticsExtensions.SchlickReflectance(1.0, 1.5, cosTheta);

// Beer-Lambert absorption
double transmittance = OpticsExtensions.BeerLambertTransmittance(alpha: 0.5, distance: 2.0);

// Vector-level reflection and refraction
Vector reflected = OpticsExtensions.Reflect(incident, normal);
Vector? refracted = OpticsExtensions.Refract(incident, normal, n1, n2);
```

## 🪞 Mirrors

```csharp
// Plane mirror
var mirror = new PlaneMirror(center: new Vector(0, 0, 10), normal: new Vector(0, 0, -1));
RayHit? hit = mirror.Intersect(ray);

// Spherical mirror (concave/convex)
var concave = new SphericalMirror(
    centreOfCurvature: new Vector(0, 0, 20),
    radiusOfCurvature: 20, MirrorType.Concave);
double imageDistance = concave.ImageDistance(objectDistance: 30); // 1/f = 1/do + 1/di
double magnification = concave.Magnification(objectDistance: 30);
```

## 🔍 Thin Lenses

```csharp
var lens = new ThinLens(
    center: new Vector(0, 0, 5),
    axis: new Vector(0, 0, 1),
    focalLength: 10.0, LensType.Converging);

double di = lens.ImageDistance(objectDistance: 20);   // thin-lens equation
double m  = lens.Magnification(objectDistance: 20);

// Lensmaker's equation: 1/f = (n-1)(1/R1 - 1/R2)
double f = ThinLens.LensmakerFocalLength(n: 1.5168, r1: 0.2, r2: -0.2);

// Refract a ray through the lens (paraxial model)
Ray outRay = lens.RefractRay(incomingRay);
```

## 🔺 Prisms & Dispersion

```csharp
var prism = new Prism(apexAngleRadians: Math.PI / 3, OpticalMaterialLibrary.CrownGlass);

double? deviation = prism.DeviationAngle(thetaIncident: 0.5, wavelengthNm: 550);
double dMin = prism.MinimumDeviation(wavelengthNm: 589.3);

// Angular dispersion between blue and red
double spread = prism.AngularDispersion(lambda1Nm: 450, lambda2Nm: 650, thetaIncident: 0.5);
```

## 📷 Apertures & Sensors

```csharp
// Circular aperture (iris)
var aperture = new CircularAperture(center, normal, radius: 2.0);

// Rectangular aperture (slit)
var slit = new RectangularAperture(center, normal, right, width: 4.0, height: 1.0);

// Image sensor (CCD / film plane)
var sensor = new ImageSensor(center, normal, right, width: 4.0, height: 4.0,
    resolutionX: 256, resolutionY: 256);
// After tracing: sensor.HitCount, sensor.GetPixelIntensity(x, y), sensor.GetImage()
```

## 🎯 Ray Tracer

```csharp
var scene = new OpticalScene();
scene.Add(new ThinLens(lensCenter, axis, focalLength: 10.0));
scene.Add(sensor);

var tracer = new RayTracer(scene) { MaxBounces = 16, IntensityCutoff = 0.001 };
TraceResult result = tracer.Trace(ray);

foreach (var segment in result.Segments)
    Console.WriteLine($"{segment.Start} -> {segment.End}  I={segment.Intensity:F3}");
```