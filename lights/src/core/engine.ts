import Time from "./modules/time/time";
import Aurora from "./aurora/auroraCore";
import "../css/index.css";
import InputManager from "./modules/inputManager/inputManager";
import DogmaCore from "./dogma/core";
import NaviBody from "./navigpu/elements/body";
import NaviCore from "./navigpu/core";
import { canvasOn, loadingScrenOn } from "../exampleStuff/loading";
export const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
canvas.id = "gameWindow";
interface EngineConfig {
  preload: () => Promise<unknown>;
  setup: () => void;
}

export default class Engine {
  private static isInitialized = false;
  public static async Initialize({ preload, setup }: EngineConfig) {
    loadingScrenOn();
    if (Engine.isInitialized)
      throw new Error(
        "Engine already Initialize,you can only have one instance of engine"
      );
    await Aurora.initialize(canvas); // needs to be before preload
    await preload();
    canvasOn();
    Engine.setFirstAuroraFrame();
    InputManager.initialize();
    NaviCore.initialize(new NaviBody({ parent: undefined, layer: 0 }));
    setup();
    DogmaCore.systemsOnListCreation();
    DogmaCore.systemsOnStart();
    Engine.isInitialized = true;
    Engine.loop(0);
  }
  private static loop(timestamp: number) {
    Time.calculateTimeStamp(timestamp);
    DogmaCore.systemsOnUpdate();
    requestAnimationFrame(Engine.loop);
  }

  private static setFirstAuroraFrame() {
    const encoder = Aurora.device.createCommandEncoder();
    const commandPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: Aurora.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: [1, 0, 0, 1],
        },
      ],
    });
    commandPass.end();
    Aurora.device.queue.submit([encoder.finish()]);
  }
}
