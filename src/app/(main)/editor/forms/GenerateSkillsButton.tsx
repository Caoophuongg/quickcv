import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateSkillsInput,
  generateSkillsSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateSkills } from "./actions";

interface GenerateSkillsButtonProps {
  onSkillsGenerated: (skills: string[]) => void;
}

export default function GenerateSkillsButton({
  onSkillsGenerated,
}: GenerateSkillsButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          setShowInputDialog(true);
        }}
      >
        <WandSparklesIcon className="size-4" />
        Tạo kỹ năng với AI
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onSkillsGenerated={(skills) => {
          onSkillsGenerated(skills);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkillsGenerated: (skills: string[]) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onSkillsGenerated,
}: InputDialogProps) {
  const { toast } = useToast();

  const form = useForm<GenerateSkillsInput>({
    resolver: zodResolver(generateSkillsSchema),
    defaultValues: {
      jobTitle: "",
      workExperience: "",
      education: "",
    },
  });

  async function onSubmit(input: GenerateSkillsInput) {
    try {
      const response = await generateSkills(input);
      onSkillsGenerated(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo kỹ năng với AI</DialogTitle>
          <DialogDescription>
            Cung cấp một số thông tin về bạn để AI gợi ý những kỹ năng phù hợp.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí công việc</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Kỹ sư phần mềm, Nhà thiết kế đồ họa,..."
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kinh nghiệm làm việc (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả ngắn gọn về kinh nghiệm làm việc của bạn"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Học vấn (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả ngắn gọn về học vấn của bạn"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Tạo kỹ năng
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 