import { useState } from 'react'
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  MapPin,
  Sparkle,
  TriangleAlert,
} from 'lucide-react'
import {
  AddressPage,
  DesignsPage,
  HelpPage,
  NoticePage,
  OrdersPage,
  TermsPage,
} from './MePages.jsx'

const QUICK = [
  { id: 'orders', label: '我的訂單', Icon: CreditCard },
  { id: 'designs', label: '我的設計', Icon: Activity },
  { id: 'address', label: '送貨地址', Icon: MapPin },
]

const MENUS = [
  {
    id: 'notice',
    title: '我的通知',
    desc: '查看系統公告與訂單提醒，重要訊息不會錯過',
    Icon: TriangleAlert,
  },
  {
    id: 'help',
    title: '幫助中心',
    desc: '常見問題與售後入口，快速找到答案',
    Icon: CircleHelp,
  },
  {
    id: 'terms',
    title: '服務條款',
    desc: '查看平台協議與私隱條款，保障交易安全',
    Icon: FileText,
  },
]

const SIMPLE = {
  login: {
    title: '登入 / 註冊',
    body: '示範環境暫未接駁帳戶。登入後可管理訂單、送貨地址與我的設計。',
  },
}

const PAGE_TITLE = {
  orders: '我的訂單',
  designs: '我的設計',
  address: '送貨地址',
  notice: '我的通知',
  help: '幫助中心',
  terms: '服務條款',
  ...Object.fromEntries(Object.entries(SIMPLE).map(([id, item]) => [id, item.title])),
}

export default function ProfilePage({
  onService,
  onDiy,
  designs,
  onOpenDesign,
  onDeleteDesign,
  onToast,
}) {
  const [page, setPage] = useState(null)
  const simple = page ? SIMPLE[page] : null

  if (page) {
    return (
      <div className="me-page">
        <header className="me-bar me-sub-bar">
          <button type="button" className="me-back" onClick={() => setPage(null)} aria-label="返回">
            <ChevronLeft size={22} strokeWidth={1.8} />
          </button>
          <h1>{PAGE_TITLE[page]}</h1>
          <span />
        </header>
        {page === 'orders' && <OrdersPage />}
        {page === 'designs' && (
          <DesignsPage
            designs={designs}
            onDiy={onDiy}
            onOpen={onOpenDesign}
            onDelete={onDeleteDesign}
          />
        )}
        {page === 'address' && <AddressPage />}
        {page === 'notice' && <NoticePage />}
        {page === 'help' && <HelpPage onService={onService} />}
        {page === 'terms' && <TermsPage />}
        {simple && (
          <section className="me-card me-empty">
            <p>{simple.body}</p>
          </section>
        )}
        {page !== 'orders' && (
          <p className="page-powered">Powered by 珠珠客製</p>
        )}
      </div>
    )
  }

  return (
    <div className="me-page">
      <header className="me-bar">
        <h1>我的</h1>
      </header>

      <section className="me-card me-profile">
        <button type="button" className="me-user" onClick={() => setPage('login')}>
          <img src="./home/profile-avatar-female.png" alt="" />
          <div>
            <strong>點擊登入 / 註冊</strong>
            <p>登入後可管理訂單、地址與我的設計</p>
          </div>
        </button>
        <div className="me-quick">
          {QUICK.map((item) => {
            const Icon = item.Icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
              >
                <span>
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="me-card me-list">
        {MENUS.map((item) => {
          const Icon = item.Icon
          return (
            <button key={item.id} type="button" onClick={() => setPage(item.id)}>
              <i>
                <Icon size={16} strokeWidth={1.8} />
              </i>
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          )
        })}
      </section>

      <section className="me-card me-join">
        <span className="me-tag">
          <Sparkle size={11} strokeWidth={2} />
          駐場設計師
        </span>
        <h2>成為 Pearl 靈感設計師</h2>
        <p>上載真實作品與佩戴場景，令更多人看見你的配搭。</p>
        <div className="me-stats">
          <div>
            <b>99+</b>
            <span>駐場設計師</span>
          </div>
          <div>
            <b>HK$ 9,900</b>
            <span>最高每月收入</span>
          </div>
          <div>
            <b>4.9</b>
            <span>平均評分</span>
          </div>
        </div>
        <button
          type="button"
          className="me-apply"
          onClick={() => onToast?.('此為示範，暫不接受申請')}
        >
          立即申請 &gt;
        </button>
      </section>
      <p className="page-powered">Powered by 珠珠客製</p>
    </div>
  )
}
