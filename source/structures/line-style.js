const BitStream = require('bit-stream');
const Rgb = require('../types/rgb');

/**
 * A line style represents a width and color of a line.
 *
 * ** Note 1 **: Before the introduction of LINESTYLE2 in SWF 8, all lines in the SWF file format have rounded joins and
 * round caps. Different join styles and end styles can be simulated with a very narrow shape that looks identical to
 * the desired stroke.
 *
 * ** Note 2 **: The SWF file format has no native support for dashed or dotted line styles. A dashed line can be
 * simulated by breaking up the path into a series of short lines.
 */
class LineStyle {
    /**
     * Constructs a new instance of the LineStyle class.
     *
     * @param {number} [width = 20] - Width of line in twips.
     * @param {(Rgb|Rgba)} [color = new Rgb(0xFF, 0xFF, 0xFF)] - Color value including alpha channel information for Shape3.
     */
    constructor(width = 20, color = new Rgb(0xFF, 0xFF, 0xFF)) {
        /**
         * Width of line in twips.
         *
         * @member {number}
         */
        this.width = width;

        /**
         * Color value including alpha channel information for Shape3.
         * RGB (Shape1 or Shape2) RGBA (Shape3)
         *
         * @member {(Rgb|Rgba)}
         */
        this.color = color;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field | Type                                 | Comment                                                    |
     * |-------|--------------------------------------|------------------------------------------------------------|
     * | Width | UI16                                 | Width of line in twips                                     |
     * | Color | RGB (Shape1 or Shape2) RGBA (Shape3) | Color value including alpha channel information for Shape3 |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const subStream = new BitStream();

        subStream.on('data', (buffer) => {
            for (const value of buffer.values()) {
                bitStream.writeUInt8(value);
            }
        });

        bitStream.writeUInt16LE(this.width); // Width
        this.color.write(subStream); // Color
        subStream.end();
    }
}

module.exports = LineStyle;
