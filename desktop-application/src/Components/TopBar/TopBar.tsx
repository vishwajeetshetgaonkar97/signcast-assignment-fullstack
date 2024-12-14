import React from "react";
import logoImg from '../../assets/logo.png'


const TopBar: React.FC = () => {



  return (
    <div className="flex w-full h-min justify-between  items-center dark:text-neutral-100">
      <img className="h-9" src={logoImg}alt="Logo" />

    </div>
  );
};

export default TopBar;
