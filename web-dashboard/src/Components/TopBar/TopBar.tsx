import React, { useContext } from "react";
import MonitoringStateContext from "../../Contexts/MonitoringStateContext";

interface ThemeSelectionProps {
  themeMode: string;
  // options to add more themes 
  setThemeMode: (mode: "dark" | "light" | "ocean") => void;
}

const TopBar: React.FC<ThemeSelectionProps> = ({ themeMode, setThemeMode }) => {

  const { isMonitoring } = useContext(MonitoringStateContext);

  // this logic can be upgraded to add more themes 
  const toggleDMode = () => {
    // can try ocean mode commenting this line
    setThemeMode(themeMode === "light" ? "dark" : "light");
    // uncomment this line to use ocean mode 
    // setThemeMode(themeMode === "light" ? "ocean" : "light");
  };

  return (
    <div className="flex w-full h-min justify-between  items-center dark:text-neutral-100">
      <img className="h-9" src="/logo.png" alt="Logo" />
      <div className="text-sm flex gap-2 flex-row items-center ">
        <div >
          {isMonitoring ? (
            <span className="text-green-500">Online</span>
          ) : (
            <span className="text-red-500">Offline</span>
          )}
        </div>

        <button
          onClick={toggleDMode}
          className="h-9 w-9 rounded-sm p-2 hover:bg-card-color "
        >
          <svg
            className={`fill-violet-700 ${themeMode === "light" ? "block" : "hidden"
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            className={`fill-yellow-500 ${themeMode === "light" ? "hidden" : "block"
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default TopBar;
