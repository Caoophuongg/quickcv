import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSkillsButton from "./GenerateSkillsButton";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      // const isValid = await form.trigger();
      // if (!isValid) return;
      setResumeData({
        ...resumeData,
        skills:
          values.skills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Kỹ năng</h2>
        <p className="text-sm text-muted-foreground">
          Bạn có những kỹ năng gì?
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Kỹ năng</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. React.js, Node.js, graphic design, ..."
                    onChange={(e) => {
                      const skills = e.target.value.split(",");
                      field.onChange(skills);
                    }}
                    value={field.value?.join(", ")}
                  />
                </FormControl>
                <FormDescription>
                  Ngăn cách từng kỹ năng bằng dấu phẩy
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center pt-2">
            <GenerateSkillsButton
              onSkillsGenerated={(skills) => {
                const currentSkills = form.getValues().skills || [];
                const uniqueSkills = [...new Set([...currentSkills, ...skills])];
                form.setValue("skills", uniqueSkills);
              }}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
