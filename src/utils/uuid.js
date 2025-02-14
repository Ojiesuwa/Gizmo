export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (char) {
      const random = (Math.random() * 16) | 0; // Random integer from 0 to 15
      const value = char === "x" ? random : (random & 0x3) | 0x8; // Use 0x3 and 0x8 for "y"
      return value.toString(16); // Convert to hexadecimal
    }
  );
};
