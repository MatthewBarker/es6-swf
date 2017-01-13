const test = require('tape');
const BitStream = require('bit-stream');
const FillStyle = require('../../source/structures/fill-style');
const FillStyleArray = require('../../source/structures/fill-style-array');

test('structures/fill-style-array constructor', expect => { 
    // Give, When
    const fillStyleArray = new FillStyleArray();
    
    // Then
    expect.equal(fillStyleArray.fillStyles.length, 0, 'styles empty');
    expect.end();
});

test('structures/fill-style-array write (empty)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const fillStyleArray = new FillStyleArray();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    fillStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);    
    const expected = '00';
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

test('structures/fill-style-array write (short)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const fillStyleArray = new FillStyleArray();
    
    fillStyleArray.fillStyles.push(new FillStyle());
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    fillStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '01 00 FF FF FF'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

test('structures/fill-style-array write (long)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const fillStyleArray = new FillStyleArray();
    
    while (fillStyleArray.fillStyles.length < 255) {
        fillStyleArray.fillStyles.push(new FillStyle());    
    }   

    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    fillStyleArray.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = 'FF FF 00'.replace(/\s/g,'');

    expect.equal(buffer.length, 1023, 'data length correct');
    expect.equal(buffer.slice(0, 3).toString('hex').toUpperCase(), expected, 'extended count bytes match expected'); 
    expect.end();
});