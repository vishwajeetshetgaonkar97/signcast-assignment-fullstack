import { useEffect, useMemo, useRef, useState } from 'react';
import * as fabric from "fabric";
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import FabricCanvas from '../Components/FabricCanvas/FabricCanvas';
import MonitoringStateContext from '../Contexts/MonitoringStateContext';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>; 
}

function App() {

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

const monitoringStateContextValue = useMemo(
  () => ({ isMonitoring, setIsMonitoring}), 
  [isMonitoring, setIsMonitoring]
);

const updateOnlineStatus = () => setIsMonitoring(navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
    <div className="h-screen w-full text-text-color  px-4 py-2 font-poppins">
      <TopBar isMonitoring={isMonitoring}/>
      <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
        <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
      </main>
    </div>
    </MonitoringStateContext.Provider>
  );
}




export default App;
