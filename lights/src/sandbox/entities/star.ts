import Entity from "../../core/dogma/entity";
interface LightSrcProps {
  position: Position2D;
}
export default class Star extends Entity {
  constructor({ position }: LightSrcProps) {
    super();
    this.addTag("star");
    this.addComponent("Transform", {
      position: position,
      size: { width: 1, height: 1 },
    });
    this.addComponent("SpriteRenderer", {
      type: "shape",
      isStatic: true,
      bloom: 0,
      tint: [255, 255, 0],
    });
    this.addComponent("PointLight", {
      color: [255, 255, 0],
      intencity: 255,
      size: { width: 5, height: 5 },
      type: "radial",
      isLit: true,
    });
  }
}
