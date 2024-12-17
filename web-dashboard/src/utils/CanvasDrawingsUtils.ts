import * as fabric from 'fabric';

interface CustomFabricObject extends fabric.Object {
  id?: string;
}

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

interface TextOptions {
  text?: string;
  x?: number;
  y?: number;
  fontSize?: number;
  fontFamily?: string;
  fillColor?: string;
  isDraggable?: boolean;
  angle?: number;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
  canvasObjects?: any;
  visible?: boolean;
}

interface SlideshowOptions {
  images?: string[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  interval?: number;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
  canvasObjects?: any;
  isDraggable?: boolean;
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
  }) as CustomFabricObject;
;
  
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
  }) as CustomFabricObject;

  line.id = `line-${canvasObjects.length + 1}`;

  canvas.add(line);
  canvas.renderAll();

  setCanvasObjects((prevObjects) => [
    ...prevObjects,
    {
      id: line.id,
      type: 'line',
      x1,
      y1,
      x2,
      y2,
      x: 0,
      y: 0,
      angle: 0,
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

    const imgInstance = new fabric.Image(imgElement, {
      left: x,
      top: y,
      scaleX: width / imgElement.width, 
      scaleY: height / imgElement.height, 
      angle: angle,
      selectable: isDraggable,
    }) as CustomFabricObject;

    imgInstance.id = `image-${canvasObjects.length + 1}`;

    canvas.add(imgInstance);
    canvas.renderAll();

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

  imgElement.src = url;
};


const addTextToCanvas = ({
  text = 'Demo Text',
  x = 10,
  y = 10,
  fontSize = 20,
  fontFamily = 'Poppins',
  fillColor = 'black',
  isDraggable = true,
  angle = 0,
  canvas,
  setCanvasObjects,
  visible = true,
  canvasObjects = [],
}: TextOptions) => {
  const textObject = new fabric.Text(text, {
    left: x,
    top: y,
    fontSize,
    fontFamily,
    fill: fillColor,
    selectable: isDraggable,
    lockMovementX: !isDraggable,
    lockMovementY: !isDraggable,
    angle,
  }) as CustomFabricObject;

  textObject.id = `text-${canvasObjects.length + 1}`;

  canvas.add(textObject);
  canvas.renderAll();

  setCanvasObjects((prevObjects) => [
    ...prevObjects,
    {
      id: textObject.id,
      type: 'text',
      text,
      x,
      y,
      fontSize,
      fontFamily,
      fillColor,
      isDraggable,
      angle,
      visible,
    },
  ]);
};


const addSlideshowToCanvas = ({
  images = ["https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734390815720.png", "https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734409324614.png", "https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734390815720.png"],
  x = 50,
  y = 50,
  width = 200,
  height = 200,
  interval = 5000,
  canvas,
  setCanvasObjects,
  canvasObjects,
  isDraggable = true,
  visible = true,
}: SlideshowOptions) => {
  if (!images || images.length === 0) return;

  let currentIndex = 0;
  const imgElement = new Image();

  const slideshowImage = new fabric.Image(imgElement, {
    left: x,
    top: y,
    scaleX: width / imgElement.width,
    scaleY: height / imgElement.height,
    selectable: isDraggable,
    lockMovementX: !isDraggable,
    lockMovementY: !isDraggable,
  });


  canvas.add(slideshowImage);
  canvas.renderAll();

  setCanvasObjects((prevObjects) => [
    ...prevObjects,
    {
      id: `slideshow-${canvasObjects.length + 1}`,
      type: 'slideshow',
      images,
      x,
      y,
      width,
      height,
      isDraggable,
      visible,
    },
  ]);

  const updateImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
    imgElement.onload = () => {
      slideshowImage.set({
        scaleX: width / imgElement.width,
        scaleY: height / imgElement.height,
      });
      canvas.renderAll();
    };
  };

  imgElement.src = images[currentIndex];
  setInterval(updateImage, interval);
};




export { addRectangleToCanvas, addLineToCanvas, addImageToCanvas, addTextToCanvas, addSlideshowToCanvas };
