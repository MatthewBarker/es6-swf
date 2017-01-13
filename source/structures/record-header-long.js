const bitConverter = require('bit-converter');

/**
 * Long tag headers, with a signed 32-bit length field, can be
 * used for any tag size up to 2GB, far larger than is presently practical.
 *
 * ** N.B. ** The TagCodeAndLength field is a two-byte word, not a bit field of 10 bits followed by a bit field of 6 bits.
 * The little-endian byte ordering of a SWF file makes these two layouts different.
 *
 * The length specified in the TagCodeAndLength field does not include the RECORDHEADER that starts a tag.
 */
class RecordHeaderLong {
    /**
     * Constructs a new instance of the RecordHeaderLong class.
     *
     * @param {number} code - Tag type.
     * @param {number} length - Length of tag.
     */
    constructor(code, length) {
        /**
         * Tag type.
         *
         * @member {number}
         */
        this.code = code;

        /**
         * Length of tag.
         *
         * @member {number}
         */
        this.length = length;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field            | Type | Comment                                                        |
     * |------------------|------|----------------------------------------------------------------|
     * | TagCodeAndLength | UI16 | Tag type and length of 0x3F Packed together as in short header |
     * | Length           | UI32 | Length of tag                                                  |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const codeBinary = bitConverter.intToBinaryString(this.code, 10);
        const lengthBinary = bitConverter.intToBinaryString(0x3F, 6);
        const tagCodeAndLength = parseInt(codeBinary + lengthBinary, 2);

        bitStream.writeUInt16LE(tagCodeAndLength); // TagCodeAndLength
        bitStream.writeUInt32LE(this.length); // Length
    }
}

module.exports = RecordHeaderLong;
