import React, { useContext, useState } from "react";
import DescripotionDataContext from "../../Contexts/DescripotionDataContext";

const DescriptionConfigComponent : React.FC = () => {
  const { descriptionConfiguration, setDescriptionConfiguration } = useContext(DescripotionDataContext);

  // Default values initialization
  const [descriptionValues, setDescriptionValues] = useState({
    title: descriptionConfiguration?.title || "",
    drawer: descriptionConfiguration?.drawer || "",
    department: descriptionConfiguration?.department || "",
    screenSize: descriptionConfiguration?.screenSize || "",
    date: descriptionConfiguration?.date || "",
  });

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "date") {
      formattedValue = formatDate(value);
    }

    setDescriptionValues((prevValues) => ({
      ...prevValues,
      [name]: formattedValue,
    }));

    const updatedDescriptionConfig = {
      ...descriptionConfiguration,
      [name]: formattedValue,
    };
    setDescriptionConfiguration(updatedDescriptionConfig);
  };

  console.log(descriptionConfiguration);
  return (
    <form className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-2 opacity-80">Description</h4>
      <div className="pb-2">
        <label
          htmlFor="title"
          className="block mb-1 text-xs font-small text-text-color opacity-50"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={descriptionValues.title}
          onChange={handleChange}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        />
      </div>

      <div className="pb-2">
        <label htmlFor="drawer" className="block mb-1 text-xs font-small text-text-color opacity-50">
          Drawer
        </label>
        <input
          type="text"
          id="drawer"
          name="drawer"
          value={descriptionValues.drawer}
          onChange={handleChange}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        />
      </div>

      <div className="pb-2">
        <label htmlFor="department" className="block mb-1 text-xs font-small text-text-color opacity-50">
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={descriptionValues.department}
          onChange={handleChange}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        />
      </div>

      <div className="pb-2">
        <label htmlFor="screenSize" className="block mb-1 text-xs font-small text-text-color opacity-50">
          Screen Size
        </label>
        <input
          type="text"
          id="screenSize"
          name="screenSize"
          value={descriptionValues.screenSize}
          onChange={handleChange}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        />
      </div>

      <div className="pb-2">
        <label htmlFor="date" className="block mb-1 text-xs font-small text-text-color opacity-50">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={descriptionValues.date.split("/").reverse().join("-")}
          onChange={handleChange}
          className="border bg-card-color border-border-color text-card-text-color text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        />
      </div>
    </form>
  );
};

export default DescriptionConfigComponent;
