import React from 'react';
import { Canvas,  Text } from "fabric";
import * as fabric from "fabric";
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { RxText } from "react-icons/rx";
import { LuTriangle } from "react-icons/lu";
import { MdOutlineImage } from "react-icons/md";
import uploadImage from '../../api/uploadImage';
import { addCircle, addRectangle, addTriangle } from '../../utils/CanvasDrawingsUtils';

interface AddToCanvasProps {
    canvas: Canvas;
}

const AddToCanvasComponent: React.FC<AddToCanvasProps> = ({ canvas }) => {


    const addText = () => {
        if (canvas) {
            const text = new Text("Hello World", {
                top: 100,
                left: 50,
                fontSize: 24,
                fill: "#000000",
            });
            canvas.add(text);
        }
    };



    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvas) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const dataUrl = event.target?.result?.toString();
                if (dataUrl) {
                    try {
                        // Upload the image to the backend
                        const imageUrl = await uploadImage(dataUrl);

                        console.log('Image URL:', imageUrl);

                        // Once the image is uploaded, add it to the canvas
                        const imgObj = new Image();
                        imgObj.src = imageUrl.imageUrl;
                        imgObj.onload = () => {
                            const fabricImage = new fabric.Image(imgObj);
                            fabricImage.set({
                                left: 100,
                                top: 100,
                                scaleX: 0.5,
                                scaleY: 0.5,
                            });

                            if (canvas) {
                                canvas.add(fabricImage);
                                canvas.renderAll();
                            }
                        };
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                }
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-row w-min gap-3 absolute z-10 top-12 left-1/2 transform -translate-x-1/2 bg-bg-color py-2 px-3 rounded shadow">
            <FaRegSquare className="cursor-pointer hover:text-violet-700" 
           onClick={() => addRectangle({ canvas })}
            size={20} />
            <FaRegCircle className="cursor-pointer hover:text-fuchsia-500" 
            onClick={() => addCircle({ canvas })} 
            size={20} />
            <LuTriangle className="cursor-pointer hover:text-green-500" onClick={() => addTriangle({ canvas })} size={20} />
            <RxText className="cursor-pointer hover:text-blue-500" onClick={addText} size={20} />

            <label htmlFor="fileUpload" className="cursor-pointer hover:text-rose-500">
                <MdOutlineImage size={20} />
            </label>

            <input
                id="fileUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
        </div>
    );
};

export default AddToCanvasComponent;