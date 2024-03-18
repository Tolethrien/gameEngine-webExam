import Entity from "../../core/dogma/entity";
interface ObstacleProps {
  position: { x: number; y: number };
  size: { width: number; height: number };
}
export default class Obstacle extends Entity {
  constructor({ position, size }: ObstacleProps) {
    super();
    this.addComponent("SpriteRenderer", {
      type: "shape",
      tint: [128, 56, 231],
      isStatic: true,
    });

    this.addComponent("Transform", {
      position: position,
      size: size,
      rotation: 0,
    });
    this.addComponent("IndieRigidBody", {
      bodyType: "static",
    });
  }
}
