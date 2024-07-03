import dotenv from "dotenv"
import fs from "fs"
import path from "path"

import { generateChart } from "./chart"
import { fetchStories } from "./stories"
import { ShortcutApi } from "./shortcut-api"

dotenv.config()

if (
  !(
    process.env.SHORTCUT_BASE_URL &&
    process.env.SHORTCUT_API_TOKEN &&
    process.env.CHART_FILE_PATH &&
    process.env.WORKFLOW_ID
  )
) {
  throw new Error(
    "required env: SHORTCUT_BASE_URL, SHORTCUT_API_TOKEN, CHART_FILE_PATH, WORKFLOW_ID",
  )
}

const shortcutApi = ShortcutApi({
  baseUrl: process.env.SHORTCUT_BASE_URL,
  apiToken: process.env.SHORTCUT_API_TOKEN,
})

const chartFilePath = path.resolve(__dirname, process.env.CHART_FILE_PATH)

const workflowStateColors: { [key: string]: string } = {
  backlog: "#1E40AF",
  unstarted: "#7800B1",
  started: "#D97706",
  done: "#166534",
}

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

  const chart = generateChart({
    stories,
    states: workflow.states,
  })

  fs.writeFileSync(chartFilePath, chart, "utf-8")

  console.info(`📝 wrote chart to ${chartFilePath}`)
}
