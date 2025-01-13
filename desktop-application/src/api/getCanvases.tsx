
const BaseUrl = 'https://signcast-assignment-fullstack-production-32ab.up.railway.app';

const getCanvases = async () => {
  const response = await fetch(`${BaseUrl}/canvases`);
  const data = await response.json();
console.log("dataaa canvass",data);
  return data;
};

export default getCanvases;

