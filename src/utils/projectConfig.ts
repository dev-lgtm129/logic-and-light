export interface ProjectConfig {
  repoUrl: string;
}

export const parseRepoName = (url: string): string => {
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    return parts[parts.length - 1] || 'Project';
  } catch {
    return 'Project';
  }
};

export const PROJECTS: ProjectConfig[] = [
  {
    repoUrl: 'https://github.com/dev-lgtm129/MoodMix',
  },
  {
    repoUrl: 'https://github.com/dev-lgtm129/logic-and-light',
  },
];
