import React, { useState, useEffect } from "react";
import * as fabric from "fabric";

interface DesignEditComponentProps {
  canvas: fabric.Canvas | null;
}

const DesignEditComponent: React.FC<DesignEditComponentProps> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [diameter, setDiameter] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [fontSize, setFontSize] = useState<string>("");
  const [angle, setAngle] = useState<string>("");


  useEffect(() => {
    if (canvas) {
      const handleObjectSelection = (object: fabric.Object) => {
        if (!object) return;
        setSelectedObject(object);

        if (object.type === "rect") {
          const rect = object as fabric.Rect;
          setWidth(Math.round(rect.width! * rect.scaleX!).toString());
          setHeight(Math.round(rect.height! * rect.scaleY!).toString());
          console.log("rect fill", rect.fill);
          setAngle(Math.round(object.angle).toString());
          setColor(rect.fill as string);
          setDiameter("");
        } else if (object.type === "circle") {
          const circle = object as fabric.Circle;
          setDiameter(Math.round(circle.radius! * 2 * circle.scaleX!).toString());
          setColor(circle.fill as string);
          setAngle(Math.round(object.angle).toString());
          setWidth("");
          setHeight("");
        } else if (object.type === "triangle") {
          const triangle = object as fabric.Triangle;
          setWidth(Math.round(triangle.width! * triangle.scaleX!).toString());
          setHeight(Math.round(triangle.height! * triangle.scaleY!).toString());
          setAngle(Math.round(object.angle).toString());
          setColor(triangle.fill as string);
          setDiameter("");
        } else if (object.type === "text") {
          const text = object as fabric.Text;
          setTextContent(text.text || "");
        setFontSize(Math.round(text.fontSize!).toString());
        setColor(text.fill as string);
        setAngle(Math.round(object.angle).toString());
        setWidth("");
        setHeight("");
        setDiameter("");
        } else {
          setWidth("");
          setHeight("");
          setColor("");
          setDiameter("");
          setTextContent("");
          setFontSize("");
          setAngle("");
        }
      };

      const clearSettings = () => {
        setWidth("");
        setHeight("");
        setColor("");
        setDiameter("");
      };


      canvas.on("selection:created", (event) => handleObjectSelection(event.selected[0]));
      canvas.on("selection:updated", (event) => handleObjectSelection(event.selected[0]));
      canvas.on("selection:cleared", clearSettings);
      canvas.on("object:modified", (event) => handleObjectSelection(event.target));
      canvas.on("object:scaling", (event) => {
        const object = event.target as fabric.Object;
        if (object.type === "text") {
          const text = object as fabric.Text;
          const adjustedFontSize = Math.round(text.fontSize! * text.scaleX!); 
          setFontSize(adjustedFontSize.toString());
        }
      });

      return () => {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
  canvas.off("object:modified");
      canvas.off("object:scaling");
      };
    }
  }, [canvas]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setWidth(value);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX! });
      canvas?.renderAll();
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setHeight(value);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleY! });
      canvas?.renderAll();
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setDiameter(value);

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX! });
      canvas?.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);

    if (selectedObject) {
      selectedObject.set("fill", value);
      canvas?.renderAll();
    }
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setAngle(value);

    if (selectedObject && intValue >= 0 && intValue <= 360) {
      selectedObject.set("angle", intValue);
      canvas?.renderAll();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextContent(value);

    if (selectedObject && selectedObject.type === "text") {
      const text = selectedObject as fabric.Text;
      text.set("text", value);
      canvas?.renderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setFontSize(value);

    if (selectedObject && selectedObject.type === "text" && intValue > 0) {
      const text = selectedObject as fabric.Text;
      text.set("fontSize", intValue);
      canvas?.renderAll();
    }
  };


  // if ((!width && !height && !diameter)) return null;
  return (
    <div className="flex flex-col  w-min  absolute top-12 right-2  bg-bg-color py-2 px-3 rounded shadow">
      <h6 className="text-xs opacity-80 font-semibold pb-2 min-w-[150px]">Appearance</h6>
      {width && <div className="flex flex-col ">
        <label className="text-xs opacity-80">Width</label>
        <input
          className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text" value={width} onChange={handleWidthChange} />
      </div>}
      {height && <div>
        <label className="text-xs opacity-80">Height</label>
        <input
          className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={height} onChange={handleHeightChange} />
      </div>}
      {diameter && <div>
        <label className="text-xs opacity-80">Diameter</label>
        <input
          className="w-full text-xs border rounded-md p-1  focus:outline-none focus:ring-2 focus:ring-blue-500"

          type="text" value={diameter} onChange={handleDiameterChange} />
      </div>}
      {angle && (
        <div>
          <label className="text-xs opacity-80">Angle</label>
          <input
            className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={angle}
            onChange={handleAngleChange}
          />
        </div>
      )}
      {color && <div>
        <label className="text-xs opacity-80">Color</label>

        <input
          className="w-full border rounded-sm  mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"

          type="color" value={color} onChange={handleColorChange} />
      </div>}

{selectedObject?.type === "text" && (
  <>
    <div>
      <label className="text-xs opacity-80">Text Content</label>
      <input
        className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={textContent}
        onChange={handleTextChange}
      />
    </div>
    <div>
      <label className="text-xs opacity-80">Font Size</label>
      <input
        className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        value={fontSize}
        onChange={handleFontSizeChange}
      />
    </div>
  </>
)}
    </div>
  );
};

export default DesignEditComponent;
