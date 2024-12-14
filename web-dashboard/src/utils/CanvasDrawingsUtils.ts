import * as fabric from 'fabric';
import getDescriptionContainerTitle, { getDate, getDepartmentText, getDrawerName, getIfScreenOrientationVertical, getNicheDepth, getNicheHeight, getNicheWidth, getRBoxDepth, getRBoxHeight, getRBoxWidth, getScreenDistanceFromFloorLine, getScreenHeightDimension, getScreenSizeText, getScreenWidthDimension } from "./CanvasUtils";

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
}

const createLineWithAngle = (startX, startY, angle, length, borderColor) => {
  const radians = angle * (Math.PI / 180);
  const endX = startX + length * Math.cos(radians);
  const endY = startY + length * Math.sin(radians);

  return new fabric.Line([startX, startY, endX, endY], {
    stroke: borderColor,
    strokeWidth: 1,
    selectable: true
  });
};

const createScreenDimensionBox = ({
  fabricCanvasRef,
  borderColor,
  headingTextColor,
  cardBorderColor,
  fillColor,
  cardTextColor,
  textColor,
  selectedConfigurationValues,
  additionalConfiguration,
  createDynamicRectangle,

}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const rectWidth = width * 0.19;
  const rectHeight = height * 0.24;
  const rectX = width * 0.795;
  const rectY = height * 0.03;

  const elements = [
    {
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      strokeColor: borderColor,
      strokeWidth: 1,
    },
    {
      rectX: rectX * 1.01,
      rectY: rectY * 1.2,
      rectWidth: rectWidth * 0.6,
      rectHeight: height * 0.06,
      text: 'Screen Dimensions:',
      textColor: headingTextColor,
      scaleFactor: 1.95,
      fontWeight: '600',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.011,
      rectY: rectY * 3.2,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Height',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.12,
      rectY: rectY * 3.2,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getScreenHeightDimension(selectedConfigurationValues),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.011,
      rectY: rectY * 5,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Width',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.12,
      rectY: rectY * 5,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getScreenWidthDimension(selectedConfigurationValues),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.011,
      rectY: rectY * 6.8,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Floor Line',
      textColor: cardTextColor,
      scaleFactor: 1.9,
      fontWeight: 'normal'
    },
    {
      rectX: rectX * 1.12,
      rectY: rectY * 6.8,
      rectWidth: rectWidth * 0.45,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: additionalConfiguration.distanceFromFloor ? additionalConfiguration.distanceFromFloor : '0',
      textColor: textColor,
      scaleFactor: 1.9,
      fontWeight: 'normal'
    }
  ];

  elements.forEach(element => canvas.add(createDynamicRectangle(element)));
};


