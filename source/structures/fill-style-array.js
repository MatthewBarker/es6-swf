/**
 * A fill style array enumerates a number of fill styles.
 */
class FillStyleArray {
    /**
     * Constructs a new instance of the FillStyleArray class.
     */
    constructor() {
        /**
         * Array of fill styles.
         *
         * @member {FillStyle[]}
         * @default
         */
        this.fillStyles = [];
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field                  | Type                          | Comment                                                              |
     * |------------------------|-------------------------------|----------------------------------------------------------------------|
     * | FillStyleCount         | UI8                           | Count of fill styles                                                 |
     * | FillStyleCountExtended | If FillStyleCount = 0xFF UI16 | Extended count of fill styles. Supported only for Shape2 and Shape3. |
     * | FillStyles             | FILLSTYLE[FillStyleCount]     | Array of fill styles                                                 |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        if (this.fillStyles.length < 255) {
            bitStream.writeUInt8(this.fillStyles.length); // FillStyleCount
        } else {
            bitStream.writeUInt8(255); // FillStyleCount
            bitStream.writeUInt16LE(this.fillStyles.length); // FillStyleCountExtended
        }

        this.fillStyles.forEach((fillStyle) => {
            fillStyle.write(bitStream); // FillStyles
        });
    }
}

module.exports = FillStyleArray;
