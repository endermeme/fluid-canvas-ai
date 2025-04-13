
export interface MiniGame {
  title?: string;
  description?: string;
  content?: string;
  items?: any[];
  settings?: any;
}

export interface AIGameGeneratorOptions {
  apiKey: string;
  modelName?: string;
}
