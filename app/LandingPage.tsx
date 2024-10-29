import { SignInButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">MediBuddy</h1>
        <div>
          <SignInButton>
            <Button className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800">Your Health, Our Priority!</h2>
        <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl">
        Unlock insights with MediBuddy report analysis and disease prediction to stay ahead in your health journey.        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <SignInButton>
            <Button className="bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-500">
              Get Started
            </Button>
          </SignInButton>
          <Button className="bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-500">
            Learn More
          </Button>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-gray-600">
        <p>&copy; 2024 MediBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
