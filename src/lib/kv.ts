import { kv } from "@vercel/kv";
import type { Product } from "@/data/products";
import type { PendingSuggestion } from "@/types/research";

// ── Blog Post Type ──

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML
  coverImage: string;
  author: string;
  publishedAt: string; // ISO date string
  readTimeMinutes: number;
  tags: string[];
  relatedProductSlugs: string[];
}

// ── Email Sequence State ──

export type EmailSequenceState = {
  subscribedAt: string;
  lastEmailSent: string;
  emailsSent: number;
};

const KEYS = {
  overrides: "products:overrides",
  additions: "products:additions",
  pending: "products:pending",
  newsletterSubscribers: "newsletter:subscribers",
  blogPosts: "blog:posts",
  cjMatches: "cj:pending-matches",
} as const;

const EMAIL_SEQUENCE_PREFIX = "email:sequence:" as const;
const PENDING_TTL = 60 * 60 * 24 * 7; // 7 days

// ── Product Overrides (price/image changes to existing products) ──

export async function getProductOverrides(): Promise<
  Record<string, Partial<Product>>
> {
  const data = await kv.get<Record<string, Partial<Product>>>(KEYS.overrides);
  return data || {};
}

export async function setProductOverride(
  slug: string,
  override: Partial<Product>
): Promise<void> {
  const overrides = await getProductOverrides();
  overrides[slug] = { ...overrides[slug], ...override };
  await kv.set(KEYS.overrides, overrides);
}

// ── Product Additions (entirely new products) ──

export async function getProductAdditions(): Promise<Product[]> {
  const data = await kv.get<Product[]>(KEYS.additions);
  return data || [];
}

export async function addProduct(product: Product): Promise<void> {
  const additions = await getProductAdditions();
  // Prevent duplicates by slug
  const filtered = additions.filter((p) => p.slug !== product.slug);
  filtered.push(product);
  await kv.set(KEYS.additions, filtered);
}

// ── Pending Suggestions ──

export async function getPendingSuggestions(): Promise<PendingSuggestion[]> {
  const data = await kv.get<PendingSuggestion[]>(KEYS.pending);
  return data || [];
}

export async function setPendingSuggestions(
  suggestions: PendingSuggestion[]
): Promise<void> {
  await kv.set(KEYS.pending, suggestions, { ex: PENDING_TTL });
}

export async function removePendingSuggestion(id: string): Promise<void> {
  const suggestions = await getPendingSuggestions();
  const filtered = suggestions.filter((s) => s.id !== id);
  if (filtered.length > 0) {
    await kv.set(KEYS.pending, filtered, { ex: PENDING_TTL });
  } else {
    await kv.del(KEYS.pending);
  }
}

export async function getPendingSuggestionById(
  id: string
): Promise<PendingSuggestion | undefined> {
  const suggestions = await getPendingSuggestions();
  return suggestions.find((s) => s.id === id);
}

// ── Newsletter Subscribers ──

export async function addNewsletterSubscriber(email: string): Promise<void> {
  await kv.sadd(KEYS.newsletterSubscribers, email);
}

export async function getNewsletterSubscribers(): Promise<string[]> {
  const members = await kv.smembers(KEYS.newsletterSubscribers);
  return (members as string[]) || [];
}

export async function removeNewsletterSubscriber(email: string): Promise<void> {
  await kv.srem(KEYS.newsletterSubscribers, email);
}

// ── Blog Posts ──

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await kv.get<BlogPost[]>(KEYS.blogPosts);
  if (!data) return [];
  // Return sorted by publishedAt (newest first)
  return [...data].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function addBlogPost(post: BlogPost): Promise<void> {
  const posts = await getBlogPosts();
  // Replace existing post with the same slug, or append
  const filtered = posts.filter((p) => p.slug !== post.slug);
  filtered.push(post);
  await kv.set(KEYS.blogPosts, filtered);
}

// ── CJ Product Matches ──

export interface CJMatchPending {
  id: string;
  productSlug: string;
  productTitle: string;
  cjPid: string;
  cjVid: string;
  cjName: string;
  cjPrice: number;
  cjImage: string;
  confidence: string;
  token: string;
  createdAt: string;
}

export async function getCJPendingMatches(): Promise<CJMatchPending[]> {
  const data = await kv.get<CJMatchPending[]>(KEYS.cjMatches);
  return data || [];
}

export async function setCJPendingMatches(matches: CJMatchPending[]): Promise<void> {
  await kv.set(KEYS.cjMatches, matches, { ex: PENDING_TTL });
}

export async function removeCJPendingMatch(id: string): Promise<void> {
  const matches = await getCJPendingMatches();
  const filtered = matches.filter((m) => m.id !== id);
  if (filtered.length > 0) {
    await kv.set(KEYS.cjMatches, filtered, { ex: PENDING_TTL });
  } else {
    await kv.del(KEYS.cjMatches);
  }
}

// ── Email Sequence ──

export async function getEmailSequenceState(
  email: string
): Promise<EmailSequenceState | null> {
  const data = await kv.get<EmailSequenceState>(
    `${EMAIL_SEQUENCE_PREFIX}${email}`
  );
  return data || null;
}

export async function setEmailSequenceState(
  email: string,
  state: EmailSequenceState
): Promise<void> {
  await kv.set(`${EMAIL_SEQUENCE_PREFIX}${email}`, state);
}

export async function addNewsletterSubscriberWithTimestamp(
  email: string
): Promise<void> {
  await kv.sadd(KEYS.newsletterSubscribers, email);
  const existing = await getEmailSequenceState(email);
  if (!existing) {
    await setEmailSequenceState(email, {
      subscribedAt: new Date().toISOString(),
      lastEmailSent: new Date().toISOString(),
      emailsSent: 1,
    });
  }
}
