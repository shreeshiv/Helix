import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import { ChatInput } from "@/components/chat/chat-input";

interface WelcomeViewProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  setSelectedImage: (file: File | null) => void;
  selectedImage: File | null;
}

export function WelcomeView({
  inputText,
  setInputText,
  handleSend,
  isLoading,
  setSelectedImage,
  selectedImage,
}: WelcomeViewProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8 text-white">What do you want to know?</h1>
        <div className="w-full max-w-2xl">
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
            isLoading={isLoading}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
        </div>
      </div>
    </div>
  );
} 