"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { X, Loader2, Sparkles } from "lucide-react";
import { getSystemPrompt } from "@/src/lib/utils";

interface CreateMapModalProps {
  onClose: () => void;
  onMapCreated: (mapData: any) => void;
}

export function CreateMapModal({ onClose, onMapCreated }: CreateMapModalProps) {
  const [prompt, setPrompt] = useState("");
  const [complexityLevel, setComplexityLevel] = useState("moderate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    "World War II and its global impact",
    "The Renaissance period in Europe",
    "Climate change and environmental science",
    "Artificial Intelligence and Machine Learning",
    "The Roman Empire",
    "Quantum Physics fundamentals",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const systemPrompt = getSystemPrompt(complexityLevel);
      const response = await puter.ai.chat(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a concept map for: ${prompt}` },
        ],
        // { model: "x-ai/grok-3-beta" }
      );

      const content = response?.message?.content;
    
      if (!content) {
        throw new Error("No response content from model.");
      }

      const parsed = JSON.parse(content);
      onMapCreated(parsed);
    } catch (err: any) {
      console.error("Error during Puter response handling:", err);

      const message =
        err instanceof Error
          ? err.message
          : err?.error?.message ?? "An unknown error occurred";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-surface">
          <div className="flex justify-between items-center">
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Create New Concept Map
            </h2>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-semibold text-textPrimary mb-3"
            >
              What would you like to explore?
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter any topic: World War II, Climate Change, Artificial Intelligence, Ancient Rome..."
              className="w-full p-4 border-2 border-surface focus:border-primary-300 rounded-xl text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <div className="text-sm font-medium text-textSecondary mb-3">
              Quick suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="px-3 py-2 text-sm bg-surface hover:bg-surface/80 border border-surface hover:border-primary-200 rounded-full text-textSecondary hover:text-primary-700 transition-all duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-textPrimary mb-3">
              Map Detail Level
            </div>
            <RadioGroup
              value={complexityLevel}
              onValueChange={setComplexityLevel}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="modal-minimal" />
                <Label
                  htmlFor="modal-minimal"
                  className="cursor-pointer font-medium"
                >
                  Essential
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="modal-moderate" />
                <Label
                  htmlFor="modal-moderate"
                  className="cursor-pointer font-medium"
                >
                  Balanced
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="thorough" id="modal-thorough" />
                <Label
                  htmlFor="modal-thorough"
                  className="cursor-pointer font-medium"
                >
                  Comprehensive
                </Label>
              </div>
            </RadioGroup>
            <div className="text-xs text-textSecondary mt-2">
              {complexityLevel === "minimal" &&
                "Focus on the most important elements and core relationships."}
              {complexityLevel === "moderate" &&
                "Balanced coverage with key elements and meaningful connections."}
              {complexityLevel === "thorough" &&
                "Detailed exploration with comprehensive coverage and nuanced relationships."}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Map...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Map
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
