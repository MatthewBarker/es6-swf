/**
 * The GRADRECORD defines a gradient control point.
 */
class GradRecord {
    /**
     * Constructs a new instance of the GradRecord class.
     */
    constructor() {
        throw new Error('Not implemented');
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field | Type                                 | Comment           |
     * |-------|--------------------------------------|-------------------|
     * | Ratio | UI8                                  | Ratio value       |
     * | Color | RGB (Shape1 or Shape2) RGBA (Shape3) | Color of gradient |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write() {
        throw new Error('Not implemented');
    }
}

module.exports = GradRecord;
