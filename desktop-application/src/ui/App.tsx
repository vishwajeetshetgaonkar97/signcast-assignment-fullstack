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
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [screenId, setScreenId] = useState('');

  const monitoringStateContextValue = useMemo(
    () => ({ isMonitoring, setIsMonitoring }),
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

  useEffect(() => {
    getDeviceInfo();
  }, []);

  console.log('Device info:', deviceInfo);

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

  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
      <div className="h-screen w-full text-text-color  px-4 py-2 font-poppins">
        <TopBar isMonitoring={isMonitoring} />
        <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
          <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
        </main>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
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
    </MonitoringStateContext.Provider>
  );
}




export default App;
