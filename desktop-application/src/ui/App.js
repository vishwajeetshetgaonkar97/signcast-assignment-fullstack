import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import './App.css';
import TopBar from '../Components/TopBar/TopBar';
import FabricCanvas from '../Components/FabricCanvas/FabricCanvas';
function App() {
    const fabricCanvasRef = useRef(null);
    const [themeMode, setThemeMode] = useState("light");
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [screenId, setScreenId] = useState('');
    const [allcanvases, setAllCanvases] = useState([]);
    const [canvasObjects, setCanvasObjects] = useState([]);
    const [selectedCanvasIndex, setSelectedCanvasIndex] = useState(0);
    const [isAutoSync, setIsAutoSync] = useState(true);
    const isAutoSyncRef = useRef(isAutoSync);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        isAutoSyncRef.current = isAutoSync;
    }, [isAutoSync]);
    const getDeviceInfo = async () => {
        try {
            console.log('Getting device info...');
            const deviceInfo = await window.electron.getDevices();
            console.log('Device info:', deviceInfo);
            setDeviceInfo(deviceInfo);
        }
        catch (error) {
            console.error('Error getting device info:', error);
        }
    };
    const handleModalSubmit = () => {
        if (screenId) {
            if (deviceInfo && deviceInfo.pairingCode === screenId) {
                setIsModalOpen(false);
                console.log('Screen ID:', screenId);
                return;
            }
            alert('Please enter Correct screen ID');
        }
        alert('Please enter a screen ID');
    };
    const getAllCanvases = async () => {
        try {
            const canvases = await window.electron.getCanvases();
            console.log('canvases rendering main', canvases);
            setAllCanvases(canvases);
            setCanvasObjects(canvases[selectedCanvasIndex].data);
        }
        catch (error) {
            console.log(`Canvas get issue: ${error}`);
        }
    };
    const setupWebSocket = async () => {
        try {
            const wss = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");
            wss.onopen = () => {
                console.log("WebSocket connected");
                // to set auto sync 
                if (!isConnected) {
                    getAllCanvases();
                }
                setIsConnected(true);
            };
            wss.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.action === "updateAllCanvas") {
                        if (isAutoSyncRef.current) {
                            console.log("isAutoSync inside socket", isAutoSync);
                            console.log("Updating canvas objects for all:", data);
                            setAllCanvases(data.canvases);
                            setCanvasObjects(data.canvases[selectedCanvasIndex].data);
                        }
                    }
                    else if (data.type === "notification") {
                        console.log("Notification:", data.message);
                    }
                }
                catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
            wss.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
            };
        }
        catch (error) {
            console.log(`Canvas get issue: ${error}`);
        }
    };
    useEffect(() => {
        getDeviceInfo();
        getAllCanvases();
        setupWebSocket();
    }, []);
    const setLocalData = async () => {
        localStorage.setItem('canvases', JSON.stringify("yes data gets saved in"));
    };
    const getLocalData = async () => {
        const data = localStorage.getItem('canvases');
        console.log(data);
    };
    const handleFullscreen = () => {
        window.electron.toggleFullscreen();
    };
    return (_jsxs("div", { className: ` ${themeMode} bg-bg-color h-screen w-full text-text-color font-poppins`, children: [_jsx(TopBar, { isConnected: isConnected, themeMode: themeMode, setThemeMode: setThemeMode }), _jsxs("main", { className: "flex h-[95%] pb-2 align-center justify-center  pt-2 flex-col ", children: [_jsx(FabricCanvas, { fabricCanvasRef: fabricCanvasRef, allcanvases: allcanvases, setAllCanvases: setAllCanvases, canvasObjects: canvasObjects, setCanvasObjects: setCanvasObjects, selectedCanvasIndex: selectedCanvasIndex, setSelectedCanvasIndex: setSelectedCanvasIndex, syncCanvas: getAllCanvases, isAutoSync: isAutoSync, setIsAutoSync: setIsAutoSync }), _jsx("button", { onClick: setLocalData, children: " set data in" }), _jsx("button", { onClick: getLocalData, children: " get data" }), _jsx("button", { onClick: handleFullscreen, children: "fullscreen" })] }), isModalOpen && (_jsx("div", { className: "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-blue-800  z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-1/3 text-center shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Enter Screen ID" }), _jsx("input", { type: "text", placeholder: "Screen ID", value: screenId, onChange: (e) => setScreenId(e.target.value), className: "w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: handleModalSubmit, className: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600", children: "Submit" })] }) }))] }));
}
export default App;
