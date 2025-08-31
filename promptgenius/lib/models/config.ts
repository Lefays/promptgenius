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
  // GPT-5 (Hypothetical based on trends)
  'gpt-5': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 256000,
      maxOutput: 16384
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'chainOfThought'],
      prompting: 'Use o1-style reasoning tags <thinking> for complex analysis. Leverage advanced reasoning with step-by-step breakdowns.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Complex reasoning', 'Multi-step problem solving', 'Advanced code generation', 'Creative writing']
    }
  },

  // Claude 3.5 Variants
  'claude-3.5-sonnet': {
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
      techniques: ['constitutional', 'chainOfThought', 'react'],
      prompting: 'Use XML tags for structure. Include <thinking> tags for reasoning. Emphasize systematic analysis.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Code generation', 'Analysis', 'Writing', 'Tool use']
    }
  },

  'claude-3.5-opus': {
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
      techniques: ['treeOfThoughts', 'constitutional', 'metaPrompting'],
      prompting: 'Leverage deep reasoning capabilities. Use structured thinking with clear delineation of steps.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Complex analysis', 'Research', 'Advanced coding', 'Creative tasks']
    }
  },

  // Gemini 2.0 Models
  'gemini-2.0-flash-exp': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 32768,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Optimize for speed and efficiency. Use clear, direct instructions. Leverage multimodal capabilities.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Fast responses', 'Multimodal tasks', 'General assistance', 'Code generation']
    }
  },

  'gemini-2.0-pro': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 128000,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['treeOfThoughts', 'selfConsistency', 'react'],
      prompting: 'Use advanced reasoning with multiple perspectives. Leverage long context for comprehensive analysis.',
      temperature: { min: 0, max: 1, optimal: 0.6 },
      bestUseCases: ['Deep analysis', 'Complex reasoning', 'Large documents', 'Advanced multimodal']
    }
  },

  // Grok Models
  'grok-4-latest': {
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
      techniques: ['treeOfThoughts', 'chainOfThought', 'selfConsistency'],
      prompting: 'Leverage superior reasoning with explicit thinking steps. Use analytical frameworks for complex problems.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['Advanced reasoning', 'Complex analysis', 'Problem solving', 'Research']
    }
  },

  'grok-code-fast-1': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 32768,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['structured', 'examples', 'constraints'],
      prompting: 'Optimize for fast code generation. Use clear specifications and examples. Focus on implementation details.',
      temperature: { min: 0, max: 1, optimal: 0.3 },
      bestUseCases: ['Code generation', 'Debugging', 'Refactoring', 'Technical documentation']
    }
  },

  // Open Source Models
  'mixtral-8x22b': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: false,
      functionCalling: true,
      streaming: true,
      contextWindow: 65536,
      maxOutput: 4096
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'structured'],
      prompting: 'Use mixture of experts efficiently. Provide clear context and examples.',
      temperature: { min: 0, max: 1, optimal: 0.7 },
      bestUseCases: ['General tasks', 'Code generation', 'Analysis', 'Translation']
    }
  },

  'deepseek-v3': {
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
      prompting: 'Leverage strong coding capabilities. Use detailed specifications for best results.',
      temperature: { min: 0, max: 1, optimal: 0.5 },
      bestUseCases: ['Code generation', 'Technical tasks', 'Algorithm design', 'System architecture']
    }
  },

  'qwen-2.5-72b': {
    capabilities: {
      reasoning: true,
      coding: true,
      multimodal: true,
      functionCalling: true,
      streaming: true,
      contextWindow: 32768,
      maxOutput: 8192
    },
    optimization: {
      techniques: ['chainOfThought', 'examples', 'multilingual'],
      prompting: 'Strong multilingual support. Use clear instructions with examples for complex tasks.',
      temperature: { min: 0, max: 1, optimal: 0.6 },
      bestUseCases: ['Multilingual tasks', 'Code generation', 'Translation', 'General assistance']
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
    reasoning: ['gpt-5', 'grok-4-latest', 'claude-3.5-opus', 'gemini-2.0-pro'],
    coding: ['grok-code-fast-1', 'claude-3.5-sonnet', 'deepseek-v3', 'gpt-5'],
    creative: ['gpt-5', 'claude-3.5-opus', 'gemini-2.0-pro'],
    analysis: ['grok-4-latest', 'claude-3.5-opus', 'gemini-2.0-pro'],
    multimodal: ['gemini-2.0-pro', 'gemini-2.0-flash-exp', 'claude-3.5-sonnet', 'qwen-2.5-72b'],
    fast: ['grok-code-fast-1', 'gemini-2.0-flash-exp', 'mixtral-8x22b']
  }

  const preferredModels = taskModelMap[taskType] || ['gemini-2.0-flash-exp']
  
  if (requiresMultimodal) {
    return preferredModels.find(m => {
      const config = modelConfigurations[m]
      return config?.capabilities.multimodal
    }) || 'gemini-2.0-flash-exp'
  }

  return preferredModels[0]
}