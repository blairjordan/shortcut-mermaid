import { Story, WorkflowState } from "./types/api"

export const generateChart = ({
  stories,
  states,
}: {
  stories: Story[]
  states: WorkflowState[]
}) => {
  const stateMap = new Map<number, string>()

  states.forEach((state) => {
    stateMap.set(state.id, state.name.toLowerCase().replace(/\s+/g, "_"))
  })

  const classes = states
    .map(
      (state) =>
        `classDef ${state.name.toLowerCase().replace(/\s+/g, "_")} fill:${state.color},stroke:#000,stroke-width:2px`,
    )
    .join("\n    ")

  const generateNodeLabel = (story: any) => {
    const className = stateMap.get(story.workflow_state_id) || "default"
    return `${story.id}["${story.name}"]:::${className}`
  }

  const nodes = stories.map(generateNodeLabel).join("\n    ")
  const linkSet = new Set<string>()

  stories.forEach((story: Story) => {
    story.story_links.forEach((link: any) => {
      const linkStr =
        link.verb === "blocks"
          ? `${link.subject_id} --> ${link.object_id}`
          : `${link.object_id} --> ${link.subject_id}`
      linkSet.add(linkStr)
    })
  })

  const links = Array.from(linkSet).join("\n    ")

  const mermaidChart = `\`\`\`mermaid
  flowchart LR
    ${classes}
    ${nodes}
    ${links}
  \`\`\`
`

  return mermaidChart
}
