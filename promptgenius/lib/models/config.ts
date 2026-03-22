export interface ModelCapabilities {
  reasoning: boolean
  coding: boolean
  multimodal: boolean
  functionCalling: boolean
  streaming: boolean
  contextWindow: number
  maxOutput: number
}

export interface ModelOptimization {
  techniques: string[]
  prompting: string
  temperature: { min: number; max: number; optimal: number }
  bestUseCases: string[]
}

export const modelConfigurations: Record<string, { capabilities: ModelCapabilities; optimization: ModelOptimization }> = {
  // OpenAI Models
  'gpt-4.1': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1047576,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'chainOfThought'],
      prompting: 'Leverage advanced instruction following. Use step-by-step reasoning for complex analysis. Structured prompts with clear constraints.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Complex reasoning', 'Advanced code generation', 'Multi-step problem solving', 'Creative writing']
    }
  },

  'gpt-4.1-mini': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1047576,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Efficient and fast. Use concise, direct instructions. Good balance of quality and speed.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Code generation', 'Quick analysis', 'Content creation']
    }
  },

  'gpt-4.1-nano': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 1047576,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Ultra-fast responses. Keep prompts simple and direct. Best for straightforward tasks.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Quick responses', 'Simple tasks', 'Classification', 'Data extraction']
    }
  },

  'gpt-4o': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['chainOfThought', 'selfConsistency', 'react'],
      prompting: 'Great all-rounder. Use detailed instructions with examples. Supports vision and audio inputs.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Multimodal tasks', 'General assistance', 'Code generation', 'Analysis']
    }
  },

  'o3-mini': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 100000
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'chainOfThought'],
      prompting: 'Advanced reasoning model. Present complex problems clearly. Excels at math, science, and logic puzzles.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Advanced reasoning', 'Math and science', 'Logic problems', 'Complex coding']
    }
  },

  // Anthropic Models
  'claude-sonnet-4-20250514': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['constitutional', 'chainOfThought', 'react'],
      prompting: 'Use XML tags for structure. Emphasize systematic analysis and clear reasoning. Balanced capability and speed.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Code generation', 'Analysis', 'Writing', 'Tool use']
    }
  },

  'claude-3-7-sonnet-latest': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['treeOfThoughts', 'constitutional', 'metaPrompting'],
      prompting: 'Supports extended thinking for deep analysis. Use XML tags for structure. Excels at complex multi-step tasks.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Complex analysis', 'Research', 'Advanced coding', 'Extended reasoning']
    }
  },

  'claude-3-5-haiku-latest': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Fast and efficient Claude. Use concise prompts with clear structure. Great for high-throughput tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Fast responses', 'Simple analysis', 'Content generation', 'Data processing']
    }
  },

  // Google Models
  'gemini-2.0-flash': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1048576,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Optimize for speed and efficiency. Use clear, direct instructions. Leverage multimodal capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Fast responses', 'Multimodal tasks', 'General assistance', 'Code generation']
    }
  },

  'gemini-2.5-pro-preview-06-05': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1048576,
      maxOutput: 65536
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'react'],
      prompting: 'Use advanced reasoning with multiple perspectives. Leverage massive context window for comprehensive analysis.',
      temperature: { min: 0, max: 1, optimal: 0.6 },
      bestUseCases: ['Deep analysis', 'Complex reasoning', 'Large documents', 'Advanced multimodal']
    }
  },

  // xAI Models
  'grok-3-mini-fast': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 131072,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Optimize for fast responses. Use clear specifications and examples. Focus on direct answers.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Quick responses', 'General tasks', 'Code generation', 'Conversational']
    }
  },

  // Meta Models
  'llama-4-maverick': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Strong open-weight model. Use clear instructions with examples. Good for diverse tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Code generation', 'Analysis', 'Creative writing']
    }
  },

  // Mistral Models
  'mistral-large-latest': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Powerful European AI model. Use clear context and examples. Strong multilingual support.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Multilingual tasks', 'Code generation', 'Analysis', 'General assistance']
    }
  },

  // DeepSeek Models
  'deepseek-chat': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'structured', 'constraints'],
      prompting: 'Strong reasoning and coding capabilities. Use detailed specifications for best results.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Code generation', 'Technical tasks', 'Reasoning', 'Problem solving']
    }
  },

  'deepseek-r1': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'chainOfThought'],
      prompting: 'Research-focused reasoning model. Present problems clearly for deep analysis. Excels at math and logic.',
      temperature: { min: 0, max: 1, optimal: 0.3 },
      bestUseCases: ['Research', 'Math and science', 'Complex reasoning', 'Algorithm design']
    }
  }
}

export function getOptimalSettings(modelId: string, taskType: string): { temperature: number; techniques: string[] } {
  const config = modelConfigurations[modelId]
  if (!config) {
    return { temperature: 0.7, techniques: ['chainOfThought'] }
  }

  // Adjust temperature based on task type
  let temperature = config.optimization.temperature.optimal
  if (taskType === 'creative') {
    temperature = Math.min(config.optimization.temperature.max, temperature + 0.2)
  } else if (taskType === 'analytical' || taskType === 'coding') {
    temperature = Math.max(config.optimization.temperature.min, temperature - 0.2)
  }

  return {
    temperature,
    techniques: config.optimization.techniques
  }
}

export function getModelPromptingGuide(modelId: string): string {
  const config = modelConfigurations[modelId]
  return config?.optimization.prompting || 'Use clear, structured instructions with examples where helpful.'
}

export function getBestModelForTask(taskType: string, requiresMultimodal: boolean = false): string {
  const taskModelMap: Record<string, string[]> = {
    reasoning: ['o3-mini', 'gpt-4.1', 'claude-3-7-sonnet-latest', 'gemini-2.5-pro-preview-06-05'],
    coding: ['gpt-4.1', 'claude-sonnet-4-20250514', 'deepseek-chat', 'deepseek-r1'],
    creative: ['gpt-4.1', 'claude-sonnet-4-20250514', 'gemini-2.5-pro-preview-06-05'],
    analysis: ['o3-mini', 'claude-3-7-sonnet-latest', 'gemini-2.5-pro-preview-06-05'],
    multimodal: ['gemini-2.5-pro-preview-06-05', 'gemini-2.0-flash', 'claude-sonnet-4-20250514', 'gpt-4o'],
    fast: ['gpt-4.1-nano', 'gemini-2.0-flash', 'grok-3-mini-fast']
  }

  const preferredModels = taskModelMap[taskType] || ['gemini-2.0-flash']

  if (requiresMultimodal) {
    return preferredModels.find(m => {
      const config = modelConfigurations[m]
      return config?.capabilities.multimodal
    }) || 'gemini-2.0-flash'
  }

  return preferredModels[0]
}