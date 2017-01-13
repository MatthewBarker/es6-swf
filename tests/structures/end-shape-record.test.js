const test = require('tape');
const BitStream = require('bit-stream');
const EndShapeRecord = require('../../source/structures/end-shape-record');

test('structures/end-shape-record write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const endShapeRecord = new EndShapeRecord();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    endShapeRecord.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00';

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});