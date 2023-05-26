import express, { Request, Response } from "express";
const router = express.Router();

interface Planet {
  name: string;
  gravity: number;
}

const gravitationalForces: { [key: string]: Planet } = {
  earth: { name: "Earth", gravity: 9.81 },
  mars: { name: "Mars", gravity: 3.71 },
  sun: { name: "Sun", gravity: 274 },
  jupiter: { name: "Jupiter", gravity: 24.79 },
  venus: { name: "Venus", gravity: 8.87 },
  mercury: { name: "Mercury", gravity: 3.7 },
  saturn: { name: "Saturn", gravity: 10.44 },
  uranus: { name: "Uranus", gravity: 8.87 },
  neptune: { name: "Neptune", gravity: 11.15 },
  pluto: { name: "Pluto", gravity: 0.62 },
  phobos: { name: "Phobos", gravity: 0.0057 },
  deimos: { name: "Deimos", gravity: 0.003 },
  ceres: { name: "Ceres", gravity: 0.27 },
  europa: { name: "Europa", gravity: 1.315 },
  eris: { name: "Eris", gravity: 0.82 },
  titan: { name: "Titan", gravity: 1.352 },
  io: { name: "Io", gravity: 1.796 },
  ganymede: { name: "Ganymede", gravity: 1.428 },
};

router.get("/gravity.forces.get", (req: Request, res: Response) => {
  const planet = req.query.planet?.toString() || null;
  const planets: { [key: string]: Planet } = {
    earth: { name: "Earth", gravity: 9.81 },
    mars: { name: "Mars", gravity: 3.71 },
    sun: { name: "Sun", gravity: 274 },
    jupiter: { name: "Jupiter", gravity: 24.79 },
    venus: { name: "Venus", gravity: 8.87 },
    mercury: { name: "Mercury", gravity: 3.7 },
    saturn: { name: "Saturn", gravity: 10.44 },
    uranus: { name: "Uranus", gravity: 8.87 },
    neptune: { name: "Neptune", gravity: 11.15 },
    pluto: { name: "Pluto", gravity: 0.62 },
    phobos: { name: "Phobos", gravity: 0.0057 },
    deimos: { name: "Deimos", gravity: 0.003 },
    ceres: { name: "Ceres", gravity: 0.27 },
    europa: { name: "Europa", gravity: 1.315 },
    eris: { name: "Eris", gravity: 0.82 },
    titan: { name: "Titan", gravity: 1.352 },
    io: { name: "Io", gravity: 1.796 },
    ganymede: { name: "Ganymede", gravity: 1.428 },
  };

  if (planet) {
    const selectedPlanet = planets[planet];
    if (selectedPlanet) {
      return res.json({
        message: {
          body: {
            [selectedPlanet.name]: selectedPlanet.gravity,
          },
        },
      });
    } else {
      return res.json({
        message: {
          body: "Invalid planet name.",
        },
      });
    }
  } else {
    const sortedPlanets = Object.keys(planets).sort();
    const planetInfo: { [key: string]: number } = {};
    sortedPlanets.forEach((planetName) => {
      const planet = planets[planetName];
      planetInfo[planet.name] = planet.gravity;
    });

    return res.json({
      message: {
        body: planetInfo,
      },
    });
  }
});

router.get("/weight.convert.get", (req: Request, res: Response) => {
  const weightOnEarth = parseFloat(req.query.weight as string);
  const planetQuery = req.query.planet?.toString().toLowerCase() || "earth";

  let matchedPlanet: string | null = null;
  let maxMatchCount = 0;

  for (const planet in gravitationalForces) {
    const planetName = planet.toLowerCase();
    let matchCount = 0;

    for (let i = 0; i < planetQuery.length; i++) {
      if (planetName.includes(planetQuery[i])) {
        matchCount++;
      }
    }

    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      matchedPlanet = planet;
    }
  }

  if (!matchedPlanet) {
    return res
      .status(404)
      .json({ error: true, message: "Out of solar system" });
  }

  const weightOnPlanet = calculateWeightOnPlanet(
    weightOnEarth,
    gravitationalForces[matchedPlanet].gravity
  );

  return res.json({
    planet: gravitationalForces[matchedPlanet].name,
    weightOnPlanet,
  });
});

router.get("/weight.convert.planet", (req: Request, res: Response) => {
  const weightOnSourcePlanet = parseFloat(req.query.weight as string);
  const sourcePlanetQuery = req.query.source?.toString().toLowerCase();
  const targetPlanetQuery = req.query.target?.toString().toLowerCase();

  let sourceMatchedPlanet: string | null = null;
  let targetMatchedPlanet: string | null = null;
  let sourceMaxMatchCount = 0;
  let targetMaxMatchCount = 0;

  for (const planet in gravitationalForces) {
    const planetName = planet.toLowerCase();

    if (sourcePlanetQuery) {
      let matchCount = 0;

      for (let i = 0; i < sourcePlanetQuery.length; i++) {
        if (planetName.includes(sourcePlanetQuery[i])) {
          matchCount++;
        }
      }

      if (matchCount > sourceMaxMatchCount) {
        sourceMaxMatchCount = matchCount;
        sourceMatchedPlanet = planet;
      }
    }

    if (targetPlanetQuery) {
      let matchCount = 0;

      for (let i = 0; i < targetPlanetQuery.length; i++) {
        if (planetName.includes(targetPlanetQuery[i])) {
          matchCount++;
        }
      }

      if (matchCount > targetMaxMatchCount) {
        targetMaxMatchCount = matchCount;
        targetMatchedPlanet = planet;
      }
    }
  }

  if (!sourceMatchedPlanet || !targetMatchedPlanet) {
    return res
      .status(404)
      .json({ error: true, message: "Out of solar system" });
  }

  const weightOnTargetPlanet = convertWeightBetweenPlanets(
    weightOnSourcePlanet,
    gravitationalForces[sourceMatchedPlanet].gravity,
    gravitationalForces[targetMatchedPlanet].gravity
  );

  return res.json({
    sourcePlanet: gravitationalForces[sourceMatchedPlanet].name,
    weightOnSourcePlanet,
    targetPlanet: gravitationalForces[targetMatchedPlanet].name,
    weightOnTargetPlanet,
  });
});

function calculateWeightOnPlanet(
  weightOnEarth: number,
  gravitationalForceOnPlanet: number
): string {
  const gravitationalForceOnEarth = 9.81;

  const weightOnPlanet =
    (weightOnEarth * gravitationalForceOnPlanet) / gravitationalForceOnEarth;
  return weightOnPlanet.toFixed(2);
}

function convertWeightBetweenPlanets(
  weightOnSourcePlanet: number,
  sourceGravity: number,
  targetGravity: number
): string {
  const weightOnEarth =
    (weightOnSourcePlanet * sourceGravity) / gravitationalForces.earth.gravity;
  const weightOnTargetPlanet =
    (weightOnEarth * targetGravity) / gravitationalForces.earth.gravity;
  return weightOnTargetPlanet.toFixed(2);
}

export default router;
