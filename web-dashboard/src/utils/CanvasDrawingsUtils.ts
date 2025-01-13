import * as fabric from 'fabric';
import { Rect, Circle, Text, Triangle, FabricImage } from "fabric";

interface CustomFabricObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  radius?: number;
  fontSize?: number;
  imageUrl?: string;
  text?: string;
  isSlider?: boolean;
}

interface RectangleOptions {
  canvas: fabric.Canvas;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  fill?: string;
  angle?: number;
  selectable?: boolean;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}

interface CircleOptions {
  canvas: fabric.Canvas;
  top?: number;
  left?: number;
  radius?: number;
  fill?: string;
  angle?: number;
  selectable?: boolean;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}

interface TriangleOptions {
  canvas: fabric.Canvas;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  fill?: string;
  angle?: number;
  selectable?: boolean;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}

interface TextOptions {
  canvas: fabric.Canvas;
  text?: string;
  top?: number;
  left?: number;
  fontSize?: number;
  fill?: string;
  angle?: number;
  selectable?: boolean;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}

interface ImageOptions {
  canvas: fabric.Canvas;
  imageUrl: string;
  text?: string;
  top?: number;
  left?: number;
  fontSize?: number;
  fill?: string;
  angle?: number;
  selectable?: boolean;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}

interface CarouselOptions {
  canvas: fabric.Canvas;
  images?: string[];
  interval?: number;
  top?: number;
  left?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  id?: string;
  zIndex?: number;
  visible?: boolean;
  height?: number;
  width?: number;
}

const addRectangle = ({
  canvas,
  top = 100,
  left = 50,
  width = 100,
  height = 60,
  fill = "#FF0000",
  angle = 0,
  selectable = true,
  id = `rect-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true,
}: RectangleOptions) => {
  if (canvas) {
    const rect = new Rect({
      top,
      left,
      width,
      height,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY,
      visible,
    }) as CustomFabricObject;
    rect.id = id;
    rect.zIndex = zIndex;

    canvas.add(rect);
  }
};

const getCanvasObjectsLength = ({ canvas }) => {
  if (canvas) {
    const objects = canvas.getObjects() as CustomFabricObject[];
    return objects.length;
  }
  return [];
};


const addCircle = ({
  canvas,
  top = 100,
  left = 50,
  radius = 50,
  fill = "#0000FF",
  angle = 0,
  selectable = true,
  id = `circle-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true
}: CircleOptions) => {
  if (canvas) {

    const circle = new Circle({
      top,
      left,
      radius,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY,
      visible
    }) as CustomFabricObject;
    circle.id = id;

    const canvasObjectsLength = getCanvasObjectsLength({ canvas });
    circle.zIndex = typeof canvasObjectsLength === 'number'
      ? canvasObjectsLength + 1
      : zIndex;

    canvas.add(circle);
  }
};

const addTriangle = ({
  canvas,
  top = 100,
  left = 50,
  width = 80,
  height = 80,
  fill = "#00FF00",
  angle = 0,
  selectable = true,
  id = `triangle-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true,
}: TriangleOptions) => {
  if (canvas) {
    const triangle = new Triangle({
      top,
      left,
      width,
      height,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY,
      visible
    }) as CustomFabricObject;
    triangle.id = id;
    const canvasObjectsLength = getCanvasObjectsLength({ canvas });
    triangle.zIndex = typeof canvasObjectsLength === 'number'
      ? canvasObjectsLength + 1
      : zIndex;

    canvas.add(triangle);
  }
};

const addText = ({
  canvas,
  text = "Hello!",
  top = 100,
  left = 50,
  fontSize = 24,
  fill = "#000000",
  angle = 0,
  selectable = true,
  id = `text-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true,
}: TextOptions) => {



  if (canvas) {
    const fabricText = new Text(text, {
      top,
      left,
      fontSize,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY,
      visible
    }) as CustomFabricObject;
    fabricText.id = id;
    const canvasObjectsLength = getCanvasObjectsLength({ canvas });
    fabricText.zIndex = typeof canvasObjectsLength === 'number'
      ? canvasObjectsLength + 1
      : zIndex;
    fabricText.text = text;

    canvas.add(fabricText);
  }
};

const addImage = ({
  canvas,
  imageUrl,
  top = 100,
  left = 50,
  scaleX = 1,
  scaleY = 1,
  angle = 0,
  id = `image-${new Date().getTime()}`,
  zIndex = 1,
  visible = true,
}: ImageOptions) => {
  const imgObj = new Image();
  imgObj.src = imageUrl;

  imgObj.onload = () => {
    const fabricImage = new FabricImage(imgObj, {
      top,
      left,
      scaleX,
      scaleY,
      angle,
      visible,
    }) as CustomFabricObject;
    fabricImage.id = id;
    const canvasObjectsLength = getCanvasObjectsLength({ canvas });
    fabricImage.zIndex = typeof canvasObjectsLength === 'number'
      ? canvasObjectsLength + 1
      : zIndex;
    fabricImage.imageUrl = imageUrl;

    if (canvas) {
      canvas.add(fabricImage);
      canvas.renderAll();
    }
  };
};



const createCarousel = ({
  canvas,
  images = [
    "https://signcast-assignment-fullstack-production-32ab.up.railway.app/uploads/1736740708871.png",
    "https://signcast-assignment-fullstack-production-32ab.up.railway.app/uploads/1736740749919.png",
    "https://signcast-assignment-fullstack-production-32ab.up.railway.app/uploads/1736740772518.png"
  ],
  interval = 3000,
  top = 0,
  left = 0,
  scaleX = 1,
  scaleY = 1,
  angle = 0,
  height = 1080,
  width = 1920,
  id = `carousel-${new Date().getTime()}`,
  zIndex = 1,
  visible = true,
}: CarouselOptions) => {


  if (!images || images.length === 0) return;

  let currentIndex = 0;
  const imgElement = new Image();

  const slideshowImage = new fabric.Image(imgElement, {
    top,
    left,
    scaleX,
    scaleY,
    angle,
    visible,
    width,
    height,
  } ) as CustomFabricObject;

  slideshowImage.id = id;
  const canvasObjectsLength = getCanvasObjectsLength({ canvas });
  slideshowImage.zIndex = typeof canvasObjectsLength === 'number'
    ? canvasObjectsLength + 1
    : zIndex;

    slideshowImage.isSlider = true;

  canvas.add(slideshowImage);
  canvas.renderAll();

  const updateImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
    imgElement.onload = () => {
      slideshowImage.set({
        scaleX: scaleX,
        scaleY: scaleY,
        height: height,
        width: width,

      });
      canvas.renderAll();
    };
  };

  imgElement.src = images[currentIndex];
  setInterval(updateImage, interval);

};



export { addRectangle, addCircle, addTriangle, addText, addImage, createCarousel };
