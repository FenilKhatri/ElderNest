const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

/** Resolve relative upload paths to absolute URLs */
export const resolveAssetUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${API_ORIGIN}${trimmed}`;
  return `${API_ORIGIN}/${trimmed}`;
};

/** Featured image from field or first <img> in HTML content */
export const getBlogImageUrl = (blog) => {
  if (!blog) return null;

  const fromField = blog.image || blog.coverImage || blog.featuredImage;
  if (fromField) {
    const resolved = resolveAssetUrl(fromField);
    if (resolved) return resolved;
  }

  const html = blog.content || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return resolveAssetUrl(match[1]);

  return null;
};
