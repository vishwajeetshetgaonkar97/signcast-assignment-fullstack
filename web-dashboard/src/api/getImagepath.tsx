import { BASE_URL } from '../../constants';

const getImagepath = async (filename) => {
  const response = await fetch(`${BASE_URL}/images/${filename}`);

  if (!response.ok) {
    console.error('Failed to fetch image:', response.statusText);
    throw new Error('Failed to fetch image');
  }

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob); // Creates a temporary URL for the image

  console.log('Fetched image URL:', imageUrl);
  return imageUrl; // Returns a URL that can be used to display the image
};

export default getImagepath;
