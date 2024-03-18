import NaviNode from "../../core/navigpu/node";
interface ButtonProps {
  position: Position2D;
  color: RGB;
}
export default class ColorBox extends NaviNode {
  constructor(node: NaviNodeProps, { position, color }: ButtonProps) {
    super(node);
    this.setPosition = position;
    this.setSize = { width: 3, height: 3.5 };
    this.setStyle = {
      backgroundColor: color,
      alpha: 255,
    };
  }
  setActive(state: boolean) {
    const pos = this.getPosition;
    this.setPosition = { x: pos.x, y: pos.y + (state === true ? -2 : 2) };
  }
}
