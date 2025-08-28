import { config as dotenvConfig } from "dotenv";

// Load environment variables
dotenvConfig();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  githubToken: process.env.GITHUB_TOKEN || "",
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
};

// Validate required configuration
export function validateConfig() {
  const missingVars: string[] = [];
  
  if (!config.geminiApiKey) {
    missingVars.push("GEMINI_API_KEY");
  }
  
  if (!config.githubToken) {
    missingVars.push("GITHUB_TOKEN");
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
      "Please set these in your .env file or environment."
    );
  }
}
