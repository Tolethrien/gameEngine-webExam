import SignalStore from "../../core/modules/signals/signalStore";
import NaviNode from "../../core/navigpu/node";
import Button from "./button";

export default class TopPicker extends NaviNode {
  buttonShirt: Button;
  buttonHoodie: Button;
  constructor(node: NaviNodeProps) {
    super(node);
    this.setPosition = { x: 0, y: 0 };

    this.setSize = { width: 18, height: 26 };
    this.setStyle = {
      backgroundColor: [100, 100, 100],
      alpha: 180,
      fontFace: "roboto",
    };
    this.addChild("NaviDiv", {
      position: { x: this.getPosition.x, y: this.getPosition.y + 1 },
      size: { width: 18, height: 5 },
      color: [250, 0, 250],
      alpha: 50,
    });
    this.addChild("NaviText", {
      position: { x: this.getPosition.x + 2, y: this.getPosition.y + 2 },
      color: [250, 250, 250],
      text: "Top Style",
      fontSize: 26,
    });
    this.buttonShirt = this.addChild("Button", {
      position: {
        x: this.getPosition.x + 3,
        y: this.getPosition.y + 7,
      },
      text: "Shirt",
      scale: 2,
      callback: () => this.changeTop("shirt"),
    });
    this.buttonShirt.setActive(false);
    this.buttonHoodie = this.addChild("Button", {
      position: {
        x: this.getPosition.x + 3,
        y: this.getPosition.y + 12.1,
      },
      text: "Hoodie",
      scale: 2,
      callback: () => this.changeTop("hoodie"),
    });
    this.buttonHoodie.setActive(true);
    this.addChild("ColorPicker", {
      position: { x: this.getPosition.x + 1, y: this.getPosition.y + 18 },
      signalName: "changeTopColor",
      firstColor: 3,
    });
  }
  changeTop(data: "shirt" | "hoodie") {
    if (data === "shirt") {
      this.buttonShirt.setActive(true);
      this.buttonHoodie.setActive(false);
    } else {
      this.buttonShirt.setActive(false);
      this.buttonHoodie.setActive(true);
    }
    SignalStore.getSignal("changeTop")?.emit(data);
  }
}
