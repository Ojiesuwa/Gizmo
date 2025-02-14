export const gradeQuiz = (quizLectureData) => {
  const totalQuestions = quizLectureData.quiz.length;
  const numberOfCorrectAnswer = quizLectureData.quiz.filter(
    (data) => data.answer === data.response
  ).length;

  const percentScore = Math.round(
    (numberOfCorrectAnswer * 100) / totalQuestions
  );

  quizLectureData.score = percentScore;
  quizLectureData.graded = true;

  return { ...quizLectureData };
};
