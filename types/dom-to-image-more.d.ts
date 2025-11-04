// types/dom-to-image-more.d.ts
declare module "dom-to-image-more" {
  export interface Options {
    bgcolor?: string
    quality?: number
    width?: number
    height?: number
    style?: Record<string, any>
    filter?: (node: HTMLElement) => boolean
    cacheBust?: boolean
  }

  export function toPng(node: HTMLElement, options?: Options): Promise<string>
  export function toJpeg(
    node: HTMLElement,
    options?: Options
  ): Promise<string>
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>
  export function toPixelData(
    node: HTMLElement,
    options?: Options
  ): Promise<Uint8Array>
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>
}
