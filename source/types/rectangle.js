const bitConverter = require('bit-converter');

/**
 * A rectangle value represents a rectangular region defined by a minimum x- and y-coordinate position and a
 * maximum x- and y-coordinate position. The RECT record must be byte aligned.
 *
 * ** N.B. ** Values are in twips (twentieths of a pixel).
 */
class Rectangle {
    /**
     * Constructs a new instance of the Rectangle class.
     *
     * @param {number} [xMin = 0] - X minimum position for rect.
     * @param {number} [xMax = 0] - X maximum position for rect.
     * @param {number} [yMin = 0] - Y minimum position for rect.
     * @param {number} [yMax = 0] - Y minimum position for rect.
     */
    constructor(xMin = 0, xMax = 0, yMin = 0, yMax = 0) {
        /**
         * X minimum position for rect.
         *
         * @member {number}
         */
        this.xMin = xMin;

        /**
         * X maximum position for rect.
         *
         * @member {number}
         */
        this.xMax = xMax;

        /**
         * Y minimum position for rect.
         *
         * @member {number}
         */
        this.yMin = yMin;

        /**
         * Y minimum position for rect.
         *
         * @member {number}
         */
        this.yMax = yMax;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field | Type      | Comment                       |
     * |-------|-----------|-------------------------------|
     * | Nbits | UB[5]     | Bits in each rect value field |
     * | Xmin  | SB[Nbits] | x minimum position for rect   |
     * | Xmax  | SB[Nbits] | x maximum position for rect   |
     * | Ymin  | SB[Nbits] | y minimum position for rect   |
     * | Ymax  | SB[Nbits] | y maximum position for rect   |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const numBits = bitConverter.bitsRequired([this.xMin, this.xMax, this.yMin, this.yMax]);
        const binaries = [];

        binaries.push(bitConverter.intToBinaryString(numBits, 5)); // Nbits
        binaries.push(bitConverter.intToBinaryString(this.xMin, numBits)); // Xmin
        binaries.push(bitConverter.intToBinaryString(this.xMax, numBits)); // Xmax
        binaries.push(bitConverter.intToBinaryString(this.yMin, numBits)); // Ymin
        binaries.push(bitConverter.intToBinaryString(this.yMax, numBits)); // Ymax

        bitStream.writeStringBits(binaries.join(''));
        bitStream.align(); // Byte align
    }
}

module.exports = Rectangle;
