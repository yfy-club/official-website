"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { TrackWithPreview } from "@/lib/track-previews";

export interface TrackPreviewListProps {
  items: TrackWithPreview[];
}

export function TrackPreviewList({ items }: TrackPreviewListProps) {
  const initialSlug = items.find((item) => item.preview !== null)?.slug ?? items[0]?.slug ?? "ai";
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);

  const activeItem = items.find((item) => item.slug === selectedSlug) ?? items[0];

  return (
    <div className="home-track-preview">
      <ol className="home-tracks clean-list" data-reveal="group">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/tracks/${item.slug}`}
              data-active={item.slug === selectedSlug ? "true" : undefined}
              onPointerEnter={() => setSelectedSlug(item.slug)}
              onFocus={() => setSelectedSlug(item.slug)}
            >
              <span className="tabular home-track-preview__index">{item.index}</span>
              <strong className="home-track-preview__name">{item.nameZh}</strong>
              <span className="home-track-preview__tagline">{item.tagline}</span>
              <span className="home-track-preview__thumb" aria-hidden="true">
                {item.preview ? (
                  <Image
                    src={item.preview.image}
                    alt=""
                    width={96}
                    height={60}
                    sizes="96px"
                    className="home-track-preview__thumb-img"
                  />
                ) : (
                  <span className="home-track-preview__thumb-empty" />
                )}
              </span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </li>
        ))}
      </ol>

      <figure className="home-track-preview__stage" data-reveal="item" aria-hidden="true">
        <div className="home-track-preview__frame">
          {activeItem?.preview ? (
            <div key={activeItem.slug} className="home-track-preview__media">
              <Image
                src={activeItem.preview.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 480px"
                className="home-track-preview__img"
              />
            </div>
          ) : (
            <div key="empty" className="home-track-preview__empty">
              <span className="home-track-preview__empty-tag">EMPTY ARCHIVE</span>
              <p className="home-track-preview__empty-text">暂无关联实录</p>
            </div>
          )}
        </div>
        <figcaption className="home-track-preview__caption">
          <span className="home-track-preview__caption-track">{activeItem?.nameZh}</span>
          <span className="home-track-preview__caption-work">
            {activeItem?.preview ? activeItem.preview.workNameZh : "暂无关联实录"}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
