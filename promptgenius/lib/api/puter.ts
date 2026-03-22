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
  'gpt-4.1': { name: 'GPT-4.1', provider: 'OpenAI', description: 'Most capable OpenAI model' },
  'gpt-4.1-mini': { name: 'GPT-4.1 Mini', provider: 'OpenAI', description: 'Fast and efficient' },
  'gpt-4.1-nano': { name: 'GPT-4.1 Nano', provider: 'OpenAI', description: 'Ultra-fast, lightweight' },
  'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI', description: 'Great all-rounder' },
  'o3-mini': { name: 'o3 Mini', provider: 'OpenAI', description: 'Advanced reasoning' },
  // Anthropic Models
  'claude-sonnet-4-20250514': { name: 'Claude Sonnet 4', provider: 'Anthropic', description: 'Latest balanced Claude' },
  'claude-3-7-sonnet-latest': { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', description: 'Extended thinking' },
  'claude-3-5-haiku-latest': { name: 'Claude 3.5 Haiku', provider: 'Anthropic', description: 'Fast Claude' },
  // Google Models
  'gemini-2.0-flash': { name: 'Gemini 2.0 Flash', provider: 'Google', description: 'Google\'s fastest' },
  'gemini-2.5-pro-preview-06-05': { name: 'Gemini 2.5 Pro', provider: 'Google', description: 'Google\'s most capable' },
  // xAI Models
  'grok-3-mini-fast': { name: 'Grok 3 Mini Fast', provider: 'xAI', description: 'Quick responses' },
  // Meta Models
  'llama-4-maverick': { name: 'Llama 4 Maverick', provider: 'Meta', description: 'Meta\'s latest' },
  // Mistral Models
  'mistral-large-latest': { name: 'Mistral Large', provider: 'Mistral', description: 'Powerful Mistral' },
  // DeepSeek Models
  'deepseek-chat': { name: 'DeepSeek Chat', provider: 'DeepSeek', description: 'Strong reasoning' },
  'deepseek-r1': { name: 'DeepSeek R1', provider: 'DeepSeek', description: 'Research model' },
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
      model: 'gpt-4.1-mini',
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

// Helper function to generate prompts using Puter's free API
export async function generateWithPuter(
  userInput: string,
  style: string,
  format: string,
  temperature: number,
  maxTokens: number,
  modelId: string = 'gpt-4.1-mini'
): Promise<string> {
  const systemPrompt = createPuterSystemPrompt(userInput, style, format, temperature, maxTokens, modelId);
  
  return puterAPI.generatePrompt(systemPrompt, userInput, {
    model: modelId,
    temperature,
    maxTokens
  });
}

function createPuterSystemPrompt(
  userInput: string,
  style: string,
  format: string,
  temperature: number,
  maxTokens: number,
  modelId: string
): string {
  const modelInfo = PUTER_MODELS[modelId as keyof typeof PUTER_MODELS];
  const isGrok = modelId.includes('grok');
  const isClaude = modelId.includes('claude');
  const isGPT = modelId.includes('gpt');

  let modelSpecific = '';
  
  if (isGrok) {
    modelSpecific = `
**Grok-Specific Optimization:**
- Use your unique wit and engaging personality
- Balance humor with technical accuracy
- Provide unexpected insights and perspectives
- Be direct and intellectually honest`;
  } else if (isClaude) {
    modelSpecific = `
**Claude-Specific Optimization:**
- Use structured thinking with XML tags where helpful
- Emphasize systematic analysis and clear reasoning
- Be thorough and considerate of nuance
- Maintain high ethical standards`;
  } else if (isGPT) {
    modelSpecific = `
**GPT-Specific Optimization:**
- Leverage comprehensive knowledge base
- Use step-by-step reasoning for complex tasks
- Provide detailed explanations with examples
- Maintain professional tone`;
  }

  return `You are an expert AI prompt engineer. Generate a professional, structured prompt based on the user's requirements.

**CRITICAL RULES:**
- NEVER include meta-commentary like "Here's a prompt for...", "This prompt will...", or "I've created..."
- Start DIRECTLY with the role definition or task assignment
- Output ONLY the prompt itself, ready to be copied and used immediately
- Use clear section headers with ** markdown formatting
- Write as if you ARE the AI being instructed, not talking about the prompt

**USER REQUIREMENTS:**
Target Model: ${modelInfo?.name || modelId} (${modelInfo?.provider || 'AI'})
Style: ${style}
Format: ${format}
Temperature: ${temperature} (0=precise, 1=creative)
Max Tokens: ${maxTokens}
Task Description: "${userInput || 'General assistance'}"

${modelSpecific}

**PROMPT STRUCTURE TO FOLLOW:**
1. Begin with direct role assignment ("You are a/an..." or direct task statement)
2. Include these sections as appropriate:
   - **Instructions:** Clear, numbered steps or bullet points
   - **Constraints:** Specific dos and don'ts
   - **Expected Output Format:** Exact structure required
   - **Examples:** Input/output pairs when helpful
   - **Tone and Style:** Voice and approach guidelines

**QUALITY CRITERIA:**
- Professional and immediately usable
- No preambles, explanations, or meta-commentary
- Structured with bold section headers
- Specific and actionable instructions
- Optimized for ${modelInfo?.name || modelId}'s specific capabilities
- Match the ${style} style and ${format} format exactly

Generate the prompt now - remember, output ONLY the prompt itself, starting directly with the role or task:`;
}