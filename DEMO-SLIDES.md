# 🎯 MDX-GDocs: Step-by-Step Demo Guide

## 📋 **Overview for Slides**

**MDX-GDocs** transforms your documents into professional MDX format with Docusaurus components using AI, then automatically creates GitHub Pull Requests.

### **What You'll Show**

1. Converting a plain text document to enhanced MDX
2. AI automatically adding Docusaurus components
3. Creating a GitHub PR with the converted content
4. Interactive chat with Gemini for document processing

---

## 🚀 **Step 1: Project Setup**

### **Slide: "Getting Started"**

```bash
# Clone and setup the project
git clone <your-repo-url>
cd mdx-gdocs

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys:
# GEMINI_API_KEY=your_gemini_api_key
# GITHUB_TOKEN=your_github_token

# Build the project
npm run build
```

**Result to Show:** ✅ Project built successfully with all dependencies installed

---

## 📝 **Step 2: Create a Sample Document**

### **Slide: "Input Document"**

Create a sample document to demonstrate the conversion:

```bash
cat > demo-document.txt << 'EOF'
# API Integration Guide

This guide covers how to integrate with our REST API for developers.

## Authentication

Before making requests, you need to authenticate using an API key.

Steps to get started:
1. Register for an account
2. Generate an API key from the dashboard
3. Include the key in your requests

## Making Requests

All API requests should be made to https://api.example.com

### GET Request Example

To fetch user data:

```

curl -H "Authorization: Bearer YOUR_API_KEY" \
 https://api.example.com/users/123

```

Important: Always use HTTPS for security.

## Rate Limiting

The API has rate limits:
- 100 requests per minute for free accounts
- 1000 requests per minute for premium accounts

If you exceed the limit, you'll receive a 429 status code.

## Error Handling

Common HTTP status codes:
- 200: Success
- 401: Unauthorized (check your API key)
- 404: Resource not found
- 429: Rate limit exceeded
- 500: Server error

Make sure to handle these errors gracefully in your application.

## Support

If you need help, contact our support team at support@example.com
EOF
```

**Result to Show:** Plain text document with basic formatting

---

## ⚡ **Step 3: Convert Document with AI Enhancement**

### **Slide: "AI-Powered Conversion"**

```bash
# Convert the document to MDX with Docusaurus components
./mdx-gdocs.sh convert \
  --input demo-document.txt \
  --title "API Integration Guide" \
  --output enhanced-api-guide.mdx
```

**Expected Output:**

```
🔄 Converting document to MDX...
✅ Conversion completed!
📄 Output file: /Users/cecygeraldocodes/mdx-gdocs/enhanced-api-guide.mdx
```

**Result to Show:** Preview the enhanced MDX file (see Step 4 for content)

---

## 🎨 **Step 4: Show the Enhanced Result**

### **Slide: "Before vs After Comparison"**

**BEFORE (Plain Text):**

```text
# API Integration Guide
This guide covers how to integrate with our REST API...

Important: Always use HTTPS for security.
```

**AFTER (Enhanced MDX with Docusaurus Components):**

````mdx
---
title: API Integration Guide
description: Complete guide for API integration with authentication and best practices
---

# API Integration Guide

This comprehensive guide covers how to integrate with our REST API for developers.

## Authentication

:::info Prerequisites
Before making requests, you need to authenticate using an API key.
:::

### Getting Started Steps

1. **Register for an account**
2. **Generate an API key** from the dashboard
3. **Include the key** in your requests

## Making API Requests

:::tip Base URL
All API requests should be made to `https://api.example.com`
:::

### GET Request Example

```bash title="Fetch User Data"
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.example.com/users/123
```
````

:::warning Security Notice
Always use HTTPS for security when making API requests.
:::

## Rate Limiting

<Tabs>
<TabItem value="free" label="Free Account">

- 100 requests per minute
- Basic support included

</TabItem>
<TabItem value="premium" label="Premium Account">

- 1000 requests per minute
- Priority support included

</TabItem>
</Tabs>

:::caution Rate Limit Exceeded
If you exceed the limit, you'll receive a `429` status code.
:::

## Error Handling

| Status Code | Meaning             | Action Required                |
| ----------- | ------------------- | ------------------------------ |
| 200         | Success             | Continue processing            |
| 401         | Unauthorized        | Check your API key             |
| 404         | Resource not found  | Verify the endpoint            |
| 429         | Rate limit exceeded | Implement backoff strategy     |
| 500         | Server error        | Retry later or contact support |

:::tip Error Handling Best Practice
Make sure to handle these errors gracefully in your application.
:::

````

---

## 🔗 **Step 5: Create GitHub Pull Request**

### **Slide: "Automated GitHub Integration"**

