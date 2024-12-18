import { useEffect, useMemo, useRef, useState } from 'react';
import * as fabric from "fabric";
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import FabricCanvas from '../Components/FabricCanvas/FabricCanvas';
import MonitoringStateContext from '../Contexts/MonitoringStateContext';
import { get } from 'http';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

function App() {

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [screenId, setScreenId] = useState('');
  const [allcanvases, setAllCanvases] = useState<any[]>([]);
  const [canvasObjects, setCanvasObjects] = useState<any[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);
  const [isAutoSync, setIsAutoSync] = useState<boolean>(true);
  const isAutoSyncRef = useRef(isAutoSync); 

  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    isAutoSyncRef.current = isAutoSync;
  }, [isAutoSync]);

  const getDeviceInfo = async () => {
    try {
      console.log('Getting device info...');
      const deviceInfo = await window.electron.getDevices();
      console.log('Device info:', deviceInfo);
      setDeviceInfo(deviceInfo);
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  };


  const handleModalSubmit = () => {
    if (screenId) {
      if (deviceInfo && deviceInfo.pairingCode === screenId) {
        setIsModalOpen(false);
        console.log('Screen ID:', screenId);
        return
      }
      alert('Please enter Correct screen ID');
    }
    alert('Please enter a screen ID');
  };

  const getAllCanvases = async () => {
    try {
      const canvases = await window.electron.getCanvases();
      console.log('canvases rendering main', canvases);
        setAllCanvases(canvases);
        setCanvasObjects(canvases[selectedCanvasIndex].data);
      


    } catch (error) {
      console.log(`Canvas get issue: ${error}`);
    }
  };

  const setupWebSocket = async () => {
    try {
      
      const wss = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");

      wss.onopen = () => {
        console.log("WebSocket connected");

        // to set auto sync 
        if(!isConnected ){
          getAllCanvases();
        }
        setIsConnected(true);
      };


      wss.onmessage = (event: any) => {
        try {
          const data = JSON.parse(event.data);

          if (data.action === "updateAllCanvas") {
           
            if(isAutoSyncRef.current){
              console.log("isAutoSync inside socket", isAutoSync);
              console.log("Updating canvas objects for all:", data);
              setAllCanvases(data.canvases);
              setCanvasObjects(data.canvases[selectedCanvasIndex].data);
            }
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
    getDeviceInfo();
    getAllCanvases();
    setupWebSocket();
  }, []);

  return (
      <div className="h-screen w-full text-text-color  px-4 py-2 font-poppins">
        <TopBar isConnected={isConnected} />
        <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
          <FabricCanvas 
          fabricCanvasRef={fabricCanvasRef} 
          allcanvases={allcanvases} 
          setAllCanvases={setAllCanvases} 
          canvasObjects={canvasObjects} 
          setCanvasObjects={setCanvasObjects}
          selectedCanvasIndex={selectedCanvasIndex}
          setSelectedCanvasIndex={setSelectedCanvasIndex}
          syncCanvas={getAllCanvases}
          isAutoSync={isAutoSync}
          setIsAutoSync={setIsAutoSync}
          />
        </main>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-blue-800  z-50">
            <div className="bg-white rounded-lg p-6 w-1/3 text-center shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Enter Screen ID</h2>
              <input
                type="text"
                placeholder="Screen ID"
                value={screenId}
                onChange={(e) => setScreenId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleModalSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
  );
}




export default App;
