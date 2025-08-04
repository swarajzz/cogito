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
          "title": "Title of the concept map",
          "description": "A short, engaging, one-sentence hook that draws interest to the topic",
          "summary": "A concise summary of the topic (max 150 words)",
          "node_count": "Number of nodes as a number",
          "edge_count": "Number of edges as a number",
          "nodes": [
            {
              "id": "unique_node_id_string",
              "label": "Node label/title",
              "type": "concept|person|event|theory|work|movement|place|organization|technology|discovery|invention|method|principle|law|phenomenon|process|system|structure|component|resource|tool|technique|practice|tradition|culture|ideology|belief|value",
              "description": "Short description of the node.",
              "importance": 1-10,
              "discipline": "Field of study (e.g., history, physics, biology, etc.)",
              "year": "Year as a string, e.g. '509 BC', '476 AD', '2000', or '4th century AD'",
              "period": "Named time period, e.g. 'Classical Antiquity'",
              "location": "Geographic location (city, region, or country)",
              "resources": [
                {
                  "title": "Resource title",
                  "url": "URL string"
                  "description": "Brief description of the resource"
                }
              ]
            }
          ],
          "edges": [
            {
              "id": "unique_edge_id_string",
              "source": "source_node_id",
              "target": "target_node_id", 
              "label": "Relationship label (e.g., 'influences', 'results in')",
              "type": "influences|critiques|builds_upon|contradicts|part_of|contains|precedes|follows|causes|results_in|similar_to|different_from|applies_to|used_by|created_by|discovered_by|invented_by|located_in|occurs_in|leads_to|prevents|enables|requires|supports|opposes|replaces|evolves_from|competes_with|collaborates_with|depends_on|implements|exemplifies|generalizes",
              "strength": 1-5
            }
          ],
          "disciplines": ["field1", "field2"],
          "timespan": {
            "start": "Start year as string (e.g., '509 BC')",
            "end": "End year as string (e.g., '476 AD')"
          },
          "geography": ["Relevant geographic locations such as countries, cities, or regions"],
          "tags": [
    "Short, general-purpose keywords for searching, filtering, or discovery, e.g., '19th century', 'feminism', 'Asia'"
  ],
          "keyThemes": [
    "Core ideas, philosophical topics, or concepts explored deeply in this map, e.g., 'liberty', 'empiricism', 'industrialization'"
  ]
        }
        
        ${getComplexityInstructions("thorough")}
        
        Be sure to follow these definitions strictly:
        - Return only **valid JSON**, no markdown, no explanation.
        - Use strings for all historical dates (e.g., '509 BC', '27 BC', '476 AD', '100').
        - Ensure all fields match the structure exactly.
      `.trim();
}
