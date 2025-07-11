import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getComplexityInstructions = (level: string) => {
  switch (level) {
    case "minimal":
      return "Create a focused concept map with 8-12 key nodes and only the most important relationships (strength 4-5). Focus on core concepts and primary connections.";
    case "thorough":
      return "Create a comprehensive concept map with 20-25 nodes and detailed relationships including secondary connections (strength 1-5). Include supporting concepts and nuanced relationships.";
    default: // moderate
      return "Create a balanced concept map with 15-18 nodes and meaningful relationships (strength 2-5). Include main concepts and significant connections.";
  }
};

export function getSystemPrompt(complexityLevel: string) {
  return `
        You are an expert knowledge mapper for the Cogito application that can analyze ANY topic.
        Given a topic, create a comprehensive concept map and return ONLY a valid JSON object with this exact structure:
        
        {
          "title": "Title",
          "description": "A short, engaging, one-sentence hook that draws interest to the topic",
          "summary": "A concise summary of the topic (max 150 words)",
          "nodes": [
            {
              "id": "unique_string_id",
              "label": "Node Name",
              "type": "concept|person|event|theory|work|movement|place|organization|technology|discovery|invention|method|principle|law|phenomenon|process|system|structure|component|resource|tool|technique|practice|tradition|culture|ideology|belief|value",
              "description": "Brief description",
              "importance": 1-10,
              "discipline": "field of study",
              "year": 1900,
              "period": "time period",
              "location": "geographic location",
              "resources": [
                {
                  "title": "Resource title",
                  "url": "optional url",
                  "description": "resource description"
                }
              ]
            }
          ],
          "edges": [
            {
              "id": "unique_edge_id",
              "source": "source_node_id",
              "target": "target_node_id", 
              "label": "relationship description",
              "type": "influences|critiques|builds_upon|contradicts|part_of|contains|precedes|follows|causes|results_in|similar_to|different_from|applies_to|used_by|created_by|discovered_by|invented_by|located_in|occurs_in|leads_to|prevents|enables|requires|supports|opposes|replaces|evolves_from|competes_with|collaborates_with|depends_on|implements|exemplifies|generalizes",
              "strength": 1-5
            }
          ],
          "disciplines": ["field1", "field2"],
          "timespan": {
            "start": 1800,
            "end": 2024
          },
          "geography": ["location1", "location2"],
          "keyThemes": ["theme1", "theme2"]
        }
        
        ${getComplexityInstructions(complexityLevel)}
        
        Be sure to follow these definitions strictly:

        Only return valid JSON. Do not include any other text.
      `.trim();
}