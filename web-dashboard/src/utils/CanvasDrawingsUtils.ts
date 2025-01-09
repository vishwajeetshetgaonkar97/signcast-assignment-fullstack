import * as fabric from 'fabric';
import { Canvas, Rect, Circle, Text, Triangle } from "fabric";

interface CustomFabricObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  radius?: number;
  fontSize?: number;
  imageUrl?: string;
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

const addRectangle = ({
  canvas,
  top = 100,
  left = 50,
  width = 100,
  height = 60,
  fill = "#FF0000",
  angle = 0,
  selectable = true,
  id = "rectangle-1",
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

const addCircle = ({
  canvas,
  top = 100,
  left = 50,
  radius = 50,
  fill = "#0000FF",
  angle = 0,
  selectable = true,
  id = "circle-1",
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
    circle.zIndex = zIndex;

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
  id = "triangle-1",
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
    triangle.zIndex = zIndex;

    canvas.add(triangle);
  }
};

const addText = ({
  canvas,
  text = "Hello!" ,
  top = 100,
  left = 50,
  fontSize = 24,
  fill = "#000000",
  angle = 0,
  selectable = true,
  id = "text-1",
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
    fabricText.zIndex = zIndex;

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
  id = "image-1",
  zIndex = 1,
  visible = true,
}: ImageOptions) => {
  const imgObj = new Image();
  imgObj.src = imageUrl;

  imgObj.onload = () => {
    const fabricImage = new fabric.Image(imgObj, {
      top,
      left,
      scaleX,
      scaleY,
      angle,
      visible
    }) as CustomFabricObject;
    fabricImage.id = id;
    fabricImage.zIndex = zIndex;
    fabricImage.imageUrl = imageUrl;

    if (canvas) {
      canvas.add(fabricImage);
      canvas.renderAll();
    }
  };
};


export { addRectangle, addCircle, addTriangle, addText, addImage };

    
