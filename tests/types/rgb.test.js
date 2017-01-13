const test = require('tape');
const BitStream = require('bit-stream');
const Rgb = require('../../source/types/rgb');

test('records/rgb constructor', expect => { 
    // Give, When
    const rgb = new Rgb(0x33, 0x66, 0x99);
    
    // Then
    expect.equal(rgb.red, 0x33, 'red correct');
    expect.equal(rgb.green, 0x66, 'green correct');
    expect.equal(rgb.blue, 0x99, 'blue correct');
    expect.end();
});

test('records/rgb write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const rgb = new Rgb(0x33, 0x66, 0x99);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    rgb.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '33 66 99'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});