# MDX-GDocs MCP Server

An MCP (Model Context Protocol) server that converts documents to MDX format with Docusaurus components and creates GitHub Pull Requests automatically.

## Features

- 🔄 **Document Conversion**: Convert text and .docx files to MDX format
- 🧩 **Docusaurus Components**: Automatically enhance content with Docusaurus components (admonitions, tabs, code blocks)
- 🤖 **AI-Powered**: Uses Google Gemini AI for intelligent content structuring and enhancement
- 🔗 **GitHub Integration**: Automatically create Pull Requests with converted MDX content
- 📝 **MCP Protocol**: Standard Model Context Protocol for integration with AI applications

## Requirements

- Node.js 18+
- Google Gemini API key
- GitHub Personal Access Token

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini AI API key (required)
- `GITHUB_TOKEN` - GitHub Personal Access Token with repo permissions (required)

## Usage

### Method 1: Gemini CLI (Direct Usage)

The easiest way to use this tool is with the built-in Gemini CLI:

```bash
# Convert a document to MDX
node build/gemini-cli.js convert --input document.txt --title "My Document"

# Create a GitHub PR with existing MDX content
node build/gemini-cli.js create-pr --input document.mdx --repo owner/repo --path docs/new-page.mdx

# Convert and create PR in one step
node build/gemini-cli.js convert-and-pr --input document.txt --repo owner/repo --path docs/new-page.mdx --title "New Documentation"

# Interactive chat with Gemini
node build/gemini-cli.js chat

# List available Docusaurus components
node build/gemini-cli.js components
```

### Method 2: As an MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "mdx-gdocs": {
      "command": "node",
      "args": ["/path/to/mdx-gdocs-mcp-server/build/index.js"]
    }
  }
}
```

### Available Tools

1. **convert_document_to_mdx** - Convert text or .docx content to MDX format
2. **create_github_pr_with_mdx** - Create a GitHub PR with MDX content
3. **convert_and_create_pr** - Convert document and create PR in one step
4. **list_docusaurus_components** - List available Docusaurus components

### Available Resources

- **config-status** - View current configuration status

## Supported Docusaurus Components

- **Admonitions**: Note, Tip, Warning, Caution, Danger
- **Tabs**: Multi-option tabbed content
- **Details**: Collapsible content sections
- **Code Blocks**: With syntax highlighting and titles
- **Frontmatter**: Document metadata

## Examples

### Converting a Document

```typescript
// Convert text to MDX with Docusaurus components
const result = await convertDocumentToMDX({
  content: "Your document content here",
  contentType: "text",
  title: "My Document",
  includeDocusaurusComponents: true,
});
```

### Creating a GitHub PR

```typescript
// Create PR with converted content
const pr = await convertAndCreatePR({
  content: "Document content",
  contentType: "text",
  owner: "username",
  repo: "docs-repo",
  filePath: "docs/new-page.mdx",
  commitMessage: "Add new documentation page",
  prTitle: "Add new documentation",
  prDescription: "Automated documentation update",
});
```

## Development

```bash
# Development mode
npm run dev

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Architecture

```
src/
├── index.ts              # Main MCP server entry point
├── config.ts             # Environment configuration
└── services/
    ├── DocumentConverter.ts   # Document conversion logic
    ├── DocusaurusConverter.ts  # Docusaurus component enhancement
    ├── GeminiService.ts       # Google Gemini AI integration
    └── GitHubService.ts       # GitHub API integration
```

## License

MIT License - see LICENSE file for details.
