export interface PromptTemplate {
  name: string
  description: string
  structure: string[]
  example?: string
}

export const promptTemplates: { [key: string]: PromptTemplate } = {
  aiAgent: {
    name: "AI Agent",
    description: "For creating autonomous AI agents with specific capabilities",
    structure: [
      "Agent role and core competencies",
      "**Primary Objective:** Main goal or purpose",
      "**Capabilities:** List of abilities and tools",
      "**Decision Framework:** How to make choices",
      "**Workflow:** Step-by-step process",
      "**Success Metrics:** How to measure performance",
      "**Constraints:** Boundaries and limitations",
      "**Error Handling:** Recovery strategies"
    ],
    example: "You are an autonomous [type] agent capable of [abilities]. Your goal is to [objective] by [methods]."
  },

  ragSystem: {
    name: "RAG System",
    description: "For retrieval-augmented generation tasks",
    structure: [
      "RAG system role",
      "**Knowledge Base:** Available information sources",
      "**Retrieval Strategy:** How to find relevant info",
      "**Context Integration:** How to use retrieved data",
      "**Response Generation:** Creating answers",
      "**Citation Format:** How to reference sources",
      "**Fallback Strategy:** When info is not available"
    ]
  },

  functionCalling: {
    name: "Function Calling",
    description: "For AI that uses tools and functions",
    structure: [
      "Tool-using AI role",
      "**Available Functions:** List of callable functions",
      "**Function Selection:** When to use each tool",
      "**Parameter Extraction:** How to determine inputs",
      "**Result Processing:** How to use outputs",
      "**Error Recovery:** Handling failed calls",
      "**Chaining Strategy:** Combining multiple tools"
    ]
  },

  analytical: {
    name: "Analytical Task",
    description: "For data analysis, research, and systematic evaluation",
    structure: [
      "Role definition with expertise area",
      "**Objective:** Clear statement of the analytical goal",
      "**Data/Context:** Information to be analyzed",
      "**Methodology:** Step-by-step analytical approach",
      "**Evaluation Criteria:** Metrics or standards to apply",
      "**Output Requirements:** Format and structure of analysis",
      "**Constraints:** Limitations or considerations"
    ],
    example: "You are a data analyst specializing in [domain]. Your task is to analyze [data/situation] and provide insights on [specific questions]."
  },

  creative: {
    name: "Creative Generation",
    description: "For content creation, storytelling, and creative writing",
    structure: [
      "Creative role or persona",
      "**Creative Brief:** Task and desired outcome",
      "**Tone and Style:** Voice, mood, and approach",
      "**Target Audience:** Who this is for",
      "**Key Elements:** Must-include components",
      "**Inspiration/Examples:** Reference points",
      "**Constraints:** Length, format, restrictions"
    ]
  },

  instructional: {
    name: "Step-by-Step Guide",
    description: "For tutorials, how-tos, and educational content",
    structure: [
      "Expert instructor role",
      "**Learning Objective:** What the user will achieve",
      "**Prerequisites:** Required knowledge or tools",
      "**Instructions:** Numbered steps with clear actions",
      "**Tips and Best Practices:** Pro advice",
      "**Common Pitfalls:** What to avoid",
      "**Success Criteria:** How to verify completion"
    ]
  },

  problemSolving: {
    name: "Problem Solver",
    description: "For debugging, troubleshooting, and solution finding",
    structure: [
      "Technical expert role",
      "**Problem Statement:** Clear description of the issue",
      "**Context:** System, environment, or situation",
      "**Symptoms:** Observable problems or errors",
      "**Attempted Solutions:** What has been tried",
      "**Constraints:** Limitations or requirements",
      "**Expected Outcome:** Definition of success"
    ]
  },

  comparison: {
    name: "Comparative Analysis",
    description: "For comparing options, products, or approaches",
    structure: [
      "Subject matter expert role",
      "**Items to Compare:** List of options",
      "**Evaluation Criteria:** Factors to consider",
      "**Context:** Use case or requirements",
      "**Scoring Method:** How to weight factors",
      "**Output Format:** Table, prose, or ranked list",
      "**Recommendation:** Final suggestion with rationale"
    ]
  }
}

