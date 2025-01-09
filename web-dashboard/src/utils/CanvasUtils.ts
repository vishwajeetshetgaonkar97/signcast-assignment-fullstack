
import { jsPDF } from "jspdf";

const downloadCanvasAsPdf = (canvas) => {
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    const scaleFactor = 3;
    const width = canvas.getWidth() * scaleFactor;
    const height = canvas.getHeight() * scaleFactor;

    tempCanvas.width = width;
    tempCanvas.height = height;

    tempContext.scale(scaleFactor, scaleFactor);

    tempContext.drawImage(canvas.getElement(), 0, 0, canvas.getWidth(), canvas.getHeight());

    const imgData = tempCanvas.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'px', [width, height]);
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('Signcast Media Inc.pdf');
};



export default downloadCanvasAsPdf
export { downloadCanvasAsPdf}



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
    images = ["https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734466424768.png", "https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734466436597.png", "https://signcast-assignment-fullstack-production.up.railway.app/uploads/1734466443994.png"],
    x = 50,
    y = 50,
    width = 890,
    height = 500,
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