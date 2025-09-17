// frontend/src/utils/uploadImage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // ✅ Import storage directly

export const uploadImage = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `product-images/${fileName}`);

    console.log("Uploading:", fileName);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Uploaded successfully:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error.code, error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};