const BitStream = require('bit-stream');
const Rectangle = require('../types/rectangle');

/**
 * All SWF files begin with this header.
 */
class FileHeader {
    /**
     * Constructs a new instance of the FileHeader class.
     *
     * @param {string} signature - Expects one of the following values:
     * - ** FWS **: uncompressed,
     * - ** CWS **: compressed (SWF 6 or later only) using ZLib compression,
     * - ** ZWS **: compressed using LZMA compression.
     * @param {number} version - File version.
     * @param {number} width - Width in twips (twentieths of a pixel).
     * @param {number} height - Height in twips (twentieths of a pixel).
     * @param {number} frameRate - Number of frames per second.
     * @param {number} frameCount - Number of frames in file.
     */
    constructor(signature, version, width, height, frameRate, frameCount) {
        /**
         * Expects one of the following values:
         * - ** FWS **: uncompressed,
         * - ** CWS **: compressed (SWF 6 or later only) using ZLib compression,
         * - ** ZWS **: compressed using LZMA compression.
         *
         * @member {string}
         */
        this.signature = signature;

        /**
         * File version.
         *
         * @member {number}
         */
        this.version = version;

        /**
         * Frame size in twips.
         *
         * @member {Rectangle}
         */
        this.frameSize = new Rectangle(0, width, 0, height);

        /**
         * Number of frames per second.
         *
         * @member {number}
         */
        this.frameRate = frameRate;

        /**
         * Number of frames in file.
         *
         * @member {number}
         */
        this.frameCount = frameCount;

        /**
         * Length of tags in bytes.
         *
         * @member {number}
         * @default
         */
        this.tagLength = 0;
    }

    /**
     * Write the following data to the stream:
     *
     * | Field      | Type | Comment                                                                                                                                                             |
     * |------------|------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
     * | Signature  | UI8  | Signature byte: “F” indicated uncompressed; “C” indicates compressed (SWF 6 or later only) using ZLib compression. “Z” indicates compressed using LZMA compression. |
     * | Signature  | UI8  | Signature byte always “W”                                                                                                                                           |
     * | Signature  | UI8  | Signature byte always “S”                                                                                                                                           |
     * | Version    | UI8  | Single byte file version (for example, 0x06 for SWF 6)                                                                                                              |
     * | FileLength | UI32 | Length of entire file in bytes                                                                                                                                      |
     * | FrameSize  | RECT | Frame size in twips                                                                                                                                                 |
     * | FrameRate  | UI16 | Frame delay in 8.8 fixed number of frames per second                                                                                                                |
     * | FrameCount | UI16 | Total number of frames in file                                                                                                                                      |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const subStream = new BitStream();
        const buffers = [];

        subStream.on('data', (buffer) => {
            buffers.push(buffer);
        });

        this.frameSize.write(subStream);
        subStream.end();

        const frameSizeLength = buffers.reduce(
            (accumulator, currentValue) => accumulator + currentValue.length, 0);
        const fileLength = this.tagLength + frameSizeLength + 12;

        bitStream.write(this.signature); // Signature
        bitStream.writeUInt8(this.version); // Version
        bitStream.writeUInt32LE(fileLength, 32); // FileLength
        this.frameSize.write(bitStream); // FrameSize
        // N.B. Quote from page 223 of the file specification:
        // "Next in the header is the frame rate.
        // It is supposed to be stored as a 16-bit integer,
        // but the first byte is completely ignored"
        // Effectively makes it a pair of Int8's
        bitStream.writeUInt8(0);
        bitStream.writeUInt8(this.frameRate); // FrameRate
        bitStream.writeUInt16LE(this.frameCount); // FrameCount
        bitStream.flush();
    }
}

module.exports = FileHeader;
