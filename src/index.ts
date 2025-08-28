#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DocumentConverter } from "./services/DocumentConverter.js";
import { GitHubService } from "./services/GitHubService.js";
import { GeminiService } from "./services/GeminiService.js";
import { DocusaurusConverter } from "./services/DocusaurusConverter.js";
import { config } from "./config.js";

// Create the MCP server
const server = new McpServer({
  name: "mdx-gdocs-mcp-server",
  version: "1.0.0",
});

// Initialize services
const geminiService = new GeminiService(config.geminiApiKey);
const githubService = new GitHubService(config.githubToken);
const docusaurusConverter = new DocusaurusConverter(geminiService);
const documentConverter = new DocumentConverter(geminiService, docusaurusConverter);

// Tool: Convert document to MDX
server.tool(
  "convert_document_to_mdx",
  "Convert a document (text or .docx) to MDX format with Docusaurus components",
  {
    content: z.string().describe("The document content as text or base64 encoded .docx file"),
    contentType: z.enum(["text", "docx"]).describe("The type of content being converted"),
    title: z.string().optional().describe("Optional title for the document"),
    includeDocusaurusComponents: z.boolean().default(true).describe("Whether to enhance with Docusaurus components"),
  },
  async ({ content, contentType, title, includeDocusaurusComponents }) => {
    try {
      const mdxContent = await documentConverter.convertToMDX(
        content,
        contentType,
        { title, includeDocusaurusComponents }
      );

      return {
        content: [
          {
            type: "text",
            text: `Document successfully converted to MDX format:\n\n${mdxContent}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error converting document: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Create GitHub Pull Request with MDX content
server.tool(
  "create_github_pr_with_mdx",
  "Create a GitHub Pull Request with converted MDX content",
  {
    owner: z.string().describe("GitHub repository owner"),
    repo: z.string().describe("GitHub repository name"),
    filePath: z.string().describe("Path where the MDX file should be created"),
    mdxContent: z.string().describe("The MDX content to be added"),
    commitMessage: z.string().describe("Commit message for the changes"),
    prTitle: z.string().describe("Pull request title"),
    prDescription: z.string().optional().describe("Pull request description"),
    branchName: z.string().optional().describe("Branch name for the PR (auto-generated if not provided)"),
  },
  async ({ owner, repo, filePath, mdxContent, commitMessage, prTitle, prDescription, branchName }) => {
    try {
      const result = await githubService.createPullRequestWithContent({
        owner,
        repo,
        filePath,
        content: mdxContent,
        commitMessage,
        prTitle,
        prDescription,
        branchName,
      });

      return {
        content: [
          {
            type: "text",
            text: `Pull Request created successfully!\n\nPR URL: ${result.pullRequestUrl}\nBranch: ${result.branchName}\nCommit SHA: ${result.commitSha}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating GitHub PR: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Convert and create PR in one step
server.tool(
  "convert_and_create_pr",
  "Convert a document to MDX and create a GitHub Pull Request in one step",
  {
    // Document conversion parameters
    content: z.string().describe("The document content as text or base64 encoded .docx file"),
    contentType: z.enum(["text", "docx"]).describe("The type of content being converted"),
    documentTitle: z.string().optional().describe("Optional title for the document"),
    includeDocusaurusComponents: z.boolean().default(true).describe("Whether to enhance with Docusaurus components"),
    
    // GitHub parameters
    owner: z.string().describe("GitHub repository owner"),
    repo: z.string().describe("GitHub repository name"),
    filePath: z.string().describe("Path where the MDX file should be created"),
    commitMessage: z.string().describe("Commit message for the changes"),
    prTitle: z.string().describe("Pull request title"),
    prDescription: z.string().optional().describe("Pull request description"),
    branchName: z.string().optional().describe("Branch name for the PR (auto-generated if not provided)"),
  },
  async ({ 
    content, 
    contentType, 
    documentTitle, 
    includeDocusaurusComponents,
    owner, 
    repo, 
    filePath, 
    commitMessage, 
    prTitle, 
    prDescription, 
    branchName 
  }) => {
    try {
      // Step 1: Convert document to MDX
      const mdxContent = await documentConverter.convertToMDX(
        content,
        contentType,
        { title: documentTitle, includeDocusaurusComponents }
      );

      // Step 2: Create GitHub PR
      const result = await githubService.createPullRequestWithContent({
        owner,
        repo,
        filePath,
        content: mdxContent,
        commitMessage,
        prTitle,
        prDescription,
        branchName,
      });

      return {
        content: [
          {
            type: "text",
            text: `Document successfully converted to MDX and Pull Request created!\n\nPR URL: ${result.pullRequestUrl}\nBranch: ${result.branchName}\nCommit SHA: ${result.commitSha}\n\n--- MDX Content Preview ---\n${mdxContent.substring(0, 500)}${mdxContent.length > 500 ? '...' : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error in convert and create PR workflow: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: List Docusaurus components
server.tool(
  "list_docusaurus_components",
  "List available Docusaurus components that can be used in MDX conversion",
  {},
  async () => {
    const components = docusaurusConverter.getAvailableComponents();
    
    return {
      content: [
        {
          type: "text",
          text: `Available Docusaurus components:\n\n${components.map(comp => 
            `• **${comp.name}**: ${comp.description}\n  Usage: ${comp.usage}`
          ).join('\n\n')}`,
        },
      ],
    };
  }
);

// Resource: Configuration status
server.resource(
  "config-status",
  "mcp://config/status",
  {
    description: "Current configuration status of the MCP server",
    mimeType: "application/json",
  },
  async () => {
    const configStatus = {
      geminiApiKey: config.geminiApiKey ? "✓ Configured" : "✗ Missing",
      githubToken: config.githubToken ? "✓ Configured" : "✗ Missing",
      supportedFormats: ["text", "docx"],
      docusaurusComponents: docusaurusConverter.getAvailableComponents().length,
    };

    return {
      contents: [
        {
          uri: "mcp://config/status",
          mimeType: "application/json",
          text: JSON.stringify(configStatus, null, 2),
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MDX-GDocs MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
