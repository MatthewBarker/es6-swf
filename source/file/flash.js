const BitStream = require('bit-stream');

/**
 * Represents a complete SWF file.
 */
class Flash {
    /**
     * Constructs a new instance of the Flash class.
     *
     * @param {FileHeader} fileHeader - File header.
     */
    constructor(fileHeader) {
        /**
         * @member {FileHeader}
         */
        this.fileHeader = fileHeader;

        /**
         * Generally speaking, tags in a SWF can occur in any order.
         * However, you must observe the following rules:
         *
         * - The FileAttributes tag must be the first tag in the SWF file for SWF 8 and later.
         * - A tag should only depend on tags that come before it. A tag should never depend on a tag that comes later in the file.
         * - A definition tag that defines a character must occur before any control tag that refers to that character.
         * - Streaming sound tags must be in order. Out-of-order streaming sound tags result in the sound being played out of order.
         * - The End tag is always the last tag in the SWF file.
         *
         * @member {Tag[]}
         */
        this.tags = [];
    }

    /**
    * Write the data to the stream.
    *
    * @param {stream.Writable} stream - Stream to write to.
    */
    write(stream) {
        const headBuffers = [];
        const tagBuffers = [];
        const headStream = new BitStream();
        const tagStream = new BitStream();

        headStream.on('data', (buffer) => {
            headBuffers.push(buffer);
        });

        tagStream.on('data', (buffer) => {
            tagBuffers.push(buffer);
        });

        this.tags.forEach((tag) => {
            tag.write(tagStream);
        });

        tagStream.end();

        const tagLength = tagBuffers.reduce(
            (accumulator, currentValue) => accumulator + currentValue.length, 0);

        this.fileHeader.tagLength = tagLength;
        this.fileHeader.write(headStream);
        headStream.end();

        headBuffers.forEach((buffer) => {
            stream.write(buffer);
        });

        tagBuffers.forEach((buffer) => {
            stream.write(buffer);
        });
    }
}

module.exports = Flash;
