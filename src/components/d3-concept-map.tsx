"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as d3 from "d3"
import { D3MapControls } from "./d3-map-controls"
import { X, Layers } from 'lucide-react'
import { NodeDetailPanel } from "./NodeDetailPanel"

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

// Convert flat data to hierarchical structure
const createHierarchicalData = (nodes: any[], edges: any[]) => {
  // Find the most connected node as root
  const connections: Record<string, number> = {}
  edges.forEach((edge) => {
    connections[edge.source] = (connections[edge.source] || 0) + 1
    connections[edge.target] = (connections[edge.target] || 0) + 1
  })


  const rootId = Object.entries(connections).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

  const rootNode = nodes.find((n) => n.id === rootId)

  if (!rootNode) return { id: "root", label: "Root", children: [] }

  // Build adjacency list
  const adjacencyList: Record<string, string[]> = {}
  edges.forEach((edge) => {
    if (!adjacencyList[edge.source]) adjacencyList[edge.source] = []
    if (!adjacencyList[edge.target]) adjacencyList[edge.target] = []
    adjacencyList[edge.source].push(edge.target)
    adjacencyList[edge.target].push(edge.source)
  })

  // Build tree using BFS
  const visited = new Set<string>()
  const queue = [{ node: rootNode, parent: null }]
  const nodeMap = new Map<string, any>()

  // Initialize root
  const root = {
    ...rootNode,
    children: [],
    depth: 0,
  }
  nodeMap.set(rootId, root)
  visited.add(rootId)

  while (queue.length > 0) {
    const { node: currentNode, parent } = queue.shift()!
    const currentHierarchyNode = nodeMap.get(currentNode.id)!

    // Add children
    const neighbors = adjacencyList[currentNode.id] || []
    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        const neighborNode = nodes.find((n) => n.id === neighborId)
        if (neighborNode) {
          const childNode = {
            ...neighborNode,
            children: [],
            depth: currentHierarchyNode.depth + 1,
          }
          currentHierarchyNode.children.push(childNode)
          nodeMap.set(neighborId, childNode)
          visited.add(neighborId)
          queue.push({ node: neighborNode, parent: currentNode })
        }
      }
    })
  }

  // Add orphaned nodes as children of root
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      root.children.push({
        ...node,
        children: [],
        depth: 1,
      })
    }
  })

  return root
}

// Node type colors
const getNodeColor = (type: string) => {
  const colors = {
    concept: "#4D4D4D",
    person: "#2D3A8C",
    event: "#F4C95D",
    theory: "#2D3A8C",
    work: "#2D3A8C",
    movement: "#F4C95D",
  }
  return colors[type as keyof typeof colors] || "#4D4D4D"
}

// Node size based on importance
const getNodeSize = (importance: number) => {
  return Math.max(8, 4 + importance * 2)
}

