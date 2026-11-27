export function asset(src) {
  if (!src || src.startsWith('data:')) return src;
  return import.meta.env.BASE_URL + src;
}
