import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Tạo hàm tương thích với giao diện của OpenAI
export const geminiModel = {
  chat: {
    completions: {
      create: async ({
        messages,
        model,
      }: {
        messages: { role: string; content: string }[];
        model: string;
      }) => {
        try {
          // Lấy model Gemini thích hợp (gemini-1.5-pro hoặc gemini-1.5-flash)
          const usedModel =
            model === "gpt-4o-mini" ? "gemini-1.5-flash" : "gemini-1.5-pro";
          const geminiModel = genAI.getGenerativeModel({ model: usedModel });

          // Chuyển đổi định dạng tin nhắn từ OpenAI sang Gemini
          const prompt = messages
            .map((msg) => {
              const role = msg.role === "system" ? "user" : msg.role;
              return `${role}: ${msg.content}`;
            })
            .join("\n\n");

          // Gọi API Gemini
          const result = await geminiModel.generateContent(prompt);
          const response = result.response.text();

          // Trả về định dạng tương tự như OpenAI để không phải thay đổi code nhiều
          return {
            choices: [
              {
                message: {
                  content: response,
                },
              },
            ],
          };
        } catch (error) {
          console.error("Gemini API error:", error);
          throw error;
        }
      },
    },
  },
};

export default geminiModel;
