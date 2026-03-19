export function generateGeminiPrompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  const instructions = [
    `Task: ${userInput}`,
    imageData ? "Visual Context: Analyze the provided image and integrate relevant information." : "",
    `Style: Adopt a ${style} communication approach`,
    `Format: Structure your response to be ${format}`,
    "",
    "Guidelines:",
    `• Use your multimodal capabilities effectively`,
    `• Provide structured, well-organized information`,
    `• Include practical examples where relevant`,
    `• Maintain a ${style} tone throughout`,
    temperature > 0.7 ? "• Explore creative angles and innovative solutions" : "• Focus on accuracy and established facts",
    "",
    `Response length: Up to ${maxTokens} tokens`,
    "",
    "Begin your response:"
  ].filter(line => line !== "").join("\n")

  return instructions
}

export function generateLlamaPrompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  return `### Instruction:
${userInput}

${imageData ? "### Image Context:\nAn image has been provided. Consider its content in your response.\n" : ""}
### Requirements:
- Communication style: ${style}
- Response format: ${format}
- Focus on open, transparent, and helpful assistance
- Provide practical, implementable solutions
${temperature > 0.7 ? "- Include creative suggestions" : "- Stick to proven approaches"}

### Response:`
}

export function generateMistralPrompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  return `[INST] ${userInput}

${imageData ? "Context: An image is provided for reference. Include relevant visual information in your analysis." : ""}

Provide a ${style} response that is ${format}.
Optimize for efficiency and clarity.
Maximum response length: ${maxTokens} tokens.
${temperature > 0.7 ? "Feel free to explore creative solutions." : "Focus on established best practices."}
[/INST]`
}

export function generateFallbackPrompt(userInput: string, model: string): string {
  return `You are an AI assistant optimized for the ${model} model.

Task: ${userInput}

Please provide a comprehensive, helpful response that:
1. Addresses the user's request directly
2. Provides clear, actionable information
3. Uses examples where appropriate
4. Maintains a professional tone
5. Is well-structured and easy to understand

Begin your response:`
}