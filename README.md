# Shortcut Mermaid
Shortcut Mermaid generates PERT charts from Shortcut stories.

# Setup

**Install Dependencies**

```sh
Copy code
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