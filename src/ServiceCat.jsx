import { useEffect, useRef, useState } from 'react'

export default function ServiceCat({ openSignal = 0 }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ right: 2, top: 210 })
  const drag = useRef(null)

  useEffect(() => {
    if (openSignal) setOpen(true)
  }, [openSignal])

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const phone = e.currentTarget.closest('.phone')
    const rect = phone?.getBoundingClientRect()
    drag.current = {
      startY: e.clientY,
      origTop: pos.top,
      moved: false,
      phoneH: rect?.height || 800,
    }
  }

  function onPointerMove(e) {
    const d = drag.current
    if (!d) return
    const dy = e.clientY - d.startY
    if (Math.abs(dy) > 6) d.moved = true
    if (!d.moved) return
    const top = Math.min(d.phoneH - 150, Math.max(72, d.origTop + dy))
    setPos({ right: 2, top })
  }

  function onPointerUp() {
    const d = drag.current
    drag.current = null
    if (d && !d.moved) setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        className={`lab-service ${drag.current?.moved ? 'is-hold' : ''}`}
        style={{ right: pos.right, top: pos.top }}
        aria-label="客服"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null
        }}
      >
        <img className="lab-service-face" src="./home/service-cat.png?v=2" alt="" draggable={false} />
      </button>

      {open && (
        <div className="lab-service-mask" onClick={() => setOpen(false)} role="presentation">
          <div
            className="lab-service-sheet"
            role="dialog"
            aria-label="客服 Instagram"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <strong>聯絡客服</strong>
                <span>掃描 QR Code 開啟 Instagram</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="關閉">
                ×
              </button>
            </header>
            <img className="lab-service-qr" src="./home/service.jpg" alt="Instagram @PEARL_DIY_TW" />
          </div>
        </div>
      )}
    </>
  )
}
