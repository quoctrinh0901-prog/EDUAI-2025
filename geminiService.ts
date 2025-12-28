
import { GoogleGenAI } from "@google/genai";

// Prefer Vite env, fall back to process.env for other environments
const API_KEY = (typeof (import.meta as any) !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY)
  || process.env.API_KEY || '';

let ai: any = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.warn('Failed to init GoogleGenAI client, falling back to mock responses.', e);
    ai = null;
  }
} else {
  console.warn('No Google GenAI API key found (VITE_API_KEY / process.env.API_KEY). Using safe fallbacks.');
}

const mockGenerate = async (text: string) => ({ text: text || 'Tạm thời không có API key — đây là phản hồi giả lập.' });

// Helper to sanitize math output for Markdown and fix literal newlines
// AND AGGRESSIVELY FORMAT QUIZ OPTIONS
const formatQuizOutput = (text: string) => {
  if (!text) return "";
  
  let cleaned = text.replace(/\\n/g, '\n');

  // Regex to find "A.", "B.", "C.", "D." that are NOT preceded by a newline and force a newline
  // Looks for whitespace followed by [A-D]. and replaces with \n\n[A-D].
  cleaned = cleaned.replace(/(\s|^)([A-D]\.)/gm, '\n\n$2');

  // Also try to catch cases like "A. ContentB. Content" (rare but possible)
  cleaned = cleaned.replace(/([^\n])([A-D]\.)/g, '$1\n\n$2');

  return cleaned;
};

const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/\\n/g, '\n');
}

const MATH_INSTRUCTION = "LƯU Ý QUAN TRỌNG VỀ TOÁN HỌC: Hãy sử dụng định dạng LaTeX chuẩn đặt trong dấu $ cho các công thức toán học (ví dụ: $x^2$, $\\frac{1}{2}$, $\\sqrt{x}$, $\\sum_{i=1}^n$). Đối với công thức riêng một dòng, dùng $$. KHÔNG dùng code block (```) để bao quanh công thức.";

const FORMAT_INSTRUCTION = "YÊU CẦU ĐỊNH DẠNG: Trình bày nội dung thoáng, dễ đọc. Sử dụng xuống dòng để tách các đoạn.";

export const generateHomeworkHelp = async (prompt: string, grade: string) => {
  try {
    const fullPrompt = `Bạn là một trợ lý giáo dục AI. Hãy tìm kiếm và tạo một bài tập về nhà cho học sinh ${grade} dựa trên yêu cầu sau: "${prompt}".
    Hãy tìm kiếm thông tin chính xác (mô phỏng dữ liệu từ Cốc Cốc Học Tập hoặc sách giáo khoa Việt Nam).
    Trả về định dạng văn bản rõ ràng, bao gồm câu hỏi và gợi ý (không đưa đáp án ngay).
    ${FORMAT_INSTRUCTION}
    ${MATH_INSTRUCTION}`;
    
    const response = ai ? await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }] // Use Search grounding
      }
    }) : await mockGenerate(fullPrompt);

    const grounding = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return {
      text: cleanText(response?.text || "Không thể tạo bài tập lúc này."),
      sources: grounding || []
    };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "Lỗi kết nối AI. Vui lòng thử lại sau.", sources: [] };
  }
};

export const generateStructuredHomework = async (subject: string, grade: string, topic: string, title: string) => {
  try {
    const prompt = `Soạn nội dung bài tập về nhà môn ${subject} cho học sinh ${grade}.
    - Chủ đề: ${topic}
    - Tiêu đề bài tập: ${title}
    
    Yêu cầu:
    1. Nội dung bám sát chương trình giáo dục Việt Nam.
    2. Bao gồm phần tóm tắt kiến thức ngắn gọn.
    3. Đưa ra 3-5 câu hỏi hoặc bài tập thực hành.
    4. Trình bày rõ ràng, sử dụng Markdown để in đậm các mục chính.
    ${FORMAT_INSTRUCTION}
    ${MATH_INSTRUCTION}`;

    const response = ai ? await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    }) : await mockGenerate(prompt);

    return cleanText(response?.text || "Không thể tạo nội dung.");
  } catch (error) {
    console.error("AI Gen Error", error);
    return "Lỗi khi tạo nội dung tự động.";
  }
};

