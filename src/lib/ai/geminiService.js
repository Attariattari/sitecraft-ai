import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverEnv } from "@/lib/server/env";

const defaultModelCandidates = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

const quotaCooldownByModel = new Map();

function getGeminiConfig() {
  const apiKey =
    serverEnv.GEMINI_API_KEY ||
    serverEnv.GOOGLE_GENERATIVE_AI_API_KEY ||
    serverEnv.GOOGLE_API_KEY ||
    "";
  return {
    apiKey: apiKey.trim(),
    model: (serverEnv.GEMINI_MODEL || defaultModelCandidates[0]).trim(),
    models: (serverEnv.GEMINI_MODELS || "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean),
    keySource: serverEnv.GEMINI_API_KEY
      ? "GEMINI_API_KEY"
      : serverEnv.GOOGLE_GENERATIVE_AI_API_KEY
          ? "GOOGLE_GENERATIVE_AI_API_KEY"
          : serverEnv.GOOGLE_API_KEY
            ? "GOOGLE_API_KEY"
            : "",
  };
}

function getKeyFingerprint(apiKey = "") {
  if (!apiKey) return "";
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)} (${apiKey.length})`;
}

/**
 * Initialize Gemini client
 */
function getGeminiClient() {
  const { apiKey } = getGeminiConfig();
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not defined. Set GEMINI_API_KEY in .env.local and restart the dev server."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

function getRetryDelayMs(error) {
  const retryMatch = String(error?.message || "").match(/retryDelay":"(\d+)s"/);
  if (retryMatch) return Number(retryMatch[1]) * 1000;
  const pleaseRetryMatch = String(error?.message || "").match(/retry in ([\d.]+)s/i);
  if (pleaseRetryMatch) return Math.ceil(Number(pleaseRetryMatch[1]) * 1000);
  return 10 * 60 * 1000;
}

function isQuotaError(error) {
  const message = String(error?.message || "");
  return message.includes("429") || message.includes("Too Many Requests") || message.includes("Quota exceeded");
}

function getModelCandidates() {
  const { model, models } = getGeminiConfig();
  const candidates = [...models, model, ...defaultModelCandidates].filter(Boolean);
  return Array.from(new Set(candidates));
}

function getQuotaCooldownResponse(modelName) {
  const cooldownUntil = quotaCooldownByModel.get(modelName) || 0;
  const remainingMs = cooldownUntil - Date.now();
  if (remainingMs <= 0) return null;
  return {
    success: false,
    error: `${modelName} quota is cooling down. Retry after ${Math.ceil(remainingMs / 1000)} seconds.`,
    data: null,
    quotaLimited: true,
    model: modelName,
  };
}

function setModelCooldown(modelName, error) {
  quotaCooldownByModel.set(modelName, Date.now() + getRetryDelayMs(error));
}

function getMaxCooldownSeconds() {
  const now = Date.now();
  return Math.max(
    0,
    ...Array.from(quotaCooldownByModel.values()).map((time) =>
      Math.ceil((time - now) / 1000),
    ),
  );
}

function isModelUnavailableError(error) {
  const message = String(error?.message || "");
  return message.includes("404") || message.includes("not found") || message.includes("not supported");
}

/**
 * Generate JSON from Gemini with retry logic
 */
export async function generateGeminiJSON(prompt, retries = 1) {
  const client = getGeminiClient();
  const errors = [];

  for (const modelName of getModelCandidates()) {
    try {
      const cooldown = getQuotaCooldownResponse(modelName);
      if (cooldown) {
        errors.push(cooldown.error);
        continue;
      }

      const model = client.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(prompt);
      const text = response.response.text();

      try {
        const json = JSON.parse(text);
        return {
          success: true,
          data: json,
          rawText: text,
          model: modelName,
          promptTokens: response.response.usageMetadata?.promptTokens || 0,
          outputTokens: response.response.usageMetadata?.outputTokens || 0,
        };
      } catch (parseError) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const json = JSON.parse(jsonMatch[0]);
            return {
              success: true,
              data: json,
              rawText: text,
              model: modelName,
              promptTokens: response.response.usageMetadata?.promptTokens || 0,
              outputTokens: response.response.usageMetadata?.outputTokens || 0,
            };
          } catch (e) {
            errors.push(`${modelName}: failed to parse JSON response`);
          }
        }
        if (retries > 0) {
          return generateGeminiJSON(prompt, retries - 1);
        }
        errors.push(`${modelName}: ${parseError.message}`);
      }
    } catch (error) {
      if (isQuotaError(error)) {
        setModelCooldown(modelName, error);
        errors.push(`${modelName}: quota exceeded`);
        console.warn(`Gemini quota exceeded for ${modelName}. Trying next model if available.`);
        continue;
      }
      if (isModelUnavailableError(error)) {
        errors.push(`${modelName}: model unavailable`);
        console.warn(`Gemini model unavailable: ${modelName}. Trying next model if available.`);
        continue;
      }
      console.error(`Gemini API error for ${modelName}:`, error);
      errors.push(`${modelName}: ${error.message}`);
    }
  }

  return {
    success: false,
    error: `All Gemini models failed. ${errors.join(" | ")}`,
    data: null,
    quotaLimited: errors.some((error) => error.includes("quota")),
  };
}

/**
 * Generate text content from Gemini
 */
export async function generateGeminiText(prompt) {
  const client = getGeminiClient();
  const errors = [];

  for (const modelName of getModelCandidates()) {
    try {
      const cooldown = getQuotaCooldownResponse(modelName);
      if (cooldown) {
        errors.push(cooldown.error);
        continue;
      }

      const model = client.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(prompt);
      const text = response.response.text();

      return {
        success: true,
        data: text,
        model: modelName,
        promptTokens: response.response.usageMetadata?.promptTokens || 0,
        outputTokens: response.response.usageMetadata?.outputTokens || 0,
      };
    } catch (error) {
      if (isQuotaError(error)) {
        setModelCooldown(modelName, error);
        errors.push(`${modelName}: quota exceeded`);
        console.warn(`Gemini quota exceeded for ${modelName}. Trying next model if available.`);
        continue;
      }
      if (isModelUnavailableError(error)) {
        errors.push(`${modelName}: model unavailable`);
        console.warn(`Gemini model unavailable: ${modelName}. Trying next model if available.`);
        continue;
      }
      console.error(`Gemini text generation error for ${modelName}:`, error);
      errors.push(`${modelName}: ${error.message}`);
    }
  }

  return {
    success: false,
    error: `All Gemini models failed. ${errors.join(" | ")}`,
    data: null,
    quotaLimited: errors.some((error) => error.includes("quota")),
  };
}

export function getGeminiDiagnostics() {
  const { apiKey, model, keySource } = getGeminiConfig();
  return {
    configured: Boolean(apiKey),
    keySource,
    keyFingerprint: getKeyFingerprint(apiKey),
    model,
    modelCandidates: getModelCandidates(),
    cooldownSeconds: getMaxCooldownSeconds(),
  };
}