```bash
# Create a PR with the enhanced documentation
./mdx-gdocs.sh convert-and-pr \
  --input demo-document.txt \
  --repo yourusername/your-docs-repo \
  --path docs/api/integration-guide.mdx \
  --title "API Integration Guide" \
  --pr-title "docs: Add comprehensive API integration guide" \
  --pr-description "Added detailed API integration guide with examples, rate limiting info, and error handling best practices"
````

**Expected Output:**

```
🔄 Converting document and creating PR...
✅ Conversion and PR creation completed!
🔗 PR URL: https://github.com/yourusername/your-docs-repo/pull/123
🌿 Branch: docs/api-integration-guide-20250828
```

**Result to Show:** Screenshot of the created GitHub PR with the enhanced MDX content

---

## 💬 **Step 6: Interactive Chat Demo**

### **Slide: "AI Assistant for Document Processing"**

```bash
# Start interactive chat with Gemini
./mdx-gdocs.sh chat
```

**Demo Conversation:**

```
🤖 Gemini> Hello! I'm your AI assistant for MDX document conversion.

User: How can I make my API documentation more user-friendly?

🤖 Gemini> Great question! Here are some ways to enhance your API docs:

1. **Use Docusaurus components** - Add tips, warnings, and notes for better UX
2. **Code examples with tabs** - Show multiple programming languages
3. **Interactive elements** - Use collapsible sections for advanced topics
4. **Visual hierarchy** - Proper headings and structured content

Would you like me to help convert a specific document with these enhancements?

User: components

📦 Available Docusaurus Components:
• Admonition - Note: Highlight important information
• Admonition - Tip: Provide helpful tips
• Tabs: Create tabbed content for multiple options
• Details: Collapsible content sections
...

User: exit
👋 Goodbye!
```

---

## 📊 **Step 7: Available Components Showcase**

### **Slide: "Rich Documentation Components"**

```bash
# Show all available Docusaurus components
./mdx-gdocs.sh components
```

**Result to Show:**

````
📦 Available Docusaurus Components:

🔸 Admonition - Note
   Highlight important information
   Example: :::note
   This is important information to remember.
   :::

🔸 Admonition - Tip
   Provide helpful tips
   Example: :::tip
   Here's a helpful tip for better performance.
   :::

🔸 Tabs
   Create tabbed content for multiple options
   Example: <Tabs>
   <TabItem value="npm" label="npm">
   ```bash
   npm install package
````

   </TabItem>
   </Tabs>

🔸 Code Block with Title
Code blocks with titles and syntax highlighting
Example: ```javascript title="config.js"
module.exports = { preset: '@docusaurus/preset-classic' };

```

```

---

## 🎯 **Step 8: Real-World Use Cases**

### **Slide: "Use Cases & Benefits"**

**Use Cases to Highlight:**

1. **Technical Documentation Migration**
   - Convert existing docs to Docusaurus format
   - Enhance with interactive components
   - Maintain in version control

2. **API Documentation Automation**
   - Transform API specs to readable docs
   - Add code examples and best practices
   - Create structured endpoint documentation

3. **Tutorial Content Creation**
   - Convert guides to interactive format
   - Add warnings and tips automatically
   - Create platform-specific examples

4. **Blog Post Enhancement**
   - Transform articles to MDX format
   - Add interactive elements
   - Optimize for technical content

**Benefits:**

- ⚡ **Speed**: Convert documents in seconds
- 🎨 **Enhancement**: AI adds relevant components automatically
- 🔄 **Automation**: Direct GitHub integration
- 🤖 **Intelligence**: Context-aware content structuring
- 📚 **Consistency**: Standardized documentation format

---

## 📈 **Step 9: Performance Metrics**

### **Slide: "Before & After Metrics"**

| Metric             | Before (Manual)         | After (AI-Powered)    | Improvement        |
| ------------------ | ----------------------- | --------------------- | ------------------ |
| Conversion Time    | 2-4 hours               | 30 seconds            | **99% faster**     |
| Component Addition | Manual selection        | AI-suggested          | **100% automated** |
| GitHub Integration | Manual PR creation      | Automated             | **Streamlined**    |
| Consistency        | Variable quality        | Standardized          | **Reliable**       |
| Learning Curve     | High (MDX + Docusaurus) | Low (simple commands) | **Accessible**     |

---

## 🛠 **Step 10: Technical Architecture**

### **Slide: "Under the Hood"**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Input Doc     │ ─► │   Gemini AI      │ ─► │  Enhanced MDX   │
│  (.txt/.docx)   │    │   Processing     │    │ w/ Components   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  GitHub API     │ ◄─ │  Document        │ ─► │  Docusaurus     │
│  Integration    │    │  Converter       │    │  Components     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Technology Stack:**

- **AI**: Google Gemini Pro for intelligent enhancement
- **Language**: TypeScript with ES2022
- **GitHub**: Octokit for automated PR creation
- **Document Processing**: Mammoth (DOCX) + Turndown (Markdown)
- **Protocol**: Model Context Protocol (MCP) support

---

## 🎉 **Conclusion Slide: "Ready to Transform Your Documentation"**

### **Key Takeaways:**

1. **AI-powered document conversion** in seconds
2. **Automatic Docusaurus component enhancement**
3. **Seamless GitHub workflow integration**
4. **Interactive chat for complex scenarios**
5. **Production-ready with TypeScript**

### **Get Started Today:**

```bash
git clone your-repo
cd mdx-gdocs
npm install && npm run build
./mdx-gdocs.sh convert --input your-doc.txt --title "Your Guide"
```

**Transform your documentation workflow with AI! 🚀**
