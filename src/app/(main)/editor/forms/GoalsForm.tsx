import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { goalsSchema, GoalsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function GoalsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<GoalsValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      shortTermGoals: resumeData.shortTermGoals || "",
      longTermGoals: resumeData.longTermGoals || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      // const isValid = await form.trigger();
      // if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Mục tiêu nghề nghiệp</h2>
        <p className="text-sm text-muted-foreground">
          Chia sẻ định hướng sự nghiệp của bạn để nhà tuyển dụng hiểu rõ hơn về bạn
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="shortTermGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mục tiêu ngắn hạn</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mục tiêu nghề nghiệp trong 1-2 năm tới của bạn"
                    className="min-h-28 resize-y"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longTermGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mục tiêu dài hạn</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mục tiêu nghề nghiệp dài hạn (3-5 năm) của bạn"
                    className="min-h-28 resize-y"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 