import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async enhanceContentWithDocusaurus(content: string, title?: string): Promise<string> {
    const prompt = `
You are an expert technical writer who specializes in converting content to MDX format with Docusaurus components.

Convert the following content to MDX format with appropriate Docusaurus components. Follow these guidelines:

1. Use proper MDX syntax with frontmatter if a title is provided
2. Add appropriate Docusaurus components like:
   - Admonitions (:::note, :::tip, :::warning, :::caution, :::danger)
   - Code blocks with syntax highlighting
   - Tabs for multiple options/examples
   - Details/Summary for collapsible content
3. Structure the content with proper headings
4. Make it engaging and well-formatted for technical documentation
5. Preserve all important information from the original content

${title ? `Document title: ${title}\n` : ''}

Original content:
${content}

Return only the MDX content with Docusaurus components, no explanations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Failed to enhance content with Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async convertToMarkdown(content: string, title?: string): Promise<string> {
    const prompt = `
Convert the following content to clean, well-structured Markdown format.

Requirements:
1. Use proper Markdown syntax
2. Create logical heading hierarchy
3. Format lists, code blocks, and tables appropriately
4. Preserve all important information
5. Make it readable and well-organized

${title ? `Document title: ${title}\n` : ''}

Content to convert:
${content}

Return only the Markdown content, no explanations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Failed to convert to markdown with Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async improveDocumentStructure(content: string, context?: string): Promise<string> {
    const prompt = `
Improve the structure and formatting of this document content.

Requirements:
1. Create clear sections with appropriate headings
2. Improve readability and flow
3. Fix any formatting issues
4. Organize information logically
5. Keep all original information intact

${context ? `Context: ${context}\n` : ''}

Content to improve:
${content}

Return the improved content in the same format.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Failed to improve document structure: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
