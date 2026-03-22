// Simplified providers - Puter only for free AI access

export const puterModels = [
  // OpenAI
  { id: "gpt-5.4", name: "GPT-5.4", description: "Most capable OpenAI model" },
  { id: "gpt-5.3-chat", name: "GPT-5.3 Chat", description: "Advanced conversational AI" },
  { id: "gpt-5-nano", name: "GPT-5 Nano", description: "Fast and lightweight (default)" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", description: "Balanced speed and quality" },
  { id: "o3-pro", name: "o3 Pro", description: "Advanced reasoning" },
  // Anthropic
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", description: "Most capable Claude" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", description: "Fast and intelligent" },
  { id: "claude-opus-4-5", name: "Claude Opus 4.5", description: "Powerful reasoning" },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", description: "Ultra-fast Claude" },
  // Google
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", description: "Google's most capable" },
  { id: "gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash Lite", description: "Google's fastest" },
  { id: "gemini-2.5-pro-preview", name: "Gemini 2.5 Pro", description: "Strong all-rounder" },
  // xAI
  { id: "grok-4.1-fast", name: "Grok 4.1 Fast", description: "Fast and witty" },
  { id: "grok-4-fast", name: "Grok 4 Fast", description: "Powerful Grok" },
  // DeepSeek
  { id: "deepseek-v3.2", name: "DeepSeek v3.2", description: "Latest DeepSeek" },
  { id: "deepseek-r1-0528", name: "DeepSeek R1", description: "Research reasoning" },
  // Mistral
  { id: "mistral-medium-2508", name: "Mistral Medium 3.1", description: "Powerful Mistral" },
  { id: "mistral-small-2603", name: "Mistral Small 4", description: "Fast Mistral" },
  // Qwen
  { id: "qwen3.5-72b", name: "Qwen 3.5 72B", description: "Strong open model" },
]

export const availableModels = puterModels

// Models that don't support custom temperature (reasoning models, fixed-temp models)
export const noTemperatureModels = [
  'o3-pro',
  'gpt-5-mini',
  'gpt-5-nano',
  'gpt-5.3-chat',
  'gpt-5.4',
  'deepseek-r1-0528',
]

export function supportsTemperature(modelId: string): boolean {
  return !noTemperatureModels.includes(modelId)
}

export function getModelMapping(modelId: string): string {
  // Puter uses the model ID directly without prefixes
  // Just return the modelId as-is since Puter expects model ID strings directly
  return modelId
}

export function createSystemPrompt(promptType: string): string {
  const prompts: Record<string, string> = {
    default: "You are a helpful assistant.",
    creative: "You are a creative writing assistant with a focus on imagination and storytelling.",
    technical: "You are a technical expert assistant focused on providing accurate and detailed technical information.",
    business: "You are a business consultant focused on professional and strategic advice."
  }
  
  return prompts[promptType] || prompts.default
}

interface Message {
  role: string;
  content: string;
}

export class AIProviderService {
  static async generatePrompt(model: string, messages: Message[]) {
    // This would be implemented based on the provider
    // For now, using Puter API
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages })
    })
    
    return response.json()
  }
}