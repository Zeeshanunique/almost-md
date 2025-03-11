import React, { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import Messages from "./messages";

// Props type
type Props = {
  reportData?: string;
};

// Predefined questions array
const predefinedQuestions = [
  "What are my legal rights in this situation?",
  "What legal actions can I take?",
  "What documents do I need?",
  "What is the legal procedure?",
  "What are the potential outcomes?",
  "How long will this process take?"
];

// Predefined Questions Component
const PredefinedQuestions = ({
  onQuestionClick,
}: {
  onQuestionClick: (q: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {predefinedQuestions.map((question, index) => (
      <button
        key={index}
        onClick={() => onQuestionClick(question)}
        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
      >
        {question}
      </button>
    ))}
  </div>
);

const ChatComponent: React.FC<Props> = ({ reportData }) => {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "system",
        content: "I am a legal assistant. I can help you understand legal matters and procedures. While I provide general legal information, please note that this is not legal advice, and you should consult with a qualified lawyer for specific legal advice."
      }
    ]
  });

  // Handle predefined question click
  const handlePredefinedQuestionClick = (question: string) => {
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      {/* Badge for Document Status */}
      <Badge
        variant="outline"
        className={`absolute right-3 top-1.5 ${
          reportData ? "bg-[#00B612] text-white" : ""
        }`}
      >
        {reportData ? "✓ Document Added" : "No Document Added"}
      </Badge>

      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Legal Consultation</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your legal situation or select from common legal queries below.
        </p>
      </div>

      {/* Predefined Questions */}
      <PredefinedQuestions onQuestionClick={handlePredefinedQuestionClick} />

      {/* Scrollable Message Container */}
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your legal question..."
          className="min-h-[60px] w-full resize-none rounded-xl"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input}
          className="h-[60px] w-[60px] shrink-0 rounded-xl bg-[#D90013] text-white hover:bg-[#B80011]"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <CornerDownLeft className="h-6 w-6" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;