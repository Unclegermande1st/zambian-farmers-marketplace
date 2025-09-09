// frontend/src/utils/uploadImage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // You'll create this next

// Initialize Firebase app only once
export const storage = getStorage(app);

// Upload image and return download URL
export const uploadImage = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const fileRef = ref(storage, `product-images/${fileName}`);

  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};