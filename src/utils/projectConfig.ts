export interface ProjectConfig {
  repoUrl: string;
  language?: string;
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
    language: 'TypeScript',
  },
];
