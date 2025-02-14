import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  addDocument,
  createDocument,
  getDocumentById,
  liveListen,
  parseCollectionData,
  updateDocumentById,
} from "../firebase/firebaseTools";
import { db } from "../firebase/config";

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

export const fetchUserRanking = (uid, school, accountDetail) => {
  return new Promise(async (resolve, reject) => {
    try {
      //console.log(school);

      const leaderboardRef = collection(db, "Accounts");
      const q = query(
        leaderboardRef,
        where("school", "==", school),
        orderBy("xp", "desc"),
        limit(30)
      );
      const snapshot = await getDocs(q);
      const data = parseCollectionData(snapshot);

      const isAccountInTop30 = data.find((value) => value.docId === uid);

      let ranking = data.map((account, index) => ({
        username: account.username,
        rank: index + 1,
        xp: account.xp,
        level:
          account?.xp < 2000
            ? "Rookie"
            : account?.xp < 7000
            ? "Scholar"
            : account?.xp < 20000
            ? "Pro"
            : "Legendary",
      }));

      //console.log("did here");

      if (!isAccountInTop30) {
        const newQ = query(
          leaderboardRef,
          where("school", "==", school),
          where("xp", ">=", accountDetail.xp),
          orderBy("xp", "desc")
        );
        const snapshot2 = await getDocs(newQ);
        const accountRank = snapshot2.size;
        ranking.push({
          username: accountDetail.username,
          rank: accountRank,
          xp: accountDetail.xp,
          level:
            accountDetail?.xp < 2000
              ? "Rookie"
              : accountDetail?.xp < 7000
              ? "Scholar"
              : accountDetail?.xp < 20000
              ? "Pro"
              : "Legendary",
        });
      }

      resolve(ranking);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
