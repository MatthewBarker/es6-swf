/**
 * The end shape record simply indicates the end of the shape record array. It is a non-edge record with all five
 * flags equal to zero.
 */
class EndShapeRecord {
    /**
     * Writes the structure to a bit stream.
     *
     * | Field      | Type  | Comment                        |
     * |------------|-------|--------------------------------|
     * | TypeFlag   | UB[1] | Non-edge record flag. Always 0 |
     * | EndOfShape | UB[5] | End of shape flag. Always 0    |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write(bitStream) {
        bitStream.writeIntBits(0, 1); // TypeFlag
        bitStream.writeIntBits(0, 5); // EndOfShape
        bitStream.align(); // Byte align
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field      | Type  | Comment                        |
     * |------------|-------|--------------------------------|
     * | TypeFlag   | UB[1] | Non-edge record flag. Always 0 |
     * | EndOfShape | UB[5] | End of shape flag. Always 0    |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        return this.constructor.write(bitStream);
    }
}

module.exports = EndShapeRecord;
