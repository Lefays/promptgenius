# 🚀 PromptGenius

A modern, open-source AI prompt generator with a beautiful UI and powerful features for optimizing your AI interactions.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)

## ✨ Features

- 🤖 **Smart Prompt Generation** - Create optimized prompts for GPT-4, Claude, Gemini, and more
- 📊 **Interactive Dashboard** - Track your prompt history and usage statistics
- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 💾 **Local Storage** - Your prompts are saved locally for privacy
- 🧪 **Prompt Testing** - Test and refine your prompts in real-time
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Authentication:** Supabase
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Lefays/prompt-generative.git
cd prompt-generative/promptgenius
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure Supabase**

Create a new Supabase project at [supabase.com](https://supabase.com) and add your credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Project Structure

```
promptgenius/
├── app/                 # Next.js app directory
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Dashboard pages
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # UI components
│   └── ...            # Feature components
├── lib/               # Utility functions
└── public/            # Static assets
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lefays/prompt-generative)

1. Click the deploy button above
2. Connect your GitHub repository
3. Add environment variables
4. Deploy!

### Environment Variables

Required for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- Stripe keys (if enabling payments)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created by [Lefays](https://github.com/Lefays)

## ⭐ Support

If you find this project useful, please consider giving it a star on GitHub!