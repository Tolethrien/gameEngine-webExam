import CoreComponent from "../core/dogma/abstracts/coreComponent";
import CoreSystem from "../core/dogma/abstracts/coreSystem";
import NaviImg from "../core/navigpu/elements/naviImg";
import NaviText from "../core/navigpu/elements/naviText";
import Transform from "./components/transform";
import SpriteRenderer from "./components/spriteRenderer";
import Animation from "./components/animation";
import Animator from "./systems/animator";
import Renderer from "./systems/renderer";
import GenerateGUI from "./systems/generateGUI";
import TopPicker from "./ui/topPicker";
import PantsPicker from "./ui/pantsPicker";
import Button from "./ui/button";
import ColorBox from "./ui/colorBox";
import ColorPicker from "./ui/colorPicker";
import ShoesPicker from "./ui/shoesPicker";
import NaviDiv from "../core/navigpu/elements/div";

//NOTE: required at least 1 component and system in list, after that you can remove Cores
export const avalibleComponents = {
  CoreComponent,
  Transform,
  SpriteRenderer,
  Animation,
} as const;
export const avalibleSystems = {
  CoreSystem, // required
  Animator,
  Renderer,
  GenerateGUI,
} as const;
export const NaviUINodes = {
  NaviImg,
  NaviText,
  TopPicker,
  Button,
  ColorBox,
  ColorPicker,
  PantsPicker,
  ShoesPicker,
  NaviDiv,
};
