/**
 * Clip actions are valid for placing sprite characters only. Clip actions define event handlers for a sprite character.
 */
class ClipActions {
    /**
     * Constructs a new instance of the ClipActions class.
     */
    constructor() {
        throw new Error('Not implemented');
    }

    /**
     * Writes the structure to a bit stream.
     *
     * | Field             | Type                                                 | Comment                               |
     * |-------------------|------------------------------------------------------|---------------------------------------|
     * | Reserved          | UI16                                                 | Must be 0                             |
     * | AllEventFlags     | CLIPEVENTFLAGS                                       | All events used in these clip actions |
     * | ClipActionRecords | CLIPACTIONRECORD [one or more]                       | Individual event handlers             |
     * | ClipActionEndFlag | If SWF version <= 5, UI16, If SWF version >= 6, UI32 | Must be 0                             |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    static write() {
        throw new Error('Not implemented');
    }
}

module.exports = ClipActions;
