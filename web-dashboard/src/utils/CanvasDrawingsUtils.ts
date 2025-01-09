import * as fabric from 'fabric';
import { Canvas, Rect, Circle, Text, Triangle } from "fabric";

interface CustomFabricObject extends fabric.Object {
  id?: string;
  zIndex?: number;
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
      scaleY
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
}: CircleOptions) => {
  if (canvas) {
    const circle = new fabric.Circle({
      top,
      left,
      radius,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY
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
}: TriangleOptions) => {
  if (canvas) {
    const triangle = new fabric.Triangle({
      top,
      left,
      width,
      height,
      fill,
      angle,
      selectable,
      scaleX,
      scaleY
    }) as CustomFabricObject;
    triangle.id = id;
    triangle.zIndex = zIndex;

    canvas.add(triangle);
  }
};

export { addRectangle, addCircle, addTriangle };

    