export const getAITutorAdvice = async (scores: any[], comments: string[], studentGrade: string) => {
  try {
    const dataContext = JSON.stringify({ scores, comments, grade: studentGrade });
    const prompt = `Dựa trên bảng điểm và lời phê của giáo viên dưới đây: ${dataContext}.
    1. Nhận xét tổng quan về tình hình học tập.
    2. Đưa ra lời khuyên cụ thể để cải thiện.
    3. Tìm kiếm và đề xuất 3 dạng bài tập ôn luyện phù hợp từ internet (ưu tiên nguồn Việt Nam).
    ${FORMAT_INSTRUCTION}
    ${MATH_INSTRUCTION}`;

    const response = ai ? await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    }) : await mockGenerate(prompt);

    return cleanText(response?.text || "");
  } catch (error) {
    console.error("Tutor Error", error);
    return "Gia sư AI đang bận, vui lòng thử lại sau.";
  }
};

export const generateCustomQuiz = async (params: {subject: string, type: string, grade: string, difficulty: string, topic: string, count: number}) => {
  try {
    let typeInstruction = "";
    if (params.type === "Trắc nghiệm") {
      typeInstruction = "Tất cả câu hỏi là TRẮC NGHIỆM khách quan với 4 đáp án A, B, C, D.";
    } else if (params.type === "Tự luận") {
      typeInstruction = "Tất cả câu hỏi là TỰ LUẬN, yêu cầu học sinh trình bày cách giải.";
    } else if (params.type === "Trắc nghiệm & Tự luận") {
      typeInstruction = "Cấu trúc đề thi gồm 2 phần: Phần I - Trắc nghiệm (chiếm khoảng 70% số câu) và Phần II - Tự luận (chiếm khoảng 30% số câu).";
    }

    const prompt = `Tạo một đề thi môn ${params.subject} lớp ${params.grade}.
    - Loại đề: ${params.type}
    - Độ khó: ${params.difficulty}
    - Chủ đề trọng tâm: ${params.topic || 'Tổng hợp kiến thức'}
    - Tổng số câu hỏi: ${params.count}
    
    Yêu cầu chi tiết:
    1. ${typeInstruction}
    2. Trình bày rõ ràng, đánh số câu hỏi (Câu 1:, Câu 2:...).
    3. QUAN TRỌNG VỀ ĐỊNH DẠNG TRẮC NGHIỆM:
       - Sau nội dung câu hỏi phải xuống dòng.
       - Các đáp án A., B., C., D. BẮT BUỘC PHẢI XUỐNG DÒNG RIÊNG BIỆT.
       - Ví dụ đúng:
         Câu 1: 1 + 1 bằng mấy?
         A. 1
         B. 2
         C. 3
         D. 4
    4. Không kèm đáp án ngay bên dưới (để học sinh tự làm).
    5. Sử dụng ký hiệu toán học LaTeX chuẩn (ví dụ $\\frac{a}{b}$) để hiển thị phân số, mũ, căn bậc hai đẹp mắt.
    6. Cuối đề, BẮT BUỘC thêm dòng chữ "---DAU_CACH---" (chính xác như vậy) và liệt kê ĐÁP ÁN CHI TIẾT ngay bên dưới.
    ${FORMAT_INSTRUCTION}
    ${MATH_INSTRUCTION}
    `;
    
    const response = ai ? await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    }) : await mockGenerate(prompt);
    // Use the aggressively formatting function here
    return formatQuizOutput(response?.text || "Không thể tạo đề.");
  } catch (e) {
    console.error(e);
    return "Lỗi khi tạo đề thi.";
  }
};

export const gradeStudentQuiz = async (quizContent: string, studentAnswers: string) => {
  try {
    const prompt = `Bạn là một giáo viên chấm thi tận tâm.
    
    ĐỀ BÀI:
    ${quizContent}
    
    BÀI LÀM CỦA HỌC SINH:
    ${studentAnswers}
    
    Yêu cầu chấm điểm:
    1. Chấm điểm trên thang điểm 10.
    2. Nhận xét chi tiết từng câu: Đúng/Sai.
    3. Nếu sai, hãy giải thích đáp án đúng và cách làm (sử dụng ký hiệu toán học LaTeX $...$ để hiển thị công thức đẹp).
    4. Đưa ra lời khuyên ôn tập ngắn gọn và động viên học sinh.
    5. Trình bày kết quả dưới dạng Markdown dễ đọc, chia đoạn rõ ràng.
    ${FORMAT_INSTRUCTION}
    ${MATH_INSTRUCTION}
    `;
    
    const response = ai ? await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    }) : await mockGenerate(prompt);
    return cleanText(response?.text || "Không thể chấm bài.");
  } catch (e) {
    console.error(e);
    return "Lỗi khi chấm bài.";
  }
};
