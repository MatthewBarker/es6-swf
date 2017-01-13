const BitStream = require('bit-stream');
const RecordHeaderShort = require('../structures/record-header-short');
const tags = require('../constants/tags');

/**
 * The PlaceObject2 tag extends the functionality of the PlaceObject tag. The PlaceObject2 tag can both add a
 * character to the display list, and modify the attributes of a character that is already on the display list. The
 * PlaceObject2 tag changed slightly from SWF 4 to SWF 5. In SWF 5, clip actions were added.
 *
 * The tag begins with a group of flags that indicate which fields are present in the tag. The optional fields are
 * CharacterId, Matrix, ColorTransform, Ratio, ClipDepth, Name, and ClipActions. The Depth field is the only field
 * that is always required.
 *
 * The depth value determines the stacking order of the character. Characters with lower depth values are
 * displayed underneath characters with higher depth values. A depth value of 1 means the character is displayed
 * at the bottom of the stack. Any given depth can have only one character. This means a character that is already
 * on the display list can be identified by its depth alone (that is, a CharacterId is not required).
 *
 * The PlaceFlagMove and PlaceFlagHasCharacter tags indicate whether a new character is being added to the
 * display list, or a character already on the display list is being modified. The meaning of the flags is as follows:
 *
 * # PlaceFlagMove = 0 and PlaceFlagHasCharacter = 1
 *
 * A new character (with ID of CharacterId) is placed on the display list at the specified depth. Other fields
 * set the attributes of this new character.
 *
 * # PlaceFlagMove = 1 and PlaceFlagHasCharacter = 0
 *
 * The character at the specified depth is modified. Other fields modify the attributes of this character.
 * Because any given depth can have only one character, no CharacterId is required.
 *
 * # PlaceFlagMove = 1 and PlaceFlagHasCharacter = 1
 *
 * The character at the specified Depth is removed, and a new character (with ID of CharacterId) is placed
 * at that depth. Other fields set the attributes of this new character.
 *
 * Frames replace the transformation matrix of the character at the desired depth. For example, a character that is
 * moved over a series of frames has PlaceFlagHasCharacter set in the first frame, and PlaceFlagMove set in
 * subsequent frames. The first frame places the new character at the desired depth, and sets the initial
 * transformation matrix.
 * The optional fields in PlaceObject2 have the following meaning:
 * - The CharacterId field specifies the character to be added to the display list. CharacterId is used only
 * when a new character is being added. If a character that is already on the display list is being modified,
 * the CharacterId field is absent.
 * - The Matrix field specifies the position, scale and rotation of the character being added or modified.
 * - The ColorTransform field specifies the color effect applied to the character being added or modified.
 * - The Ratio field specifies a morph ratio for the character being added or modified. This field applies only
 * to characters defined with DefineMorphShape, and controls how far the morph has progressed. A ratio
 * of zero displays the character at the start of the morph. A ratio of 65535 displays the character at the
 * end of the morph. For values between zero and 65535 Flash Player interpolates between the start and
 * end shapes, and displays an in- between shape.
 * - The ClipDepth field specifies the top-most depth that will be masked by the character being added. A
 * ClipDepth of zero indicates that this is not a clipping character.
 * - The Name field specifies a name for the character being added or modified. This field is typically used
 * with sprite characters, and is used to identify the sprite for SetTarget actions. It allows the main file (or
 * other sprites) to perform actions inside the sprite (see Chapter 13: Sprites and Movie Clips).
 * - The ClipActions field, which is valid only for placing sprite characters, defines one or more event
 * handlers to be invoked when certain events occur.
 *
 * The minimum file format version is SWF 3.
 */
class PlaceObject2 {
    /**
     * Constructs a new instance of the PlaceObject2 class.
     */
    constructor() {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.PLACE_OBJECT_2;

        /**
         * Defines a character to be moved.
         *
         * @member {boolean}
         * @default
         */
        this.placeFlagMove = false;

        /**
         * Depth of character.
         *
         * @member {number}
         * @default
         */
        this.depth = 1;

        /**
         * ID of character to place.
         *
         * @member {number}
         * @default
         */
        this.characterId = 1;

        /**
         * Transform matrix data.
         *
         * @member {Matrix}
         * @default
         */
        this.matrix = null;

        /**
         * Color transform data.
         *
         * @member {CXFORMWITHALPHA}
         * @default
         */
        this.colorTransform = null;

        /**
         * Ratio.
         *
         * @member {number}
         * @default
         */
        this.ratio = null;

        /**
         * Name of character.
         *
         * @member {string}
         * @default
         */
        this.name = null;

        /**
         * Clip depth.
         *
         * @member {number}
         * @default
         */
        this.clipDepth = null;

        /**
         * SWF 5 and later: Clip Actions Data.
         *
         * @member {ClipActions}
         * @default
         */
        this.clipActions = null;
    }

