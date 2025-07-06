"use client"

import { useState } from "react"
import { Textarea } from "@/src/components/ui/textarea"
import { ConceptMap } from "@/src/components/concept-map"
import { Loader2, Brain, Sparkles, Layers } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Label } from "@/src/components/ui/label"
import { Button } from "@/src/components/ui/button"
import { sampleExistentialismMap } from "@/src/lib/sample-data"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mapData, setMapData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [complexityLevel, setComplexityLevel] = useState("moderate")

  const generateMap = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, complexityLevel }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate concept map")
      }

      setMapData(data.data)
      setShowExample(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const loadExample = () => {
    setShowExample(true)
    setMapData(null)
  }

  const displayData = showExample ? sampleExistentialismMap : mapData

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="font-heading text-2xl text-primary">Cogito</h1>
            </div>
            <nav className="flex gap-4">
              <Button variant="ghost" className="text-textSecondary">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-textSecondary">
                My Maps
              </Button>
              <Button variant="outline">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {!displayData ? (
        /* Landing/Create Section */
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="font-heading text-4xl text-textPrimary mb-4">AI-Powered Concept Mapping</h2>
            <p className="text-lg text-textSecondary mb-8">
              Transform any topic into a visual knowledge map. Explore connections, understand relationships, and
              discover insights through interactive concept visualization.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-card shadow-card">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-textSecondary mb-2">
                  Enter a topic to explore
                </label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Nietzsche's Philosophy, Quantum Entanglement, History of Feminism, Machine Learning, Renaissance Art..."
                  className="w-full p-4 border border-surface rounded-md text-base"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium text-textSecondary mb-2">Map Complexity</div>
                <RadioGroup
                  defaultValue="moderate"
                  value={complexityLevel}
                  onValueChange={setComplexityLevel}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal" className="cursor-pointer">
                      Minimal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="cursor-pointer">
                      Moderate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thorough" id="thorough" />
                    <Label htmlFor="thorough" className="cursor-pointer">
                      Thorough
                    </Label>
                  </div>
                </RadioGroup>
                <div className="text-xs text-textSecondary mt-1">
                  {complexityLevel === "minimal" && "Shows only the most important concepts and relationships."}
                  {complexityLevel === "moderate" && "Balanced view with key concepts and meaningful relationships."}
                  {complexityLevel === "thorough" && "Comprehensive view with all relevant concepts and connections."}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateMap}
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Map...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Concept Map
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={loadExample} className="h-12 px-6">
                  View Example
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg text-textPrimary mb-2">AI-Powered</h3>
                <p className="text-sm text-textSecondary">
                  Advanced AI analyzes your topic and identifies key concepts and relationships
                </p>
              </div>
              <div className="text-center">
                <div className="bg-accent/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg text-textPrimary mb-2">Interactive</h3>
                <p className="text-sm text-textSecondary">
                  Explore, filter, and navigate through complex knowledge structures
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg text-textPrimary mb-2">Multi-Layered</h3>
                <p className="text-sm text-textSecondary">
                  Control complexity levels to focus on what matters most to your understanding
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Map View Section */
        <div className="h-[calc(100vh-80px)]">
          <div className="bg-white border-b border-surface px-4 py-3">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h2 className="font-heading text-xl text-textPrimary">{showExample ? "Existentialism" : prompt}</h2>
                <p className="text-sm text-textSecondary">
                  {displayData.nodes?.length || 0} concepts • {displayData.edges?.length || 0} relationships
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setMapData(null)
                  setShowExample(false)
                  setPrompt("")
                }}
              >
                Create New Map
              </Button>
            </div>
          </div>
          <ConceptMap data={displayData} initialComplexity={complexityLevel} />
        </div>
      )}
    </main>
  )
}
