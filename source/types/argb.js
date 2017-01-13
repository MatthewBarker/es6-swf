const Rgb = require('./rgb');

/**
 * The ARGB record behaves exactly like the RGBA record, but the alpha value for the ARGB record is in the first
 * byte.
 *
 * @extends Rgb
 */
class Argb extends Rgb {
    /**
     * Constructs a new instance of the Argb class.
     *
     * @param {number} red - The red component.
     * @param {number} green - The green component.
     * @param {number} blue - The blue component.
     * @param {number} alpha - The alpha component.
     */
    constructor(red, green, blue, alpha) {
        super(red, green, blue);

        /**
         * The alpha component.
         *
         * @member {number}
         */
        this.alpha = alpha;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field | Type | Comment           |
     * |-------|------|-------------------|
     * | Red   | UI8  | Red color value   |
     * | Green | UI8  | Green color value |
     * | Blue  | UI8  | Blue color value  |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        bitStream.writeUInt8(this.alpha);
        super.write(bitStream);
    }
}

module.exports = Argb;
