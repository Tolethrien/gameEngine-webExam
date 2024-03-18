import Batcher from "../../core/aurora/urp/batcher";
import System from "../../core/dogma/system";
import { SpriteRendererType } from "../components/spriteRenderer";
import { PointLightType } from "../components/pointLight";
import { LightRoutinetType } from "../components/routine";
export default class DayNight extends System {
  routines!: GetComponentsList<LightRoutinetType>;
  stars!: GetComponentsList<SpriteRendererType>;
  darks!: GetComponentsList<SpriteRendererType>;
  sky!: GetExplicitComponent<SpriteRendererType>;
  sprites!: GetComponentsList<SpriteRendererType>;
  lights!: GetComponentsList<PointLightType>;
  frameTime: number;
  currentFrame: number;
  colors: RGB[];
  currentIndex: number;
  constructor() {
    super();
    this.colors = [
      [0.2, 0.2, 0.2], //0
      [0.1, 0.1, 0.1], //2
      [0.2, 0.2, 0.2], //4
      [0.3, 0.3, 0.3], //6
      [0.5, 0.5, 0.5], //8
      [0.7, 0.7, 0.7], //10
      [0.9, 0.9, 0.9], //12
      [0.8, 0.8, 0.7], //14
      [0.8, 0.7, 0.6], //16
      [0.7, 0.4, 0.3], //18
      [0.5, 0.3, 0.2], //20
      [0.3, 0.2, 0.2], //22
    ];
    this.currentIndex = 6;
    this.currentFrame = 0;
    this.frameTime = 60 * 2;
  }
  onSubscribeList() {
    this.stars = this.getComponentsByTag("SpriteRenderer", "star");
    this.darks = this.getComponentsByTag("SpriteRenderer", "dark");
    this.sky = this.getExplicitComponentByTag("SpriteRenderer", "sky");
    this.sprites = this.getComponents("SpriteRenderer");
    this.lights = this.getComponents("PointLight");
    this.routines = this.getComponents("LightRoutine");
  }

  onUpdate() {
    let progress = 0;
    if (this.currentFrame < this.frameTime) {
      progress = this.currentFrame / (this.frameTime - 1);
      this.currentFrame++;
      Batcher.setGlobalColorCorrection(this.interpoleteColor(progress));
      this.convertToNight();
    } else {
      this.currentFrame = 0;
      this.currentIndex = (this.currentIndex + 1) % this.colors.length;
      this.manageLights();
    }
  }
  manageLights() {
    this.routines.forEach((routine) => {
      if (this.currentIndex === routine.lightOn) {
        this.lights.get(routine.entityID)!.isLit = true;
        const sprite = this.sprites.get(routine.entityID);
        if (sprite?.entityTags.includes("timeSprite")) {
          sprite.layers[0].alpha = 100;
        }
      } else if (this.currentIndex === routine.lightOff) {
        this.lights.get(routine.entityID)!.isLit = false;
        const sprite = this.sprites.get(routine.entityID);
        if (sprite?.entityTags.includes("timeSprite")) {
          sprite.layers[0].alpha = 0;
        }
      }
    });
  }
  private convertToNight() {
    const frameProgress =
      (this.currentIndex * this.frameTime + this.currentFrame) /
      (this.colors.length * this.frameTime);
    const alpha = 255 - 255 * Math.cos(frameProgress * Math.PI - Math.PI / 2);
    //show start
    this.stars.forEach((star) => {
      star.layers[0].alpha = Math.round(alpha);
      this.lights.get(star.entityID)!.intencity = alpha;
    });
    //tint sky
    this.sky.layers[0].tint = new Uint8ClampedArray([
      0 - alpha,
      204 - alpha,
      255 - alpha,
    ]);
    //disapear horizon
    this.darks.forEach((sprite) => {
      sprite.layers[0].alpha = Math.round(255 - alpha + 20);
    });
  }
  private interpoleteColor(progress: number): RGB {
    const colorA = this.colors[this.currentIndex];
    const colorB = this.colors[(this.currentIndex + 1) % this.colors.length];
    const r = colorA[0] + (colorB[0] - colorA[0]) * progress;
    const g = colorA[1] + (colorB[1] - colorA[1]) * progress;
    const b = colorA[2] + (colorB[2] - colorA[2]) * progress;
    return [r, g, b];
  }
}
