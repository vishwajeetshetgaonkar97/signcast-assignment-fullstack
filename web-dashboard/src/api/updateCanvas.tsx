import { BASE_URL } from '../../constants';

const updateCanvas = async (postData) => {

  console.log("payload", postData);
  console.log("canvasId", postData.canvasId);

  const response = await fetch(`${BASE_URL}/canvases/updateCanvas/${postData.canvasId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(postData),
  });

  console.log('Response:', response);

  if (!response.ok) {
    console.error('Failed to add canvas:', response.statusText);
    throw new Error('Failed to add canvas');
  }

  const { data = {} } = await response.json();
  console.log('Data after addition:', data);
  return data;
};

export default updateCanvas;
