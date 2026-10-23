import { useEffect, useState } from 'react'

/**
 * Names on the Soil Atlas's small canvas maps (D-310, Tahir 23 Oct 2026, design "Soil Atlas Maps"): the Punjab map's
 * district names (MiniMap in TeesraKhata.tsx), a tehsil map's Union Council names (the same MiniMap) and the soil card's
 * map (FineMap in GpsCard.tsx). Kept here so the component files export only components.
 */
/** A name on a map, at its point: a district centre (Punjab map) or a Union Council centre (tehsil map). */
export type MapName = { en: string; ur?: string; lat: number; lon: number; key?: string }
export type MapBox = [number, number, number, number]
export const MAP_LATIN = (px: number) => `600 ${px}px "Public Sans", system-ui, sans-serif`
export const MAP_URDU = (px: number) => `500 ${px}px "Noto Nastaliq Urdu", serif`
/** Dark letters on a light halo, so a name reads over any square. */
export function haloText(g: CanvasRenderingContext2D, t: string, x: number, y: number, font: string, rtl = false) {
  g.font = font; g.direction = rtl ? 'rtl' : 'ltr'; g.textAlign = 'center'; g.lineJoin = 'round'
  g.strokeStyle = 'rgba(251,249,243,.92)'; g.lineWidth = 3.5; g.strokeText(t, x, y)
  g.fillStyle = '#14231A'; g.fillText(t, x, y)
  g.direction = 'ltr'
}
export const boxFree = (placed: MapBox[], b: MapBox) => !placed.some(p => b[0] < p[2] && b[2] > p[0] && b[1] < p[3] && b[3] > p[1])
/** The fonts the map names use; the map draws again once they are in, so a name is never measured in a fallback font. */
export function useMapFonts(on: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on || typeof document === 'undefined' || !document.fonts) return
    let live = true
    // The Nastaliq face is split by script (fontface.css), so the Urdu load names Urdu letters, or only its Latin part
    // would be fetched (review, 23 Oct 2026); then every face the page asked for.
    Promise.all([document.fonts.load(MAP_LATIN(11), 'Aa'), document.fonts.load(MAP_URDU(13), 'اردو')]).catch(() => undefined)
      .then(() => document.fonts.ready).catch(() => undefined).then(() => { if (live) setN(x => x + 1) })
    return () => { live = false }
  }, [on])
  return n
}

