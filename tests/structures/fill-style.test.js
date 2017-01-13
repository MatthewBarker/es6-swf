const test = require('tape');
const BitStream = require('bit-stream');
const FillStyle = require('../../source/structures/fill-style');
const fillStyleTypes = require('../../source/constants/fill-style-types');
const Rgb = require('../../source/types/rgb');

test('structures/fill-style constructor', expect => { 
    // Give, When
    const fillStyle = new FillStyle();
    
    // Then
    expect.equal(fillStyle.fillStyleType, fillStyleTypes.SOLID_FILL, 'default type is solid');
    expect.deepEqual(fillStyle.color, new Rgb(0xFF, 0xFF, 0xFF), 'default color is white');
    expect.equal(fillStyle.gradientMatrix, null, 'default gradient matrix is null');
    expect.equal(fillStyle.gradient, null, 'default gradient is null');
    expect.equal(fillStyle.bitmapId, null, 'default bitmap id is null');
    expect.equal(fillStyle.bitmapMatrix, null, 'default bitmap matrix is null');
    expect.end();
});

test('structures/fill-style-array write (solid fill)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const fillStyle = new FillStyle();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    fillStyle.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00 FF FF FF'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});