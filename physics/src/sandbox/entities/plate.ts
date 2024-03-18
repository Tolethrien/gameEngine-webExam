import Entity from "../../core/dogma/entity";
interface PlateProps {
  position: { x: number; y: number };
  mass: number;
  friction: number;
  pushForce?: { x: number; y: number };
}
export default class Plate extends Entity {
  constructor({ friction, mass, position, pushForce }: PlateProps) {
    super();
    this.addTag("plate");
    this.addComponent("SpriteRenderer", {
      type: "spritesheet",
      atlasTexture: "tilemap",
      GPUAtlas: "TextureBatchGame",
      isStatic: false,
      layers: [
        { crop: { x: 870, y: 450 }, cropSize: { width: 64, height: 64 } },
      ],
    });

    this.addComponent("Transform", {
      position: position,
      size: { width: 32, height: 32 },
      rotation: 0,
    });
    this.addComponent("IndieRigidBody", {
      bodyType: "dynamic",
      mass: mass,
      friction: friction,
      speed: 240,
      offset: { x: -6, y: -8, w: 26, h: 25 },
      pushForce: pushForce,
    });
    const text = `${mass / 10}KG`;
    this.addComponent("TextRenderer", {
      fontFace: "MedievalSharp",
      fontSize: 14,
      text: text,
      alpha: 255,
      color: [212, 175, 55],
      offset: text.length,
    });
  }
}
