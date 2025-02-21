import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  refEqual,
  where,
} from "firebase/firestore";
import {
  addDocument,
  getCollectionByField,
  getDocumentById,
  parseCollectionData,
  updateDocumentById,
} from "../firebase/firebaseTools";
import { extractText } from "../utils/pdfExtractor";
import { splitText } from "../utils/splitText";
import { generateExplanation, uploadExplanation } from "./explanation";
import {
  formatQuizTopic,
  generateQuizDb,
  generateQuizFromDb,
  uploadQuiz,
  uploadQuizDb,
} from "./quiz";
import { db } from "../firebase/config";
import { error } from "pdf-lib";

export const createNewProject = (
  projectParameters,
  pdfBlob,
  uid,
  cb = () => {}
) => {
  return new Promise(async (resolve, reject) => {
    try {
      cb("Extracting text from pdf");
      // Extract the text
      const pdfText = await extractText(
        pdfBlob,
        projectParameters?.start,
        projectParameters?.end
      );

      if (pdfText.length < 50) {
        throw new Error("small-text");
      }

      // Split text
      const cluster = splitText(pdfText, projectParameters?.numberOfQuestions);

      cb("Generating a quiz database");
      // Create Quiz Database
      const quizDatabase = await generateQuizDb({ cluster });

      const formattedQuizDatabase = await formatQuizTopic({
        quizDb: quizDatabase,
      });

      let lectureId = null;

      if (projectParameters.explanation) {
        cb("Generating project explanation");
        // Create Lecture
        const lecture = await generateExplanation({
          quizDb: formattedQuizDatabase,
        });

        // Upload Lecture to firebase and deduce id
        lectureId = await uploadExplanation({ lecture });
      }

      //// console.log$&

      cb("Uploading project to cloud");
      // Upload QuizDb to firebase and deduct id
      const quizDbId = await uploadQuizDb({ quizDb: formattedQuizDatabase });

      //// console.log$&

      // Create Quiz
      const quiz = generateQuizFromDb({
        quizDb: formattedQuizDatabase,
        project: projectParameters,
      });

      // Upload and extract quiz id
      const quizId = await uploadQuiz({ quiz });

      // Create Payload
      const payload = {
        lectureId: lectureId || "",
        quizDbId,
        uid,
        createdAt: new Date(),
        progress: projectParameters.explanation ? 0 : 200,
        history: [quizId],
        ...projectParameters,
      };

      //// console.log$&

      // Upload payload and deduce id
      const projectId = await addDocument("Project", payload);

      // Resolve payload
      resolve(projectId);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const validateProjectName = (title, uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //// console.log$&

      const colRef = collection(db, "Project");
      const q = query(
        colRef,
        where("title", "==", title),
        where("uid", "==", uid)
      ); // Sort by createdAt in descending order
      const snapshot = await getDocs(q);
      const data = parseCollectionData(snapshot);

      resolve(data.length === 0 ? true : false);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchAndVerifyProject = (projectId, uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const project = await getDocumentById("Project", projectId);
      if (project.uid !== uid) throw new Error("Not user project");
      else {
        resolve(project);
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchAllProjectWithId = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getCollectionByField("Project", "uid", uid);
      //// console.log$&

      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const setProjectLevel = (projectId, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Project", projectId, { progress: value });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const liveListenToUserProjects = (uid, onchange) => {
  try {
    const collectionRef = collection(db, "Project");
    const q = query(
      collectionRef,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      //// console.log$&

      onchange(updatedData);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  } catch (error) {
    console.error(error);
  }
};
