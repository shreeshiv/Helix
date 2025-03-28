import { MessageSquarePlus, Sparkles, Mail } from "lucide-react";

interface WelcomeViewProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  setSelectedImage: (file: File | null) => void;
  selectedImage: File | null;
}

interface PromptTemplate {
  title: string;
  description: string;
  prompt: string;
  icon: JSX.Element;
}

export function WelcomeView({
  setInputText,
  handleSend,
  isLoading,
}: WelcomeViewProps) {
  const promptTemplates: PromptTemplate[] = [
    {
      title: "Senior Engineers",
      description: "Create sequence for experienced engineers",
      prompt: "Create an outreach sequence for senior software engineers with 5+ years of experience. Focus on technical growth and challenging projects.",
      icon: <MessageSquarePlus className="w-6 h-6 text-blue-400 mt-1" />
    },
    {
      title: "Product Leaders",
      description: "Engage product management candidates",
      prompt: "Generate a sequence for senior product managers who have led B2B SaaS products. Emphasize product strategy and team leadership.",
      icon: <Sparkles className="w-6 h-6 text-blue-400 mt-1" />
    },
    {
      title: "Sales Leaders",
      description: "Connect with sales professionals",
      prompt: "Write an outreach sequence for enterprise sales leaders with experience in technology sales. Focus on growth opportunities and commission structure.",
      icon: <Mail className="w-6 h-6 text-blue-400 mt-1" />
    }
  ];

  const handleTemplateClick = async (prompt: string) => {
    setInputText(prompt);
    handleSend();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Welcome to Helix</h1>
        <p className="text-zinc-400">Your AI-powered recruiting assistant</p>
      </div>

      <div className="grid gap-4 max-w-lg w-full">
        {promptTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => handleTemplateClick(template.prompt)}
            disabled={isLoading}
            className="bg-zinc-800/50 p-4 rounded-lg flex items-start space-x-3 w-full text-left
                     hover:bg-zinc-700/50 transition-colors duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {template.icon}
            <div>
              <h3 className="font-medium text-white">{template.title}</h3>
              <p className="text-sm text-zinc-400">{template.description}</p>
            </div>
          </button>
        ))}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-400">or start from scratch</span>
          </div>
        </div>

        <button
          onClick={() => handleTemplateClick("Create a personalized outreach sequence for recruiting candidates. Let me describe the role and requirements.")}
          disabled={isLoading}
          className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg w-full
                   hover:bg-blue-600/30 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-blue-400">Create Custom Sequence</span>
        </button>
      </div>
    </div>
  );
} 