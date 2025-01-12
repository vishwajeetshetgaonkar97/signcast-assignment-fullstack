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
import { addCircle, addImage, addRectangle,  addText, addTriangle } from "../../utils/CanvasDrawingsUtils";
import { ToastContainer, toast } from 'react-toastify';
import MonitoringStateContext from "../../Contexts/MonitoringStateContext";
import { BASE_WEB_SOCKET_URL } from '../../../constants';
import LoaderComponent from "../LoaderComponent/LoaderComponent";

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
  text?: string;
}

const CanvasParentComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.5);
  const [allcanvases, setAllCanvases] = useState<allcanvases[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);

  const { isMonitoring, setIsMonitoring } = useContext(MonitoringStateContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);

  // success notification 
  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      className: "bg-green-600 bg-blur bg-opacity-50 w-fit text-sm h-min py-1 px-4 mb-0 text-white rounded shadow-lg",
    });

  // Error notification
  const notifyError = (message: string) =>
    toast.error(message, {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      className: "bg-red-600 bg-blur bg-opacity-40 w-fit text-sm h-min py-1 px-4 mb-0 text-white rounded shadow-lg",
    });


  const renderCanvasObjects = (objects) => {

    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#fff";
      const sortedObjects = objects.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

      sortedObjects.forEach((object) => {
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
            text: object.text
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
        } else {
          console.log("Unknown object type:", object.type);
        }
      });

      canvas.renderAll();

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
      const retryDelay = 1000;
  
      const handlePing = () => {
        setLastPingTime(Date.now());
      };
  
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
            // console.log("Received data:", data);
  
            if (data.type === "updateAllCanvas") {
              console.log("Updating canvas objects for all:", data);
              setAllCanvases(data.canvases);
            } else if (data.type === "ping") {
              handlePing();
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
        if (reconnectAttempts <= maxReconnectAttempts) {
          reconnectAttempts += 1;
          const delay = retryDelay * reconnectAttempts;
          console.log(`Reconnecting in ${delay} ms...`);
  
          setTimeout(connectWebSocket, delay);
        } else {
          console.error("Max reconnect attempts reached. Stopping further attempts.");
          notifyError("Reconnection failed. Try again later.");
        }
      };
  
      // Initial WebSocket connection
      connectWebSocket();
  
      // Cleanup
      return () => {
        initCanvas.dispose();
        websocketRef.current?.close();
      };
    }
  }, []);
   
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastPingTime && Date.now() - lastPingTime > 6000) {
        console.warn("No ping received in the last 6 seconds. Backend may be down.");
        setIsMonitoring(false);
      }else if(!isMonitoring){
        setIsMonitoring(true);
      }
    }, 6000);
  
    return () => clearInterval(interval);
  }, [lastPingTime]);
  



  const getCanvasObjects = () => {
    if (canvas) {
      const objects = canvas.getObjects() as CustomFabricObject[];
      console.log(objects);
      objects.forEach((object) => {
        console.log(object.type);
        console.log(object.zIndex);
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



  const handleSyncCanvas = async () => {
    try {
  
      const currentObjects = getCanvasObjects() as CustomFabricObject[];
      const filteredObjects = currentObjects.filter((obj, index, self) => {
        return self.findIndex(o => o.id === obj.id) === index;
      });
      const updateCanvasPostBody = {
        canvasId: allcanvases[selectedCanvasIndex]._id,
        name: allcanvases[selectedCanvasIndex].name,
        category: allcanvases[selectedCanvasIndex].category,
        data: filteredObjects.map((object: CustomFabricObject) => {
          return {
            type: object.type,
            left: object.left,
            top: object.top,
            width: object.width,
            height: object.height,
            fill: object.fill,
            id: object.id,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle,
            zIndex: object.zIndex,
            imageUrl: object.imageUrl || "",
            visible: object.visible,
            text: object.text || "",
          };
        }),
      };

      console.log("body pushed", updateCanvasPostBody);
      // Send data to the backend to update the canvas
      await updateCanvas(updateCanvasPostBody);

      // console.log("Canvas synced successfully", log);

      notifySuccess("Canvas synced successfully");
    } catch (error) {
      console.log(`Canvas sync issue: ${error}`);
      notifyError("Error to sync canvas");
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

  // can be improved
  const isLoading = allcanvases.length <= 0;


  return (
    <AllCanvasesDataContext.Provider value={allCanvasDataContextValue}>
      <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>

        <>
          <ToastContainer />
          <div className={`absolute h-screen w-screen bg-bg-color flex items-center justify-center z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isLoading ? "" : "hidden"} `} >
            <LoaderComponent />
          </div>

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

            {isModalOpen && (
              <AddToCanvasModal handleAddCanvas={handleAddCanvas} setIsModalOpen={setIsModalOpen} />
            )}

            <div className="flex flex-row items-center justify-center absolute z-10 top-12  right-2 " onClick={handleSyncCanvas}>
              <button className={`bg-blue-600 text-xs  text-white px-4 py-2 rounded`}>Apply</button>
            </div>

            {/* disclaimer */}
            <h6 className="flex flex-row items-center justify-center text-xs text-yellow-500 absolute z-10 bottom-2 left-2 ">Note: Images might have some issues </h6>

            {/* used for debugging */}
            {/* <div className="flex flex-row items-center justify-center absolute z-10 bottom-2 left-2 ">
              <button onClick={getCanvasObjects}>Get Canvas Objects</button>
            </div> */}
          </div>
        </>
      </SelectedCanvasObjectIndexDataContext.Provider>
    </AllCanvasesDataContext.Provider>
  );
};

export default CanvasParentComponent;
