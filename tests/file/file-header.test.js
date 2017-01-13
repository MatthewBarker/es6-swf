const test = require('tape');
const BitStream = require('bit-stream');
const FileHeader = require('../../source/file/file-header');
const memoryStreams = require('memory-streams');

// Values taken from page 221 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('file/file-header constructor', expect => { 
    // Give, When
    const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
    
    // Then
    expect.equal(fileHeader.signature, 'FWS', 'signature correct');
    expect.equal(fileHeader.version, 3, 'version correct');
    expect.equal(fileHeader.frameRate, 12, 'frameRate correct');
    expect.equal(fileHeader.frameCount, 1, 'frameCount correct');
    expect.equal(fileHeader.frameSize.xMin, 0, 'frameSize xMin correct');
    expect.equal(fileHeader.frameSize.xMax, 550 * 20, 'frameSize xMax correct');
    expect.equal(fileHeader.frameSize.yMin, 0, 'frameSize yMin correct');
    expect.equal(fileHeader.frameSize.yMax, 400 * 20, 'frameSize yMax correct');
    expect.equal(fileHeader.tagLength, 0, 'tagLength correct');
    expect.end();
});

test('file/file-header write', expect => {  
    // Given
    const bitStream = new BitStream();
    const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
    const buffers = [];
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    fileHeader.tagLength = 58;
    
    // When
    fileHeader.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = ('46 57 53 03 4F 00 00 00 78 00 05 5F 00 00 0F A0 ' +
        '00 00 0C 01 00').replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});