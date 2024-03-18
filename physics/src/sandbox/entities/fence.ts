import Entity from "../../core/dogma/entity";
interface FenceProps {
  position: { x: number; y: number };
}
export default class Fence extends Entity {
  constructor({ position }: FenceProps) {
    super();
    this.addComponent("SpriteRenderer", {
      type: "sprite",
      tint: [128, 56, 231],
      isStatic: true,
      atlasTexture: "fence",
      GPUAtlas: "TextureBatchGame",
    });

    this.addComponent("Transform", {
      position: position,
      size: { width: 200, height: 30 },
      rotation: 0,
    });
    this.addComponent("IndieRigidBody", {
      bodyType: "static",
      offset: { x: 0, y: 12, w: 200, h: 15 },
    });
  }
}
