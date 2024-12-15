import { BASE_URL } from '../../constants';

const addCanvas = async (postBody : any) => {
  console.log('log payload', postBody);
  console.log('log payload', JSON.stringify(postBody));
  const response = await fetch(`${BASE_URL}/canvases/addCanvas`, {
    method: 'POST',
    body: JSON.stringify(postBody),
  });
  console.log('log resss', response);
  const { data = {} } = await response.json();
console.log('log data after addition', data);
  return data;
};

export default addCanvas;
