import React, { useEffect, useMemo, useState } from "react";
import TopBar from "./Components/TopBar/TopBar";
import MainControlComponent from "./Components/MainControlComponent/MainControlComponent";
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
        <MainControlComponent />
      </main>
    </div>
    </MonitoringStateContext.Provider>
  );
};

export default App;
