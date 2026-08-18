type RailSection = {
  id: string;
  index: string;
  label: string;
};

export function TrajectoryRail({ label, sections }: { label: string; sections: RailSection[] }) {
  return (
    <>
      <nav className="trajectory-rail" aria-label="页面章节">
        <span className="trajectory-rail__line" aria-hidden="true">
          <i />
        </span>
        <ol className="clean-list">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <span aria-hidden="true" />
                <b className="tabular">{section.index}</b>
                <span className="sr-only">{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <details className="mobile-rail">
        <summary>
          <span className="tabular">01 / {String(sections.length).padStart(2, "0")}</span>
          <span>{label}</span>
          <i aria-hidden="true"><b /></i>
        </summary>
        <nav aria-label="页面章节">
          <ol className="clean-list">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span className="tabular">{section.index}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </>
  );
}
