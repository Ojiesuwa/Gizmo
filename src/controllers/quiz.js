import {
  addDocument,
  getDocumentById,
  updateDocumentById,
} from "../firebase/firebaseTools";
import {
  arraysMatch,
  getRandomIndexArray,
  randomizeArray,
} from "../utils/array";

const generateQuizPerChunk = (chunk) => {
  return new Promise(async(resolve, reject) => {
    try {
      resolve([
        {
          type: "mcq",
          question:
            "An object with a mass of 10 kg is at rest. What force is required to accelerate it at 3 m/s²?",
          wrongOptions: ["20 N", "15 N", "70 N", "100 N"],
          correctAnswer: "30 N",
          topic: "Mass and forces",
          explanation:
            "Newton's Second Law states that force is the product of mass and acceleration (F = ma). Here, the mass is 10 kg, and the acceleration is 3 m/s². Multiplying them gives 30 N, which is the force required to overcome inertia and accelerate the object as specified.",
        },
        {
          type: "fig",
          question:
            "The [0] of an object determines the amount of force needed to change its motion, as described by Newton's First Law.",
          correctAnswer: ["inertia"],
          topic: "Newton's law",
          explanation:
            "Inertia refers to the resistance of an object to changes in its state of motion or rest. Newton's First Law explains that without an external force, an object will not change its motion, highlighting the role of inertia in maintaining its current state.",
        },
        {
          type: "theory",
          question:
            "Explain Newton's Second Law of Motion and its importance in understanding force and acceleration.",
          correctAnswer:
            "Newton's Second Law of Motion states that the force acting on an object is equal to the mass of the object multiplied by its acceleration (F = ma). It explains how forces cause changes in motion and is essential for analyzing dynamic systems.",
          topic: "Acceleration",
          explanation:
            "Newton's Second Law establishes the relationship between force, mass, and acceleration. It shows that larger forces produce greater accelerations for a given mass and allows scientists and engineers to predict and analyze motion in various practical situations, from vehicle dynamics to space exploration.",
        },
      ]);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const generateQuizDb = ({ cluster }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const generatedQuizPromise = cluster.map((chunk) =>
        generateQuizPerChunk(chunk)
      );

      const generatedQuiz = await Promise.all(generatedQuizPromise);

      resolve(generatedQuiz);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const uploadQuizDb = ({ quizDb }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await addDocument("QuizDb", {
        quizDb: JSON.stringify(quizDb),
        createdAt: new Date(),
      });
      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchQuizDb = (quizDbId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quizDb = await getDocumentById("QuizDb", quizDbId);

      resolve(JSON.parse(quizDb.quizDb));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const generateQuizFromDb = ({ quizDb }) => {
  try {
    // flatten Array
    const flattenedQuizDB = quizDb.flat(Infinity);
    // Create array with random arrangement of numbers in index
    const randomizedArray = getRandomIndexArray(quizDb.length);

    // map and attach question to array
    const quiz = randomizedArray.map((index) => ({
      ...flattenedQuizDB[index],
      user: null,
    }));

    const factoredQuiz = quiz.map((data) => {
      if (data.type === "mcq") {
        data.options = randomizeArray([
          ...data?.wrongOptions?.filter((_, index) => index < 3),
          data?.correctAnswer,
        ]);
      } else if (data.type === "fig") {
        data.user = [];
      }

      return data;
    });

    console.log(factoredQuiz);

    return factoredQuiz;
  } catch (error) {
    console.error(error);
  }
};

export const uploadQuiz = ({ quiz }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await addDocument("Quiz", {
        quiz: JSON.stringify(quiz),
        createdAt: new Date(),
      });
      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateQuiz = (gradedQuiz, quizId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateDocumentById("Quiz", quizId, {
        quiz: JSON.stringify(gradedQuiz),
      });
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const fetchQuiz = (quizId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quiz = await getDocumentById("Quiz", quizId);
      resolve(JSON.parse(quiz.quiz));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const markQuestion = (question) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (question.type === "mcq") {
        if (question.correctAnswer === question.user) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else if (question.type === "fig") {
        if (arraysMatch(question.user, question.correctAnswer)) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const gradeQuiz = (quiz) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quizScorePromise = quiz.map((question) => markQuestion(question));
      const quizScoreArray = await Promise.all(quizScorePromise);

      const newQuiz = quiz.map((question, index) => ({
        ...question,
        grade: quizScoreArray[index],
      }));

      resolve(newQuiz);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const deduceScorePerTopic = (quiz) => {
  let topicObject = {};

  quiz.forEach((question) => {
    if (!topicObject[question?.topic]) {
      topicObject[question?.topic] = { score: 0, count: 0 };
    }
    topicObject[question?.topic].score += question?.grade ? 1 : 0;
    topicObject[question?.topic].count += 1;
  });

  const scorePerTopic = Object.keys(topicObject).map((key) => {
    return {
      topic: key,
      ...topicObject[key],
    };
  });

  return scorePerTopic;
};
export const deduceScorePerQuizType = (quiz) => {
  let typeObject = {};

  quiz.forEach((question) => {
    if (!typeObject[question?.type]) {
      typeObject[question?.type] = { score: 0, count: 0 };
    }
    typeObject[question?.type].score += question?.grade ? 1 : 0;
    typeObject[question?.type].count += 1;
  });

  return typeObject;
};

export const generateAnswerToQuizQuestion = (question, explanation) => {
  return new Promise(async (resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(`This principle is explained by Newton’s First Law of Motion, also known as the law of inertia. It states that an object at rest remains at rest, and an object in motion continues in motion with the same speed and in the same direction unless acted upon by an external force. This happens because objects naturally resist changes to their state of motion due to their inertia.

        For example, if you slide a book across a table, it eventually stops due to friction—an external force. In space, however, where there is little to no friction, an object would keep moving indefinitely in the same direction unless another force, like gravity or collision, interferes.

        For example, if you slide a book across a table, it eventually stops due to friction—an external force. In space, however, where there is little to no friction, an object would keep moving indefinitely in the same direction unless another force, like gravity or collision, interferes.
        
        For example, if you slide a book across a table, it eventually stops due to friction—an external force. In space, however, where there is little to no friction, an object would keep moving indefinitely in the same direction unless another force, like gravity or collision, interferes.

        In summary, motion doesn’t stop on its own; it requires an external force, which is why astronauts experience weightlessness and why seatbelts are crucial in a moving car! `);
      }, 3000);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// [
//   {
//     type: "mcq",
//     question:
//       "A box is placed on a smooth horizontal surface. A force of 10 N is applied to the box, causing it to accelerate at 2 m/s². What is the mass of the box?",
//     wrongOptions: ["2kg", "10kg", "20kg"],
//     correctAnswer: "5kg",
//     topic: "Mass and forces",
//   },
//   {
//     type: "mcq",
//     question:
//       "An object of mass 4 kg is accelerated by a force of 16 N. What is the acceleration of the object?",
//     wrongOptions: ["2 m/s²", "8 m/s²", "10 m/s²"],
//     correctAnswer: "4 m/s²",
//     topic: "Mass and forces",
//   },
//   {
//     type: "mcq",
//     question:
//       "A force of 25 N is applied to a 5 kg object. What will be its acceleration?",
//     wrongOptions: ["3 m/s²", "8 m/s²", "2 m/s²"],
//     correctAnswer: "5 m/s²",
//     topic: "Mass and forces",
//   },
//   {
//     type: "mcq",
//     question:
//       "An object with a mass of 10 kg is at rest. What force is required to accelerate it at 3 m/s²?",
//     wrongOptions: ["20 N", "15 N", "30 N"],
//     correctAnswer: "30 N",
//     topic: "Mass and forces",
//   },
//   {
//     type: "fig",
//     question:
//       "The force acting on an object is directly proportional to its [0] and [1], according to Newton's Second Law of Motion.",
//     correctAnswer: ["mass", "acceleration"],
//     topic: "Newton's law",
//   },
//   {
//     type: "fig",
//     question:
//       "In the absence of external forces, an object will maintain its [0] and [1] as per Newton's First Law.",
//     correctAnswer: ["state of rest", "uniform motion"],
//     topic: "Newton's law",
//   },
//   {
//     type: "fig",
//     question:
//       "The [0] of an object determines the amount of force needed to change its motion, as described by Newton's First Law.",
//     correctAnswer: ["inertia"],
//     topic: "Newton's law",
//   },
//   {
//     type: "fig",
//     question:
//       "When a hammer strikes a nail, the nail exerts an equal and opposite [0] on the hammer. This describes Newton's [1] Law.",
//     correctAnswer: ["force", "Third"],
//     topic: "Newton's law",
//   },
//   {
//     type: "theory",
//     question:
//       "Define Newton's First Law of Motion. How does it apply to objects in motion or at rest?",
//     correctAnswer:
//       "Newton's First Law of Motion states that an object will remain at rest or continue to move in a straight line at constant velocity unless acted upon by an external force. This law is also known as the Law of Inertia.",
//     topic: "Newton's law",
//   },
//   {
//     type: "theory",
//     question:
//       "Explain Newton's Second Law of Motion and its importance in understanding force and acceleration.",
//     correctAnswer:
//       "Newton's Second Law of Motion states that the force acting on an object is equal to the mass of the object multiplied by its acceleration (F = ma). It explains how forces cause changes in motion and is essential for analyzing dynamic systems.",
//     topic: "Newton's law",
//   },
//   {
//     type: "theory",
//     question:
//       "What is inertia, and how is it related to Newton's First Law of Motion?",
//     correctAnswer:
//       "Inertia is the tendency of an object to resist changes in its state of motion or rest. It is directly related to Newton's First Law of Motion, which states that an object will remain at rest or in uniform motion unless acted upon by an external force.",
//     topic: "Newton's law",
//   },
//   {
//     type: "theory",
//     question:
//       "Describe how Newton's Third Law of Motion applies to the propulsion of a rocket.",
//     correctAnswer:
//       "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction. In rocket propulsion, the action is the expulsion of gases out of the engine, and the reaction is the thrust that propels the rocket forward.",
//     topic: "Newton's law",
//   },
// ];
