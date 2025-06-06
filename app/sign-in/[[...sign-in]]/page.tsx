import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#D90013] hover:bg-[#B80011]",
            footerActionLink: "text-[#D90013] hover:text-[#B80011]",
          },
        }}
        afterSignInUrl="/dashboard"
      />
    </div>
  );
} 