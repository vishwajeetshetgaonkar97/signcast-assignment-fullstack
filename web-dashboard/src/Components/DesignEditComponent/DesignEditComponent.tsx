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
          setColor(rect.fill as string);
          setDiameter("");
        } else if (object.type === "circle") {
          const circle = object as fabric.Circle;
          setDiameter(Math.round(circle.radius! * 2 * circle.scaleX!).toString());
          setColor(circle.fill as string);
          setWidth("");
          setHeight("");
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
      canvas.on("object:scaling", (event) => handleObjectSelection(event.target));

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
  if (!selectedObject || !canvas || !selectedObject.type || (!width && !height && !diameter)) return null;
  return (
    <div className="flex flex-col  w-min  absolute top-12 right-2  bg-bg-color py-2 px-3 rounded shadow">
      <h6 className="text-xs opacity-80 font-semibold pb-2">Appearance</h6>
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
          className="w-full text-xs border rounded-md p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"

          type="text" value={diameter} onChange={handleDiameterChange} />
      </div>}
      {color && <div>
        <label className="text-xs opacity-80">Color</label>

        <input
          className="w-full border rounded-sm  mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"

          type="color" value={color} onChange={handleColorChange} />
      </div>}
    </div>
  );
};

export default DesignEditComponent;
