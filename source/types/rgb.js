/**
 * The RGB record represents a color as a 24-bit red, green, and blue value.
 */
class Rgb {
    /**
     * Constructs a new instance of the Rgb class.
     *
     * @param {number} red - The red component.
     * @param {number} green - The green component.
     * @param {number} blue - The blue component.
     */
    constructor(red, green, blue) {
        /**
         * The red component.
         *
         * @member {number}
         */
        this.red = red;

        /**
         * The green component.
         *
         * @member {number}
         */
        this.green = green;

        /**
         * The blue component.
         *
         * @member {number}
         */
        this.blue = blue;
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
        bitStream.writeUInt8(this.red);
        bitStream.writeUInt8(this.green);
        bitStream.writeUInt8(this.blue);
    }
}

module.exports = Rgb;
