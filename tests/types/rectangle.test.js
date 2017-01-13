const test = require('tape');
const BitStream = require('bit-stream');
const Rectangle = require('../../source/types/rectangle');

test('records/rectangle constructor (default)', expect => { 
    // Give, When
    const rectangle = new Rectangle();
    
    // Then
    expect.equal(rectangle.xMin, 0, 'xMin correct');
    expect.equal(rectangle.xMax, 0, 'xMax correct');
    expect.equal(rectangle.yMin, 0, 'yMin correct');
    expect.equal(rectangle.yMax, 0, 'yMax correct');
    expect.end();
});

// Values taken from page 222 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('records/rectangle constructor (example 1)', expect => { 
    // Give, When
    const rectangle = new Rectangle(0, 550 * 20, 0, 400 * 20);
    
    // Then
    expect.equal(rectangle.xMin, 0, 'xMin correct');
    expect.equal(rectangle.xMax, 550 * 20, 'xMax correct');
    expect.equal(rectangle.yMin, 0, 'yMin correct');
    expect.equal(rectangle.yMax, 400 * 20, 'yMax correct');
    expect.end();
});

test('records/rectangle write (example 1)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const rectangle = new Rectangle(0, 550 * 20, 0, 400 * 20);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    rectangle.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '78 00 05 5F 00 00 0F A0 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

// Values taken from page 225 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('records/rectangle constructor (example 2)', expect => { 
    // Give, When
    const rectangle = new Rectangle(100.5 * 20, 245.5 * 20, 83.5 * 20, 200.5 * 20);
    
    // Then
    expect.equal(rectangle.xMin, 100.5 * 20, 'xMin correct');
    expect.equal(rectangle.xMax, 245.5 * 20, 'xMax correct');
    expect.equal(rectangle.yMin, 83.5 * 20, 'yMin correct');
    expect.equal(rectangle.yMax, 200.5 * 20, 'yMax correct');
    expect.end();
});

test('records/rectangle write (example 2)', expect => {  
    // Given
    const bitStream = new BitStream();
    const rectangle = new Rectangle(100.5 * 20, 245.5 * 20, 83.5 * 20, 200.5 * 20);
    const buffers = [];
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    rectangle.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '70 FB 49 97 0D 0C 7D 50'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});