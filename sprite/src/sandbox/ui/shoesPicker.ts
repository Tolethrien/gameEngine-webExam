import NaviNode from "../../core/navigpu/node";

export default class ShoesPicker extends NaviNode {
  constructor(node: NaviNodeProps) {
    super(node);
    this.setPosition = { x: 0, y: 51 };
    this.setSize = { width: 18, height: 13 };
    this.setStyle = {
      backgroundColor: [100, 100, 100],
      alpha: 180,
      fontFace: "roboto",
    };
    this.addChild("NaviDiv", {
      position: { x: this.getPosition.x, y: this.getPosition.y },
      size: { width: 18, height: 5 },
      color: [250, 0, 250],
      alpha: 50,
    });
    this.addChild("NaviText", {
      color: [250, 250, 250],
      position: { x: this.getPosition.x + 0.1, y: this.getPosition.y + 1 },
      text: "Shoes Color",
      fontSize: 26,
    });

    this.addChild("ColorPicker", {
      position: { x: this.getPosition.x + 1, y: this.getPosition.y + 6 },
      signalName: "changeShoesColor",
      firstColor: 0,
    });
  }
}
