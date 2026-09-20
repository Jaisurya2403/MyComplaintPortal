import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { askGroqPortalChatbot } from '../../services/groqAiService.js';

export const ChatbotFAB = () => {
  const { user, theme } = useAuth();
  const { complaints = [] } = useComplaints();
  const isDark = theme === 'dark';

  const userComplaints = user ? complaints.filter(c => 
    (c.userId && String(c.userId).toLowerCase() === String(user.id).toLowerCase()) ||
    (c.userEmail && String(c.userEmail).toLowerCase() === String(user.email).toLowerCase()) ||
    (c.userName && String(c.userName).toLowerCase() === String(user.name).toLowerCase())
  ) : [];

  const storageKey = `mcp_chat_history_${user?.id || 'guest'}`;

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [
      {
        id: '1',
        sender: 'bot',
        text: `Hello ${user?.name ? user.name : 'there'}! I am your MyComplaintPortal Groq AI Assistant 🤖. Ask me anything about your complaints, status tracking, or municipal services!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Persist conversation history throughout active login session
  useEffect(() => {
    if (messages && messages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const [isTyping, setIsTyping] = useState(false);
  const lastMessageBubbleRef = useRef(null);

  // Align to top of newly generated answer bubble so user reads from top to bottom
  useEffect(() => {
    if (isOpen && lastMessageBubbleRef.current) {
      lastMessageBubbleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length, isOpen]);

  const quickQuestions = [
    'What is the status of my complaints?',
    'How to register a complaint?',
    'Water Supply Board contacts',
    'Roads & Transport department',
  ];

  // CLEAN TEXT FORMATTER FOR CHAT MESSAGES
  const renderCleanFormattedText = (rawText) => {
    if (!rawText) return null;

    let clean = rawText
      // Strip <think>...</think> reasoning tags completely
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<\/?think>/gi, '')
      // Remove ASCII markdown table divider lines like |---|---|
      .replace(/\|[\s-:]+\|[\s-:]+\|?/g, '')
      // Convert markdown table rows | Key | Value | into clean lines
      .replace(/\|/g, ' ')
      // Convert raw ### headers into clean uppercase bold text
      .replace(/#{1,6}\s?/g, '')
      // Remove double dashes ---
      .replace(/---/g, '')
      // Trim multiple spaces
      .replace(/[ \t]+/g, ' ');

    const lines = clean.split('\n').filter(line => line.trim().length > 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isListItem = /^\d+[\.\)]|^\•|^\-*/.test(trimmed);
          const formattedLine = trimmed.replace(/\*\*/g, '');

          return (
            <div 
              key={idx} 
              style={{
                paddingLeft: isListItem ? '0.5rem' : '0',
                borderLeft: isListItem ? '2px solid #60a5fa' : 'none',
                marginTop: isListItem ? '0.15rem' : '0',
              }}
            >
              {formattedLine}
            </div>
          );
        })}
      </div>
    );
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const groqRes = await askGroqPortalChatbot(text.trim(), currentHistory, { user, complaints: userComplaints });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: groqRes.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "⚠️ Connection issue with Groq AI. Please verify your API Key.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999 }}>
      {/* CHATBOT DRAWER CONTAINER */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '4.25rem',
            right: '0',
            width: '370px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '430px',
            maxHeight: 'calc(100vh - 7rem)',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderRadius: '24px',
            border: isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', itemsCenter: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', fontFamily: 'serif', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  My Civic Bot 
                </h4>
                <p style={{ fontSize: '0.65rem', color: '#93c5fd', margin: 0, fontWeight: '600' }}>
                  Online • 24/7 AI Civic Support
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%',
              }}
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE MESSAGES BODY (FULL PREVIOUS CONVERSATION SCROLLING) */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              backgroundColor: isDark ? '#090f1d' : '#f8fafc',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={m.id}
                ref={idx === messages.length - 1 ? lastMessageBubbleRef : null}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  maxWidth: '88%',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: m.sender === 'user' ? '#2563eb' : '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    marginTop: '0.2rem',
                  }}
                >
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-blue-400" />}
                </div>

                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    lineHeight: '1.45',
                    backgroundColor: m.sender === 'user' ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                    color: m.sender === 'user' ? '#ffffff' : (isDark ? '#ffffff' : '#0f172a'),
                    border: m.sender === 'user' ? 'none' : (isDark ? '1px solid #334155' : '1.5px solid #e2e8f0'),
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    fontWeight: '700',
                  }}
                >
                  {m.sender === 'user' ? (
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{m.text}</p>
                  ) : (
                    renderCleanFormattedText(m.text)
                  )}
                  <span
                    style={{
                      fontSize: '0.6rem',
                      display: 'block',
                      marginTop: '0.35rem',
                      textAlign: m.sender === 'user' ? 'right' : 'left',
                      color: m.sender === 'user' ? '#bfdbfe' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: '600',
                    }}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Quick Suggestion Chips */}
            {messages.length < 5 && (
              <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: '0.35rem' }}>
                  Quick Questions:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#60a5fa' : '#1d4ed8',
                        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '700', fontStyle: 'italic', color: '#2563eb' }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Groq AI is typing...
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '0.75rem',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderTop: isDark ? '1px solid #1e293b' : '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              placeholder="Ask about grievances, status, departments..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                color: isDark ? '#ffffff' : '#0f172a',
                border: isDark ? '1px solid #475569' : '1px solid #cbd5e1',
                padding: '0.65rem 1rem',
                borderRadius: '9999px',
                outline: 'none',
                fontSize: '0.8rem',
                fontWeight: '700',
                width: '100%',
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              }}
              title="Send Message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}

      {/* Floating FAB Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          border: '2.5px solid #ffffff',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        title="Open AI Civic Assistant"
      >
        <Bot className="w-7 h-7 text-blue-400" />
      </button>
    </div>
  );
};