export function D3ConceptMap({ data, initialComplexity = "moderate" }: D3ConceptMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomBehavior = useRef<d3.ZoomBehavior<Element, unknown>>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDisciplines, setFilteredDisciplines] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [complexity, setComplexity] = useState(initialComplexity)
  const [zoomLevel, setZoomLevel] = useState(1)

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
          node.label?.toLowerCase().includes(searchLower) || node.description?.toLowerCase().includes(searchLower),
      )
    }

    if (filteredDisciplines.length > 0) {
      filtered = filtered.filter((node) => filteredDisciplines.includes(node.discipline || ""))
    }

    return filtered
  }, [filteredNodes, searchTerm, filteredDisciplines])

  // Create hierarchical data
  const hierarchicalData = useMemo(() => {
    return createHierarchicalData(finalFilteredNodes, filteredEdges)
  }, [finalFilteredNodes, filteredEdges])

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

  useEffect(() => {
    if (!svgRef.current || !hierarchicalData) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 1200
    const height = 800

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
        onZoomChange(event.transform.k)
      })

    svg.call(zoom)
    // zoomBehavior.current = zoom

    const container = svg.append("g")

    // Create hierarchy
    const root = d3.hierarchy(hierarchicalData)
    const links = root.links()
    const nodes = root.descendants()

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
          .strength(0.5),
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => getNodeSize(d.data.importance || 5) + 5),
      )

    // Create links
    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)

    // Create nodes
    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, any>()
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

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d: any) => getNodeSize(d.data.importance || 5))
      .attr("fill", (d: any) => getNodeColor(d.data.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d: any) => {
        event.stopPropagation()
        setSelectedNode(d.data)
      })
      .on("mouseover", function (event, d: any) {
        d3.select(this).attr("stroke", "#2D3A8C").attr("stroke-width", 3)

        // Show tooltip
        // const tooltip = d3
        //   .select("body")
        //   .append("div")
        //   .attr("class", "tooltip")
        //   .style("position", "absolute")
        //   .style("background", "rgba(0, 0, 0, 0.8)")
        //   .style("color", "white")
        //   .style("padding", "8px")
        //   .style("border-radius", "4px")
        //   .style("font-size", "12px")
        //   .style("pointer-events", "none")
        //   .style("z-index", "1000")
        //   .html(`<strong>${d.data.label}</strong><br/>${d.data.description}`)

        // tooltip
        //   .style("left", event.pageX + 10 + "px")
        //   .style("top", event.pageY - 10 + "px")
        //   .style("opacity", 1)
      })
      .on("mouseout", function (event, d: any) {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2)
        d3.selectAll(".tooltip").remove()
      })

    // Add labels to nodes
    node
      .append("text")
      .text((d: any) => d.data.label)
      .attr("font-size", "10px")
      .attr("font-family", "Inter, sans-serif")
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => getNodeSize(d.data.importance || 5) + 15)
      .attr("fill", "#333")
      .style("pointer-events", "none")

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Initial zoom to fit
    const bounds = container.node()?.getBBox()
    if (bounds) {
      const fullWidth = svg.node()?.clientWidth || width
      const fullHeight = svg.node()?.clientHeight || height
      const scale = Math.min(fullWidth / bounds.width, fullHeight / bounds.height) * 0.8
      const centerX = fullWidth / 2
      const centerY = fullHeight / 2

      svg
        .transition()
        .duration(750)
        // .call(
        //   zoom.transform,
        //   d3.zoomIdentity
        //     .translate(centerX, centerY)
        //     .scale(scale)
        //     .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2),
        // )
    }

    return () => {
      simulation.stop()
    }
  }, [hierarchicalData, onZoomChange])

  return (
    <div className="w-full h-full relative">
      {/* Summary Panel */}
      {/* <div className="absolute top-4 left-4 bg-white p-4 rounded-card shadow-card max-w-sm z-10">
        <h3 className="font-heading text-lg text-primary mb-2">Summary</h3>
        <p className="text-sm text-textSecondary leading-relaxed">{data.summary}</p>
        {data.timespan && (
          <div className="mt-3 text-xs text-textSecondary">
            <span className="font-medium">Timespan:</span> {data.timespan.start} - {data.timespan.end}
          </div>
        )}
        <div className="mt-3 text-xs text-textSecondary">
          <span className="font-medium">Disciplines:</span> {data.disciplines?.join(", ")}
        </div>
      </div> */}

      {/* Controls Panel */}
      {/* <div className="absolute top-4 right-4 z-10"> */}
        {/* <D3MapControls
          disciplines={data.disciplines || []}
          filteredDisciplines={filteredDisciplines}
          setFilteredDisciplines={setFilteredDisciplines}
          zoomLevel={zoomLevel}
          zoomIn={() => {
            if (svgRef.current && zoomBehavior.current)
              d3.select(svgRef.current).call(zoomBehavior.current.scaleBy as any, 1.2)
          }}
          zoomOut={() => {
            if (svgRef.current && zoomBehavior.current)
              d3.select(svgRef.current).call(zoomBehavior.current.scaleBy as any, 0.8)
          }}
          fitView={() => {
            // same logic as initial fit
            const svgEl = svgRef.current
            const g = svgEl?.querySelector("g")
            if (!svgEl || !g || !zoomBehavior.current) return
            const bounds = (g as SVGGElement).getBBox()
            const fullW = svgEl.clientWidth
            const fullH = svgEl.clientHeight
            const scale = Math.min(fullW / bounds.width, fullH / bounds.height) * 0.8
            const centerX = fullW / 2
            const centerY = fullH / 2
            d3.select(svgEl)
              .transition()
              .duration(600)
              .call(
                zoomBehavior.current.transform as any,
                d3.zoomIdentity
                  .translate(centerX, centerY)
                  .scale(scale)
                  .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2),
              )
          }}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          complexity={complexity}
          setComplexity={setComplexity}
        /> */}
      {/* </div> */}

      {/* Legend Panel */}
      <div className="absolute bottom-20 right-4 bg-white p-3 rounded-card shadow-card z-10">
        <h4 className="font-medium text-textPrimary text-sm mb-2">Node Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Person</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-textSecondary rounded-full"></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Theory/Work</span>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {(searchTerm || filteredDisciplines.length > 0 || complexity !== "thorough") && (
        <div className="absolute bottom-20 left-4 bg-white p-3 rounded-card shadow-card z-10">
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
      <svg ref={svgRef} className="w-full h-full bg-background" viewBox="0 0 1200 800" />
    </div>
  )
}
