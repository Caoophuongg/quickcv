import { BorderStyle } from "@/app/(main)/editor/BorderStyleButton";
import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        major: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  skills: z.array(z.string()).default([]),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        name: optionalString,
        role: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
        techStack: z.array(z.string()).default([]),
      })
    )
    .default([]),
});

export type ProjectValues = z.infer<typeof projectSchema>;

export const hobbySchema = z.object({
  hobbies: z
    .array(
      z.object({
        name: optionalString,
        description: optionalString,
      })
    )
    .default([]),
});

export type HobbyValues = z.infer<typeof hobbySchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const goalsSchema = z.object({
  shortTermGoals: optionalString,
  longTermGoals: optionalString,
});

export type GoalsValues = z.infer<typeof goalsSchema>;

export const resumeSchema = z.object({
  title: optionalString,
  description: optionalString,
  photo: z.any().optional(),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  summary: optionalString,
  shortTermGoals: optionalString,
  longTermGoals: optionalString,
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
  educations: z
    .array(
      z.object({
        degree: optionalString,
        major: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
  skills: z.array(z.string()).default([]),
  projects: z
    .array(
      z.object({
        name: optionalString,
        role: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
        techStack: z.array(z.string()).default([]),
      }),
    )
    .optional(),
  hobbies: z
    .array(
      z.object({
        name: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
  colorHex: optionalString,
  borderStyle: z.custom<BorderStyle>().optional(),
  templateType: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
  templateType?: string;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...projectSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const generateEducationSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateEducationInput = z.infer<
  typeof generateEducationSchema
>;

export const generateSkillsSchema = z.object({
  jobTitle: optionalString,
  workExperience: optionalString,
  education: optionalString,
});

export type GenerateSkillsInput = z.infer<
  typeof generateSkillsSchema
>;

export const generateGoalsSchema = z.object({
  jobTitle: optionalString,
  currentLevel: optionalString,
  workExperience: optionalString,
  skills: z.array(z.string()).optional(),
});

export type GenerateGoalsInput = z.infer<
  typeof generateGoalsSchema
>;
