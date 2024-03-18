import System from "../../core/dogma/system";
import SignalStore from "../../core/modules/signals/signalStore";
import { AnimationType } from "../components/animation";
import { SpriteRendererType } from "../components/spriteRenderer";
export default class Animator extends System {
  animations!: GetComponentsList<AnimationType>;
  boyAnim!: GetExplicitComponent<AnimationType>;
  boySprite!: GetExplicitComponent<SpriteRendererType>;
  spriteRenderers!: GetComponentsList<SpriteRendererType>;
  constructor() {
    super();
  }
  onSubscribeList(): void {
    this.animations = this.getComponents("Animation");
    this.boyAnim = this.getEntityComponentByTag("Animation", "boy");
    this.boySprite = this.getEntityComponentByTag("SpriteRenderer", "boy");
    this.spriteRenderers = this.getComponents("SpriteRenderer");
  }
  onStart() {
    this.createSignals();
  }
  onUpdate() {
    this.animations.forEach((animation) => {
      const renderer = this.spriteRenderers.get(animation.entityID);
      if (!renderer || renderer?.type !== "spritesheet") return;
      animation.layerData.forEach((layer) => {
        if (!layer.isAnimate) return;
        if (
          layer.frameCounter >=
          layer.animationSpeed *
            animation.animationData[layer.state].numberOfFrames
        )
          layer.frameCounter = 0;
        layer.frameCounter++;
        if (layer.frameCounter % layer.animationSpeed !== 0) return;
        if (
          layer.frameCounter <
          layer.animationSpeed *
            animation.animationData[layer.state].numberOfFrames
        ) {
          layer.currentFrame++;
          renderer.layers[layer.renderLayerIndex].cashedCropData =
            animation.cashedAnimationData[layer.state][layer.currentFrame];
        } else {
          if (layer.stopOnAnimationFinished) {
            layer.isAnimate = false;
          } else {
            layer.currentFrame = 0;
            renderer.layers[layer.renderLayerIndex].cashedCropData =
              animation.cashedAnimationData[layer.state][layer.currentFrame];
          }
        }
      });
    });
  }
  private createSignals() {
    SignalStore.createSignal<string>("changeTop").subscribe((animationName) => {
      this.boyAnim.layerData[3].state = animationName;
    });
    SignalStore.createSignal<string>("changePants").subscribe(
      (animationName) => {
        this.boyAnim.layerData[2].state = animationName;
      }
    );
    SignalStore.createSignal<RGB>("changeTopColor").subscribe((color) => {
      this.boySprite.layers[3].tint = new Uint8ClampedArray(color);
    });
    SignalStore.createSignal<RGB>("changePantsColor").subscribe((color) => {
      this.boySprite.layers[2].tint = new Uint8ClampedArray(color);
    });
    SignalStore.createSignal<RGB>("changeShoesColor").subscribe((color) => {
      this.boySprite.layers[1].tint = new Uint8ClampedArray(color);
    });
  }
}
