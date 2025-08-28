import { GeminiService } from "./GeminiService.js";

export interface DocusaurusComponent {
  name: string;
  description: string;
  usage: string;
  example: string;
}

export class DocusaurusConverter {
  private geminiService: GeminiService;
  private components: DocusaurusComponent[];

  constructor(geminiService: GeminiService) {
    this.geminiService = geminiService;
    this.components = this.initializeComponents();
  }

  private initializeComponents(): DocusaurusComponent[] {
    return [
      {
        name: "Admonition - Note",
        description: "Highlight important information",
        usage: ":::note\nYour content here\n:::",
        example: ":::note\nThis is important information to remember.\n:::"
      },
      {
        name: "Admonition - Tip",
        description: "Provide helpful tips",
        usage: ":::tip\nYour tip here\n:::",
        example: ":::tip\nHere's a helpful tip for better performance.\n:::"
      },
      {
        name: "Admonition - Warning",
        description: "Warn about potential issues",
        usage: ":::warning\nYour warning here\n:::",
        example: ":::warning\nBe careful when using this feature.\n:::"
      },
      {
        name: "Admonition - Caution",
        description: "Indicate caution needed",
        usage: ":::caution\nYour caution here\n:::",
        example: ":::caution\nThis action cannot be undone.\n:::"
      },
      {
        name: "Admonition - Danger",
        description: "Highlight dangerous actions",
        usage: ":::danger\nYour danger warning here\n:::",
        example: ":::danger\nThis will delete all your data permanently.\n:::"
      },
      {
        name: "Tabs",
        description: "Create tabbed content for multiple options",
        usage: "<Tabs>\n<TabItem value=\"tab1\" label=\"Tab 1\">\nContent 1\n</TabItem>\n<TabItem value=\"tab2\" label=\"Tab 2\">\nContent 2\n</TabItem>\n</Tabs>",
        example: "<Tabs>\n<TabItem value=\"npm\" label=\"npm\">\n```bash\nnpm install package\n```\n</TabItem>\n<TabItem value=\"yarn\" label=\"Yarn\">\n```bash\nyarn add package\n```\n</TabItem>\n</Tabs>"
      },
      {
        name: "Details",
        description: "Collapsible content sections",
        usage: "<details>\n<summary>Click to expand</summary>\nHidden content here\n</details>",
        example: "<details>\n<summary>Advanced Configuration</summary>\n\nThis section contains advanced configuration options that most users won't need.\n\n</details>"
      },
      {
        name: "Code Block with Title",
        description: "Code blocks with titles and syntax highlighting",
        usage: "```language title=\"filename.ext\"\ncode here\n```",
        example: "```javascript title=\"config.js\"\nmodule.exports = {\n  presets: ['@docusaurus/preset-classic']\n};\n```"
      },
      {
        name: "Highlighted Lines",
        description: "Highlight specific lines in code blocks",
        usage: "```language {1,3-5}\ncode here\n```",
        example: "```javascript {2,4-6}\nfunction hello() {\n  console.log('Hello'); // highlighted\n  const name = 'World';\n  if (name) { // highlighted\n    console.log(name); // highlighted\n  } // highlighted\n}\n```"
      },
      {
        name: "Frontmatter",
        description: "Document metadata at the top of MDX files",
        usage: "---\ntitle: Page Title\ndescription: Page description\n---",
        example: "---\ntitle: Getting Started\ndescription: Learn how to get started with our platform\nsidebar_position: 1\n---"
      }
    ];
  }

  getAvailableComponents(): DocusaurusComponent[] {
    return this.components;
  }

  async enhanceWithDocusaurusComponents(content: string, title?: string): Promise<string> {
    try {
      const enhancedContent = await this.geminiService.enhanceContentWithDocusaurus(content, title);
      return this.addFrontmatter(enhancedContent, title);
    } catch (error) {
      throw new Error(`Failed to enhance with Docusaurus components: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private addFrontmatter(content: string, title?: string): string {
    // Check if content already has frontmatter
    if (content.startsWith('---')) {
      return content;
    }

    if (!title) {
      return content;
    }

    const frontmatter = `---
title: ${title}
description: ${this.generateDescription(content)}
---

`;

    return frontmatter + content;
  }

  private generateDescription(content: string): string {
    // Extract first paragraph or create a generic description
    const lines = content.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line => 
      !line.startsWith('#') && 
      !line.startsWith(':::') && 
      !line.startsWith('```') &&
      line.length > 20
    );

    if (firstParagraph) {
      // Take first 150 characters and ensure it ends properly
      const description = firstParagraph.substring(0, 150);
      const lastSpace = description.lastIndexOf(' ');
      return lastSpace > 100 ? description.substring(0, lastSpace) + '...' : description;
    }

    return 'Technical documentation';
  }

  convertMarkdownToMDX(markdown: string, title?: string): string {
    let mdxContent = markdown;

    // Add frontmatter if title is provided
    if (title && !mdxContent.startsWith('---')) {
      const frontmatter = `---
title: ${title}
description: ${this.generateDescription(mdxContent)}
---

`;
      mdxContent = frontmatter + mdxContent;
    }

    // Convert note patterns to admonitions
    mdxContent = mdxContent.replace(/> \*\*Note:\*\* (.+)/g, ':::note\n$1\n:::');
    mdxContent = mdxContent.replace(/> \*\*Tip:\*\* (.+)/g, ':::tip\n$1\n:::');
    mdxContent = mdxContent.replace(/> \*\*Warning:\*\* (.+)/g, ':::warning\n$1\n:::');
    mdxContent = mdxContent.replace(/> \*\*Caution:\*\* (.+)/g, ':::caution\n$1\n:::');

    // Enhance code blocks with titles where appropriate
    mdxContent = mdxContent.replace(/```(\w+)\n\/\/ (.+)\n/g, '```$1 title="$2"\n');
    mdxContent = mdxContent.replace(/```(\w+)\n# (.+)\n/g, '```$1 title="$2"\n');

    return mdxContent;
  }
}
