import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [canvases, setCanvases] = useState<any[]>([]); // Store the fetched canvases

  // Fetch canvases from main process using IPC
  const getAllCanvases = async () => {
    try {
      // Invoke the main process to get the canvases
      const canvases = await window.electron.getCanvases();
      console.log('canvases', canvases);
      setCanvases(canvases); // Save canvases in the state
    } catch (error) {
      console.log(`Canvas get issue: ${error}`);
      alert('Error loading data');
    }
  };

  useEffect(() => {
    getAllCanvases(); // Fetch canvases when component mounts
  }, []);

  console.log('canvases value', canvases);


  return (
    <div ref={containerRef} className="h-full w-full">
      <canvas ref={canvasRef} className="border border-gray-300 h-full w-full" />
    </div>
  );
};

export default FabricCanvas;
