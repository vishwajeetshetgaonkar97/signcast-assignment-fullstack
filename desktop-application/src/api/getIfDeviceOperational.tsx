
const BaseUrl = 'https://signcast-assignment-fullstack-production-32ab.up.railway.app';

const getIfDeviceOperational = async () => {
  const response = await fetch(`${BaseUrl}/devices/device/6782dc6b78a3d0fd12176d96`);
  const data = await response.json();
console.log("dataaa canvass",data);
  return data;
};

export default getIfDeviceOperational;

