"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resumeTemplates } from "@/lib/templates";
import { BookTemplate } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const router = useRouter();

  // Sắp xếp templates để đặt template trắng bên trái
  const sortedTemplates = [...resumeTemplates].sort((a, b) => {
    if (a.id === "blank") return -1;
    if (b.id === "blank") return 1;
    return 0;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      router.push(`/editor?template=${selectedTemplate}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex w-fit gap-2 bg-[#e1e1ec]">
          <BookTemplate className="size-5" />
          Chọn từ mẫu có sẵn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Chọn mẫu template</DialogTitle>
          <DialogDescription>
            Chọn mẫu có sẵn để bắt đầu tạo CV của bạn. Bạn có thể tùy chỉnh sau khi chọn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? "scale-[1.02]"
                  : "hover:scale-[1.01]"
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="aspect-[210/297] overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                <div className="relative w-full h-full">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                />
                </div>
              </div>
              <div className="mt-2 text-center">
                <h3 className="font-medium text-sm md:text-base">{template.name}</h3>
              </div>
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 rounded-md border-2 border-primary pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="mt-6 flex items-center justify-between sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateFromTemplate}
            disabled={!selectedTemplate}
            className="min-w-[120px]"
          >
            Tạo CV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
