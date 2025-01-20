import * as fabric from 'fabric';
import { Rect, Circle, Text, Triangle, FabricImage } from "fabric";
import Chart from 'chart.js/auto';


interface CustomFabricObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  radius?: number;
  fontSize?: number;
  imageUrl?: string;
  text?: string;
  isSlider?: boolean;
  isWeather?: boolean;
  isVideo?: boolean;
  isBarGraph?: boolean;
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
const addImageSlider = ({
  canvas,
  images = [
    "https://i.ibb.co/xs2kCZJ/t1.png",
    "https://i.ibb.co/V96PRPD/t2.jpg",
    "https://i.ibb.co/s6CxZ3C/t3.jpg",
  ],
  interval = 5000,
  top = 0,
  left = 0,
  scaleX = 1,
  scaleY = 1,
  angle = 0,
  height = 360,
  width = 640,
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
  }) as CustomFabricObject;

  slideshowImage.id = id;
  const canvasObjectsLength = getCanvasObjectsLength({ canvas });
  slideshowImage.zIndex = typeof canvasObjectsLength === "number"
    ? canvasObjectsLength + 1
    : zIndex;

  slideshowImage.isSlider = true;

  canvas.add(slideshowImage);
  canvas.renderAll();

  const updateImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
    imgElement.onload = () => {
      // Preserve the current scale and dimensions
      const currentScaleX = slideshowImage.scaleX;
      const currentScaleY = slideshowImage.scaleY;
      const currentWidth = slideshowImage.width;
      const currentHeight = slideshowImage.height;

      slideshowImage.set({
        scaleX: currentScaleX,
        scaleY: currentScaleY,
        width: currentWidth,
        height: currentHeight,
      });

      canvas.renderAll();
    };
  };

  imgElement.src = images[currentIndex];
  setInterval(updateImage, interval);
};

const addWeatherInfo = async ({
  canvas,
  latitude = 43.7,   // Default latitude for Toronto
  longitude = -79.42, // Default longitude for Toronto
  left = 10,
  top = 10,
  fontSize = 20,
  fill = "black",
  id = `weather-${new Date().getTime()}`,
  zIndex = 1,
  visible = true
}: {
  canvas: fabric.Canvas;
  latitude?: number;
  longitude?: number;
  left?: number;
  top?: number;
  fontSize?: number;
  fill?: string;
  id?: string;
  zIndex?: number;
  visible?: boolean
}) => {
  if (!canvas) return;

  // Function to fetch weather data from Open-Meteo
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // Open-Meteo API endpoint
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        throw new Error("Weather data not found");
      }

      const temperature = weatherData.current_weather.temperature;
      const description = weatherData.current_weather.weathercode;

      return `Toronto Weather: ${temperature}°C, Condition: ${description}`;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return "Unable to fetch weather data";
    }
  };

  // Fetch weather data for the given coordinates
  const weatherInfo = await fetchWeatherData(latitude, longitude);

  // Create a Fabric.js Text object for weather information
  const weatherText = new fabric.Text(weatherInfo, {
    left,
    top,
    fontSize,
    fill,
    visible
  }) as CustomFabricObject;

  // Add custom properties to the weatherText object
  weatherText.id = id;
  weatherText.isWeather = true;

  // Calculate zIndex
  const canvasObjectsLength = canvas.getObjects().length;
  weatherText.zIndex =
    typeof canvasObjectsLength === "number" ? canvasObjectsLength + 1 : zIndex;

  // Add the weatherText object to the canvas
  canvas.add(weatherText);
  canvas.renderAll();
};


