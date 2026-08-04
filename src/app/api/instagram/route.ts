import { NextResponse } from "next/server";

/**
 * Optional live Instagram feed.
 * Set INSTAGRAM_ACCESS_TOKEN (long-lived User token) in env.
 * Without it, the homepage falls back to local /images/instagram or Unsplash.
 */
export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ posts: [], configured: false });
  }

  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_url,permalink,thumbnail_url,media_type");
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ posts: [], configured: true, error: err.slice(0, 200) }, { status: 502 });
    }

    const data = (await res.json()) as {
      data?: Array<{
        id: string;
        caption?: string;
        media_url?: string;
        thumbnail_url?: string;
        permalink: string;
        media_type?: string;
      }>;
    };

    const posts = (data.data ?? [])
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        permalink: item.permalink,
        media_url: item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url,
      }))
      .filter((p) => Boolean(p.media_url));

    return NextResponse.json({ posts, configured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Instagram hatası";
    return NextResponse.json({ posts: [], configured: true, error: message }, { status: 500 });
  }
}
