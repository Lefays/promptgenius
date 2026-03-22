# PromptGenius

A modern, open-source AI prompt generator and testing lab. Generate optimized prompts for any AI model, then test them in real-time — all for free, no API keys required.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Puter.js](https://img.shields.io/badge/Puter.js-Free_AI-7c3aed?style=flat-square)

## Features

- **Smart Prompt Generation** — Create optimized prompts with model-specific tuning for GPT-5, Claude 4.6, Gemini 3.1, Grok, DeepSeek, Mistral, and Qwen
- **Prompt Testing Lab** — Chat with any AI model to test your prompts in real-time with typing animation
- **19 AI Models** — Access GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, Grok 4.1, DeepSeek v3.2, and more via Puter.js
- **File Attachments** — Upload text files (.txt, .md, .json, .py, .csv, etc.) and images directly in chat
- **No API Keys** — Powered by Puter.js for free AI access with no setup required
- **Modern UI** — Clean, responsive design with dark/light mode
- **Prompt History** — Browse and reuse your previously generated prompts (stored locally)

## Tech Stack

- **Framework:** Next.js 15.5 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + shadcn/ui
- **AI Provider:** [Puter.js](https://js.puter.com/v2/) (free, no API keys)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Lefays/prompt-generative.git
cd prompt-generative/promptgenius
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

That's it — no environment variables or external services needed. Puter.js handles AI access automatically.

## Project Structure

```
promptgenius/
├── app/                    # Next.js app directory
│   ├── (dashboard)/        # Dashboard pages (generator, testing, history, help)
│   ├── icon.tsx            # Dynamic favicon
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── landing-page.tsx    # Homepage
│   └── navbar.tsx          # Navigation
├── lib/
│   ├── api/                # AI provider config and model definitions
│   ├── hooks/              # React hooks (use-puter.ts)
│   └── models/             # Model configurations
└── public/                 # Static assets
```

## Available Models

| Provider | Models |
|----------|--------|
| OpenAI | GPT-5.4, GPT-5.3 Chat, GPT-5 Mini, GPT-5 Nano, o3 Pro |
| Anthropic | Claude Opus 4.6, Claude Sonnet 4.6, Claude Opus 4.5, Claude Haiku 4.5 |
| Google | Gemini 3.1 Pro, Gemini 3.1 Flash Lite, Gemini 2.5 Pro |
| xAI | Grok 4.1 Fast, Grok 4 Fast |
| DeepSeek | DeepSeek v3.2, DeepSeek R1 |
| Mistral | Mistral Medium 3.1, Mistral Small 4 |
| Qwen | Qwen 3.5 72B |

All models are available for free through Puter.js.

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lefays/prompt-generative)

1. Click the deploy button above
2. Connect your GitHub repository
3. Deploy — no environment variables required

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created by [Lefays](https://github.com/Lefays)