    /**
     * Write the tag to the specified stream.
     *
     * | Field                      | Type                                           | Comment                                                                        |
     * |----------------------------|------------------------------------------------|--------------------------------------------------------------------------------|
     * | Header                     | RECORDHEADER                                   | Tag type = 26                                                                  |
     * | PlaceFlagHasClipActions    | UB[1]                                          | SWF 5 and later: has clip actions (sprite characters only) Otherwise: always 0 |
     * | PlaceFlagHasClipDepth      | UB[1]                                          | Has clip depth                                                                 |
     * | PlaceFlagHasName           | UB[1]                                          | Has name                                                                       |
     * | PlaceFlagHasRatio          | UB[1]                                          | Has ratio                                                                      |
     * | PlaceFlagHasColorTransform | UB[1]                                          | Has color transform                                                            |
     * | PlaceFlagHasMatrix         | UB[1]                                          | Has matrix                                                                     |
     * | PlaceFlagHasCharacter      | UB[1]                                          | Places a character                                                             |
     * | PlaceFlagMove              | UB[1]                                          | Defines a character to be moved                                                |
     * | Depth                      | UI16                                           | Depth of character                                                             |
     * | CharacterId                | If PlaceFlagHasCharacter, UI16                 | ID of character to place                                                       |
     * | Matrix                     | If PlaceFlagHasMatrix, MATRIX                  | Transform matrix data                                                          |
     * | ColorTransform             | If PlaceFlagHasColorTransform, CXFORMWITHALPHA | Color transform data                                                           |
     * | Ratio                      | If PlaceFlagHasRatio, UI16                     |                                                                                |
     * | Name                       | If PlaceFlagHasName, STRING                    | Name of character                                                              |
     * | ClipDepth                  | If PlaceFlagHasClipDepth, UI16                 | Clip depth (see “Clipping layers”)                                             |
     * | ClipActions                | If PlaceFlagHasClipActions, CLIPACTIONS        | SWF 5 and later: Clip Actions Data                                             |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const subStream = new BitStream();
        const buffers = [];

        subStream.on('data', (buffer) => {
            buffers.push(buffer);
        });

        subStream.writeIntBits(this.clipActions ? 1 : 0, 1); // PlaceFlagHasClipActions
        subStream.writeIntBits(this.clipDepth ? 1 : 0, 1); // PlaceFlagHasClipDepth
        subStream.writeIntBits(this.name ? 1 : 0, 1); // PlaceFlagHasName
        subStream.writeIntBits(this.ratio ? 1 : 0, 1); // PlaceFlagHasRatio
        subStream.writeIntBits(this.colorTransform ? 1 : 0, 1); // PlaceFlagHasColorTransform
        subStream.writeIntBits(this.matrix ? 1 : 0, 1); // PlaceFlagHasMatrix
        subStream.writeIntBits(this.characterId ? 1 : 0, 1); // PlaceFlagHasCharacter
        subStream.writeIntBits(this.placeFlagMove ? 1 : 0, 1); // PlaceFlagMove
        subStream.writeUInt16LE(this.depth); // Depth

        if (this.characterId) {
            subStream.writeUInt16LE(this.characterId); // CharacterId
        }

        if (this.matrix) {
            this.matrix.write(subStream); // Matrix
        }

        if (this.colorTransform) {
            this.colorTransform.write(subStream); // ColorTransform
        }

        if (this.ratio) {
            subStream.writeUInt16LE(this.ratio); // Ratio
        }

        if (this.name) {
            subStream.write(this.name); // Name
        }

        if (this.clipDepth) {
            subStream.writeUInt16LE(this.clipDepth); // ClipDepth
        }

        if (this.clipActions) {
            this.clipActions.write(subStream); // ClipActions
        }

        subStream.align(); // Byte align

        subStream.end();

        const length = buffers.reduce(
            (accumulator, currentValue) => accumulator + currentValue.length, 0);
        const header = new RecordHeaderShort(this.code, length);

        header.write(bitStream); // Header

        buffers.forEach((buffer) => {
            for (const value of buffer.values()) {
                bitStream.writeUInt8(value);
            }
        });
    }
}

module.exports = PlaceObject2;
