const test = require('tape');
const BitStream = require('bit-stream');
const Matrix = require('../../source/types/matrix');

test('records/matrix constructor', expect => { 
    // Give, When
    const matrix = new Matrix(1, 2, 3, 4, 5, 6);
    
    // Then
    expect.equal(matrix.translateX, 1, 'translate y correct');
    expect.equal(matrix.translateY, 2, 'translate y correct');
    expect.equal(matrix.scaleX, 3, 'scale x correct');
    expect.equal(matrix.scaleY, 4, 'scale y correct');
    expect.equal(matrix.rotateSkew0, 5, 'rotate skew 0 correct');
    expect.equal(matrix.rotateSkew1, 6, 'rotate skew 1 correct');
    expect.end();
});

test('records/matrix write (default)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const matrix = new Matrix();
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    matrix.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '00';
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});

test('records/matrix write (translate)', expect => {  
    // Given
    const bitStream = new BitStream();
    const buffers = [];
    const matrix = new Matrix();
    
    matrix.translateX = 100;
    matrix.translateY = 200;
    
    bitStream.on('data', (buffer) => {
        buffers.push(buffer);
    });
    
    // When
    matrix.write(bitStream);
    bitStream.end();
    
    // Then
    const buffer = Buffer.concat(buffers);
    const expected = '12 64 64 00'.replace(/\s/g,'');
    
    expect.equal(buffer.toString('hex').toUpperCase(), expected, 'bytes match expected'); 
    expect.end();
});