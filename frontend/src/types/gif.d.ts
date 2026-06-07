declare module 'gifuct-js' {
  export interface GifFrame {
    disposalMethod: number
    delay: number
    colorTable: number[]
    lzwMinCodeSize: number
    image: {
      left: number
      top: number
      width: number
      lzw: {
        lzwMinCodeSize: number
      }
    }
    pixels: Uint8ClampedArray
    patch?: ImageData
    dims: {
      width: number
      height: number
    }
  }

  export interface ParsedGif {
    width: number
    height: number
    colorTable: number[]
    frames: GifFrame[]
  }

  export function parseGIF(buffer: ArrayBuffer): ParsedGif

  export function decompressFrames(parsedGif: ParsedGif): GifFrame[]
}

declare module 'gif.js' {
  interface GIFOptions {
    workers?: number
    quality?: number
    width?: number
    height?: number
    workerScript?: string
    repeat?: number
    background?: string
    transparent?: string | null
    dither?: boolean | string
  }

  class GIF {
    constructor(options?: GIFOptions)
    addFrame(
      image: CanvasRenderingContext2D | HTMLCanvasElement | HTMLImageElement | ImageData,
      options?: { delay?: number; copy?: boolean; dispose?: number }
    ): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    on(event: 'progress', callback: (percent: number) => void): void
    on(event: 'start' | 'abort', callback: () => void): void
    render(): void
    abort(): void
    running: boolean
  }

  export default GIF
}
