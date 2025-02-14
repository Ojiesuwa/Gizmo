export const deduceTopics = (quizDb) => {
  const flattenedQuizDb = quizDb.flat(Infinity);
  const extractedTopics = flattenedQuizDb.map((quiz) => quiz.topic);
  const uniqueTopics = [...new Set(extractedTopics)];
  return uniqueTopics;
};
