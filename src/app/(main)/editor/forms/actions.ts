"use server";

import geminiModel, { detectLanguage } from "@/lib/gemini";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
  GenerateEducationInput,
  generateEducationSchema,
  GenerateSkillsInput,
  generateSkillsSchema,
  GenerateGoalsInput,
  generateGoalsSchema,
} from "@/lib/validation";
import { getAuthSession } from "@/lib/auth";

export async function generateSummary(input: GenerateSummaryInput) {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  let inputText = `${jobTitle || ""} ${workExperiences?.map(exp => `${exp.position || ""} ${exp.company || ""} ${exp.description || ""}`).join(" ")} ${skills || ""}`;
  const detectedLanguage = await detectLanguage(inputText);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  const completion = await geminiModel.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    language: detectedLanguage,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { description } = generateWorkExperienceSchema.parse(input);
  
  const detectedLanguage = await detectLanguage(description);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completion = await geminiModel.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    language: detectedLanguage,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}

export async function generateEducation(
  input: GenerateEducationInput,
) {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { description } = generateEducationSchema.parse(input);
  
  const detectedLanguage = await detectLanguage(description);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single education entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Degree: <degree or certification>
  Major: <major or specialization> (only if applicable)
  School: <school or institution name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  `;

  const userMessage = `
  Please provide an education entry from this description:
  ${description}
  `;

  const completion = await geminiModel.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    language: detectedLanguage,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return {
    degree: aiResponse.match(/Degree: (.*)/)?.[1] || "",
    major: aiResponse.match(/Major: (.*)/)?.[1] || "",
    school: aiResponse.match(/School: (.*)/)?.[1] || "",
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1] || "",
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1] || "",
  };
}

export async function generateSkills(
  input: GenerateSkillsInput,
) {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { jobTitle, workExperience, education } = generateSkillsSchema.parse(input);
  
  const detectedLanguage = await detectLanguage(jobTitle || workExperience || education || "");

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a list of 5-8 skills relevant to the user's profile.
  The skills should be concise (1-3 words each) and directly relevant to the job title, work experience, or education provided.
  Return ONLY a comma-separated list of skills, with no additional explanations, prefixes or styling.
  For example: "JavaScript, React.js, TypeScript, REST APIs, UI/UX Design, Project Management".
  `;

  const userMessage = `
  Please generate relevant skills based on this information:
  ${jobTitle ? `Job Title: ${jobTitle}` : ""}
  ${workExperience ? `Work Experience: ${workExperience}` : ""}
  ${education ? `Education: ${education}` : ""}
  `;

  const completion = await geminiModel.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    language: detectedLanguage,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  // Split by comma and clean up each skill
  return aiResponse.split(',').map(skill => skill.trim()).filter(Boolean);
}

export async function generateGoals(
  input: GenerateGoalsInput,
) {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { jobTitle, currentLevel, workExperience, skills } = generateGoalsSchema.parse(input);
  
  const detectedLanguage = await detectLanguage(jobTitle || workExperience || currentLevel || "");

  const systemMessage = `
  Bạn là AI tư vấn nghề nghiệp. Hãy tạo mục tiêu nghề nghiệp ngắn hạn (1-2 năm) và dài hạn (3-5 năm) thật ngắn gọn, mỗi mục tiêu chỉ 1-2 câu, không lặp lại tiêu đề, không dùng markdown, không số thứ tự, không giải thích thêm. Chỉ trả về đúng 2 đoạn văn, mỗi đoạn cho một mục tiêu, phân biệt rõ ràng.
  Cấu trúc trả về:
  Short-term: <mục tiêu ngắn hạn>
  Long-term: <mục tiêu dài hạn>
  `;

  const userMessage = `
  Hãy tạo mục tiêu nghề nghiệp dựa trên thông tin sau:
  ${jobTitle ? `Vị trí: ${jobTitle}` : ""}
  ${currentLevel ? `Cấp bậc: ${currentLevel}` : ""}
  ${workExperience ? `Kinh nghiệm: ${workExperience}` : ""}
  ${skills && skills.length > 0 ? `Kỹ năng: ${skills.join(", ")}` : ""}
  `;

  try {
    const completion = await geminiModel.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      language: detectedLanguage,
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    // Debug logs
    console.log("AI Response:", aiResponse);

    // Tách theo Short-term: và Long-term:
    let shortTermGoals = "";
    let longTermGoals = "";
    const shortMatch = aiResponse.match(/Short-term:\s*([\s\S]*?)(?=Long-term:|$)/);
    const longMatch = aiResponse.match(/Long-term:\s*([\s\S]*)/);
    if (shortMatch) shortTermGoals = shortMatch[1].trim();
    if (longMatch) longTermGoals = longMatch[1].trim();

    // Nếu không match, fallback chia đôi đoạn văn
    if (!shortTermGoals || !longTermGoals) {
      const parts = aiResponse.split(/\n\n|\n/).map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        shortTermGoals = parts[0];
        longTermGoals = parts[1];
      } else {
        shortTermGoals = aiResponse;
        longTermGoals = "";
      }
    }

    return {
      shortTermGoals,
      longTermGoals,
    };
  } catch (error) {
    console.error("Error in generateGoals:", error);
    throw error;
  }
}
