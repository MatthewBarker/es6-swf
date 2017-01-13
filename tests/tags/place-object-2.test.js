const test = require('tape');
const BitStream = require('bit-stream');
const Matrix = require('../../source/types/matrix');
const PlaceObject2 = require('../../source/tags/place-object-2');

test('tags/place-object-2 constructor', expect => { 
    // Give, When
    const placeObject2 = new PlaceObject2();
    
    // Then
    expect.equal(placeObject2.placeFlagMove, false);
    expect.equal(placeObject2.depth, 1);
    expect.equal(placeObject2.characterId, 1);
    expect.equal(placeObject2.matrix, null);
    expect.equal(placeObject2.colorTransform, null);
    expect.equal(placeObject2.ratio, null);
    expect.equal(placeObject2.name, null);
    expect.equal(placeObject2.clipDepth, null);
    expect.equal(placeObject2.clipActions, null);
    expect.end();
});

test('tags/place-object-2 write (default)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const placeObject2 = new PlaceObject2();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    placeObject2.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '85 06 02 01 00 01 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

// Values taken from page 232 of the v19 file format specification
// http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
test('tags/place-object-2 write (object)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const placeObject2 = new PlaceObject2();
    
    placeObject2.matrix = new Matrix();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    placeObject2.write(bitStream);
    bitStream.end();

    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '86 06 06 01 00 01 00 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});