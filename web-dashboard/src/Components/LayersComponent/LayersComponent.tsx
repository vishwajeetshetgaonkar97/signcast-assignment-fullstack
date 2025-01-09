import React, { useEffect, useState } from 'react';
import { Canvas, FabricObject } from 'fabric';
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";

interface CustomFabricObject extends FabricObject {
    id?: string;
    zIndex?: number;
}

interface LayersListProps {
    canvas: Canvas;
}

const LayersComponent: React.FC<LayersListProps> = ({ canvas }) => {
    const [layers, setLayers] = useState<CustomFabricObject[]>([]);
    const [selectedLayer, setSelectedLayer] = useState<CustomFabricObject | null>(null);

    const addIdToObject = (object: CustomFabricObject) => {
        if (!object.id) {
            const timestamp = new Date().getTime();
            object.id = `${object.type}_${timestamp}`;
        }
    };


    const moveSelectedLayer = (direction: 'up' | 'down') => {

        if (!selectedLayer) return;

        const allObjects = canvas.getObjects() as CustomFabricObject[];
        const selectedObject = allObjects.find(obj => obj.id === selectedLayer.id);

        if (selectedObject) {
            const currentIndex = allObjects.indexOf(selectedObject);

            if (direction === 'up' && currentIndex < allObjects.length - 1) {
                const temp = allObjects[currentIndex];
                allObjects[currentIndex] = allObjects[currentIndex + 1];
                allObjects[currentIndex + 1] = temp;
            } else if (direction === 'down' && currentIndex > 0) {
                const temp = allObjects[currentIndex];
                allObjects[currentIndex] = allObjects[currentIndex - 1];
                allObjects[currentIndex - 1] = temp;
            }

            const canvasBgColor = canvas.backgroundColor;

            canvas.clear();
            canvas.add(...allObjects);


            allObjects.forEach((obj, index) => {
                obj.set('zIndex', index);
                obj.zIndex = index;
            });

            canvas.backgroundColor = canvasBgColor;
            canvas.setActiveObject(selectedObject);
            canvas.renderAll();

            updateLayers()
        }
    };

    const handleObjectSelection = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null;

        setSelectedLayer(selectedObject || null);
    }

    const selectlayerInCanvas = (layerId: string) => {
        const selectedLayer = layers.find(layer => layer.id === layerId);
        if (selectedLayer) {
            canvas.setActiveObject(selectedLayer);
            canvas.renderAll();
        }
    };

    const updateLayers = () => {
        const objects = canvas.getObjects() as CustomFabricObject[];
        objects.forEach((obj, index) => {
            addIdToObject(obj);
            obj.set('zIndex', index);
            obj.zIndex = index;
        });



        setLayers([...objects].reverse());
    };


    useEffect(() => {
        if (canvas) {

            updateLayers();

            canvas.on('object:added', updateLayers);
            canvas.on('object:modified', updateLayers);
            canvas.on('object:removed', updateLayers);

            canvas.on('selection:created', handleObjectSelection);
            canvas.on('selection:updated', handleObjectSelection);
            canvas.on('selection:cleared', handleObjectSelection);

            return () => {
                canvas.off('object:added', updateLayers);
                canvas.off('object:modified', updateLayers);
                canvas.off('object:removed', updateLayers);

                canvas.off('selection:created', handleObjectSelection);
                canvas.off('selection:updated', handleObjectSelection);
                canvas.off('selection:cleared', handleObjectSelection);
            };
        }
    }, [canvas]);


    return (
        <div className="flex flex-col  w-fit min-w-[150px]  absolute top-12 left-2  bg-bg-color py-2 px-2 rounded shadow" >
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-border-color">
                <h6 className="text-xs opacity-80 font-semibold  min-w-[150px] ">Layers</h6>
                <div className="flex gap-1">
                    <FaAngleUp onClick={() => moveSelectedLayer('up')} className="text-xs opacity-80 hover:opacity-100 cursor-pointer" />
                    <FaAngleDown onClick={() => moveSelectedLayer('down')} className="text-xs opacity-80 hover:opacity-100 cursor-pointer" />
                </div>
            </div>

            <ul>
                {layers.map((layer, index) => {
                    console.log("layer", layer.id === selectedLayer?.id);
                    return (
                        <li key={layer.id} onClick={() => selectlayerInCanvas(layer.id)} className={`flex text-xs items-center w-full bg-bg-color hover:bg-card-color py-1 px-2 cursor-pointer rounded gap-2 ${layer.id === selectedLayer?.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}>

                            {layer.type} {layer.zIndex}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default LayersComponent;
