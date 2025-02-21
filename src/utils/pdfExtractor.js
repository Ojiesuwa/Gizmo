import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

export const getPdfPages = (pdfBlob) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert the Blob to an ArrayBuffer

      const arrayBuffer = await pdfBlob.arrayBuffer();
      // Load the PDF document using the ArrayBuffer
      const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      resolve(pdfDocument.numPages);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// Function to extract text from a PDF Blob
export async function extractText(pdfBlob, start, stop) {
  try {
    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    // Load the PDF document using the ArrayBuffer
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;

    let fullText = "";

    start = isNaN(start) ? 0 : parseInt(start);
    stop = isNaN(stop) ? start + 1 : parseInt(stop);

    start = start < 1 ? 1 : start;
    stop = stop < start ? pdfDocument.numPages : stop;

    // Loop through all pages to extract text
    for (let pageNumber = start || 1; pageNumber <= stop; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);

      // Extract text content
      const textContent = await page.getTextContent();

      // Combine text items into a single string
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n"; // Add page text to the full text
    }
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error; // Re-throw the error for external handling
  }
}

// Function to split text into chunks of a specified size
export function splitTextIntoChunks(text, chunkSize = 500) {
  if (typeof chunkSize !== "number" || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive number");
  }

  const words = text.split(/\s+/); // Split text into words by whitespace
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" "); // Create a chunk of specified size
    chunks.push(chunk); // Add the chunk to the array
  }

  return chunks; // Return the array of chunks
}
