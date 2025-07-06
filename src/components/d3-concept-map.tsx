"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as d3 from "d3"
import { MapControls } from "./map-controls"
import { NodeDetailPanel } from "./node-detail-panel"
import { X, Layers } from "lucide-react"

interface D3ConceptMapProps {
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
      period?: string
      location?: string
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
    geography?: string[]
    keyThemes?: string[]
  }
  initialComplexity?: string
}

export function D3ConceptMap({ data, initialComplexity = "moderate" }: D3ConceptMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDisciplines, setFilteredDisciplines] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [complexity, setComplexity] = useState(initialComplexity)
  const [zoomLevel, setZoomLevel] = useState(1)

  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const svgSelectionRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)
  const zoomRef = useRef<{ zoomIn: () => void; zoomOut: () => void; fitView: () => void } | null>(null)

  // Filter nodes based on complexity
  const filteredNodes = useMemo(() => {
    if (!data?.nodes) return []

    if (complexity === "thorough") return data.nodes
    if (complexity === "minimal") return data.nodes.filter((node) => (node.importance || 0) >= 7)
    return data.nodes.filter((node) => (node.importance || 0) >= 5)
  }, [data?.nodes, complexity])

  // Filter edges based on complexity and visible nodes
  const filteredEdges = useMemo(() => {
    if (!data?.edges) return []

    const visibleNodeIds = new Set(filteredNodes.map((node) => node.id))
    let edges = data.edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))

    if (complexity === "minimal") {
      edges = edges.filter(
        (edge) => (edge.strength || 0) >= 4 || edge.type === "builds_upon" || edge.type === "part_of",
      )
    } else if (complexity === "moderate") {
      edges = edges.filter((edge) => (edge.strength || 0) >= 2)
    }

    return edges
  }, [data?.edges, filteredNodes, complexity])

  // Apply search and discipline filters
  const finalFilteredNodes = useMemo(() => {
    let filtered = filteredNodes

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (node) =>
          node.label?.toLowerCase().includes(searchLower) ||
          node.description?.toLowerCase().includes(searchLower) ||
          node.location?.toLowerCase().includes(searchLower) ||
          node.period?.toLowerCase().includes(searchLower),
      )
    }

    if (filteredDisciplines.length > 0) {
      filtered = filtered.filter((node) => filteredDisciplines.includes(node.discipline || ""))
    }

    return filtered
  }, [filteredNodes, searchTerm, filteredDisciplines])

  // Filter edges to only include those between visible nodes
  const finalFilteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(finalFilteredNodes.map((node) => node.id))
    return filteredEdges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
  }, [filteredEdges, finalFilteredNodes])

  // Find related nodes and edges for the selected node
  const relatedNodesAndEdges = useMemo(() => {
    if (!selectedNode || !data?.edges) return { nodes: [], edges: [] }

    const relatedEdges = data.edges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
    const relatedNodeIds = new Set<string>()
    relatedEdges.forEach((edge) => {
      relatedNodeIds.add(edge.source)
      relatedNodeIds.add(edge.target)
    })

    const relatedNodes = (data.nodes || []).filter((node) => relatedNodeIds.has(node.id))

    return {
      nodes: relatedNodes,
      edges: relatedEdges,
    }
  }, [selectedNode, data])

  const onZoomChange = useCallback((zoom: number) => {
    setZoomLevel(zoom)
  }, [])

  // Get node styles based on type
  const getNodeStyles = (type: string) => {
    switch (type) {
      case "person":
        return {
          background: "#F6F5EF",
          border: "2px solid #2D3A8C",
          iconBg: "#2D3A8C",
          textColor: "#2D3A8C",
          icon: "👤",
        }
      case "concept":
        return {
          background: "white",
          border: "2px solid #4D4D4D",
          iconBg: "#4D4D4D",
          textColor: "#1A1A1A",
          icon: "💡",
        }
      case "event":
        return {
          background: "white",
          border: "4px solid #F4C95D",
          borderStyle: "border-left",
          iconBg: "#F4C95D",
          textColor: "#1A1A1A",
          icon: "📅",
        }
      case "theory":
        return {
          background: "white",
          border: "2px solid #2D3A8C",
          iconBg: "#2D3A8C",
          textColor: "#2D3A8C",
          icon: "🧠",
        }
      case "work":
        return {
          background: "white",
          border: "4px solid #2D3A8C",
          borderStyle: "border-left",
          iconBg: "#2D3A8C",
          textColor: "#2D3A8C",
          icon: "📚",
        }
      case "movement":
        return {
          background: "#F6F5EF",
          border: "2px solid #F4C95D",
          iconBg: "#F4C95D",
          textColor: "#1A1A1A",
          icon: "👥",
        }
      case "place":
        return {
          background: "#E8F5E8",
          border: "2px solid #4CAF50",
          iconBg: "#4CAF50",
          textColor: "#1A1A1A",
          icon: "🌍",
        }
      case "organization":
        return {
          background: "#FFF3E0",
          border: "2px solid #FF9800",
          iconBg: "#FF9800",
          textColor: "#1A1A1A",
          icon: "🏢",
        }
      case "technology":
        return {
          background: "#E3F2FD",
          border: "2px solid #2196F3",
          iconBg: "#2196F3",
          textColor: "#1A1A1A",
          icon: "⚙️",
        }
      case "discovery":
      case "invention":
        return {
          background: "#F3E5F5",
          border: "2px solid #9C27B0",
          iconBg: "#9C27B0",
          textColor: "#1A1A1A",
          icon: "🔬",
        }
      case "method":
      case "technique":
      case "process":
        return {
          background: "#E0F2F1",
          border: "2px solid #009688",
          iconBg: "#009688",
          textColor: "#1A1A1A",
          icon: "🔧",
        }
      case "principle":
      case "law":
      case "phenomenon":
        return {
          background: "#FFF8E1",
          border: "2px solid #FFC107",
          iconBg: "#FFC107",
          textColor: "#1A1A1A",
          icon: "⚡",
        }
      case "system":
      case "structure":
        return {
          background: "#EFEBE9",
          border: "2px solid #795548",
          iconBg: "#795548",
          textColor: "#1A1A1A",
          icon: "🏗️",
        }
      case "resource":
      case "tool":
        return {
          background: "#E8EAF6",
          border: "2px solid #3F51B5",
          iconBg: "#3F51B5",
          textColor: "#1A1A1A",
          icon: "🛠️",
        }
      case "culture":
      case "tradition":
      case "practice":
        return {
          background: "#FCE4EC",
          border: "2px solid #E91E63",
          iconBg: "#E91E63",
          textColor: "#1A1A1A",
          icon: "🎭",
        }
      case "ideology":
      case "belief":
      case "value":
        return {
          background: "#F1F8E9",
          border: "2px solid #8BC34A",
          iconBg: "#8BC34A",
          textColor: "#1A1A1A",
          icon: "💭",
        }
      default:
        return {
          background: "white",
          border: "2px solid #4D4D4D",
          iconBg: "#4D4D4D",
          textColor: "#1A1A1A",
          icon: "⚪",
        }
    }
  }

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !finalFilteredNodes.length) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)

    // Clear previous content
    svg.selectAll("*").remove()

    // Get container dimensions
    const rect = container.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Set SVG dimensions
    svg.attr("width", width).attr("height", height)

    // Create main group for zoom/pan
    const g = svg.append("g")

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
        onZoomChange(event.transform.k)
      })

    svg.call(zoom)

    svgSelectionRef.current = svg
    zoomBehaviorRef.current = zoom

    zoomRef.current = {
      zoomIn: () => svg.transition().duration(250).call(zoom.scaleBy, 1.2),
      zoomOut: () => svg.transition().duration(250).call(zoom.scaleBy, 0.8),
      fitView: () => {
        const bounds = g.node()?.getBBox()
        if (!bounds) return
        const fullWidth = width
        const fullHeight = height
        const scale = Math.min(fullWidth / bounds.width, fullHeight / bounds.height) * 0.7
        const centerX = fullWidth / 2
        const centerY = fullHeight / 2
        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(centerX, centerY)
              .scale(scale)
              .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2),
          )
      },
    }

    // Prepare data for simulation
    const nodes = finalFilteredNodes.map((node) => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 400,
      y: height / 2 + (Math.random() - 0.5) * 400,
    }))

    const links = finalFilteredEdges.map((edge) => ({
      ...edge,
      source: edge.source,
      target: edge.target,
    }))

    // Create force simulation with better spacing
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // Adjust distances based on relationship type
            const baseDistance = 300
            switch (d.type) {
              case "part_of":
              case "contains":
                return baseDistance * 0.7
              case "builds_upon":
              case "evolves_from":
                return baseDistance * 0.9
              case "influences":
              case "causes":
              case "leads_to":
                return baseDistance * 1.2
              case "similar_to":
              case "competes_with":
                return baseDistance * 1.0
              case "located_in":
              case "occurs_in":
                return baseDistance * 0.8
              default:
                return baseDistance
            }
          })
          .strength(0.3),
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d: any) => {
          const baseStrength = -2000
          return baseStrength * (1 + (d.importance || 5) / 10)
        }),
      )
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d: any) => {
            const baseRadius = 120
            return baseRadius + (d.importance || 5) * 8
          })
          .strength(1.0),
      )
      .force("radial", d3.forceRadial(200, width / 2, height / 2).strength(0.02))
      .force("x", d3.forceX(width / 2).strength(0.02))
      .force("y", d3.forceY(height / 2).strength(0.02))

    // Create links group
    const linkGroup = g.append("g").attr("class", "links")

    // Create links with different colors based on relationship type
    const link = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        switch (d.type) {
          case "influences":
          case "builds_upon":
          case "evolves_from":
            return "#2D3A8C"
          case "critiques":
          case "contradicts":
          case "opposes":
            return "#E63946"
          case "causes":
          case "leads_to":
          case "results_in":
            return "#FF6B35"
          case "part_of":
          case "contains":
          case "located_in":
            return "#4D4D4D"
          case "similar_to":
          case "competes_with":
            return "#9C27B0"
          case "collaborates_with":
          case "supports":
            return "#4CAF50"
          case "created_by":
          case "discovered_by":
          case "invented_by":
            return "#FF9800"
          default:
            return "#999"
        }
      })
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d: any) => 1 + (d.strength || 1) * 0.3)
      .attr("stroke-dasharray", (d: any) => {
        return d.type === "critiques" || d.type === "similar_to" || d.type === "different_from" ? "5,5" : "none"
      })

    // Create link labels (only show for important connections)
    const linkLabels = g
      .append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(links.filter((d: any) => (d.strength || 0) >= 4))
      .enter()
      .append("text")
      .attr("font-size", "9px")
      .attr("font-family", "Inter, sans-serif")
      .attr("fill", "#666")
      .attr("text-anchor", "middle")
      .attr("dy", -2)
      .style("pointer-events", "none")
      .style("opacity", 0.7)
      .text((d: any) => d.label)

    // Create nodes group
    const nodeGroup = g.append("g").attr("class", "nodes")

    // Create nodes using foreignObject to embed HTML
    const node = nodeGroup
      .selectAll("foreignObject")
      .data(nodes)
      .enter()
      .append("foreignObject")
      .attr("width", (d: any) => Math.max(160, 160 + d.importance * 8))
      .attr("height", 100)
      .style("overflow", "visible")
      .html((d: any) => {
        const width = Math.max(160, 160 + d.importance * 8)
        const isSelected = selectedNode?.id === d.id
        const styles = getNodeStyles(d.type)
        const selectedClass = isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""

        return `
          <div class="concept-node ${selectedClass}" style="
            width: ${width}px;
            min-height: 80px;
            background: ${styles.background};
            border: ${styles.border};
            ${styles.borderStyle === "border-left" ? "border-left: 4px solid " + styles.iconBg + "; border-top: 1px solid #E0E1E6; border-right: 1px solid #E0E1E6; border-bottom: 1px solid #E0E1E6;" : ""}
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.2s;
            cursor: pointer;
            font-family: Inter, sans-serif;
          ">
            <div style="display: flex; align-items: flex-start; gap: 8px; height: 100%;">
              ${
                d.type === "concept"
                  ? ""
                  : `<div style="
                background: ${styles.iconBg};
                border-radius: 50%;
                padding: 4px;
                flex-shrink: 0;
                margin-top: 2px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
              ">${styles.icon}</div>`
              }
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <h3 style="
                    font-family: 'DM Serif Display', serif;
                    color: ${styles.textColor};
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 1.2;
                    margin: 0;
                    ${d.type === "work" ? "font-style: italic;" : ""}
                  ">${d.label}</h3>
                  ${d.year ? `<span style="font-size: 10px; color: #4D4D4D; margin-left: 4px; flex-shrink: 0;">${d.year}</span>` : ""}
                </div>
                <p style="
                  font-size: 10px;
                  color: #4D4D4D;
                  line-height: 1.4;
                  margin: 0;
                ">${d.description}</p>
                ${d.location ? `<div style="font-size: 9px; color: #666; margin-top: 2px;">📍 ${d.location}</div>` : ""}
                ${d.period ? `<div style="font-size: 9px; color: #666; margin-top: 2px;">⏰ ${d.period}</div>` : ""}
              </div>
            </div>
          </div>
        `
      })
      .on("click", (event, d: any) => {
        event.stopPropagation()
        setSelectedNode(d)
      })
      .on("mouseover", (event, d: any) => {
        // Highlight connected edges and nodes
        link
          .attr("stroke-opacity", (linkData: any) =>
            linkData.source.id === d.id || linkData.target.id === d.id ? 0.8 : 0.1,
          )
          .attr("stroke-width", (linkData: any) =>
            linkData.source.id === d.id || linkData.target.id === d.id
              ? (1 + (linkData.strength || 1) * 0.3) * 2
              : 1 + (linkData.strength || 1) * 0.3,
          )

        node.style("opacity", (nodeData: any) => {
          if (nodeData.id === d.id) return 1
          const isConnected = links.some(
            (link: any) =>
              (link.source.id === d.id && link.target.id === nodeData.id) ||
              (link.target.id === d.id && link.source.id === nodeData.id),
          )
          return isConnected ? 1 : 0.3
        })
      })
      .on("mouseout", (event, d: any) => {
        link.attr("stroke-opacity", 0.4).attr("stroke-width", (linkData: any) => 1 + (linkData.strength || 1) * 0.3)
        node.style("opacity", 1)
      })
      .call(
        d3
          .drag<SVGForeignObjectElement, any>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2)

      node.attr("x", (d: any) => d.x - 80).attr("y", (d: any) => d.y - 40)
    })

    // Click outside to deselect
    svg.on("click", (event) => {
      if (event.target === svg.node()) {
        setSelectedNode(null)
      }
    })

    // Initial zoom to fit after simulation settles
    setTimeout(() => {
      zoomRef.current?.fitView()
    }, 2000)

    return () => {
      simulation.stop()
    }
  }, [finalFilteredNodes, finalFilteredEdges, onZoomChange, selectedNode])

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Summary Panel */}
      {/* <div className="absolute top-4 left-4 bg-white p-4 rounded-card shadow-card max-w-sm z-10">
        <h3 className="font-heading text-lg text-primary mb-2">Summary</h3>
        <p className="text-sm text-textSecondary leading-relaxed">{data.summary}</p>
        {data.timespan && (
          <div className="mt-3 text-xs text-textSecondary">
            <span className="font-medium">Timespan:</span> {data.timespan.start} - {data.timespan.end}
          </div>
        )}
        {data.geography && data.geography.length > 0 && (
          <div className="mt-2 text-xs text-textSecondary">
            <span className="font-medium">Geography:</span> {data.geography.join(", ")}
          </div>
        )}
        <div className="mt-2 text-xs text-textSecondary">
          <span className="font-medium">Fields:</span> {data.disciplines?.join(", ")}
        </div>
        {data.keyThemes && data.keyThemes.length > 0 && (
          <div className="mt-2 text-xs text-textSecondary">
            <span className="font-medium">Key Themes:</span> {data.keyThemes.join(", ")}
          </div>
        )}
      </div> */}

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 z-10">
        <MapControls
          disciplines={data.disciplines || []}
          filteredDisciplines={filteredDisciplines}
          setFilteredDisciplines={setFilteredDisciplines}
          zoomLevel={zoomLevel}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          complexity={complexity}
          setComplexity={setComplexity}
          onZoomIn={() => zoomRef.current?.zoomIn()}
          onZoomOut={() => zoomRef.current?.zoomOut()}
          onFitView={() => zoomRef.current?.fitView()}
        />
      </div>

      {/* Enhanced Legend Panel */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-card shadow-card z-10 max-h-80 overflow-y-auto">
        <h4 className="font-medium text-textPrimary text-sm mb-2">Node Types</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded border"></div>
            <span>Person</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-textSecondary rounded border"></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-accent rounded border"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded border"></div>
            <span>Place</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded border"></div>
            <span>Organization</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded border"></div>
            <span>Technology</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded border"></div>
            <span>Discovery</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-teal-500 rounded border"></div>
            <span>Method</span>
          </div>
        </div>
        <div className="mt-3">
          <h5 className="font-medium text-textPrimary text-xs mb-1">Relationships</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-primary"></div>
              <span>Influences/Builds Upon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span>Critiques/Opposes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-orange-500"></div>
              <span>Causes/Leads To</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-textSecondary"></div>
              <span>Part Of/Contains</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500"></div>
              <span>Supports/Collaborates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {(searchTerm || filteredDisciplines.length > 0 || complexity !== "thorough") && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-card shadow-card z-10">
          <div className="text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>
                Complexity: <span className="font-medium text-primary capitalize">{complexity}</span>
              </span>
            </div>
            <div className="mt-1">
              Showing <span className="font-medium text-primary">{finalFilteredNodes.length}</span> of{" "}
              <span className="font-medium">{data.nodes?.length || 0}</span> nodes
            </div>
            <div className="mt-1">
              <span className="font-medium text-primary">{finalFilteredEdges.length}</span> relationships
            </div>
            {searchTerm && (
              <div className="mt-1">
                Search: "<span className="font-medium text-primary">{searchTerm}</span>"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Node Detail Panel */}
      {selectedNode && (
        <div className="absolute top-0 right-0 bg-white rounded-l-card shadow-card h-full max-w-md overflow-y-auto z-20 w-80">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-heading text-xl text-primary">{selectedNode.label}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full hover:bg-surface text-textSecondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NodeDetailPanel
              node={selectedNode}
              relatedNodes={relatedNodesAndEdges.nodes}
              relatedEdges={relatedNodesAndEdges.edges}
            />
          </div>
        </div>
      )}

      {/* SVG Container */}
      <svg ref={svgRef} className="w-full h-full bg-background" />
    </div>
  )
}
