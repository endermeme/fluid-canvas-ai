/**
 * Game Generator - Module tạo game sử dụng Gemini API
 * 
 * Module này quản lý quá trình tạo game từ Gemini API, xử lý lỗi,
 * và cung cấp các phương pháp dự phòng khi API không hoạt động
 */

import { GameSettingsData } from '../shared/types';
import { getGameTypeByTopic } from '../shared/gameTypes';
import { logInfo, logError, logWarning, logSuccess } from './apiUtils';
import { GEMINI_MODELS } from '@/constants/api-constants';
import { createGamePrompt } from './promptManager';
import { callGeminiAPI } from './geminiClient';
import { processGameCode, createFallbackGameHtml } from './gameProcessor';
import type { MiniGame, GameApiResponse } from './types';

const SOURCE = "GAME_GENERATOR";

export class GameGenerator {
  private static instance: GameGenerator | null = null;
  private useCanvasMode: boolean = true;
  private lastGeneratedGame: MiniGame | null = null;
  
  private constructor() {}
  
  public static getInstance(): GameGenerator {
    if (!GameGenerator.instance) {
      GameGenerator.instance = new GameGenerator();
    }
    return GameGenerator.instance;
  }
  
  public setCanvasMode(useCanvas: boolean): void {
    this.useCanvasMode = useCanvas;
  }
  
  public getLastGeneratedGame(): MiniGame | null {
    return this.lastGeneratedGame;
  }
  
  public async generateGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      logInfo(SOURCE, `Starting game generation for topic: "${topic}"`, {
        settings: settings || {},
        canvasMode: this.useCanvasMode ? "enabled" : "disabled"
      });
      
      const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : this.useCanvasMode;
      const gameType = getGameTypeByTopic(topic);
      
      logInfo(SOURCE, `Generating ${useCanvas ? 'Canvas' : 'DOM'} game`, {
        topic,
        gameType: gameType?.name || "unknown"
      });
      
      const prompt = createGamePrompt({
        topic,
        useCanvas,
        language: settings?.language || 'en',
        difficulty: settings?.difficulty || 'medium',
        category: settings?.category || 'general'
      });
      
      logInfo(SOURCE, "Calling Gemini API");
      
      const response = await callGeminiAPI({
        prompt,
        model: GEMINI_MODELS.CUSTOM_GAME,
        temperature: 0.7
      });
      
      if (!response.success || !response.content) {
        throw new Error(response.error || "Empty response from API");
      }
      
      logSuccess(SOURCE, "API call completed successfully", {
        contentLength: response.content.length,
        metrics: response.metrics
      });
      
      const { title, content } = processGameCode(response.content);
      
      const game: MiniGame = {
        title: title || topic,
        content,
        useCanvas
      };
      
      this.lastGeneratedGame = game;
      
      logSuccess(SOURCE, "Game generated successfully", {
        title: game.title,
        contentLength: game.content.length
      });
      
      return game;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError(SOURCE, `Game generation failed: ${errorMessage}`, error);
      
      return this.createFallbackGame(topic, settings);
    }
  }
  
  private createFallbackGame(topic: string, settings?: GameSettingsData): MiniGame {
    const useCanvas = settings?.useCanvas !== undefined ? settings.useCanvas : this.useCanvasMode;
    
    logWarning(SOURCE, "Using fallback game due to API error");
    
    const fallbackContent = createFallbackGameHtml(topic, useCanvas);
    
    const fallbackGame: MiniGame = {
      title: `Game về ${topic}`,
      content: fallbackContent,
      useCanvas
    };
    
    this.lastGeneratedGame = fallbackGame;
    
    logSuccess(SOURCE, "Created fallback game", {
      title: fallbackGame.title,
      contentLength: fallbackGame.content.length,
      fallback: true
    });
    
    return fallbackGame;
  }
}

export class AIGameGenerator {
  private static instance: AIGameGenerator | null = null;
  private gameGenerator: GameGenerator;
  
  private constructor() {
    this.gameGenerator = GameGenerator.getInstance();
  }
  
  public static getInstance(): AIGameGenerator {
    if (!AIGameGenerator.instance) {
      AIGameGenerator.instance = new AIGameGenerator();
    }
    return AIGameGenerator.instance;
  }
  
  public setCanvasMode(mode: boolean): void {
    this.gameGenerator.setCanvasMode(mode);
  }
  
  public async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    return this.gameGenerator.generateGame(topic, settings);
  }
}

export async function generateGameFromTopic(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
  return GameGenerator.getInstance().generateGame(topic, settings);
}

export default {
  GameGenerator,
  AIGameGenerator,
  generateGameFromTopic
};
