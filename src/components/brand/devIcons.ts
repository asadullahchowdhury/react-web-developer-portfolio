import { ICON_STROKE, iconSvg } from './logoGeometry';

/**
 * Dev-only: rasterises the logo mark into the PNG app icons and saves them to
 * public/icons/ through the dev server. Run in the browser console:
 *   await __renderIcons()
 *
 * 32 px uses the 15 stroke; 180/192/512 use 12. The apple-touch icon keeps
 * square corners because iOS applies its own mask.
 */
const ICONS = [
  { name: 'favicon-32.png', size: 32, stroke: ICON_STROKE.icon32, radius: 0.22 },
  { name: 'apple-touch-icon.png', size: 180, stroke: ICON_STROKE.large, radius: 0 },
  { name: 'icon-192.png', size: 192, stroke: ICON_STROKE.large, radius: 0.22 },
  { name: 'icon-512.png', size: 512, stroke: ICON_STROKE.large, radius: 0.22 },
] as const;

async function rasterise(svg: string, size: number): Promise<Blob> {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );
}

async function renderIcons(): Promise<string[]> {
  const results: string[] = [];
  for (const icon of ICONS) {
    const blob = await rasterise(iconSvg(icon), icon.size);
    const res = await fetch('/__dev/save-app-icon', {
      method: 'POST',
      headers: { 'x-name': icon.name },
      body: blob,
    });
    results.push(await res.text());
  }
  return results;
}

(window as unknown as { __renderIcons: typeof renderIcons }).__renderIcons = renderIcons;
