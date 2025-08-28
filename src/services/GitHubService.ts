import { Octokit } from "octokit";

export interface CreatePROptions {
  owner: string;
  repo: string;
  filePath: string;
  content: string;
  commitMessage: string;
  prTitle: string;
  prDescription?: string;
  branchName?: string;
}

export interface CreatePRResult {
  pullRequestUrl: string;
  branchName: string;
  commitSha: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    if (!token) {
      throw new Error("GitHub token is required");
    }
    
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async createPullRequestWithContent(options: CreatePROptions): Promise<CreatePRResult> {
    const {
      owner,
      repo,
      filePath,
      content,
      commitMessage,
      prTitle,
      prDescription = "Automated documentation update via MDX-GDocs MCP Server",
      branchName = `mdx-docs-${Date.now()}`,
    } = options;

    try {
      // Get the default branch
      const { data: repository } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });
      const defaultBranch = repository.default_branch;

      // Get the SHA of the default branch
      const { data: defaultBranchRef } = await this.octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
      });
      const defaultBranchSha = defaultBranchRef.object.sha;

      // Create a new branch
      await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: defaultBranchSha,
      });

      // Check if file already exists
      let fileSha: string | undefined;
      try {
        const { data: existingFile } = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branchName,
        });
        
        if ("sha" in existingFile) {
          fileSha = existingFile.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine
      }

      // Create or update the file
      const { data: commit } = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(content).toString("base64"),
        branch: branchName,
        sha: fileSha,
      });

      // Create the pull request
      const { data: pullRequest } = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title: prTitle,
        head: branchName,
        base: defaultBranch,
        body: prDescription,
      });

      return {
        pullRequestUrl: pullRequest.html_url,
        branchName,
        commitSha: commit.commit.sha || "",
      };
    } catch (error) {
      throw new Error(`Failed to create GitHub PR: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async checkRepositoryAccess(owner: string, repo: string): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({
        owner,
        repo,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async listRepositoryFiles(owner: string, repo: string, path: string = ""): Promise<string[]> {
    try {
      const { data: contents } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(contents)) {
        return contents.map(item => item.name);
      } else {
        return [contents.name];
      }
    } catch (error) {
      throw new Error(`Failed to list repository files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
