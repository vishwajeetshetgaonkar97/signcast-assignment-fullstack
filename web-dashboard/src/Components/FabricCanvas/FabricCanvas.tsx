import React, { useRef, useEffect, useContext, useState } from 'react';
import * as fabric from 'fabric';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';
import AllCanvasesObjectsDataContext from '../../Contexts/AllCanvasesObjectsDataContext';
import SelectedCanvasObjectIndexDataContext from '../../Contexts/SelectedCanvasObjectIndexDataContext';
import addCanvas from '../../api/addCanvas';
import MonitoringStateContext from '../../Contexts/MonitoringStateContext';
import getCanvases from '../../api/getCanvases';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}
interface CustomFabricObject extends fabric.Object {
  id?: string;
}

const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { allcanvases, setAllCanvases } = useContext(AllCanvasesObjectsDataContext);
  const { selectedCanvasIndex, setSelectedCanvasIndex } = useContext(SelectedCanvasObjectIndexDataContext);
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const { isMonitoring, setIsMonitoring } = useContext(MonitoringStateContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [newCanvasCategory, setNewCanvasCategory] = useState('');



  const isIndexCanvasSelected = (index: number) => {
    return selectedCanvasIndex === index;
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

      // const canvasWidth = 1920;
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

  const sendDeviceMonitoringStatus = (data: any) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(data));
    }
  };

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
       
          const x1 = obj.x1 + obj.x;
          const y1 = obj.y1 + obj.y;
          const x2 = obj.x2 + obj.x;
          const y2 = obj.y2 + obj.y;

          const angle = obj.angle;

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
            const updateImage = () => {
              currentIndex = (currentIndex + 1) % images.length;
              imgElement.src = images[currentIndex];
            };
        
            setInterval(updateImage, 4000);
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

    websocketRef.current = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");
    

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      const data = {
        name: "Master Device",
        status: "online",
      }
      sendDeviceMonitoringStatus(data)
      setIsMonitoring(true)
    };

    websocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);


        if (data.type === "updateAllCanvas") {
          console.log("Updating canvas objects for all:", data);
          setAllCanvases(data.canvases);
          setCanvasObjects(data.canvases[selectedCanvasIndex].data);
          if (!isMonitoring) {
            setIsMonitoring(true)
          }
        } else if (data.type === "notification") {
          console.log("Notification:", data.message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };


    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      const data = {
        name: "Master Device",
        status: "offline",
      }
      sendDeviceMonitoringStatus(data)
      setIsMonitoring(false)
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);


  useEffect(() => {
    if (fabricCanvasRef.current) {
      renderCanvasObjects(canvasObjects, fabricCanvasRef.current);
    }
  }, [canvasObjects]);



  const handleAddCanvas = async () => {
    try {
      if (newCanvasName.trim() && newCanvasCategory) {

        const postData = {
          name: newCanvasName,
          category: newCanvasCategory,
          data: [],
        };
        await addCanvas(postData);
       const data = await getCanvases();
       setAllCanvases(data.canvases);
        setIsModalOpen(false);
        return
      }

      alert('Please provide both a name and a category for the canvas.');
    } catch (error) {
      console.log(`canvas get issue ${error}`);
      alert('Error');
      setIsModalOpen(false);
    }
  }

  const handleSelectedCanvas = (index: number) => {
    setSelectedCanvasIndex(index);
    fabricCanvasRef.current.clear();
    setCanvasObjects(allcanvases[index].data);
  }

  return (
    <div ref={containerRef} className="h-full w-[80%]">
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

        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent cursor-pointer w-fit hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Canvas
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add New Canvas</h2>
              <input
                type="text"
                placeholder="Canvas Name"
                value={newCanvasName}
                onChange={(e) => setNewCanvasName(e.target.value)}
                className="w-full mb-4 px-3 py-2 border "
              />
              <select
                value={newCanvasCategory}
                onChange={(e) => setNewCanvasCategory(e.target.value)}
                className="w-full mb-4 px-3 py-2 border "
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="Special">Special</option>
                <option value="Preffered">Preffered</option>
              </select>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCanvas}
                  className="bg-blue-700 text-white px-4 py-2 hover:bg-blue-600"
                >
                  Add Canvas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricCanvas;




