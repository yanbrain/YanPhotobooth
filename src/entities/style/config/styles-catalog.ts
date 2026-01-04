import type { Style } from '../model/style-types';

export const STYLES: Style[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'Transform into a cyberpunk character in a neon-lit futuristic city. High-tech augmentations, holographic displays, neon lighting, dystopian aesthetic, cinematic lighting, highly detailed, 8k quality, cyberpunk 2077 style',
    thumbnail: '/styles/cyberpunk.jpg',
  },
  {
    id: 'medieval',
    name: 'Medieval',
    prompt: 'Transform into a medieval noble or scholar in an ancient castle. Medieval clothing, stone castle interior, candlelight, Gothic architecture, parchment scrolls, historical accuracy, oil painting style, renaissance portrait lighting',
    thumbnail: '/styles/medieval.jpg',
  },
  {
    id: 'anime',
    name: 'Anime',
    prompt: 'Transform into an anime character with expressive features. Studio Ghibli style, soft cel shading, vibrant colors, clean linework, beautiful detailed eyes, soft background, anime aesthetic, high quality digital art',
    thumbnail: '/styles/anime.jpg',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    prompt: 'Transform into a vintage 1920s portrait. Art deco style, sepia tones, elegant vintage clothing, soft focus, classic studio photography, timeless elegance, film grain texture, antique photo aesthetic',
    thumbnail: '/styles/vintage.jpg',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    prompt: 'Transform into a fantasy character in a magical realm. Ethereal lighting, magical elements, enchanted forest or mystical castle, flowing robes, fantasy armor, dramatic lighting, epic fantasy art style, detailed and atmospheric',
    thumbnail: '/styles/fantasy.jpg',
  },
];

export function getStyleById(id: string): Style | undefined {
  return STYLES.find((style) => style.id === id);
}

export function assertValidStyleId(id: string): asserts id is string {
  const style = getStyleById(id);
  if (!style) {
    throw new Error(`Invalid style ID: ${id}`);
  }
}

export function isValidStyleId(id: string): boolean {
  return STYLES.some((style) => style.id === id);
}
