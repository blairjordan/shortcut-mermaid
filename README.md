# Shortcut Mermaid
Shortcut Mermaid generates PERT charts from Shortcut stories.

![Example Chart](https://github.com/blairjordan/shortcut-mermaid/raw/main/screenshots/screenshot1.png)


[Shortcut](https://shortcut.com/) is an excellent issue tracking tool.
[Mermaid Chart](https://www.mermaidchart.com/) is a text-based diagramming tool with an easy-to-use syntax.

You can view the output in multiple ways. Here are some examples:

- I use the [VS Code Markdown Mermaid](https://github.com/mjbvz/vscode-markdown-mermaid) plugin to view the output file (default name: chart.md).
- Visit [mermaid.live](https://mermaid.live/) and paste the contents of the `chart.md` file (excluding the surrounding markdown)
- Create interactive charts using Javascript: https://mermaid.js.org/
- Use the [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) to generate diagrams


# Setup

**Install Dependencies**

```sh
npm install
```

**Configure Environment**

Rename `.env.example` to `.env` and update the `SHORTCUT_API_TOKEN` and `WORKFLOW_ID`.

```plaintext
SHORTCUT_BASE_URL=https://api.app.shortcut.com
SHORTCUT_API_TOKEN=<YOUR_API_KEY>
CHART_FILE_PATH=./chart.md
WORKFLOW_ID=<WORKFLOW_ID>
WATCH_INTERVAL=60000
```

For more information on how to get the `SHORTCUT_API_TOKEN` and `WORKFLOW_ID`, please refer to the [Shortcut API documentation](https://shortcut.com/api).

**Development:**

```sh
npm run dev
```

**Build:**

```sh
npm run build
```

**Generate Chart:**

```sh
npm start
```

**Generate Types:**

```sh
npm run generate:types
```
