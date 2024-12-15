import React, { useEffect, useState } from "react";
import TopBar from "./Components/TopBar/TopBar";
import DigitalDrawingToolComponent from "./Components/DigitalDrawingToolComponent/DigitalDrawingToolComponent";
import getCanvases from "./api/getCanvases"
import { data } from "autoprefixer";
import addCanvas from "./api/addcanvas";

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState("light");

  const getCanvasData = async () => {
    try {
      const data = await getCanvases();
      console.log('canvases', data.canvases);

     
    } catch (error) {
      console.log(`canvas get issue ${error}`);
    }
  };


  const handleAddCanvas = async () => {
    console.log("Add Canvas");

    try {
      const postData = {
        name: "test canvas",
        category: 'cricket',
        data: `[{"type":"addRectangle","object":{"x":0,"y":0,"width":100,"height":100,"fillColor":"#ff0000","strokeColor":"#000000","strokeWidth":1,"isDraggable":true}}]`,
      };
      const log = await addCanvas(postData);
      console.log("log addition ", log);
    } catch (error) {

      console.log(`canvas get issue ${error}`);
      
    }
  };


  useEffect(() => {
    getCanvasData();
    handleAddCanvas();
  }, []);

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
