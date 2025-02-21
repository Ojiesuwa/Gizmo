import promptChatGpt from "../components/promptChatGpt";
import { addDocument, getDocumentById } from "../firebase/firebaseTools";
import { extractText } from "../utils/pdfExtractor";
import { deduceTopics } from "../utils/quizDb";

const deduceExplanationsPerTopic = (quizDb, topics) => {
  const flattenedQuizDb = quizDb.flat(Infinity);

  let explantionPerTopic = topics.map((topic) => {
    const explanationBasedQuizArray = flattenedQuizDb.filter(
      (quiz) => quiz.topic === topic
    );

    const explanationArray = explanationBasedQuizArray.map(
      (quiz) => quiz.explanation
    );

    const explanation = explanationArray.join("\n\nNext Concept\n\n");
    return { topic, quizExplanation: explanation };
  });
  // console.log$&

  return explantionPerTopic;
};

const generateAIExplantionPerTopic = (topicBasedExplantion) => {
  return new Promise(async (resolve, reject) => {
    const { quizExplanation } = topicBasedExplantion;
    try {
      const prompt = `
       A lecturer named Olivia will be teaching on a topic titled ${topicBasedExplantion.topic}. Some concepts will be supplied to you. You are to generate a lecture that properly organizes and explains the concept in such a way that is easily understood a student. Just write in paragraphs. You can highlight some points and number lists. MAKE SURE THAT MOST WORDS SUPPLIED IN THE CONCEPT ARE REPEATED IN YOUR EXPLANATION AS STUDENTS WILL BE QUIZED WORD FOR WORD. The concepts are supplied below:
       
       ${quizExplanation}
       `;
      const res = await promptChatGpt(
        "Do not respond in Markdown. Sound like a nice female lecturer",
        prompt
      );

      // console.log$&

      delete topicBasedExplantion.quizExplanation;

      resolve({
        ...topicBasedExplantion,
        explanation: res,
        points: [],
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const generateExplanation = ({ quizDb }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Deduce topics from db
      const topics = deduceTopics(quizDb);

      // console.log$&

      // Get explanation on topic basis: Scan through the quiz db and deduce the topics along side wuiz explanations
      let deducedExplantion = deduceExplanationsPerTopic(quizDb, topics);

      // console.log$&

      // Generate AI data for bullet point and prose
      const AIExplantionPromise = deducedExplantion.map(
        (topicBasedExplantion) =>
          generateAIExplantionPerTopic(topicBasedExplantion)
      );

      const AIExplantion = await Promise.all(AIExplantionPromise);
      resolve(AIExplantion);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const uploadExplanation = ({ lecture }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await addDocument("Lecture", {
        lecture: JSON.stringify(lecture),
        createdAt: new Date(),
      });
      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchExplanation = (explanationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const explanation = await getDocumentById("Lecture", explanationId);

      resolve(JSON.parse(explanation.lecture));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
