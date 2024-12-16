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
  visible?: boolean;
  canvasObjects?: any;
}

interface LineOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  strokeColor?: string;
  strokeWidth?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
  visible?: boolean;
  canvasObjects?: any;
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
  canvasObjects?: any;
  visible?: boolean;
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
  setCanvasObjects,
  visible = true,
  canvasObjects = [],
}: RectangleOptions) => {
  const rectangle = new fabric.Rect({
    left: x,
    top: y,
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

  // Add an `id` to track objects
  rectangle.id = `rect-${canvasObjects.length + 1}`;

  canvas.add(rectangle);
  canvas.renderAll();

  // Add to the state
  setCanvasObjects((prevObjects) => [
    ...prevObjects,
    {
      id: rectangle.id,
      type: 'rectangle',
      x,
      y,
      width,
      height,
      fillColor,
      strokeColor,
      strokeWidth,
      isDraggable,
      angle,
      visible,
    },
  ]);
};

const addLineToCanvas = ({
  x1 = 10,
  y1 = 10,
  x2 = 100,
  y2 = 100,
  strokeColor = 'black',
  strokeWidth = 2,
  isDraggable = true,
  canvas,
  setCanvasObjects,
  visible = true,
  canvasObjects = [],
}: LineOptions) => {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: strokeColor,
    strokeWidth,
    selectable: isDraggable,
    lockMovementX: !isDraggable,
    lockMovementY: !isDraggable,
  });

  // Add an `id` to track objects
  line.id = `line-${canvasObjects.length + 1}`;

  canvas.add(line);
  canvas.renderAll();

  // Add to the state
  setCanvasObjects((prevObjects) => [
    ...prevObjects,
    {
      id: line.id,
      type: 'line',
      x1,
      y1,
      x2,
      y2,
      x:0,
      y:0,
      angle:0,
      strokeColor,
      strokeWidth,
      isDraggable,
      visible,
    },
  ]);
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
  canvasObjects,
  setCanvasObjects,
  visible = true,
}: ImageOptions) => {
  if (!canvas) return;

  const imgElement = new Image();
  
  imgElement.onload = () => {
    // Create the fabric image instance after the image loads
    const imgInstance = new fabric.Image(imgElement, {
      left: x,
      top: y,
      scaleX: width / imgElement.width, // Scale the image according to the provided width
      scaleY: height / imgElement.height, // Scale the image according to the provided height
      angle: angle,
      selectable: isDraggable,
    });

    // Assign a unique ID to the image for tracking purposes
    imgInstance.id = `image-${canvasObjects.length + 1}`;

    // Add the image instance to the canvas
    canvas.add(imgInstance);
    canvas.renderAll();

    // Update the canvas objects state with the new image
    setCanvasObjects((prevObjects) => [
      ...prevObjects,
      {
        id: imgInstance.id,
        type: 'image',
        url,
        x,
        y,
        width,
        height,
        angle,
        isDraggable,
        visible,
      },
    ]);
  };

  // Set the image source to trigger the image loading process
  imgElement.src = url;
};



export { addRectangleToCanvas, addLineToCanvas, addImageToCanvas };
