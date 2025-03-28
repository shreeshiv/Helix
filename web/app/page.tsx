"use client";

import { useState } from "react";
import { WelcomeView } from "@/components/chat/welcome-view";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { Message, MessageSender } from "@/types/chat";
import { toast } from "sonner";
import { useContext } from "react";
import { useSearchMode } from "@/contexts/search-mode-context";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";

interface ChatMessage {
  id: number;
  text: string;
  sender: MessageSender;
  image?: string;
  citations?: Citation[];
  search_id?: string;
  reasoning?: string;
  email_sequence?: {
    content: string;
    should_update_workspace: boolean;
  };
}

interface Citation {
  url: string;
  title: string;
  text: string;
}

// First, let's create a new type for the API endpoints
const API_ENDPOINTS = {
  normal: "http://localhost:8000/api/chat",
  open: "http://localhost:8000/api/chat/open-search"
} as const;

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { activeSearchModes } = useSearchMode();
  
  // Move these state declarations before sequences
  const [userId] = useState("user_001"); // Replace with actual user ID from auth
  const [orgId] = useState("org_001");   // Replace with actual org ID from auth
  
  const [sequences, setSequences] = useState([
    {
      id: "1",
      user_id: "user_001", // Use string directly for initial state
      org_id: "org_001",   // Use string directly for initial state
      name: "Sequence 1",
      content: "",
      messages: []
    }
  ]);
  const [activeSequenceId, setActiveSequenceId] = useState("1");

  // Helper function to determine which API endpoint to use
  const getApiEndpoint = (activeSearchModes: Set<string>): string => {
    if (activeSearchModes.has("open")) {
      return API_ENDPOINTS.open;
    }
    return API_ENDPOINTS.normal;
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const formData = new FormData();
    
    // Add workspace to formData
    formData.append("workspace", activeSequenceId);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const userMessage = { 
      id: messages.length + 1, 
      text: inputText, 
      sender: "user" as const,
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const messageHistory = messages.concat(userMessage).map(({ text, sender }) => ({
        text,
        sender,
      }));

      formData.append("messages", JSON.stringify(messageHistory));
      
      const response = await fetch(API_ENDPOINTS.normal, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        text: data.message.text,
        sender: "assistant" as const,
        reasoning: data.message.reasoning,
        email_sequence: data.message.email_sequence
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Update workspace if email sequence is provided
      if (data.message.email_sequence?.should_update_workspace) {
        handleContentUpdate(data.message.email_sequence.content);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (messageId: number, workspace: string) => {
    if (isLoading) return;

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const conversationHistory = messages.slice(0, messageIndex).map(({ text, sender }) => ({
      text,
      sender,
    }));

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("messages", JSON.stringify(conversationHistory));
      formData.append("workspace", workspace);

      const response = await fetch(API_ENDPOINTS.normal, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const newBotMessage = {
        id: messages.length + 1,
        text: data.message.text,
        sender: "assistant" as const,
        reasoning: data.message.reasoning,
        email_sequence: data.message.email_sequence
      };
      
      // Replace the old message and remove subsequent messages
      setMessages(prev => [...prev.slice(0, messageIndex), newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to regenerate response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSequenceChange = (sequenceId: string) => {
    setActiveSequenceId(sequenceId);
  };

  const handleContentUpdate = (content: string) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === activeSequenceId 
          ? { ...seq, content }
          : seq
      )
    );
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Left Panel - Chat Interface */}
      <div className="w-[600px] flex flex-col border-r border-zinc-800">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <MessageList 
              messages={messages} 
              onRegenerate={handleRegenerate}
              workspace={activeSequenceId}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="border-t border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto">
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

      {/* Right Panel - Workspace */}
      <WorkspacePanel
        sequences={sequences}
        activeSequenceId={activeSequenceId}
        onSequenceChange={handleSequenceChange}
        onContentUpdate={handleContentUpdate}
        messages={messages}
        userId={userId}
        orgId={orgId}
      />
    </div>
  );
}
