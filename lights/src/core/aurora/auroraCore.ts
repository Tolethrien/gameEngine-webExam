import { showErrorScreen } from "../../exampleStuff/loading";
import AuroraTexture from "./auroraTexture";

export interface sharedDataSchema {
  textureEnum: { [index: string]: number };
}
interface CoreOptions {
  alphaChannelOnCanvas?: "opaque" | "premultiplied";
  powerPreference?: "high-performance" | "low-power";
  useTextureStore?: boolean;
}
export default class Aurora {
  public static device: GPUDevice;
  public static context: GPUCanvasContext;
  public static canvas: HTMLCanvasElement;

  public static async initialize(
    canvas: HTMLCanvasElement,
    options?: CoreOptions
  ) {
    const context = canvas.getContext("webgpu")!;
    if (!navigator.gpu) {
      showErrorScreen("WebGPU not supported on this browser.");
      throw new Error("WebGPU not supported on this browser.");
    }
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: options?.powerPreference ?? "low-power",
    });
    if (!adapter) {
      showErrorScreen("No appropriate GPUAdapter found.");
      throw new Error("No appropriate GPUAdapter found.");
    }
    // Experimental StorageTexture
    // requiredFeatures: [
    // "chromium-experimental-read-write-storage-texture",
    // "bgra8unorm-storage",
    // ],
    const device = await adapter.requestDevice({
      requiredFeatures: ["bgra8unorm-storage"],
    });
    context.configure({
      device: device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: options?.alphaChannelOnCanvas ?? "opaque",
    });

    if (options?.useTextureStore === false) {
      AuroraTexture.useStore = false;
    }
    Aurora.canvas = canvas;
    Aurora.context = context;
    Aurora.device = device;
  }
  public static resizeCanvas(width: number, height: number) {
    Aurora.canvas.width = width;
    Aurora.canvas.height = height;
  }
}
