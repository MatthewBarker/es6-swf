const FillStyleArray = require('./fill-style-array');
const LineStyleArray = require('./line-style-array');

/**
 * The SHAPEWITHSTYLE structure extends the SHAPE structure by including fill style and line style information.
 * SHAPEWITHSTYLE is used by the DefineShape tag.
 *
 * There are four types of shape records:
 * - End shape record
 * - Style change record
 * - Straight edge record
 * - Curved edge record
 *
 * ** N.B. ** The LINESTYLELARRAY and FILLSTYLEARRAY begin at index 1, not index 0.
 */
class ShapeWithStyle {
    /**
     * Constructs a new instance of the ShapeWithStyle class.
     */
    constructor() {
        /**
         * Array of fill styles.
         *
         * @member {FillStyleArray}
         * @default
         */
        this.fillStyles = new FillStyleArray();

        /**
         * Array of line styles.
         *
         * @member {LineStyleArray}
         * @default
         */
        this.lineStyles = new LineStyleArray();

        /**
         * [one or more] Shape records.
         *
         * @member {Array.<EndShapeRecord, StyleChangeRecord, StraightEdgeRecord, CurvedEdgeRecord>}
         * @default
         */
        this.shapeRecords = [];
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field        | Type           | Comment                     |
     * |--------------|----------------|-----------------------------|
     * | FillStyles   | FILLSTYLEARRAY | Array of fill styles        |
     * | LineStyles   | LINESTYLEARRAY | Array of line styles        |
     * | NumFillBits  | UB[4]          | Number of fill index bits   |
     * | NumLineBits  | UB[4]          | Number of line index bits   |
     * | ShapeRecords | SHAPERECORD    | [one or more] Shape records |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        let numFillBits = this.fillStyles.fillStyles.length ?
            this.fillStyles.fillStyles.length.toString(2).length : 0;
        let numLineBits = 0;

        if (this.fillStyles.fillStyles.length) {
            numFillBits = this.fillStyles.fillStyles.length.toString(2).length;
        }

        if (this.lineStyles.lineStyles.length) {
            numLineBits = this.lineStyles.lineStyles.length.toString(2).length;
        }

        this.fillStyles.write(bitStream); // FillStyles
        this.lineStyles.write(bitStream); // LineStyles
        bitStream.writeIntBits(numFillBits, 4); // NumFillBits
        bitStream.writeIntBits(numLineBits, 4); // NumLineBits

        this.shapeRecords.forEach((shapeRecord) => {
            shapeRecord.write(bitStream); // ShapeRecords
        });
    }
}

module.exports = ShapeWithStyle;
