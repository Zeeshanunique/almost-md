"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Bot,
  CircleAlert,
  CircleAlertIcon,
  DoorClosedIcon,
  FileCheck2,
  LucideCircleAlert,
  OctagonAlert,
  Plus,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { ModeToggle } from "@/components/modetoggle";
import { useState } from "react";
import { useChat } from "ai/react";
import ReportComponent from "@/components/ReportComponent";
// import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast"
import ChatComponent from "@/components/chatcomponent";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

const Home = () => {
  const { toast } = useToast()

  const [reportData, setreportData] = useState("");
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({
      description: "Updated!"
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
        <h1 className="text-xl font-semibold text-[#D90013]">
          <span className="flex flex-row">Kanoon!</span>
        </h1>
        <div className="ml-auto flex gap-2">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Get Started</Button>
          </SignUpButton>
        </div>
      </header>

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
    </div>
  );
};

export default Home;
