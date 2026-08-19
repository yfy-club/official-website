import Image from "next/image";

import { CompareSlider } from "@/components/motion/compare-slider";
import { WorkTourObserver } from "@/components/motion/work-tour-observer";
import type { TourGroup } from "@/lib/work-tour";

export interface WorkSystemTourProps {
  workNameZh: string;
  workSlug?: string;
  groups: TourGroup[];
  id?: string;
}

export function WorkSystemTour({ workNameZh, workSlug, groups, id }: WorkSystemTourProps) {
  const rootId = id ?? (workSlug ? `work-tour-${workSlug}` : "work-tour");

  return (
    <div className="work-tour" id={rootId}>
      <nav className="work-tour__nav" aria-label={`${workNameZh}系统巡览`}>
        <div className="work-tour__nav-sticky">
          <p className="caps work-tour__nav-eyebrow">System Tour</p>
          <h3 className="work-tour__nav-title">系统巡览索引</h3>
          <ul className="work-tour__nav-list clean-list" role="list">
            {groups.map((group, index) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="work-tour__nav-link"
                  data-group-id={group.id}
                  aria-current={index === 0 ? "location" : undefined}
                  data-active={index === 0 ? "true" : undefined}
                >
                  <span className="tabular work-tour__nav-index">{group.index}</span>
                  <span className="work-tour__nav-name">{group.name}</span>
                  <span className="tabular work-tour__nav-count">{group.items.length} 帧</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="work-tour__stream">
        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="work-tour__group"
            data-tour-group={group.id}
            aria-labelledby={`${group.id}-title`}
          >
            <header className="work-tour__group-head">
              <div className="work-tour__group-meta">
                <span className="caps tabular">{group.index} / Group</span>
                <span className="work-tour__group-badge">{group.items.length} 项实录</span>
              </div>
              <h3 id={`${group.id}-title`} className="work-tour__group-title">{group.name}</h3>
            </header>
            <div className="work-tour__group-items">
              {group.items.map((item) => (
                <figure key={item.label} className="work-tour__item">
                  <div className="work-tour__item-meta">
                    <span className="caps tabular">{String(item.itemIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h4>{item.label}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="work-tour__frame">
                    {item.shot.type === "comparison" ? (
                      <CompareSlider dark={item.shot.dark} light={item.shot.light} alt={item.shot.alt} />
                    ) : (
                      <Image
                        src={item.shot.image}
                        alt={item.shot.alt}
                        width={1600}
                        height={900}
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        className="work-tour__img"
                      />
                    )}
                  </div>
                  <figcaption className="sr-only">{item.shot.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>

      <WorkTourObserver groupIds={groups.map((g) => g.id)} />
    </div>
  );
}
