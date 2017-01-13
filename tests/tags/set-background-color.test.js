const test = require('tape');
const BitStream = require('bit-stream');
const SetBackgroundColor = require('../../source/tags/set-background-color');
const Rgb = require('../../source/types/rgb');

test('tags/set-background-color default constructor', expect => { 
    // Give, When
    const setBackgroundColor = new SetBackgroundColor();
    
    // Then
    expect.deepEqual(setBackgroundColor.color, new Rgb(0xFF, 0xFF, 0xFF));
    expect.end();
});

test('tags/set-background-color red constructor', expect => { 
    // Give, When
    const setBackgroundColor = new SetBackgroundColor(new Rgb(0xFF, 0x00, 0x00));
    
    // Then
    expect.deepEqual(setBackgroundColor.color, new Rgb(0xFF, 0x00, 0x00));
    expect.end();
});

// Values taken from page 224 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('tags/set-background-color write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const setBackgroundColor = new SetBackgroundColor();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    setBackgroundColor.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '43 02 FF FF FF'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});