import { useEffect, useMemo, useRef, useState } from 'react';
import * as fabric from "fabric";
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import MonitoringStateContext from '../Contexts/MonitoringStateContext';
import CanvasParentComponent from '../Components/CanvasParentComponent/CanvasParentComponent';
import { ToastContainer, toast } from 'react-toastify';
import FullScreenStateContext from '../Contexts/FullScreenStateContext';
import AutoSyncStateContext from '../Contexts/AutoSyncStateContext';
import getIfDeviceOperational from '../api/getIfDeviceOperational';

function App() {
  
  const [themeMode, setThemeMode] = useState("light");
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [screenId, setScreenId] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(false);
 
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
        // notifyError('Already Signed In');
        setIsModalOpen(false);
        return;
      }
      if (isMonitoring) {
        console.log('Getting device info...');
        // const deviceInfo = await window.electron.getDevices();
        const deviceInfo = await getIfDeviceOperational();
        console.log('Device info:', deviceInfo);
        const devicInfoDestructured = deviceInfo.deviceop;
        console.log('Device info:', devicInfoDestructured);
        setDeviceInfo(devicInfoDestructured);
      }

    }
    catch (error) {
      console.error('Error getting device info:', error);
    }
  };
  const handleModalSubmit = () => {
    if (!isMonitoring) {
      notifyError('Please Connect to Internet First or Try Again Later'); 
      return;
    }
    // can be improved 
    if (!deviceInfo) {
      getDeviceInfo();
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
      return;
    }
    notifyError('Error');
  };

  useEffect(() => {
    getDeviceInfo();
  }, []);

  const monitoringStateContextValue = useMemo(
    () => ({ isMonitoring, setIsMonitoring }),
    [isMonitoring, setIsMonitoring]
  );

  const fullScreenStateContextValue = useMemo(
    () => ({ isFullScreen, setIsFullScreen }),
    [isFullScreen, setIsFullScreen]
  );

  const isAutoSyncStateContextValue = useMemo(
    () => ({ isAutoSync, setIsAutoSync }),
    [isAutoSync, setIsAutoSync]
  );


  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
      <FullScreenStateContext.Provider value={fullScreenStateContextValue}>
        <AutoSyncStateContext.Provider value={isAutoSyncStateContextValue}>

          <div className={` ${themeMode} bg-bg-color h-screen w-full text-text-color   font-poppins`}>
            {!isFullScreen && <TopBar themeMode={themeMode} setModalOpen={setIsModalOpen} setThemeMode={setThemeMode} />}
            <main className={`flex  ${isFullScreen ? " absolute top-0 left-0 w-screen h-screen align-center justify-center" : "h-[95%] w-full"} align-center justify-center  flex-col ${themeMode === "light" ? "bg-gray-100 border-gray-100" : "bg-zinc-800 border-zinc-800"} border  overflow-hidden`}>
              <CanvasParentComponent />
            </main>

            {isModalOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-blue-800  z-50">
                <div className="bg-white rounded-lg p-6 w-1/3 text-center shadow-lg">
                  <h2 className="text-xl  text-gray-800 font-semibold mb-4">Enter Screen ID to Continue </h2>
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
        </AutoSyncStateContext.Provider>
      </FullScreenStateContext.Provider>
    </MonitoringStateContext.Provider>
  );
}




export default App;
