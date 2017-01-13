const Rgb = require('./rgb');

/**
 * The RGBA record represents a color as 32-bit red, green, blue and alpha value.
 * An RGBA color with an alpha value of 255 is completely opaque.
 * An RGBA color with an alpha value of zero is completely transparent.
 * Alpha values between zero and 255 are partially transparent.
 *
 * @extends Rgb
 */
class Rgba extends Rgb {
    /**
     * Constructs a new instance of the Rgba class.
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
        super.write(bitStream);
        bitStream.writeUInt8(this.alpha);
    }
}

module.exports = Rgba;
