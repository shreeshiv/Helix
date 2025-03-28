export interface Citation {
  url: string;
  title: string;
  text: string;
}

export type MessageSender = "user" | "assistant" | "bot";

export interface Message {
  id: number;
  text: string;
  sender: MessageSender;
  image?: string;
  citations?: Citation[];
  reasoning?: string;
  email_sequence?: {
    content: string;
    should_update_workspace: boolean;
  };
} 