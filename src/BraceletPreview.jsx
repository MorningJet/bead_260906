import { useMemo } from 'react'
import {
  PATTERN_RING,
  TRAY_POS,
  computeScale,
  cordSvgR,
  isPendant,
  isThinSpacer,
  stringLayout,
} from './lib/geometry.js'

export default function BraceletPreview({ beads, className = '', showMark = false }) {
  const scale = useMemo(() => computeScale(beads), [beads])
  const layouts = useMemo(() => stringLayout(beads, scale), [beads, scale])
  const R = layouts[0]?.R || PATTERN_RING

  return (
    <div className={`detail-preview ${className}`.trim()}>
      <div className="detail-ring">
        {showMark && (
          <img className="detail-ring-mark" src="./logo.JPG" alt="" draggable={false} />
        )}
        <svg className="cord" viewBox="-1 -1 2 2" aria-hidden>
          <circle
            cx="0"
            cy="0"
            r={cordSvgR(R)}
            fill="none"
            stroke="rgba(17, 17, 17, 0.14)"
            strokeWidth="0.01"
          />
        </svg>
        {beads.map((bead, index) => {
          const layout = layouts[index] || { x: 0, y: 0, r: 0.1 }
          const pendant = isPendant(bead)
          const thin = isThinSpacer(bead)
          const ang = Math.atan2(layout.y, layout.x)
          const holeDeg = pendant
            ? (ang * 180) / Math.PI + 270
            : ((ang + Math.PI / 2) * 180) / Math.PI
          const cordPct = layout.r * 90
          const facePct = (layout.faceR ?? layout.r) * 90
          const widthPct = pendant ? cordPct / 0.26 : thin ? cordPct : facePct
          return (
            <div
              key={bead.id || `${bead.name}-${index}`}
              className={`bead is-strung ${pendant ? 'is-pendant' : ''} ${thin ? 'is-spacer' : ''}`}
              style={{
                left: `${50 + layout.x * TRAY_POS * 100}%`,
                top: `${50 + layout.y * TRAY_POS * 100}%`,
                width: `${widthPct}%`,
                height: thin ? `${facePct}%` : undefined,
                zIndex: pendant ? 8 + index : 5 + index,
                transformOrigin: pendant ? '50% 7%' : '50% 50%',
                transform: pendant
                  ? `translate(-50%, -7%) rotate(${holeDeg}deg)`
                  : `translate(-50%, -50%) rotate(${holeDeg}deg)`,
              }}
            >
              <img src={bead.image} alt="" draggable={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
