import Entity from "../../core/dogma/entity";

export default class Sceen extends Entity {
  constructor(public sprite: string, public tag?: string) {
    super();
    if (tag) this.addTag(tag);
    this.addComponent("Transform", {
      position: { x: 400, y: 300 },
      size: { width: 400, height: 300 },
    });

    this.addComponent("SpriteRenderer", {
      type: "sprite",
      atlasTexture: sprite,
      GPUAtlas: "TextureBatchGame",
      isStatic: true,
    });
  }
}
