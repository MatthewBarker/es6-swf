//const xml2js = require('xml2js');
//const parser = new xml2js.Parser();

// External
const fs = require('fs');
const memoryStreams = require('memory-streams');
// File
const FileHeader = require('./source/file/file-header');
const Flash = require('./source/file/flash');
//Structures
const EndShapeRecord = require('./source/structures/end-shape-record');
const LineStyle = require('./source/structures/line-style');
const ShapeWithStyle = require('./source/structures/shape-with-style');
const StraightEdgeRecord = require('./source/structures/straight-edge-record');
const StyleChangeRecord = require('./source/structures/style-change-record');
//Tags
const DefineShape = require('./source/tags/define-shape');
const End = require('./source/tags/end');
const PlaceObject2 = require('./source/tags/place-object-2');
const SetBackgroundColor = require('./source/tags/set-background-color');
const ShowFrame = require('./source/tags/show-frame');
// Types
const Matrix = require('./source/types/matrix');
const Rgb = require('./source/types/rgb');

const stream = new memoryStreams.WritableStream();
const fileHeader = new FileHeader('FWS', 3, 550 * 20, 400 * 20, 12, 1);
const flash = new Flash(fileHeader);
const setBackgroundColor = new SetBackgroundColor();
const defineShape = new DefineShape();
const shapeWithStyle = new ShapeWithStyle();
const shapeRecord1 = new StyleChangeRecord();
const shapeRecord2 = new StraightEdgeRecord(0, 2320);
const shapeRecord3 = new StraightEdgeRecord(-2880, 0);
const shapeRecord4 = new StraightEdgeRecord(0, -2320);
const shapeRecord5 = new StraightEdgeRecord(2880, 0);
const shapeRecord6 = new EndShapeRecord();
const placeObject2 = new PlaceObject2();
const showFrame = new ShowFrame();
const end = new End();

shapeWithStyle.lineStyles.lineStyles.push(new LineStyle(20, new Rgb(0x00, 0x00, 0x00)));  

shapeRecord1.moveDeltaX = 4900;
shapeRecord1.moveDeltaY = 1680;
shapeRecord1.lineStyle = 1;

shapeWithStyle.shapeRecords.push(shapeRecord1);
shapeWithStyle.shapeRecords.push(shapeRecord2);
shapeWithStyle.shapeRecords.push(shapeRecord3);
shapeWithStyle.shapeRecords.push(shapeRecord4);
shapeWithStyle.shapeRecords.push(shapeRecord5);
shapeWithStyle.shapeRecords.push(shapeRecord6);

defineShape.shape = shapeWithStyle;

placeObject2.matrix = new Matrix();

flash.tags.push(setBackgroundColor);
flash.tags.push(defineShape);
flash.tags.push(placeObject2);
flash.tags.push(showFrame);
flash.tags.push(end);

flash.write(stream);
stream.end();

fs.writeFile('sample.swf', stream.toBuffer(), (error) => {
  if (error) {
      throw error;
  }
      
  console.log('Complete');
});