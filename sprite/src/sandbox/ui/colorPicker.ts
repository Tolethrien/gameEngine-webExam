import GlobalStore from "../../core/modules/globalStore/globalStore";
import SignalStore from "../../core/modules/signals/signalStore";
import NaviCore from "../../core/navigpu/core";
import NaviNode from "../../core/navigpu/node";
import ColorBox from "./colorBox";
interface ColorPickProps {
  position: Position2D;
  signalName: string;
  firstColor: number;
}

export default class ColorPicker extends NaviNode {
  currentColorBoxId: string;
  constructor(
    node: NaviNodeProps,
    { position, signalName, firstColor }: ColorPickProps
  ) {
    super(node);
    this.setPosition = position;
    this.setSize = { width: 16, height: 6 };
    this.setStyle = {
      backgroundColor: [250, 250, 250],
      alpha: 0,
    };
    for (let i = 0; i < 5; i++) {
      this.addChild("ColorBox", {
        position: {
          x: this.getPosition.x + i * 3.2,
          y: this.getPosition.y + 2,
        },
        color: GlobalStore.getFromStore<RGB[]>("colors")[i],
      });
    }

    this.currentColorBoxId = this.setFirstBox(firstColor);
    this.registerMouseEvent({
      leftClick: () => {
        const node = NaviCore.getClickedElement();
        if (node && node !== this && node.getID !== this.currentColorBoxId) {
          (node as ColorBox).setActive(true);
          (this.getChildByID(this.currentColorBoxId) as ColorBox).setActive(
            false
          );
          SignalStore.getSignal<RGB>(signalName)?.emit(
            node.getStyle.backgroundColor as RGB
          );
          this.currentColorBoxId = node.getID;
        }
      },
    });
  }
  private setFirstBox(index: number) {
    const node = this.getChildByIndex(index) as ColorBox;
    node.setActive(true);
    return node.getID;
  }
}
