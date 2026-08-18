export function DrawPath() {
  return (
    <div className="draw-path" aria-hidden="true">
      <svg className="draw-path__desktop" viewBox="0 0 1000 220" preserveAspectRatio="none">
        <g className="draw-path__animated">
          <path pathLength="1" d="M40 80 H620" />
          <path pathLength="1" d="M620 80 C720 80 740 36 940 36" />
          <path pathLength="1" d="M620 80 C720 80 740 184 940 184" />
          <g className="draw-path__nodes-solid"><rect x="32" y="72" width="16" height="16" /><rect x="342" y="72" width="16" height="16" /><rect x="612" y="72" width="16" height="16" /><rect x="932" y="28" width="16" height="16" /><rect x="932" y="176" width="16" height="16" /></g>
        </g>
        <g className="draw-path__nodes-outline"><rect x="32" y="72" width="16" height="16" /><rect x="342" y="72" width="16" height="16" /><rect x="612" y="72" width="16" height="16" /><rect x="932" y="28" width="16" height="16" /><rect x="932" y="176" width="16" height="16" /></g>
      </svg>
      <svg className="draw-path__mobile" viewBox="0 0 320 360" preserveAspectRatio="xMinYMin meet">
        <g className="draw-path__animated"><path pathLength="1" d="M52 24 V220" /><path pathLength="1" d="M52 220 C52 270 104 268 104 330" /><path pathLength="1" d="M52 220 C52 270 232 268 232 330" /><g className="draw-path__nodes-solid"><rect x="44" y="16" width="16" height="16" /><rect x="44" y="112" width="16" height="16" /><rect x="44" y="212" width="16" height="16" /><rect x="96" y="322" width="16" height="16" /><rect x="224" y="322" width="16" height="16" /></g></g>
        <g className="draw-path__nodes-outline"><rect x="44" y="16" width="16" height="16" /><rect x="44" y="112" width="16" height="16" /><rect x="44" y="212" width="16" height="16" /><rect x="96" y="322" width="16" height="16" /><rect x="224" y="322" width="16" height="16" /></g>
      </svg>
    </div>
  );
}
