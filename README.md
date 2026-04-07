# Next.js AI Powered Projects

This repository contains a collection of AI-powered features and experiments built with Next.js, the Vercel AI SDK, and various Google Gemini models. It demonstrates different ways to integrate generative AI into web applications, from simple chatbots to complex multi-step tool reasoning.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Browny791998/AIPoweredProjects.git
    cd nextjs-ai-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
    OPENAI_API_KEY=your_openai_key
    WEATHER_API_KEY=your_weather_api_key (for real weather data)
    HUGGING_FACE_API_KEY=your_huggingface_key (for image generation)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🛠 Features & UI Routes

You can access each AI project by navigating to its specific route in your browser.

| Feature | Description | UI Route |
| :--- | :--- | :--- |
| **Simple Chat** | A standard conversational AI interface. | [`/ui/chat`](http://localhost:3000/ui/chat) |
| **Multi-Modal Chat** | Upload images or PDFs and chat with them using Gemini's vision capabilities. | [`/ui/multi-modal-chat`](http://localhost:3000/ui/multi-modal-chat) |
| **API Tool (Live Weather)** | A weather assistant that pulls real-time data from an external Weather API. | [`/ui/api-tool`](http://localhost:3000/ui/api-tool) |
| **Multiple Tools** | Multi-step reasoning where AI uses one tool to get data for another (e.g., getting user location then weather). | [`/ui/multiple-tools`](http://localhost:3000/ui/multiple-tools) |
| **Image Generation** | Generate images from text prompts using Stable Diffusion via Hugging Face. | [`/ui/image-generation`](http://localhost:3000/ui/image-generation) |
| **Structured Data** | Generates consistent, schema-validated JSON objects (e.g., generating a fictional character). | [`/ui/structured-data`](http://localhost:3000/ui/structured-data) |
| **Structured Array** | Generates lists of structured data (e.g., a list of Pokemon with types and levels). | [`/ui/structured-array`](http://localhost:3000/ui/structured-array) |
| **Structured Enum** | Categorizes input or classifies data based on a predefined set of options. | [`/ui/structured-enum`](http://localhost:3000/ui/structured-enum) |
| **Component Tools** | Demonstrates how the AI can trigger specific tool calls with custom UI outputs. | [`/ui/tools`](http://localhost:3000/ui/tools) |
| **Streaming Responses** | A playground for testing and observing text streaming logic. | [`/ui/stream`](http://localhost:3000/ui/stream) |
| **Simple Completion** | Legacy-style text completion for basic prompts. | [`/ui/completion`](http://localhost:3000/ui/completion) |

---

## 🏗 Built With

*   **Next.js 16 (App Router)**
*   **Vercel AI SDK**
*   **Google Gemini Models** (`gemini-1.5-flash`, `gemini-3-flash-preview`)
*   **Tailwind CSS** for styling
*   **Zod** for schema validation

Enjoy exploring the possibilities of Agentic AI! 🤖✨
