import React, { useState, useEffect, useMemo, useRef } from "react";
import FabricCanvas from "../FabricCanvas/FabricCanvas";
import ConfigurationSectionComponent from "../ConfigurationSectionComponent/ConfigurationSectionComponent";
import { fetchGoogleSheetData } from "../../api/fetchGoogleSheetData";
import {
  ScreenMFR,
  MediaPlayerMFR,
  Mounts,
  ReceptacleBox,
  AdditionalConfiguration,
  DescriptionConfig,
} from "../../types/GoogleSheetDataTypes";
import ScreenMFRDataContext from "../../Contexts/ScreenMFRDataContext";
import MediaPlayerMFRDataContext from "../../Contexts/MediaPlayerMFRDataContext";
import MountsDataContext from "../../Contexts/MountsDataContext";
import ReceptacleBoxDataContext from "../../Contexts/ReceptacleBoxDataContext";
import SelectedConfigurationContext from "../../Contexts/SelectedConfigurationContext";
import AdditionalConfigurationContext from "../../Contexts/AdditionalConfigurationContext";
import DescripotionDataContext from "../../Contexts/DescripotionDataContext";
import * as fabric from "fabric";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

const DigitalDrawingToolComponent: React.FC = () => {
  // local state references to data
  const [screenMFRData, setScreenMFRData] = useState<ScreenMFR[]>([]);
  const [mediaPlayerMFRData, setMediaPlayerMFRData] = useState<MediaPlayerMFR[]>([]);
  const [mountsData, setMountsData] = useState<Mounts[]>([]);
  const [receptacleBoxData, setReceptacleBoxData] = useState<ReceptacleBox[]>([]);

  const [selectedConfiguration, setSelectedConfiguration] = useState<{
    screenMFR?: ScreenMFR;
    mediaPlayerMFR?: MediaPlayerMFR;
    mount?: Mounts;
    receptacleBox?: ReceptacleBox;
  }>({});

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const [additionalConfiguration, setAdditionalConfiguration] = useState<AdditionalConfiguration>({
    orientation: "horizontal",
    nicheType: "niche",
    distanceFromFloor: 50,
    nicheVr: 1.5,
    nicheDepth: 0.5,
    rBoxHeight: 6.6,
    rBoxWidth: 6.012,
    rBoxDepth: 3.75,
  });

  const [descriptionConfiguration, setDescriptionConfiguration] = useState<DescriptionConfig>({
    title: `Horizontal + PC in Niche`,
    drawer: "SignCast",
    department: "installation",
    screenSize: `LG 55" Touch Display`,
    date: new Date().toLocaleDateString("en-GB").split("/").join("/"),
  });

  const isLoading = !selectedConfiguration || !selectedConfiguration.screenMFR;

  // fetch data from database: google sheet 
  const fetchDatabaseData = async () => {
    try {
      const data = await fetchGoogleSheetData();
      setScreenMFRData(data.screenMFRData);
      setMediaPlayerMFRData(data.mediaPlayerMFRData);
      setMountsData(data.mountsData);
      setReceptacleBoxData(data.receptacleBoxData);

      console.log("Fetched Data:", data);
    } catch (error) {
      console.error("Error fetching data from Google Apps Script:", error);
    }
  };

  // set local state Contexts 
  const ScreenMFRDataContextValue = useMemo(
    () => ({ screenMFRData, setScreenMFRData }),
    [screenMFRData, setScreenMFRData]
  );

  const MediaPlayerMFRDataContextValue = useMemo(
    () => ({ mediaPlayerMFRData, setMediaPlayerMFRData }),
    [mediaPlayerMFRData, setMediaPlayerMFRData]
  );

  const MountsDataContextValue = useMemo(
    () => ({ mountsData, setMountsData }),
    [mountsData, setMountsData]
  );

  const ReceptacleBoxDataContextValue = useMemo(
    () => ({ receptacleBoxData, setReceptacleBoxData }),
    [receptacleBoxData, setReceptacleBoxData]
  );

  const SelectedConfigurationContextValue = useMemo(
    () => ({ selectedConfiguration, setSelectedConfiguration }),
    [selectedConfiguration, setSelectedConfiguration]
  );

  const AdditionalConfigurationContextValue = useMemo(
    () => ({ additionalConfiguration, setAdditionalConfiguration }),
    [additionalConfiguration, setAdditionalConfiguration]
  );

  const DescriptionConfigurationContextValue = useMemo(
    () => ({ descriptionConfiguration, setDescriptionConfiguration }),
    [descriptionConfiguration, setDescriptionConfiguration]
  );

  // fetch data on load 
  useEffect(() => {
    fetchDatabaseData();
  }, []);

  return (
    <>
      {/* display loader on loading  */} {/* have used this method and not return on state loading to avoid bloacking of internal state updation */}
      <div className={` ${isLoading ? 'show absolute top-0 left-0 h-full w-full flex items-center justify-center bg-bg-color z-50' : 'hidden'}`}>
       <LoaderComponent />
      </div>
      <ScreenMFRDataContext.Provider value={ScreenMFRDataContextValue}>
        <MediaPlayerMFRDataContext.Provider value={MediaPlayerMFRDataContextValue}>
          <MountsDataContext.Provider value={MountsDataContextValue}>
            <ReceptacleBoxDataContext.Provider value={ReceptacleBoxDataContextValue}>
              <SelectedConfigurationContext.Provider value={SelectedConfigurationContextValue}>
                <AdditionalConfigurationContext.Provider value={AdditionalConfigurationContextValue}>
                  <DescripotionDataContext.Provider value={DescriptionConfigurationContextValue}>
                    <div className="flex h-full pb-2 align-center justify-center w-full gap-4 flex-col md:flex-row">
                      <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
                      <ConfigurationSectionComponent fabricCanvasRef={fabricCanvasRef} />
                    </div>
                  </DescripotionDataContext.Provider>
                </AdditionalConfigurationContext.Provider>
              </SelectedConfigurationContext.Provider>
            </ReceptacleBoxDataContext.Provider>
          </MountsDataContext.Provider>
        </MediaPlayerMFRDataContext.Provider>
      </ScreenMFRDataContext.Provider>
    </>
  );
};

export default DigitalDrawingToolComponent;
