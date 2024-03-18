import CoreComponent from "../core/dogma/abstracts/coreComponent";
import CoreSystem from "../core/dogma/abstracts/coreSystem";
import NaviImg from "../core/navigpu/elements/naviImg";
import NaviText from "../core/navigpu/elements/naviText";
import Transform from "./components/transform";
import Renderer from "./systems/renderer";
import SpriteRenderer from "./components/spriteRenderer";
import Animation from "./components/animation";
import IndieRigidBody from "./components/indieRigidBody";
import Animator from "./systems/animator";
import IndiePhysics from "./systems/indiePhysics";
import KeyInputs from "./systems/keyInputs";
import TextRenderer from "./components/textRenderert";

export const avalibleComponents = {
  CoreComponent, // required
  Transform,
  Animation,
  SpriteRenderer,
  IndieRigidBody,
  TextRenderer,
} as const;
export const avalibleSystems = {
  CoreSystem, // required
  Renderer,
  Animator,
  IndiePhysics,
  KeyInputs,
} as const;
export const NaviUINodes = {
  NaviImg,
  NaviText,
};
