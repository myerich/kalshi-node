import { config } from "dotenv";
import { resolve } from "path";

// Load .env from project root before any tests run
config({ path: resolve(__dirname, "../../.env") });
