
import { jsPDF } from "jspdf";

const getScreenHeightDimension = (selectedConfigurationValues: any) => {
    if (!selectedConfigurationValues.screenMFR) return 0;
    return parseFloat(selectedConfigurationValues.screenMFR?.Height || 0);
}

const getScreenWidthDimension = (selectedConfigurationValues: any) => {
    if (!selectedConfigurationValues.screenMFR) return 0;
    return parseFloat(selectedConfigurationValues.screenMFR.Width || 0)
}

const getScreenDistanceFromFloorLine = (additionalConfiguration: any) => {
    if (!additionalConfiguration.distanceFromFloor) return 0;
    return parseFloat(additionalConfiguration.distanceFromFloor || 0)
}

const getNicheHeight = (selectedConfigurationValues: any, additionalConfiguration: any) => {
    const screenHeightDimension = getScreenHeightDimension(selectedConfigurationValues);
    const nicheVr = parseFloat(additionalConfiguration.nicheVr || 0);
    const nicheHeight = screenHeightDimension + nicheVr;
    return nicheHeight;

}
const getNicheWidth = (selectedConfigurationValues: any, additionalConfiguration: any) => {
    const screenHeightDimension = getScreenWidthDimension(selectedConfigurationValues);
    const nicheVr = parseFloat(additionalConfiguration.nicheVr || 0);
    const nicheWidth = screenHeightDimension + nicheVr;
    return nicheWidth;

}
const getNicheDepth = (selectedConfigurationValues: any, additionalConfiguration: any) => {
    if (!selectedConfigurationValues || !additionalConfiguration || !selectedConfigurationValues.screenMFR) {
        return 0;
    }
    const screenDepth = parseFloat(selectedConfigurationValues.screenMFR?.Depth ?? '0');
    const depthVariance = parseFloat(additionalConfiguration.nicheDepth ?? '0');
    const mediaPlayerDepth = selectedConfigurationValues.MediaPlayerMFR ? parseFloat(selectedConfigurationValues.MediaPlayerMFR.Depth ?? '0') : 0;
    const mountDepth = selectedConfigurationValues.mount ? parseFloat(selectedConfigurationValues.mount["Depth (in)"] ?? '0') : 0;

    const additionalFactor = Math.max(mediaPlayerDepth, mountDepth);

    return (screenDepth + depthVariance + additionalFactor).toFixed(2);
};


const getDescriptionContainerTitle = (descriptionConfiguration: any) => {

    if (descriptionConfiguration && descriptionConfiguration.title) {
        return descriptionConfiguration.title;
    }

    return "-";
}

const getDrawerName = (descriptionConfiguration: any) => {

    if (descriptionConfiguration && descriptionConfiguration.drawer) {
        return descriptionConfiguration.drawer;
    }

    return "-";
}

const getDate = (descriptionConfiguration: any) => {

    if (descriptionConfiguration && descriptionConfiguration.date) {
        return descriptionConfiguration.date;
    }

    return "-";
}

const getScreenSizeText = (descriptionConfiguration: any) => {

    if (descriptionConfiguration && descriptionConfiguration.screenSize) {
        return descriptionConfiguration.screenSize;
    }

    return "-";
}

const getDepartmentText = (descriptionConfiguration: any) => {

    if (descriptionConfiguration && descriptionConfiguration.department) {
        return descriptionConfiguration.department;
    }

    return "-";
}

const getRBoxHeight = (additionalConfiguration: any) => {

    if (additionalConfiguration && additionalConfiguration.rBoxHeight) {
        return additionalConfiguration.rBoxHeight;
    }

    return "-";
}

const getRBoxWidth = (additionalConfiguration: any) => {

    if (additionalConfiguration && additionalConfiguration.rBoxWidth) {
        return additionalConfiguration.rBoxWidth;
    }

    return "-";
}

const getRBoxDepth = (additionalConfiguration: any) => {

    if (additionalConfiguration && additionalConfiguration.rBoxDepth) {
        return additionalConfiguration.rBoxDepth;
    }

    return "-";
}

const getIfScreenOrientationVertical = (additionalConfiguration: any) => {

    if (additionalConfiguration && additionalConfiguration.orientation === "vertical") {
        return additionalConfiguration.orientation;
    }

    return "";
}

const downloadCanvasAsPdf = (canvas) => {
    if (!canvas) return;

    // Create a temporary canvas to draw the high-resolution image
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

    // Using jsPDF to create a PDF and add the image
    const pdf = new jsPDF('landscape', 'px', [width, height]);
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('Signcast Media Inc.pdf');
};



export default getDescriptionContainerTitle
export {
    getDescriptionContainerTitle, getDrawerName, getDate,
    getScreenSizeText, getDepartmentText, getRBoxHeight, getRBoxWidth, 
    getRBoxDepth,getScreenHeightDimension, getScreenWidthDimension, getScreenDistanceFromFloorLine, 
    getNicheHeight, getNicheWidth, getNicheDepth, downloadCanvasAsPdf,getIfScreenOrientationVertical
}