const createNicheDimensionBox = ({
  fabricCanvasRef,
  borderColor,
  headingTextColor,
  cardBorderColor,
  fillColor,
  cardTextColor,
  textColor,
  selectedConfigurationValues,
  additionalConfiguration,
  createDynamicRectangle,
}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const rectWidth = width * 0.19;
  const rectHeight = height * 0.24;
  const rectX = width * 0.595;
  const rectY = height * 0.03;

  const elements = [
    {
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      strokeColor: borderColor,
      strokeWidth: 1,
    },
    {
      rectX: rectX * 1.013,
      rectY: rectY * 1.2,
      rectWidth: rectWidth * 0.6,
      rectHeight: height * 0.06,
      text: 'Niche Dimensions:',
      textColor: headingTextColor,
      scaleFactor: 1.95,
      fontWeight: '600',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.014,
      rectY: rectY * 3.2,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Height',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.159,
      rectY: rectY * 3.2,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getNicheHeight(selectedConfigurationValues, additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.014,
      rectY: rectY * 5,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Width',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.159,
      rectY: rectY * 5,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getNicheWidth(selectedConfigurationValues, additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.014,
      rectY: rectY * 6.8,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Depth',
      textColor: cardTextColor,
      scaleFactor: 1.9,
      fontWeight: 'normal',
    },
    {
      rectX: rectX * 1.159,
      rectY: rectY * 6.8,
      rectWidth: rectWidth * 0.452,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getNicheDepth(selectedConfigurationValues, additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
      fontWeight: 'normal',
    },
  ];

  elements.forEach(element => canvas.add(createDynamicRectangle(element)));
};



const createNotesBox = ({
  fabricCanvasRef,
  borderColor,
  headingTextColor,
  cardBorderColor,
  fillColor,
  cardTextColor,
  textColor,
  additionalConfiguration,
  createDynamicRectangle,
}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const rectWidth = width * 0.39;
  const rectHeight = height * 0.2;
  const rectX = width * 0.595;
  const rectY = height * 0.47;

  const elements = [
    {
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      strokeColor: borderColor,
      strokeWidth: 1,
    },
    {
      rectX: rectX * 1.016,
      rectY: rectY * 1.02,
      rectWidth: rectWidth * 0.1,
      rectHeight: height * 0.06,
      text: 'Notes',
      textColor: headingTextColor,
      scaleFactor: 1.95,
      fontWeight: '600',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.016,
      rectY: rectY * 1.095,
      rectWidth: rectWidth * 0.1,
      rectHeight: height * 0.06,
      text: 'Install recessed receptacle box with:',
      textColor: textColor,
      scaleFactor: 1.4,
      fontWeight: '300',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.016,
      rectY: rectY * 1.155,
      rectWidth: rectWidth * 0.1,
      rectHeight: height * 0.06,
      text: '2x Terminated Power Outlets',
      textColor: textColor,
      scaleFactor: 1.4,
      fontWeight: '300',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.016,
      rectY: rectY * 1.21,
      rectWidth: rectWidth * 0.1,
      rectHeight: height * 0.06,
      text: '1x Terminated Data CAT5 Ethernet Outlet',
      textColor: textColor,
      scaleFactor: 1.4,
      fontWeight: '300',
      textOriginX: 'right',
    },
    {
      rectX: rectX * 1.355,
      rectY: rectY * 1.06,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Height',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.499,
      rectY: rectY * 1.06,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getRBoxHeight(additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.355,
      rectY: rectY * 1.175,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Width',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.499,
      rectY: rectY * 1.175,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getRBoxWidth(additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.355,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      fillColor: fillColor,
      strokeWidth: 1,
      text: 'Depth',
      textColor: cardTextColor,
      scaleFactor: 1.9,
    },
    {
      rectX: rectX * 1.499,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.218,
      rectHeight: height * 0.04,
      strokeColor: cardBorderColor,
      strokeWidth: 1,
      text: getRBoxDepth(additionalConfiguration),
      textColor: textColor,
      scaleFactor: 1.9,
    },
  ];

  elements.forEach(element => canvas.add(createDynamicRectangle(element)));
};



const createDescriptionBox = ({
  fabricCanvasRef,
  borderColor,
  headingTextColor,
  highlightFillColor,
  textColor,
  descriptionConfiguration,
  createDynamicRectangle,
  addImageToCanvas,
}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const rectWidth = width * 0.39;
  const rectHeight = height * 0.28;
  const rectX = width * 0.595;
  const rectY = height * 0.69;

  const elements = [
    {
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      strokeColor: borderColor,
      strokeWidth: 1,
    },
    {
      rectX: rectX * 1.01,
      rectY: rectY * 1.2,
      imageUrl: "./logo.png",
      isImage: true,
      scaleFactor: 0.45,
    },
    {
      rectX: rectX * 1.12,
      rectY: rectY * 1.0,
      rectWidth: rectWidth * 0.36,
      rectHeight: height * 0.1,
      text: "361 Steelcase RD. W, #1, MARKHAM. ONTARIO Phone: (416) 900-2233",
      textColor: headingTextColor,
      scaleFactor: 0.73,
      fontWeight: '300',
      textOriginX: 'left',
      isMultiline: true,
    },
    {
      rectX: rectX * 1.33,
      rectY: rectY * 0.983,
      rectWidth: rectWidth * 0.36,
      rectHeight: height * 0.1,
      text: "Description",
      textColor: headingTextColor,
      scaleFactor: 0.8,
      fontWeight: '400',
      textOriginX: 'left',
    },
    {
      rectX: rectX * 1.285,
      rectY: rectY * 1.02,
      rectWidth: rectWidth * 0.5,
      rectHeight: height * 0.1,
      text: getDescriptionContainerTitle(descriptionConfiguration),
      textColor: headingTextColor,
      scaleFactor: 0.83,
      fontWeight: '500',
      textOriginX: 'left',
    },
    {
      rectX: rectX * 1.015,
      rectY: rectY * 1.14,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: 'Drawn',
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.015,
      rectY: rectY * 1.185,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: getDrawerName(descriptionConfiguration),
      textColor: headingTextColor,
      scaleFactor: 1.5,
    },
    {
      rectX: rectX * 1.158,
      rectY: rectY * 1.14,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.072,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: 'Dimensions \n  in inches',
      textColor: textColor,
      scaleFactor: 1,
      fontWeight: '500',
      isMultiline: true,
      textOriginX: 'center',
    },
    {
      rectX: rectX * 1.302,
      rectY: rectY * 1.14,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.072,
      strokeColor: borderColor,
      strokeWidth: 1,
      textColor: textColor,
      scaleFactor: 1.8,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.31,
      rectY: rectY * 1.345,
      imageUrl: "./distance.png",
      isImage: true,
      scaleFactor: 0.5,
    },
    {
      rectX: rectX * 1.015,
      rectY: rectY * 1.245,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: "Date",
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.015,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: getDate(descriptionConfiguration),
      textColor: headingTextColor,
      scaleFactor: 1.8,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.158,
      rectY: rectY * 1.245,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: "Sheet",
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.158,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: "1 of 1",
      textColor: headingTextColor,
      scaleFactor: 1.8,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.302,
      rectY: rectY * 1.245,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: "Revision",
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.302,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.22,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: "00",
      textColor: headingTextColor,
      scaleFactor: 1.8,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.446,
      rectY: rectY * 1.14,
      rectWidth: rectWidth * 0.29,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: "Screen Size",
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.446,
      rectY: rectY * 1.185,
      rectWidth: rectWidth * 0.29,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: getScreenSizeText(descriptionConfiguration),
      textColor: headingTextColor,
      scaleFactor: 1.5,
    },
    {
      rectX: rectX * 1.446,
      rectY: rectY * 1.245,
      rectWidth: rectWidth * 0.29,
      rectHeight: height * 0.03,
      strokeColor: borderColor,
      fillColor: highlightFillColor,
      strokeWidth: 1,
      text: "Department",
      textColor: textColor,
      scaleFactor: 2.4,
      fontWeight: '500',
    },
    {
      rectX: rectX * 1.446,
      rectY: rectY * 1.29,
      rectWidth: rectWidth * 0.29,
      rectHeight: height * 0.04,
      strokeColor: borderColor,
      strokeWidth: 1,
      text: getDepartmentText(descriptionConfiguration),
      textColor: headingTextColor,
      scaleFactor: 1.8,
      fontWeight: '500',
    },
  ];

  elements.forEach(element => {
    if (element.isImage) {
      addImageToCanvas({
        imageUrl: element.imageUrl,
        scaleFactor: element.scaleFactor || 1,
        canvas: canvas,
        imageLeft: element.rectX * 1.02,
        imageTop: element.rectY * 0.865,
      });
    } else {
      canvas.add(createDynamicRectangle(element, canvas));
    }
  });
};


const createDimensionBoxDiagram = ({
  fabricCanvasRef,
  borderColor,
  textColor,
  createDynamicRectangle,
  addLineToCanvas,
  selectedConfigurationValues,
  additionalConfiguration,
}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const rectWidth = width * 0.57;
  const rectHeight = height * 0.935;
  const rectX = width * 0.01;
  const rectY = height * 0.03;

  const isScreenOrientationVertical = getIfScreenOrientationVertical(additionalConfiguration);

  const elements = [
    // outer boundary
    {
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      strokeColor: textColor,
      strokeWidth: 0,
    },
    // main diagram 
    {
      rectX: isScreenOrientationVertical ? rectX * 24 : rectX * 12.5,
      rectY: isScreenOrientationVertical ? rectY * 8.9 : rectY * 9,
      rectWidth: isScreenOrientationVertical ? rectWidth * 0.24 : rectWidth * 0.64,
      rectHeight: isScreenOrientationVertical ? height * 0.37 : height * 0.37,
      strokeColor: textColor,
      strokeWidth: 4,
    },
    {
      rectX: isScreenOrientationVertical ? rectX * 22.9 : rectX * 11.5,
      rectY: isScreenOrientationVertical ? rectY * 8.3 : rectY * 8.3,
      rectWidth: isScreenOrientationVertical ? rectWidth * 0.28 : rectWidth * 0.68,
      rectHeight: isScreenOrientationVertical ? height * 0.415 : height * 0.415,
      strokeColor: textColor,
      strokeWidth: 0.8,
    },
    {
      rectX: isScreenOrientationVertical ? rectX * 26 : rectX * 15.2,
      rectY: isScreenOrientationVertical ? rectY * 10.6 : rectY * 10.6,
      rectWidth: isScreenOrientationVertical ? rectWidth * 0.175 : rectWidth * 0.555,
      rectHeight: isScreenOrientationVertical ? height * 0.28 : height * 0.28,
      strokeColor: textColor,
      isDotted: true,
      strokeWidth: 0.7,
    },


    // dotted center lines 
    {
      length: height * 0.75,
      color: textColor,
      strokeWidth: 0.9,
      isDotted: true,
      arrowStart: false,
      arrowEnd: false,
      canvas: canvas,
      x: rectX * 31,
      y: rectY * 3,
      orientation: 'vertical',
    },
    {
      length: width * 0.53,
      color: textColor,
      strokeWidth: 0.9,
      isDotted: true,
      arrowStart: false,
      arrowEnd: false,
      canvas: canvas,
      x: rectX * 4,
      y: rectY * 15,
      orientation: 'horizontal',
    },
    // supporting lines 

    // floor line 
    {
      length: width * 0.478,
      color: textColor,
      strokeWidth: 0.5,
      canvas: canvas,
      x: rectX * 6.5,
      y: rectY * 30,
      orientation: 'horizontal',
    },

    // horizontal lines 

    // niche lines
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 19.6 : rectX * 8,
      y: rectY * 8.3,
      orientation: 'horizontal',
    },
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 19.6 : rectX * 8,
      y: rectY * 22.1,
      orientation: 'horizontal',
    },

    // screen lines
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 39.1 : rectX * 50.7,
      y: rectY * 9,
      orientation: 'horizontal',
    },
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 39.1 : rectX * 50.7,
      y: rectY * 21.4,
      orientation: 'horizontal',
    },

    // vertical lines 

    // niche lines

    {
      length: height * 0.08,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 23 : rectX * 11.6,
      y: rectY * 22.4,
      orientation: 'vertical',
    },

    {
      length: height * 0.08,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 38.9 : rectX * 50.3,
      y: rectY * 22.4,
      orientation: 'vertical',
    },


    // screen lines

    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 24 : rectX * 12.6,
      y: rectY * 6.3,
      orientation: 'verical',
    },
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 37.9 : rectX * 49,
      y: rectY * 6.3,
      orientation: 'verical',
    },


    // measurement lines 

    {
      length: height * 0.395,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 20 : rectX * 8,
      y: rectY * 8.5,
      orientation: 'vertical',
      arrowStart: true,
      arrowEnd: true,
    },
    {
      length: height * 0.356,
      color: textColor,
      strokeWidth: 1,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 41.8 : rectX * 53.6,
      y: rectY * 9.2,
      orientation: 'vertical',
      arrowStart: true,
      arrowEnd: true,
    },
    {
      length: height * 0.425,
      color: textColor,
      strokeWidth: 0.8,
      canvas: canvas,
      x: rectX * 6.5,
      y: rectY * 15.4,
      orientation: 'vertical',
      arrowStart: true,
      arrowEnd: true,
    },

    // screen length
    {
      length: isScreenOrientationVertical ? width * 0.134 : width * 0.354,
      color: textColor,
      strokeWidth: 0.8,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 24.3 : rectX * 13,
      y: rectY * 6.2,
      orientation: 'horizontal',
      arrowStart: true,
      arrowEnd: true,
    },

    {
      length: isScreenOrientationVertical ? width * 0.154 : width * 0.376,
      color: textColor,
      strokeWidth: 0.8,
      canvas: canvas,
      x: isScreenOrientationVertical ? rectX * 23.3 : rectX * 12,
      y: rectY * 25,
      orientation: 'horizontal',
      arrowStart: true,
      arrowEnd: true,
    },

    // dimension lables 
    {
      rectX: isScreenOrientationVertical ? rectX * 42.5 : rectX * 54.3,
      rectY: rectY * 13.6,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeColor: textColor,
      fillColor: borderColor,
      strokeWidth: 0.8,
      text: isScreenOrientationVertical ? `${getScreenWidthDimension(selectedConfigurationValues)}"` : `${getScreenHeightDimension(selectedConfigurationValues)}"`,
      textColor: textColor,
      scaleFactor: 2.3,
    },
    {
      rectX: rectX * 27,
      rectY: rectY * 4.8,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeColor: textColor,
      fillColor: borderColor,
      strokeWidth: 0.8,
      text: isScreenOrientationVertical ? `${getScreenHeightDimension(selectedConfigurationValues)}"` : `${getScreenWidthDimension(selectedConfigurationValues)}"`,
      textColor: textColor,
      scaleFactor: 2.3,
    },
    {
      rectX: isScreenOrientationVertical ? rectX * 15.9 : rectX * 4,
      rectY: rectY * 13.6,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeColor: textColor,
      fillColor: borderColor,
      strokeWidth: 0.8,
      text: isScreenOrientationVertical ? `${getNicheWidth(selectedConfigurationValues, additionalConfiguration)}"` : `${getNicheHeight(selectedConfigurationValues, additionalConfiguration)}"`,
      textColor: textColor,
      scaleFactor: 2.3,
    },
    {
      rectX: rectX * 27,
      rectY: rectY * 25.4,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeColor: textColor,
      fillColor: borderColor,
      strokeWidth: 0.8,
      text: isScreenOrientationVertical ? `${getNicheHeight(selectedConfigurationValues, additionalConfiguration)}"` : `${getNicheWidth(selectedConfigurationValues, additionalConfiguration)}"`,
      textColor: textColor,
      scaleFactor: 2.3,
    }
    ,
    {
      rectX: rectX * 2,
      rectY: rectY * 16,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeColor: textColor,
      fillColor: borderColor,
      strokeWidth: 0.8,
      text: `${getScreenDistanceFromFloorLine(additionalConfiguration)}"`,
      textColor: textColor,
      scaleFactor: 2.3,
    },
    {
      rectX: rectX * 1.1,
      rectY: rectY * 17.3,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeWidth: 0.8,
      text: `Centerline of \n    Display`,
      textColor: textColor,
      scaleFactor: 2.3,
    },
    {
      rectX: rectX * 1.8,
      rectY: rectY * 27,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeWidth: 0.8,
      text: `Floor Line`,
      textColor: textColor,
      scaleFactor: 2.3,
    }
    ,
    {
      rectX: rectX * 5.7,
      rectY: rectY * 17.7,
      rectWidth: rectWidth * 0.03,
      rectHeight: height * 0.02,
      strokeWidth: 0.8,
      fillColor: "white",
      text: `≈`,
      textColor: textColor,
      scaleFactor: 5,
    },

    // center label line
    {
      length: width * 0.03,
      color: textColor,
      strokeWidth: 0.8,
      canvas: canvas,
      x: rectX * 36.1,
      y: rectY * 3.8,
      orientation: 'horizontal',
    },
    {
      rectX: rectX * 38,
      rectY: rectY * 3.4,
      rectWidth: rectWidth * 0.06,
      rectHeight: height * 0.03,
      strokeWidth: 0.8,
      text: `Intended \n  Screen Position `,
      textColor: textColor,
      scaleFactor: 2.4,
      isMultiline: true
    },

  ];

  const slantedLabelLine = createLineWithAngle(rectX * 31.1, rectY * 15, -75, rectX * 19.5, textColor);

  elements.forEach(element => {
    if (element.length) { addLineToCanvas(element); } else {
      canvas.add(createDynamicRectangle(element, canvas));
    }
  });
  canvas.add(slantedLabelLine);
};



