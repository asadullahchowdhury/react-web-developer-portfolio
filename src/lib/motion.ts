import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { isMobileLike } from './capabilities';

gsap.registerPlugin(CustomEase, SplitText);

/** `ease-lab` — cubic-bezier(0.2, 0.7, 0, 1), used for every entrance (spec §9.1). */
export const EASE_LAB = CustomEase.create('lab', 'M0,0 C0.2,0.7 0,1 1,1');

/** Mobile intro runs at 0.8× duration (spec §12). Delays are unchanged. */
export const introDurationScale = () => (isMobileLike() ? 0.8 : 1);

export { gsap, SplitText };
