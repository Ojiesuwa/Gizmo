import { newlineChars } from "pdf-lib";
import promptChatGpt from "../components/promptChatGpt";
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
  return new Promise(async (resolve, reject) => {
    try {
      const prompt = `
      An piece of text will  be supplied to you below. Using this information generate me an array containing three types of questions as an object.

      PS: The number of missing gaps in the fig type could range between 1 - 3, Use the same topic for all the questions. The mcq wrong options and correct answer should be one word or two words only 

      Your response should take the following format:
      [
        {
          "type": "mcq",

          "question":"A short multiple choice question of about 20 words",

          "wrongOptions": ["Wrong Answer 1", "Wrong Answer 2", "Wrong Answer 3", "Wrong Answer 4"],

          "correctAnswer": "Correct Answer",

          "topic": "Topic that best encapsulate the supplied text",

          "explanation": "Write a comprehensive but brief explanation of about 50 - 100 words to explain the answer"
        },
        {
          "type": "fig",

          "question":
            "Write a short fill in the gap question of about 15 - 30 words, an example is given as thus. The [0] of an object determines the amount of [1] needed to change its motion, as described by Newton's First Law.",

          "correctAnswer": "Return an array corresponding to the index in the question, an example to the question above is:  ["inertia", "force"] ",

          "topic": "Use the same topic as the mcq topic",

          "explanation":
            "Write a comprehensive but brief explanation of about 50 - 100 words to explain the answer",
        },

        {
          "type": "theory",

          "question":
            "Write an expressive question that is somewhere between 20 - 30 words",

          "correctAnswer":
            "Write the answer to the theory question here",
          "topic": "Use the general topic for this text",

          "explanation":
            "Write a comprehensive but brief explanation of about 50 - 100 words to explain the answer",
        },
      ]

      Supplied Text: ${chunk}
      `;

      let attempt = 0;
      let retries = 5;

      while (attempt < retries) {
        const res = await promptChatGpt(
          "Generate a JSON array , Do not format in markdown. Cross check for '}' and '{'",
          prompt
        );
        console.log("Chunk", chunk);
        console.log("Prompt", prompt);
        console.log("attempt", attempt);

        try {
          const data = JSON.parse(res);
          console.log("data", data);
          resolve(data);
          break;
        } catch (error) {
          console.log(res);

          console.log("Fatal error");
          console.warn(error.message);
        }
        attempt++;
      }

      throw new Error("Can't generate");
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

      console.log(generatedQuiz);

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

export const generateQuizFromDb = ({ quizDb, project }) => {
  try {
    // flatten Array
    const flattenedQuizDB = quizDb.flat(Infinity);
    // Create array with random arrangement of numbers in index
    const randomizedArray = getRandomIndexArray(
      parseInt(project.numberOfQuestions)
    );

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

    return factoredQuiz.flat(Infinity);
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
        const userPrompt = `
        Question: "${question.question}",
        Correct Answer: "${question.correctAnswer}"

        Student answer: "${question.user}".

        compare the student answer to the correct answer and deduce the percentage similarity in integer only
        return an object in this form {percentageSimilarity: 40}
        `;

        console.log(userPrompt);

        const res = await promptChatGpt(
          "Do not respond in markdown format. Respond with JSON",
          userPrompt
        );
        console.log(res);

        resolve(parseInt(JSON.parse(res).percentageSimilarity) > 50);
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
      console.log(question?.topic);
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

export const generateAnswerToQuizQuestion = (
  question,
  explanation,
  firstname
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prompt = `
      An explanation was supplied to a student named ${firstname}. ${firstname} asked the following question "${question}". Generate an answer to ${firstname} question. If the answer is within the explantion, respond based on the explanation, else, respond based on general knowledge. Generate a response between 100 - 300 words based on neccessity. Make sure the response is personalized to ${firstname}. And try to be as clear, direct and brief as possible

      The explanation is given below: "${explanation}"
      `;
      console.log(prompt);

      const res = await promptChatGpt(
        "Do not respond in Markdown. You are a female teacher called Olivia. Be a nice friendly and warm teacher answering a question. Don't include a conclusion stating your name",
        prompt
      );

      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const formatQuizTopic = ({ quizDb }) => {
  return new Promise(async (resolve, reject) => {
    try {
      quizDb = quizDb.flat(Infinity);
      let allTopics = [...new Set(quizDb.map((data) => data.topic))];

      const prompt = `
      Given an array of topics. return an object containing the shrinked topics by combining similar topics into one topic, where only highly similar phrases (not just loosely related ones) are grouped under a clear, well-defined category.some topics could have grouped variations, while others remain standalone with an empty array. Here is an example of the input and your expected output:

      Input: 
      [
        "Effects of Climate Change on Agriculture",
        "Impact of Climate Change on Crop Production",
        "Influence of Climate Change on Farming",
        "Climate Change and Food Security",
        "Climate Change and Human Health",
        "Health Implications of Climate Change",
        "Climate Change and Respiratory Diseases",
        "Climate Change and Global Economy",
        "Economic Consequences of Climate Change",
        "Climate Change and Job Market",
        "Climate Change and Marine Life",
        "Urbanization and Climate Change"
      ]

    Output:
    {
      "Climate Change and Agriculture": [
        "Effects of Climate Change on Agriculture",
        "Impact of Climate Change on Crop Production",
        "Influence of Climate Change on Farming"
      ],
      "Climate Change and Food Security": [],
      "Climate Change and Health": [
        "Climate Change and Human Health",
        "Health Implications of Climate Change",
        "Climate Change and Respiratory Diseases"
      ],
      "Climate Change and Economy": [
        "Climate Change and Global Economy",
        "Economic Consequences of Climate Change",
        "Climate Change and Job Market"
      ],
      "Climate Change and Marine Life": [],
      "Urbanization and Climate Change": []
    }

    Generate a shrinked object from the following topics:
    ${JSON.stringify(allTopics)}
      `;

      console.log(prompt);

      const res = await promptChatGpt(
        "Generate a JSON Object. Do not use mark down mode",
        prompt
      );

      const clusteredTopics = JSON.parse(res);
      const deduceGeneralTopic = (exTopic) => {
        let clusterTopic = Object.keys(clusteredTopics).find((generalTopic) =>
          clusteredTopics[generalTopic].some(
            (exTopicInCluster) => exTopicInCluster === exTopic
          )
        );

        clusterTopic = clusterTopic === undefined ? exTopic : clusterTopic;

        return clusterTopic;
      };

      const newQuizDb = quizDb.map((question) => ({
        ...question,
        topic: deduceGeneralTopic(question.topic),
      }));

      console.log(newQuizDb);
      resolve(newQuizDb);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
