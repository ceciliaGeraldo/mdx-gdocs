# MDX-GDocs Usage Examples

## 🚀 **Using with Gemini CLI (Recommended)**

Your MDX-GDocs project now includes a powerful CLI that integrates directly with Google Gemini AI!

### **1. Document Conversion**

Convert any text file or .docx document to MDX with Docusaurus components:

```bash
# Convert a text file
node build/gemini-cli.js convert --input my-doc.txt --title "My Documentation"

# Convert with custom output path
node build/gemini-cli.js convert --input my-doc.txt --output custom-path.mdx --title "Custom Doc"

# Convert without Docusaurus components (plain MDX)
node build/gemini-cli.js convert --input my-doc.txt --no-components
```

### **2. GitHub Integration**

Create Pull Requests automatically with your converted MDX content:

```bash
# Create PR with existing MDX file
node build/gemini-cli.js create-pr \
  --input document.mdx \
  --repo username/my-docs-repo \
  --path docs/getting-started.mdx \
  --title "Add getting started guide" \
  --description "New documentation for users"

# Convert and create PR in one command
node build/gemini-cli.js convert-and-pr \
  --input my-guide.txt \
  --repo username/my-docs-repo \
  --path docs/user-guide.mdx \
  --title "User Guide" \
  --pr-title "Add comprehensive user guide" \
  --message "docs: add user guide with examples"
```

### **3. Interactive Chat with Gemini**

Start an interactive session for advanced document processing:

```bash
node build/gemini-cli.js chat
```

In the chat, you can:

- Ask questions about document conversion best practices
- Get help with MDX syntax and Docusaurus components
- Request specific document enhancements
- Learn about GitHub integration strategies

### **4. Explore Available Components**

See what Docusaurus components are available for enhancement:

```bash
node build/gemini-cli.js components
```

## 📋 **What the AI Does for You**

When you convert documents, Gemini AI automatically:

1. **Structures Content**: Organizes your content with proper headings and sections
2. **Adds Components**: Enhances content with relevant Docusaurus components:
   - `:::note` blocks for important information
   - `:::tip` blocks for helpful suggestions
   - `:::warning` blocks for caution items
   - `<Tabs>` for multiple options (installation methods, code examples)
   - `<details>` for collapsible sections
   - Code blocks with syntax highlighting and titles
3. **Creates Frontmatter**: Adds proper metadata for Docusaurus
4. **Optimizes Formatting**: Ensures clean, readable MDX structure

## 🛠 **Example Workflow**

Here's a complete example of converting documentation and creating a PR:

```bash
# 1. You have a text document about API setup
echo "# API Setup Guide

To set up the API, follow these steps:

1. Install dependencies
2. Configure environment variables
3. Start the server

Make sure to set your API key before starting." > api-guide.txt

# 2. Convert to MDX with Docusaurus components
node build/gemini-cli.js convert --input api-guide.txt --title "API Setup Guide"

# 3. The AI enhances it automatically and creates api-guide.mdx
# 4. Create a PR in your docs repository
node build/gemini-cli.js create-pr \
  --input api-guide.mdx \
  --repo yourname/docs-site \
  --path docs/api/setup.mdx \
  --title "Add API setup guide" \
  --description "Comprehensive guide for API setup and configuration"
```

## 🎯 **Use Cases**

### **Technical Documentation**

- Convert existing docs to Docusaurus format
- Enhance readability with components
- Maintain consistent documentation structure

### **Blog Posts**

- Transform articles into MDX format
- Add interactive elements (tabs, collapsible sections)
- Optimize for technical content presentation

### **API Documentation**

- Convert API specs to readable docs
- Add code examples with syntax highlighting
- Create structured endpoint documentation

### **Tutorial Content**

- Transform step-by-step guides
- Add warning and tip callouts
- Create tabbed examples for different platforms

## 💡 **Pro Tips**

1. **Use Descriptive Titles**: The `--title` flag helps the AI understand content context
2. **Review Before PR**: Always check the converted MDX before creating PRs
3. **Customize Components**: The AI chooses appropriate components, but you can edit them
4. **Batch Processing**: Process multiple files by scripting the CLI commands
5. **Interactive Mode**: Use `chat` command for complex conversions requiring guidance

## 🔗 **Integration Options**

### **With MCP Clients**

If you prefer using MCP clients like Claude Desktop, you can still use the MCP server mode alongside the CLI.

### **Scripting**

Create bash scripts for common workflows:

```bash
#!/bin/bash
# convert-and-deploy.sh
DOC_FILE=$1
REPO=$2
DOC_PATH=$3

node build/gemini-cli.js convert-and-pr \
  --input "$DOC_FILE" \
  --repo "$REPO" \
  --path "$DOC_PATH" \
  --title "$(basename "$DOC_FILE" .txt)" \
  --pr-title "docs: add $(basename "$DOC_FILE" .txt)"
```

Your MDX-GDocs project is now ready to transform your documentation workflow with AI-powered conversion and automated GitHub integration!
