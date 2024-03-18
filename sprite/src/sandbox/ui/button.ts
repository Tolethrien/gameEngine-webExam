import NaviNode from "../../core/navigpu/node";
interface ButtonProps {
  text: string;
  position: Position2D;
  scale: number;
  callback: () => void;
}
export default class Button extends NaviNode {
  constructor(
    node: NaviNodeProps,
    { text, position, scale, callback }: ButtonProps
  ) {
    super(node);
    this.setPosition = position;
    this.setSize = { width: 6 * scale, height: 2.5 * scale };
    this.setStyle = {
      backgroundColor: [250, 250, 250],
      alpha: 255,
    };
    this.addChild("NaviText", {
      color: [0, 0, 0],
      position: { x: this.getPosition.x + 1, y: this.getPosition.y + 1.5 },
      text: text,
      fontSize: 10 * scale,
    });
    this.registerMouseEvent({
      leftClick: () => callback(),
    });
  }
  setActive(active: boolean) {
    if (active) this.setStyle = { backgroundColor: [0, 150, 0] };
    else {
      this.setStyle = {
        backgroundColor: [170, 170, 170],
      };
    }
  }
}
