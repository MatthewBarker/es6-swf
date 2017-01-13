/**
 * A line style array enumerates a number of line styles.
 */
class LineStyleArray {
    /**
     * Constructs a new instance of the LineStyleArray class.
     */
    constructor() {
        /**
         * Array of line styles.
         *
         * @member {(LineStyle[]|LineStyle2[])}
         * @default
         */
        this.lineStyles = [];
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field                  | Type                                                                         | Comment                        |
     * |------------------------|------------------------------------------------------------------------------|--------------------------------|
     * | LineStyleCount         | UI8                                                                          | Count of line styles.          |
     * | LineStyleCountExtended | If LineStyleCount = 0xFF, UI16                                               | Extended count of line styles. |
     * | LineStyles             | If Shape1, Shape2, or Shape3, LINESTYLE[count]. If Shape4, LINESTYLE2[count] | Array of line styles.          |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        if (this.lineStyles.length < 255) {
            bitStream.writeUInt8(this.lineStyles.length); // LineStyleCount
        } else {
            bitStream.writeUInt8(255); // LineStyleCount
            bitStream.writeUInt16LE(this.lineStyles.length); // LineStyleCountExtended
        }

        this.lineStyles.forEach((lineStyle) => {
            lineStyle.write(bitStream); // LineStyles
        });
    }
}

module.exports = LineStyleArray;
