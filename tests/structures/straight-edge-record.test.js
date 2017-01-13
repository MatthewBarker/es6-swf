const test = require('tape');
const BitStream = require('bit-stream');
const StraightEdgeRecord = require('../../source/structures/straight-edge-record');

// Values taken from page 230 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/straight-edge-record constructor', expect => {  
    // Give, When
    const straightEdgeRecord = new StraightEdgeRecord(0, 2320);
    
    // Then
    expect.equal(straightEdgeRecord.deltaX, 0, 'delta x is set');
    expect.equal(straightEdgeRecord.deltaY, 2320, 'delta y is set');
    expect.end();
});

test('structures/straight-edge-record write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const straightEdgeRecord = new StraightEdgeRecord(0, 2320);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    straightEdgeRecord.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = 'ED 48 80'.replace(/\s/g,'');

    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});