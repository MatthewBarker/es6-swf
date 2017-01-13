const test = require('tape');
const BitStream = require('bit-stream');
const LineStyle = require('../../source/structures/line-style');
const Rgb = require('../../source/types/rgb');

test('structures/line-style constructor (default)', expect => { 
    // Give, When
    const lineStyle = new LineStyle();
    
    // Then
    expect.equal(lineStyle.width, 20, 'width correct');
    expect.deepEqual(lineStyle.color, new Rgb(0xFF, 0xFF, 0xFF), 'color correct');
    expect.end();
});

// Values taken from page 227 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/line-style constructor (parameters)', expect => { 
    // Give, When
    const lineStyle = new LineStyle(20, new Rgb(0x00, 0x00, 0x00));
    
    // Then
    expect.equal(lineStyle.width, 20, 'width correct');
    expect.deepEqual(lineStyle.color, new Rgb(0x00, 0x00, 0x00), 'color correct');
    expect.end();
});

test('structures/line-style write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const lineStyle = new LineStyle(20, new Rgb(0x00, 0x00, 0x00));
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    lineStyle.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '14 00 00 00 00'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});