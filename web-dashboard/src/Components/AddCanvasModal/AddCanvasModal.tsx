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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Canvas</h2>
        <input
          type="text"
          placeholder="Canvas Name"
          value={newCanvasName}
          onChange={(e) => setNewCanvasName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border"
        />
        <select
          value={newCanvasCategory}
          onChange={(e) => setNewCanvasCategory(e.target.value)}
          className="w-full mb-4 px-3 py-2 border"
        >
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="Special">Special</option>
          <option value="Preferred">Preferred</option>
        </select>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCanvasButton}
            className="bg-blue-700 text-white px-4 py-2 hover:bg-blue-600"
          >
            Add Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCanvasModal;
