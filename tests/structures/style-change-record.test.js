const test = require('tape');
const BitStream = require('bit-stream');
const LineStyle = require('../../source/structures/line-style');
const Rgb = require('../../source/types/rgb');
const StyleChangeRecord = require('../../source/structures/style-change-record');

test('structures/style-change-record constructor', expect => {  
    // Give, When
    const styleChangeRecord = new StyleChangeRecord();
    
    // Then
    expect.equal(styleChangeRecord.fillStyles.fillStyles.length, 0, 'fill styles empty');
    expect.equal(styleChangeRecord.lineStyles.lineStyles.length, 0, 'line styles empty');
    expect.equal(styleChangeRecord.fillStyle0, 0, 'no fill style 0');
    expect.equal(styleChangeRecord.fillStyle1, 0, 'no fill style 1');
    expect.equal(styleChangeRecord.lineStyle, 0, 'no line style');
    expect.equal(styleChangeRecord.moveDeltaX, 0, 'no x axis movement');
    expect.equal(styleChangeRecord.moveDeltaY, 0, 'no y axis movement');
    expect.equal(styleChangeRecord.newStyles, false, 'no new styles');
    expect.end();
});

test('structures/style-change-record write (empty)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const styleChangeRecord = new StyleChangeRecord();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    styleChangeRecord.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00';

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

// Values taken from page 230 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/style-change-record write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const styleChangeRecord = new StyleChangeRecord();

    styleChangeRecord.moveDeltaX = 4900;
    styleChangeRecord.moveDeltaY = 1680;
    styleChangeRecord.lineStyle = 1;
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    styleChangeRecord.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '25 C9 92 0D 21'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});