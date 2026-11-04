import { NODES } from './scene/config';
import { sceneState } from './scene/sceneState';

/**
 * Node labels as crisp DOM text in Geist Mono (spec §4 node-label, §8 #8).
 * Rendered as DOM instead of 3D text to keep the 3D chunk lean; the scene
 * projects each node every rendered frame and writes the transform directly.
 */
const NodeLabels = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {NODES.map((node) => (
      <span
        key={node.id}
        ref={(el) => {
          sceneState.labels[node.id] = el;
        }}
        data-node-label={node.id}
        className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] text-ink-tertiary will-change-transform"
      >
        {node.label}
      </span>
    ))}
  </div>
);

export default NodeLabels;
