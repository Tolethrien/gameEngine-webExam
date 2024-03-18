import AuroraBatcher from "../../core/aurora/urp/batcher";
import Draw from "../../core/aurora/urp/draw";
import System from "../../core/dogma/system";
import NaviCore from "../../core/navigpu/core";
import { SpriteRendererType } from "../components/spriteRenderer";
import { TransformType } from "../components/transform";
import { PointLightType } from "../components/pointLight";
export default class Renderer extends System {
  transforms!: GetComponentsList<TransformType>;
  spriteRenderers!: GetComponentsList<SpriteRendererType>;
  lights!: GetComponentsList<PointLightType>;
  constructor() {
    super();
  }
  onSubscribeList() {
    this.spriteRenderers = this.getComponents("SpriteRenderer");
    this.lights = this.getComponents("PointLight");
    this.transforms = this.getComponents("Transform");
  }

  onUpdate() {
    AuroraBatcher.startBatch();

    this.spriteRenderers.forEach((renderer) => {
      const transform = this.transforms.get(renderer.entityID)!;
      renderer.layers.forEach((layer, index) => {
        const { h, w, x, y } = this.getDataFromCash(renderer, index, transform);
        Draw.Quad({
          position: {
            x: x,
            y: y,
          },
          size: {
            width: w,
            height: h,
          },
          textureToUse: layer.textureIndex,
          tint: layer.tint,
          alpha: layer.alpha,
          crop: layer.cashedCropData,
          isTexture: layer.isTexture,
          bloom: layer.bloom,
        });
      });
    });
    this.lights.forEach((light) => {
      if (!light.isLit) return;
      const transform = this.transforms.get(light.entityID)!;
      Draw.Light({
        intensity: light.intencity,
        position: {
          x: transform.position.get.x + light.offset.x,
          y: transform.position.get.y + light.offset.y,
        },
        size: light.size,
        tint: light.color,
        type: light.typeOfLight,
      });
    });
    NaviCore.renderGUI();
    AuroraBatcher.endBatch();
  }

  private getDataFromCash(
    renderer: SpriteRendererType,
    layerIndex: number,
    transform: TransformType
  ) {
    const layer = renderer.layers[layerIndex];
    if (layer.cashedOffsetData) return layer.cashedOffsetData;

    if (!layer.offset) {
      if (renderer.isStatic)
        renderer.layers[layerIndex].cashedOffsetData = {
          x: transform.position.get.x,
          y: transform.position.get.y,
          w: transform.size.get.x,
          h: transform.size.get.y,
        };
      return {
        x: transform.position.get.x,
        y: transform.position.get.y,
        w: transform.size.get.x,
        h: transform.size.get.y,
      };
    }

    const data = {
      x: transform.position.get.x + layer.offset[0],
      y: transform.position.get.y + layer.offset[1],
      w: layer.offset[2],
      h: layer.offset[3],
    };
    if (renderer.isStatic) renderer.layers[layerIndex].cashedOffsetData = data;

    return data;
  }
}