export const advancedTechniques = {
  treeOfThoughts: {
    name: "Tree of Thoughts",
    description: "Explore multiple reasoning paths",
    template: "**Reasoning Approach:**\n1. Generate 3 different approaches\n2. Evaluate each approach:\n   - Pros: [advantages]\n   - Cons: [disadvantages]\n   - Likelihood of success: [rating]\n3. Select the best path or combine approaches\n4. Execute the chosen strategy"
  },

  selfConsistency: {
    name: "Self-Consistency",
    description: "Generate multiple solutions and select the best",
    template: "**Multi-Solution Approach:**\n1. Generate 3 independent solutions\n2. Compare for consistency\n3. Identify common elements\n4. Synthesize the most robust answer\n5. Validate against requirements"
  },

  react: {
    name: "ReAct Pattern",
    description: "Reasoning and acting in interleaved fashion",
    template: "**ReAct Loop:**\nThought: [Current reasoning about the task]\nAction: [Specific action to take]\nObservation: [Result of the action]\nThought: [Updated reasoning]\n... (repeat until complete)\nFinal Answer: [Synthesized solution]"
  },

  constitutional: {
    name: "Constitutional AI",
    description: "Self-critique and improvement",
    template: "**Constitutional Framework:**\n1. Generate initial response\n2. Critique for:\n   - Helpfulness\n   - Harmlessness\n   - Honesty\n   - Accuracy\n3. Revise based on critique\n4. Final check against principles"
  },

  metaPrompting: {
    name: "Meta-Prompting",
    description: "Optimize prompts iteratively",
    template: "**Meta-Optimization:**\n1. Analyze task requirements\n2. Generate initial prompt\n3. Identify potential improvements:\n   - Clarity enhancements\n   - Missing constraints\n   - Output format refinements\n4. Create optimized version\n5. Test and refine"
  },

  chainOfThought: {
    name: "Chain of Thought",
    description: "Break down reasoning into steps",
    template: "Let's approach this step-by-step:\\n1. First, [initial consideration]\\n2. Then, [next step]\\n3. Finally, [conclusion]"
  },

  fewShot: {
    name: "Few-Shot Learning",
    description: "Provide examples to guide output",
    template: "**Example 1:**\\nInput: [example input]\\nOutput: [example output]\\n\\n**Example 2:**\\nInput: [example input]\\nOutput: [example output]\\n\\nNow, for the actual task:"
  },

  rolePlay: {
    name: "Role Playing",
    description: "Detailed persona for better responses",
    template: "You are [name], a [profession] with [X years] of experience in [field]. You are known for [characteristics]. Your approach is [methodology]. You always [habits/principles]."
  },

  constraints: {
    name: "Clear Constraints",
    description: "Define what to do and not do",
    template: "**Requirements:**\\n- Must include [X]\\n- Should follow [Y format]\\n- Limit to [Z length]\\n\\n**Restrictions:**\\n- Do not [action]\\n- Avoid [content type]\\n- Never [behavior]"
  },

  outputFormat: {
    name: "Structured Output",
    description: "Define exact output structure",
    template: "**Output Format:**\\n```\\n[Title/Header]\\n\\n1. [Section Name]\\n   - [Point 1]\\n   - [Point 2]\\n\\n2. [Section Name]\\n   [Content]\\n\\n[Conclusion]\\n```"
  },

  iterativeRefinement: {
    name: "Iterative Refinement",
    description: "Multiple passes for quality",
    template: "1. Generate initial [output]\\n2. Review for [criteria]\\n3. Refine to improve [aspects]\\n4. Final check for [requirements]"
  }
}

export function enhancePromptWithTechniques(
  basePrompt: string,
  techniques: string[],
  context: { style: string; format: string; model: string }
): string {
  let enhancedPrompt = basePrompt

  techniques.forEach(technique => {
    switch (technique) {
      case 'chainOfThought':
        if (!enhancedPrompt.includes('step-by-step')) {
          enhancedPrompt += "\\n\\n**Approach:** Use step-by-step reasoning to break down complex problems."
        }
        break
      
      case 'examples':
        if (context.format === 'detailed') {
          enhancedPrompt += "\\n\\n**Note:** Include relevant examples to illustrate key points."
        }
        break
      
      case 'constraints':
        if (!enhancedPrompt.includes('**Constraints:**')) {
          enhancedPrompt += "\\n\\n**Constraints:**\\n- Maintain factual accuracy\\n- Stay within scope\\n- Respect the specified format"
        }
        break
      
      case 'structured':
        if (context.format === 'structured') {
          enhancedPrompt += "\\n\\n**Structure Requirements:**\\n- Use clear headers and subheaders\\n- Organize content logically\\n- Include summary sections where appropriate"
        }
        break
    }
  })

  return enhancedPrompt
}

export function selectBestTemplate(userInput: string): string | null {
  const keywords = {
    aiAgent: ['agent', 'autonomous', 'bot', 'assistant', 'automate', 'workflow', 'process'],
    ragSystem: ['rag', 'retrieval', 'knowledge base', 'context', 'search', 'database', 'information'],
    functionCalling: ['function', 'tool', 'api', 'call', 'execute', 'invoke', 'use tools'],
    analytical: ['analyze', 'evaluate', 'assess', 'examine', 'investigate', 'data', 'metrics'],
    creative: ['create', 'write', 'generate', 'story', 'content', 'creative', 'imagine'],
    instructional: ['how to', 'teach', 'explain', 'guide', 'tutorial', 'steps', 'learn'],
    problemSolving: ['fix', 'solve', 'debug', 'troubleshoot', 'error', 'issue', 'problem'],
    comparison: ['compare', 'versus', 'vs', 'better', 'choose', 'difference', 'alternative']
  }

  const inputLower = userInput.toLowerCase()
  
  for (const [template, words] of Object.entries(keywords)) {
    if (words.some(word => inputLower.includes(word))) {
      return template
    }
  }
  
  return null
}