const createMovableReceptorBox = ({
  fabricCanvasRef,
  borderColor,
  createDynamicRectangle,
}) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  const rectWidth = width * 0.19;
  const rectHeight = height * 0.24;
  const rectX = width * 0.795;
  const rectY = height * 0.05;

  const elements = [
    createDynamicRectangle({
      rectX: rectX * 0.504,
      rectY: rectY * 9.4,
      rectWidth: rectWidth * 0.29,
      rectHeight: rectHeight * 0.35,
      strokeColor: borderColor,
      isDotted: true,
      dashPattern: [3, 3],
      strokeWidth: 0.9,
    }),
    createDynamicRectangle({
      rectX: rectX * 0.51,
      rectY: rectY * 9.6,
      rectWidth: rectWidth * 0.24,
      rectHeight: rectHeight * 0.27,
      strokeColor: borderColor,
      isDotted: true,
      dashPattern: [3, 3],
      strokeWidth: 0.9,
    }),
    createDynamicRectangle({
      rectX: rectX * 0.7,
      rectY: rectY * 1.95,
      rectWidth: rectWidth * 0.5,
      rectHeight: rectHeight * 0.27,
      text: "  Install Reccesed \nreceptable box",
      isMultiline: true,
      textColor: borderColor,
      textOriginX: 'center',
      scaleFactor: 1.1,

    }),
  ];

  // Create circle dot
  const circle = new fabric.Circle({
    left: rectX * 0.55,
    top: rectY * 10,
    radius: 2,
    stroke: borderColor,
    strokeWidth: 1,
    fill: borderColor,
    selectable: true,
  });

  // adding this as my line function does not return group but adds it to canvas direct and requirement here is different
  const line1 = createLineWithAngle(rectX * 0.5535, rectY * 10, -75, rectX * 0.27, borderColor);
  const line2 = createLineWithAngle(rectX * 0.624, rectY * 2.64, 0, rectX * 0.09, borderColor);

  const allElements = [...elements, circle, line1, line2];
  const group = new fabric.Group(allElements, {
    selectable: true,
    left: width * 0.282,
    top: height * 0.13,
  });

  canvas.add(group);
  canvas.renderAll();
};

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
  setCanvasObjects,
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
  });

  // Add an `id` to track objects
  rectangle.id = `rect-${Date.now()}`;

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
    },
  ]);
};


export { createScreenDimensionBox, createNicheDimensionBox, createNotesBox, createDescriptionBox, createDimensionBoxDiagram, createMovableReceptorBox, addRectangleToCanvas };