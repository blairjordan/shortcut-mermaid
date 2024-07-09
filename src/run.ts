import dotenv from "dotenv"
import fs from "fs"
import path from "path"

import { generateChart } from "./chart"
import { fetchStories } from "./stories"
import { ShortcutApi } from "./shortcut-api"
import { Story, EpicSlim } from "./types/api"

dotenv.config()

if (
  !(
    process.env.SHORTCUT_BASE_URL &&
    process.env.SHORTCUT_API_TOKEN &&
    process.env.CHART_FOLDER_PATH &&
    process.env.WORKFLOW_ID &&
    process.env.UPDATE_EPIC_DESCRIPTION &&
    process.env.WRITE_CHART_MARKDOWN
  )
) {
  throw new Error(
    "required env: SHORTCUT_BASE_URL, SHORTCUT_API_TOKEN, CHART_FOLDER_PATH, WORKFLOW_ID, UPDATE_EPIC_DESCRIPTION, WRITE_CHART_MARKDOWN",
  )
}

const shortcutApi = ShortcutApi({
  baseUrl: process.env.SHORTCUT_BASE_URL,
  apiToken: process.env.SHORTCUT_API_TOKEN,
})

const workflowStateColors: { [key: string]: string } = {
  backlog: "#1E40AF",
  unstarted: "#7800B1",
  started: "#D97706",
  done: "#166534",
}

type EpicWithStories = EpicSlim & { stories: Story[] }

export const run = async () => {
  const stories = await fetchStories({
    shortcutApi,
  })

  if (!stories) {
    console.error("Failed to fetch stories")
    return
  }

  console.log(`📕 fetched ${stories.length} stories`)

  const workflow = (await shortcutApi.listWorkflows()).find(
    (workflow) => workflow.id.toString() === process.env.WORKFLOW_ID,
  )

  if (!workflow) {
    console.error("Failed to fetch workflows")
    return
  }

  console.log(`🔀 fetched ${stories.length} states`)

  workflow.states.forEach((state) => {
    state.color = workflowStateColors[state.type] || "#ffffff"
  })

  const epics = await shortcutApi.listEpics()

  const epicsWithStories: Map<number, EpicWithStories> = new Map(
    epics.map((epic) => [epic.id, { ...epic, stories: [] }]),
  )

  stories.forEach((story) => {
    const epic = epicsWithStories.get(story.epic_id as number)
    if (epic) {
      epic.stories.push(story)
    }
  })

  for (let [epicId, { stories, description }] of epicsWithStories) {
    const { mermaidChartFullMd, mermaidChart } = generateChart({
      stories,
      states: workflow.states,
    })

    if (process.env.WRITE_CHART_MARKDOWN === "true") {
      const chartFilePath = path.resolve(
        __dirname,
        path.join(process.env.CHART_FOLDER_PATH as string, `epic-${epicId}.md`),
      )

      fs.writeFileSync(chartFilePath, mermaidChartFullMd, "utf-8")
      console.info(`📝 wrote chart to ${chartFilePath}`)
    }

    if (process.env.UPDATE_EPIC_DESCRIPTION === "true") {
      let newDescription
      const startTag = "%% start_pert"
      const endTag = "%% end_pert"

      if (
        description &&
        description.includes(startTag) &&
        description.includes(endTag)
      ) {
        const beforeChart = description.split(startTag)[0]
        const afterChart = description.split(endTag)[1]
        newDescription = `${beforeChart}${startTag}\n${mermaidChart}\n${endTag}${afterChart}`
      } else {
        newDescription = `${description}\n\n${mermaidChartFullMd}`
      }

      const updatedEpic = await shortcutApi.updateEpicDescription({
        epicId,
        description: newDescription,
      })

      if (updatedEpic) {
        console.info(`📝 updated epic ${epicId} description`)
      }
    }
  }
}
