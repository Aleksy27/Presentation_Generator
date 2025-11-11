'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect } from 'react';
import SlideViewer from './components/SlideViewer';
import { parsePresentationFromText } from './lib/presentationParser';
import { Presentation } from './types/presentation';
import { Sparkles } from 'lucide-react';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [presentationTitle, setPresentationTitle] = useState('');

  useEffect(() => {
    const lastAssistantMessage = messages
      .filter(m => m.role === 'assistant')
      .pop();

    if (lastAssistantMessage) {
      const fullText = lastAssistantMessage.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('\n');

      if (fullText) {
        const userMessage = messages.find(m => m.role === 'user');
        const title = userMessage 
          ? userMessage.parts.find(p => p.type === 'text')?.text || 'Prezentacja'
          : presentationTitle || 'Prezentacja';

        const parsedPresentation = parsePresentationFromText(fullText, title);
        setPresentation(parsedPresentation);
        setPresentationTitle(title);
      }
    }
  }, [messages, presentationTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setPresentationTitle(input.trim());
      sendMessage({ text: input.trim() });
      setInput('');
      setPresentation(null);
    }
  };

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            Generator Prezentacji
          </h1>
        </div>

        <div className="mb-8">
          <form
            className="flex items-center justify-center gap-4 max-w-2xl mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!status || status !== 'ready'}
              placeholder="Wprowadź temat prezentacji"
              className="flex-1 p-4 rounded-lg border-3 border-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:scale-105 transition-all hover:gradient-to-l hover:from-purple-700 hover:to-blue-700"
              type="submit"
              disabled={!status || status !== 'ready' || !input.trim()}
            >
              <Sparkles className="inline-block mr-2" /> 
              {isLoading ? 'Generowanie...' : 'Generuj Prezentację'}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4">Generowanie prezentacji...</p>
          </div>
        )}

        {presentation && !isLoading && (
          <SlideViewer presentation={presentation} />
        )}
      </div>
    </div>
  );
}