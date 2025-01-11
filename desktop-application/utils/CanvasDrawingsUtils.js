import * as fabric from 'fabric';
const addRectangleToCanvas = ({ x = 10, y = 10, width = 100, height = 50, fillColor = 'transparent', strokeColor = 'black', strokeWidth = 2, isDraggable = true, canvas, angle = 0, }) => {
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
const addLineToCanvas = ({ startX = 0, startY = 0, length = 100, angle = 0, strokeColor = 'black', strokeWidth = 2, isDraggable = true, canvas, left = 10, top = 20, scaleX = 1, scaleY = 1, }) => {
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
export { addRectangleToCanvas, addLineToCanvas };
