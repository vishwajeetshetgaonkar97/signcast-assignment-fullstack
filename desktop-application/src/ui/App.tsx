import { useEffect, useMemo, useRef, useState } from 'react';
import * as fabric from "fabric";
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import FabricCanvas from '../Components/FabricCanvas/FabricCanvas';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>; 
}

function App() {

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  return (
    <div className="h-screen w-full text-text-color  px-4 py-2 font-poppins">
      <TopBar/>
      <main className="flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ">
        <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
      </main>
    </div>
  );
}




export default App;
