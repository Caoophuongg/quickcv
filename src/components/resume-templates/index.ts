import Template0 from "./Template0";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import { TemplateType } from "./types";

// Map template types to component
export const templateComponents = {
  [TemplateType.TEMPLATE_0]: Template0,
  [TemplateType.TEMPLATE_1]: Template1,
  [TemplateType.TEMPLATE_2]: Template2,
  [TemplateType.TEMPLATE_3]: Template3,
  [TemplateType.TEMPLATE_4]: Template4,
};

export {
  Template0,
  Template1,
  Template2,
  Template3,
  Template4,
};
export * from "./types";
