const bitConverter = require('bit-converter');

/**
 * The MATRIX record represents a standard 2x3 transformation matrix of the sort commonly used in 2D graphics.
 *
 * It is used to describe the scale, rotation, and translation of a graphic object. The MATRIX record must be byte
 * aligned.
 *
 * The ScaleX, ScaleY, RotateSkew0 and RotateSkew1 fields are stored as 16.16 fixed-point values.
 * The TranslateX and TranslateY values are stored as signed values in twips.
 *
 * The MATRIX record is optimized for common cases such as a matrix that performs a translation only. In this case,
 * the HasScale and HasRotate flags are zero, and the matrix only contains the TranslateX and TranslateY fields.
 *
 * The mapping from the MATRIX fields to the 2x3 matrix is as follows:
 *
 * | ScaleX        | RotateSkew0 |
 * | RotateSkew1   | ScaleY      |
 * | TranslateX    | TranslateY  |
 *
 * For any coordinates (x, y), the transformed coordinates (x', y') are calculated as follows:
 *
 * - x' = x * ScaleX + y * RotateSkew1 + TranslateX
 * - y' = x * RotateSkew0 + y * ScaleY + TranslateY
 *
 * The following table describes how the members of the matrix are used for each type of operation:
 *
 * | Operation  | ScaleX                          | RotateSkew0                         | RotateSkew1                       | ScaleY                        |
 * |------------|---------------------------------|-------------------------------------|-----------------------------------|-------------------------------|
 * | Rotation   | Cosine                          | Sine                                | Negative sine                     | Cosine                        |
 * | Scaling    | Horizontal scaling component    | Nothing                             | Nothing                           | Vertical scaling component    |
 * | Shear      | Nothing                         | Horizontal proportionality constant | Vertical proportionality constant | Nothing                       |
 * | Reflection | Horizontal reflection component | Nothing                             | Nothing                           | Vertical reflection component |
 */
class Matrix {
    /**
     * Constructs a new instance of the Matrix class.
     *
     * @param {number} [translateX = 0] - X translate value in twips.
     * @param {number} [translateY = 0] - Y translate value in twips.
     * @param {number} [scaleX = 0] - X scale value.
     * @param {number} [scaleY = 0] - Y scale value.
     * @param {number} [rotateSkew0 = 0] - First rotate and skew value.
     * @param {number} [rotateSkew1 = 0] - Second rotate and skew value.
     */
    constructor(translateX = 0,
        translateY = 0,
        scaleX = 0,
        scaleY = 0,
        rotateSkew0 = 0,
        rotateSkew1 = 0) {
        /**
         * X translate value in twips.
         *
         * @member {number}
         */
        this.translateX = translateX;

        /**
         * Y translate value in twips.
         *
         * @member {number}
         */
        this.translateY = translateY;

        /**
         * X scale value.
         *
         * @member {number}
         */
        this.scaleX = scaleX;

        /**
         * Y scale value.
         *
         * @member {number}
         */
        this.scaleY = scaleY;

        /**
         * First rotate and skew value.
         *
         * @member {number}
         */
        this.rotateSkew0 = rotateSkew0;

        /**
         * Second rotate and skew value.
         *
         * @member {number}
         */
        this.rotateSkew1 = rotateSkew1;
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field          | Type                              | Comment                                  |
     * |----------------|-----------------------------------|------------------------------------------|
     * | HasScale       | UB[1]                             | Has scale values if equal to 1           |
     * | NScaleBits     | If HasScale = 1, UB[5]            | Bits in each scale value field           |
     * | ScaleX         | If HasScale = 1, FB[NScaleBits]   | x scale value                            |
     * | ScaleY         | If HasScale = 1, FB[NScaleBits]   | y scale value                            |
     * | HasRotate      | UB[1]                             | Has rotate and skew values if equal to 1 |
     * | NRotateBits    | If HasRotate = 1, UB[5]           | Bits in each rotate value field          |
     * | RotateSkew0    | If HasRotate = 1, FB[NRotateBits] | First rotate and skew value              |
     * | RotateSkew1    | If HasRotate = 1, FB[NRotateBits] | Second rotate and skew value             |
     * | NTranslateBits | UB[5]                             | Bits in each translate value field       |
     * | TranslateX     | SB[NTranslateBits]                | x translate value in twips               |
     * | TranslateY     | SB[NTranslateBits]                | y translate value in twips               |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const hasScale = this.scaleX > 0 || this.scaleY > 0;

        bitStream.writeIntBits(hasScale ? 1 : 0, 1); // HasScale

        if (hasScale) {
            // 16.16 fixed point numbers
            // Get bits to store the integer
            const numberArray = [Math.trunc(this.scaleX), Math.trunc(this.scaleY)];
            const nScaleBits = bitConverter.bitsRequired(numberArray);

            // Need to add 16 bits for the decimal places
            bitStream.writeIntBits(nScaleBits + 16, 5); // NScaleBits

            // Multiply by scale factor
            const scaleX = Math.trunc(this.scaleX * 65536);
            const scaleY = Math.trunc(this.scaleY * 65536);

            bitStream.writeIntBits(scaleX, nScaleBits); // ScaleX
            bitStream.writeIntBits(scaleY, nScaleBits); // ScaleY
        }

        const hasRotate = this.rotateSkew0 > 0 || this.rotateSkew1 > 0;

        bitStream.writeIntBits(hasRotate ? 1 : 0, 1); // HasRotate

        if (hasRotate) {
            // 16.16 fixed point numbers
            // Get bits to store the integer
            const numberArray = [Math.trunc(this.rotateSkew0), Math.trunc(this.rotateSkew1)];
            const nRotateBits = bitConverter.bitsRequired(numberArray);

            // Need to add 16 bits for the decimal places
            bitStream.writeIntBits(nRotateBits + 16, 5); // NRotateBits

            // Multiply by scale factor
            const rotateSkew0 = Math.trunc(this.scaleX * 65536);
            const rotateSkew1 = Math.trunc(this.scaleY * 65536);

            bitStream.writeIntBits(rotateSkew0, nRotateBits); // RotateSkew0
            bitStream.writeIntBits(rotateSkew1, nRotateBits); // RotateSkew1
        }

        let nTranslateBits = 0;

        if (this.translateX || this.translateY) {
            nTranslateBits = bitConverter.bitsRequired([this.translateX, this.translateY]);
        }

        bitStream.writeIntBits(nTranslateBits, 5); // NTranslateBits

        if (nTranslateBits) {
            bitStream.writeIntBits(this.translateX, nTranslateBits); // TranslateX
            bitStream.writeIntBits(this.translateY, nTranslateBits); // TranslateY
        }

        bitStream.align(); // Byte align
    }
}

module.exports = Matrix;
