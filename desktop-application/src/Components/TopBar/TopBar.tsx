import React from "react";
import logoImg from '../../assets/logo.png';

interface TopBarProps {
  isConnected: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ isConnected }) => {
  return (
    <div className="flex w-full h-min justify-between items-center dark:text-neutral-100">
      <img className="h-9" src={logoImg} alt="Logo" />
      <div>
        {isConnected ? (
          <span className="text-green-500">Online</span>
        ) : (
          <span className="text-red-500">Offline</span>
        )}
      </div>
    </div>
  );
};

export default TopBar;
