interface Citation {
  url: string;
  title: string;
  text: string;
}

interface ChatMessage {
  text: string;
  sender: string;
  citations?: Citation[];
  search_id?: string;
}

export function ChatMessage({ message }: { message: ChatMessage }) {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      message.sender === 'user' ? 'bg-zinc-800' : 'bg-zinc-900'
    )}>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-zinc-100">
          {message.text}
        </p>
        
        {/* Citations section */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400">Sources:</h4>
            <div className="space-y-1">
              {message.citations.map((citation, index) => (
                <div key={index} className="text-xs">
                  <a 
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {citation.title}
                  </a>
                  <p className="text-zinc-500 mt-0.5">
                    "{citation.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 