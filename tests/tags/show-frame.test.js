const test = require('tape');
const BitStream = require('bit-stream');
const ShowFrame = require('../../source/tags/show-frame');

test('tags/show-frame write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const showFrame = new ShowFrame();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    showFrame.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '40 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});