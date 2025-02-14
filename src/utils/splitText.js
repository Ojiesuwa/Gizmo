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

  return cluster;
};

