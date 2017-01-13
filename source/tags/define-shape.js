const Bezier = require('bezier-js');
const BitStream = require('bit-stream');
const RecordHeaderLong = require('../structures/record-header-long');
const Rectangle = require('../types/rectangle');
const ShapeWithStyle = require('../structures/shape-with-style');
const StyleChangeRecord = require('../structures/style-change-record');
const StraightEdgeRecord = require('../structures/straight-edge-record');
const CurvedEdgeRecord = require('../structures/curved-edge-record');
const EndShapeRecord = require('../structures/end-shape-record');
const tags = require('../constants/tags');

/**
 * The DefineShape tag defines a shape for later use by control tags such as PlaceObject.
 * The ShapeId uniquely identifies this shape as ‘character’ in the Dictionary.
 * The ShapeBounds field is the rectangle that completely encloses the shape.
 * The SHAPEWITHSTYLE structure includes all the paths, fill styles and line styles that make up the shape.
 */
class DefineShape {
    /**
     * Constructs a new instance of the DefineShape class.
     */
    constructor() {
        /**
         * @member {number}
         * @default
         * @private
         */
        this.code = tags.DEFINE_SHAPE;

        /**
         * Id for this character.
         *
         * @member {number}
         * @default
         */
        this.id = 1;

        /**
         * Shape information.
         *
         * @member {ShapeWithStyle}
         * @default
         */
        this.shape = new ShapeWithStyle();
    }

    /**
     * Write the tag to the specified stream.
     *
     * - The ShapeId uniquely identifies this shape as ‘character’ in the Dictionary.
     * - The ShapeBounds field is the rectangle that completely encloses the shape.
     * - The SHAPEWITHSTYLE structure includes all the paths,
     * fill styles and line styles that make up the shape.
     *
     * | Field       | Type           | Comment               |
     * |-------------|----------------|-----------------------|
     * | Header      | RECORDHEADER   | Tag type = 2          |
     * | ShapeId     | UI16           | ID for this character |
     * | ShapeBounds | RECT           | Bounds of the shape   |
     * | Shapes      | SHAPEWITHSTYLE | Shape information     |
     *
     * @param {BitStream} bitStream - Bit stream to write to.
     */
    write(bitStream) {
        const bounds = this.calculateBounds();
        const subStream = new BitStream();
        const buffers = [];

        subStream.on('data', (buffer) => {
            buffers.push(buffer);
        });

        subStream.writeUInt16LE(this.id); // ShapeId
        bounds.write(subStream); // ShapeBounds
        this.shape.write(subStream); // Shapes
        subStream.align(); // Byte align
        subStream.end();

        const length = buffers.reduce(
            (accumulator, currentValue) => accumulator + currentValue.length, 0);
        const header = new RecordHeaderLong(this.code, length);

        header.write(bitStream); // Header

        buffers.forEach((buffer) => {
            for (const value of buffer.values()) {
                bitStream.writeUInt8(value);
            }
        });
    }

    /**
     * Calculate the rectangle that completely encloses the shape.
     *
     * @private
     */
    calculateBounds() {
        let currentX = 0;
        let currentY = 0;
        let nextX = 0;
        let nextY = 0;
        let radius = 0;
        const rectangles = [];

        this.shape.shapeRecords.forEach((shapeRecord) => {
            switch (shapeRecord.constructor) {
            case StyleChangeRecord: {
                currentX += shapeRecord.moveDeltaX;
                currentY += shapeRecord.moveDeltaY;

                if (shapeRecord.lineStyle) {
                    const lineStyles = this.shape.lineStyles.lineStyles;

                    radius = lineStyles[shapeRecord.lineStyle - 1].width / 2;
                }

                break;
            }
            case StraightEdgeRecord: {
                nextX = currentX + shapeRecord.deltaX;
                nextY = currentY + shapeRecord.deltaY;

                const rectangle = new Rectangle(
                        Math.min(currentX, nextX) - radius,
                        Math.max(currentX, nextX) + radius,
                        Math.min(currentY, nextY) - radius,
                        Math.max(currentY, nextY) + radius);

                rectangles.push(rectangle);
                currentX = nextX;
                currentY = nextY;

                break;
            }
            case CurvedEdgeRecord: {
                const controlX = currentX + shapeRecord.controlDeltaX;
                const controlY = currentY + shapeRecord.controlDeltaY;

                nextX = currentX + shapeRecord.anchorDeltaX;
                nextY = currentY + shapeRecord.anchorDeltaY;

                const bezier = new Bezier(currentX, currentY, controlX, controlY, nextX, nextY);
                const box = bezier.bbox();

                const rectangle = new Rectangle(
                        box.x.min - radius,
                        box.x.max + radius,
                        box.y.min - radius,
                        box.y.max + radius);

                rectangles.push(rectangle);
                currentX = nextX;
                currentY = nextY;

                break;
            }
            case EndShapeRecord: {
                currentX = 0;
                currentY = 0;

                break;
            }
            default: {
                break;
            }
            }
        });

        const bounds = rectangles.reduce((accumulator, currentValue) => new Rectangle(
                Math.min(accumulator.xMin, currentValue.xMin),
                Math.max(accumulator.xMax, currentValue.xMax),
                Math.min(accumulator.yMin, currentValue.yMin),
                Math.max(accumulator.yMax, currentValue.yMax)));

        return bounds;
    }
}

module.exports = DefineShape;
