import { BASE_URL } from '../../constants';

const base64ToFile = (base64: string, fileName: string) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};


const uploadImage = async (file) => {
  // Create FormData object to send file
  const fileinnew = base64ToFile(file, "uploaded-image.png");

  console.log("fileee",file);
  console.log("fileinnew",fileinnew);

  const formData = new FormData();
  formData.append("image", fileinnew); // 'image' must match the key in multer's `upload.single("image")`

  const response = await fetch(`${BASE_URL}/canvases/uploadImage`, {
    method: 'POST',
    body: formData, // Send FormData directly
  });

  if (!response.ok) {
    console.error('Failed to upload image:', response.statusText);
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  console.log('Uploaded image data:', data);
  return data; // Returns details like `imageId` and `filePath`
};

export default uploadImage;
