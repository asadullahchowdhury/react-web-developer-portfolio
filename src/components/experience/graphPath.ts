/**
 * Normalised length of the commit-graph line, used for the dash-offset draw.
 * Large on purpose: GSAP rounds px values while tweening, so a length of 1
 * would jump from hidden to fully drawn halfway through the scroll.
 */
export const GRAPH_PATH_LENGTH = 1000;
