import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  setSelectedImage: (file: File | null) => void;
  selectedImage: File | null;
  userId?: string;
  orgId?: string;
}

export function ChatInput({
  inputText,
  setInputText,
  handleSend,
  isLoading,
  setSelectedImage,
  selectedImage,
  userId,
  orgId,
}: ChatInputProps) {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Ask anything..."
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <ImagePlus className="h-5 w-5" />
      </Button>
      <Button onClick={handleSend} disabled={isLoading}>
        Send
      </Button>
    </div>
  );
} 