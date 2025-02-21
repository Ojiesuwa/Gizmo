const calculateClusterLength = (textLength) =>
  (25 / 6000) * textLength + 35 / 6;

export const splitText = (text, numberOfQuestions) => {
  const clusterLength = Math.round(text.split(" ").length / numberOfQuestions);
  console.log(clusterLength);

  const splittedText = text.split("");

  let cluster = [];
  let wordAccumulator = "";

  for (let wordCount = 0; wordCount < text.split(" ").length; wordCount++) {
    wordAccumulator += " " + text.split(" ")[wordCount];

    if (wordAccumulator.split(" ").length >= clusterLength) {
      cluster.push(wordAccumulator);
      wordAccumulator = "";
    }
  }

  cluster = cluster.map((value) => trimSentence(value, 550));

  return cluster;
};

export const trimSentence = (sentence, num = 500) => {
  let words = sentence.split(/\s+/); // Split using regex to handle multiple spaces

  if (words.length <= num) {
    return sentence;
  }

  while (words.length > num) {
    words.shift(); // Remove from the beginning
    if (words.length > num) {
      words.pop(); // Remove from the end
    }
  }

  return words.join(" ");
};
