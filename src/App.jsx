import { ChevronLeft, Minus, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import HomePage from './HomePage.jsx'
import InspirePage from './InspirePage.jsx'
import ProductDetailPage from './ProductDetailPage.jsx'
import ProfilePage from './ProfilePage.jsx'
import ServiceCat from './ServiceCat.jsx'
import TabBar from './TabBar.jsx'
import './home.css'
import { BirthdaySheet, ZodiacCenterButton, ZodiacReading } from './ZodiacPanel.jsx'
import {
  DEFAULT_PRIMARY,
  DEFAULT_SECONDARY,
  PRIMARY_TABS,
  PRODUCTS,
  defaultSize,
  filterProducts,
  picSrc,
  secondaryTabs,
  expandWorkBeads,
} from './lib/catalog.js'
import {
  getZodiacSign,
  loadZodiacProfile,
  persistZodiacProfile,
  recommendationsFor,
  zodiacTone,
} from './lib/zodiac.js'
import {
  PATTERN_RING,
  TRAY_POS,
  computeScale,
  cordSvgR,
  formatPrice,
  isPendant,
  isThinSpacer,
  reorderByAngle,
  ringPoint,
  stringLayout,
  uid,
  wristFromBeads,
} from './lib/geometry.js'
import { DEFAULT_DEVICE, DEVICES } from './lib/devices.js'
import { loadSavedDesigns, persistSavedDesigns, snapshotDesign } from './lib/designs.js'

function cloneBeads(list) {
  return list.map((b) => ({ ...b }))
}

function cardBeadScale(product, diameter) {
  const sizes = product.sizes.map((s) => s.diameter)
  const minD = Math.min(...sizes)
  const maxD = Math.max(...sizes)
  if (maxD === minD) return 1
  const t = (diameter - minD) / (maxD - minD)
  return 0.9 + t * 0.1
}

const iconSize = 18
const iconStroke = 1.8
const FLY_MS = 680

function clientToLocal(el, clientX, clientY) {
  const box = el.getBoundingClientRect()
  return {
    x: ((clientX - box.left) / Math.max(box.width, 1)) * el.offsetWidth,
    y: ((clientY - box.top) / Math.max(box.height, 1)) * el.offsetHeight,
  }
}

function FlyingBead({ flight, onDone }) {
  const [flying, setFlying] = useState(false)

  useEffect(() => {
    const start = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlying(true))
    })
    const timer = window.setTimeout(onDone, FLY_MS)
    return () => {
      cancelAnimationFrame(start)
      window.clearTimeout(timer)
    }
  }, [flight.id])

  const x = flying ? flight.endX : flight.startX
  const y = flying ? flight.endY : flight.startY

  return (
    <img
      className="bead-fly"
      src={flight.src}
      alt=""
      draggable={false}
      style={{
        left: x,
        top: y,
        width: flight.size,
        height: flight.size,
      }}
    />
  )
}

