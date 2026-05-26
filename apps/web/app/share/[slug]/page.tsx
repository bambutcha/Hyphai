'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageMarkdown } from '@/components/MessageMarkdown';
import { HyphaeBackground } from '@/components/visual/HyphaeBackground';
import { api, type Message } from '@/lib/api';
import { uiText } from '@/lib/ui-text';

export default function SharePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api
      .getSharedConversation(slug)
      .then((data) => {
        setTitle(data.conversation.title);
        setMessages(data.messages);
      })
      .catch(() => setError('Диалог не найден или ссылка отключена'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="relative min-h-dvh">
      <HyphaeBackground />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs uppercase tracking-wider text-emerald-500/80">{uiText.share.readOnly}</p>
        <h1 className="font-display mt-2 text-2xl font-bold text-zinc-100">{title || 'Hyphai'}</h1>

        {loading && <p className="mt-8 text-sm text-zinc-500">Загрузка…</p>}
        {error && <p className="mt-8 text-sm text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950'
                      : 'glass-panel text-zinc-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <MessageMarkdown content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
