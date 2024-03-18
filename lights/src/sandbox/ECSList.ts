import CoreComponent from "../core/dogma/abstracts/coreComponent";
import CoreSystem from "../core/dogma/abstracts/coreSystem";
import NaviImg from "../core/navigpu/elements/naviImg";
import NaviText from "../core/navigpu/elements/naviText";
import Transform from "./components/transform";
import SpriteRenderer from "./components/spriteRenderer";
import PointLight from "./components/pointLight";
import Renderer from "./systems/renderer";
import DayNight from "./systems/dayNight";
import LightRoutine from "./components/routine";
//NOTE: required at least 1 component and system in list, after that you can remove Cores
export const avalibleComponents = {
  CoreComponent,
  Transform,
  SpriteRenderer,
  PointLight,
  LightRoutine,
} as const;
export const avalibleSystems = {
  CoreSystem, // required
  Renderer,
  DayNight,
} as const;
export const NaviUINodes = {
  NaviImg,
  NaviText,
};
