const test = require('tape');
const BitStream = require('bit-stream');
const EndShapeRecord = require('../../source/structures/end-shape-record');
const LineStyle = require('../../source/structures/line-style');
const Rgb = require('../../source/types/rgb');
const ShapeWithStyle = require('../../source/structures/shape-with-style');
const StraightEdgeRecord = require('../../source/structures/straight-edge-record');
const StyleChangeRecord = require('../../source/structures/style-change-record');

test('structures/shape-with-style constructor', expect => {  
    // Give, When
    const shapeWithStyle = new ShapeWithStyle();
    
    // Then
    expect.equal(shapeWithStyle.fillStyles.fillStyles.length, 0, 'fill styles empty');
    expect.equal(shapeWithStyle.lineStyles.lineStyles.length, 0, 'line styles empty');
    expect.equal(shapeWithStyle.shapeRecords.length, 0, 'shape records empty');
    expect.end();
});

// Values taken from page 226 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/shape-with-style write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
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
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    shapeWithStyle.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = ('00 01 14 00 00 00 00 01 25 C9 92 0D 21 ED 48 87' + 
          '65 30 3B 6D E1 D8 B4 00 00').replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});
