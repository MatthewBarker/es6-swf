const bitConverter = require('bit-converter');

/**
 * Short tag headers are used for tags with 62 bytes of data or less.
 *
 * ** N.B. ** The TagCodeAndLength field is a two-byte word, not a bit field of 10 bits followed by a bit field of 6 bits.
 * The little-endian byte ordering of a SWF file makes these two layouts different.
 *
 * The length specified in the TagCodeAndLength field does not include the RECORDHEADER that starts a tag.
 */
class RecordHeaderShort {
    /**
     * Constructs a new instance of the RecordHeaderShort class.
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
     * | Field            | Type | Comment                                           |
     * |------------------|------|---------------------------------------------------|
     * | TagCodeAndLength | UI16 | Upper 10 bits: tag type; Lower 6 bits: tag length |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const codeBinary = bitConverter.intToBinaryString(this.code, 10);
        const lengthBinary = bitConverter.intToBinaryString(this.length, 6);
        const tagCodeAndLength = parseInt(codeBinary + lengthBinary, 2);

        bitStream.writeUInt16LE(tagCodeAndLength); // TagCodeAndLength
    }
}

module.exports = RecordHeaderShort;
