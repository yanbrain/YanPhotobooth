/**
 * AI generation prompts for each style
 */

export const STYLE_PROMPTS: Record<string, string> = {
  cyberpunk:
    'Transform into a cyberpunk character in a neon-lit futuristic city. High-tech augmentations, holographic displays, neon lighting, dystopian aesthetic, cinematic lighting, highly detailed, 8k quality',
  medieval:
    'Transform into a medieval noble or scholar in an ancient castle. Medieval clothing, stone castle interior, candlelight, Gothic architecture, parchment scrolls, historical accuracy, oil painting style',
  anime:
    'Transform into an anime character with expressive features. Studio Ghibli style, soft cel shading, vibrant colors, clean linework, beautiful detailed eyes, soft background',
  vintage:
    'Transform into a vintage 1920s portrait. Art deco style, sepia tones, elegant vintage clothing, soft focus, classic studio photography, timeless elegance',
  fantasy:
    'Transform into a fantasy character in a magical realm. Ethereal lighting, magical elements, enchanted forest, flowing robes, fantasy armor, dramatic lighting',
} as const;

export function getPromptForStyle(styleId: string): string {
  return STYLE_PROMPTS[styleId] || STYLE_PROMPTS.cyberpunk;
}
