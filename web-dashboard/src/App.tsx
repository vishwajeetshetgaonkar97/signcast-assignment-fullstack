import React, { useState } from "react";
import TopBar from "./Components/TopBar/TopBar";
import DigitalDrawingToolComponent from "./Components/DigitalDrawingToolComponent/DigitalDrawingToolComponent";


const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState("light");

  return (
    <div className={`${themeMode} bg-bg-color h-screen w-full text-text-color  px-4 py-2 font-poppins`}>
      <TopBar themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
        <DigitalDrawingToolComponent />
      </main>
    </div>
  );
};

export default App;
