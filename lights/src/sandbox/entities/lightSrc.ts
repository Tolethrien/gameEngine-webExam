import { LightsTypes } from "../../core/aurora/urp/pipelines/lightsPipeline";
import Entity from "../../core/dogma/entity";
import { DayTime } from "../components/routine";
interface LightSrcProps {
  position: Position2D;
  type?: LightsTypes;
  color: RGB;
  size: Size2D;
  intencity?: number;
  lightOn?: DayTime;
  lightOff?: DayTime;
  useRoutine?: boolean;
}
export default class LightSrc extends Entity {
  constructor({
    position,
    color,
    size,
    intencity = 255,
    type = "radial",
    lightOff = "6:00",
    lightOn = "20:00",
    useRoutine = true,
  }: LightSrcProps) {
    super();
    this.addComponent("Transform", {
      position: position,
      size: { width: 1, height: 1 },
    });
    this.addComponent("PointLight", {
      color: color,
      intencity: intencity,
      size: size,
      type: type,
      isLit: !useRoutine,
    });
    if (useRoutine) this.addComponent("LightRoutine", { lightOff, lightOn });
  }
}
