
export interface CustomGameResponse {
  html: string;
  css: string;
  javascript: string;
  title?: string;
}

export interface CustomGameState {
  loading: boolean;
  error: string | null;
  content: CustomGameResponse | null;
}
