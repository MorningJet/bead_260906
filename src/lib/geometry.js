export function uid() {
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

/** Fixed size in the loose tray so beads do not shrink/pack as more are added. */
export const LOOSE_SCALE = 0.168

/** Bead CSS: left/top = 50% + coord * TRAY_POS */
export const TRAY_POS = 0.45

/** Matches `.tray-stars { inset: 6% }` and the outer constellation circle. */
export const STARS_INSET = 0.06
export const STARS_VIEW = 200
export const STARS_RING_R = 78

/** Layout radius of the strung bracelet inside the tray. */
export const PATTERN_RING = 0.74

/**
 * SVG cord uses viewBox -1..1 (unit 1 = 50% of the tray).
 * Bead centers use TRAY_POS, so the drawn radius must be scaled to match.
 */
export function cordSvgR(layoutR = PATTERN_RING) {
  return layoutR * TRAY_POS * 2
}

/** Empty cord circumference on the DIY canvas, in centimetres. */
export const EMPTY_RING_CM = 13

/** Keep a grown ring inside the tray. */
export const RING_MAX = 0.88

/** Pack along the cord by true diameter; PNG padding is filled in CSS, not extra ring. */
export const PACK_GAP = 1

export function visualRadius(diameter, scale) {
  return (diameter / 10) * scale
}

export function isPendant(item) {
  return item?.category2 === '吊墜'
}

export function isThinSpacer(item) {
  return item?.category2 === '隔珠' && /隔片|隔環|黑曜/.test(item.name || '')
}

/** Millimetres occupied along the cord. Thin discs use thickness, not face diameter. */
export function cordMm(bead) {
  if (isThinSpacer(bead)) return Math.max(2.2, bead.diameter * 0.3)
  return bead.diameter
}

export function wristCmOf(beads) {
  return beads.reduce((s, b) => s + (b.diameter || 0), 0) / 10
}

/**
 * CSS bead width% = (d/10)*scale*90, ring diameter% = 2*R*TRAY_POS*100.
 * Choose scale so 8mm vs a 13cm cord matches that physical ratio.
 */
export function realBeadScale(ring = PATTERN_RING) {
  return (ring * Math.PI) / EMPTY_RING_CM
}

export function braceletMetrics(beads) {
  const wristCm = wristCmOf(beads)
  const desiredR = PATTERN_RING * Math.max(1, (wristCm * PACK_GAP) / EMPTY_RING_CM)
  const ring = Math.min(desiredR, RING_MAX)
  const baseScale = realBeadScale(PATTERN_RING)
  const scale = desiredR > RING_MAX ? baseScale * (RING_MAX / desiredR) : baseScale
  return { scale, ring, wristCm }
}

export function computeScale(beads) {
  return braceletMetrics(beads).scale
}

export function stringLayout(beads, scale, ring) {
  if (!beads.length) return []
  const metrics = braceletMetrics(beads)
  const s = scale ?? metrics.scale
  const R = ring ?? metrics.ring
  const radii = beads.map((b) => visualRadius(cordMm(b), s))
  const faces = beads.map((b) => visualRadius(b.diameter, s))
  const totalArc = radii.reduce((sum, r) => sum + r * 2, 0)
  let acc = 0
  return beads.map((b, i) => {
    const r = radii[i]
    const mid = acc + r
    const angle = -Math.PI / 2 + (totalArc > 0 ? (mid / totalArc) * Math.PI * 2 : 0)
    acc += r * 2
    return {
      x: Math.cos(angle) * R,
      y: Math.sin(angle) * R,
      angle,
      r,
      faceR: faces[i],
      R,
    }
  })
}

function wrapDelta(from, to) {
  let d = to - from
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

/** Put the new bead in the ring slot closest to `targetAngle` (0 = right, toward the shelf). */
export function insertBeadToward(beads, newBead, targetAngle = 0) {
  if (!beads.length) return [newBead]
  let best = [...beads, newBead]
  let bestDiff = Infinity
  for (let i = 0; i <= beads.length; i += 1) {
    const trial = [...beads.slice(0, i), newBead, ...beads.slice(i)]
    const laid = stringLayout(trial, computeScale(trial))
    const diff = Math.abs(wrapDelta(laid[i].angle, targetAngle))
    if (diff < bestDiff) {
      bestDiff = diff
      best = trial
    }
  }
  return best
}

export function scatterCandidates(existing, preferTop = true) {
  const tries = []
  for (let i = 0; i < 28; i += 1) {
    const t = Math.random()
    const angle = preferTop
      ? -Math.PI * 0.95 + t * Math.PI * 1.9
      : Math.random() * Math.PI * 2
    const radius = 0.42 + Math.random() * 0.28
    tries.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.92,
    })
  }
  let best = tries[0]
  let bestScore = -1
  for (const p of tries) {
    let minD = 2
    for (const e of existing) {
      const d = Math.hypot(p.x - e.x, p.y - e.y)
      if (d < minD) minD = d
    }
    const edge = 0.82 - Math.hypot(p.x, p.y)
    const score = minD * 1.4 + edge * 0.25
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }
  return best
}

export function separateScatter(points, minDist = 0.16) {
  const next = points.map((p) => ({ ...p }))
  for (let iter = 0; iter < 8; iter += 1) {
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const dx = next[j].x - next[i].x
        const dy = next[j].y - next[i].y
        const d = Math.hypot(dx, dy) || 0.0001
        if (d < minDist) {
          const push = (minDist - d) / 2
          const ux = dx / d
          const uy = dy / d
          next[i].x -= ux * push
          next[i].y -= uy * push
          next[j].x += ux * push
          next[j].y += uy * push
        }
      }
      const dist = Math.hypot(next[i].x, next[i].y)
      if (dist > 0.8) {
        next[i].x *= 0.8 / dist
        next[i].y *= 0.8 / dist
      }
    }
  }
  return next
}

export function wristFromBeads(beads) {
  const innerCm = wristCmOf(beads)
  const fit = innerCm < 13 ? '過短' : innerCm > 22 ? '過長' : '合適'
  return {
    sumCm: innerCm,
    low: innerCm,
    high: innerCm,
    inner: innerCm,
    fit,
  }
}

export function formatPrice(n) {
  return n.toFixed(1)
}

export function angleNorm(a) {
  let x = a + Math.PI / 2
  while (x < 0) x += Math.PI * 2
  while (x >= Math.PI * 2) x -= Math.PI * 2
  return x
}

export function reorderByAngle(beads, layouts, dragId, pointerAngle) {
  const items = beads.map((b, i) => ({
    bead: b,
    angle: b.id === dragId ? angleNorm(pointerAngle) : angleNorm(layouts[i]?.angle ?? 0),
  }))
  items.sort((a, b) => a.angle - b.angle)
  return items.map((it) => it.bead)
}

export function ringPoint(angle, radius) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}
