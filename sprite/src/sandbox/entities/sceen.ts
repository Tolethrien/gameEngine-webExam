import Entity from "../../core/dogma/entity";

export default class Sceen extends Entity {
  constructor(image: string) {
    super();
    this.addComponent("Transform", {
      position: { x: 400, y: 300 },
      size: { height: 300, width: 400 },
    });
    this.addComponent("SpriteRenderer", {
      GPUAtlas: "TextureBatchGame",
      atlasTexture: image,
      isStatic: true,
      type: "sprite",
    });
  }
}
