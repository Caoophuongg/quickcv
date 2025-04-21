import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: resumeDataInclude,
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <CreateResumeButton />
      </div>
      {resumes.length === 0 ? (
        <p className="text-center">You don&apos;t have any resumes yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
