import { increment } from "firebase/firestore";
import {
  addDocument,
  createDocument,
  getDocumentById,
  liveListen,
  updateDocumentById,
} from "../firebase/firebaseTools";

export const createNewUser = ({
  firstname,
  username,
  lastname,
  email,
  school,
  uid,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await createDocument("Accounts", uid, {
        firstname,
        lastname,
        email,
        school,
        username,
        createdAt: new Date(),
        xp: 0,
        subscription: "inactive",
        wallet: 300,
        theme: "dark",
      });

      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchUserbyId = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getDocumentById("Accounts", uid);
      resolve(data);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const accountListener = (uid, onChange) => {
  liveListen("Accounts", uid, onChange);
};

export const increaseAccountXp = (uid, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Accounts", uid, { xp: increment(amount) });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const debitAccountWallet = (uid, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Accounts", uid, {
        wallet: increment(-1 * amount),
      });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fundAccountWallet = (uid, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Accounts", uid, {
        wallet: increment(amount),
      });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const setAccountTheme = (uid, theme) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Accounts", uid, { theme });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateAccount = (uid, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Accounts", uid, payload);
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
