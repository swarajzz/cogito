import { Brain, GalleryVerticalEnd } from "lucide-react";

import { SignupForm } from "@/src/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
            <Brain className="h-6 w-6 text-white" />
          </div>
          Cogito
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
