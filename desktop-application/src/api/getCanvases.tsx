import fetch from 'electron-fetch'; // Or use require if needed

const getCanvases = async () => {
  try {
    // Make an API request to fetch canvases data
    const response = await fetch('http://localhost:3001/canvases');

    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching canvases: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    console.log("Data from canvases:", data);

    // Return the fetched data
    return data;
  } catch (error) {
    // Handle network or other errors
    console.error("Failed to fetch canvases:", error);
  }
};

export default getCanvases;
