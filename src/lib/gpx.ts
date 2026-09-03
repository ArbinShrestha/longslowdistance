// Turns a GPX track into a normalised SVG path so a course can be drawn as line art.

export type Route = {
  d: string
  width: number
  height: number
  distanceKm: number
  start: { x: number; y: number }
}

type Pt = { lat: number; lon: number }

const parsePoints = (gpx: string): Pt[] => {
  const points: Pt[] = []
  const re = /<(?:trkpt|rtept)\b[^>]*\blat="([-\d.]+)"[^>]*\blon="([-\d.]+)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(gpx)) !== null) points.push({ lat: Number(m[1]), lon: Number(m[2]) })
  return points
}

const haversineKm = (a: Pt, b: Pt): number => {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Projects the track with an equirectangular projection scaled by cos(mean latitude),
 * fits it into a `size` box with `pad` padding and returns the SVG path data.
 * Points are thinned so the path stays small for the wire.
 */
export function gpxToRoute(gpx: string, size = 1000, pad = 40, maxPoints = 600): Route | null {
  const pts = parsePoints(gpx)
  if (pts.length < 2) return null

  let distanceKm = 0
  for (let i = 1; i < pts.length; i++) distanceKm += haversineKm(pts[i - 1], pts[i])

  const meanLat = pts.reduce((s, p) => s + p.lat, 0) / pts.length
  const k = Math.cos((meanLat * Math.PI) / 180)
  const xs = pts.map((p) => p.lon * k)
  const ys = pts.map((p) => -p.lat)
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
  const spanX = maxX - minX || 1e-9
  const spanY = maxY - minY || 1e-9
  const scale = (size - pad * 2) / Math.max(spanX, spanY)
  const width = Math.round(spanX * scale + pad * 2)
  const height = Math.round(spanY * scale + pad * 2)

  const step = Math.max(1, Math.floor(pts.length / maxPoints))
  const project = (i: number) => ({
    x: Math.round(((xs[i] - minX) * scale + pad) * 10) / 10,
    y: Math.round(((ys[i] - minY) * scale + pad) * 10) / 10,
  })
  const coords: { x: number; y: number }[] = []
  for (let i = 0; i < pts.length; i += step) coords.push(project(i))
  const last = project(pts.length - 1)
  if (coords[coords.length - 1].x !== last.x || coords[coords.length - 1].y !== last.y) coords.push(last)

  const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x} ${c.y}`).join('')
  return { d, width, height, distanceKm: Math.round(distanceKm * 10) / 10, start: coords[0] }
}
