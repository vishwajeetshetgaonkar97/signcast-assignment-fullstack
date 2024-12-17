import { BASE_URL } from '../../constants';

const updateDeviceStatus = async (postData) => {


  console.log('Hardcoded payload:', JSON.stringify(postData));

  // have hardcoded device ID for now 
  const response = await fetch(`${BASE_URL}/devices/updateDevice/675f2e50e23a9c8e760a8839`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(postData),
  });

  console.log('Response:', response);

  if (!response.ok) {
    console.error('Failed to change status:', response.statusText);
    throw new Error('Failed to change status');
  }

  const { data = {} } = await response.json();
  console.log('Data after addition:', data);
  return data;
};

export default updateDeviceStatus;
