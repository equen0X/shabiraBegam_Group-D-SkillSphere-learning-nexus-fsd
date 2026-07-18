import React, { useState, useEffect, useRef } from "react";
import "../styles/floatingChatbot.css";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hello! I am SphereAI, your virtual learning and workspace guide. How can I help you explore SkillSphere today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send message handler
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const systemPrompt = "You are SphereAI, the virtual assistant for SkillSphere. You are an expert learning guide and general assistant. You are capable of answering any question from programming and architecture to history, science, coding help, and platform features. Never limit the depth of your answers and always return complete, informative responses in a friendly, helpful, futuristic tone.";

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-6).map(m => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: text }
          ],
          model: "openai"
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const replyText = await response.text();
      setMessages(prev => [...prev, { sender: "assistant", text: replyText.trim() }]);
    } catch (err) {
      console.warn("AI Chat API error, falling back to local responder:", err);
      
      // Local fallback
      setTimeout(() => {
        let fallbackReply = "SkillSphere is a next-generation gamified learning and workforce management system. It integrates progress logging, XP multipliers, daily streaks, and blockchain certificates with operations, directories, sprint planners, and leave approvals.";
        const query = text.toLowerCase();
        if (query.includes("xp") || query.includes("level")) {
          fallbackReply = "You earn XP by completing course study targets (+5% progress per study action) and completing daily quests. Completing an entire course module advances you to the next Level (starting at Level 0 for new signups).";
        } else if (query.includes("course") || query.includes("study") || query.includes("learn")) {
          fallbackReply = "Explore our Learning portal to access interactive modules in React Development, Java OOPs, Spring Boot, and Cybersecurity. You can view progress bars and syllabus chapters directly in your learning tracks!";
        } else if (query.includes("workforce") || query.includes("employee") || query.includes("operations")) {
          fallbackReply = "Workforce hubs allow managers to oversee employee directories, assign sprint projects with priority tags, manage leave approvals, and review live operations metrics and system logs!";
        } else if (query.includes("badge") || query.includes("streak") || query.includes("achieve")) {
          fallbackReply = "SkillSphere features 11 unlockable master badges (including Daily Streak, React Master, Java Master, Spring Boot Master, Code Ninja, AI Conversationalist, Security Specialist, Elite Coder, and Perfect Quizzer) shown in sequence in your Features portal.";
        } else if (query.includes("cert") || query.includes("blockchain")) {
          fallbackReply = "When you complete a course track, a secure verification hash is generated. You can copy the certificate ID from the 'Certificates' tab to share on your resume and verify its blockchain validity.";
        }
        setMessages(prev => [...prev, { sender: "assistant", text: fallbackReply }]);
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What is SkillSphere?",
    "How to earn XP?",
    "How to manage teams?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`floating-chat-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with SphereAI"
      >
        {isOpen ? "✖" : "🤖"}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="floating-chat-window">
          
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-header-title">
              <div className="chat-status-dot"></div>
              <h4>SphereAI <span>virtual assistant</span></h4>
            </div>
            <button className="chat-header-close" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>

          {/* Messages Log */}
          <div className="chat-window-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble-floating ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-typing-indicator">
                <div className="chat-typing-dot"></div>
                <div className="chat-typing-dot"></div>
                <div className="chat-typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chat-window-hints">
            {quickPrompts.map((prompt, i) => (
              <span 
                key={i} 
                className="chat-hint-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </span>
            ))}
          </div>

          {/* Input Area */}
          <div className="chat-window-input-area">
            <input
              type="text"
              className="chat-window-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(input);
              }}
              disabled={isLoading}
            />
            <button 
              className="chat-window-send"
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
            >
              🚀
            </button>
          </div>

        </div>
      )}
    </>
  );
}
