const BitStream = require('bit-stream');
const RecordHeaderShort = require('../structures/record-header-short');
const Rgb = require('../types/rgb');
const tags = require('../constants/tags');

/**
 * The SetBackgroundColor tag sets the background color of the display.
 */
class SetBackgroundColor {
    /**
     * Constructs a new instance of the SetBackgroundColor class.
     *
     * @param {Rgb} [color = new Rgb(0xFF, 0xFF, 0xFF)] - 24 bit hex value.
     */
    constructor(color = new Rgb(0xFF, 0xFF, 0xFF)) {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.SET_BACKGROUND_COLOR;

        /**
         * Rgb value.
         *
         * @member {Rgb}
         */
        this.color = color;
    }

    /**
     * Write the tag to the specified stream.
     *
     * | Field  | Type         | Comment      |
     * |--------|--------------|--------------|
     * | Header | RECORDHEADER | Tag type = 9 |
     * | Color  | RGB          |              |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const header = new RecordHeaderShort(this.code, 3);
        const subStream = new BitStream();

        subStream.on('data', (buffer) => {
            for (const value of buffer.values()) {
                bitStream.writeUInt8(value);
            }
        });

        header.write(bitStream); // Header
        this.color.write(subStream); // Color
        subStream.align(); // Byte align
        subStream.end();
    }
}

module.exports = SetBackgroundColor;
