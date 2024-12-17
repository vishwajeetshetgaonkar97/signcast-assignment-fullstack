import { BASE_URL } from '../../constants';

const addCanvas = async (postData) => {


  console.log('Hardcoded payload:', JSON.stringify(postData));

  const response = await fetch(`${BASE_URL}/canvases/addCanvas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Ensure JSON content type
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

export default addCanvas;
