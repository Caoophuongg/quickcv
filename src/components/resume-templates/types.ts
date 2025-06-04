import { ResumeValues } from "@/lib/validation";
import { ReactNode } from "react";

export enum TemplateType {
  TEMPLATE_0 = "template_0",
  TEMPLATE_1 = "template_1",
  TEMPLATE_2 = "template_2",
  TEMPLATE_3 = "template_3",
  TEMPLATE_4 = "template_4",
}

export interface ResumeTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export interface SectionProps {
  resumeData: ResumeValues;
  children?: ReactNode;
}
