import React, { useRef, useEffect, useContext, useState } from 'react';
import * as fabric from 'fabric';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';
import AllCanvasesObjectsDataContext from '../../Contexts/AllCanvasesObjectsDataContext';
import SelectedCanvasObjectIndexDataContext from '../../Contexts/SelectedCanvasObjectIndexDataContext';
import addCanvas from '../../api/addCanvas';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}



const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { allcanvases, setAllCanvases } = useContext(AllCanvasesObjectsDataContext);
  const { selectedCanvasIndex , setSelectedCanvasIndex} = useContext(SelectedCanvasObjectIndexDataContext);
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [newCanvasCategory, setNewCanvasCategory] = useState('');



  const isIndexCanvasSelected = (index: number) => {
    return selectedCanvasIndex === index;
  };

  console.log("canvas local array", canvasObjects);

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
    setCanvasObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === updatedObject.id ? { ...obj, ...updatedObject } : obj
      )
    );
  };

  const sendCanvasObjectData = (data: any) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(data));
    }
  };

  const renderCanvasObjects = (canvasObjects, canvas) => {
    canvas.clear();
    canvasObjects.forEach(obj => {
      if (obj.visible) {
        let canvasObject;
        if (obj.type === 'rectangle') {
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

          // need improvement angle affects positioning


          const x1 = obj.x1 + obj.x;
          const y1 = obj.y1 + obj.y;
          const x2 = obj.x2 + obj.x;
          const y2 = obj.y2 + obj.y;
          const angle = obj.angle;
          canvasObject = new fabric.Line([x1, y1, x2, y2], {
            stroke: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            selectable: obj.isDraggable,
            lockMovementX: !obj.isDraggable,
            lockMovementY: !obj.isDraggable,
            angle: angle,
          });
        }
        canvasObject.id = obj.id;
        canvas.add(canvasObject);
      }
    });
    canvas.renderAll();
  };


  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
  
      fabricCanvasRef.current.on('object:modified', (e) => {
        const modifiedObject = e.target;
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
  
    // Establish WebSocket connection
    websocketRef.current = new WebSocket("ws://localhost:3000");
  
    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };
  
    websocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

  
        // Example: Handle received data
        if (data.type === "updateAllCanvas") {
          // Update canvas objects with the received data
          console.log("Updating canvas objects for all:", data);
          setAllCanvases(data.canvases);
          setCanvasObjects(data.canvases[selectedCanvasIndex].data);

          // setCanvasObjects(data.canvasObjects);
        } else if (data.type === "notification") {
          // Show a notification or log data
          console.log("Notification:", data.message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };


    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
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
  
      // Close WebSocket connection
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
        const log = await addCanvas(postData);
        console.log("log addition ", log);
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
            className={`p-2 border border-gray-300 w-fit text-xs cursor-pointer ${isIndexCanvasSelected(index) ? 'bg-gray-200' : ''}`}
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




