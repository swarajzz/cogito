"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { ConceptMap } from "@/src/components/concept-map";
import {
  Loader2,
  Brain,
  Sparkles,
  Layers,
  Zap,
  Target,
  Globe,
} from "lucide-react";
import { sampleExistentialismMap } from "@/src/lib/sample-data";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import Script from "next/script";
import { getSystemPrompt } from "@/src/lib/utils";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState("moderate");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const systemPrompt = getSystemPrompt(complexityLevel)
      const response = await puter.ai.chat([
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a concept map for: ${prompt}` },
      ]);

      console.log(response)

      const content = response?.message?.content;
      if (!content) {
        throw new Error("No response content from model.");
      }

      const parsed = JSON.parse(content);

      setMapData(parsed);
      setShowExample(false);
    } catch (err) {
      console.error("Error during Puter response handling:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const loadExample = () => {
    setShowExample(true);
    setMapData(null);
  };

  const displayData = showExample ? sampleExistentialismMap : mapData;

  const examplePrompts = [
    "World War II and its global impact",
    "The Renaissance period in Europe",
    "Climate change and environmental science",
    "Artificial Intelligence and Machine Learning",
    "The Roman Empire",
    "Quantum Physics fundamentals",
    "The Industrial Revolution",
    "Ancient Greek Philosophy",
    "DNA and Genetic Engineering",
    "The Space Race and Moon Landing",
    "Blockchain and Cryptocurrency",
    "Evolution and Natural Selection",
    "The French Revolution",
    "Renewable Energy Technologies",
    "Ancient Egyptian Civilization",
  ];

  return (
    <>
      <Script src="https://js.puter.com/v2" />
      <main className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-surface/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Cogito
                  </h1>
                  <p className="text-xs text-textSecondary">
                    AI Knowledge Mapping
                  </p>
                </div>
              </div>
              <nav className="flex gap-3">
                <Button
                  variant="ghost"
                  className="text-textSecondary hover:text-textPrimary"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-textSecondary hover:text-textPrimary"
                >
                  My Maps
                </Button>
                <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                  Sign In
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {!displayData ? (
          /* Landing/Create Section */
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Powered by Advanced AI
              </div>
              <h2 className="font-heading text-5xl font-bold text-textPrimary mb-6 leading-tight">
                Transform Knowledge into
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block">
                  Interactive Maps
                </span>
              </h2>
              <p className="text-xl text-textSecondary mb-8 leading-relaxed">
                Explore any topic through AI-powered visual knowledge maps. From
                historical events to scientific breakthroughs, discover
                connections and insights like never before.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto animate-slide-up"
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-elevated border border-surface/50">
                <div className="mb-6">
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-semibold text-textPrimary mb-3"
                  >
                    What would you like to explore?
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter any topic: World War II, Climate Change, Artificial Intelligence, Ancient Rome..."
                    className="w-full p-4 border-2 border-surface focus:border-primary-300 rounded-xl text-base bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Example prompts */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-textSecondary mb-3">
                    Popular topics:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.slice(0, 6).map((example, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setPrompt(example)}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-surface to-surface/80 hover:from-primary-50 hover:to-primary-100 border border-surface hover:border-primary-200 rounded-full text-textSecondary hover:text-primary-700 transition-all duration-200"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-semibold text-textPrimary mb-3">
                    Map Detail Level
                  </div>
                  <RadioGroup
                    defaultValue="moderate"
                    value={complexityLevel}
                    onValueChange={setComplexityLevel}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="minimal"
                        id="minimal"
                        className="border-2"
                      />
                      <Label
                        htmlFor="minimal"
                        className="cursor-pointer font-medium"
                      >
                        Essential
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="moderate"
                        id="moderate"
                        className="border-2"
                      />
                      <Label
                        htmlFor="moderate"
                        className="cursor-pointer font-medium"
                      >
                        Balanced
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="thorough"
                        id="thorough"
                        className="border-2"
                      />
                      <Label
                        htmlFor="thorough"
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

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Creating Your Map...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Generate Knowledge Map
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadExample}
                    className="h-14 px-8 border-2 hover:bg-surface/50 transition-all duration-200 bg-transparent"
                  >
                    View Example
                  </Button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-slide-up">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Globe className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    Universal Knowledge
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    Explore any domain - from ancient history to cutting-edge
                    science, literature to technology
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Target className="h-8 w-8 text-accent-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    Smart Connections
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    AI discovers hidden relationships and patterns across
                    complex knowledge domains
                  </p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-success-100 to-success-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Layers className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
                    Adaptive Detail
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    Control complexity from simple overviews to comprehensive
                    deep-dive explorations
                  </p>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Map View Section */
          <div className="h-[calc(100vh-80px)]">
            <div className="bg-white/80 backdrop-blur-md border-b border-surface/50 px-4 py-4">
              <div className="container mx-auto flex justify-between items-center">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-textPrimary">
                    {showExample ? "Existentialism" : prompt}
                  </h2>
                  <p className="text-textSecondary">
                    {displayData.nodes?.length || 0} elements •{" "}
                    {displayData.edges?.length || 0} relationships
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMapData(null);
                    setShowExample(false);
                    setPrompt("");
                  }}
                  className="border-2 hover:bg-surface/50"
                >
                  Create New Map
                </Button>
              </div>
            </div>
            <ConceptMap
              data={displayData}
              initialComplexity={complexityLevel}
            />
          </div>
        )}
      </main>
    </>
  );
}
