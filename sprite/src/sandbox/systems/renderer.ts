import AuroraBatcher from "../../core/aurora/urp/batcher";
import Draw from "../../core/aurora/urp/draw";
import System from "../../core/dogma/system";
import NaviCore from "../../core/navigpu/core";
import { SpriteRendererType } from "../components/spriteRenderer";
import { TransformType } from "../components/transform";
export default class Renderer extends System {
  transforms!: GetComponentsList<TransformType>;
  spriteRenderers!: GetComponentsList<SpriteRendererType>;
  constructor() {
    super();
  }
  onSubscribeList() {
    this.spriteRenderers = this.getComponents("SpriteRenderer");
    this.transforms = this.getComponents("Transform");
  }

  onUpdate() {
    AuroraBatcher.startBatch();

    this.spriteRenderers.forEach((renderer) => {
      if (renderer.entityTags.includes("ground")) return;
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
