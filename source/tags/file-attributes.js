const RecordHeaderShort = require('../structures/record-header-short');
const tags = require('../constants/tags');

/**
 * The FileAttributes tag defines characteristics of the SWF file.
 *
 * This tag is required for SWF 8 and later and must be the first tag in the SWF file.
 *
 * Additionally, the FileAttributes tag can optionally be included in all SWF file versions.
 *
 * The HasMetadata flag identifies whether the SWF file contains the Metadata tag.
 * Flash Player does not care about this bit field or the related tag but it is useful for search engines.
 *
 * The UseNetwork flag signifies whether Flash Player should grant the SWF file local or network file access if the
 * SWF file is loaded locally. The default behavior is to allow local SWF files to interact with local files only, and not
 * with the network. However, by setting the UseNetwork flag, the local SWF can forfeit its local file system access
 * in exchange for access to the network. Any version of SWF can use the UseNetwork flag to set the file access for
 * locally loaded SWF files that are running in Flash Player 8 or later.
 *
 * The minimum file format version is SWF 8.

 * The UseDirectBlit and UseGPU flags are relevant only when a SWF file is playing in the standalone Flash Player.
 * When a SWF file plays in a web browser plug-in, UseDirectBlit is equivalent to specifying a wmode of “direct” in
 * the tags that embed the SWF inside the HTML page, while UseGPU is equivalent to a wmode of “gpu”.
 */
class FileAttributes {
    /**
     * Constructs a new instance of the FileAttributes class.
     */
    constructor() {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.FILE_ATTRIBUTES;

        /**
         * If true, the SWF file uses hardware acceleration to blit graphics to the screen, where such acceleration is available.
         * If false, the SWF file will not use hardware accelerated graphics facilities.
         * Minimum file version is 10.
         *
         * @member {boolean}
         * @default
         */
        this.useDirectBlit = false;

        /**
         * If true, the SWF file uses GPU compositing features when drawing graphics, where such acceleration is available.
         * If false, the SWF file will not use hardware accelerated graphics facilities.
         * Minimum file version is 10.
         *
         * @member {boolean}
         * @default
         */
        this.useGPU = false;

        /**
         * If true, the SWF file contains the Metadata tag.
         * If false, the SWF file does not contain the Metadata tag.
         *
         * @member {boolean}
         * @default
         */
        this.hasMetadata = false;

        /**
         * If true, this SWF uses ActionScript 3.0.
         * If false, this SWF uses ActionScript 1.0 or 2.0.
         * Minimum file format version is 9.
         *
         * @member {boolean}
         * @default
         */
        this.actionScript3 = false;

        /**
         * If true, this SWF file is given network file access when loaded locally.
         * If false, this SWF file is given local file access when loaded locally.
         *
         * @member {boolean}
         * @default
         */
        this.useNetwork = false;
    }

    /**
     * Write the tag to the specified stream.
     *
     * | Field         | Type         | Comment                                                                                                                                                                                                                   |
     * |---------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
     * | Header        | RECORDHEADER | Tag type = 69                                                                                                                                                                                                             |
     * | Reserved      | UB[1]        | Must be 0                                                                                                                                                                                                                 |
     * | UseDirectBlit | UB[1]        | If 1, the SWF file uses hardware acceleration to blit graphics to the screen, where such acceleration is available. If 0, the SWF file will not use hardware accelerated graphics facilities. Minimum file version is 10. |
     * | UseGPU        | UB[1]        | If 1, the SWF file uses GPU compositing features when drawing graphics, where such acceleration is available. If 0, the SWF file will not use hardware accelerated graphics facilities. Minimum file version is 10.       |
     * | HasMetadata   | UB[1]        | If 1, the SWF file contains the Metadata tag. If 0, the SWF file does not contain the Metadata tag.                                                                                                                       |
     * | ActionScript3 | UB[1]        | If 1, this SWF uses ActionScript 3.0. If 0, this SWF uses ActionScript 1.0 or 2.0. Minimum file format version is 9.                                                                                                      |
     * | Reserved      | UB[2]        | Must be 0                                                                                                                                                                                                                 |
     * | UseNetwork    | UB[1]        | If 1, this SWF file is given network file access when loaded locally. If 0, this SWF file is given local file access when loaded locally.                                                                                 |
     * | Reserved      | UB[24]       | Must be 0                                                                                                                                                                                                                 |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const header = new RecordHeaderShort(this.code, 4);

        header.write(bitStream); // Header
        bitStream.writeIntBits(0, 1); // Reserved
        bitStream.writeIntBits(this.useDirectBlit ? 1 : 0, 1); // UseDirectBlit
        bitStream.writeIntBits(this.useGPU ? 1 : 0, 1); // UseGPU
        bitStream.writeIntBits(this.hasMetadata ? 1 : 0, 1); // HasMetadata
        bitStream.writeIntBits(this.actionScript3 ? 1 : 0, 1); // ActionScript3
        bitStream.writeIntBits(0, 2); // Reserved
        bitStream.writeIntBits(this.useNetwork ? 1 : 0, 1); // UseNetwork
        bitStream.writeIntBits(0, 24); // Reserved
        bitStream.align(); // Byte align
    }
}

module.exports = FileAttributes;
