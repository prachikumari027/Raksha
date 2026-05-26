"use client";

import { Bot, SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import axios from "axios";

export default function HealthChatbotSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text:
          "👋 Hi! I’m Saksham, your AI Health Assistant 🤖. How can I help you today?",
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const botReply = await getBotReply(userMessage);

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in input
      handleSend();
    }
  };

  const getBotReply = async (userInput) => {
    try {
      const response = await axios.post("/api/gemini", {
        prompt: `You are Saksham, a friendly health assistant chatbot. Reply in a short, simple, helpful, and casual way (8-10 lines max). User asked: "${userInput}"`,
      });

      return response.data.botReply;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to get response";
      return `Error: ${message}`;
    }
  };

  return (
    <>
      <UserNavbar />
      <main className="h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-purple-100 dark:bg-purple-950 px-4 py-6 overflow-hidden relative">
        {/* Header moved outside the chat container */}
        <h2 className="mb-4 text-3xl font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-3">
          <Bot className="w-8 h-8 animate-bounce text-purple-600 dark:text-purple-400" />
          Saksham – AI Health Assistant 🤖
        </h2>

        {/* Emoji background decorations */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #d8b4fe 15%, transparent 16%)," +
              "radial-gradient(circle at 80% 40%, #a78bfa 15%, transparent 16%)," +
              "radial-gradient(circle at 50% 80%, #c4b5fd 20%, transparent 21%)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "150px 150px, 120px 120px, 180px 180px",
            opacity: 0.15,
            zIndex: 0,
          }}
        >
          <span
            className="absolute text-4xl animate-bounce"
            style={{ top: "10%", left: "15%" }}
            aria-hidden="true"
          >
            🩺
          </span>
          <span
            className="absolute text-5xl animate-pulse"
            style={{ top: "50%", right: "20%" }}
            aria-hidden="true"
          >
            💊
          </span>
          <span
            className="absolute text-3xl animate-spin-slow"
            style={{ bottom: "10%", left: "40%" }}
            aria-hidden="true"
          >
            🧬
          </span>
          <span
            className="absolute text-4xl animate-bounce"
            style={{ bottom: "30%", right: "35%" }}
            aria-hidden="true"
          >
            ❤️
          </span>
        </div>

        {/* Chat container */}
        <div className="relative w-full max-w-2xl h-[500px] bg-white dark:bg-purple-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-purple-300 dark:border-purple-700 z-10">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-purple-50 dark:bg-purple-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl shadow-md text-sm ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-purple-300 text-purple-900 dark:bg-purple-700 dark:text-purple-100 px-4 py-2 rounded-lg shadow-md text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-t border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... 💬"
              className="w-full bg-white dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/50 cursor-pointer"
              aria-label="Send message"
            >
              <SendHorizonal className="w-5 h-5 animate-pulse" />
              Send
            </button>
          </div>
        </div>
      </main>

      <div className="w-full">
        <div className="border-t-2 bg-purple-500 border-purple-200 rounded-full" />
      </div>

      <UserFooter />
    </>
  );
}
