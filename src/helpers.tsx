export const BASE_PATH = '/rufi_bd_25';

export function getAssetPath(path: string): string {
  // Убеждаемся что путь начинается с /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}
