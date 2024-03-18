import SignalStore from "../../core/modules/signals/signalStore";
import NaviNode from "../../core/navigpu/node";
import Button from "./button";

export default class PantsPicker extends NaviNode {
  buttonJogg: Button;
  buttonShorts: Button;
  constructor(node: NaviNodeProps) {
    super(node);
    this.setPosition = { x: 0, y: 26 };
    this.setSize = { width: 18, height: 25 };
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
      position: { x: this.getPosition.x + 0.5, y: this.getPosition.y + 1 },
      text: "Pants Style",
      fontSize: 26,
    });
    this.buttonShorts = this.addChild("Button", {
      position: {
        x: this.getPosition.x + 3,
        y: this.getPosition.y + 6,
      },
      text: "Shorts",
      scale: 2,
      callback: () => this.changePants("shorts"),
    });
    this.buttonShorts.setActive(true);
    this.buttonJogg = this.addChild("Button", {
      position: {
        x: this.getPosition.x + 3,
        y: this.getPosition.y + 11.1,
      },
      text: "Joggers",
      scale: 2,
      callback: () => this.changePants("joggers"),
    });
    this.buttonJogg.setActive(false);

    this.addChild("ColorPicker", {
      position: { x: this.getPosition.x + 1, y: this.getPosition.y + 17 },
      signalName: "changePantsColor",
      firstColor: 2,
    });
  }
  changePants(data: "shorts" | "joggers") {
    if (data === "joggers") {
      this.buttonJogg.setActive(true);
      this.buttonShorts.setActive(false);
    } else {
      this.buttonJogg.setActive(false);
      this.buttonShorts.setActive(true);
    }
    SignalStore.getSignal("changePants")?.emit(data);
  }
}
