import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.entry";

/**
 * Extracts text from a PDF Blob.
 * @param {Blob} pdfBlob - The PDF file as a Blob.
 * @returns {Promise<string>} - The extracted text from the PDF.
 */
export const extractTextFromBlob = async (pdfBlob) => {
  try {
    // Convert Blob to ArrayBuffer and load the PDF
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Extract text from all pages
    const extractedText = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1);
        const textContent = await page.getTextContent();
        return textContent.items.map((item) => item.str).join(" ");
      })
    );

    return extractedText.join("\n");
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};
