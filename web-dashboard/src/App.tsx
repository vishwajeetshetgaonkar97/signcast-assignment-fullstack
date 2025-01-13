import React, { useMemo, useState } from "react";
import TopBar from "./Components/TopBar/TopBar";
import MonitoringStateContext from "./Contexts/MonitoringStateContext";
import CanvasParentComponent from "./Components/CanvasParentComponent/CanvasParentComponent";

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState("light");
const [isMonitoring, setIsMonitoring] = useState(true);

const monitoringStateContextValue = useMemo(
  () => ({ isMonitoring, setIsMonitoring}), 
  [isMonitoring, setIsMonitoring]
);


  return (
    <MonitoringStateContext.Provider value={monitoringStateContextValue}>
    <div className={`${themeMode} bg-bg-color h-screen w-screen text-text-color font-poppins`}>
      <TopBar themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className={`flex h-[95%] w-full align-center justify-center  pt-2 flex-col ${themeMode === "light" ? "bg-gray-100 border-gray-100" : "bg-zinc-800 border-zinc-800"} border  overflow-hidden`}>
        <CanvasParentComponent/>
      </main>
    </div>
    </MonitoringStateContext.Provider>
  );
};

export default App;
