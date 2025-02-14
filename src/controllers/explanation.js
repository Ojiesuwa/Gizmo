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
    // return { topic, quizExplanation: explanation };
    if (topic === "Mass and forces")
      return {
        topic,
        quizExplanation:
          "Newton's Second Law states that force is the product of mass and acceleration (F = ma). Here, the mass is 10 kg, and the acceleration is 3 m/s². Multiplying them gives 30 N, which is the force required to overcome inertia and accelerate the object as specified.",
      };
    if (topic === "Newton's law") {
      return {
        topic,
        quizExplanation:
          "Inertia refers to the resistance of an object to changes in its state of motion or rest. Newton's First Law explains that without an external force, an object will not change its motion, highlighting the role of inertia in maintaining its current state.",
      };
    }
    if (topic === "Acceleration") {
      return {
        topic,
        quizExplanation:
          "Newton's Second Law establishes the relationship between force, mass, and acceleration. It shows that larger forces produce greater accelerations for a given mass and allows scientists and engineers to predict and analyze motion in various practical situations, from vehicle dynamics to space exploration.",
      };
    }
  });

  return explantionPerTopic;
};

const generateAIExplantionPerTopic = (topicBasedExplantion) => {
  return new Promise((resolve, reject) => {
    try {
      const { quizExplanation } = topicBasedExplantion;
      delete topicBasedExplantion.quizExplanation;
      resolve({
        ...topicBasedExplantion,
        explanation: quizExplanation,
        points: [
          "Did you know? Honey never spoils because it has natural preservatives like low moisture and high acidity. Archaeologists discovered 3,000-year-old honey in Egyptian tombs that was still perfectly edible.",
          "Did you know? Octopuses have three hearts—two pump blood to the gills, while the third circulates it to the body. Their blue blood contains hemocyanin, which helps them survive in low-oxygen environments.",
          "Did you know? Bananas are classified as berries because they develop from a single ovary and contain seeds inside. Meanwhile, strawberries don’t meet the botanical criteria, so they aren’t considered true berries.",
          "Did you know? The Eiffel Tower expands in the summer due to heat. Its iron structure can grow up to 15 cm (6 inches) taller when temperatures rise, then shrink in winter.",
          "Did you know? The observable universe contains more stars than grains of sand on Earth’s beaches. Scientists estimate that there are about one septillion (1,000,000,000,000,000,000,000,000) stars in the universe.",
        ],
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

      // Get explanation on topic basis: Scan through the quiz db and deduce the topics along side wuiz explanations
      let deducedExplantion = deduceExplanationsPerTopic(quizDb, topics);

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
