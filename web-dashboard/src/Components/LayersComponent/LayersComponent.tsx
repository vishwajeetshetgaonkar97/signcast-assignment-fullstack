import React, { useEffect, useState, useContext } from 'react';
import { Canvas, FabricObject } from 'fabric';
import { FaAngleUp, FaAngleDown, FaEye, FaEyeSlash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import AllCanvasesDataContext from '../../Contexts/AllCanvasesDataContext';

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
    const {allcanvases} = useContext(AllCanvasesDataContext);

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

            updateLayers();
        }
    };

    const handleObjectSelection = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null;
        setSelectedLayer(selectedObject || null);
    }

    const selectLayerInCanvas = (layerId: string) => {
        const selectedLayer = layers.find(layer => layer.id === layerId);
        if (selectedLayer) {
            canvas.setActiveObject(selectedLayer);
            canvas.renderAll();
        }
    };
 
    const toggleLayerVisibility = (layerId: string) => {
        const selectedLayer = layers.find(layer => layer.id === layerId);
        if (selectedLayer) {
            selectedLayer.set('visible', !selectedLayer.visible);
            canvas.renderAll();
            updateLayers();
        }
    };

    const deleteLayer = (layerId: string) => {
        const selectedLayer = layers.find(layer => layer.id === layerId);
        if (selectedLayer) {
            canvas.remove(selectedLayer);
            updateLayers();
        }
    };

    const updateLayers = () => {
        const objects = canvas.getObjects() as CustomFabricObject[];
        console.log("update layer object",objects);
        // removes dublicasted objects 
        const filteredObjects = objects.filter((obj, index, self) => {
            return self.findIndex(o => o.id === obj.id) === index;
          });
        console.log(filteredObjects);
        filteredObjects.forEach((obj, index) => {
            // addIdToObject(obj);
            console.log(obj.type);
            console.log(obj.zIndex);
            console.log(index);
            console.log(obj.id);
            obj.set('zIndex', index);
            obj.zIndex = index;
        });

        setLayers([...filteredObjects].reverse());
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

    if (!canvas || layers.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col w-fit min-w-[150px] absolute top-12 left-2 bg-bg-color py-2 px-2 rounded shadow">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-border-color">
                <h6 className="text-xs opacity-80 font-semibold min-w-[150px]">Layers</h6>
                <div className="flex items-center gap-1">
                    <FaAngleUp size={14} onClick={() => moveSelectedLayer('up')} className="text-xs opacity-80 hover:opacity-100 cursor-pointer hover:text-green-600" />
                    <FaAngleDown size={14} onClick={() => moveSelectedLayer('down')} className="text-xs opacity-80 hover:opacity-100 cursor-pointer hover:text-yellow-600" />
                </div>
            </div>

            <ul className='flex flex-col gap-1 max-h-[88vh] overflow-y-auto'>
                {layers.map((layer) => (
                    <li
                        key={layer.id}
                        onClick={() => selectLayerInCanvas(layer.id)}
                        className={`flex text-xs items-center w-full bg-bg-color hover:bg-card-color py-1 px-2 cursor-pointer rounded gap-2 ${layer.id === selectedLayer?.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
                    >
                        {layer.type} {layer.zIndex}

                        <div className="flex items-center gap-1 ml-auto">
                            {layer.visible ?
                                <FaEye
                                    onClick={() => toggleLayerVisibility(layer.id)}
                                    className={`text-xs cursor-pointer  text-gray-400 hover:text-gray-600 '}`}
                                /> :

                                <FaEyeSlash
                                    onClick={() => toggleLayerVisibility(layer.id)}
                                    className={`text-xs cursor-pointer  text-gray-400 hover:text-gray-600 '}`}
                                />
                            }

                            <RxCross2
                                size={14}
                                onClick={() => deleteLayer(layer.id)}
                                className="text-xs  cursor-pointer hover:text-red-500"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayersComponent;
