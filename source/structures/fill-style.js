const BitStream = require('bit-stream');
const fillStyleTypes = require('../constants/fill-style-types');
const Rgb = require('../types/rgb');

/**
 * The SWF file format supports three basic types of fills for a shape.
 * - Solid fill: A simple RGB or RGBA color that fills a portion of a shape. An alpha value of 255 means a
 * completely opaque fill. An alpha value of zero means a completely transparent fill. Any alpha between 0
 * and 255 will be partially transparent.
 * - Gradient Fill: A gradient fill can be either a linear or a radial gradient. For an in-depth description of
 * how gradients are defined, see Gradients.
 * - Bitmap fill: Bitmap fills refer to a bitmap characterId. There are two styles: clipped and tiled. A clipped
 * bitmap fill repeats the color on the edge of a bitmap if the fill extends beyond the edge of the bitmap. A
 * tiled fill repeats the bitmap if the fill extends beyond the edge of the bitmap.
 */
class FillStyle {
    /**
     * Constructs a new instance of the FillStyle class.
     */
    constructor() {
        /**
         * Type of fill style.
         *
         * @member {number}
         * @default
         */
        this.fillStyleType = fillStyleTypes.SOLID_FILL;

        /**
         * Solid fill color with opacity information.
         * If type = 0x00, RGBA (if Shape3); RGB (if Shape1 or Shape2)
         *
         * @member {(Rgb|Rgba)}
         * @default
         */
        this.color = new Rgb(0xFF, 0xFF, 0xFF);

        /**
         * Matrix for gradient fill.
         * If type = 0x10, 0x12, or 0x13, MATRIX
         *
         * @member {Matrix}
         * @default
         */
        this.gradientMatrix = null;

        /**
         * Gradient fill.
         * If type = 0x10 or 0x12, GRADIENT If type = 0x13, FOCALGRADIENT (SWF 8 and later only)
         *
         * @member {(Gradient|FocalGradient)}
         * @default
         */
        this.gradient = null;

        /**
         * ID of bitmap character for fill.
         * If type = 0x40, 0x41, 0x42 or 0x43, UI16
         *
         * @member {number}
         * @default
         */
        this.bitmapId = null;

        /**
         * Matrix for bitmap fill.
         * If type = 0x40, 0x41, 0x42 or 0x43, MATRIX
         *
         * @member {Matrix}
         * @default
         */
        this.bitmapMatrix = null;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field          | Type                                                                                  | Comment                                                              |
     * |----------------|---------------------------------------------------------------------------------------|----------------------------------------------------------------------|
     * | FillStyleType  | UI8                                                                                   | Type of fill style:                                                  |
     * |                |                                                                                       | 0x00 = solid fill                                                    |
     * |                |                                                                                       | 0x10 = linear gradient fill                                          |
     * |                |                                                                                       | 0x12 = radial gradient fill                                          |
     * |                |                                                                                       | 0x13 = focal radial gradient fill (SWF 8 file format and later only) |
     * |                |                                                                                       | 0x40 = repeating bitmap fill                                         |
     * |                |                                                                                       | 0x41 = clipped bitmap fill                                           |
     * |                |                                                                                       | 0x42 = non-smoothed repeating bitmap                                 |
     * |                |                                                                                       | 0x43 = non-smoothed clipped bitmap                                   |
     * | Color          | If type = 0x00, RGBA (if Shape3); RGB (if Shape1 or Shape2)                           | Solid fill color with opacity information.                           |
     * | GradientMatrix | If type = 0x10, 0x12, or 0x13, MATRIX                                                 | Matrix for gradient fill.                                            |
     * | Gradient       | If type = 0x10 or 0x12, GRADIENT If type = 0x13, FOCALGRADIENT (SWF 8 and later only) | Gradient fill.                                                       |
     * | BitmapId       | If type = 0x40, 0x41, 0x42 or 0x43, UI16                                              | ID of bitmap character for fill.                                     |
     * | BitmapMatrix   | If type = 0x40, 0x41, 0x42 or 0x43, MATRIX                                            | Matrix for bitmap fill.                                              |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        bitStream.writeUInt8(this.fillStyleType); // FillStyleType

        if (this.fillStyleType === fillStyleTypes.SOLID_FILL) {
            const subStream = new BitStream();

            subStream.on('data', (buffer) => {
                for (const value of buffer.values()) {
                    bitStream.writeUInt8(value);
                }
            });

            this.color.write(subStream); // Color
            subStream.end();
        }

        if (this.fillStyleType === fillStyleTypes.LINEAR_GRADIENT ||
            this.fillStyleType === fillStyleTypes.RADIAL_GRADIENT ||
            this.fillStyleType === fillStyleTypes.FOCAL_RADIAL_GRADIENT) {
            this.gradientMatrix.write(bitStream); // GradientMatrix
        }

        if (this.fillStyleType === fillStyleTypes.LINEAR_GRADIENT ||
            this.fillStyleType === fillStyleTypes.RADIAL_GRADIENT ||
            this.fillStyleType === fillStyleTypes.FOCAL_RADIAL_GRADIENT) {
            this.gradient.write(bitStream); // Gradient
        }

        if (this.fillStyleType === fillStyleTypes.REPEATING_BITMAP ||
            this.fillStyleType === fillStyleTypes.CLIPPED_BITMAP ||
            this.fillStyleType === fillStyleTypes.NON_SMOOTHED_REPEATING_BITMAP ||
            this.fillStyleType === fillStyleTypes.NON_SMOOTHED_CLIPPED_BITMAP) {
            bitStream.writeUInt16LE(this.bitmapId); // BitmapId
            this.bitmapMatrix.write(bitStream); // BitmapMatrix
        }
    }
}

module.exports = FillStyle;
