
import { GameSettingsData } from '../types';

export interface MiniGame {
  title: string;
  description: string;
  content: string;
}

export interface AIGameGeneratorOptions {
  apiKey: string;
  modelName?: string;
}
