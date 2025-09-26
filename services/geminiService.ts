import { GoogleGenAI, Type } from "@google/genai";
import { StudentAnswer } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        studentName: {
            type: Type.STRING,
            description: "The full name of the student as written on the test paper. If no name is found, return 'Unknown Student'."
        },
        answers: {
            type: Type.ARRAY,
            description: "An array of the student's answers for questions 1 through 30.",
            items: {
                type: Type.OBJECT,
                properties: {
                    questionNumber: {
                        type: Type.INTEGER,
                        description: "The question number, from 1 to 30."
                    },
                    markedAnswer: {
                        type: Type.STRING,
                        description: "The letter (A, B, C, or D) that is marked by the student. Use 'N/A' if unanswered or ambiguous."
                    }
                },
                required: ["questionNumber", "markedAnswer"]
            },
        }
    },
    required: ["studentName", "answers"]
};

export const gradeTestFromImage = async (base64Image: string, mimeType: string): Promise<{ studentName: string; answers: StudentAnswer[] }> => {
    
    const prompt = `You are a highly precise automated test grading assistant. Your task is to analyze the provided image of a multiple-choice answer sheet with extreme accuracy. The sheet contains 30 questions, numbered 1 to 30, each with options A, B, C, and D.

Your instructions are as follows:
1.  **Identify the Student's Name:** First, locate and extract the student's full name, which is typically written at the top of the paper. If you cannot find a name, use the string 'Unknown Student'.
2.  **Examine each question row individually.** For each question number, locate the corresponding set of A, B, C, D options.
3.  **Identify the student's mark.** The student will have marked their answer by filling in a circle or making a distinct black dot. Carefully identify which option is marked.
4.  **Handle ambiguity with care.**
    *   If a question has **no marks**, the answer is 'N/A'.
    *   If a question has **multiple options marked**, the answer is 'N/A'.
    *   If a mark is faint, smudged, or not clearly inside one of the option circles, prioritize the most confident reading. If it's impossible to determine, the answer is 'N/A'.
5.  **Output Format:** You must return a single JSON object. This object must contain the \`studentName\` and an \`answers\` array with exactly 30 objects, one for each question from 1 to 30. Each object must strictly adhere to the provided schema. The \`markedAnswer\` must be one of 'A', 'B', 'C', 'D', or 'N/A'.

Accuracy is critical. Double-check your analysis of the image before finalizing the JSON output. Do not guess. If an answer is unclear, it is better to mark it as 'N/A'.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedResponse || typeof parsedResponse.studentName !== 'string' || !Array.isArray(parsedResponse.answers)) {
            throw new Error("Invalid response format from AI. Expected an object with studentName and answers array.");
        }

        return parsedResponse as { studentName: string; answers: StudentAnswer[] };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to process the test paper with the AI model.");
    }
};