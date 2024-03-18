import tilemap from "../assets/tilemap3.png";
import Engine from "../core/engine";
import char from "../assets/char.png";
import groundSprite from "../assets/ground.png";
import fenceSprite from "../assets/fence.png";
import AuroraBatcher from "../core/aurora/urp/batcher";
import DogmaCore from "../core/dogma/core";
import medievalSharp from "./fonts/MedievalSharp.ttf";
import EntityManager from "../core/dogma/entityManager";
import Player from "./entities/player";
import Plate from "./entities/plate";
import Obstacle from "./entities/obstacle";
import Ground from "./entities/ground";
import Fence from "./entities/fence";

async function preload() {
  await AuroraBatcher.createBatcher({
    backgroundColor: [255, 255, 0, 255],
    maxQuadPerSceen: 200,
    customCamera: false,
    bloom: { active: false, str: 0 },
    loadFonts: [{ name: "MedievalSharp", font: medievalSharp }],
    loadTextures: [
      { name: "tilemap", url: tilemap },
      { name: "characters", url: char },
      { name: "ground", url: groundSprite },
      { name: "fence", url: fenceSprite },
    ],
  });
}
function createPushDay(y: number, mass: number, fric: number) {
  EntityManager.addEntityOnStart(
    new Fence({
      position: { x: 800 - 210, y: y - 50 },
    })
  );
  EntityManager.addEntityOnStart(
    new Fence({
      position: { x: 800 - 210, y: y + 50 },
    })
  );
  EntityManager.addEntityOnStart(
    new Plate({
      friction: fric,
      mass: mass,
      position: { x: 400, y: y + 15 },
    })
  );
}
function createSmash() {
  EntityManager.addEntityOnStart(
    new Plate({
      friction: 0.1,
      mass: 100,
      position: { x: 50, y: 550 },
      pushForce: { x: 0, y: -600 },
    })
  );
  EntityManager.addEntityOnStart(
    new Plate({
      friction: 0.1,
      mass: 100,
      position: { x: 50, y: 50 },
      pushForce: { x: 0, y: 600 },
    })
  );
}
function createDubblePush(y: number, mass: number) {
  EntityManager.addEntityOnStart(
    new Plate({
      friction: 1,
      mass: mass,
      position: { x: 400, y: y },
    })
  );
  EntityManager.addEntityOnStart(
    new Plate({
      friction: 1,
      mass: mass,
      position: { x: 450, y: y },
    })
  );
}
function createWalls() {
  EntityManager.addEntityOnStart(
    new Obstacle({
      position: { x: 0, y: 350 },
      size: { height: 350, width: 10 },
    })
  );
  EntityManager.addEntityOnStart(
    new Obstacle({
      position: { x: 800, y: 350 },
      size: { height: 350, width: 10 },
    })
  );
  EntityManager.addEntityOnStart(
    new Obstacle({
      position: { x: 400, y: 0 },
      size: { height: 10, width: 400 },
    })
  );
  EntityManager.addEntityOnStart(
    new Obstacle({
      position: { x: 400, y: 600 },
      size: { height: 10, width: 400 },
    })
  );
}
function setup() {
  DogmaCore.createWorld("main");
  EntityManager.addEntityOnStart(new Ground());
  EntityManager.addEntityOnStart(new Player());

  createPushDay(100, 100, 0.2);
  createPushDay(300, 1000, 0.5);
  createPushDay(500, 5000, 0.9);
  createSmash();
  createDubblePush(200, 100);
  createDubblePush(400, 1000);
  createWalls();

  DogmaCore.addSystem("KeyInputs");
  DogmaCore.addSystem("IndiePhysics");
  DogmaCore.addSystem("Animator");
  DogmaCore.addSystem("Renderer");
}
Engine.Initialize({ preload, setup });
