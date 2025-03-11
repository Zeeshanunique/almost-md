import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Your Legal Assistant
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get instant legal guidance and document analysis powered by AI. Understand your rights and make informed decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-[#D90013]">Get Started</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline">Sign In</Button>
                </SignInButton>
              </div>
            </div>
            <div className="mx-auto aspect-video w-full max-w-[600px] overflow-hidden rounded-xl object-cover object-center">
              <div className="h-full w-full bg-gradient-to-br from-[#D90013] to-[#FF6B6B] opacity-80"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
