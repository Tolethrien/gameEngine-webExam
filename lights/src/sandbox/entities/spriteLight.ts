import Entity from "../../core/dogma/entity";

export default class WallLamp extends Entity {
  constructor() {
    super();
    this.addTag("timeSprite");
    this.addComponent("Transform", {
      position: { x: 400, y: 300 },
      size: { width: 400, height: 300 },
    });
    this.addComponent("SpriteRenderer", {
      type: "sprite",
      isStatic: true,
      bloom: 0,
      alpha: 0,
      atlasTexture: "lamp",
      GPUAtlas: "TextureBatchGame",
      tint: [255, 255, 255],
    });
    this.addComponent("PointLight", {
      color: [255, 255, 255],
      intencity: 255,
      size: { height: 300, width: 100 },
      type: "radial",
      isLit: false,
      offset: { x: 160, y: 30 },
    });
    this.addComponent("LightRoutine", { lightOff: "8:00", lightOn: "20:00" });
  }
}
