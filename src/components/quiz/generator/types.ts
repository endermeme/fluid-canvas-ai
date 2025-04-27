
export interface MiniGame {
  title: string;
  content: string;
  useCanvas?: boolean;
  html?: string; // HTML component
  css?: string;  // CSS component
  js?: string;   // JavaScript component
  rawResponse?: string; // API raw response
}

export interface GameApiResponse {
  success: boolean;
  game?: MiniGame;
  error?: string;
}

export interface PromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}
