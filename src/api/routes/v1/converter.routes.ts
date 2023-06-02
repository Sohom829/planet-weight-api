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

router.get("/gravity-forces", (req: Request, res: Response) => {
  const planet = req.query.planet?.toString();

  if (planet) {
    const matchedPlanet = findPlanetByName(planet);

    if (matchedPlanet) {
      return res.json({
        message: {
          body: {
            [matchedPlanet.name]: matchedPlanet.gravity,
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
    const sortedPlanets = Object.values(gravitationalForces).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const planetInfo = sortedPlanets.reduce(
      (info, planet) => ({ ...info, [planet.name]: planet.gravity }),
      {}
    );

    return res.json({
      message: {
        body: planetInfo,
      },
    });
  }
});

router.get("/weight-conversion", (req: Request, res: Response) => {
  const weightOnEarth = parseFloat(req.query.weight as string);
  const planetQuery = req.query.planet?.toString().toLowerCase() ?? "earth";

  const matchedPlanet = findPlanetByName(planetQuery);

  if (!matchedPlanet) {
    return res
      .status(404)
      .json({ error: true, message: "Out of solar system" });
  }

  const weightOnPlanet = calculateWeightOnPlanet(
    weightOnEarth,
    matchedPlanet.gravity
  );

  return res.json({
    planet: matchedPlanet.name,
    weightOnPlanet,
  });
});

router.get(
  "/weight-conversion-between-planets",
  (req: Request, res: Response) => {
    const weightOnSourcePlanet = parseFloat(req.query.weight as string);
    const planets = [
      "Sun",
      "Moon",
      "Mars",
      "Jupiter",
      "Mercury",
      "Saturn",
      "Uranus",
      "Neptune",
      "Venus",
      "Pluto",
      "Phobos",
      "Deimos",
      "Ceres",
      "Europa",
      "Eris",
      "Titan",
      "Io",
      "Ganymede",
    ];

    const sourcePlanetQuery =
      req.query.source?.toString().toLowerCase() ?? "earth";
    const targetPlanetQuery =
      req.query.target?.toString().toLowerCase() ?? getRandomPlanet();

    function getRandomPlanet() {
      const randomIndex = Math.floor(Math.random() * planets.length);
      return planets[randomIndex];
    }
    const sourceMatchedPlanet = findPlanetByName(sourcePlanetQuery);
    const targetMatchedPlanet = findPlanetByName(targetPlanetQuery);

    if (!sourceMatchedPlanet || !targetMatchedPlanet) {
      return res
        .status(404)
        .json({ error: true, message: "Out of solar system" });
    }

    const weightOnTargetPlanet = convertWeightBetweenPlanets(
      weightOnSourcePlanet,
      sourceMatchedPlanet.gravity,
      targetMatchedPlanet.gravity
    );

    return res.json({
      sourcePlanet: sourceMatchedPlanet.name,
      weightOnSourcePlanet,
      targetPlanet: targetMatchedPlanet.name,
      weightOnTargetPlanet,
    });
  }
);

router.get("/available-planets", (req: Request, res: Response) => {
  const count =
    parseInt(req.query.count?.toString() || "18") ||
    Object.keys(gravitationalForces).length;
  const planetNames = Object.values(gravitationalForces)
    .slice(0, count)
    .map((planet) => planet.name);

  console.log(`Planet names (${count}):`, planetNames.join(", "));

  return res.json({
    message: {
      body: planetNames,
    },
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

function findPlanetByName(name: string): Planet | undefined {
  let matchedPlanet: string | null = null;
  let maxMatchCount = 0;

  for (const planet in gravitationalForces) {
    const planetName = planet.toLowerCase();
    let matchCount = 0;

    for (let i = 0; i < name.length; i++) {
      if (planetName.includes(name[i])) {
        matchCount++;
      }
    }

    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      matchedPlanet = planet;
    }
  }

  return matchedPlanet ? gravitationalForces[matchedPlanet] : undefined;
}

export default router;
