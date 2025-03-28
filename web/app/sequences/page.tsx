"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Sequence {
  id: string;
  user_id: string;
  org_id: string;
  name: string;
  content: string;
  messages: any[];
  created_at: string;
  updated_at: string;
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        // TODO: Replace with actual user ID from auth
        const userId = "user_001";
        const response = await fetch(`http://localhost:8000/api/sequences/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sequences');
        }
        
        const data = await response.json();
        setSequences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sequences');
      } finally {
        setLoading(false);
      }
    };

    fetchSequences();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading sequences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sequences</h1>
      <div className="rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Updated</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sequences.map((sequence) => (
              <tr key={sequence.id} className="border-b border-zinc-800 last:border-0">
                <td className="px-4 py-3 text-sm">{sequence.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {format(new Date(sequence.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {format(new Date(sequence.updated_at), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    onClick={() => window.location.href = `/?sequence=${sequence.id}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 