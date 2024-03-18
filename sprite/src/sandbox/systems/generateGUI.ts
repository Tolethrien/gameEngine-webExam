import System from "../../core/dogma/system";
import InputManager from "../../core/modules/inputManager/inputManager";
import NaviCore from "../../core/navigpu/core";
export default class GenerateGUI extends System {
  constructor() {
    super();
  }
  onStart() {
    NaviCore.Body.addChild("TopPicker");
    NaviCore.Body.addChild("PantsPicker");
    NaviCore.Body.addChild("ShoesPicker");
    InputManager.setMouseCallbacks({
      leftClick: () => NaviCore.useClickedElement("leftClick"),
    });
  }
}
