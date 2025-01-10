import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { Canvas, FabricObject } from "fabric";
import * as fabric from "fabric";
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";
import LayersComponent from "../LayersComponent/LayersComponent";
import addCanvas from "../../api/addCanvas";
import getCanvases from "../../api/getCanvases";
import AddToCanvasComponent from "../AddToCanvasComponents/AddToCanvasComponent";
import CanvasZoomInOutComponent from "../CanvasZoomInOutComponent/CanvasZoomInOutComponent";
import CanvasScreensComponent from "../CanvasScreensComponent/CanvasScreensComponent";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";
import AllCanvasesDataContext from "../../Contexts/AllCanvasesDataContext";
import AddToCanvasModal from "../AddCanvasModal/AddCanvasModal";
import updateCanvas from "../../api/updateCanvas";
import { addCircle, addImage, addRectangle, addText, addTriangle } from "../../utils/CanvasDrawingsUtils";
import { ToastContainer, toast } from 'react-toastify';
import MonitoringStateContext from "../../Contexts/MonitoringStateContext";
import { BASE_WEB_SOCKET_URL } from '../../../constants';

interface allcanvases {
  _id?: string;
  name: string;
  category: string;
  data: [];
}


interface CustomFabricObject extends FabricObject {
  id?: string;
  zIndex?: number;
  radius?: number;
  fontSize?: number;
  imageUrl?: string;
}

const CanvasParentComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.5);
  const [allcanvases, setAllCanvases] = useState<allcanvases[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);

  const {setIsMonitoring } = useContext(MonitoringStateContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);


  const renderCanvasObjects = (objects) => {
    console.log("2234t", objects);
    console.log("canvas", canvas);

    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#fff";
      console.log("Canvas exists, adding objects", objects);
      objects.forEach((object) => {
        if (object.type === "rect") {
          addRectangle({
            canvas: canvas,
            top: object.top,
            left: object.left,
            width: object.width,
            height: object.height,
            fill: typeof object.fill === "string" ? object.fill : "#FF0000",
            angle: object.angle,
            selectable: object.selectable,
            id: object.id,
            zIndex: object.zIndex,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            visible: object.visible,
          });
        } else if (object.type === "circle") {
          addCircle({
            canvas: canvas,
            top: object.top,
            left: object.left,
            radius: object.radius,
            fill: typeof object.fill === "string" ? object.fill : "#0000FF",
            angle: object.angle,
            selectable: object.selectable,
            id: object.id,
            zIndex: object.zIndex,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            visible: object.visible,
          });
        } else if (object.type === "triangle") {
          addTriangle({
            canvas: canvas,
            top: object.top,
            left: object.left,
            width: object.width,
            height: object.height,
            fill: typeof object.fill === "string" ? object.fill : "#00FF00",
            angle: object.angle,
            selectable: object.selectable,
            id: object.id,
            zIndex: object.zIndex,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            visible: object.visible,
          });
        } else if (object.type === "text") {
          addText({
            canvas: canvas,
            top: object.top,
            left: object.left,
            fontSize: object.fontSize,
            fill: typeof object.fill === "string" ? object.fill : "#000000",
            angle: object.angle,
            selectable: object.selectable,
            id: object.id,
            zIndex: object.zIndex,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            visible: object.visible,
          });
        } else if (object.type === "image") {
          addImage({
            canvas: canvas,
            imageUrl: object.imageUrl,
            top: object.top,
            left: object.left,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle,
            id: object.id,
            zIndex: object.zIndex,
            selectable: object.selectable,
            visible: object.visible,
          })
        }
      });

      canvas.renderAll();

      // fabric.util.enlivenObjects(objects, (enlivenedObjects) => {
      //   enlivenedObjects.forEach((object) => {
      //     canvas.add(object);
      //   });
      //   canvas.renderAll();
      // });
    }
  };



  const getAllCanvases = async () => {
    try {
      const data = await getCanvases();
      console.log("Fetched canvases:", data.canvases);
      setAllCanvases(data.canvases);

      // Assuming the first canvas is the one we need
      const objects = data.canvases[0].data as CustomFabricObject[];
      console.log("Fetched objects:", objects);

      renderCanvasObjects(objects);
    } catch (error) {
      console.log(`Canvas fetch issue: ${error}`);
    }
  };


    useEffect(() => {
      if (canvasRef.current) {
        // Initialize canvas
        const initCanvas = new Canvas(canvasRef.current, {
          width: 1920,
          height: 1080,
        });
        initCanvas.backgroundColor = "#fff";
        initCanvas.renderAll();
        setCanvas(initCanvas);
    
        // Reconnection constants
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const retryDelay = 5000;
    
        const connectWebSocket = () => {
          websocketRef.current = new WebSocket(BASE_WEB_SOCKET_URL);
    
          websocketRef.current.onopen = () => {
            console.log("WebSocket connected");
            reconnectAttempts = 0; // Reset attempts on successful connection
            setIsMonitoring(true);
          };
    
          websocketRef.current.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log("Received data:", data);
    
              if (data.action === "updateAllCanvas") {
                setAllCanvases(data.canvases);
              } else if (data.type === "notification") {
                console.log("Notification:", data.message);
              }
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          };
    
          websocketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
            setIsMonitoring(false);
            attemptReconnect();
          };
    
          websocketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
          };
        };
    
        const attemptReconnect = () => {
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts += 1;
            const delay = retryDelay * reconnectAttempts;
            console.log(`Reconnecting in ${delay} ms...`);
            setTimeout(connectWebSocket, delay);
          } else {
            console.error("Max reconnect attempts reached. Stopping further attempts.");
          }
        };
    
        // Initial WebSocket connection
        connectWebSocket();
    
        // Cleanup on unmount
        return () => {
          initCanvas.dispose();
          websocketRef.current?.close();
        };
      }
    }, []);
    



  const getCanvasObjects = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      console.log(objects);
      objects.forEach((object) => {
        console.log(object.type);
      });
      return objects;
    }
    return [];
  };




  const handleAddCanvas = async (postData) => {
    try {

      await addCanvas(postData);
      const data = await getCanvases();
      console.log("dataaa canvass", data);
      setAllCanvases(data.canvases);
      setIsModalOpen(false);

    } catch (error) {
      console.log(`canvas get issue ${error}`);
      alert('Error');
      setIsModalOpen(false);
    }
  }

  const handleScreenChange = (index: number) => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#fff";
      renderCanvasObjects(allcanvases[index].data);
      setSelectedCanvasIndex(index);
      canvas.renderAll();
    }
  };

  const allCanvasDataContextValue = useMemo(
    () => ({ allcanvases, setAllCanvases }),
    [allcanvases, setAllCanvases]
  );


  const selectedCanvasIndexContextValue = useMemo(
    () => ({ selectedCanvasIndex, setSelectedCanvasIndex }),
    [selectedCanvasIndex, setSelectedCanvasIndex]
  );


  const notifySuccess = () =>
    toast.success("Canvas synced successfully!", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      className: "bg-green-600 bg-opacity-60 text-sm h-[40px]  text-white rounded shadow-lg",
    });

  // Error notification
  const notifyError = () =>
    toast.error("Error syncing canvas. Please try again.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "bg-red-500 text-white font-semibold rounded-lg shadow-lg",
    });

  const handleSyncCanvas = async () => {
    try {
      const currentObjects = getCanvasObjects();
      const updateCanvasPostBody = {
        canvasId: allcanvases[selectedCanvasIndex]._id,
        name: allcanvases[selectedCanvasIndex].name,
        category: allcanvases[selectedCanvasIndex].category,
        data: currentObjects.map((object: CustomFabricObject) => {
          return {
            type: object.type,
            left: object.left,
            top: object.top,
            width: object.width,
            height: object.height,
            fill: object.fill,
            id: object.id ?? "",
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle,
            zIndex: object.zIndex || 1,
            imageUrl: object.imageUrl || "",
            visible: object.visible,
          };
        }),
      };

      // Send data to the backend to update the canvas
      const log = await updateCanvas(updateCanvasPostBody);

      console.log("Canvas synced successfully", log);
      notifySuccess();
    } catch (error) {
      console.log(`Canvas sync issue: ${error}`);
      notifyError();
    }
  };

  useEffect(() => {
    if (canvas && allcanvases.length <= 0) {
      getAllCanvases();
    }
  }, [canvas])

  useEffect(() => {
    if (canvas && allcanvases.length > 0) {
      renderCanvasObjects(allcanvases[selectedCanvasIndex].data);
    }
  }, [allcanvases])


  return (
    <AllCanvasesDataContext.Provider value={allCanvasDataContextValue}>
      <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>

        <>
          <ToastContainer />
          <div className={"flex items-center justify-center "}  >

            <div className={"flex items-center justify-center "} style={{ transform: `scale(${scale})` }}>
              <canvas id="canvas" ref={canvasRef} />
            </div>


            <AddToCanvasComponent canvas={canvas} />
            <CanvasZoomInOutComponent scale={scale} setScale={setScale} />
            <DesignEditComponent canvas={canvas} />
            <LayersComponent canvas={canvas} />

            <CanvasScreensComponent canvas={canvas}
              setIsModalOpen={setIsModalOpen}
              handleScreenChange={handleScreenChange}
            />



            <div className="flex flex-row items-center justify-center absolute z-10 bottom-2 left-2 ">
              <button onClick={getCanvasObjects}>Get Canvas Objects</button>
            </div>


            {isModalOpen && (
              <AddToCanvasModal handleAddCanvas={handleAddCanvas} setIsModalOpen={setIsModalOpen} />
            )}

            <div className="flex flex-row items-center justify-center absolute z-10 top-12  right-2 " onClick={handleSyncCanvas}>
              <button className={`bg-blue-600 text-xs  text-white px-4 py-2 rounded`}>Apply</button>
            </div>

          </div>
        </>
      </SelectedCanvasObjectIndexDataContext.Provider>
    </AllCanvasesDataContext.Provider>
  );
};

export default CanvasParentComponent;
