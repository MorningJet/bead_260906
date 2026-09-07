import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import BraceletPreview from './BraceletPreview.jsx'
import { formatSavedAt } from './lib/designs.js'

const ORDER_TABS = [
  { id: 'all', label: '全部' },
  { id: 'making', label: '製作中' },
  { id: 'ship', label: '待出貨' },
  { id: 'done', label: '已完成' },
]

const NOTICES = [
  {
    id: 'n1',
    unread: true,
    tag: '活動',
    title: '新店開業，全場免運費',
    time: '今日',
    body: '珠珠客製新店開業。即日起落單訂製手鏈，全場免運費，把工坊裏的那條手鏈寄到你手上。',
  },
]

const FAQS = [
  {
    q: '點選珠子後點解會即刻上圈？',
    a: 'DIY 採用串珠流程：點選貨架相片，珠子會由卡片飛到圓環並自動排好。沿圓周拖動可換位，拖出畫布可減走一粒。',
  },
  {
    q: '建議淨手腕圍點樣睇？',
    a: '頂部會按現時珠串周長顯示建議淨手腕圍。實際佩戴可預留約 0.5cm 餘位，過緊或過鬆都可在製作前改尺寸。',
  },
  {
    q: '製作需時幾耐？',
    a: '提交製作後由人手選珠、穿串與覆核，一般 2–4 個工作天完成，公眾假期或會順延。進度會同步到「我的通知」。',
  },
  {
    q: '點樣申請售後？',
    a: '收貨 7 日內如有斷線、缺珠或尺寸明顯不符，可點下面聯絡客服，並準備訂單編號與相片。訂製款不設無理由退貨。',
  },
  {
    q: '價錢點樣計算？',
    a: '每粒珠按所選直徑計價，畫布頂部顯示合計。加減號改尺寸時價錢會一齊變。',
  },
]

const TERMS = [
  {
    title: '一、服務說明',
    text: '珠珠客製提供珠串配搭預覽與訂製示範。頁面展示的價錢、庫存與物流僅為示範數據，不構成真實交易要約。正式落單以實際平台協議為準。',
  },
  {
    title: '二、訂製與交付',
    text: '手鏈按選定珠子與順序由人手製作。提交後進入製作流程，可在「我的訂單」查看狀態。因天然礦物存在色差、冰裂與紋理差異，成品與螢幕預覽可能略有不同，這屬於物料特性而非品質問題。',
  },
  {
    title: '三、個人資料',
    text: '送貨地址、聯絡方式僅用於製作溝通與寄送。示範環境數據保存在本機，不會上載。請勿在示範頁填寫真實敏感資料。',
  },
  {
    title: '四、知識產權',
    text: '商品圖片、品牌標誌與頁面設計歸珠珠客製及權利人所有。駐場設計師作品的展示授權按其入駐約定執行。未經許可不得作商業複製。',
  },
  {
    title: '五、免責聲明',
    text: '因示範、網絡或裝置原因導致的預覽中斷、數據遺失，平台不承擔額外賠償。礦石保養與佩戴風險請參考幫助中心說明。',
  },
]

function Empty({ title, desc, action, onAction }) {
  return (
    <section className="me-card me-empty">
      <strong>{title}</strong>
      <p>{desc}</p>
      {action && (
        <button type="button" className="me-apply dark" onClick={onAction}>
          {action}
        </button>
      )}
    </section>
  )
}

