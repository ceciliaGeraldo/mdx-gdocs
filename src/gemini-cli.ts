#!/usr/bin/env node
import { Command } from 'commander';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentConverter } from './services/DocumentConverter.js';
import { GitHubService } from './services/GitHubService.js';
import { DocusaurusConverter } from './services/DocusaurusConverter.js';
import { GeminiService } from './services/GeminiService.js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from './config.js';

const program = new Command();

// Lazy-loaded services to avoid initialization errors
let geminiService: GeminiService | null = null;
let docusaurusConverter: DocusaurusConverter | null = null;
let documentConverter: DocumentConverter | null = null;
let githubService: GitHubService | null = null;

function getGeminiService(): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService(config.geminiApiKey);
  }
  return geminiService;
}

function getDocusaurusConverter(): DocusaurusConverter {
  if (!docusaurusConverter) {
    docusaurusConverter = new DocusaurusConverter(getGeminiService());
  }
  return docusaurusConverter;
}

function getDocumentConverter(): DocumentConverter {
  if (!documentConverter) {
    documentConverter = new DocumentConverter(getGeminiService(), getDocusaurusConverter());
  }
  return documentConverter;
}

function getGitHubService(): GitHubService {
  if (!githubService) {
    githubService = new GitHubService(config.githubToken);
  }
  return githubService;
}

program
  .name('mdx-gdocs')
  .description('AI-powered document conversion to MDX with Docusaurus components')
  .version('1.0.0');

