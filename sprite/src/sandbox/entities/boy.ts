import Entity from "../../core/dogma/entity";
import GlobalStore from "../../core/modules/globalStore/globalStore";

export default class Boy extends Entity {
  constructor() {
    super();
    this.addTag("boy");
    this.addComponent("Transform", {
      position: { x: 400, y: 460 },
      size: { height: 130 / 2, width: 72 / 2 },
    });
    this.addComponent("SpriteRenderer", {
      GPUAtlas: "TextureBatchGame",
      atlasTexture: "boooy",
      isStatic: true,
      type: "spritesheet",
      layers: [
        //body
        {
          crop: { x: 0, y: 130 * 0 },
          cropSize: { height: 130, width: 72 },
          alpha: 255,
          bloom: 0,
        },
        //shoes
        {
          crop: { x: 0, y: 130 * 1 },
          cropSize: { height: 130, width: 72 },
          alpha: 255,
          bloom: 0,
          tint: GlobalStore.getFromStore<RGB[]>("colors")[0],
        },
        //pants
        {
          crop: { x: 0, y: 130 * 3 },
          cropSize: { height: 130, width: 72 },
          alpha: 255,
          bloom: 0,
          tint: GlobalStore.getFromStore<RGB[]>("colors")[2],
        },
        //top
        {
          crop: { x: 0, y: 130 * 4 },
          cropSize: { height: 130, width: 72 },
          alpha: 255,
          bloom: 0,
          tint: GlobalStore.getFromStore<RGB[]>("colors")[3],
        },
      ],
    });
    const ANIM_SPEED = 8;
    this.addComponent("Animation", {
      animationData: {
        char: { numberOfFrames: 6, rowInSpritesheet: 1 },
        shoe: { numberOfFrames: 6, rowInSpritesheet: 2 },
        joggers: { numberOfFrames: 6, rowInSpritesheet: 3 },
        shorts: { numberOfFrames: 6, rowInSpritesheet: 4 },
        shirt: { numberOfFrames: 6, rowInSpritesheet: 5 },
        hoodie: { numberOfFrames: 6, rowInSpritesheet: 6 },
      },
      cropSize: { width: 72, height: 130 },
      layers: [
        {
          animationSpeed: ANIM_SPEED,
          renderLayerIndex: 0,
          state: "char",
          isAnimate: true,
          stopOnAnimationFinished: false,
        },
        {
          animationSpeed: ANIM_SPEED,
          renderLayerIndex: 1,
          state: "shoe",
          isAnimate: true,
          stopOnAnimationFinished: false,
        },
        {
          animationSpeed: ANIM_SPEED,
          renderLayerIndex: 2,
          state: "shorts",
          isAnimate: true,
          stopOnAnimationFinished: false,
        },
        {
          animationSpeed: ANIM_SPEED,
          renderLayerIndex: 3,
          state: "hoodie",
          isAnimate: true,
          stopOnAnimationFinished: false,
        },
      ],
      spriteSheet: { gpuAtlas: "TextureBatchGame", atlasIndex: 1 },
    });
  }
}
