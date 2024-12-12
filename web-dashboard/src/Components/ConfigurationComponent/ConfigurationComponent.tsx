import React, { useContext, useEffect, useState } from "react";
import ScreenMFRDataContext from "../../Contexts/ScreenMFRDataContext";
import MediaPlayerMFRDataContext from "../../Contexts/MediaPlayerMFRDataContext";
import MountsDataContext from "../../Contexts/MountsDataContext";
import ReceptacleBoxDataContext from "../../Contexts/ReceptacleBoxDataContext";
import SelectedConfigurationContext from "../../Contexts/SelectedConfigurationContext";
import AdditionalConfigurationContext from "../../Contexts/AdditionalConfigurationContext";


const ConfigurationComponent : React.FC = () => {
  const { screenMFRData } = useContext(ScreenMFRDataContext);
  const { mediaPlayerMFRData } = useContext(MediaPlayerMFRDataContext);
  const { mountsData } = useContext(MountsDataContext);
  const { receptacleBoxData } = useContext(ReceptacleBoxDataContext);
  const { selectedConfiguration, setSelectedConfiguration } = useContext(SelectedConfigurationContext);
  const { additionalConfiguration, setAdditionalConfiguration } = useContext(AdditionalConfigurationContext);


  // Default values initialization
  const [selectedValues, setSelectedValues] = useState({
    screenMFR: screenMFRData[0] || null,
    mediaPlayerMFR: mediaPlayerMFRData[0] || null,
    mount: mountsData[0] || null,
    receptacleBox: receptacleBoxData[0] || null,
  });

  // Additional Configuration state initialization
  const [additionalConfig, setAdditionalConfig] = useState({
    orientation: additionalConfiguration?.orientation || "horizontal",
    nicheType: additionalConfiguration?.nicheType || "niche",
    distanceFromFloor: additionalConfiguration?.distanceFromFloor || 50,
    nicheVr: additionalConfiguration?.nicheVr || 1.5,
    nicheDepth: additionalConfiguration?.nicheDepth || 0.5,
    rBoxHeight: additionalConfiguration?.rBoxHeight || 6.6,
    rBoxWidth: additionalConfiguration?.rBoxWidth || 6.012,
    rBoxDepth: additionalConfiguration?.rBoxDepth || 3.75
  });

  useEffect(() => {
    const updatedValues = {
      screenMFR: screenMFRData[0] || null,
      mediaPlayerMFR: mediaPlayerMFRData[0] || null,
      mount: mountsData[0] || null,
      receptacleBox: receptacleBoxData[0] || null,
    };
    setSelectedValues(updatedValues);
    setSelectedConfiguration(updatedValues);

  }, [screenMFRData, mediaPlayerMFRData, mountsData, receptacleBoxData]);

  const handleSelectionChange = (field: string, value: string) => {
    let updatedValue = null;
    if (field === "screenMFR") {
      updatedValue = screenMFRData.find(option => option["Screen MFR"] === value) || null;
    } else if (field === "mediaPlayerMFR") {
      updatedValue = mediaPlayerMFRData.find(option => option["MFG. PART"] === value) || null;
    } else if (field === "mount") {
      updatedValue = mountsData.find(option => option["MFG. PART"] === value) || null;
    } else if (field === "receptacleBox") {
      updatedValue = receptacleBoxData.find(option => option["MFG. PART"] === value) || null;
    }

    const updatedValues = { ...selectedValues, [field]: updatedValue };
    setSelectedValues(updatedValues);
    setSelectedConfiguration(updatedValues);
  };

  const handleAdditionalConfigChange = (field: string, value: string | number) => {
    const updatedConfig = { ...additionalConfig, [field]: value };
    setAdditionalConfig(updatedConfig);
    setAdditionalConfiguration(updatedConfig);
  };

  console.log("Selected Configuration:", selectedConfiguration);
  console.log("Additional Configuration:", additionalConfiguration);
  console.log("Selected Values:", selectedValues);

  return (
    <form className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-1 opacity-80 ">Configurations</h4>

      {/* Screen MFR */}
      <div className="pb-2">
        <label
          htmlFor="screenMFR"
          className="block mb-1 text-xs font-small text-text-color opacity-50"
        >
          Screen
        </label>
        <select
          id="screenMFR"
          value={selectedValues.screenMFR?.["Screen MFR"] || ""}
          onChange={(e) => handleSelectionChange("screenMFR", e.target.value)}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        >
          <option value="">Select Screen MFR</option>
          {screenMFRData.map((option, index) => (
            <option key={index} value={option["Screen MFR"]} className="text-card-text-color">
              {option["Screen MFR"]}
            </option>
          ))}
        </select>
      </div>

      {/* Media Player */}
      <div className="pb-2">
        <label
          htmlFor="mediaPlayerMFR"
          className="block mb-1 text-xs font-small text-text-color opacity-50"
        >
          Media Player
        </label>
        <select
          id="mediaPlayerMFR"
          value={selectedValues.mediaPlayerMFR?.["MFG. PART"] || ""}
          onChange={(e) => handleSelectionChange("mediaPlayerMFR", e.target.value)}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        >
          <option value="">Select Media Player MFR</option>
          {mediaPlayerMFRData.map((option, index) => (
            <option key={index} value={option["MFG. PART"]} className="text-card-text-color">
              {option["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>

      {/* Mount */}
      <div className="pb-2">
        <label
          htmlFor="mount"
          className="block mb-1 text-xs font-small text-text-color opacity-50"
        >
          Mount
        </label>
        <select
          id="mount"
          value={selectedValues.mount?.["MFG. PART"] || ""}
          onChange={(e) => handleSelectionChange("mount", e.target.value)}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        >
          <option value="">Select Mount</option>
          {mountsData.map((option, index) => (
            <option key={index} value={option["MFG. PART"]} className="text-card-text-color">
              {option["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>

      {/* Receptacle Box */}
      <div className="pb-2">
        <label
          htmlFor="receptacleBox"
          className="block mb-1 text-xs font-small text-text-color opacity-50"
        >
          Receptacle Box
        </label>
        <select
          id="receptacleBox"
          value={selectedValues.receptacleBox?.["MFG. PART"] || ""}
          onChange={(e) => handleSelectionChange("receptacleBox", e.target.value)}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        >
          <option value="">Select Receptacle Box</option>
          {receptacleBoxData.map((option, index) => (
            <option key={index} value={option["MFG. PART"]} className="text-card-text-color">
              {option["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Configurations */}
      <div className="flex align-center gap-0 pt-1">
        <button
          type="button"
          className={`w-full text-xs py-2 ${additionalConfig.orientation === "vertical" ? "bg-blue-700 bg-opacity-90 text-blue-50 hover:bg-blue-600" : "text-text-color border border-border-color hover:bg-card-color"} focus:outline-none  `}
          onClick={() => handleAdditionalConfigChange("orientation", "vertical")}
        >
          Vertical
        </button>
        <button
          type="button"
          className={`w-full text-xs py-2 ${additionalConfig.orientation === "horizontal" ? "bg-blue-700 bg-opacity-90 text-blue-50 hover:bg-blue-600" : "text-text-color border border-border-color hover:bg-card-color"} focus:outline-none `}
          onClick={() => handleAdditionalConfigChange("orientation", "horizontal")}
        >
          Horizontal
        </button>
      </div>

      <div className="flex align-center gap-0 pt-1">
        <button
          type="button"
          className={`w-full py-2  text-xs ${additionalConfig.nicheType === "niche" ? "bg-blue-700 bg-opacity-90 text-blue-50 hover:bg-blue-600" : "text-text-color border border-border-color hover:bg-card-color"} focus:outline-none `}
          onClick={() => handleAdditionalConfigChange("nicheType", "niche")}
        >
          Niche
        </button>
        <button
          type="button"
          className={`w-full py-2 text-xs  ${additionalConfig.nicheType === "flat wall" ? "bg-blue-700 bg-opacity-90 text-blue-50 hover:bg-blue-600" : "text-text-color border border-border-color hover:bg-card-color"} focus:outline-none `}
          onClick={() => handleAdditionalConfigChange("nicheType", "flat wall")}
        >
          Flat Wall
        </button>
      </div>

      <div className="flex align-center gap-0 pt-1 ">
        <label
          htmlFor="distanceFromFloor"
          className="flex content-center items-center justify-center mb-1 text-xs font-small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
        >
          Floor Distance
        </label>
        <input
          type="number"
          id="distanceFromFloor"
          value={additionalConfig.distanceFromFloor}
          onChange={(e) => handleAdditionalConfigChange("distanceFromFloor", e.target.value)}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
        />
      </div>

      {/* added this variable to control niche  */}
      {additionalConfig && additionalConfig.nicheType === "niche" && <>

        <div className="flex align-center gap-0 pt-1 ">
          <label
            htmlFor="nicheDepth"
            className="flex content-center items-center justify-center mb-1 text-xs font-Small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
          >
            Niche Vr.
          </label>
          <input
            type="number"
            id="nicheVr"
            value={additionalConfig.nicheVr}
            onChange={(e) => handleAdditionalConfigChange("nicheVr", e.target.value)}
            className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
          />
        </div>


        <div className="flex align-center gap-0 pt-1 ">
          <label
            htmlFor="nicheDepth"
            className="flex content-center items-center justify-center mb-1 text-xs font-Small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
          >
            Niche Depth Vr.
          </label>
          <input
            type="number"
            id="nicheDepth"
            value={additionalConfig.nicheDepth}
            onChange={(e) => handleAdditionalConfigChange("nicheDepth", e.target.value)}
            className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
          />
        </div>
      </>}

      {/* receptor box dimensions control variables  */}
      <div className="flex align-center flex-col gap-0 pt-2">
        <label
          htmlFor="mount"
          className="block  text-xs font-small text-text-color opacity-50"
        >
          Receptor Box Dimensions
        </label>

        <div className="flex align-center gap-0 pt-1 ">
          <label
            htmlFor="rBoxHeight"
            className="flex content-center items-center justify-center mb-1 text-xs font-small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
          >
            Rec. Box Ht.
          </label>
          <input
            type="number"
            id="rBoxHeight"
            value={additionalConfig.rBoxHeight}
            onChange={(e) => handleAdditionalConfigChange("rBoxHeight", e.target.value)}
            className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
          />
        </div>
        <div className="flex align-center gap-0 pt-1 ">
          <label
            htmlFor="rBoxWidth"
            className="flex content-center items-center justify-center mb-1 text-xs font-small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
          >
            Rec. Box Wt.
          </label>
          <input
            type="number"
            id="rBoxWidth"
            value={additionalConfig.rBoxWidth}
            onChange={(e) => handleAdditionalConfigChange("rBoxWidth", e.target.value)}
            className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
          />
        </div>
        <div className="flex align-center gap-0 pt-1 ">
          <label
            htmlFor="rBoxDepth"
            className="flex content-center items-center justify-center mb-1 text-xs font-small text-text-color opacity-50 border border-border-color bg-border-color text-card-text-color w-1/2 h-9 px-1 text-center"
          >
            Rec. Box Wt.
          </label>
          <input
            type="number"
            id="rBoxDepth"
            value={additionalConfig.rBoxDepth}
            onChange={(e) => handleAdditionalConfigChange("rBoxDepth", e.target.value)}
            className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-9 p-1.5 text-center"
          />
        </div>
      </div>
    </form>
  )
}

export default ConfigurationComponent