const bitConverter = require('bit-converter');

/**
 * The StraightEdgeRecord stores the edge as an X-Y delta. The delta is added to the current drawing position, and
 * this becomes the new drawing position. The edge is rendered between the old and new drawing positions.
 *
 * Straight edge records support three types of lines:
 * 1. General lines.
 * 2. Horizontal lines.
 * 3. Vertical lines.
 *
 * General lines store both X and Y deltas, the horizontal and vertical lines store only the X delta and Y delta
 * respectively.
 */
class StraightEdgeRecord {
    /**
     * Constructs a new instance of the StraightEdgeRecord class.
     *
     * @param {number} deltaX - X delta.
     * @param {number} deltaY - Y delta.
     */
    constructor(deltaX, deltaY) {
        /**
         * X delta.
         *
         * @member {number}
         */
        this.deltaX = deltaX;

        /**
         * Y delta.
         *
         * @member {number}
         */
        this.deltaY = deltaY;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field           | Type                                                         | Comment                                                   |
     * |-----------------|--------------------------------------------------------------|-----------------------------------------------------------|
     * | TypeFlag        | UB[1]                                                        | This is an edge record. Always 1.                         |
     * | StraightFlag    | UB[1]                                                        | Straight edge. Always 1.                                  |
     * | NumBits         | UB[4]                                                        | Number of bits per value (2 less than the actual number). |
     * | GeneralLineFlag | UB[1]                                                        | General Line equals 1. Vert/Horz Line equals 0.           |
     * | VertLineFlag    | If GeneralLineFlag = 0, SB[1]                                | Vertical Line equals 1. Horizontal Line equals 0.         |
     * | DeltaX          | If GeneralLineFlag = 1 or if VertLineFlag = 0, SB[NumBits+2] | X delta.                                                  |
     * | DeltaY          | If GeneralLineFlag = 1 or if VertLineFlag = 1, SB[NumBits+2] | Y delta.                                                  |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const numBits = bitConverter.bitsRequired([this.deltaX, this.deltaY]);
        const generalLine = this.deltaX !== 0 && this.deltaY !== 0;
        const verticalLine = this.deltaX === 0 && this.deltaY !== 0;

        bitStream.writeIntBits(1, 1); // TypeFlag
        bitStream.writeIntBits(1, 1); // StraightFlag
        bitStream.writeIntBits(numBits - 2, 4); // NumBits
        bitStream.writeIntBits(generalLine ? 1 : 0, 1); // GeneralLineFlag

        if (!generalLine) {
            bitStream.writeIntBits(verticalLine ? 1 : 0, 1); // VertLineFlag
        }

        if (generalLine || !verticalLine) {
            bitStream.writeIntBits(this.deltaX, numBits); // DeltaX
        }

        if (generalLine || verticalLine) {
            bitStream.writeIntBits(this.deltaY, numBits); // DeltaY
        }
    }
}

module.exports = StraightEdgeRecord;
