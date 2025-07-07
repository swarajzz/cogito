"use client"

import { D3ConceptMap } from "./d3-concept-map"

interface ConceptMapProps {
  data: {
    summary: string
    nodes: Array<{
      id: string
      label: string
      type: string
      description: string
      importance: number
      discipline?: string
      year?: number
      resources?: Array<{
        title: string
        url?: string
        description?: string
      }>
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      label: string
      type: string
      strength?: number
    }>
    disciplines: string[]
    timespan?: {
      start?: number
      end?: number
    }
  }
  initialComplexity?: string
}

export function ConceptMap(props: ConceptMapProps) {
  return <D3ConceptMap {...props} />
}
