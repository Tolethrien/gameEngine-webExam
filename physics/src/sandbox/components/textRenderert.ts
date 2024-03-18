import Component from "../../core/dogma/component";
interface TextRendererProps {
  fontFace: "roboto" | "MedievalSharp";
  bloom?: boolean;
  alpha?: number;
  color?: RGB;
  fontSize: number;
  text: string;
  offset?: number;
}
export interface TextRendererType extends TextRenderer {}
export default class TextRenderer extends Component {
  fontFace: string;
  bloom: number;
  alpha: number;
  color: Uint8ClampedArray;
  fontSize: number;
  text: string;
  offset: number;
  constructor(componentProps: ComponentProps, props: TextRendererProps) {
    super(componentProps);
    this.fontFace = props.fontFace;
    this.bloom = props.bloom ? 1 : 0;
    this.alpha = props.alpha ?? 255;
    this.color = props.color
      ? new Uint8ClampedArray(props.color)
      : new Uint8ClampedArray([0, 0, 0]);
    this.fontSize = props.fontSize;
    this.text = props.text;
    this.offset = props.offset ?? 0;
  }
}
