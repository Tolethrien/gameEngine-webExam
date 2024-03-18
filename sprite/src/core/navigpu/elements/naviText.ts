import NaviNode from "../node";
interface NaviImgProps {
  position: Position2D;
  color: RGB;
  text: string;
  fontSize: number;
}
export default class NaviText extends NaviNode {
  constructor(
    node: NaviNodeProps,
    { color, position, text, fontSize }: NaviImgProps
  ) {
    super(node);
    this.setPosition = position;
    this.setSize = { width: 0, height: 0 };
    this.setStyle = {
      backgroundColor: color,
      alpha: 255,
      fontFace: "roboto",
      fontSize,
    };
    this.setContent = text;
    this.setTypOfNode = "Text";
  }
}
