import AuroraBatcher from "../../core/aurora/urp/batcher";
import Draw from "../../core/aurora/urp/draw";
import System from "../../core/dogma/system";
import { IndieRigidBodyType } from "../components/indieRigidBody";
import { SpriteRendererType } from "../components/spriteRenderer";
import { TextRendererType } from "../components/textRenderert";
import { TransformType } from "../components/transform";
export default class Renderer extends System {
  transforms!: GetComponentsList<TransformType>;
  spriteRenderers!: GetComponentsList<SpriteRendererType>;
  ground!: GetExplicitComponent<SpriteRendererType>;
  phys!: GetComponentsList<IndieRigidBodyType>;
  texts!: GetComponentsList<TextRendererType>;
  constructor() {
    super();
  }
  onSubscribeList() {
    this.spriteRenderers = this.getComponents("SpriteRenderer");
    this.ground = this.getEntityComponentByTag("SpriteRenderer", "ground");
    this.phys = this.getComponents("IndieRigidBody");
    this.transforms = this.getComponents("Transform");
    this.texts = this.getComponents("TextRenderer");
  }

  onUpdate() {
    AuroraBatcher.startBatch();
    const { position: groundPos, size: groundSize } = this.transforms.get(
      this.ground.entityID
    )!;

    Draw.Quad({
      position: groundPos,
      size: { width: groundSize.x, height: groundSize.y },
      textureToUse: this.ground.layers[0].textureIndex,
      tint: this.ground.layers[0].tint,
      alpha: this.ground.layers[0].alpha,
      crop: this.ground.layers[0].cashedCropData,
      isTexture: this.ground.layers[0].isTexture,
      bloom: this.ground.layers[0].bloom,
    });
    Array.from(this.spriteRenderers.values())
      .sort(this.sortByPositionY)
      .forEach((renderer) => {
        if (renderer.entityTags.includes("ground")) return;
        const textRenderer = this.texts.get(renderer.entityID);
        const transform = this.transforms.get(renderer.entityID)!;

        renderer.layers.forEach((layer, index) => {
          const { h, w, x, y } = this.getDataFromCash(
            renderer,
            index,
            transform
          );
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
        if (textRenderer) {
          Draw.Text({
            alpha: textRenderer.alpha,
            bloom: textRenderer.bloom,
            color: textRenderer.color,
            fontFace: textRenderer.fontFace,
            fontSize: textRenderer.fontSize,
            position: {
              x: transform.position.x - textRenderer.offset * 5,
              y: transform.position.y,
            },
            text: textRenderer.text,
          });
        }
      });
    AuroraBatcher.endBatch();
  }
  private sortByPositionY = (a: SpriteRendererType, b: SpriteRendererType) => {
    const transformA = this.transforms.get(a.entityID)!;
    const transformB = this.transforms.get(b.entityID)!;
    return (
      transformA.position.get.y +
      transformA.size.get.y -
      (transformB.position.get.y + transformB.size.get.y)
    );
  };
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
