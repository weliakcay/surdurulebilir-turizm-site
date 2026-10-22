import type { Metadata } from "next";
import { site } from "./site";

export const GREENLOG_URL = "https://greenlog-hotel.vercel.app";
export const CONTENT_UPDATED = "2026-10-22T00:00:00.000Z";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${site.url}${path}`,
      images: [
        {
          url: "/site/kapi-isletme.jpg",
          width: 1200,
          height: 630,
          alt: "Turizmde günlük operasyon kontrollerini temsil eden görsel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/site/kapi-isletme.jpg"],
    },
  };
}
