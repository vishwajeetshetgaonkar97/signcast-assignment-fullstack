import * as fabric from "fabric";

const snappingDistance = 10;

export const handleObjectMoving = (canvas, obj, guidelines, setGuidelines) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const left = obj.left;
    const top = obj.top;
    const right = left + obj.width * obj.scaleX;
    const bottom = top + obj.height * obj.scaleY;
    const centerX = left + (obj.width * obj.scaleX) / 2;
    const centerY = top + (obj.height * obj.scaleY) / 2;

    let snapped = false;

    // Clear existing guidelines
    clearGuidelines(canvas);

    // Snapping to left edge
    if (Math.abs(left) < snappingDistance) {
        obj.set({ left: 0 });
        if (!guidelineExists(canvas, "vertical-left")) {
            const line = createVerticalGuideline(canvas, 0, "guideline-vertical-left");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Snapping to top edge
    if (Math.abs(top) < snappingDistance) {
        obj.set({ top: 0 });
        if (!guidelineExists(canvas, "horizontal-top")) {
            const line = createHorizontalGuideline(canvas, 0, "guideline-horizontal-top");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Snapping to right edge
    if (Math.abs(right - canvasWidth) < snappingDistance) {
        obj.set({ left: canvasWidth - obj.width * obj.scaleX });
        if (!guidelineExists(canvas, "vertical-right")) {
            const line = createVerticalGuideline(canvas, canvasWidth, "guideline-vertical-right");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Snapping to bottom edge
    if (Math.abs(bottom - canvasHeight) < snappingDistance) {
        obj.set({ top: canvasHeight - obj.height * obj.scaleY });
        if (!guidelineExists(canvas, "horizontal-bottom")) {
            const line = createHorizontalGuideline(canvas, canvasHeight, "guideline-horizontal-bottom");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Snapping to horizontal center
    if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
        obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
        if (!guidelineExists(canvas, "vertical-center")) {
            const line = createVerticalGuideline(canvas, canvasWidth / 2, "guideline-vertical-center");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Snapping to vertical center
    if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
        obj.set({ top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2 });
        if (!guidelineExists(canvas, "horizontal-center")) {
            const line = createHorizontalGuideline(canvas, canvasHeight / 2, "guideline-horizontal-center");
            guidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    // Update canvas rendering and guidelines
    if (!snapped) {
        clearGuidelines(canvas);
    } else {
        setGuidelines(guidelines);
    }
    canvas.renderAll();
};

// Create vertical guideline
export const createVerticalGuideline = (canvas, x, id) => {
    return new fabric.Line([x, 0, x, canvas.height], {
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
        id,
    });
};

// Create horizontal guideline
export const createHorizontalGuideline = (canvas, y, id) => {
    return new fabric.Line([0, y, canvas.width, y], {
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
        id,
    });
};

// Clear existing guidelines
const clearGuidelines = (canvas) => {
    // Iterate through all objects and remove lines with 'guideline' id
    canvas.getObjects().forEach((obj) => {
        if (obj.type === 'line' && obj.id && obj.id.startsWith('guideline')) {
            canvas.remove(obj);
        }
    });
    canvas.renderAll(); // Ensure the canvas updates after removing lines
};

// Check if a guideline exists
const guidelineExists = (canvas, id) => {
    return canvas.getObjects("line").some((line) => line.id === id);
};

export { clearGuidelines, guidelineExists };