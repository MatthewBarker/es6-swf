/**
 * SWF 8 and later supports up to 15 gradient control points, spread modes and a new interpolation type.
 * Note that for the DefineShape, DefineShape2 or DefineShape3 tags, the SpreadMode and InterpolationMode
 * fields must be 0, and the NumGradients field cannot exceed 8.
 */
class Gradient {
    /**
     * Constructs a new instance of the Gradient class.
     */
    constructor() {
        throw new Error('Not implemented');
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field             | Type               | Comment                                                                                  |
     * |-------------------|--------------------|------------------------------------------------------------------------------------------|
     * | SpreadMode        | UB[2]              | 0 = Pad mode; 1 = Reflect mode; 2 = Repeat mode; 3 = Reserved                            |
     * | InterpolationMode | UB[2]              | 0 = Normal RGB mode interpolation; 1 = Linear RGB mode interpolation; 2 and 3 = Reserved |
     * | NumGradients      | UB[4]              | 1 to 15                                                                                  |
     * | GradientRecords   | GRADRECORD[nGrads] | Gradient records                                                                         |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write() {
        throw new Error('Not implemented');
    }
}

module.exports = Gradient;
