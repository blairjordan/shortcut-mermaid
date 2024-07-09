import { ShortcutApi } from "./shortcut-api"
import { Story } from "./types/api"

export const fetchStories = async ({
  shortcutApi,
}: {
  shortcutApi: ShortcutApi
}): Promise<Story[] | undefined> => {
  let next: string | undefined = ""
  let aggregatedResults: any[] = []

  while (true) {
    try {
      const result = await shortcutApi.getStories({ next })
      aggregatedResults = aggregatedResults.concat(
        result.data.filter((story) => !story.archived),
      )

      if (result.next && result.next !== next) {
        next = result.next
      } else {
        return aggregatedResults
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error)
      break
    }
  }
}
