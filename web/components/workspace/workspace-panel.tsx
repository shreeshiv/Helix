import { useState, useEffect } from 'react';
import { Mail, Users, BrainCircuit, Sparkles, Copy, CheckCircle, XCircle } from "lucide-react";

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
  const [copySuccess, setCopySuccess] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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

      setNotification({ message: 'Sequence saved successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error saving sequence:', error);
      setNotification({ message: 'Failed to save sequence', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all transform ${
          notification.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

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
        <div className="flex space-x-2">
          <button
            onClick={handleCopyToClipboard}
            className="px-3 py-1 text-sm rounded-md transition-colors bg-zinc-700 text-white hover:bg-zinc-600 flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
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
                  <div className="flex flex-col items-center justify-center h-full space-y-8 text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-zinc-700/50 flex items-center justify-center">
                      <BrainCircuit className="w-10 h-10 text-blue-400" />
                    </div>
                    
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-xl font-medium text-white">Create Your First Sequence</h3>
                      <p className="text-sm text-zinc-400">
                        Start a conversation with Helix to generate personalized outreach sequences for your candidates
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                      <div className="bg-zinc-800/50 p-4 rounded-lg flex items-start space-x-3">
                        <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium text-zinc-200">Target Candidates</h4>
                          <p className="text-xs text-zinc-400">Specify your ideal candidate profile</p>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium text-zinc-200">Multi-step Outreach</h4>
                          <p className="text-xs text-zinc-400">Create engaging message sequences</p>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium text-zinc-200">AI-Powered</h4>
                          <p className="text-xs text-zinc-400">Let AI craft perfect messages</p>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg flex items-start space-x-3">
                        <BrainCircuit className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium text-zinc-200">Smart Templates</h4>
                          <p className="text-xs text-zinc-400">Save and reuse winning sequences</p>
                        </div>
                      </div>
                    </div>
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