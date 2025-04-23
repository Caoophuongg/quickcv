import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().min(1),
    POSTGRES_PRISMA_URL: z.string().min(1),
    POSTGRES_URL_NO_SSL: z.string().min(1),
    POSTGRES_URL_NON_POOLING: z.string().min(1),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
