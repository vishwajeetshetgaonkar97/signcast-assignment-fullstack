import React, { useEffect, useMemo, useState } from "react";
import TopBar from "./Components/TopBar/TopBar";
import DigitalDrawingToolComponent from "./Components/DigitalDrawingToolComponent/DigitalDrawingToolComponent";
import MonitoringStateContext from "./Contexts/MonitoringStateContext";

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState("light");
const [isMonitoring, setIsMonitoring] = useState(false);


const monitoringStateContextValue = useMemo(
  () => ({ isMonitoring, setIsMonitoring}), 
  [isMonitoring, setIsMonitoring]
);
const updateOnlineStatus = () => setIsMonitoring(navigator.onLine);


useEffect(() => {
  window.addEventListener('offline', updateOnlineStatus);
  window.addEventListener('online', updateOnlineStatus);

  // Clean up event listeners when component unmounts
  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
}, []);

  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
    <div className={`${themeMode} bg-bg-color h-screen w-screen text-text-color  px-4 py-2 font-poppins`}>
      <TopBar themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
        <DigitalDrawingToolComponent />
      </main>
    </div>
    </MonitoringStateContext.Provider>
  );
};

export default App;
