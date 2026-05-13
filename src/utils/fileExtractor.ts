import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractFileText = async (file: File): Promise<string> => {
    const type = file.type;

    // DOCX
    if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        return result.value || "";
    }

    // PDF (text-based)
    if (type === "application/pdf") {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }

        if (text.trim().length > 30) return text;

        // fallback OCR (image-based PDF)
        return await extractOCR(pdf);
    }

    return "";
};

const extractOCR = async (pdf: any) => {
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: ctx!,
            canvas,
            viewport,
        }).promise;

        const img = canvas.toDataURL("image/png");

        const result = await Tesseract.recognize(img, "eng");

        text += result.data.text + "\n";
    }

    return text;
};