import React, { useContext } from "react";
import { MdDeleteForever } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; 
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";

const 
RenderCanvasElementsComponent : React.FC  = () => {

  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);

  const deleteObject = (index: number) => {
    const updatedObjects = canvasObjects.filter((_, i) => i !== index);
    setCanvasObjects(updatedObjects);
  };

  const toggleVisibility = (index: number) => {
    const updatedObjects = canvasObjects.map((obj, i) =>
      i === index ? { ...obj, visible: !obj.visible } : obj
    );
    setCanvasObjects(updatedObjects);
  };

  return (
    <div className="h-max px-4 py-3 space-y-0 border border-border-color">
    <h4 className="font-semibold text-xs pb-2 opacity-80">Layers</h4>
    {canvasObjects.length > 0 ? (
      <ul className="h-max flex flex-col space-y-2">
        {canvasObjects.map((object, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-100 shadow-sm">
            <span className="text-xs " >{object.id || `Object ${index + 1}`}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleVisibility(index)}
                className="text-xs text-gray-700 hover:opacity-70"
              >
                {object.visible ? (
                  <AiOutlineEye size={18} /> 
                ) : (
                  <AiOutlineEyeInvisible size={18} /> 
                )}
              </button>
              <button
                onClick={() => deleteObject(index)}
                className="py-1 px-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <MdDeleteForever size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">No objects added to the canvas.</p>
    )}
  </div>
  );
};

export default RenderCanvasElementsComponent;
