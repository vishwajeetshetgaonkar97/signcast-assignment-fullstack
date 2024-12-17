import axios from "axios";
import { ScreenMFR, MediaPlayerMFR, Mounts, ReceptacleBox } from "../types/GoogleSheetDataTypes";


export const fetchGoogleSheetData = async (): Promise<{
  screenMFRData: ScreenMFR[];
  mediaPlayerMFRData: MediaPlayerMFR[];
  mountsData: Mounts[];
  receptacleBoxData: ReceptacleBox[];
}> => {
  const url = "https://script.google.com/macros/s/AKfycbxbxx2RQwkbJoR63ODqJnXFNhkp-kWLj10xEjPeGqg54nRoSYv_nV6MNgsJRSc0nEg/exec"; // Replace with your Google Apps Script URL
  
  try {
    const response = await axios.get(url);
    
    return {
      screenMFRData: response.data.screenMFRData,
      mediaPlayerMFRData: response.data.mediaPlayerMFRData,
      mountsData: response.data.mountsData,
      receptacleBoxData: response.data.receptacleBoxData,
    };
  } catch (error) {
    console.error("Error fetching data", error);
    throw new Error("Error fetching data");
  }
};
