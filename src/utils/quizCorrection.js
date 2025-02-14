function pushAndShuffle(array, string) {
  // Add the string to the array
  array.push(string);

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}
export const quizCorrection = (quiz) => {
  return quiz.map((data) => {
    return { ...data, options: pushAndShuffle(data, data.answer) };
  });
};
