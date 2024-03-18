import AuroraTexture from "../../core/aurora/auroraTexture";
import Component from "../../core/dogma/component";
import { clamp } from "../../core/math/math";
import { validateValue } from "../../core/utils/utils";

interface GeneralProps {
  alpha?: number;
  tint?: [number, number, number];
  offset?: { x: number; y: number; w: number; h: number };
  isStatic: boolean;
  bloom?: number;
}
interface QuadSpriteProps extends GeneralProps {
  type: "sprite";
  GPUAtlas: string;
  atlasTexture: string;
}
interface QuadColorProps extends GeneralProps {
  type: "shape";
}
interface QuadAtlasProps {
  type: "spritesheet";
  GPUAtlas: string;
  atlasTexture: string;
  isStatic: GeneralProps["isStatic"];
  layers: (Omit<GeneralProps, "isStatic"> & {
    cropSize: { width: number; height: number };
    crop: { x: number; y: number };
  })[];
}
interface RendererPassLayer {
  textureIndex: number;
  cashedCropData: Float32Array;
  alpha: number;
  tint: Uint8ClampedArray;
  offset?: [number, number, number, number];
  isTexture: number;
  bloom: number;
  cashedOffsetData: { x: number; y: number; w: number; h: number } | undefined;
}
export type SpriteRendererProps =
  | QuadAtlasProps
  | QuadColorProps
  | QuadSpriteProps;

export interface SpriteRendererType extends SpriteRenderer {}
export default class SpriteRenderer extends Component {
  //TODO: przerobic na nadawanie nazwy teksturze zamiast indexu i lapanie jej dynamicznie
  type: SpriteRendererProps["type"];
  atlasIndex?: number;
  gpuAtlas?: string;
  isStatic: GeneralProps["isStatic"];
  layers: RendererPassLayer[];
  constructor(componentProps: ComponentProps, props: SpriteRendererProps) {
    super(componentProps);
    this.type = props.type;
    this.layers = [];
    this.isStatic = props.isStatic ?? false;
    if (props.type === "shape") {
      this.layers.push({
        cashedCropData: new Float32Array([0, 0, 1, 1]),
        textureIndex: 0,
        alpha: props.alpha !== undefined ? clamp(props.alpha, 0, 255) : 255,
        offset: props.offset
          ? (Object.values(props.offset) as RendererPassLayer["offset"])
          : undefined,
        tint: new Uint8ClampedArray(props.tint ?? [255, 255, 255]),
        isTexture: 0,
        cashedOffsetData: undefined,
        bloom: props.bloom ?? 0,
      });
    } else if (props.type === "sprite") {
      const { height, width, index } = SpriteRenderer.getTextureIndexMeta(
        props.GPUAtlas,
        props.atlasTexture
      );
      this.atlasIndex = index;
      this.gpuAtlas = props.GPUAtlas;
      const textureMeta = AuroraTexture.getTexture(this.gpuAtlas).meta;

      if (!textureMeta)
        console.error(`no data for texture with label ${this.gpuAtlas}`);
      else
        this.layers.push({
          cashedCropData: new Float32Array([
            0,
            0,
            width / textureMeta.width,
            height / textureMeta.height,
          ]),
          textureIndex: index!,
          alpha: props.alpha !== undefined ? clamp(props.alpha, 0, 255) : 255,
          offset: props.offset
            ? (Object.values(props.offset) as RendererPassLayer["offset"])
            : undefined,
          tint: new Uint8ClampedArray(props.tint ?? [255, 255, 255]),
          isTexture: 1,
          cashedOffsetData: undefined,
          bloom: props.bloom ?? 0,
        });
    } else if (props.type === "spritesheet") {
      const { index } = SpriteRenderer.getTextureIndexMeta(
        props.GPUAtlas,
        props.atlasTexture
      );
      this.atlasIndex = index;
      this.gpuAtlas = props.GPUAtlas;

      const textureMeta = AuroraTexture.getTexture(this.gpuAtlas)?.meta;
      if (!textureMeta)
        console.error(`no data for texture with label ${this.gpuAtlas}`);
      else
        props.layers.forEach((layer) => {
          const layerCrop = new Float32Array([
            layer.crop.x / textureMeta.width,
            layer.crop.y / textureMeta.height,
            (layer.crop.x + layer.cropSize.width) / textureMeta.width,
            (layer.crop.y + layer.cropSize.height) / textureMeta.height,
          ]);
          this.layers.push({
            cashedCropData: layerCrop,
            textureIndex: this.atlasIndex!,
            alpha: layer.alpha !== undefined ? clamp(layer.alpha, 0, 255) : 255,
            offset: layer.offset
              ? (Object.values(layer.offset) as RendererPassLayer["offset"])
              : undefined,
            tint: new Uint8ClampedArray(layer.tint ?? [255, 255, 255]),
            isTexture: 1,
            cashedOffsetData: undefined,
            bloom: layer.bloom ?? 0,
          });
        });
    }
  }
  private static getTextureIndexMeta(atlas: string, texture: string) {
    const meta = AuroraTexture.getTexture(atlas).meta.src.get(texture);
    validateValue(
      meta,
      `no meta data for texture ${texture} in spriteRenderer.`
    );
    return meta;
  }
}
