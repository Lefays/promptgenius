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
  'gpt-5.4': {
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
      techniques: ['treeOfThoughts', 'selfConsistency', 'chainOfThought'],
      prompting: 'Most capable OpenAI model. Use for complex multi-step reasoning, advanced code generation, and creative tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Complex reasoning', 'Advanced code generation', 'Multi-step problem solving', 'Creative writing']
    }
  },

  'gpt-5.3-chat': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1048576,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['chainOfThought', 'selfConsistency', 'react'],
      prompting: 'Advanced conversational model. Great for dialogue, analysis, and general-purpose tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Conversation', 'Analysis', 'Code generation', 'Content creation']
    }
  },

  'gpt-5-nano': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 1048576,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Ultra-fast default model. Keep prompts simple and direct for best results.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Quick responses', 'Simple tasks', 'Classification', 'Data extraction']
    }
  },

  'gpt-5-mini': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 1048576,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Balanced speed and quality. Good for most everyday tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Code generation', 'Quick analysis', 'Content creation']
    }
  },

  'o3-pro': {
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
      prompting: 'Advanced reasoning model. Present complex problems clearly. Excels at math, science, and logic.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Advanced reasoning', 'Math and science', 'Logic problems', 'Complex coding']
    }
  },

  // Anthropic Models
  'claude-opus-4-6': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['treeOfThoughts', 'constitutional', 'metaPrompting'],
      prompting: 'Most capable Claude. Use XML tags for structure. Excels at complex multi-step tasks and deep analysis.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Complex analysis', 'Research', 'Advanced coding', 'Extended reasoning']
    }
  },

  'claude-sonnet-4-6': {
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
      prompting: 'Fast and intelligent Claude. Use XML tags for structure. Great balance of speed and capability.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Code generation', 'Analysis', 'Writing', 'Tool use']
    }
  },

  'claude-opus-4-5': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 200000,
      maxOutput: 32768
    },
    optimization: {
      techniques: ['treeOfThoughts', 'constitutional', 'chainOfThought'],
      prompting: 'Powerful reasoning model. Thorough and nuanced analysis with strong coding capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.6 },
      bestUseCases: ['Deep reasoning', 'Complex coding', 'Research', 'Creative writing']
    }
  },

  'claude-haiku-4-5': {
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
      prompting: 'Ultra-fast Claude. Use concise prompts with clear structure. Great for high-throughput tasks.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Fast responses', 'Simple analysis', 'Content generation', 'Data processing']
    }
  },

  // Google Models
  'gemini-3.1-pro-preview': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 2097152,
      maxOutput: 65536
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'react'],
      prompting: 'Google\'s most capable model. Massive context window for comprehensive analysis. Strong multimodal support.',
      temperature: { min: 0, max: 1, optimal: 0.6 },
      bestUseCases: ['Deep analysis', 'Complex reasoning', 'Large documents', 'Advanced multimodal']
    }
  },

  'gemini-3.1-flash-lite-preview': {
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
      prompting: 'Google\'s fastest model. Optimize for speed and efficiency with clear, direct instructions.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Fast responses', 'Multimodal tasks', 'General assistance', 'Code generation']
    }
  },

  'gemini-2.5-pro-preview': {
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
      techniques: ['chainOfThought', 'selfConsistency', 'react'],
      prompting: 'Strong all-rounder from Google. Good for most tasks with excellent multimodal capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Multimodal analysis', 'Code generation', 'Research']
    }
  },

  // xAI Models
  'grok-4.1-fast': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 131072,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Fast and witty. Use clear specifications. Combines speed with unique perspectives.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Quick responses', 'Creative tasks', 'Code generation', 'Conversational']
    }
  },

  'grok-4-fast': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 131072,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Powerful Grok model. Direct and intellectually honest responses with strong reasoning.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Analysis', 'Code generation', 'Creative writing', 'Problem solving']
    }
  },

  // DeepSeek Models
  'deepseek-v3.2': {
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
      prompting: 'Latest DeepSeek model. Strong reasoning and coding capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Code generation', 'Technical tasks', 'Reasoning', 'Problem solving']
    }
  },

  'deepseek-r1-0528': {
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
  },

  // Mistral Models
  'mistral-medium-2508': {
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
      prompting: 'Powerful Mistral model. Strong multilingual support and technical capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Multilingual tasks', 'Code generation', 'Analysis', 'General assistance']
    }
  },

  'mistral-small-2603': {
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
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Fast Mistral model. Efficient for everyday tasks with good multilingual support.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Quick tasks', 'Multilingual', 'Code generation', 'Content creation']
    }
  },

  // Qwen Models
  'qwen3.5-72b': {
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
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Strong open-weight model from Alibaba. Good for diverse tasks and multilingual support.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Code generation', 'Multilingual', 'Analysis']
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
    reasoning: ['o3-pro', 'gpt-5.4', 'claude-opus-4-6', 'gemini-3.1-pro-preview'],
    coding: ['gpt-5.4', 'claude-opus-4-6', 'deepseek-v3.2', 'claude-sonnet-4-6'],
    creative: ['gpt-5.4', 'claude-opus-4-6', 'gemini-3.1-pro-preview'],
    analysis: ['o3-pro', 'claude-opus-4-6', 'gemini-3.1-pro-preview'],
    multimodal: ['gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview', 'claude-opus-4-6', 'gpt-5.4'],
    fast: ['gpt-5-nano', 'gemini-3.1-flash-lite-preview', 'claude-haiku-4-5', 'grok-4.1-fast']
  }

  const preferredModels = taskModelMap[taskType] || ['gpt-5-nano']

  if (requiresMultimodal) {
    return preferredModels.find(m => {
      const config = modelConfigurations[m]
      return config?.capabilities.multimodal
    }) || 'gemini-3.1-flash-lite-preview'
  }

  return preferredModels[0]
}
