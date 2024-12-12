import { createContext } from "react";
import { AdditionalConfiguration } from "../types/GoogleSheetDataTypes";

interface AdditionalConfigurationContextProps {
  additionalConfiguration: AdditionalConfiguration;
  setAdditionalConfiguration: React.Dispatch<React.SetStateAction<AdditionalConfiguration>>;
}

const AdditionalConfigurationContext = createContext<AdditionalConfigurationContextProps | undefined>(undefined);

export default AdditionalConfigurationContext;