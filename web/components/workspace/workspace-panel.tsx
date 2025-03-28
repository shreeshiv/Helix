import { useState, useEffect } from 'react';

interface Sequence {
  id: string;
  user_id: string;
  org_id: string;
  name: string;
  content: string;
  messages: Array<{
    sender: string;
    text: string;
  }>;
}

interface WorkspacePanelProps {
  sequences: Sequence[];
  activeSequenceId?: string;
  onSequenceChange?: (sequenceId: string) => void;
  onContentUpdate?: (content: string) => void;
  messages: Array<{ sender: string; text: string; }>;
  userId: string;
  orgId: string;
}

export function WorkspacePanel({
  sequences = [],
  activeSequenceId,
  onSequenceChange,
  onContentUpdate,
  messages,
  userId,
  orgId,
}: WorkspacePanelProps) {
  const [activeId, setActiveId] = useState(activeSequenceId || sequences[0]?.id);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update editedContent when sequences or activeId changes
  useEffect(() => {
    const currentSequence = sequences.find(s => s.id === activeId);
    setEditedContent(currentSequence?.content || '');
  }, [sequences, activeId]);

  const handleSequenceChange = (sequenceId: string) => {
    setActiveId(sequenceId);
    onSequenceChange?.(sequenceId);
  };

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    onContentUpdate?.(newContent);
  };

  const handleSave = async () => {
    if (!activeId) return;

    setIsSaving(true);
    try {
      const currentSequence = sequences.find(s => s.id === activeId);
      
      const response = await fetch('http://localhost:8000/api/sequences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeId,
          user_id: userId,
          org_id: orgId,
          name: currentSequence?.name || 'Untitled Sequence',
          content: editedContent,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save sequence');
      }

      // Show success message or update UI as needed
    } catch (error) {
      console.error('Error saving sequence:', error);
      // Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Workspace Header */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-6">
        <div className="flex space-x-2">
          {sequences.map((sequence) => (
            <button
              key={sequence.id}
              onClick={() => handleSequenceChange(sequence.id)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeId === sequence.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {sequence.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            isSaving 
              ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Sequence'}
        </button>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full p-6">
          <div className="max-w-3xl mx-auto h-full">
            <div className="bg-zinc-800/50 rounded-lg p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Outreach Sequence</h2>
              <div className="flex-1">
                {sequences.length > 0 ? (
                  <div className="bg-zinc-800 rounded p-4 h-full">
                    <textarea
                      className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
                      value={editedContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Start typing your sequence..."
                    />
                  </div>
                ) : (
                  <div className="bg-zinc-800 rounded p-4">
                    <p className="text-zinc-400">Your outreach sequence will appear here...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 