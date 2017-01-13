const test = require('tape');
const BitStream = require('bit-stream');
const RecordHeaderLong = require('../../source/structures/record-header-long');

// Values taken from page 224 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/record-header-long constructor', expect => { 
    // Give, When
    const recordHeaderLong = new RecordHeaderLong(2, 35);
    
    // Then
    expect.equal(recordHeaderLong.code, 2);
    expect.equal(recordHeaderLong.length, 35);
    expect.end();
});

test('structures/record-header-long write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const recordHeaderLong = new RecordHeaderLong(2, 35);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    recordHeaderLong.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = 'BF 00 23 00 00 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});