import React, { useState } from "react";

interface PostDataProps {
    name: string;
    category: string;
    data: string[];
  }
interface AddToCanvasModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddCanvas: (postData: PostDataProps) => void;
}

const AddToCanvasModal: React.FC<AddToCanvasModalProps> = ({
  setIsModalOpen,
  handleAddCanvas,
}) => {
    const [newCanvasName, setNewCanvasName] = useState('');
    const [newCanvasCategory, setNewCanvasCategory] = useState('');

    const handleAddCanvasButton = ()=>{
        if (newCanvasName.trim() && newCanvasCategory) {

            const postData = {
              name: newCanvasName,
              category: newCanvasCategory,
              data: [],
            };

            handleAddCanvas(postData)
            return
        }
        alert('Please provide both a name and a category for the canvas.');

    }
    
  return ( 
    <div className="fixed z-12 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" flex flex-col gap-2 min-w-[400px] bg-bg-color p-3 px-4 shadow-lg rounded">
      <h6 className="text-md font-semibold pb-2 mb-2 min-w-[150px] border-b border-border-color">Add Canvas</h6>
        <input
          type="text"
          placeholder="Canvas Name"
           className="w-full border border-border-color rounded-sm text-text-color bg-bg-color px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          value={newCanvasName}
          onChange={(e) => setNewCanvasName(e.target.value)}
         
        />
        <select
          value={newCanvasCategory}
          onChange={(e) => setNewCanvasCategory(e.target.value)}
           className="w-full border border-border-color rounded-sm text-text-color px-2 py-1 bg-bg-color  mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <option value="" className="text-sm">Select Category</option>
          <option value="General">General</option>
          <option value="Special">Special</option>
          <option value="Preferred">Preferred</option>
        </select>
        <div className="flex justify-end gap-4 mt-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-200 text-text-color text-sm px-3 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCanvasButton}
            className="bg-blue-700 text-sm rounded text-white px-3 py-2 hover:bg-blue-600"
          >
            Add Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCanvasModal;
