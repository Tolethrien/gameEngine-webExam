import Engine from "../core/engine";
import AuroraBatcher from "../core/aurora/urp/batcher";
import DogmaCore from "../core/dogma/core";
import boySprite from "../assets/suit3.png";
import city from "../assets/city.png";
import bridge from "../assets/bridge.png";
import EntityManager from "../core/dogma/entityManager";
import Boy from "./entities/boy";
import Sceen from "./entities/sceen";
import GlobalStore from "../core/modules/globalStore/globalStore";

async function preload() {
  await AuroraBatcher.createBatcher({
    backgroundColor: [255, 255, 0, 255],
    maxQuadPerSceen: 200,
    customCamera: false,
    bloom: { active: false, str: 0 },
    loadTextures: [
      { name: "boooy", url: boySprite },
      { name: "city", url: city },
      { name: "bridge", url: bridge },
    ],
  });
}

function setup() {
  GlobalStore.addToStore(
    "colors",
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255]
  );
  DogmaCore.createWorld("main");
  EntityManager.addEntityOnStart(new Sceen("city"));
  EntityManager.addEntityOnStart(new Boy());
  EntityManager.addEntityOnStart(new Sceen("bridge"));
  DogmaCore.addSystem("GenerateGUI", true);
  DogmaCore.addSystem("Animator");
  DogmaCore.addSystem("Renderer");
}
Engine.Initialize({ preload, setup });
