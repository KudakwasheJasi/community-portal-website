export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateExcerpt = (text: string, length: number = 160): string => {
  if (!text) return '';
  const trimmed = text.trim();
  return trimmed.length > length 
    ? `${trimmed.substring(0, length).trim()}...` 
    : trimmed;
};

export const estimateReadTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};
