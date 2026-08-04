"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

type IgPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
};

const PLACEHOLDER = [
  { id: "p1", file: "/images/instagram/1.jpg", unsplash: "photo-1547887538-e3a2f32cb1cc" },
  { id: "p2", file: "/images/instagram/2.jpg", unsplash: "photo-1610461888750-10bfc601b874" },
  { id: "p3", file: "/images/instagram/3.jpg", unsplash: "photo-1594035910387-fea47794261f" },
  { id: "p4", file: "/images/instagram/4.jpg", unsplash: "photo-1523293182086-7651a899d37f" },
  { id: "p5", file: "/images/instagram/5.jpg", unsplash: "photo-1619994403073-2cec844b8e63" },
  { id: "p6", file: "/images/instagram/6.jpg", unsplash: "photo-1541643600914-78b084683601" },
];

const IG_URL = "https://instagram.com/beekozmatik";

export function InstagramFeed() {
  const [posts, setPosts] = useState<IgPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/instagram")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return (data.posts as IgPost[]) ?? null;
      })
      .then((list) => {
        if (!cancelled && list?.length) setPosts(list);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 text-center">
      <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="font-serif text-4xl transition hover:text-[#8a6438]">
        @beekozmatik
      </a>
      <p className="mt-2 text-sm text-neutral-500">
        {posts ? "Instagram’dan güncel kareler" : "Koku dünyamıza katılın — fotoğrafları public/images/instagram altına koyun veya Instagram API bağlayın."}
      </p>
      <div className="mt-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {posts
          ? posts.slice(0, 6).map((post) => (
              <Link
                key={post.id}
                href={post.permalink || IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram gönderisi"
                className="group relative aspect-square overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.media_url}
                  alt={post.caption?.slice(0, 80) || "Instagram"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 grid place-content-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                  <Camera />
                </div>
              </Link>
            ))
          : PLACEHOLDER.map((item) => (
              <PlaceholderTile key={item.id} file={item.file} unsplash={item.unsplash} />
            ))}
      </div>
    </section>
  );
}

function PlaceholderTile({ file, unsplash }: { file: string; unsplash: string }) {
  const [src, setSrc] = useState(file);
  return (
    <Link
      href={IG_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="group relative aspect-square overflow-hidden"
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="17vw"
        onError={() =>
          setSrc(`https://images.unsplash.com/${unsplash}?auto=format&fit=crop&w=700&q=80`)
        }
      />
      <div className="absolute inset-0 grid place-content-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
        <Camera />
      </div>
    </Link>
  );
}
