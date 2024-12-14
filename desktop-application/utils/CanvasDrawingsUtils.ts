import * as fabric from 'fabric';

interface RectangleOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
  angle?: number;
}

interface LineOptions {
  startX?: number;
  startY?: number;
  length?: number;
  angle?: number;
  strokeColor?: string;
  strokeWidth?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
  left?: number,
  top?: number,
  scaleX?: number,
  scaleY?: number,
  setCanvasObjects: any;
}

interface ImageOptions {
  url: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
}

const addRectangleToCanvas = ({
  x = 10,
  y = 10,
  width = 100,
  height = 50,
  fillColor = 'transparent',
  strokeColor = 'black',
  strokeWidth = 2,
  isDraggable = true,
  canvas,
  angle = 0,
}: RectangleOptions) => {
  const rectangle = new fabric.Rect({
    x: x,
    y: y,
    width,
    height,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth,
    selectable: isDraggable,
    lockMovementX: !isDraggable,
    lockMovementY: !isDraggable,
    angle,
  });

  canvas.add(rectangle);
  canvas.renderAll();

  
};

const addLineToCanvas = ({
  startX = 0,
  startY = 0,
  length = 100,
  angle = 0,
  strokeColor = 'black',
  strokeWidth = 2,
  isDraggable = true,
  canvas,
  left= 10,
  top = 20,
  scaleX = 1,
  scaleY = 1,
}: LineOptions) => {
  const radians = (Math.PI / 180) * angle;
  const endX = startX + length * Math.cos(radians);
  const endY = startY + length * Math.sin(radians);

  const line = new fabric.Line([startX, startY, endX, endY], {
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    selectable: isDraggable,
    lockMovementX: !isDraggable,
    lockMovementY: !isDraggable,
    left,
    top,
    scaleX,
    scaleY,
  });


  canvas.add(line);
  canvas.renderAll();

  
};



const addImageToCanvas = ({
  url,
  x = 0,
  y = 0,
  width,
  height,
  angle = 0,
  isDraggable = true,
  canvas,
  setCanvasObjects,
}: ImageOptions) => {
  fabric.Image.fromURL(url, (img, isError) => {
    if (isError) {
      console.error(`Error loading image: ${url}`);
      return;
    }
    img.set({
      left: x,
      top: y,
      angle: angle,
      selectable: isDraggable,
      lockMovementX: !isDraggable,
      lockMovementY: !isDraggable,
    });

    if (width && height) {
      img.scaleToWidth(width);
      img.scaleToHeight(height);
    }

    // Add an `id` to track objects
    img.id = `image-${Date.now()}`;

    canvas.add(img);
    canvas.renderAll();

    // Add to the state
    setCanvasObjects((prevObjects) => [
      ...prevObjects,
      {
        id: img.id,
        type: 'image',
        url,
        x,
        y,
        width,
        height,
        angle,
        isDraggable,
      },
    ]);
  });
};


export { addRectangleToCanvas, addLineToCanvas, addImageToCanvas };
