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
  GenerateGoalsInput,
  generateGoalsSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateGoals } from "./actions";

interface GenerateGoalsButtonProps {
  onGoalsGenerated: (goals: { shortTermGoals: string; longTermGoals: string }) => void;
  resumeData?: {
    jobTitle?: string;
    skills?: string[];
  };
}

export default function GenerateGoalsButton({
  onGoalsGenerated,
  resumeData,
}: GenerateGoalsButtonProps) {
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
        Tạo mục tiêu với AI
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onGoalsGenerated={(goals) => {
          onGoalsGenerated(goals);
          setShowInputDialog(false);
        }}
        resumeData={resumeData}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalsGenerated: (goals: { shortTermGoals: string; longTermGoals: string }) => void;
  resumeData?: {
    jobTitle?: string;
    skills?: string[];
  };
}

function InputDialog({
  open,
  onOpenChange,
  onGoalsGenerated,
  resumeData,
}: InputDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GenerateGoalsInput>({
    resolver: zodResolver(generateGoalsSchema),
    defaultValues: {
      jobTitle: resumeData?.jobTitle || "",
      currentLevel: "",
      workExperience: "",
      skills: resumeData?.skills || [],
    },
  });

  async function onSubmit(input: GenerateGoalsInput) {
    try {
      setIsSubmitting(true);
      const response = await generateGoals(input);
      console.log("Response from generateGoals:", response);
      
      // Kiểm tra và xử lý kết quả trước khi trả về
      if (!response || (!response.shortTermGoals && !response.longTermGoals)) {
        throw new Error("Không nhận được dữ liệu mục tiêu từ AI");
      }
      
      // Đảm bảo cả hai trường đều có giá trị
      const result = {
        shortTermGoals: response.shortTermGoals || "Chưa có mục tiêu ngắn hạn",
        longTermGoals: response.longTermGoals || "Chưa có mục tiêu dài hạn"
      };
      
      onGoalsGenerated(result);
    } catch (error) {
      console.error("Error generating goals:", error);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể tạo mục tiêu, vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo mục tiêu nghề nghiệp với AI</DialogTitle>
          <DialogDescription>
            Cung cấp thông tin để AI gợi ý các mục tiêu ngắn hạn và dài hạn phù hợp với định hướng nghề nghiệp của bạn.
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
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp bậc hiện tại</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="VD: Fresher, Junior, Mid-level, Senior,..."
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
            <LoadingButton type="submit" loading={isSubmitting}>
              Tạo mục tiêu
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 