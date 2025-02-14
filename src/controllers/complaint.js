import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  addDocument,
  getCollectionByField,
  getCollectionByName,
  parseCollectionData,
  updateDocumentById,
} from "../firebase/firebaseTools";

export const makeComplaint = (complaint, uid, firstname, lastname, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        uid,
        complaint,
        response: "",
        createdAt: new Date(),
        firstname,
        lastname,
        email,
      };
      await addDocument("Complaint", payload);
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchUserComplaint = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getCollectionByField("Complaint", "uid", uid);

      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchAllComplaints = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const colRef = collection(db, "Complaint");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(colRef);
      resolve(parseCollectionData(snapshot));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const respondToComplaint = (response, complaintId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Complaint", complaintId, { response });
      resolve()
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
