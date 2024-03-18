import Entity from "../../core/dogma/entity";

export default class Player extends Entity {
  constructor() {
    super();
    this.addTag("player");
    this.addComponent("SpriteRenderer", {
      type: "spritesheet",
      atlasTexture: "characters",
      GPUAtlas: "TextureBatchGame",
      isStatic: false,
      layers: [
        { crop: { x: 0, y: 0 }, cropSize: { width: 32, height: 32 }, bloom: 1 },
      ],
    });
    this.addComponent("Animation", {
      cropSize: { width: 32, height: 32 },
      spriteSheet: { gpuAtlas: "TextureBatchGame", atlasIndex: 1 },
      animationData: {
        top: { numberOfFrames: 6, rowInSpritesheet: 4 },
        down: { numberOfFrames: 6, rowInSpritesheet: 1 },
        left: { numberOfFrames: 6, rowInSpritesheet: 2 },
        right: { numberOfFrames: 6, rowInSpritesheet: 3 },
      },
      layers: [
        {
          renderLayerIndex: 0,
          state: "down",
          animationSpeed: 8,
          isAnimate: true,
          stopOnAnimationFinished: false,
        },
      ],
    });

    this.addComponent("Transform", {
      position: { x: 215, y: 215 },
      size: { width: 32, height: 32 },
      rotation: 0,
    });
    this.addComponent("IndieRigidBody", {
      bodyType: "dynamic",
      mass: 80,
      friction: 1,
      speed: 240,
      offset: { x: 0, y: 10, w: 24, h: 8 },
    });
  }
}
