import mammoth from "mammoth";
import TurndownService from "turndown";
// @ts-ignore - turndown-plugin-gfm doesn't have types
import turndownPluginGfm from "turndown-plugin-gfm";
import { GeminiService } from "./GeminiService.js";
import { DocusaurusConverter } from "./DocusaurusConverter.js";

export interface ConversionOptions {
  title?: string;
  includeDocusaurusComponents?: boolean;
}

export class DocumentConverter {
  private geminiService: GeminiService;
  private docusaurusConverter: DocusaurusConverter;
  private turndownService: TurndownService;

  constructor(geminiService: GeminiService, docusaurusConverter: DocusaurusConverter) {
    this.geminiService = geminiService;
    this.docusaurusConverter = docusaurusConverter;
    this.turndownService = this.initializeTurndownService();
  }

  private initializeTurndownService(): TurndownService {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    // Add GitHub Flavored Markdown support
    turndownService.use(turndownPluginGfm.gfm);

    return turndownService;
  }

  async convertToMDX(
    content: string, 
    contentType: 'text' | 'docx', 
    options: ConversionOptions = {}
  ): Promise<string> {
    try {
      let processedContent: string;

      if (contentType === 'docx') {
        processedContent = await this.convertDocxToText(content);
      } else {
        processedContent = content;
      }

      // Clean and structure the content using Gemini
      const improvedContent = await this.geminiService.improveDocumentStructure(
        processedContent,
        "Convert to well-structured markdown suitable for technical documentation"
      );

      if (options.includeDocusaurusComponents) {
        return await this.docusaurusConverter.enhanceWithDocusaurusComponents(
          improvedContent,
          options.title
        );
      } else {
        const markdownContent = await this.geminiService.convertToMarkdown(
          improvedContent,
          options.title
        );
        return this.docusaurusConverter.convertMarkdownToMDX(
          markdownContent,
          options.title
        );
      }
    } catch (error) {
      throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async convertDocxToText(base64Content: string): Promise<string> {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ buffer });
      
      if (result.messages.length > 0) {
        console.warn('Mammoth conversion warnings:', result.messages);
      }

      return result.value;
    } catch (error) {
      throw new Error(`Failed to convert DOCX: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async convertHtmlToMarkdown(html: string): Promise<string> {
    try {
      return this.turndownService.turndown(html);
    } catch (error) {
      throw new Error(`Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async extractTextFromDocx(base64Content: string): Promise<{ text: string; html: string }> {
    try {
      const buffer = Buffer.from(base64Content, 'base64');
      
      // Extract both raw text and HTML
      const [textResult, htmlResult] = await Promise.all([
        mammoth.extractRawText({ buffer }),
        mammoth.convertToHtml({ buffer })
      ]);

      return {
        text: textResult.value,
        html: htmlResult.value
      };
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async convertWithCustomPrompt(content: string, customPrompt: string): Promise<string> {
    try {
      const result = await this.geminiService.improveDocumentStructure(content, customPrompt);
      return result;
    } catch (error) {
      throw new Error(`Custom conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
