const test = require('tape');
const BitStream = require('bit-stream');
const Argb = require('../../source/types/argb');

test('records/argb constructor', expect => { 
    // Give, When
    const argb = new Argb(0x33, 0x66, 0x99, 0xFF);
    
    // Then
    expect.equal(argb.red, 0x33, 'red correct');
    expect.equal(argb.green, 0x66, 'green correct');
    expect.equal(argb.blue, 0x99, 'blue correct');
    expect.equal(argb.alpha, 0xFF, 'alpha correct');
    expect.end();
});

test('records/rgba write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const argb = new Argb(0x33, 0x66, 0x99, 0xFF);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    argb.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = 'FF 33 66 99'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});