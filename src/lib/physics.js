import { LOOSE_SCALE, visualRadius } from './geometry.js'

const RIM = 0.84
const REST = 0.04
const PAD = 1.02
const BEAD_E = 0.78
const RIM_E_FIRST = 0.88
const RIM_E = 0.52
const FRICTION = 1.55
const INWARD_DAMP = 1.6
const RIM_PULL = 1.8

function radiiFor(beads) {
  return beads.map((b) => {
    const ring = visualRadius(b.diameter, LOOSE_SCALE)
    if (b.category2 === '吊墜') return ring * 2.2 * PAD
    if (b.category2 === '隔珠' && /隔片|隔環|黑曜/.test(b.name || '')) return ring * 0.32 * PAD
    return ring * PAD
  })
}

function massOf(r) {
  return Math.max(0.0004, r * r)
}

export function resolveOverlaps(beads, pinnedId = null, iterations = 12) {
  if (beads.length < 1) return false
  const n = beads.length
  let overlapped = false
  for (let iter = 0; iter < iterations; iter += 1) {
    const radii = radiiFor(beads)
    let hit = false
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const a = beads[i]
        const c = beads[j]
        const dx = c.x - a.x
        const dy = c.y - a.y
        const dist = Math.hypot(dx, dy) || 0.0001
        const min = radii[i] + radii[j]
        if (dist >= min) continue
        hit = true
        overlapped = true
        const nx = dx / dist
        const ny = dy / dist
        const overlap = min - dist
        const pinA = pinnedId && a.id === pinnedId
        const pinC = pinnedId && c.id === pinnedId
        if (pinA && !pinC) {
          c.x += nx * overlap
          c.y += ny * overlap
        } else if (pinC && !pinA) {
          a.x -= nx * overlap
          a.y -= ny * overlap
        } else {
          const mA = massOf(radii[i])
          const mC = massOf(radii[j])
          const inv = 1 / (mA + mC)
          a.x -= nx * overlap * (mC * inv)
          a.y -= ny * overlap * (mC * inv)
          c.x += nx * overlap * (mA * inv)
          c.y += ny * overlap * (mA * inv)
        }
      }
    }
    for (let i = 0; i < n; i += 1) {
      const b = beads[i]
      const max = Math.max(0.12, RIM - radii[i])
      const d = Math.hypot(b.x, b.y) || 0.0001
      if (d > max) {
        b.x *= max / d
        b.y *= max / d
        hit = true
      }
    }
    if (!hit) break
  }
  return overlapped
}

function collideBeads(beads, radii) {
  const n = beads.length
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const a = beads[i]
      const c = beads[j]
      const dx = c.x - a.x
      const dy = c.y - a.y
      const dist = Math.hypot(dx, dy) || 0.0001
      const min = radii[i] + radii[j]
      if (dist >= min) continue
      const nx = dx / dist
      const ny = dy / dist
      const overlap = min - dist
      const mA = massOf(radii[i])
      const mC = massOf(radii[j])
      const inv = 1 / (mA + mC)
      a.x -= nx * overlap * (mC * inv)
      a.y -= ny * overlap * (mC * inv)
      c.x += nx * overlap * (mA * inv)
      c.y += ny * overlap * (mA * inv)
      const rel = ((c.vx || 0) - (a.vx || 0)) * nx + ((c.vy || 0) - (a.vy || 0)) * ny
      if (rel >= 0) continue
      const jImp = (-(1 + BEAD_E) * rel) / (1 / mA + 1 / mC)
      a.vx = (a.vx || 0) - (jImp / mA) * nx
      a.vy = (a.vy || 0) - (jImp / mA) * ny
      c.vx = (c.vx || 0) + (jImp / mC) * nx
      c.vy = (c.vy || 0) + (jImp / mC) * ny
    }
  }
}

function bounceRim(beads, radii) {
  let moving = false
  for (let i = 0; i < beads.length; i += 1) {
    const b = beads[i]
    const max = Math.max(0.12, RIM - radii[i])
    const d = Math.hypot(b.x, b.y) || 0.0001
    const nx = b.x / d
    const ny = b.y / d
    const vx = b.vx || 0
    const vy = b.vy || 0
    const vn = vx * nx + vy * ny

    if (d > max) {
      b.x = nx * max
      b.y = ny * max
      if (vn > 0) {
        const tx = vx - vn * nx
        const ty = vy - vn * ny
        const e = b.entering ? RIM_E_FIRST : RIM_E
        b.vx = tx * 0.92 - e * vn * nx
        b.vy = ty * 0.92 - e * vn * ny
        b.entering = false
      }
    }

    if (Math.hypot(b.vx || 0, b.vy || 0) > REST) moving = true
  }
  return moving
}

export function stepPhysics(beads, dt) {
  const n = beads.length
  if (!n) return false
  const steps = 6
  const h = dt / steps
  let moving = false

  for (let s = 0; s < steps; s += 1) {
    const radii = radiiFor(beads)
    for (let i = 0; i < n; i += 1) {
      const b = beads[i]
      const max = Math.max(0.12, RIM - radii[i])
      const d = Math.hypot(b.x, b.y) || 0.0001
      const nx = b.x / d
      const ny = b.y / d
      let vx = b.vx || 0
      let vy = b.vy || 0

      if (!b.entering) {
        const vr = vx * nx + vy * ny
        if (vr < 0) {
          const vr2 = vr * Math.exp(-INWARD_DAMP * h)
          vx += nx * (vr2 - vr)
          vy += ny * (vr2 - vr)
        }
        const speed = Math.hypot(vx, vy)
        const gap = Math.max(0, max - d)
        const pull = RIM_PULL * gap * (0.2 + 1.1 / (0.35 + speed))
        vx += nx * pull * h
        vy += ny * pull * h
      }

      const damp = b.entering ? 1 : Math.exp(-FRICTION * h)
      b.x += vx * h
      b.y += vy * h
      b.rot = (b.rot || 0) + (vx * 110 - vy * 50) * h
      b.vx = vx * damp
      b.vy = vy * damp
    }
    collideBeads(beads, radii)
    moving = bounceRim(beads, radii) || moving
  }

  return moving
}

export function enterToss(diameter, fromX, cx, inner) {
  const r = visualRadius(diameter, LOOSE_SCALE) * PAD
  const max = Math.max(0.12, RIM - r)
  let x = (Math.random() - 0.5) * 0.18
  if (Number.isFinite(fromX) && inner) {
    x = Math.max(-0.22, Math.min(0.22, ((fromX - cx) / inner) * 0.12))
  }
  let y = Math.sqrt(Math.max(1e-6, max * max - x * x)) * 0.96
  const dist = Math.hypot(x, y) || 0.0001
  if (dist > max) {
    x *= max / dist
    y *= max / dist
  }
  const speed = 9.8 + Math.random() * 1.5
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 0.7,
    vy: -speed,
    entering: true,
  }
}

export function burstFromRing(bead, layout) {
  const ang = Math.atan2(layout.y, layout.x)
  const speed = 0.28 + Math.random() * 0.55
  return {
    ...bead,
    entering: false,
    x: layout.x,
    y: layout.y,
    vx: Math.cos(ang) * speed * 0.35 + (Math.random() - 0.5) * 0.7,
    vy: Math.sin(ang) * speed * 0.35 + (Math.random() - 0.5) * 0.7,
  }
}
