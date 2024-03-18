import Engine from "../core/engine";
import AuroraBatcher from "../core/aurora/urp/batcher";
import DogmaCore from "../core/dogma/core";
import back from "../assets/main.png";
import clouds from "../assets/clouds.png";
import lamp from "../assets/lamp.png";
import sky from "../assets/sky.png";
import skyline from "../assets/skyline.png";
import EntityManager from "../core/dogma/entityManager";
import Background from "./entities/bckgound";
import LightSrc from "./entities/lightSrc";
import Star from "./entities/star";
import HouseWindow from "./entities/window";
import WallLamp from "./entities/spriteLight";
import { randomNumber } from "../core/utils/utils";
async function preload() {
  await AuroraBatcher.createBatcher({
    backgroundColor: [5, 5, 5, 255],
    maxQuadPerSceen: 200,
    customCamera: false,
    bloom: { active: false, str: 0 },
    loadTextures: [
      { name: "build", url: back },
      { name: "sky", url: sky },
      { name: "skyline", url: skyline },
      { name: "clouds", url: clouds },
      { name: "lamp", url: lamp },
    ],
  });
}
function setup() {
  DogmaCore.createWorld("main");
  createBackground();
  carLights();
  lamps();
  apartments();
  DogmaCore.addSystem("DayNight");
  DogmaCore.addSystem("Renderer");
}
Engine.Initialize({ preload, setup });

function carLights() {
  const color: RGB = [255, 0, 0];
  const size: Size2D = { width: 50, height: 50 };

  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 292, y: 440 },
      color,
      size,
      useRoutine: false,
    })
  );
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 202, y: 440 },
      color,
      size,
      useRoutine: false,
    })
  );
}
function lamps() {
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 745, y: 462 },
      color: [255, 255, 0],
      size: { width: 200, height: 120 },
      intencity: 255,
      lightOn: "0:00",
      lightOff: "8:00",
      type: "spot",
    })
  );
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 230, y: 562 },
      color: [255, 250, 255],
      size: { width: 400, height: 400 },
      lightOn: "0:00",
      lightOff: "8:00",
      type: "spot",
    })
  );
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 600, y: 230 },
      color: [190, 5, 255],
      size: { width: 100, height: 100 },
      type: "radialHalf",
      lightOn: "22:00",
      lightOff: "2:00",
    })
  );
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 560, y: 430 },
      color: [255, 255, 255],
      size: { width: 160, height: 150 },
      type: "star",
      useRoutine: false,
    })
  );
  EntityManager.addEntityOnStart(
    new LightSrc({
      position: { x: 570, y: 430 },
      color: [250, 255, 5],
      size: { width: 250, height: 100 },
      type: "radial",
      lightOn: "0:00",
      lightOff: "8:00",
    })
  );
  EntityManager.addEntityOnStart(new WallLamp());
}
function stars() {
  Array(10)
    .fill(null)
    .forEach(() => {
      EntityManager.addEntityOnStart(
        new Star({
          position: { x: randomNumber(250, 500), y: randomNumber(0, 70) },
        })
      );
    });
}
function createBackground() {
  EntityManager.addEntityOnStart(new Background("sky", "sky"));
  stars();
  EntityManager.addEntityOnStart(new Background("clouds", "dark"));
  EntityManager.addEntityOnStart(new Background("skyline", "dark"));
  EntityManager.addEntityOnStart(new Background("build"));
}
function apartments() {
  EntityManager.addEntityOnStart(
    new HouseWindow({
      position: { x: 424, y: 299 },
      size: { width: 7, height: 5 },
      lightSize: { height: 20, width: 20 },
      lightType: "radial",
      lightColor: [180, 10, 220],
      spriteColor: [150, 0, 190],
    })
  );
  EntityManager.addEntityOnStart(
    new HouseWindow({
      position: { x: 401, y: 299 },
      size: { width: 7, height: 5 },
      lightSize: { height: 20, width: 20 },
      lightType: "radial",
      lightColor: [250, 130, 20],
      spriteColor: [250, 130, 20],
    })
  );
  EntityManager.addEntityOnStart(
    new HouseWindow({
      position: { x: 336, y: 266 },
      size: { width: 4, height: 7 },
      lightSize: { height: 20, width: 20 },
      lightType: "radial",
      spriteColor: [250, 60, 20],
      lightColor: [250, 60, 20],
      lightOffset: { x: 0, y: -2 },
    })
  );
  EntityManager.addEntityOnStart(
    new HouseWindow({
      position: { x: 317, y: 265 },
      size: { width: 5, height: 7 },
      lightSize: { height: 20, width: 20 },
      lightType: "radial",
      lightColor: [250, 130, 20],
      spriteColor: [250, 130, 20],
      lightOffset: { x: 0, y: -2 },
    })
  );
  EntityManager.addEntityOnStart(
    new HouseWindow({
      position: { x: 296, y: 265 },
      size: { width: 4, height: 7 },
      lightSize: { height: 20, width: 20 },
      lightType: "radial",
      lightColor: [250, 150, 50],
      spriteColor: [200, 120, 20],
      lightOffset: { x: 0, y: -2 },
    })
  );
}
