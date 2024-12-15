import { BASE_URL } from '../../constants';

const addCanvas = async () => {
  const test = {
    name: "Canvas 4 from dash",
    category: "Art",
    data: [{
      "width": 800,
      "height": 600,
      "elements": ["circle", "rectangle"]
    },
    {
      "width": 8000,
      "height": 600,
      "elements": ["circle", "rectangle"]
    }]
  }

  console.log('Hardcoded payload:', JSON.stringify(test));

  const response = await fetch(`${BASE_URL}/canvases/addCanvas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Ensure JSON content type
    },
    body: JSON.stringify(test),
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
