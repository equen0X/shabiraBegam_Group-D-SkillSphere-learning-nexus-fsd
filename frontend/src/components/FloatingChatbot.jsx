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

  const responseIndicesRef = useRef({
    overview: 0,
    courses: 0,
    xp: 0,
    badges: 0,
    sandbox: 0,
    workforce: 0,
    pricing: 0,
    cert: 0,
    general: 0
  });

  const getDynamicSkillSphereReply = (queryText) => {
    const q = queryText.toLowerCase();

    const responses = {
      overview: [
        "SkillSphere is an all-in-one gamified learning and workforce operations platform! It empowers developers with 12+ tech tracks, live code sandboxes, XP rewards, and blockchain-verified certificates, while providing managers with sprint planning and leave workflows.",
        "Think of SkillSphere as your futuristic growth accelerator! For students, it provides structured 6-chapter learning roadmaps, GFG reference notes, and video lessons. For teams, it offers employee directories, task assignment, and live metrics logging.",
        "SkillSphere bridges modern technical education with enterprise workforce management. Whether you are aiming to master React, Java, or AI Engineering, or seeking to manage sprint boards and team logs, SkillSphere brings everything into a unified portal.",
        "At its core, SkillSphere makes technical mastery engaging and measurable. You gain hands-on experience through interactive code execution, earn cyber-badges, track daily streaks, and verify course completion with cryptographic certificates!"
      ],

      courses: [
        "SkillSphere features 12 comprehensive learning tracks: 1) Frontend System Design, 2) React Developer, 3) JavaScript, 4) Data Structures & Algorithms, 5) Generative AI Engineering, 6) Machine Learning Foundations, 7) Advanced Node.js, 8) Next.js 14, 9) Web3 & Solidity, 10) AWS Cloud, 11) Python for Data Science, and 12) UI/UX Design! Each course includes 6 detailed modules, video lessons, and GFG notes.",
        "Our Learning Portal is structured into 6-chapter modules per course track. Each chapter comes equipped with verified GeeksforGeeks reference notes, YouTube video tutorials, XP rewards, and a 20-mark final assessment quiz to unlock your course completion badge!",
        "Whether you're starting with JavaScript fundamentals or advancing into Micro-Frontends and Generative AI, SkillSphere provides clear, step-by-step paths. You can track progress bars in real-time and test your knowledge with interactive quizzes.",
        "All SkillSphere courses are designed for practical mastery. You can select any track from the Courses page or top navigation pills to view curriculum chapters, study notes, and inline video streams."
      ],

      xp: [
        "You earn XP on SkillSphere by completing chapter modules (+100 to +250 XP per chapter) and scoring high on track quizzes (+15 XP per mark, up to 300 XP max per track). Accumulating XP levels up your profile badge!",
        "Gamification is embedded into every learning action on SkillSphere! Maintaining your daily login streak grants XP multipliers, while completing 6-module tracks unlocks exclusive Level titles from Apprentice to Grandmaster.",
        "Every chapter completed adds XP directly to your student account balance. You can view your total XP, current Level, and leaderboard rank in real-time from your Student Dashboard!",
        "XP rewards reflect your hands-on mastery! Completing all 6 modules of a course track earns over 1,000 XP and unlocks the official track completion assessment."
      ],

      badges: [
        "SkillSphere features 11 unlockable cyber-badges, including React Master, Java Master, Spring Boot Master, AI Architect, Code Ninja, Security Specialist, and Perfect Quizzer! Scoring 85%+ on a track quiz instantly unlocks its badge on your profile.",
        "Badges on SkillSphere represent verified skill milestones! When you achieve an 85% score (17+ out of 20 marks) on a course final quiz, the corresponding cyber-badge is awarded and linked to your digital certificate.",
        "You can inspect your unlocked badge showcase on the Features page or Student Dashboard. Each badge features glowing cyberpunk aesthetics and cryptographic proof of completion.",
        "Want to collect all 11 cyber-badges? Complete the 6 curriculum modules for React, Java, Spring Boot, DSA, or Gen AI and pass their 20-mark track assessments!"
      ],

      sandbox: [
        "SkillSphere includes an online Code Sandbox supporting JavaScript, Python 3, Java, and C++! You can write, edit, and execute code directly in your browser with live stdout terminal logs.",
        "Our multi-language Sandbox lets you test algorithms and functions on the fly! Select pre-built code templates or write custom scripts without installing any local compiler setup.",
        "The SkillSphere Sandbox is powered by an instant execution engine. Try writing Python functions, JS DOM scripts, or C++ algorithms and see output logs in real-time!",
        "Access the Sandbox from the top navbar to experiment with code snippets from your GFG study notes or practice problem sets."
      ],

      workforce: [
        "SkillSphere Workforce Management empowers team leads to oversee employee directories, assign sprint tickets with priority badges (High/Medium/Low), handle leave request approvals, and audit live system activity logs.",
        "For enterprise teams, SkillSphere provides a robust operations hub: managers can review team productivity, track active project progress, approve employee leave requests, and manage workforce roles.",
        "The Workforce Hub bridges project planning and team administration. Employees can view assigned tasks, update sprint statuses, and request time off seamlessly.",
        "Managers can access the Workforce Dashboard to view real-time system metrics, manage employee profiles, and assign priority tasks across development sprints."
      ],

      pricing: [
        "All courses on SkillSphere are currently 100% FREE under the SkillSphere Scholarship Grant! You get complete, unrestricted access to all 12 learning tracks, video lessons, sandboxes, and certificates for ₹0.",
        "Enrollment is completely free! Simply browse the Courses Catalog, click 'Enroll Now' on any course, and check out with the instant 100% Scholarship discount applied.",
        "No subscription or hidden fees! SkillSphere offers full access to all curriculum modules, GFG notes, quizzes, and verifiable certificates at zero cost.",
        "You can enroll in as many of the 12 courses as you like for free! Your enrolled courses will be unlocked immediately in your Learning Portal."
      ],

      cert: [
        "When you finish a course track on SkillSphere, a tamper-proof cryptographic verification hash is generated. You can copy your Certificate Hash ID from the Student Dashboard or download a high-res certificate image for your resume!",
        "SkillSphere certificates feature blockchain-style verification hashes. Employers can verify your certificate's authenticity, and you can share your credential image directly on LinkedIn or your portfolio.",
        "Every completed course track issues an official SkillSphere certificate containing your full name, course title, completion date, and unique verification ID.",
        "You can generate and download your custom PNG certificate anytime from the 'Certificates' tab in your Student Dashboard!"
      ],

      contact: [
        "Have a question or need assistance? You can email our support team at support@skillsphere.com or visit our Contact page to send a message directly to our helpdesk!",
        "We're here to help! Reach out to support@skillsphere.com for account support, course inquiries, or workforce setup assistance.",
        "Visit the Contact Us page in the platform navigation to submit a message or report an issue directly to our team."
      ],

      general: [
        `I'd be glad to help with your question about "${queryText}"! SkillSphere provides interactive learning tracks, real-time code sandboxes, XP rewards, and workforce management tools. Let me know if you need specific details on courses, certificates, or features!`,
        `Great question about "${queryText}"! On SkillSphere, you can explore 12 tech tracks, practice in our code sandbox, earn XP and badges, or manage team sprint projects. What specific aspect would you like to dive into?`,
        `SkillSphere is designed to make learning and working seamless! Feel free to ask about course roadmaps, quiz challenges, XP levelling, or workforce operations.`
      ]
    };

    let category = "general";
    if (q.includes("course") || q.includes("study") || q.includes("learn") || q.includes("track") || q.includes("react") || q.includes("java") || q.includes("dsa") || q.includes("ai")) {
      category = "courses";
    } else if (q.includes("xp") || q.includes("level") || q.includes("streak") || q.includes("point") || q.includes("score")) {
      category = "xp";
    } else if (q.includes("badge") || q.includes("achievement") || q.includes("trophy") || q.includes("unlock")) {
      category = "badges";
    } else if (q.includes("sandbox") || q.includes("code") || q.includes("compiler") || q.includes("run") || q.includes("terminal")) {
      category = "sandbox";
    } else if (q.includes("workforce") || q.includes("employee") || q.includes("manager") || q.includes("sprint") || q.includes("leave") || q.includes("team")) {
      category = "workforce";
    } else if (q.includes("price") || q.includes("cost") || q.includes("fee") || q.includes("free") || q.includes("pay") || q.includes("scholarship") || q.includes("enroll")) {
      category = "pricing";
    } else if (q.includes("cert") || q.includes("blockchain") || q.includes("verify") || q.includes("diploma") || q.includes("hash")) {
      category = "cert";
    } else if (q.includes("contact") || q.includes("help") || q.includes("support") || q.includes("email") || q.includes("bug")) {
      category = "contact";
    } else if (q.includes("what is") || q.includes("skillsphere") || q.includes("about") || q.includes("platform") || q.includes("overview") || q.includes("nexus")) {
      category = "overview";
    }

    const list = responses[category] || responses.general;
    const currentIndex = responseIndicesRef.current[category] || 0;
    const selectedReply = list[currentIndex % list.length];
    
    responseIndicesRef.current[category] = (currentIndex + 1) % list.length;
    return selectedReply;
  };

  const isQueryRelevantToPortal = (queryText) => {
    const q = queryText.toLowerCase().trim();
    
    // Allow basic greetings and identity checks
    const allowedGreetings = [
      "hello", "hi", "hey", "greetings", "yo", "good morning", "good afternoon", "good evening",
      "who are you", "what is your name", "what are you", "introduce yourself", "how are you"
    ];

    if (allowedGreetings.some(g => q === g || q.startsWith(g + " ") || q.includes(" " + g))) {
      return true;
    }

    // Portal features, topics, and pages keywords
    const portalKeywords = [
      "skillsphere", "sphereai", "portal", "platform", "website", "site", "nexus",
      "course", "track", "roadmap", "chapter", "module", "enroll", "scholarship",
      "xp", "streak", "level", "point", "score",
      "badge", "achievement", "trophy", "unlock",
      "sandbox", "compiler",
      "workforce", "employee", "manager", "sprint", "leave", "team",
      "price", "cost", "fee", "free", "pay",
      "cert", "blockchain", "diploma", "hash",
      "contact", "help", "support", "email", "bug",
      "overview", "about"
    ];

    return portalKeywords.some(keyword => q.includes(keyword));
  };

  const getUniversalTechnicalAnswer = (queryText) => {
    if (!isQueryRelevantToPortal(queryText)) {
      return "Please ask something related to this portal.";
    }
    return getDynamicSkillSphereReply(queryText);
  };

  // Send message handler
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Check relevance first
    if (!isQueryRelevantToPortal(text)) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "assistant", text: "Please ask something related to this portal." }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    setIsLoading(true);

    const systemPrompt = "You are SphereAI, a virtual assistant for the SkillSphere portal. You must ONLY answer questions directly related to the SkillSphere portal (its features, courses, modules, sandbox, certificates, workforce management, etc.). If the user asks a question that is irrelevant to the portal or a general coding/technical question not about this portal's offerings, you must respond exactly with: 'Please ask something related to this portal.'";

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
      if (replyText && replyText.trim().length > 0) {
        setMessages(prev => [...prev, { sender: "assistant", text: replyText.trim() }]);
      } else {
        throw new Error("Empty reply");
      }
    } catch (err) {
      console.warn("AI Chat API error, falling back to universal technical mentor:", err);
      
      setTimeout(() => {
        const dynamicReply = getUniversalTechnicalAnswer(text);
        setMessages(prev => [...prev, { sender: "assistant", text: dynamicReply }]);
      }, 500);
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
