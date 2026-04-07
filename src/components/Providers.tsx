"use client";

import { ReactNode } from "react";
import { InterviewProvider } from "@/hooks/useInterview";

export default function Providers({ children }: { children: ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
