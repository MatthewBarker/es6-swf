/**
 * A FOCALGRADIENT must be declared in DefineShape4—not DefineShape, DefineShape2 or DefineShape3.
 * The value range is from -1.0 to 1.0, where -1.0 means the focal point is close to the left border of the radial
 * gradient circle, 0.0 means that the focal point is in the center of the radial gradient circle, and 1.0 means that
 * the focal point is close to the right border of the radial gradient circle.
 */
class FocalGradient {
    /**
     * Constructs a new instance of the FocalGradient class.
     */
    constructor() {
        throw new Error('Not implemented');
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field              | Type               | Comment                                                                                  |
     * |--------------------|--------------------|------------------------------------------------------------------------------------------|
     * | SpreadMode         | UB[2]              | 0 = Pad mode; 1 = Reflect mode; 2 = Repeat mode; 3 = Reserved                            |
     * | InterpolationMode  | UB[2]              | 0 = Normal RGB mode interpolation; 1 = Linear RGB mode interpolation; 2 and 3 = Reserved |
     * | NumGradients       | UB[4]              | 1 to 15                                                                                  |
     * | GradientRecords    | GRADRECORD[nGrads] | Gradient records                                                                         |
     * | FocalPoint         | FIXED8             | Focal point location                                                                     |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write() {
        throw new Error('Not implemented');
    }
}

module.exports = FocalGradient;
