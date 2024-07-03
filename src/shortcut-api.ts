import { Api, ApiConfig, StorySearchResults, Workflow } from "./types/api"
import dotenv from "dotenv"

dotenv.config()

if (!(process.env.SHORTCUT_BASE_URL && process.env.SHORTCUT_API_TOKEN)) {
  throw new Error(
    "SHORTCUT_BASE_URL and SHORTCUT_API_TOKEN must be set in the environment",
  )
}

export interface ShortcutApi {
  baseUrl: string
  getStories: ({ next }: { next?: string }) => Promise<StorySearchResults>
  listWorkflows: () => Promise<Workflow[]>
}

export const ShortcutApi = ({
  baseUrl,
  apiToken,
}: {
  baseUrl: string
  apiToken: string
}): ShortcutApi => {
  const apiConfig: ApiConfig<any> = {
    baseUrl,
    baseApiParams: {
      headers: {
        "Content-Type": "application/json",
        "Shortcut-Token": apiToken,
      },
    },
  }

  const apiClient = new Api(apiConfig)

  return {
    baseUrl,
    async getStories({
      next,
    }: { next?: string } = {}): Promise<StorySearchResults> {
      const queryParams = {
        query: "is:story",
        detail: "full",
        page_size: 10,
        ...(next
          ? {
              ...Object.fromEntries(
                new URL(next, baseUrl).searchParams.entries(),
              ),
            }
          : {}),
      }

      const response = await apiClient.api.searchStories(queryParams as any)

      if (response.error) {
        throw new Error(`Failed to fetch stories: ${response.error}`)
      }

      if (!response.data) {
        return { data: [], next: "", total: 0 }
      }

      return response.data
    },
    async listWorkflows(): Promise<Workflow[]> {
      return (await apiClient.api.listWorkflows()).data
    },
  }
}
