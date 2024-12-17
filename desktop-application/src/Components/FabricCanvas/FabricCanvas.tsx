import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { get } from 'http';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  allcanvases: any[];
  setAllCanvases: any;
  canvasObjects: any[];
  setCanvasObjects: any;
  selectedCanvasIndex: number;
  setSelectedCanvasIndex: any
}
interface CustomFabricObject extends fabric.Object {
  id?: string;
}

const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef ,allcanvases, setAllCanvases, canvasObjects, setCanvasObjects, selectedCanvasIndex, setSelectedCanvasIndex}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);


const [isConnected, setIsConnected] = useState<boolean>(false);


  const getAllCanvases = async () => {
    try {
      // Invoke the main process to get the canvases
      const canvases = await window.electron.getCanvases();
      console.log('canvases', canvases);
      setAllCanvases(canvases);
      console.log('canvases', canvases);
      setCanvasObjects(canvases[selectedCanvasIndex].data);


      const wss = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");

      wss.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };


      wss.onmessage = (event: any) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);

          if (data.action === "updateAllCanvas") {
            console.log("Updating canvas objects for all:", data);
            setAllCanvases(data.canvases);
          } else if (data.type === "notification") {
            console.log("Notification:", data.message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wss.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

    } catch (error) {
      console.log(`Canvas get issue: ${error}`);
    }
  };

  useEffect(() => {
    getAllCanvases();

  }, []);


  const renderCanvasObjects = (canvasObjects, canvas) => {
    canvas.clear();

    canvasObjects.forEach(obj => {
      if (obj.visible) {
        let canvasObject;
        console.log("obj", obj.type);
        console.log("obj", obj);
        if (obj.type === 'rectangle') {
          console.log("inside rectangle ", obj);
          canvasObject = new fabric.Rect({
            left: obj.x,
            top: obj.y,
            width: obj.width,
            height: obj.height,
            fill: obj.fillColor,
            stroke: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            selectable: obj.isDraggable,
            lockMovementX: !obj.isDraggable,
            lockMovementY: !obj.isDraggable,
            angle: obj.angle,
          });
        } else if (obj.type === 'line') {
          // Adjust the line positions based on the angle
          const x1 = obj.x1 + obj.x;
          const y1 = obj.y1 + obj.y;
          const x2 = obj.x2 + obj.x;
          const y2 = obj.y2 + obj.y;

          const angle = obj.angle;

          // Calculate the new start and end positions based on the angle
          const radian = fabric.util.degreesToRadians(angle);
          const centerX = (x1 + x2) / 2;
          const centerY = (y1 + y2) / 2;

          const newX1 = centerX + (x1 - centerX) * Math.cos(radian) - (y1 - centerY) * Math.sin(radian);
          const newY1 = centerY + (x1 - centerX) * Math.sin(radian) + (y1 - centerY) * Math.cos(radian);

          const newX2 = centerX + (x2 - centerX) * Math.cos(radian) - (y2 - centerY) * Math.sin(radian);
          const newY2 = centerY + (x2 - centerX) * Math.sin(radian) + (y2 - centerY) * Math.cos(radian);

          canvasObject = new fabric.Line([newX1, newY1, newX2, newY2], {
            stroke: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            selectable: obj.isDraggable,
            lockMovementX: !obj.isDraggable,
            lockMovementY: !obj.isDraggable,
            angle: angle,
          });
        } else if (obj.type === 'image') {
          console.log('image moving value', obj);
          const imgElement = new Image();
          imgElement.src = obj.url;

          imgElement.onload = () => {
            // Create the fabric image instance
            const imgInstance = new fabric.Image(imgElement, {
              left: obj.x,
              top: obj.y,
              width: obj.width,
              height: obj.height,
              angle: obj.angle,
              selectable: obj.isDraggable,
              lockMovementX: !obj.isDraggable,
              lockMovementY: !obj.isDraggable,
              originX: 'center',
              originY: 'center',
            });


            imgInstance.set({
              angle: obj.angle,
              originX: 'center',
              originY: 'center',
              left: obj.x,
              top: obj.y,
            });

            // Add the image instance to the canvas
            canvas.add(imgInstance);
          };
        } else if (obj.type === 'text') {
          canvasObject = new fabric.Text(obj.text, {
            left: obj.x,
            top: obj.y,
            fontSize: obj.fontSize,
            fill: obj.fillColor,
          })
        } else if (obj.type === 'slideshow') {
          console.log('slideshow', obj);
          const { images, x, y, width, height, isDraggable } = obj;

          const imgElement = new Image();
          let currentIndex = 0;
          imgElement.src = images[currentIndex];

          imgElement.onload = () => {
            const slideshowImage = new fabric.Image(imgElement, {
              left: x,
              top: y,
              scaleX: width / imgElement.width,
              scaleY: height / imgElement.height,
              selectable: isDraggable,
            });

            canvas.add(slideshowImage);

            // Update the image every 2 seconds
            const updateImage = () => {
              currentIndex = (currentIndex + 1) % images.length;
              imgElement.src = images[currentIndex];
            };

            setInterval(updateImage, 2000);
          };

          imgElement.onerror = (e) => {
            console.error('Failed to load image:', e);
            alert('Image failed to load. Check the URL or try another one.');
          };
        }


        if (obj.type !== 'image' && obj.type !== 'slideshow' && obj.type !== 'video') {
          canvasObject.id = obj.id;
          canvas.add(canvasObject);
        }


      }
    });

    canvas.renderAll();
  };

  const updateCanvasSize = () => {
    if (containerRef.current && fabricCanvasRef.current) {
      const containerWidth = containerRef.current.offsetWidth;


      const newHeight = (containerWidth * 9) / 16;

      const canvas = fabricCanvasRef.current;
      const prevWidth = canvas.width || 1;
      const prevHeight = canvas.height || 1;

      canvas.setWidth(containerWidth);
      canvas.setHeight(newHeight);

      const scaleX = containerWidth / prevWidth;
      const scaleY = newHeight / prevHeight;


      //  this code is to enable explicit 1920x1080 canvas size i have commented it for demonstration purpose 

      //   const canvasWidth = 1920;
      // const canvasHeight = 1080;

      // const canvas = fabricCanvasRef.current;
      // const prevWidth = canvas.width || 1;
      // const prevHeight = canvas.height || 1;

      // canvas.setWidth(canvasWidth);
      // canvas.setHeight(canvasHeight);

      // const scaleX = canvasWidth / prevWidth;
      // const scaleY = canvasHeight / prevHeight;


      canvas.getObjects().forEach((obj) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords();
      });

      canvas.renderAll();
    }
  };

  const updateCanvasObject = (updatedObject: any) => {
    console.log("function", updatedObject);
    setCanvasObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id === updatedObject.id) {
          return { ...obj, ...updatedObject }
        }


        return obj
      }

      )
    );
  };

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);


      fabricCanvasRef.current.on('object:modified', (e) => {
        const modifiedObject = e.target as CustomFabricObject;

        console.log("Object modified:", modifiedObject);
        updateCanvasObject({
          id: modifiedObject?.id,
          x: modifiedObject?.left,
          y: modifiedObject?.top,
          width: modifiedObject?.width * modifiedObject?.scaleX,
          height: modifiedObject?.height * modifiedObject?.scaleY,
          angle: modifiedObject?.angle,
        });
      });

      renderCanvasObjects(canvasObjects, fabricCanvasRef.current);
    }

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);






    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }


    };
  }, []);


  useEffect(() => {
    console.log('canvasObjects rendering our]ttttt');
    if (fabricCanvasRef.current) {
      console.log('canvasObjects rendering', canvasObjects);
      renderCanvasObjects(canvasObjects, fabricCanvasRef.current);
    }
  }, [canvasObjects]);


  console.log('canvasObjects', canvasObjects);

  const handleSelectedCanvas = (index: number) => {
    setSelectedCanvasIndex(index);
    fabricCanvasRef.current.clear();
    setCanvasObjects(allcanvases[index].data);
  }

  const isIndexCanvasSelected = (index: number) => {
    return selectedCanvasIndex === index;
  };


  return (
    <div ref={containerRef} className="h-full w-full">
      <div>
        <canvas ref={canvasRef} className="border border-gray-300 h-full w-full" />
        <div className='flex gap-2 mt-2'>
          {allcanvases.map((canvas, index) => (
            <div
              key={index}
              onClick={() => handleSelectedCanvas(index)}
              className={`p-2 border border-gray-300 w-fit text-xs cursor-pointer hover:bg-gray-100 ${isIndexCanvasSelected(index) ? 'bg-gray-300' : ''}`}
            >
              {canvas.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 max-h-full overflow-y-auto border-gray-300">
        {canvasObjects.map((object, index) => (
          <div key={index}>
            <p>{object.id}</p>
          </div>
        ))}
      </div>
      <div>
        {isConnected ? "Connected" : "Not Connected"}
      </div>

    </div>
  );
};

export default FabricCanvas;
