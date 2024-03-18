import System from "../../core/dogma/system";
import Vec2D from "../../core/math/vec2D";
import InputManager from "../../core/modules/inputManager/inputManager";
import { AnimationType } from "../components/animation";
import { IndieRigidBodyType } from "../components/indieRigidBody";
import { TransformType } from "../components/transform";
export default class KeyInputs extends System {
  playerRigid!: GetExplicitComponent<IndieRigidBodyType>;
  playerAnim!: GetExplicitComponent<AnimationType>;
  pos!: GetExplicitComponent<TransformType>;
  constructor() {
    super();
  }
  onSubscribeList(): void {
    this.playerRigid = this.getEntityComponentByTag("IndieRigidBody", "player");
    this.playerAnim = this.getEntityComponentByTag("Animation", "player");
    this.pos = this.getEntityComponentByTag("Transform", "player");
  }
  onUpdate() {
    let dirX = 0;
    let dirY = 0;
    if (InputManager.isKeyHold("w")) {
      this.playerAnim.layerData[0].state = "top";
      dirY--;
    } else if (InputManager.isKeyHold("s")) {
      this.playerAnim.layerData[0].state = "down";
      dirY++;
    }
    if (InputManager.isKeyHold("a")) {
      this.playerAnim.layerData[0].state = "left";
      dirX--;
    } else if (InputManager.isKeyHold("d")) {
      this.playerAnim.layerData[0].state = "right";
      dirX++;
    }
    this.playerRigid.velocity = new Vec2D([dirX, dirY]);
    const forcedirection = new Vec2D([dirX, dirY]).normalize();
    const forceVector = forcedirection.multiply(this.playerRigid.newtons);
    this.playerRigid.force = forceVector;
  }
}