export function OrdersPage() {
  const [tab, setTab] = useState('all')

  return (
    <div className="me-tabs">
      {ORDER_TABS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={tab === item.id ? 'on' : ''}
          onClick={() => setTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function DesignsPage({ designs = [], onDiy, onOpen, onDelete }) {
  if (!designs.length) {
    return (
      <Empty
        title="暫無設計"
        desc="在 DIY 畫布點「儲存設計」後，方案會出現在這裏。"
        action="去 DIY"
        onAction={onDiy}
      />
    )
  }

  return (
    <div className="design-grid">
      {designs.map((item) => (
        <article key={item.id} className="me-card me-design">
          <div className="me-design-shot">
            <BraceletPreview beads={item.beads || []} showMark />
          </div>
          <div className="me-design-meta">
            <h3>{item.name || '我的設計'}</h3>
            <time>{formatSavedAt(item.savedAt)}</time>
          </div>
          <div className="me-design-actions">
            <button type="button" className="is-edit" onClick={() => onOpen?.(item)}>
              繼續編輯
            </button>
            <button type="button" className="is-del" onClick={() => onDelete?.(item)}>
              刪除設計
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

const emptyForm = { name: '', phone: '', region: '', detail: '', isDefault: false }

export function AddressPage() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  function openNew() {
    setForm(emptyForm)
    setEditing('new')
  }

  function openEdit(item) {
    setForm({ ...item })
    setEditing(item.id)
  }

  function save() {
    if (!form.name.trim() || !form.phone.trim() || !form.detail.trim()) return
    if (editing === 'new') {
      const item = { ...form, id: `a${Date.now()}` }
      setList((cur) => {
        const next = item.isDefault ? cur.map((a) => ({ ...a, isDefault: false })) : cur
        return [...next, item]
      })
    } else {
      setList((cur) => {
        const next = form.isDefault ? cur.map((a) => ({ ...a, isDefault: false })) : cur
        return next.map((a) => (a.id === editing ? { ...form, id: a.id } : a))
      })
    }
    setEditing(null)
  }

  function remove(id) {
    setList((cur) => cur.filter((a) => a.id !== id))
    if (editing === id) setEditing(null)
  }

  function setDefault(id) {
    setList((cur) => cur.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <>
      {list.map((item) => (
        <article key={item.id} className="me-card me-addr">
          <div className="me-addr-top">
            <strong>
              {item.name} <span>{item.phone}</span>
            </strong>
            {item.isDefault && <em>預設</em>}
          </div>
          <p>
            {item.region} {item.detail}
          </p>
          <div className="me-addr-actions">
            <button type="button" onClick={() => setDefault(item.id)}>
              設為預設
            </button>
            <button type="button" onClick={() => openEdit(item)}>
              編輯
            </button>
            <button type="button" onClick={() => remove(item.id)}>
              刪除
            </button>
          </div>
        </article>
      ))}

      {editing && (
        <section className="me-card me-form">
          <h3>{editing === 'new' ? '新增地址' : '編輯地址'}</h3>
          {[
            ['name', '收件人', '姓名'],
            ['phone', '手提電話', '8 位香港電話號碼'],
            ['region', '所在地區', '香港島 / 九龍 / 新界'],
            ['detail', '詳細地址', '街道、大廈及室號'],
          ].map(([key, label, placeholder]) => (
            <label key={key}>
              {label}
              <input
                value={form[key]}
                placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="me-check">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            />
            設為預設送貨地址
          </label>
          <button type="button" className="me-apply dark" onClick={save}>
            儲存地址
          </button>
        </section>
      )}

      {!editing && (
        <button type="button" className="me-apply dark me-add-addr" onClick={openNew}>
          <Plus size={16} strokeWidth={2} />
          新增送貨地址
        </button>
      )}
    </>
  )
}

export function NoticePage() {
  const [openId, setOpenId] = useState(NOTICES[0].id)
  const [items, setItems] = useState(NOTICES)

  function toggle(id) {
    setOpenId((cur) => (cur === id ? null : id))
    setItems((cur) => cur.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  return items.map((item) => (
    <button
      key={item.id}
      type="button"
      className={`me-card me-notice ${item.unread ? 'is-unread' : ''} ${openId === item.id ? 'is-open' : ''}`}
      onClick={() => toggle(item.id)}
    >
      <div className="me-notice-head">
        <em>{item.tag}</em>
        <span>{item.time}</span>
      </div>
      <strong>{item.title}</strong>
      {openId === item.id && <p>{item.body}</p>}
    </button>
  ))
}

export function HelpPage({ onService }) {
  const [open, setOpen] = useState(FAQS[0].q)

  return (
    <>
      {FAQS.map((item) => {
        const on = open === item.q
        return (
          <button
            key={item.q}
            type="button"
            className={`me-card me-faq ${on ? 'is-open' : ''}`}
            onClick={() => setOpen(on ? null : item.q)}
          >
            <div>
              <strong>{item.q}</strong>
              <ChevronDown size={16} strokeWidth={1.8} />
            </div>
            {on && <p>{item.a}</p>}
          </button>
        )
      })}
      <section className="me-card me-empty">
        <strong>還未解決？</strong>
        <p>點右邊貓頭或這裏聯絡客服，把訂單編號和相片發給我們。</p>
        <button type="button" className="me-apply dark" onClick={onService}>
          聯絡客服
        </button>
      </section>
    </>
  )
}

export function TermsPage() {
  return (
    <article className="me-card me-article">
      <p className="me-article-lead">更新日期：2026 年 9 月 7 日 · 適用於珠珠客製示範與訂製預覽。</p>
      {TERMS.map((block) => (
        <section key={block.title}>
          <h3>{block.title}</h3>
          <p>{block.text}</p>
        </section>
      ))}
    </article>
  )
}
