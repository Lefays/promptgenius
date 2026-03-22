// Simplified providers - Puter only for free AI access

export const puterModels = [
  // OpenAI
  { id: "gpt-4.1", name: "GPT-4.1", description: "Most capable OpenAI model" },
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", description: "Fast and efficient" },
  { id: "gpt-4.1-nano", name: "GPT-4.1 Nano", description: "Ultra-fast, lightweight" },
  { id: "gpt-4o", name: "GPT-4o", description: "Great all-rounder" },
  { id: "o3-mini", name: "o3 Mini", description: "Advanced reasoning" },
  // Anthropic
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", description: "Latest balanced Claude" },
  { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet", description: "Extended thinking" },
  { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku", description: "Fast Claude" },
  // Google
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Google's fastest" },
  { id: "gemini-2.5-pro-preview-06-05", name: "Gemini 2.5 Pro", description: "Google's most capable" },
  // xAI
  { id: "grok-3-mini-fast", name: "Grok 3 Mini Fast", description: "Quick responses" },
  // Meta
  { id: "llama-4-maverick", name: "Llama 4 Maverick", description: "Meta's latest" },
  // Mistral
  { id: "mistral-large-latest", name: "Mistral Large", description: "Powerful Mistral" },
  // DeepSeek
  { id: "deepseek-chat", name: "DeepSeek Chat", description: "Strong reasoning" },
  { id: "deepseek-r1", name: "DeepSeek R1", description: "Research model" },
]

export const availableModels = puterModels

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