export default function App() {
  const [booting, setBooting] = useState(true)
  const [tab, setTab] = useState('home')
  const [serviceTick, setServiceTick] = useState(0)
  const [beads, setBeads] = useState([])
  const [primary, setPrimary] = useState(DEFAULT_PRIMARY)
  const [secondary, setSecondary] = useState(DEFAULT_SECONDARY)
  const [sizeMap, setSizeMap] = useState(() => {
    const init = {}
    PRODUCTS.forEach((p) => {
      init[p.name] = defaultSize(p).diameter
    })
    return init
  })
  const [history, setHistory] = useState([])
  const [productDetail, setProductDetail] = useState(null)
  const [designName, setDesignName] = useState('我的設計')
  const [detailDesignId, setDetailDesignId] = useState(null)
  const [toast, setToast] = useState('')
  const [dragging, setDragging] = useState(null)
  const [deviceId, setDeviceId] = useState(DEFAULT_DEVICE.id)
  const [previewScale, setPreviewScale] = useState(1)
  const [desktopPreview, setDesktopPreview] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 720,
  )

  const trayRef = useRef(null)
  const phoneRef = useRef(null)
  const dragRef = useRef(null)
  const beadsRef = useRef(beads)
  const trayBox = useRef({ cx: 0, cy: 0, inner: 1, rect: null })
  const toastTimer = useRef(null)
  const historyPushed = useRef(false)
  const [gathering, setGathering] = useState(false)
  const [flights, setFlights] = useState([])
  const [arriving, setArriving] = useState(() => new Set())
  const [savedDesigns, setSavedDesigns] = useState(() => loadSavedDesigns())
  const [zodiacProfile, setZodiacProfile] = useState(() => loadZodiacProfile())
  const [birthdayOpen, setBirthdayOpen] = useState(false)

  useEffect(() => {
    beadsRef.current = beads
  }, [beads])

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 900)
    return () => clearTimeout(t)
  }, [])

  const device = DEVICES.find((d) => d.id === deviceId) || DEFAULT_DEVICE

  useEffect(() => {
    const fit = () => {
      const desktop = window.innerWidth > 720
      setDesktopPreview(desktop)
      if (!desktop) {
        setPreviewScale(1)
        return
      }
      const bar = 64
      const pad = 36
      const frameW = device.w + 28
      const frameH = device.h + 28
      const scale = Math.min(1, (window.innerWidth - pad * 2) / frameW, (window.innerHeight - bar - pad) / frameH)
      setPreviewScale(scale)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [device.w, device.h])

  const zodiacSign = getZodiacSign(zodiacProfile?.signId)
  const tabs = secondaryTabs(primary, { hasZodiac: Boolean(zodiacSign) })
  const isZodiacShelf = primary === '珠子' && secondary === 'zodiac' && Boolean(zodiacSign)
  const listing = useMemo(
    () => (isZodiacShelf ? [] : filterProducts(primary, secondary)),
    [primary, secondary, isZodiacShelf],
  )
  const zodiacRecs = useMemo(
    () => (isZodiacShelf ? recommendationsFor(zodiacSign.id) : []),
    [isZodiacShelf, zodiacSign],
  )

  const scale = useMemo(() => computeScale(beads), [beads])
  const layouts = useMemo(() => stringLayout(beads, scale), [beads, scale])
  const stats = useMemo(() => {
    const price = beads.reduce((s, b) => s + b.price, 0)
    return { price, count: beads.length, wrist: wristFromBeads(beads) }
  }, [beads])

  useEffect(() => {
    if (secondary === 'zodiac' && !zodiacSign) setSecondary('all')
  }, [secondary, zodiacSign])

  function showToast(text) {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  function pushHistory(nextBeads = beadsRef.current) {
    setHistory((h) => [...h.slice(-24), { beads: cloneBeads(nextBeads) }])
  }

  function selectedVariant(product) {
    const d = sizeMap[product.name]
    return product.sizes.find((s) => s.diameter === d) || defaultSize(product)
  }

  function changeSize(product, dir) {
    const sizes = product.sizes
    if (sizes.length < 2) return
    const cur = sizeMap[product.name]
    const idx = Math.max(0, sizes.findIndex((s) => s.diameter === cur))
    const next = sizes[Math.min(sizes.length - 1, Math.max(0, idx + dir))]
    setSizeMap((m) => ({ ...m, [product.name]: next.diameter }))
  }

  function trayMetrics() {
    const el = trayRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const next = {
      rect,
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      inner: (rect.width / 2) * 0.9,
    }
    trayBox.current = next
    return next
  }

  useEffect(() => {
    const measure = () => trayMetrics()
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (!dragging?.id) return undefined
    const move = (e) => onPointerMove(e)
    const up = (e) => onPointerUp(e)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [dragging?.id])

  function finishFlight(id) {
    setFlights((cur) => cur.filter((item) => item.id !== id))
    setArriving((cur) => {
      const next = new Set(cur)
      next.delete(id)
      return next
    })
  }

  function addProduct(product, originEl) {
    const variant = selectedVariant(product)
    const current = beadsRef.current
    const nextBeads = [...current, { id: 'tmp', diameter: variant.diameter, x: 0, y: 0 }]
    const laid = stringLayout(nextBeads, computeScale(nextBeads))
    const last = laid.at(-1) || { x: 0, y: -PATTERN_RING, faceR: 0.1, r: 0.1 }

    const bead = {
      id: uid(),
      name: product.name,
      sku: variant.sku,
      image: picSrc(product),
      diameter: variant.diameter,
      price: variant.price,
      category2: product.category2,
      x: last.x,
      y: last.y,
      vx: 0,
      vy: 0,
      rot: 0,
    }

    pushHistory(current)
    const merged = [...current, bead]
    beadsRef.current = merged
    setBeads(merged)

    const phone = phoneRef.current
    const tray = trayRef.current
    const origin = originEl?.getBoundingClientRect()
    if (phone && tray && origin) {
      const trayBoxNow = tray.getBoundingClientRect()
      const start = clientToLocal(phone, origin.left + origin.width / 2, origin.top + origin.height / 2)
      const end = clientToLocal(
        phone,
        trayBoxNow.left + trayBoxNow.width * (0.5 + last.x * TRAY_POS),
        trayBoxNow.top + trayBoxNow.height * (0.5 + last.y * TRAY_POS),
      )
      const size = Math.max(18, tray.offsetWidth * (last.faceR ?? last.r) * 0.9)
      setArriving((cur) => new Set(cur).add(bead.id))
      setFlights((cur) => [
        ...cur,
        {
          id: bead.id,
          src: bead.image,
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
          size,
        },
      ])
    }
  }

  function clearAll() {
    if (!beads.length) return
    pushHistory()
    setBeads([])
  }

  function onPointerDown(e, bead, index) {
    if (e.button === 2) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    trayMetrics()
    historyPushed.current = false
    dragRef.current = {
      id: bead.id,
      index,
      startX: e.clientX,
      startY: e.clientY,
      origX: bead.x,
      origY: bead.y,
      moved: false,
      pointerId: e.pointerId,
    }
    setDragging({ id: bead.id, x: e.clientX, y: e.clientY, ring: null })
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag) return
    const metrics = trayMetrics()
    if (!metrics) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.hypot(dx, dy) > 4) {
      if (!drag.moved) {
        drag.moved = true
        if (!historyPushed.current) {
          pushHistory()
          historyPushed.current = true
        }
      }
    }
    const angle = Math.atan2(e.clientY - metrics.cy, e.clientX - metrics.cx)
    const list = beadsRef.current
    const laid = stringLayout(list, computeScale(list))
    const R = laid[0]?.R || PATTERN_RING
    const pt = ringPoint(angle, R)
    setDragging({ id: drag.id, x: e.clientX, y: e.clientY, ring: pt })
    setBeads((cur) => reorderByAngle(cur, stringLayout(cur, computeScale(cur)), drag.id, angle))
  }

  function onPointerUp(e) {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(null)
    if (!drag) return
    const metrics = trayMetrics()
    if (!metrics) return
    const outside =
      !metrics.rect ||
      e.clientX < metrics.rect.left - 8 ||
      e.clientX > metrics.rect.right + 8 ||
      e.clientY < metrics.rect.top - 8 ||
      e.clientY > metrics.rect.bottom + 8
    if (drag.moved && outside) {
      const next = beadsRef.current.filter((b) => b.id !== drag.id)
      setBeads(next)
      showToast('已移出畫布')
    }
  }

  function openProductDetail(name = '我的設計', designId = null) {
    setDesignName(name || '我的設計')
    setDetailDesignId(designId)
    setProductDetail(cloneBeads(beadsRef.current))
  }

  function makeNow() {
    if (!beads.length) {
      showToast('請先揀選珠子，再提交製作')
      return
    }
    openProductDetail('我的設計')
  }

  function saveDesign() {
    if (!beads.length) {
      showToast('請先揀選珠子，再儲存設計')
      return
    }
    const item = snapshotDesign(beads, { wrist: stats.wrist, name: '我的設計' })
    const next = persistSavedDesigns([item, ...savedDesigns])
    setSavedDesigns(next)
    showToast('已儲存到我的設計')
    openProductDetail(item.name, item.id)
  }

  function renameDesign(name) {
    setDesignName(name)
    if (!detailDesignId) return
    const next = persistSavedDesigns(
      savedDesigns.map((d) => (d.id === detailDesignId ? { ...d, name } : d)),
    )
    setSavedDesigns(next)
  }

  function openSavedDesign(item) {
    const next = (item.beads || []).map((b) => ({
      id: uid(),
      name: b.name,
      sku: b.sku,
      image: b.image,
      diameter: b.diameter,
      price: b.price,
      category2: b.category2,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
    }))
    beadsRef.current = next
    setBeads(next)
    setGathering(true)
    setTimeout(() => setGathering(false), 520)
    setTab('diy')
    showToast(`已打開「${item.name}」`)
  }

  function switchPrimary(id) {
    setPrimary(id)
    setSecondary('all')
  }

  function confirmZodiac(sign, month, day) {
    const next = persistZodiacProfile({ signId: sign.id, month, day })
    setZodiacProfile(next)
    setBirthdayOpen(false)
    setPrimary('珠子')
    setSecondary('zodiac')
    showToast(`已切換為${sign.name}`)
  }

  return (
    <div className={`stage ${desktopPreview ? 'is-desktop' : 'is-mobile'}`}>
      {desktopPreview && (
        <div className="device-bar">
          <label>
            預覽機型
            <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
              {DEVICES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} · {item.w}×{item.h}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div
        className="device-scale"
        style={
          desktopPreview
            ? {
                width: (device.w + 28) * previewScale,
                height: (device.h + 28) * previewScale,
              }
            : undefined
        }
      >
      <div
        className={`device-shell ${device.island ? 'has-island' : 'has-notch'}`}
        style={
          desktopPreview
            ? {
                width: device.w + 28,
                height: device.h + 28,
                transform: `scale(${previewScale})`,
              }
            : undefined
        }
      >
        {desktopPreview && device.island && <div className="device-island" />}
        {desktopPreview && !device.island && <div className="device-notch" />}

        <div
          ref={phoneRef}
          className={`phone ${tab === 'diy' || productDetail ? 'has-tabbar' : 'theme-lab'}`}
          style={
            desktopPreview
              ? { width: device.w, height: device.h, '--phone-w': `${device.w}px` }
              : undefined
          }
        >
          {booting && (
            <div className="splash">
              <img src="./logo.JPG" alt="品牌標誌" />
              <p>珠珠客製</p>
            </div>
          )}
        {tab === 'home' && !productDetail && (
          <HomePage
            onCustomize={() => setTab('diy')}
            onOpenDesigner={() => setTab('inspire')}
          />
        )}
        {tab === 'inspire' && !productDetail && (
          <InspirePage
            onOpenWork={(work) => {
              const next = expandWorkBeads(work.recipe, uid)
              beadsRef.current = next
              setBeads(next)
              openProductDetail(work.title)
            }}
          />
        )}
        {tab === 'me' && !productDetail && (
          <ProfilePage
            onService={() => setServiceTick((n) => n + 1)}
            onDiy={() => setTab('diy')}
            designs={savedDesigns}
            onOpenDesign={openSavedDesign}
            onDeleteDesign={(item) => {
              const next = persistSavedDesigns(savedDesigns.filter((d) => d.id !== item.id))
              setSavedDesigns(next)
              showToast('已刪除設計')
            }}
            onToast={showToast}
          />
        )}
        {tab === 'diy' && !productDetail && (
          <>
        <header className="topbar">
          <div className="nav">
            <button className="ghost" aria-label="返回" type="button" onClick={() => setTab('home')}>
              <ChevronLeft size={iconSize} strokeWidth={iconStroke} />
            </button>
            <div className="brand">
              <img src="./logo.JPG" alt="" className="brand-logo" />
              <h1>珠珠客製</h1>
            </div>
            <div className="nav-mark" aria-hidden />
          </div>
          <div className="status">
            <div className="price-block">
              <strong>HK$ {formatPrice(stats.price)}</strong>
              <span>{stats.count} 粒</span>
            </div>
            <div className="wrist-block">
              建議淨手腕圍 {stats.wrist.inner.toFixed(1)}cm{' '}
              <span className={`wrist-fit is-${stats.wrist.fit}`}>{stats.wrist.fit}</span>
            </div>
          </div>
        </header>

        <section className="workspace">
          <div className="tray-wrap">
            <div className="tray" ref={trayRef}>
              <svg className="cord" viewBox="-1 -1 2 2" aria-hidden>
                <circle
                  cx="0"
                  cy="0"
                  r={cordSvgR(layouts[0]?.R || PATTERN_RING)}
                  fill="none"
                  stroke="rgba(17, 17, 17, 0.14)"
                  strokeWidth="0.01"
                />
              </svg>
              <ZodiacCenterButton sign={zodiacSign} onClick={() => setBirthdayOpen(true)} />
              {beads.map((bead, index) => {
                const layout = layouts[index] || { x: bead.x, y: bead.y, r: 0.1 }
                const pendant = isPendant(bead)
                const thin = isThinSpacer(bead)
                const isDrag = dragging?.id === bead.id
                const posX = isDrag && dragging.ring ? dragging.ring.x : layout.x
                const posY = isDrag && dragging.ring ? dragging.ring.y : layout.y
                const ang = Math.atan2(posY, posX)
                const holeDeg = pendant
                  ? (ang * 180) / Math.PI + 270
                  : ((ang + Math.PI / 2) * 180) / Math.PI
                const zoom = 1
                const cordPct = layout.r * 90 * zoom
                const facePct = (layout.faceR ?? layout.r) * 90 * zoom
                const widthPct = pendant ? cordPct / 0.26 : thin ? cordPct : facePct
                const heightPct = thin ? facePct : undefined
                return (
                  <button
                    key={bead.id}
                    type="button"
                    className={`bead ${isDrag ? 'is-drag' : ''} is-strung ${gathering ? 'is-gathering' : ''} ${arriving.has(bead.id) ? 'is-arriving' : ''} ${pendant ? 'is-pendant' : ''} ${thin ? 'is-spacer' : ''}`}
                    style={{
                      left: `${50 + posX * TRAY_POS * 100}%`,
                      top: `${50 + posY * TRAY_POS * 100}%`,
                      width: `${widthPct}%`,
                      height: heightPct ? `${heightPct}%` : undefined,
                      zIndex: isDrag ? 30 : pendant ? 8 + index : 5 + index,
                      transformOrigin: pendant ? '50% 7%' : '50% 50%',
                      transform: pendant
                        ? `translate(-50%, -7%) rotate(${holeDeg}deg)`
                        : `translate(-50%, -50%) rotate(${holeDeg}deg)`,
                      transitionDelay: gathering ? `${index * 28}ms` : '0ms',
                    }}
                    onPointerDown={(e) => onPointerDown(e, bead, index)}
                    aria-label={`${bead.name} ${bead.diameter}mm`}
                  >
                    <img src={bead.image} alt={bead.name} draggable={false} />
                  </button>
                )
              })}
            </div>

            <button className="icon-btn tray-clear" type="button" onClick={clearAll} aria-label="清空">
              <Trash2 size={iconSize} strokeWidth={iconStroke} />
            </button>
            <div className="tray-actions">
              <button className="save" type="button" disabled={!beads.length} onClick={saveDesign}>
                儲存設計
              </button>
              <button className="make" type="button" disabled={!beads.length} onClick={makeNow}>
                立即製作
                <Sparkles size={15} strokeWidth={iconStroke} />
              </button>
            </div>
          </div>
        </section>

        <section className="shelf">
          <div className="primary-tabs">
            {PRIMARY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={primary === tab.id ? 'on' : ''}
                onClick={() => switchPrimary(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="shelf-body">
            <aside className="sidebar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${secondary === tab.id ? 'on' : ''} ${tab.id === 'zodiac' ? 'is-zodiac' : ''}`}
                  onClick={() => setSecondary(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </aside>
            {isZodiacShelf ? (
              <div className="zodiac-shelf">
                <ZodiacReading sign={zodiacSign} />
                <div className="zodiac-rec-head">專屬水晶推薦</div>
                <div className="zodiac-grid">
                  {zodiacRecs.map((item) => {
                    const product = item.product
                    const variant = selectedVariant(product)
                    const canMinus = product.sizes[0].diameter !== variant.diameter
                    const canPlus = product.sizes[product.sizes.length - 1].diameter !== variant.diameter
                    return (
                      <article key={product.name} className={`card is-zodiac-card is-${zodiacTone(zodiacSign.element)}`}>
                        <button
                          type="button"
                          className="card-pic"
                          onClick={(e) => addProduct(product, e.currentTarget)}
                        >
                          <img
                            src={picSrc(product)}
                            alt={product.name}
                            style={{
                              transform: `scale(${cardBeadScale(product, variant.diameter)})`,
                            }}
                          />
                        </button>
                        <h3>{product.name}</h3>
                        <p>
                          {variant.diameter}mm - HK$ {variant.price}
                        </p>
                        <div className="stepper">
                          <button type="button" disabled={!canMinus} onClick={() => changeSize(product, -1)} aria-label="縮小尺寸">
                            <Minus size={11} strokeWidth={2.4} />
                          </button>
                          <button type="button" disabled={!canPlus} onClick={() => changeSize(product, 1)} aria-label="放大尺寸">
                            <Plus size={11} strokeWidth={2.4} />
                          </button>
                        </div>
                        <em>{item.keywords}</em>
                        <span>{item.reason}</span>
                      </article>
                    )
                  })}
                </div>
              </div>
            ) : (
            <div className="grid">
              {listing.length === 0 && <div className="empty-shelf">沒有符合條件的商品</div>}
              {listing.map((product) => {
                const variant = selectedVariant(product)
                const canMinus = product.sizes[0].diameter !== variant.diameter
                const canPlus = product.sizes[product.sizes.length - 1].diameter !== variant.diameter
                return (
                  <article key={product.name} className="card">
                    <button
                      type="button"
                      className="card-pic"
                      onClick={(e) => addProduct(product, e.currentTarget)}
                    >
                      <img
                        src={picSrc(product)}
                        alt={product.name}
                        style={{
                          transform: `scale(${cardBeadScale(product, variant.diameter)})`,
                        }}
                      />
                    </button>
                    <h3>{product.name}</h3>
                    <p>
                      {variant.diameter}mm - HK$ {variant.price}
                    </p>
                    <div className="stepper">
                      <button type="button" disabled={!canMinus} onClick={() => changeSize(product, -1)} aria-label="縮小尺寸">
                        <Minus size={11} strokeWidth={2.4} />
                      </button>
                      <button type="button" disabled={!canPlus} onClick={() => changeSize(product, 1)} aria-label="放大尺寸">
                        <Plus size={11} strokeWidth={2.4} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            )}
          </div>
        </section>
          </>
        )}
        {productDetail && (
          <ProductDetailPage
            beads={productDetail}
            designName={designName}
            onDesignNameChange={renameDesign}
            onBack={() => setProductDetail(null)}
            onPay={() => showToast('此為示範，暫不支援購買')}
          />
        )}
        <ServiceCat openSignal={serviceTick} />
        {tab === 'diy' && !productDetail && birthdayOpen && (
          <BirthdaySheet
            month={zodiacProfile?.month}
            day={zodiacProfile?.day}
            onClose={() => setBirthdayOpen(false)}
            onConfirm={confirmZodiac}
          />
        )}
        {flights.length > 0 && (
          <div className="bead-fly-layer" aria-hidden>
            {flights.map((flight) => (
              <FlyingBead key={flight.id} flight={flight} onDone={() => finishFlight(flight.id)} />
            ))}
          </div>
        )}
        <TabBar
          tab={tab}
          onChange={(id) => {
            setProductDetail(null)
            setTab(id)
          }}
        />
      </div>
      </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="ghost" onClick={onClose} aria-label="關閉">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
