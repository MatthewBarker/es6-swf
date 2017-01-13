const RecordHeaderShort = require('../structures/record-header-short');
const tags = require('../constants/tags');

/**
 * The End tag marks the end of a file. This must always be the last tag in a file. *
 * The End tag is also required to end a sprite definition.
 */
class End {
    /**
     * Constructs a new instance of the End class.
     */
    constructor() {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.END;
    }

    /**
     * Write the tag to the specified stream.
     *
     * | Field  | Type         | Comment      |
     * |--------|--------------|--------------|
     * | Header | RECORDHEADER | Tag type = 0 |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const header = new RecordHeaderShort(this.code, 0);

        header.write(bitStream); // Header
        bitStream.align(); // Byte align
    }
}

module.exports = End;
