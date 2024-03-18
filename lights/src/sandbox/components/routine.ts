import Component from "../../core/dogma/component";
export type DayTime = keyof typeof hours;
const hours = {
  "0:00": 0,
  "2:00": 1,
  "4:00": 2,
  "6:00": 3,
  "8:00": 4,
  "10:00": 5,
  "12:00": 6,
  "14:00": 7,
  "16:00": 8,
  "18:00": 9,
  "20:00": 10,
  "22:00": 11,
};
export interface LightRoutineProps {
  lightOn: DayTime;
  lightOff: DayTime;
}

export interface LightRoutinetType extends LightRoutine {}
export default class LightRoutine extends Component {
  lightOn: number;
  lightOff: number;
  constructor(
    componentProps: ComponentProps,
    { lightOff, lightOn }: LightRoutineProps
  ) {
    super(componentProps);
    this.lightOff = hours[lightOff];
    this.lightOn = hours[lightOn];
  }
}
