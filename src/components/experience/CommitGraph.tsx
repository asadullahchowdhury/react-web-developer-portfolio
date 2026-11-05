import type { Lane } from '../../data/experience';
import { GRAPH_PATH_LENGTH } from './graphPath';

export interface GraphNode {
  /** y of the card's date line, relative to the graph. */
  y: number;
  lane: Lane;
  head: boolean;
}

interface CommitGraphProps {
  nodes: GraphNode[];
  height: number;
}

/** Lane x positions in the 120 px gutter (spec §20). */
const LANE_X: Record<Lane, number> = { codevioso: 70, redishketch: 30 };
const SIGNAL = 'rgb(156 201 255 / 0.45)';


/**
 * Career as a git graph (spec §20): Redishketch (x 30) runs up from the
 * bottom through its commits, curves into Codevioso (x 70) and up to HEAD.
 * A faint dashed line continues above HEAD (the future). HEAD is ember; other
 * nodes signal. Vertical mono lane labels at the bottom.
 *
 * The drawn path is ordered top → bottom so it can be drawn in reading order
 * (newest first) with stroke-dashoffset.
 */
const CommitGraph = ({ nodes, height }: CommitGraphProps) => {
  if (!nodes.length || height <= 0) return null;

  const head = nodes.find((n) => n.head) ?? nodes[0];
  const redishketch = nodes.filter((n) => n.lane === 'redishketch');
  const topRed = redishketch[0];
  const bottom = height - 64;

  // HEAD down the Codevioso lane, curve into Redishketch above its first commit, down to the bottom
  const mergeTop = head.y + 24;
  const mergeBottom = topRed ? Math.max(mergeTop + 48, topRed.y - 56) : mergeTop + 48;
  const cx = LANE_X.codevioso;
  const rx = LANE_X.redishketch;
  const path = topRed
    ? `M ${cx} ${head.y} V ${mergeTop} C ${cx} ${(mergeTop + mergeBottom) / 2}, ${rx} ${(mergeTop + mergeBottom) / 2}, ${rx} ${mergeBottom} V ${bottom}`
    : `M ${cx} ${head.y} V ${bottom}`;

  return (
    <svg width="120" height={height} viewBox={`0 0 120 ${height}`} aria-hidden="true" focusable="false" className="absolute left-0 top-0">
      {/* The future: faint dashed continuation above HEAD */}
      <line x1={cx} x2={cx} y1={8} y2={head.y - 10} stroke="rgb(255 255 255 / 0.14)" strokeDasharray="2 6" />

      {/* Codevioso lane below the merge, faint (the branch existed before HEAD) */}
      {topRed && <line x1={cx} x2={cx} y1={mergeTop} y2={bottom} stroke="rgb(255 255 255 / 0.06)" />}

      {/* Drawn history line */}
      <path data-graph-line d={path} fill="none" stroke={SIGNAL} strokeWidth="1.5" pathLength={GRAPH_PATH_LENGTH} />

      {/* Commit nodes */}
      {nodes.map((node, i) => {
        const x = LANE_X[node.lane];
        const colour = node.head ? '#F2B27A' : '#9CC9FF';
        return (
          <g key={i} data-graph-node={i} transform={`translate(${x} ${node.y})`}>
            <circle r="8" fill="#07090D" stroke={colour} strokeWidth="1.5" />
            <circle r="3" fill={colour} />
          </g>
        );
      })}

      {/* Lane labels */}
      {(['redishketch', 'codevioso'] as const).map((lane) => (
        <text
          key={lane}
          transform={`translate(${LANE_X[lane] + 4} ${height - 4}) rotate(-90)`}
          fontFamily="Geist Mono, ui-monospace, monospace"
          fontSize="10"
          letterSpacing="1"
          fill="#7A8396"
        >
          {lane}
        </text>
      ))}
    </svg>
  );
};

export default CommitGraph;
