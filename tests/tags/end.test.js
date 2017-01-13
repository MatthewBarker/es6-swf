const test = require('tape');
const BitStream = require('bit-stream');
const End = require('../../source/tags/end');

test('tags/end write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const end = new End();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    end.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});