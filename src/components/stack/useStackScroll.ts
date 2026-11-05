import { type RefObject, useEffect } from 'react';
import { gsap } from '../../lib/motion';
import { loadScrollLibs, setPinActive } from '../../lib/scroll';
import type { DiagramGeometry } from './stackGeometry';

/** Pin length (spec §19). */
const PIN_VH = 1.6;
/** Compression runs over the last 20% of the pin. */
const COMPRESS_FROM = 0.8;

const smoothstep = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
};

/**
 * Stack scroll sequence (spec §19, desktop): pins the section for 160vh,
 * scrubbed. Each quarter activates the next layer (01 → 04) and the packet
 * travels down to it; in the last 20% the slabs compress from 150 px to
 * 24 px apart and every label becomes fully visible.
 *
 * Positions are written straight to the SVG; `onActive` fires only when the
 * active layer changes. `onProgress` drives the footer progress line.
 */
export function useStackScroll(
  section: RefObject<HTMLElement>,
  svg: RefObject<SVGSVGElement>,
  geometry: DiagramGeometry,
  enabled: boolean,
  onActive: (index: number) => void,
  onProgress: (p: number) => void,
) {
  useEffect(() => {
    const root = section.current;
    const diagram = svg.current;
    if (!root || !diagram || !enabled) return;

    const g = geometry;
    const slabs = Array.from(diagram.querySelectorAll<SVGGElement>('[data-stack-slab]'));
    const leaders = Array.from(diagram.querySelectorAll<SVGPolylineElement>('[data-stack-leader]'));
    const labels = Array.from(diagram.querySelectorAll<SVGGElement>('[data-stack-label]'));
    const packet = diagram.querySelector<SVGCircleElement>('[data-stack-packet]');
    const spine = diagram.querySelector<SVGLineElement>('[data-stack-spine]');
    let lastActive = -1;

    const paint = (p: number) => {
      const c = smoothstep((p - COMPRESS_FROM) / (1 - COMPRESS_FROM));
      const ys = g.spread.map((s, i) => s + (g.compressed[i] - s) * c);

      slabs.forEach((slab) => {
        const i = Number(slab.dataset.stackSlab);
        slab.setAttribute('transform', `translate(${g.cx} ${ys[i]})`);
      });
      leaders.forEach((leader) => {
        const i = Number(leader.dataset.stackLeader);
        leader.setAttribute(
          'points',
          `${g.cx + g.w / 2 + 6},${ys[i]} ${(g.leaderX ?? 0) - 24},${g.spread[i]} ${g.leaderX},${g.spread[i]}`,
        );
      });
      spine?.setAttribute('y1', String(ys[0]));
      spine?.setAttribute('y2', String(ys[ys.length - 1]));

      // Active layer by quarter; the packet glides between slab centres
      const active = Math.min(3, Math.floor(p / 0.25));
      const along = Math.min(Math.max(p / 0.75, 0), 1) * 3;
      const k = Math.min(Math.floor(along), 2);
      const packetY = ys[k] + (ys[k + 1] - ys[k]) * (along - k);
      packet?.setAttribute('cy', String(packetY));

      // Inactive labels at 35% until the stack assembles, then all visible
      labels.forEach((label) => {
        const i = Number(label.dataset.stackLabel);
        label.style.opacity = String(i === active ? 1 : Math.max(0.35, c));
      });

      if (active !== lastActive) {
        lastActive = active;
        onActive(active);
      }
      onProgress(p);
    };

    let cancelled = false;
    let teardown = () => {};
    loadScrollLibs().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const state = { p: 0 };
      const ctx = gsap.context(() => {
        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: () => paint(state.p),
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${window.innerHeight * PIN_VH}`,
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onToggle: (self) => setPinActive('stack', self.isActive),
          },
        });
      }, root);
      paint(0);
      teardown = () => {
        ctx.revert();
        setPinActive('stack', false);
      };
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [section, svg, geometry, enabled, onActive, onProgress]);
}
