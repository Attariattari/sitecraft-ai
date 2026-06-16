import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(
    "GEMINI_API_KEY not found in environment variables. AI generation will fail."
  );
}

/**
 * Initialize Gemini client
 */
function getGeminiClient() {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not defined in environment variables"
    );
  }
  return new GoogleGenerativeAI(API_KEY);
}

/**
 * Generate JSON from Gemini with retry logic
 */
export async function generateGeminiJSON(prompt, retries = 1) {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Try to parse JSON
    try {
      const json = JSON.parse(text);
      return {
        success: true,
        data: json,
        rawText: text,
        promptTokens: response.response.usageMetadata?.promptTokens || 0,
        outputTokens: response.response.usageMetadata?.outputTokens || 0,
      };
    } catch (parseError) {
      // Try to extract JSON from text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const json = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: json,
            rawText: text,
            promptTokens: response.response.usageMetadata?.promptTokens || 0,
            outputTokens: response.response.usageMetadata?.outputTokens || 0,
          };
        } catch (e) {
          if (retries > 0) {
            console.log("Retrying JSON generation...");
            return generateGeminiJSON(prompt, retries - 1);
          }
          throw new Error("Failed to parse Gemini response as JSON");
        }
      }

      if (retries > 0) {
        console.log("Retrying JSON generation...");
        return generateGeminiJSON(prompt, retries - 1);
      }

      throw parseError;
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

/**
 * Generate text content from Gemini
 */
export async function generateGeminiText(prompt) {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    return {
      success: true,
      data: text,
      promptTokens: response.response.usageMetadata?.promptTokens || 0,
      outputTokens: response.response.usageMetadata?.outputTokens || 0,
    };
  } catch (error) {
    console.error("Gemini text generation error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}
