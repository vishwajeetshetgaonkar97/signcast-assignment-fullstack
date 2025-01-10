import { BASE_URL } from '../../constants.tsx';

const getCanvases = async () => {
  const response = await fetch(`${BASE_URL}/canvases`);
  const data = await response.json();
console.log("dataaa canvass",data);
  return data;
};

export default getCanvases;
