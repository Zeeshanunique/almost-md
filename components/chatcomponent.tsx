import React, { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2, TextSearch } from "lucide-react";
import { Badge } from "./ui/badge";
import Messages from "./messages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Markdown from "./markdown";
import MedicalSupplementDialog from "./MedicalSupplementDialog";

// Props type
type Props = {
  reportData?: string;
};

// Predefined questions array
const predefinedQuestions = [
  "Is my report normal?",
  "What are possible diseases?",
  "What are the symptoms?",
  "What are the treatments?",
  "What are the precautions?",
  "What are the causes?"
];

// Supplement type
type Supplement = {
  id: number;
  name: string;
  description: string;
  image: string;
  badges: string[];
  price: number;
  reviewCount: number;
  averageRating: number;
  ingredients: string[];
  benefits: string[];
  dosage: string;
};

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

// Supplements data
const supplements: Supplement[] = [
  {
    id: 1,
    name: "Vitamin D3",
    description: "5000 IU Daily Supplement for Optimal Health",
    image: "/images/Vitamin_d.jpg",
    badges: ["Bone Health", "Immune Support"],
    price: 199,
    reviewCount: 245,
    averageRating: 4,
    ingredients: [
      "Vitamin D3 (Cholecalciferol)",
      "Olive Oil",
      "Gelatin",
      "Glycerin"
    ],
    benefits: [
      "Supports bone health",
      "Boosts immune system",
      "Improves mood",
      "Enhances calcium absorption"
    ],
    dosage: "1 softgel daily"
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil",
    description: "1000mg High Potency DHA/EPA Supplement",
    image: "/images/Omega_3.jpg",
    badges: ["Heart Health", "Brain Function"],
    price: 256,
    reviewCount: 189,
    averageRating: 4,
    ingredients: [
      "Omega-3 Fish Oil Concentrate",
      "Natural Lemon Flavor",
      "Gelatin",
      "Glycerin"
    ],
    benefits: [
      "Supports heart health",
      "Enhances brain function",
      "Reduces inflammation",
      "Supports joint health"
    ],
    dosage: "1-2 softgels daily"
  },
  {
    id: 3,
    name: "Probiotics",
    description: "50 Billion CFU Advanced Digestive Support",
    image: "/images/probiotics.jpg",
    badges: ["Gut Health", "Immune Support"],
    price: 399,
    reviewCount: 312,
    averageRating: 4,
    ingredients: [
      "Lactobacillus Acidophilus",
      "Bifidobacterium Longum",
      "Streptococcus Thermophilus",
      "Prebiotic Fiber"
    ],
    benefits: [
      "Supports digestive health",
      "Boosts immune system",
      "Balances gut microbiome",
      "Reduces bloating"
    ],
    dosage: "1 capsule daily"
  }
];

const MedicalSupplementCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  const handleSupplementClick = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {supplements.map((supplement) => (
          <div
            key={supplement.id}
            onClick={() => handleSupplementClick(supplement)}
            className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 relative mb-3">
                <img
                  src={supplement.image}
                  alt={`${supplement.name} Supplement`}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{supplement.name}</h3>
                <p className="text-sm text-gray-600">{supplement.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {supplement.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-2 font-bold text-green-600">
                ₹{supplement.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MedicalSupplementDialog 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedSupplement={selectedSupplement}
      />
    </>
  );
};

const ChatComponent: React.FC<Props> = ({ reportData }) => {
  const [showSupplements, setShowSupplements] = useState(false);
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    data 
  } = useChat({
    api: "api/medichatgemini",
  });

  // Update showSupplements when messages change
  useEffect(() => {
    if (messages.length >= 2) { 
      setShowSupplements(true);
    }
  }, [messages]);

  // Handle predefined question click
  const handlePredefinedQuestionClick = (question: string) => {
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      {/* Show supplements only after first question */}
      {showSupplements && <MedicalSupplementCard />}
      
      {/* Badge for Report Status */}
      <Badge
        variant="outline"
        className={`absolute right-3 top-1.5 ${
          reportData ? "bg-[#00B612] text-white" : ""
        }`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>

      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Report Analysis Chat</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your report or select from predefined questions below.
        </p>
      </div>

      {/* Scrollable Message Container */}
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      {/* Predefined Questions and Accordion */}
      <div className="space-y-4">
        {data?.length && data.length > 0 && (
          <Accordion type="single" className="text-sm" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex flex-row items-center gap-2">
                  <TextSearch /> Relevant Info
                </span>
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                <Markdown
                  text={(data[data.length - 1] as any).retrievals as string}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <PredefinedQuestions onQuestionClick={handlePredefinedQuestionClick} />
      </div>

      {/* Input Form */}
      <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData ?? "",
            },
          });
        }}
      >
        {/* Text Area */}
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          {/* Submit Button */}
          <Button 
            disabled={isLoading || !input.trim()} 
            type="submit" 
            size="sm" 
            className="ml-auto"
          >
            {isLoading ? "Analysing..." : "3. Ask"}
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="size-3.5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;