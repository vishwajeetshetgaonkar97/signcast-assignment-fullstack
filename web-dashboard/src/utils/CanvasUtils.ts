
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