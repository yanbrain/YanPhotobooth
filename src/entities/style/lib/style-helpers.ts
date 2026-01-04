import type { Style } from '../model/style-types';

export function getStyleDisplayName(style: Style): string {
  return style.name;
}

export function getStylePrompt(style: Style): string {
  return style.prompt;
}
