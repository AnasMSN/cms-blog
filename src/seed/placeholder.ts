import sharp from 'sharp'

/**
 * Generates a tasteful abstract placeholder (no text, so no font dependency).
 * Replace with real product photos from the admin panel.
 */
export async function placeholder(base: string, fg: string, variant: number, w = 1200, h = 1200) {
  const shapes = [
    `<circle cx="${w * 0.5}" cy="${h * 0.55}" r="${w * 0.28}" fill="${fg}"/><circle cx="${w * 0.5}" cy="${h * 0.55}" r="${w * 0.16}" fill="${base}" opacity=".45"/>`,
    `<rect x="${w * 0.22}" y="${h * 0.3}" width="${w * 0.56}" height="${h * 0.5}" rx="${w * 0.04}" fill="${fg}"/><rect x="${w * 0.22}" y="${h * 0.3}" width="${w * 0.56}" height="${h * 0.12}" fill="${base}" opacity=".35"/>`,
    `<path d="M${w * 0.3} ${h * 0.82} V${h * 0.45} a${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.4} 0 V${h * 0.82} Z" fill="${fg}"/>`,
    `<ellipse cx="${w * 0.5}" cy="${h * 0.62}" rx="${w * 0.34}" ry="${h * 0.14}" fill="${fg}"/><ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.26}" ry="${h * 0.1}" fill="${fg}" opacity=".7"/>`,
  ]
  // Kawung-inspired dot texture in the background
  const dots: string[] = []
  for (let y = 40; y < h; y += 80) for (let x = 40; x < w; x += 80) dots.push(`<circle cx="${x}" cy="${y}" r="5"/>`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${base}"/>
    <g fill="${fg}" opacity=".12">${dots.join('')}</g>
    ${shapes[variant % shapes.length]}
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
}
