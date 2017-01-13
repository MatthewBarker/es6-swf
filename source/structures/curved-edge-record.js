const bitConverter = require('bit-converter');

/**
 * The SWF file format differs from most vector file formats by using Quadratic Bezier curves rather than Cubic
 * Bezier curves. PostScript™ uses Cubic Bezier curves, as do most drawing applications.The SWF file format uses
 * Quadratic Bezier curves because they can be stored more compactly, and can be rendered more efficiently.
 *
 * A Quadratic Bezier curve has 3 points: 2 on-curve anchor points, and 1 off-curve control point.
 * A Cubic Bezier curve has 4 points: 2 on-curve anchor points, and 2 off-curve control points.
 *
 * The curved-edge record stores the edge as two X-Y deltas. The three points that define the Quadratic Bezier are calculated like this:
 * 1. The first anchor point is the current drawing position.
 * 2. The control point is the current drawing position + ControlDelta.
 * 3. The last anchor point is the current drawing position + ControlDelta + AnchorDelta. The last anchor point becomes the current drawing position.
 */
class CurvedEdgeRecord {
    /**
     * Constructs a new instance of the CurvedEdgeRecord class.
     *
     * @param {number} controlDeltaX - X control point change.
     * @param {number} controlDeltaY - Y control point change.
     * @param {number} anchorDeltaX - X anchor point change.
     * @param {number} anchorDeltaY - Y anchor point change.
     */
    constructor(controlDeltaX, controlDeltaY, anchorDeltaX, anchorDeltaY) {
        /**
         * X control point change.
         *
         * @member {number}
         */
        this.controlDeltaX = controlDeltaX;

        /**
         * Y control point change.
         *
         * @member {number}
         */
        this.controlDeltaY = controlDeltaY;

        /**
         * X anchor point change.
         *
         * @member {number}
         */
        this.anchorDeltaX = anchorDeltaX;

        /**
         * Y anchor point change.
         *
         * @member {number}
         */
        this.anchorDeltaY = anchorDeltaY;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field         | Type          | Comment                                                     |
     * |---------------|---------------|-------------------------------------------------------------|
     * | TypeFlag      | UB[1]         | This is an edge record. Always 1.                           |
     * | StraightFlag  | UB[1]         | Curved edge. Always 0.                                      |
     * | NumBits       | UB[4]         | Number of bits per value. (two less than the actual number) |
     * | ControlDeltaX | SB[NumBits+2] | X control point change                                      |
     * | ControlDeltaY | SB[NumBits+2] | Y control point change                                      |
     * | AnchorDeltaX  | SB[NumBits+2] | X anchor point change                                       |
     * | AnchorDeltaY  | SB[NumBits+2] | Y anchor point change                                       |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const numberArray = [
            this.controlDeltaX,
            this.controlDeltaY,
            this.anchorDeltaX,
            this.anchorDeltaY];

        const numBits = bitConverter.bitsRequired(numberArray);

        bitStream.writeIntBits(1, 1); // TypeFlag
        bitStream.writeIntBits(0, 1); // StraightFlag
        bitStream.writeIntBits(numBits - 2, 4); // NumBits
        bitStream.writeIntBits(this.controlDeltaX, numBits); // ControlDeltaX
        bitStream.writeIntBits(this.controlDeltaY, numBits); // ControlDeltaY
        bitStream.writeIntBits(this.anchorDeltaX, numBits); // AnchorDeltaX
        bitStream.writeIntBits(this.anchorDeltaY, numBits); // AnchorDeltaY
    }
}

module.exports = CurvedEdgeRecord;
