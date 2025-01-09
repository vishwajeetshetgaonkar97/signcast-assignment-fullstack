import React, { useEffect, useState } from 'react';
import { Canvas, FabricObject } from 'fabric';

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

    useEffect(() => {
        if (canvas) {
            const updateLayers = () => {
                const objects = canvas.getObjects() as CustomFabricObject[];
                objects.forEach((obj, index) => {
                    addIdToObject(obj);
                    obj.set('zIndex', index);
                    obj.zIndex = index;
                });



                setLayers([...objects].reverse());
            };

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
            <h6 className="text-xs opacity-80 font-semibold pb-2 mb-2 min-w-[150px] border-b border-border-color">Layers</h6>
            <ul>
                {layers.map((layer, index) => {
                    console.log("layer", layer.id === selectedLayer?.id);
                    return(
                    <li key={layer.id} onClick={() => selectlayerInCanvas(layer.id)} className={`flex text-xs items-center w-full bg-bg-color hover:bg-card-color py-1 px-2 cursor-pointer rounded gap-2 ${layer.id === selectedLayer?.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}>
                     
                   {layer.type} {layer.zIndex}
                    </li>
                )})}
            </ul>
        </div>
    );
};

export default LayersComponent;