const addBarGraph = ({
  canvas,
  data = [30, 20, 90, 20, 150],
  barColor = '#4CAF50',
  top = 100,
  left = 50,
  id = `graph-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true
}: {
  canvas: fabric.Canvas;
  data?: number[];
  barColor?: string;
  top?: number;
  left?: number;
  id?: string;
  zIndex?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
}) => {
  if (canvas) {
    const bars = [];
    const barWidth = 50; // Fixed bar width
    const spaceBetweenBars = 20; // Fixed space between bars
    const maxBarHeight = 200; // Fixed max height

    // Create bars based on data
    data.forEach((value, index) => {
      const barHeight = (value / Math.max(...data)) * maxBarHeight;

      const bar = new fabric.Rect({
        top: top + (maxBarHeight - barHeight), // Position from the top
        left: left + index * (barWidth + spaceBetweenBars), // Position based on index
        width: barWidth,
        height: barHeight,
        fill: barColor,
        visible
      }) as CustomFabricObject;

      // Setting a custom ID
      bar.id = `${id}-${index}`;

      // Z-index management
      const canvasObjectsLength = canvas.getObjects().length;
      bar.zIndex = typeof canvasObjectsLength === 'number'
        ? canvasObjectsLength + 1
        : zIndex;

      // Add the bar to the bars array
      bars.push(bar);
    });

    // Create a group containing all the bars
    const barGroup = new fabric.Group(bars, {
      left: left,
      top: top,
      visible: visible,
      scaleX,  // Apply scaling here for the entire group
      scaleY   // Apply scaling here for the entire group
    }) as CustomFabricObject;

    // Set custom ID for the group
    barGroup.id = id;

    // Add the group to the canvas
    canvas.add(barGroup);

    // Return the group for further manipulation if needed
    return barGroup;
  }
};


// not working

// const addBarGraphWithChartJS = ({
//   canvas,
//   data = [30, 60, 90, 120, 150],
//   barWidth = 50,
//   maxBarHeight = 200,
//   spaceBetweenBars = 20,
//   barColor = '#4CAF50',
//   top = 100,
//   left = 50,
//   id = `graph-${new Date().getTime()}`,
//   zIndex = 1,
//   scaleX = 1,
//   scaleY = 1,
//   visible = true
// }: {
//   canvas: fabric.Canvas;
//   data?: number[];
//   barWidth?: number;
//   maxBarHeight?: number;
//   spaceBetweenBars?: number;
//   barColor?: string;
//   top?: number;
//   left?: number;
//   id?: string;
//   zIndex?: number;
//   scaleX?: number;
//   scaleY?: number;
//   visible?: boolean;
// }) => {
//   if (canvas) {
//     console.log('Canvas is initialized, creating bar graph with Chart.js');

//     // Create a hidden canvas element for Chart.js
//     const chartCanvas = document.createElement('canvas');
//     chartCanvas.width = (barWidth + spaceBetweenBars) * data.length;
//     chartCanvas.height = maxBarHeight;

//     const ctx = chartCanvas.getContext('2d');

//     if (!ctx) {
//       console.error('Failed to get canvas context for Chart.js.');
//       return;
//     }

//     // Use Chart.js to draw the chart
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: data.map((_, index) => `Label ${index + 1}`),
//         datasets: [{
//           label: 'Bar Graph',
//           data: data,
//           backgroundColor: barColor,
//           borderWidth: 1,
//         }]
//       },
//       options: {
//         responsive: false,
//         scales: {
//           x: { beginAtZero: true },
//           y: { beginAtZero: true, max: maxBarHeight }
//         },
//         plugins: {
//           legend: { display: false }
//         }
//       }
//     });

//     // Convert the chart to an image
//     const chartImage = chartCanvas.toDataURL();
//     console.log('Chart image data URL created:', chartImage);

//     // Correctly load the image using Fabric.js Image.fromURL
//     fabric.Image.fromURL(chartImage, (img) => {
//       console.log('Image loaded into Fabric.js:', img);
//       img.set({
//         top,
//         left,
//         scaleX,
//         scaleY,
//         visible
//       });

//       // Set custom ID and zIndex
//       img.id = id;

//       const canvasObjectsLength = canvas.getObjects().length;
//       img.zIndex = typeof canvasObjectsLength === 'number'
//         ? canvasObjectsLength + 1
//         : zIndex;

//       // Add the image to the canvas
//       canvas.add(img);
//       console.log('Image added to the canvas:', img);

//       canvas.renderAll();
//       console.log('Canvas rendered with the new image.');
//     }, (error) => {
//       console.error('Failed to load the image into Fabric.js', error);
//     });

//     // Return the canvas for further manipulation if needed
//     return canvas;
//   } else {
//     console.error('Canvas not initialized or provided.');
//   }
// };


// const addIframe = ({
//   canvas,
//   top = 100,
//   left = 50,
//   width = 300,
//   height = 200,
//   src = "https://signcast.ca/",
//   selectable = true,
//   id = `iframe-${new Date().getTime()}`,
//   zIndex = 1,
//   scaleX = 1,
//   scaleY = 1,
//   visible = true
// }) => {
//   if (canvas) {
//     // Create an offscreen HTML element to load the iframe
//     const iframe = document.createElement('iframe');
//     iframe.src = src;
//     iframe.width = width;
//     iframe.height = height;
//     iframe.style.border = "0";

//     // Wait for the iframe to load
//     iframe.onload = () => {
//       try {
//         const iframeCanvas = document.createElement('canvas');
//         iframeCanvas.width = width;
//         iframeCanvas.height = height;

//         const context = iframeCanvas.getContext('2d');
//         context.drawImage(iframe.contentWindow.document.body, 0, 0, width, height);

//         // Convert canvas to a data URL and create a Fabric.js image
//         const dataURL = iframeCanvas.toDataURL();
//         fabric.Image.fromURL(dataURL, (img) => {
//           img.set({
//             top,
//             left,
//             width,
//             height,
//             selectable,
//             scaleX,
//             scaleY,
//             visible
//           });
//           img.id = id;

//           // Set zIndex
//           const canvasObjectsLength = getCanvasObjectsLength({ canvas });
//           img.zIndex =
//             typeof canvasObjectsLength === 'number'
//               ? canvasObjectsLength + 1
//               : zIndex;

//           // Add image to Fabric.js canvas
//           canvas.add(img);
//         });
//       } catch (error) {
//         console.error("Error rendering iframe content:", error);
//       }
//     };

//     document.body.appendChild(iframe); // Append temporarily to load content
//     setTimeout(() => document.body.removeChild(iframe), 5000); // Clean up after load
//   }
// };

const addVideo = ({
  canvas,
  top = 100,
  left = 50,
  height = 360,
  width = 640,
  src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  selectable = true,
  id = `video-${new Date().getTime()}`,
  zIndex = 1,
  scaleX = 1,
  scaleY = 1,
  visible = true,
  autoplay = true,
  loop = true,
  muted = true
}) => {
  if (canvas) {
    // Create video element
    const videoEl = document.createElement('video');
    videoEl.width = width;
    videoEl.height = height;
    videoEl.src = src;
    videoEl.autoplay = autoplay;
    videoEl.loop = loop;
    videoEl.muted = muted;

    // Create fabric.js video object
    const video = new fabric.Image(videoEl, {
      left: left,
      top: top,
      width: width,
      height: height,
      scaleX: scaleX,
      scaleY: scaleY,
      selectable: selectable,
      visible: visible
    }) as CustomFabricObject;

    video.id = id;
    video.isVideo = true;

    // Set zIndex
    const canvasObjectsLength = getCanvasObjectsLength({ canvas });
    video.zIndex = typeof canvasObjectsLength === 'number'
      ? canvasObjectsLength + 1
      : zIndex;

    // Add video to canvas
    canvas.add(video);

    // Ensure the video plays and the canvas updates
    videoEl.play();
    
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

    // Optional: Add custom controls
    video.on('mousedown', function() {
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    });

    return video; // Return the fabric object for further manipulation if needed
  }
};



export { addRectangle, addCircle, addTriangle, addText, addImage, addImageSlider,addWeatherInfo, addBarGraph , addVideo };
