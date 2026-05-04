const widthMap = new WeakMap()
const heightMap = new WeakMap()

interface ImageDataLike {
  /**
   * A `Uint8ClampedArray` representing a one-dimensional array containing the data in the RGBA order, with integer values between `0` and `255` (included).
   */
  readonly data: Uint8ClampedArray

  /**
   * An `unsigned` `long` representing the actual height, in pixels, of the `ImageData`.
   */
  readonly height: number

  /**
   * An `unsigned` `long` representing the actual width, in pixels, of the `ImageData`.
   */
  readonly width: number
}

export class ImageData implements ImageDataLike {
  declare readonly data: ImageDataLike['data']
  declare readonly width: ImageDataLike['width']
  declare readonly height: ImageDataLike['height']

  /**
   * Creates an `ImageData` object from a given `Uint8ClampedArray` and the size of the image it contains.
   *
   * @param array A `Uint8ClampedArray` containing the underlying pixel representation of the image.
   * @param width An `unsigned` `long` representing the width of the image.
   * @param height An `unsigned` `long` representing the height of the image. This value is optional: the height will be inferred from the array's size and the given width.
   */
  constructor (array: Uint8ClampedArray, width: number, height?: number)
  /**
   * Creates an `ImageData` object of a black rectangle with the given width and height.
   *
   * @param width An `unsigned` `long` representing the width of the image.
   * @param height An `unsigned` `long` representing the height of the image.
   */
  constructor (width: number, height: number)
  constructor (width: number | Uint8ClampedArray, height: number, ...args: any[]) {
    if (arguments.length < 2) {
      throw new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only ${arguments.length} present.`)
    }

    if (typeof width === 'object') {
      if (!(width instanceof Uint8ClampedArray)) {
        throw new TypeError("Failed to construct 'ImageData': parameter 1 is not of type 'Uint8ClampedArray'.")
      }

      if (typeof height !== 'number' || height === 0) {
        throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.")
      }

      height = height >>> 0

      if ((height * 4) > width.length) {
        throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.")
      }

      if ((width.length % 4) !== 0) {
        throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of 4.")
      }

      if ((width.length % (4 * height)) !== 0) {
        throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of (4 * width).")
      }

      if (typeof args[0] !== 'undefined') {
        if (typeof args[0] !== 'number' || args[0] === 0) {
          throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.")
        }

        args[0] = args[0] >>> 0

        if ((width.length % (4 * height * args[0])) !== 0) {
          throw new Error("Failed to construct 'ImageData': The input data length is not equal to (4 * width * height).")
        }
      }

      widthMap.set(this, height)
      heightMap.set(this, typeof args[0] !== 'undefined' ? args[0] : (width.byteLength / height / 4))
      Object.defineProperty(this, 'data', { configurable: true, enumerable: true, value: width, writable: false })
    } else {
      if (typeof width !== 'number' || width === 0) {
        throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.")
      }

      width = width >>> 0

      if (typeof height !== 'number' || height === 0) {
        throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.")
      }

      height = height >>> 0

      if ((width * height) >= (1 << 30)) {
        throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.")
      }

      widthMap.set(this, width)
      heightMap.set(this, height)
      Object.defineProperty(this, 'data', { configurable: true, enumerable: true, value: new Uint8ClampedArray(width * height * 4), writable: false })
    }
  }
}

Object.defineProperty(ImageData.prototype, 'width', {
  enumerable: true,
  configurable: true,
  get () { return widthMap.get(this) }
})

Object.defineProperty(ImageData.prototype, 'height', {
  enumerable: true,
  configurable: true,
  get () { return heightMap.get(this) }
})
