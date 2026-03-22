// Puter.js API wrapper for free, unlimited AI access
// No API keys required!

interface PuterUser {
  username?: string;
  is_temp?: boolean;
}

interface PuterAuth {
  getUser: () => Promise<PuterUser | null>;
  signIn: () => Promise<void>;
}

interface PuterAI {
  chat: (prompt: string | Array<{ role: string; content: string }>, options?: Record<string, unknown>) => Promise<PuterAIResponse | AsyncGenerator<PuterStreamPart>>;
  txt2img?: (prompt: string, options?: Record<string, unknown>) => Promise<any>;
  listModels?: (filter?: string) => Promise<any[]>;
}

interface Puter {
  auth: PuterAuth;
  ai: PuterAI;
}

declare global {
  interface Window {
    puter: Puter;
  }
}

export interface PuterAIResponse {
  message: {
    content: string;
    role: string;
  };
}

export interface PuterStreamPart {
  text: string;
}

export const PUTER_MODELS = {
  // OpenAI Models
  'gpt-5.4': { name: 'GPT-5.4', provider: 'OpenAI', description: 'Most capable OpenAI model' },
  'gpt-5.3-chat': { name: 'GPT-5.3 Chat', provider: 'OpenAI', description: 'Advanced conversational AI' },
  'gpt-5-nano': { name: 'GPT-5 Nano', provider: 'OpenAI', description: 'Fast and lightweight (default)' },
  'gpt-5-mini': { name: 'GPT-5 Mini', provider: 'OpenAI', description: 'Balanced speed and quality' },
  'o3-pro': { name: 'o3 Pro', provider: 'OpenAI', description: 'Advanced reasoning' },
  // Anthropic Models
  'claude-opus-4-6': { name: 'Claude Opus 4.6', provider: 'Anthropic', description: 'Most capable Claude' },
  'claude-sonnet-4-6': { name: 'Claude Sonnet 4.6', provider: 'Anthropic', description: 'Fast and intelligent' },
  'claude-opus-4-5': { name: 'Claude Opus 4.5', provider: 'Anthropic', description: 'Powerful reasoning' },
  'claude-haiku-4-5': { name: 'Claude Haiku 4.5', provider: 'Anthropic', description: 'Ultra-fast Claude' },
  // Google Models
  'gemini-3.1-pro-preview': { name: 'Gemini 3.1 Pro', provider: 'Google', description: 'Google\'s most capable' },
  'gemini-3.1-flash-lite-preview': { name: 'Gemini 3.1 Flash Lite', provider: 'Google', description: 'Google\'s fastest' },
  'gemini-2.5-pro-preview': { name: 'Gemini 2.5 Pro', provider: 'Google', description: 'Strong all-rounder' },
  // xAI Models
  'grok-4.1-fast': { name: 'Grok 4.1 Fast', provider: 'xAI', description: 'Fast and witty' },
  'grok-4-fast': { name: 'Grok 4 Fast', provider: 'xAI', description: 'Powerful Grok' },
  // DeepSeek Models
  'deepseek-v3.2': { name: 'DeepSeek v3.2', provider: 'DeepSeek', description: 'Latest DeepSeek' },
  'deepseek-r1-0528': { name: 'DeepSeek R1', provider: 'DeepSeek', description: 'Research reasoning' },
  // Mistral Models
  'mistral-medium-2508': { name: 'Mistral Medium 3.1', provider: 'Mistral', description: 'Powerful Mistral' },
  'mistral-small-2603': { name: 'Mistral Small 4', provider: 'Mistral', description: 'Fast Mistral' },
  // Qwen Models
  'qwen3.5-72b': { name: 'Qwen 3.5 72B', provider: 'Qwen', description: 'Strong open model' },
};

export class PuterAPI {
  private static instance: PuterAPI;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): PuterAPI {
    if (!PuterAPI.instance) {
      PuterAPI.instance = new PuterAPI();
    }
    return PuterAPI.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        reject(new Error('Puter.js can only be used in browser environment'));
        return;
      }

      // Check if Puter is already loaded
      if (window.puter) {
        this.initialized = true;
        resolve();
        return;
      }

      // Load Puter.js dynamically
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      
      script.onload = () => {
        // Wait a bit for puter to initialize
        setTimeout(() => {
          if (window.puter) {
            this.initialized = true;
            resolve();
          } else {
            reject(new Error('Failed to initialize Puter.js'));
          }
        }, 100);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Puter.js'));
      };

      document.head.appendChild(script);
    });

    return this.initPromise;
  }

  async chat(
    prompt: string | Array<{ role: string; content: string }>,
    options: {
      model?: string;
      stream?: boolean;
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<PuterAIResponse | AsyncGenerator<PuterStreamPart>> {
    await this.initialize();

    if (!window.puter) {
      throw new Error('Puter.js not available');
    }

    const defaultOptions = {
      model: 'gpt-5-nano',
      stream: false,
      ...options
    };

    // Puter.js accepts model IDs directly
    const puterModel = defaultOptions.model;

    try {
      const response = await window.puter.ai.chat(prompt, {
        ...defaultOptions,
        model: puterModel
      });
      
      return response;
    } catch (error) {
      console.error('Puter API error:', error);
      throw error;
    }
  }

  async generatePrompt(
    systemPrompt: string,
    userInput?: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (userInput) {
      messages.push({
        role: 'user',
        content: userInput
      });
    }

    const response = await this.chat(messages, {
      model: options?.model || 'gpt-4.1-mini',
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      stream: false
    }) as PuterAIResponse;

    return response.message.content;
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.puter;
  }

  getAvailableModels(): typeof PUTER_MODELS {
    return PUTER_MODELS;
  }
}

export const puterAPI = PuterAPI.getInstance();