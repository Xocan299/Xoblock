import * as THREE from 'three';

// Cache generated textures
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates an authentic classic Roblox stud texture on an HTML5 canvas.
 * @param baseColor Hex string like '#47a247' for green baseplate, '#4f5259' for grey walkway
 * @param studHighlight Hex string for highlight
 * @param studShadow Hex string for shadow
 */
export function createStudTexture(
  baseColor: string = '#4ca44c',
  studHighlight: string = 'rgba(255,255,255,0.4)',
  studShadow: string = 'rgba(0,0,0,0.3)',
  repeatU: number = 1,
  repeatV: number = 1
): THREE.CanvasTexture {
  const cacheKey = `${baseColor}_${repeatU}_${repeatV}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Fill base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  // Subtle grid border lines (classic Roblox brick division)
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, 127, 127);

  // Draw 4 studs (2x2 grid per unit tile)
  const centers = [
    { x: 32, y: 32 },
    { x: 96, y: 32 },
    { x: 32, y: 96 },
    { x: 96, y: 96 },
  ];

  const radius = 17;

  centers.forEach((pos) => {
    // Drop shadow
    ctx.beginPath();
    ctx.arc(pos.x + 1.2, pos.y + 1.8, radius, 0, Math.PI * 2);
    ctx.fillStyle = studShadow;
    ctx.fill();

    // Stud body (slightly lighter than base)
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = baseColor;
    ctx.fill();

    // Stud bevel ring top-left (highlight)
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius - 0.5, Math.PI * 0.75, Math.PI * 1.75);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = studHighlight;
    ctx.stroke();

    // Stud bevel ring bottom-right (shadow)
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius - 0.5, Math.PI * 1.75, Math.PI * 0.75);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = studShadow;
    ctx.stroke();

    // Inner stud top circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius - 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();

    // Classic embossed center ring
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatU, repeatV);
  texture.colorSpace = THREE.SRGBColorSpace;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates the classic 2006-2009 Roblox default smiley face texture.
 */
export function createNoobFaceTexture(): THREE.CanvasTexture {
  const cacheKey = 'noob_face';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Classic yellow skin color (#f5cd2f / #fedc33)
  ctx.fillStyle = '#f5cd2f';
  ctx.fillRect(0, 0, 256, 256);

  // Left Eye
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.ellipse(82, 95, 14, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye
  ctx.beginPath();
  ctx.ellipse(174, 95, 14, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Classic smiling mouth
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#111111';
  // Arc from bottom-left to bottom-right
  ctx.arc(128, 126, 48, Math.PI * 0.15, Math.PI * 0.85, false);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates the classic 2007-2009 Roblox Skybox with blue sky and horizontal fluffy cumulus clouds.
 */
export function createRobloxSkyTexture(): THREE.CanvasTexture {
  const cacheKey = 'roblox_sky_2008';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Sky gradient from zenith blue to horizon soft cyan
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#2c70ba');    // deep top blue
  skyGrad.addColorStop(0.35, '#4e95df'); // classic Roblox sky blue
  skyGrad.addColorStop(0.68, '#8ec2f2'); // bright horizon blue
  skyGrad.addColorStop(0.85, '#bddbf7'); // horizon haze
  skyGrad.addColorStop(1.0, '#92b3d8');  // below horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Draw classic fluffy horizontal cloud bands
  function drawCloudPuff(cx: number, cy: number, w: number, h: number, alpha: number) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = 'rgba(180, 205, 235, 0.5)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright puff
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.2, cy - h * 0.2, w * 0.6, h * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
    ctx.fill();

    ctx.restore();
  }

  // Seeded clouds across the horizon layer (Y between 200 and 340)
  for (let i = 0; i < 28; i++) {
    const x = (i * 42) % 1024;
    const y = 230 + Math.sin(i * 1.7) * 45;
    const w = 45 + ((i * 13) % 40);
    const h = 18 + ((i * 7) % 15);
    drawCloudPuff(x, y, w, h, 0.82);
    drawCloudPuff((x + 25) % 1024, y + 4, w * 0.8, h * 0.8, 0.75);
    drawCloudPuff((x - 20 + 1024) % 1024, y + 2, w * 0.7, h * 0.7, 0.7);
  }

  // Upper light wispy clouds
  for (let j = 0; j < 14; j++) {
    const x = (j * 78 + 30) % 1024;
    const y = 120 + Math.cos(j * 2.3) * 35;
    const w = 55 + ((j * 17) % 45);
    const h = 14 + ((j * 5) % 10);
    drawCloudPuff(x, y, w, h, 0.55);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}
