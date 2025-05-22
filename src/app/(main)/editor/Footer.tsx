import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";

interface FooterProps {
  isSaving: boolean;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview?: boolean;
  setShowSmResumePreview?: (show: boolean) => void;
}

export default function Footer({
  isSaving,
  currentStep,
  setCurrentStep,
  showSmResumePreview = false,
  setShowSmResumePreview = () => {},
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <footer className="sticky bottom-0 left-0 right-0 z-10 border-t bg-background px-3 py-3 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Quay lại
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Tiếp tục
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSmResumePreview(!showSmResumePreview)}
            className="md:hidden"
            title={
              showSmResumePreview ? "Hiển thị form nhập liệu" : "Xem trước CV"
            }
          >
            {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>
          
          <p
            className={cn(
              "text-muted-foreground opacity-0 transition-opacity duration-200",
              isSaving && "opacity-100",
            )}
          >
            Đang lưu
          </p>
          
          <Button variant="secondary" asChild>
            <Link href="/resumes">Đóng</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
