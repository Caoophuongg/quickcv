"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

export default function CreateResumeButton() {
  return (
    <Button asChild className="flex w-full items-center justify-center gap-2">
      <Link href="/editor">
        <PlusSquare className="size-5" />
        New resume
      </Link>
    </Button>
  );
}
