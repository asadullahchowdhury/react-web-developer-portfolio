import { forwardRef } from 'react';
import type { StackLayer } from '../../data/stack';
import type { DiagramGeometry } from './stackGeometry';

/**
 * Isometric exploded stack (spec §19): four slabs — rhombus top + two side
 * faces — with dashed vertical guides, a signal line through the centres,
 * a travelling packet and leader lines to mono labels.
 *
 * Slab positions, the packet and the leader lines are moved by
 * useStackScroll directly on the elements (data-* hooks), so they are not
 * React-controlled. Only styling (active layer) comes from props.
 */

/** Splits a tool list into "A · B · C" lines of at most ~30 characters. */
const wrapTools = (tools: readonly string[], max = 30): string[] => {
  const lines: string[] = [];
  let line = '';
  for (const tool of tools) {
    const next = line ? `${line} · ${tool}` : tool;
    if (next.length > max && line) {
      lines.push(line);
      line = tool;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const slabPoints = (g: DiagramGeometry) => {
  const { w, h, t } = g;
  const top = `0,${-h / 2} ${w / 2},0 0,${h / 2} ${-w / 2},0`;
  const left = `${-w / 2},0 0,${h / 2} 0,${h / 2 + t} ${-w / 2},${t}`;
  const right = `0,${h / 2} ${w / 2},0 ${w / 2},${t} 0,${h / 2 + t}`;
  return { top, left, right };
};

interface StackDiagramProps {
  layers: readonly StackLayer[];
  /** Index of the highlighted layer. */
  active: number;
  geometry: DiagramGeometry;
  onHover?: (index: number | null) => void;
  /** Dim labels of inactive layers (scroll sequence); off for the static view. */
  dimInactive?: boolean;
  className?: string;
}

const StackDiagram = forwardRef<SVGSVGElement, StackDiagramProps>(
  ({ layers, active, geometry: g, onHover, dimInactive = true, className = '' }, ref) => {
    const pts = slabPoints(g);
    const first = g.spread[0];
    const last = g.spread[g.spread.length - 1];
    const patternId = `hatch-${g.labels ? 'full' : 'mini'}`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${g.width} ${g.height}`}
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgb(156 201 255 / 0.18)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Dashed vertical guides through the corners and the centre */}
        {[g.cx - g.w / 2, g.cx, g.cx + g.w / 2].map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={first - g.h / 2 - 20}
            y2={last + g.h / 2 + g.t + 20}
            stroke="rgb(255 255 255 / 0.08)"
            strokeDasharray="3 6"
          />
        ))}

        {/* Signal line through the centres */}
        <line
          data-stack-spine
          x1={g.cx}
          x2={g.cx}
          y1={first}
          y2={last}
          stroke="rgb(156 201 255 / 0.45)"
          strokeWidth="1.5"
        />

        {/* Slabs, bottom first so upper slabs overlap when compressed */}
        {[...layers].map((layer, i) => ({ layer, i })).reverse().map(({ layer, i }) => {
          const isActive = i === active;
          return (
            <g
              key={layer.number}
              data-stack-slab={i}
              transform={`translate(${g.cx} ${g.spread[i]})`}
              onPointerEnter={onHover ? () => onHover(i) : undefined}
              onPointerLeave={onHover ? () => onHover(null) : undefined}
            >
              <polygon points={pts.left} fill="#0B0F15" stroke="rgb(255 255 255 / 0.18)" />
              <polygon points={pts.right} fill="#090C11" stroke="rgb(255 255 255 / 0.18)" />
              <polygon
                points={pts.top}
                fill={isActive ? '#121A26' : '#0E131B'}
                stroke={isActive ? '#9CC9FF' : 'rgb(255 255 255 / 0.18)'}
                strokeWidth={isActive ? 1.5 : 1}
                style={{ transition: 'fill 240ms, stroke 240ms' }}
              />
              {isActive && <polygon points={pts.top} fill={`url(#${patternId})`} />}
              {isActive && <circle r={g.labels ? 4 : 3} fill="#EDEFF3" />}
              {/* "Assembled" glow, pulsed once by useStackScroll at the end of the pin */}
              <polygon
                data-stack-glow
                points={pts.top}
                fill="rgb(156 201 255 / 0.08)"
                stroke="#9CC9FF"
                strokeWidth="1.5"
                opacity="0"
                style={{ filter: 'drop-shadow(0 0 8px rgb(156 201 255 / 0.8))' }}
              />
            </g>
          );
        })}

        {/* Packet travelling down the spine */}
        <circle data-stack-packet cx={g.cx} cy={first} r={g.labels ? 5 : 3.5} fill="#EDF4FF" style={{ filter: 'drop-shadow(0 0 6px rgb(156 201 255 / 0.9))' }} />

        {/* Leader lines + labels (full variant) */}
        {g.labels &&
          layers.map((layer, i) => (
            <g
              key={layer.number}
              data-stack-label={i}
              // In the scroll sequence useStackScroll owns the opacity (a React value
              // here would reset it on every re-render)
              style={{ opacity: dimInactive ? undefined : 1, transition: 'opacity 240ms' }}
            >
              <polyline
                data-stack-leader={i}
                points={`${g.cx + g.w / 2 + 6},${g.spread[i]} ${g.leaderX},${g.spread[i]}`}
                fill="none"
                stroke={i === active ? 'rgb(156 201 255 / 0.7)' : 'rgb(255 255 255 / 0.2)'}
              />
              <text
                x={g.labelX}
                y={g.spread[i] - 6}
                fontFamily="Geist Mono, ui-monospace, monospace"
                fontSize="11"
                letterSpacing="1.3"
                fill={i === active ? '#EDEFF3' : '#7A8396'}
              >
                {layer.number} {layer.name.toUpperCase()}
              </text>
              <text
                x={g.labelX}
                y={g.spread[i] + 13}
                fontFamily="Geist Mono, ui-monospace, monospace"
                fontSize="12.5"
                fill="#A3ACBC"
              >
                {wrapTools(layer.tools).map((line, n) => (
                  <tspan key={n} x={g.labelX} dy={n === 0 ? 0 : 17}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
      </svg>
    );
  },
);

StackDiagram.displayName = 'StackDiagram';

export default StackDiagram;