program
  .command('convert')
  .description('Convert a document to MDX format')
  .requiredOption('-i, --input <file>', 'Input file path (.txt or .docx)')
  .option('-o, --output <file>', 'Output file path (default: input filename with .mdx extension)')
  .option('-t, --title <title>', 'Document title')
  .option('--no-components', 'Disable Docusaurus components enhancement')
  .action(async (options: any) => {
    try {
      console.log('🔄 Converting document to MDX...');
      
      const inputPath = path.resolve(options.input);
      const outputPath = options.output || inputPath.replace(/\.(txt|docx)$/, '.mdx');
      
      if (!fs.existsSync(inputPath)) {
        console.error('❌ Input file not found:', inputPath);
        process.exit(1);
      }

      const content = fs.readFileSync(inputPath, 'utf-8');
      const isDocx = inputPath.endsWith('.docx');
      
      const result = await getDocumentConverter().convertToMDX(
        content,
        isDocx ? 'docx' : 'text',
        {
          title: options.title,
          includeDocusaurusComponents: options.components
        }
      );

      fs.writeFileSync(outputPath, result);
      
      console.log('✅ Conversion completed!');
      console.log('📄 Output file:', outputPath);
    } catch (error) {
      console.error('❌ Conversion failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('create-pr')
  .description('Create a GitHub PR with MDX content')
  .requiredOption('-i, --input <file>', 'Input MDX file')
  .requiredOption('-r, --repo <repo>', 'GitHub repository (owner/repo)')
  .requiredOption('-p, --path <path>', 'File path in the repository')
  .option('-m, --message <message>', 'Commit message', 'Add new documentation')
  .option('--title <title>', 'PR title', 'Add new documentation')
  .option('--description <description>', 'PR description', 'Automated documentation update via MDX-GDocs')
  .action(async (options: any) => {
    try {
      console.log('🚀 Creating GitHub PR...');
      
      const inputPath = path.resolve(options.input);
      if (!fs.existsSync(inputPath)) {
        console.error('❌ Input file not found:', inputPath);
        process.exit(1);
      }

      const content = fs.readFileSync(inputPath, 'utf-8');
      const [owner, repo] = options.repo.split('/');
      
      if (!owner || !repo) {
        console.error('❌ Invalid repository format. Use: owner/repo');
        process.exit(1);
      }

      const result = await getGitHubService().createPullRequestWithContent({
        owner,
        repo,
        filePath: options.path,
        content,
        commitMessage: options.message,
        prTitle: options.title,
        prDescription: options.description
      });

      console.log('✅ PR created successfully!');
      console.log('🔗 PR URL:', result.pullRequestUrl);
      console.log('🌿 Branch:', result.branchName);
    } catch (error) {
      console.error('❌ PR creation failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('convert-and-pr')
  .description('Convert document and create GitHub PR in one step')
  .requiredOption('-i, --input <file>', 'Input file path (.txt or .docx)')
  .requiredOption('-r, --repo <repo>', 'GitHub repository (owner/repo)')
  .requiredOption('-p, --path <path>', 'File path in the repository')
  .option('-t, --title <title>', 'Document title')
  .option('-m, --message <message>', 'Commit message', 'Add new documentation')
  .option('--pr-title <title>', 'PR title', 'Add new documentation')
  .option('--pr-description <description>', 'PR description', 'Automated documentation update via MDX-GDocs')
  .option('--no-components', 'Disable Docusaurus components enhancement')
  .action(async (options: any) => {
    try {
      console.log('🔄 Converting document and creating PR...');
      
      const inputPath = path.resolve(options.input);
      if (!fs.existsSync(inputPath)) {
        console.error('❌ Input file not found:', inputPath);
        process.exit(1);
      }

      const content = fs.readFileSync(inputPath, 'utf-8');
      const isDocx = inputPath.endsWith('.docx');
      const [owner, repo] = options.repo.split('/');
      
      if (!owner || !repo) {
        console.error('❌ Invalid repository format. Use: owner/repo');
        process.exit(1);
      }

      // Convert to MDX
      const conversionResult = await getDocumentConverter().convertToMDX(
        content,
        isDocx ? 'docx' : 'text',
        {
          title: options.title,
          includeDocusaurusComponents: options.components
        }
      );

      // Create PR
      const prResult = await getGitHubService().createPullRequestWithContent({
        owner,
        repo,
        filePath: options.path,
        content: conversionResult,
        commitMessage: options.message,
        prTitle: options.prTitle,
        prDescription: options.prDescription
      });

      console.log('✅ Conversion and PR creation completed!');
      console.log('🔗 PR URL:', prResult.pullRequestUrl);
      console.log('🌿 Branch:', prResult.branchName);
    } catch (error) {
      console.error('❌ Operation failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Interactive chat with Gemini for document processing')
  .action(async () => {
    console.log('🤖 Starting interactive Gemini chat for document processing...');
    console.log('Type "help" for available commands or "exit" to quit.\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🤖 Gemini> '
    });

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chatHistory: Array<{role: string, parts: string}> = [
      {
        role: "user",
        parts: `You are an AI assistant specialized in document conversion to MDX format with Docusaurus components. 

Available commands:
- convert <file_path> [--title "Title"] [--no-components] - Convert document to MDX
- create-pr <mdx_file> <owner/repo> <file_path> [--title "PR Title"] - Create GitHub PR
- convert-and-pr <file> <owner/repo> <file_path> [options] - Convert and create PR
- components - List available Docusaurus components
- help - Show this help
- exit - Quit the chat

You can also ask questions about document conversion, MDX format, or Docusaurus components.`
      },
      {
        role: "model", 
        parts: "Hello! I'm your AI assistant for MDX document conversion. I can help you convert documents to MDX format with Docusaurus components and create GitHub PRs. What would you like to do today?"
      }
    ];

    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts }]
      }))
    });

    rl.prompt();

    rl.on('line', async (input: string) => {
      const trimmedInput = input.trim();
      
      if (trimmedInput === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      if (trimmedInput === 'help') {
        console.log(`
📚 Available Commands:
• convert <file> [--title "Title"] [--no-components] - Convert document to MDX
• create-pr <mdx_file> <owner/repo> <file_path> - Create GitHub PR with MDX
• convert-and-pr <file> <owner/repo> <file_path> - Full pipeline
• components - Show available Docusaurus components
• help - Show this help
• exit - Quit

💬 You can also ask me questions about:
• Document conversion best practices
• MDX format and syntax
• Docusaurus components usage
• GitHub integration tips
        `);
        rl.prompt();
        return;
      }

      if (trimmedInput === 'components') {
        const components = getDocusaurusConverter().getAvailableComponents();
        console.log('\n📦 Available Docusaurus Components:');
        components.forEach(comp => {
          console.log(`• ${comp.name}: ${comp.description}`);
        });
        console.log('');
        rl.prompt();
        return;
      }

      try {
        const result = await chat.sendMessage(trimmedInput);
        const response = result.response;
        console.log('🤖', response.text());
      } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
      }
      
      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  });

program
  .command('components')
  .description('List available Docusaurus components')
  .action(() => {
    console.log('📦 Available Docusaurus Components:\n');
    const components = getDocusaurusConverter().getAvailableComponents();
    
    components.forEach(comp => {
      console.log(`🔸 ${comp.name}`);
      console.log(`   ${comp.description}`);
      if (comp.example) {
        console.log(`   Example: ${comp.example}`);
      }
      console.log('');
    });
  });

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}
