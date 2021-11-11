export interface CodeLanguages {
  languages: string[];
  config: {
    filetype: string;
    filename: string;
    options: { theme: string; language: string };
  };
} 