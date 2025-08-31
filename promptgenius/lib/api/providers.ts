// Simplified providers - Puter only for free AI access

export const puterModels = [
  { id: "gpt-4o", name: "GPT-4o", description: "OpenAI's most capable" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient" },
  { id: "gpt-5-chat-latest", name: "GPT-5 Chat", description: "Latest GPT model" },
  { id: "claude-opus-4-latest", name: "Claude Opus 4", description: "Most powerful Claude" },
  { id: "claude-sonnet-4-latest", name: "Claude Sonnet 4", description: "Balanced Claude" },
  { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", description: "Latest Sonnet" },
  { id: "grok-3", name: "Grok 3", description: "Fast responses" },
  { id: "mistral-large-latest", name: "Mistral Large", description: "Powerful Mistral" },
  { id: "mistral-medium-latest", name: "Mistral Medium", description: "Balanced Mistral" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Google's fast model" }
]

export const availableModels = puterModels

export function getModelMapping(modelId: string): string {
  // Puter uses the model ID directly without prefixes
  // Just return the modelId as-is since Puter expects strings like "gpt-4o", "claude-opus-4-latest", etc.
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