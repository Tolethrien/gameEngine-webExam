import { LightsTypes } from "../../core/aurora/urp/pipelines/lightsPipeline";
import Component from "../../core/dogma/component";
import { clamp } from "../../core/math/math";
//IDEA: swiatlo mogloby miec wysokosc od ziemi i wtedy jesli jest jej blisko zostawia cien(łune)
// na ziemi w kolorze swiatla

export interface PointLightProps {
  type: LightsTypes;
  intencity?: number;
  size: { width: number; height: number };
  color: [number, number, number];
  isLit?: boolean;
  offset?: Position2D;
}
export interface PointLightType extends PointLight {}
export default class PointLight extends Component {
  typeOfLight: PointLightProps["type"];
  color: PointLightProps["color"];
  intencity: number;
  size: PointLightProps["size"];
  isLit: boolean;
  offset: Position2D;
  constructor(
    componentProps: ComponentProps,
    {
      color,
      intencity = 255,
      size,
      type,
      isLit = false,
      offset = { x: 0, y: 0 },
    }: PointLightProps
  ) {
    super(componentProps);
    this.color = color;
    this.intencity = clamp(intencity, 0, 255);
    this.typeOfLight = type;
    this.size = size;
    this.isLit = isLit;
    this.offset = offset;
  }
}
