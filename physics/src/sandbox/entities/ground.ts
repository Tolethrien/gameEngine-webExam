import Entity from "../../core/dogma/entity";

export default class Ground extends Entity {
  constructor() {
    super();
    this.addTag("ground");
    this.addComponent("SpriteRenderer", {
      type: "sprite",
      tint: [128, 56, 231],
      isStatic: true,
      atlasTexture: "ground",
      GPUAtlas: "TextureBatchGame",
    });

    this.addComponent("Transform", {
      position: { x: 400, y: 350 },
      size: { width: 400, height: 350 },
      rotation: 0,
    });
  }
}
