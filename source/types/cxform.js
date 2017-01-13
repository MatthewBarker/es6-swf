/**
 * The CXFORM record defines a simple transform that can be applied to the color space of a graphic object.
 * The following are the two types of transform possible:
 *
 * - Multiplication transforms
 * - Addition transforms
 *
 * Multiplication transforms multiply the red, green, and blue components by an 8.8 fixed-point multiplication term.
 * The fixed-point representation of 1.0 is 0x100 or 256 decimal.
 *
 * For any color (R,G,B), the transformed color (R', G', B') is calculated as follows:
 *
 * - R' = (R * RedMultTerm) / 256
 * - G' = (G * GreenMultTerm) / 256
 * - B' = (B * BlueMultTerm) / 256
 *
 * Addition transforms add an addition term (positive or negative) to the red, green, and blue components of the object being displayed.
 * If the result is greater than 255, the result is clamped to 255. If the result is less than zero, the result is clamped to zero.
 *
 * For any color (R,G,B), the transformed color (R', G', B') is calculated as follows:
 *
 * - R' = max(0, min(R + RedAddTerm, 255))
 * - G' = max(0, min(G + GreenAddTerm, 255))
 * - B' = max(0, min(B + BlueAddTerm, 255))
 *
 * Addition and multiplication transforms can be combined as follows. The multiplication operation is performed first:
 *
 * - R' = max(0, min(((R * RedMultTerm) / 256) + RedAddTerm, 255))
 * - G' = max(0, min(((G * GreenMultTerm) / 256) + GreenAddTerm, 255))
 * - B' = max(0, min(((B * BlueMultTerm) / 256) + BlueAddTerm, 255))
 *
 * The CXFORM record must be byte aligned.
 */
class Cxform {
    /**
     * Constructs a new instance of the Cxform class.
     */
    constructor() {
        throw new Error('Not implemented');
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field         | Type                           | Comment                                 |
     * |---------------|--------------------------------|-----------------------------------------|
     * | HasAddTerms   | UB[1]                          | Has color addition values if equal to 1 |
     * | HasMultTerms  | UB[1]                          | Has color multiply values if equal to 1 |
     * | Nbits         | UB[4] color value              | Bits in each value field                |
     * | RedMultTerm   | If HasMultTerms = 1, SB[Nbits] | Red multiply value                      |
     * | GreenMultTerm | If HasMultTerms = 1, SB[Nbits] | Green multiply value                    |
     * | BlueMultTerm  | If HasMultTerms = 1, SB[Nbits] | Blue multiply value                     |
     * | RedAddTerm    | If HasAddTerms = 1, SB[Nbits]  | Red addition value                      |
     * | GreenAddTerm  | If HasAddTerms = 1, SB[Nbits]  | Green addition value                    |
     * | BlueAddTerm   | If HasAddTerms = 1, SB[Nbits]  | Blue addition value                     |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write() {
        throw new Error('Not implemented');
    }
}

module.exports = Cxform;
