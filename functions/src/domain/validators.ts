// Domain validators

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateStyleId(styleId: string): boolean {
  const validStyles = ['cyberpunk', 'medieval', 'anime', 'vintage', 'fantasy'];
  return validStyles.includes(styleId);
}

export function validateIdempotencyKey(key: string): boolean {
  return typeof key === 'string' && key.length > 0 && key.length < 256;
}
