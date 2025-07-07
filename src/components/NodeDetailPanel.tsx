import { ExternalLink, BookOpen, ArrowRight, MapPin, Clock } from "lucide-react"

interface NodeDetailPanelProps {
  node: {
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
  }
  relatedNodes: any[]
  relatedEdges: any[]
}

export function NodeDetailPanel({ node, relatedNodes, relatedEdges }: NodeDetailPanelProps) {
  // Group relationships by incoming and outgoing
  const incomingRelationships = relatedEdges.filter((edge) => edge.target === node.id)
  const outgoingRelationships = relatedEdges.filter((edge) => edge.source === node.id)

  // Get node by ID helper
  const getNodeById = (id: string) => {
    return relatedNodes.find((n) => n.id === id)
  }

  return (
    <div className="space-y-4">
      {/* Node Type & Metadata */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="px-2 py-1 bg-surface rounded-md text-xs font-medium capitalize">{node.type}</div>
          {node.year && <div className="text-sm text-textSecondary">{node.year}</div>}
        </div>

        {node.location && (
          <div className="flex items-center gap-1 text-xs text-textSecondary">
            <MapPin className="h-3 w-3" />
            <span>{node.location}</span>
          </div>
        )}

        {node.period && (
          <div className="flex items-center gap-1 text-xs text-textSecondary">
            <Clock className="h-3 w-3" />
            <span>{node.period}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-textPrimary mb-1">Description</h4>
        <p className="text-sm text-textSecondary leading-relaxed">{node.description}</p>
      </div>

      {/* Discipline */}
      {node.discipline && (
        <div>
          <h4 className="text-sm font-medium text-textPrimary mb-1">Field</h4>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs inline-block">{node.discipline}</div>
        </div>
      )}

      {/* Importance */}
      <div>
        <h4 className="text-sm font-medium text-textPrimary mb-1">Importance</h4>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(node.importance / 10) * 100}%` }}></div>
        </div>
        <div className="text-xs text-textSecondary mt-1">
          {node.importance}/10 -{" "}
          {node.importance >= 8
            ? "Critical element"
            : node.importance >= 6
              ? "Major element"
              : node.importance >= 4
                ? "Significant element"
                : "Supporting element"}
        </div>
      </div>

      {/* Relationships */}
      <div>
        <h4 className="text-sm font-medium text-textPrimary mb-2">Relationships</h4>

        {/* Incoming Relationships */}
        {incomingRelationships.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-medium text-textSecondary mb-1">Influenced by</h5>
            <ul className="space-y-1">
              {incomingRelationships.map((edge) => {
                const sourceNode = getNodeById(edge.source)
                return (
                  <li key={edge.id} className="flex items-center text-xs">
                    <span className="text-textPrimary font-medium">{sourceNode?.label}</span>
                    <ArrowRight className="h-3 w-3 mx-1 text-textSecondary" />
                    <span className="text-textSecondary italic">{edge.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Outgoing Relationships */}
        {outgoingRelationships.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-textSecondary mb-1">Influences</h5>
            <ul className="space-y-1">
              {outgoingRelationships.map((edge) => {
                const targetNode = getNodeById(edge.target)
                return (
                  <li key={edge.id} className="flex items-center text-xs">
                    <span className="text-textSecondary italic">{edge.label}</span>
                    <ArrowRight className="h-3 w-3 mx-1 text-textSecondary" />
                    <span className="text-textPrimary font-medium">{targetNode?.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {incomingRelationships.length === 0 && outgoingRelationships.length === 0 && (
          <p className="text-xs text-textSecondary">No direct relationships found.</p>
        )}
      </div>

      {/* Resources */}
      {node.resources && node.resources.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-textPrimary mb-2">Additional Resources</h4>
          <ul className="space-y-2">
            {node.resources.map((resource, index) => (
              <li key={index} className="text-xs">
                <div className="flex items-start">
                  <BookOpen className="h-3 w-3 text-primary mt-0.5 mr-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-textPrimary">{resource.title}</div>
                    {resource.description && <p className="text-textSecondary mt-0.5">{resource.description}</p>}
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center mt-1 hover:underline"
                      >
                        View resource <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
