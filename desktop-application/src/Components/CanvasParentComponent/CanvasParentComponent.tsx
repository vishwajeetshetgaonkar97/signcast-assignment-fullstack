import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { Canvas, FabricObject } from "fabric";
import * as fabric from "fabric";
import LayersComponent from "../LayersComponent/LayersComponent";
import CanvasZoomInOutComponent from "../CanvasZoomInOutComponent/CanvasZoomInOutComponent";
import CanvasScreensComponent from "../CanvasScreensComponent/CanvasScreensComponent";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";
import { addCircle, addImage, addImageSlider, addRectangle, addText, addTriangle } from "../../../utils/CanvasDrawingsUtils";
import { ToastContainer, toast } from 'react-toastify';
import AllCanvasesDataContext from "../../Contexts/AllCanvasesDataContext";
import MonitoringStateContext from "../../Contexts/MonitoringStateContext";
import FullScreenStateContext from "../../Contexts/FullScreenStateContext";
import getCanvases from "../../api/getCanvases";

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

  
  const [isAutoSync, setIsAutoSync] = useState(true);
  const isAutoSyncRef = useRef(true);
  const websocketRef = useRef<WebSocket | null>(null);

  const { isMonitoring, setIsMonitoring } = useContext(MonitoringStateContext);

  const { isFullScreen } = useContext(FullScreenStateContext);

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
        if (object.isSlider) {
          addImageSlider({
            canvas: canvas,
            top: object.top,
            left: object.left,
            width: object.width,
            height: object.height,
            angle: object.angle,
            id: object.id,
            zIndex: object.zIndex,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            visible: object.visible,
          })
        } else if (object.type === "rect") {
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
 
  const handleAllCanvasesSocketData = (data) => {
    if (isAutoSyncRef.current) {
      // console.log("Updating canvas objects for all:", data);
      setAllCanvases(data);
      localStorage.setItem('allCanvases', JSON.stringify(data));
      renderCanvasObjects(data[0].data);
    }
  }

  const getAllCanvases = async () => {
    try {
      // removed for electron application build
      // const data = await window.electron.getCanvases();
      const data = await getCanvases();
      const dataDestructured = data.canvases
      console.log("Fetched canvases:", dataDestructured);
      if (!dataDestructured) {
        notifyError("Error")
        return
      }
      setAllCanvases(dataDestructured);

      // store data locally 
      localStorage.setItem('allCanvases', JSON.stringify(dataDestructured));
      // Assuming the first canvas is the one we need
      const objects = dataDestructured[0].data as CustomFabricObject[];
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

    const checkIfLocalCanvases = localStorage.getItem('allCanvases');
    if (checkIfLocalCanvases && !isMonitoring) {
      setAllCanvases(JSON.parse(checkIfLocalCanvases));
      renderCanvasObjects(JSON.parse(checkIfLocalCanvases)[0].data);
    }

    const handlePing = () => {
      setLastPingTime(Date.now());
    };

    const retryDelay = 3000; // 3 seconds

    const connectWebSocket = () => {
      websocketRef.current = new WebSocket("wss://signcast-assignment-fullstack-production-32ab.up.railway.app/");

      websocketRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsMonitoring(true);
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "updateAllCanvas") {
            handleAllCanvasesSocketData(data.canvases);
          } else if (data.type === "ping") {
            handlePing();
            setIsMonitoring(true);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket disconnected. Retrying...");
        setIsMonitoring(false);
        setTimeout(connectWebSocket, retryDelay); // Retry infinite retry connection after 3 every seconds
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        websocketRef.current.close(); // Ensure the socket is closed before retrying to avoid replecated connections
      };
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
      console.log("Checking ping time...");
      if (lastPingTime && Date.now() - lastPingTime > 6000) {
        console.warn("No ping received in the last 6 seconds. Backend may be down.");
        setIsMonitoring(false);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [lastPingTime]);

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


  const syncStateWithRef = () => {
    setIsAutoSync(isAutoSyncRef.current);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      syncStateWithRef();
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleSyncCanvas = async () => {
    try {

      if (!isMonitoring) {
        notifyError("Please Connect to Internet")
        return
      }
      getAllCanvases();
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


  const handleAutoSync = () => {
    isAutoSyncRef.current = !isAutoSyncRef.current;
  };


  return (
    <AllCanvasesDataContext.Provider value={allCanvasDataContextValue}>
      <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>

        <>
          <ToastContainer />

          <div className={"flex items-center justify-center "}  >

            <div className={`flex items-center justify-center ${isFullScreen ? "relative h-screen w-screen" : ""} `} style={{ transform: `scale(${scale})` }}>
              <canvas id="canvas" ref={canvasRef} />
            </div>

            {/* <AddToCanvasComponent canvas={canvas} /> */}
            <CanvasZoomInOutComponent scale={scale} setScale={setScale} />
            {/* <DesignEditComponent canvas={canvas} /> */}
            {!isFullScreen && <LayersComponent canvas={canvas} />}

            {!isFullScreen && <CanvasScreensComponent canvas={canvas}
              handleScreenChange={handleScreenChange}
            />
            }

            {!isFullScreen && <>

              <div className="flex flex-row items-center justify-center absolute z-10 top-12  gap-2 right-2 " >
                <div className="relative group mt-1">
                  <button
                    onClick={handleAutoSync}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isAutoSync ? 'bg-yellow-400' : 'bg-gray-300'}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAutoSync ? 'translate-x-6' : 'translate-x-0'}`}
                    ></div>
                  </button>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isAutoSync ? 'Auto Sync is ON' : 'Auto Sync is OFF'}
                  </div>
                </div>

                <button onClick={handleSyncCanvas} className={`bg-green-600 text-xs  text-white px-4 py-2 rounded`}>Sync Data</button>
              </div>

              {/* disclaimer */}
              <h6 className="flex flex-row items-center justify-center text-xs text-yellow-500 absolute z-10 bottom-2 left-2 ">Note: Images might have some issues </h6>
            </>}
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
