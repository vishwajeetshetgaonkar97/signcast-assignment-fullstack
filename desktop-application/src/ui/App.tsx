import { useEffect, useMemo, useRef, useState } from 'react';
import * as fabric from "fabric";
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import MonitoringStateContext from '../Contexts/MonitoringStateContext';
import CanvasParentComponent from '../Components/CanvasParentComponent/CanvasParentComponent';
import { ToastContainer, toast } from 'react-toastify';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}



function App() {
 
  const [themeMode, setThemeMode] = useState("light");
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [screenId, setScreenId] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);

  // error notification 
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


  const getDeviceInfo = async () => {
    try {

      const checkIfSignedIn = JSON.parse(localStorage.getItem('signedIn') || 'false');
      if (checkIfSignedIn) {
        notifyError('Already Signed In');
        setIsModalOpen(false);
        return;
      }
      if (isMonitoring) {
        console.log('Getting device info...');
        const deviceInfo = await window.electron.getDevices();
        console.log('Device info:', deviceInfo);
        setDeviceInfo(deviceInfo);
      }

    }
    catch (error) {
      console.error('Error getting device info:', error);
    }
  };
  const handleModalSubmit = () => {
    if (!isMonitoring) {
      notifyError('Please Connect to Internet');
      return;
    }
    if (screenId) {
      if (deviceInfo && deviceInfo.pairingCode === screenId) {
        setIsModalOpen(false);
        localStorage.setItem('signedIn', JSON.stringify(screenId));
        console.log('Screen ID:', screenId);
        return;
      }
      notifyError('Please enter Correct screen ID');
    }
    notifyError('Error');
  };
 
  useEffect(() => {
    getDeviceInfo();
  }, []);

  console.log("isConnected", isMonitoring);

  const monitoringStateContextValue = useMemo(
    () => ({ isMonitoring, setIsMonitoring }),
    [isMonitoring, setIsMonitoring]
  );


  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
      <div className={` ${themeMode} bg-bg-color h-screen w-full text-text-color  px-4 py-2 font-poppins`}>
        <TopBar themeMode={themeMode} setThemeMode={setThemeMode} />
        <main className={`flex h-[95%] w-full align-center justify-center  pt-2 flex-col ${themeMode === "light" ? "bg-gray-100 border-gray-100" : "bg-zinc-800 border-zinc-800"} border  overflow-hidden`}>
          <CanvasParentComponent />
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
    </MonitoringStateContext.Provider>
  );
}




export default App;
