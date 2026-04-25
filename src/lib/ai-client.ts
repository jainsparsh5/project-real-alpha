const defaultProvider = "nvidia";
const defaultBaseUrl = "https://integrate.api.nvidia.com/v1";
const defaultModel = "deepseek-ai/deepseek-v4-flash";
const defaultFallbackModel = "meta/llama-3.1-8b-instruct";

export type AiChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiRuntimeConfig = {
  provider: string;
  baseUrl: string;
  model: string;
  fallbackModel: string;
  isConfigured: boolean;
};

type AiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      reasoning?: unknown;
      reasoning_content?: unknown;
    };
  }>;
};

export class AiProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderError";
  }
}

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

function readNumberEnv(name: string, fallback: number): number {
  const rawValue = process.env[name]?.trim();

  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildChatCompletionUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
}

export function getAiRuntimeConfig(): AiRuntimeConfig {
  return {
    provider: readEnv("AI_PROVIDER", defaultProvider),
    baseUrl: readEnv("AI_API_BASE_URL", defaultBaseUrl),
    model: readEnv("AI_MODEL", defaultModel),
    fallbackModel: readEnv("AI_FALLBACK_MODEL", defaultFallbackModel),
    isConfigured: Boolean(process.env.AI_API_KEY?.trim()),
  };
}

export async function createAiChatCompletion({
  messages,
  model,
  maxTokens = readNumberEnv("AI_MAX_TOKENS", 2048),
  temperature = readNumberEnv("AI_TEMPERATURE", 0.4),
  topP = readNumberEnv("AI_TOP_P", 0.95),
  timeoutMs = readNumberEnv("AI_TIMEOUT_MS", 18_000),
}: {
  messages: AiChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  timeoutMs?: number;
}): Promise<{
  content: string;
  provider: string;
  model: string;
}> {
  const apiKey = process.env.AI_API_KEY?.trim();
  const config = getAiRuntimeConfig();
  const selectedModel = model?.trim() || config.model;

  if (!apiKey) {
    throw new AiProviderError("AI provider is not configured.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestBody: Record<string, unknown> = {
      model: selectedModel,
      messages,
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
      stream: false,
    };

    if (config.provider.toLowerCase() === "nvidia") {
      requestBody.chat_template_kwargs = {
        thinking: true,
        reasoning_effort: "high",
      };
    }

    const response = await fetch(buildChatCompletionUrl(config.baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AiProviderError(`AI provider returned ${response.status}.`);
    }

    const payload = (await response.json()) as AiChatCompletionResponse;
    const content = payload.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new AiProviderError("AI provider returned an empty response.");
    }

    return {
      content,
      provider: config.provider,
      model: selectedModel,
    };
  } catch (error) {
    if (error instanceof AiProviderError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new AiProviderError("AI provider request timed out.");
    }

    throw new AiProviderError("AI provider request failed.");
  } finally {
    clearTimeout(timeoutId);
  }
}
