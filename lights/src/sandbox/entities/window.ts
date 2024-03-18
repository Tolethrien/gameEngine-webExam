import { LightsTypes } from "../../core/aurora/urp/pipelines/lightsPipeline";
import Entity from "../../core/dogma/entity";
import { randomIndex } from "../../core/utils/utils";
import { DayTime } from "../components/routine";
interface HouseWindowProps {
  position: Position2D;
  size: Size2D;
  spriteColor?: RGB;
  lightSize: Size2D;
  lightType?: LightsTypes;
  lightColor?: RGB;
  lightOffset?: Position2D;
}
export default class HouseWindow extends Entity {
  private clockOn: DayTime[] = ["20:00", "22:00", "0:00", "2:00"];
  private clockOff: DayTime[] = ["4:00", "6:00", "8:00"];
  constructor({
    position,
    size,
    lightSize,
    lightType = "radial",
    spriteColor = [255, 255, 255],
    lightColor = [255, 255, 255],
    lightOffset = { x: 0, y: 0 },
  }: HouseWindowProps) {
    super();
    this.addTag("timeSprite");
    this.addComponent("Transform", {
      position: position,
      size: size,
    });
    this.addComponent("SpriteRenderer", {
      type: "shape",
      isStatic: true,
      bloom: 0,
      alpha: 0,
      tint: spriteColor,
    });
    this.addComponent("PointLight", {
      color: lightColor,
      intencity: 255,
      size: lightSize,
      type: lightType,
      isLit: false,
      offset: lightOffset,
    });
    this.addComponent("LightRoutine", {
      lightOff: this.clockOff[randomIndex(this.clockOff)],
      lightOn: this.clockOn[randomIndex(this.clockOn)],
    });
  }
}
