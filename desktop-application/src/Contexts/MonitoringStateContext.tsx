import { createContext } from "react";

interface MonitoringStateContextProps {
  isMonitoring: boolean;
  setIsMonitoring: React.Dispatch<React.SetStateAction<boolean>>;
}

const MonitoringStateContext = createContext<MonitoringStateContextProps | undefined>(undefined);

export default MonitoringStateContext;
