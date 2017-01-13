const bitConverter = require('bit-converter');
const FillStyleArray = require('./fill-style-array');
const LineStyleArray = require('./line-style-array');

/**
 * The style change record is also a non-edge record. It can be used to do the following:
 *
 * 1. Select a fill or line style for drawing.
 * 2. Move the current drawing position (without drawing).
 * 3. Replace the current fill and line style arrays with a new set of styles.
 *
 * Because fill and line styles often change at the start of a new path, it is useful to perform more than one action
 * in a single record. For example, say a DefineShape tag defines a red circle and a blue square. After the circle is
 * closed, it is necessary to move the drawing position, and replace the red fill with the blue fill. The style change
 * record can achieve this with a single shape record.
 *
 * MoveDeltaX and MoveDeltaY are relative to the shape origin.
 *
 * The style arrays begin at index 1, not index 0.
 * FillStyle = 1 refers to the first style in the fill style array, FillStyle = 2 refers to the second style in the fill style array, and so on.
 * A fill style index of zero means the path is not filled, and a line style index of zero means the path has no stroke.
 * Initially the fill and line style indices are set to zero—no fill or stroke.
 *
 * # FillStyle0 and FillStyle1
 * The Adobe Flash authoring tool supports two fill styles per edge, one for each side of the edge: FillStyle0 and FillStyle1.
 * For shapes that don’t self-intersect or overlap, FillStyle0 should be used.
 * For overlapping shapes the situation is more complex.
 * For example, if a shape consists of two overlapping squares, and only FillStyle0 is defined, Flash Player renders a ‘hole’ where the paths overlap.
 * This area can be filled using FillStyle1.
 * In this situation, the rule is that for any directed vector, FillStyle0 is the color to the left of the vector, and FillStyle1 is the color to the right of the vector.
 *
 * ** N.B. ** FillStyle0 and FillStyle1 should not be confused with FILLSTYLEARRAY indices. FillStyle0 and FillStyle1 are variables that contain indices into the FILLSTYLEARRAY.
 */
class StyleChangeRecord {
    /**
     * Constructs a new instance of the StyleChangeRecord class.
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
         * Fill 0 Style.
         *
         * @member {number}
         * @default
         */
        this.fillStyle0 = 0;

        /**
         * Fill 1 Style.
         *
         * @member {number}
         * @default
         */
        this.fillStyle1 = 0;

        /**
         * Line Style.
         *
         * @member {number}
         * @default
         */
        this.lineStyle = 0;

        /**
         * Delta X value.
         *
         * @member {number}
         * @default
         */
        this.moveDeltaX = 0;

        /**
         * Delta Y value.
         *
         * @member {number}
         * @default
         */
        this.moveDeltaY = 0;

        /**
         * New styles flag. Used by DefineShape2 and DefineShape3 only.
         *
         * @member {boolean}
         * @default
         */
        this.newStyles = false;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field           | Type                              | Comment                                                      |
     * |-----------------|-----------------------------------|--------------------------------------------------------------|
     * | TypeFlag        | UB[1]                             | Non-edge record flag, Always 0                               |
     * | StateNewStyles  | UB[1]                             | New styles flag. Used by DefineShape2 and DefineShape3 only. |
     * | StateLineStyle  | UB[1]                             | Line style change flag                                       |
     * | StateFillStyle1 | UB[1]                             | Fill style 1 change flag                                     |
     * | StateFillStyle0 | UB[1]                             | Fill style 0 change flag                                     |
     * | StateMoveTo     | UB[1]                             | Move to flag                                                 |
     * | MoveBits        | If StateMoveTo, UB[5]             | Move bit count                                               |
     * | MoveDeltaX      | If StateMoveTo, SB[MoveBits]      | Delta X value                                                |
     * | MoveDeltaY      | If StateMoveTo, SB[MoveBits]      | Delta Y value                                                |
     * | FillStyle0      | If StateFillStyle0, UB[FillBits]  | Fill 0 Style                                                 |
     * | FillStyle1      | If StateFillStyle1, UB[FillBits]  | Fill 1 Style                                                 |
     * | LineStyle       | If StateLineStyle, UB[LineBits]   | Line Style                                                   |
     * | FillStyles      | If StateNewStyles, FILLSTYLEARRAY | Array of new fill styles                                     |
     * | LineStyles      | If StateNewStyles, LINESTYLEARRAY | Array of new line styles                                     |
     * | NumFillBits     | If StateNewStyles, UB[4]          | Number of fill index bits for new styles                     |
     * | NumLineBits     | If StateNewStyles, UB[4]          | Number of line index bits for new styles                     |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const moveTo = Math.abs(this.moveDeltaX) + Math.abs(this.moveDeltaY) > 0;
        const numFillBits = this.fillStyles.fillStyles.length.toString(2).length;
        const numLineBits = this.lineStyles.lineStyles.length.toString(2).length;

        bitStream.writeIntBits(0, 1); // TypeFlag
        bitStream.writeIntBits(this.newStyles ? 1 : 0, 1); // StateNewStyles
        bitStream.writeIntBits(this.lineStyle > 0 ? 1 : 0, 1); // StateLineStyle
        bitStream.writeIntBits(this.fillStyle1 > 0 ? 1 : 0, 1); // StateFillStyle1
        bitStream.writeIntBits(this.fillStyle0 > 0 ? 1 : 0, 1); // StateFillStyle0
        bitStream.writeIntBits(moveTo ? 1 : 0, 1); // StateMoveTo

        if (moveTo) {
            const moveBits = bitConverter.bitsRequired([this.moveDeltaX, this.moveDeltaY]);

            bitStream.writeIntBits(moveBits, 5); // MoveBits
            bitStream.writeIntBits(this.moveDeltaX, moveBits); // MoveDeltaX
            bitStream.writeIntBits(this.moveDeltaY, moveBits); // MoveDeltaY
        }

        if (this.fillStyle0 > 0) {
            bitStream.writeIntBits(this.fillStyle0, numFillBits); // FillStyle0
        }

        if (this.fillStyle1 > 0) {
            bitStream.writeIntBits(this.fillStyle1, numFillBits); // FillStyle1
        }

        if (this.lineStyle > 0) {
            bitStream.writeIntBits(this.lineStyle, numLineBits); // LineStyle
        }

        if (this.newStyles) {
            this.fillStyles.write(bitStream); // FillStyles
            this.lineStyles.write(bitStream); // LineStyles
            bitStream.writeIntBits(numFillBits, 4); // NumFillBits
            bitStream.writeIntBits(numLineBits, 4); // NumLineBits
        }
    }
}

module.exports = StyleChangeRecord;
