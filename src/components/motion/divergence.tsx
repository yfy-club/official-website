export function Divergence() {
  return (
    <div className="divergence" aria-hidden="true">
      <svg className="divergence__desktop" viewBox="0 0 1000 180" preserveAspectRatio="none">
        <rect className="divergence__origin" x="496" y="4" width="8" height="8" />
        <g className="divergence__routes">
          <path pathLength="1" d="M500 12 C500 55 100 72 100 176" />
          <path pathLength="1" d="M500 12 C500 58 300 72 300 176" />
          <path pathLength="1" d="M500 12 L500 176" />
          <path pathLength="1" d="M500 12 C500 58 700 72 700 176" />
          <path pathLength="1" d="M500 12 C500 55 900 72 900 176" />
        </g>
      </svg>
      <svg className="divergence__mobile" viewBox="0 0 320 250" preserveAspectRatio="xMinYMin meet">
        <rect className="divergence__origin" x="20" y="4" width="8" height="8" />
        <path className="divergence__trunk" pathLength="1" d="M24 12 L24 226" />
        <g className="divergence__branches">
          <path pathLength="1" d="M24 42 H302" />
          <path pathLength="1" d="M24 84 H302" />
          <path pathLength="1" d="M24 126 H302" />
          <path pathLength="1" d="M24 168 H302" />
          <path pathLength="1" d="M24 210 H302" />
        </g>
      </svg>
    </div>
  );
}
