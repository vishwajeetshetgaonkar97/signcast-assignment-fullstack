import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "fabric";
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

interface allcanvases {
  name: string;
  category: string;
  data: [];
}

const CanvasParentComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.5);
  const [allcanvases, setAllCanvases] = useState<allcanvases[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);


  const getAllCanvases = async () => {
    try {
      const data = await getCanvases();
      console.log('canvases', data.canvases);
      setAllCanvases(data.canvases);

      const objects = data.canvases[0].data

      console.log("objects on call", objects)


      if (canvas) {
        canvas.add(...objects);
        canvas.renderAll();
      } else {
        console.log("no canvas, creating a new one");
        const newCanvas = new fabric.Canvas(canvasRef.current, {
          width: 1920,
          height: 1080,
        });
        newCanvas.backgroundColor = "#fff";
        newCanvas.add(...objects);
        newCanvas.renderAll();
        setCanvas(newCanvas);
      }

    } catch (error) {
      console.log(`canvas get issue ${error}`);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1920,
        height: 1080,
      });
      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);
      getAllCanvases();

      // socket connection 

      // websocketRef.current = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");

      websocketRef.current = new WebSocket("ws://localhost:3003");

      websocketRef.current.onopen = () => {
        console.log("WebSocket connected");
        const data = {
          name: "Master Device",
          status: "online",
        }
        // sendDeviceMonitoringStatus(data)
        // setIsMonitoring(true)
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);


          if (data.type === "updateAllCanvas") {
            console.log("Updating canvas objects for all:", data);
            setAllCanvases(data.canvases);
            // setCanvasObjects(data.canvases[selectedCanvasIndex].data);
            // if (!isMonitoring) {
            //   setIsMonitoring(true)
            // }
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
        // sendDeviceMonitoringStatus(data)
        // setIsMonitoring(false)
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      }

      return () => {
        initCanvas.dispose();
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
      const currenObjects = canvas.getObjects()
      const updateCanvasPostBody = {
        canvasId: allcanvases[selectedCanvasIndex]._id,
        name: allcanvases[selectedCanvasIndex].name,
        category: allcanvases[selectedCanvasIndex].category,
        data: currenObjects,
      };
      console.log("body posted", updateCanvasPostBody)
      const log = await updateCanvas(updateCanvasPostBody);
      console.log("log addition", log);
      // setIsSyncRequired(false);
    } catch (error) {
      console.log(`canvas sync issue ${error}`);
      alert('Error to sync canvas');
    }
  };


  console.log("allcanvases", allcanvases);
  console.log("canvas", canvas)

  return (
    <AllCanvasesDataContext.Provider value={allCanvasDataContextValue}>
      <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>

        <>
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
            />



            <div className="flex flex-row items-center justify-center absolute z-10 bottom-2 left-2 ">
              <button onClick={getCanvasObjects}>Get Canvas Objects</button>
            </div>


            {isModalOpen && (
              <AddToCanvasModal handleAddCanvas={handleAddCanvas} setIsModalOpen={setIsModalOpen} />
            )}

            <div className="flex flex-row items-center justify-center absolute z-10 bottom-15 right-2 " onClick={handleSyncCanvas}>
              <button>Sync</button>
            </div>


          </div>
        </>
      </SelectedCanvasObjectIndexDataContext.Provider>
    </AllCanvasesDataContext.Provider>
  );
};

export default CanvasParentComponent;
