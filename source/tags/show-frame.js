const RecordHeaderShort = require('../structures/record-header-short');
const tags = require('../constants/tags');

/**
 * The ShowFrame tag instructs Flash Player to display the contents of the display list. The file is paused for the duration of a single frame.
 * The minimum file format version is SWF 1.
 */
class ShowFrame {
    /**
     * Constructs a new instance of the ShowFrame class.
     */
    constructor() {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.SHOW_FRAME;
    }

    /**
     * Write the tag to the specified stream.
     *
     * | Field  | Type         | Comment      |
     * |--------|--------------|--------------|
     * | Header | RECORDHEADER | Tag type = 1 |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const header = new RecordHeaderShort(this.code, 0);

        header.write(bitStream); // Header
        bitStream.align(); // Byte align
    }
}

module.exports = ShowFrame;
