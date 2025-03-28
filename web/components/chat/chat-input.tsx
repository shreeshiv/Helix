import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Calendar, FileText } from "lucide-react";

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

  const handleSuggestionInsert = (suggestion: string) => {
    if (suggestion === '/meeting') {
      setInputText("Please add this meeting link to the email sequence: https://calendly.com/your-org");
    } else {
      setInputText(inputText + " " + suggestion);
    }
    handleSend();
  };

  const suggestions = [
    { 
      icon: <Calendar className="h-5 w-5 mr-2" />, 
      text: "Add Meeting Link", 
      command: "/meeting" 
    },
    { 
      icon: <FileText className="h-5 w-5 mr-2" />, 
      text: "Add Documents", 
      command: "/docs" 
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full"
            onClick={() => handleSuggestionInsert(suggestion.command)}
          >
            {suggestion.icon}
            {suggestion.text}
          </Button>
        ))}
      </div>
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
    </div>
  );
} 