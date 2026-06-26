const bannedPatterns = [
  /\bunlimited\b/i,
  /\bagency\b.{0,40}\b(available|active|purchasable|buy|purchase|checkout)\b/i,
  /\ball\b.{0,30}\bcategories\b.{0,30}\b(available|active)\b/i,
  /\ball\b.{0,30}\btemplates\b.{0,30}\b(available|active)\b/i,
  /\bguarantee(d|s)?\b/i,
  /\blegal advice\b/i,
  /\bpayment will\b/i,
  /\bapi key\b/i,
  /\bsecret\b/i,
];

const unsupportedClaims = [
  /\banalytics\b.{0,50}\b(available|active|included now|ready)\b/i,
  /\bcustom domains?\b.{0,50}\b(available|active|included now|ready)\b/i,
  /\badvanced editor\b.{0,50}\b(available|active|included now|ready)\b/i,
  /\bteam collaboration\b.{0,50}\b(available|active|included now|ready)\b/i,
];
const safeNegations = [
  /\bnot currently available\b/i,
  /\bnot live yet\b/i,
  /\bnot active yet\b/i,
  /\bplanned for future releases\b/i,
  /\bcoming soon\b/i,
  /\bin progress\b/i,
];

export const SAFE_HELP_FALLBACK = "I do not have confirmed information about this yet.";

export function validateHelpAnswer(answer) {
  const text = String(answer || "").trim();
  if (!text) {
    return { safe: false, reason: "Empty answer", answer: SAFE_HELP_FALLBACK };
  }

  const failedBanned = bannedPatterns.find((pattern) => pattern.test(text));
  if (failedBanned) {
    return {
      safe: false,
      reason: `Unsafe claim matched ${failedBanned}`,
      answer: SAFE_HELP_FALLBACK,
    };
  }

  const hasSafeNegation = safeNegations.some((pattern) => pattern.test(text));
  const failed = unsupportedClaims.find((pattern) => pattern.test(text));
  if (failed && !hasSafeNegation) {
    return {
      safe: false,
      reason: `Unsafe claim matched ${failed}`,
      answer: SAFE_HELP_FALLBACK,
    };
  }

  return { safe: true, reason: "Answer passed safety checks", answer: text };
}

export function sanitizeHelpAnswer(answer) {
  const validation = validateHelpAnswer(answer);
  return validation.safe ? validation.answer : validation.answer;
}
