import { Button } from "@/components/ui/button";
import { 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RotateCcw 
} from "lucide-react";

interface MessageActionsProps {
  onCopy: () => void;
  onShare: () => void;
  onLike: () => void;
  onDislike: () => void;
  onRegenerate?: () => void;
  isBot: boolean;
}

export function MessageActions({ 
  onCopy, 
  onShare, 
  onLike, 
  onDislike, 
  onRegenerate,
  isBot 
}: MessageActionsProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-zinc-400 hover:text-white"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-zinc-400 hover:text-white"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-zinc-400 hover:text-white"
        onClick={onLike}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-zinc-400 hover:text-white"
        onClick={onDislike}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      {isBot && onRegenerate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-white"
          onClick={onRegenerate}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 