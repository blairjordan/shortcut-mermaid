import dotenv from "dotenv"
import { run } from "./run"

dotenv.config()

if (!process.env.WATCH_INTERVAL) {
  throw new Error("required env: WATCH_INTERVAL")
}

run()

setInterval(run, parseInt(process.env.WATCH_INTERVAL || "60_000"))
