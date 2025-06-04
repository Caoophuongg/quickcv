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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateEducationInput,
  generateEducationSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateEducation } from "./actions";

interface GenerateEducationButtonProps {
  onEducationGenerated: (education: {
    degree: string;
    major?: string;
    school: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function GenerateEducationButton({
  onEducationGenerated,
}: GenerateEducationButtonProps) {
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
        Thêm học vấn bằng AI
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onEducationGenerated={(education) => {
          onEducationGenerated(education);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEducationGenerated: (education: {
    degree: string;
    major?: string;
    school: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onEducationGenerated,
}: InputDialogProps) {
  const { toast } = useToast();

  const form = useForm<GenerateEducationInput>({
    resolver: zodResolver(generateEducationSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(input: GenerateEducationInput) {
    try {
      const response = await generateEducation(input);
      onEducationGenerated(response);
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
          <DialogTitle>Tạo học vấn với AI</DialogTitle>
          <DialogDescription>
            Mô tả thông tin học vấn của bạn và AI sẽ tạo ra một mục học vấn hoàn chỉnh.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Ví dụ: "Tôi học Đại học Bách Khoa Hà Nội từ 2016-2020, chuyên ngành Công nghệ thông tin, tốt nghiệp loại giỏi."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Tạo nội dung
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 