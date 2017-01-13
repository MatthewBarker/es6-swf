const test = require('tape');
const BitStream = require('bit-stream');
const LineStyle = require('../../source/structures/line-style');
const LineStyleArray = require('../../source/structures/line-style-array');
const Rgb = require('../../source/types/rgb');

// Values taken from page 227 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/line-style-array constructor', expect => { 
    // Give, When
    const lineStyleArray = new LineStyleArray();
    
    lineStyleArray.lineStyles.push(new LineStyle(20, new Rgb(0x00, 0x00, 0x00)));
    
    // Then
    expect.equal(lineStyleArray.lineStyles.length, 1, 'styles empty');
    expect.end();
});

test('structures/line-style-array write (empty)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const lineStyleArray = new LineStyleArray();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    lineStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00';

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

test('structures/line-style-array write (short)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const lineStyleArray = new LineStyleArray();
    
    lineStyleArray.lineStyles.push(new LineStyle(20, new Rgb(0x00, 0x00, 0x00)));    
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    lineStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '01 14 00 00 00 00'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

test('structures/line-style-array write (long)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const lineStyleArray = new LineStyleArray();
    
    while (lineStyleArray.lineStyles.length < 255) {
        lineStyleArray.lineStyles.push(new LineStyle(20, new Rgb(0x00, 0x00, 0x00)));    
    }
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    lineStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = 'FF FF 00'.replace(/\s/g,'');

    expect.equal(buffer.length, 1278, 'data length correct');
    expect.equal(buffer.slice(0, 3).toString('hex').toUpperCase(), expected, 'extended count bytes match expected'); 
    expect.end();
});