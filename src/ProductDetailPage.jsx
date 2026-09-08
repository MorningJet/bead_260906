import BraceletPreview from './BraceletPreview.jsx'
import { ChevronLeft, Pencil } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatMoney, wristFromBeads } from './lib/geometry.js'

const NOTES = [
  {
    title: '下單與確認',
    text: '送出後由人工選珠、穿串。成串後會提供實拍照片與影片確認，3 日內未回覆視為確認並安排出貨。',
  },
  {
    title: '天然差異',
    text: '天然水晶存在紋理、包裹體、冰裂、色帶與通透度差異。我們會按設計盡量選配，成品與預覽可能略有不同。',
  },
  {
    title: '佩戴保養',
    text: '避免接觸香水、酒精與化學清潔劑；勿長時間浸水或暴曬。取下時平放或收入絨袋，避免碰撞。',
  },
  {
    title: '售後說明',
    text: '客製手鍊不接受無理由退貨。收貨 7 日內如有斷線、缺珠或尺寸明顯不符，可聯絡客服並提供訂單編號與照片。',
  },
]

function groupBeads(beads) {
  const map = new Map()
  beads.forEach((b) => {
    const key = `${b.name}·${b.diameter}`
    const cur = map.get(key) || {
      key,
      name: b.name,
      diameter: b.diameter,
      count: 0,
      price: 0,
    }
    cur.count += 1
    cur.price += b.price || 0
    map.set(key, cur)
  })
  return [...map.values()]
}

export default function ProductDetailPage({
  beads,
  designName = '我的設計',
  onDesignNameChange,
  onBack,
  onPay,
}) {
  const groups = useMemo(() => groupBeads(beads), [beads])
  const total = beads.reduce((s, b) => s + (b.price || 0), 0)
  const wrist = wristFromBeads(beads)
  const ship = 0
  const [name, setName] = useState(designName || '我的設計')
  const [editing, setEditing] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    setName(designName || '我的設計')
  }, [designName])

  useEffect(() => {
    if (editing) nameRef.current?.focus()
  }, [editing])

  function commitName(value) {
    const next = value.trim() ? value : '我的設計'
    setName(next)
    setEditing(false)
    onDesignNameChange?.(next)
  }

  return (
    <div className="detail-page">
      <header className="me-bar me-sub-bar">
        <button type="button" className="me-back" onClick={onBack} aria-label="返回">
          <ChevronLeft size={22} strokeWidth={1.8} />
        </button>
        <h1>商品詳情</h1>
        <span />
      </header>

      <section className="me-card detail-hero">
        <BraceletPreview beads={beads} showMark />
      </section>

      <section className="me-card detail-name">
        {editing ? (
          <input
            ref={nameRef}
            id="design-name"
            type="text"
            maxLength={20}
            value={name}
            placeholder="我的設計"
            aria-label="設計名稱"
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => commitName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
          />
        ) : (
          <>
            <h2>{name}</h2>
            <button
              type="button"
              className="detail-name-edit"
              aria-label="修改設計名稱"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} strokeWidth={1.8} />
            </button>
          </>
        )}
      </section>

      <section className="me-card detail-info">
        <h2>手鍊資料</h2>
        <ul>
          <li>
            <span>淨手腕圍</span>
            <b>{wrist.inner.toFixed(1)}cm</b>
          </li>
          <li>
            <span>珠子合計</span>
            <b>{beads.length} 顆</b>
          </li>
          {groups.map((g) => (
            <li key={g.key}>
              <span className="detail-bead-name">
                {g.name} {g.diameter}mm
              </span>
              <b>×{g.count}</b>
            </li>
          ))}
          <li>
            <span>運費</span>
            <b>{ship === 0 ? '免運費' : formatMoney(ship)}</b>
          </li>
          <li className="detail-total">
            <span>總額</span>
            <b>{formatMoney(total)}</b>
          </li>
        </ul>
      </section>

      <section className="me-card detail-notes">
        <h2>購買及保養注意事項</h2>
        {NOTES.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <div className="detail-pay">
        <div>
          <em>應付金額</em>
          <strong>{formatMoney(total)}</strong>
        </div>
        <button type="button" onClick={onPay}>
          立即付款
        </button>
      </div>
    </div>
  )
}
