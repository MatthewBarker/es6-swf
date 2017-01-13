const test = require('tape');
const BitStream = require('bit-stream');
const DefineShape = require('../../source/tags/define-shape');
const EndShapeRecord = require('../../source/structures/end-shape-record');
const LineStyle = require('../../source/structures/line-style');
const Rgb = require('../../source/types/rgb');
const ShapeWithStyle = require('../../source/structures/shape-with-style');
const StraightEdgeRecord = require('../../source/structures/straight-edge-record');
const StyleChangeRecord = require('../../source/structures/style-change-record');

test('tags/define-shape constructor', expect => { 
    // Give, When
    const defineShape = new DefineShape();
    
    // Then
    expect.equal(defineShape.id, 1);
    expect.deepEqual(defineShape.shape, new ShapeWithStyle());
    expect.end();
});

// Values taken from page 224 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('tags/define-shape write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const defineShape = new DefineShape();
    const shapeWithStyle = new ShapeWithStyle();
    const shapeRecord1 = new StyleChangeRecord();
    const shapeRecord2 = new StraightEdgeRecord(0, 2320);
    const shapeRecord3 = new StraightEdgeRecord(-2880, 0);
    const shapeRecord4 = new StraightEdgeRecord(0, -2320);
    const shapeRecord5 = new StraightEdgeRecord(2880, 0);
    const shapeRecord6 = new EndShapeRecord();
    
    shapeWithStyle.lineStyles.lineStyles.push(new LineStyle(20, new Rgb(0x00, 0x00, 0x00)));  

    shapeRecord1.moveDeltaX = 4900;
    shapeRecord1.moveDeltaY = 1680;
    shapeRecord1.lineStyle = 1;

    shapeWithStyle.shapeRecords.push(shapeRecord1);
    shapeWithStyle.shapeRecords.push(shapeRecord2);
    shapeWithStyle.shapeRecords.push(shapeRecord3);
    shapeWithStyle.shapeRecords.push(shapeRecord4);
    shapeWithStyle.shapeRecords.push(shapeRecord5);
    shapeWithStyle.shapeRecords.push(shapeRecord6);
    
    defineShape.shape = shapeWithStyle;
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    defineShape.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = ('BF 00 23 00 00 00 01 00 70 FB 49 97 0D 0C 7D 50' +
        '00 01 14 00 00 00 00 01 25 C9 92 0D 21 ED 48 87' + 
        '65 30 3B 6D E1 D8 B4 00 00').replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});