// External
const memoryStreams = require('memory-streams');
const test = require('tape');
// File
const FileHeader = require('../../source/file/file-header');
const Flash = require('../../source/file/flash');
//Structures
const EndShapeRecord = require('../../source/structures/end-shape-record');
const LineStyle = require('../../source/structures/line-style');
const ShapeWithStyle = require('../../source/structures/shape-with-style');
const StraightEdgeRecord = require('../../source/structures/straight-edge-record');
const StyleChangeRecord = require('../../source/structures/style-change-record');
//Tags
const DefineShape = require('../../source/tags/define-shape');
const End = require('../../source/tags/end');
const PlaceObject2 = require('../../source/tags/place-object-2');
const SetBackgroundColor = require('../../source/tags/set-background-color');
const ShowFrame = require('../../source/tags/show-frame');
// Types
const Matrix = require('../../source/types/matrix');
const Rgb = require('../../source/types/rgb');

test('file/flash constructor', expect => { 
    // Give, When
    const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
    const flash = new Flash(fileHeader);
    
    // Then
    expect.equal(flash.fileHeader, fileHeader, 'fileHeader correct');
    expect.equal(flash.tags.length, 0, 'tags length correct');
    expect.end();
});

test('file/flash write (empty)', expect => {  
    // Given
    const stream = new memoryStreams.WritableStream();
    const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
    const flash = new Flash(fileHeader);
    
    // When
    flash.write(stream);
    stream.end();

    // Then
    const buffer = stream.toBuffer();
    const expected = ('46 57 53 03 15 00 00 00 78 00 05 5F 00 00 0F A0' +
                      '00 00 0C 01 00').replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

// Values taken from page 221 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('file/flash write', expect => {  
    // Given
    const stream = new memoryStreams.WritableStream();
    const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
    const flash = new Flash(fileHeader);
    const setBackgroundColor = new SetBackgroundColor();
    const defineShape = new DefineShape();
    const shapeWithStyle = new ShapeWithStyle();
    const shapeRecord1 = new StyleChangeRecord();
    const shapeRecord2 = new StraightEdgeRecord(0, 2320);
    const shapeRecord3 = new StraightEdgeRecord(-2880, 0);
    const shapeRecord4 = new StraightEdgeRecord(0, -2320);
    const shapeRecord5 = new StraightEdgeRecord(2880, 0);
    const shapeRecord6 = new EndShapeRecord();
    const placeObject2 = new PlaceObject2();
    const showFrame = new ShowFrame();
    const end = new End();
    
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
    
    placeObject2.matrix = new Matrix();
    
    flash.tags.push(setBackgroundColor);
    flash.tags.push(defineShape);
    flash.tags.push(placeObject2);
    flash.tags.push(showFrame);
    flash.tags.push(end);
    
    // When
    flash.write(stream);
    stream.end();

    // Then
    const buffer = stream.toBuffer();
    const expected = ('46 57 53 03 4F 00 00 00 78 00 05 5F 00 00 0F A0' +
    '00 00 0C 01 00 43 02 FF FF FF BF 00 23 00 00 00' +
    '01 00 70 FB 49 97 0D 0C 7D 50 00 01 14 00 00 00' +
    '00 01 25 C9 92 0D 21 ED 48 87 65 30 3B 6D E1 D8' +
    'B4 00 00 86 06 06 01 00 01 00 00 40 00 00 00').replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});
