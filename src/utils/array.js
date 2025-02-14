export const getRandomIndexArray = (n) => {
  // Create an array of numbers from 0 to n-1
  const arr = Array.from({ length: n }, (_, i) => i);

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }

  return arr;
};

export const randomizeArray = (array = []) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export const arraysMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false; // Different lengths → Not equal

  return arr1.every(
    (val, index) =>
      val.trim().toLowerCase() === arr2[index].trim().toLowerCase()
  );
};