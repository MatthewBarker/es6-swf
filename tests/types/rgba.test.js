const test = require('tape');
const BitStream = require('bit-stream');
const Rgba = require('../../source/types/rgba');

test('records/rgba constructor', expect => { 
    // Give, When
    const rgba = new Rgba(0x33, 0x66, 0x99, 0xFF);
    
    // Then
    expect.equal(rgba.red, 0x33, 'red correct');
    expect.equal(rgba.green, 0x66, 'green correct');
    expect.equal(rgba.blue, 0x99, 'blue correct');
    expect.equal(rgba.alpha, 0xFF, 'alpha correct');
    expect.end();
});

test('records/rgba write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const rgba = new Rgba(0x33, 0x66, 0x99, 0xFF);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    rgba.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '33 66 99 FF'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});