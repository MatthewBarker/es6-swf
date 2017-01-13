const test = require('tape');
const BitStream = require('bit-stream');
const RecordHeaderShort = require('../../source/structures/record-header-short');

// Values taken from page 224 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('structures/record-header-short constructor', expect => { 
    // Give, When
    const recordHeaderShort = new RecordHeaderShort(9, 3);
    
    // Then
    expect.equal(recordHeaderShort.code, 9);
    expect.equal(recordHeaderShort.length, 3);
    expect.end();
});

test('structures/record-header-short write', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const recordHeaderShort = new RecordHeaderShort(9, 3);
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    recordHeaderShort.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '43 02'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});