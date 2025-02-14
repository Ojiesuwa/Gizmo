import { arrayUnion } from "firebase/firestore";
import { getDocumentById, updateDocumentById } from "../firebase/firebaseTools";

export const fetchAllSchools = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getDocumentById("Site", "schools");

      resolve(data);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const addNewSchool = (schoolName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Site", "schools", {
        schools: arrayUnion(schoolName),
      });
      resolve(true);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
