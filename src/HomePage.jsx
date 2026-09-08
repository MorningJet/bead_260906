import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleDashed,
  Gem,
  Sparkle,
} from 'lucide-react'
import { DESIGNERS } from './lib/designers.js'

const HEROES = [
  {
    id: 'constellation',
    image: './home/hero-constellation.jpg',
    tag: '星座配珠',
    title: '把星空編成可戴的手鍊',
    desc: '十二星座各有主石。輸入生日，\n讓專屬水晶跟著你的星盤走。',
    overlay: 'dark',
  },
  {
    id: 'workshop',
    image: './home/hero-workshop.png',
    tag: '客製更安心',
    title: '看得見的製作過程',
    desc: '選珠、搭配、確認手腕圍，每一步都在你眼前完成。',
    overlay: 'soft',
  },
  {
    id: 'minerals',
    image: './home/hero-minerals.png',
    tag: '礦物樣本',
    title: '真實樣本即時調用',
    desc: '真實珠子照片放入托盤，碰撞、排列、成串都可預覽。',
    overlay: 'dark',
  },
]

const STEPS = [
  { n: '01', title: '挑選主石', desc: '從珠子庫選進托盤', Icon: Gem },
  { n: '02', title: '選擇配飾', desc: '搭配最新飾品襯托手鍊', Icon: Sparkle },
  { n: '03', title: '調整尺寸', desc: '修改並確認手腕圍', Icon: CircleDashed },
  { n: '04', title: '儲存下單', desc: '生成你的專屬手鍊', Icon: Check },
]

const STEP_PAGES = [STEPS.slice(0, 2), STEPS.slice(2, 4)]

export default function HomePage({ onCustomize, onOpenDesigner }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const [stepPage, setStepPage] = useState(0)
  const heroTimer = useRef(null)
  const stepTimer = useRef(null)

  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HEROES.length)
    }, 5200)
    return () => clearInterval(heroTimer.current)
  }, [])

  useEffect(() => {
    stepTimer.current = setInterval(() => {
      setStepPage((p) => (p + 1) % STEP_PAGES.length)
    }, 3800)
    return () => clearInterval(stepTimer.current)
  }, [])

  function goHero(i) {
    setHeroIndex(i)
    clearInterval(heroTimer.current)
    heroTimer.current = setInterval(() => {
      setHeroIndex((n) => (n + 1) % HEROES.length)
    }, 5200)
  }

  function goStepPage(p) {
    setStepPage(p)
    clearInterval(stepTimer.current)
    stepTimer.current = setInterval(() => {
      setStepPage((n) => (n + 1) % STEP_PAGES.length)
    }, 3800)
  }

  const hero = HEROES[heroIndex]

  return (
    <div className="lab-home">
      <section className={`lab-hero is-${hero.overlay}`}>
        {HEROES.map((item, i) => (
          <img
            key={item.id}
            className={i === heroIndex ? 'on' : ''}
            src={item.image}
            alt=""
          />
        ))}
        <div className="lab-hero-shade" />
        <header className="lab-hero-bar">
          <BrandMark />
        </header>
        <div className="lab-hero-copy">
          <span className="lab-chip">✦ {hero.tag}</span>
          <h2>{hero.title}</h2>
          <p>{hero.desc}</p>
          <button type="button" className="lab-cta" onClick={onCustomize}>
            開始客製 <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="lab-dots" role="tablist">
          {HEROES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={i === heroIndex ? 'on' : ''}
              onClick={() => goHero(i)}
              aria-label={`宣傳圖 ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="lab-sheet">
      <section className="lab-block">
        <div className="lab-head">
          <h3>客製工坊</h3>
          <div className="lab-mini-dots">
            {STEP_PAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === stepPage ? 'on' : ''}
                onClick={() => goStepPage(i)}
                aria-label={`流程第 ${i + 1} 組`}
              />
            ))}
          </div>
        </div>
        <div className="lab-steps-wrap">
          <div
            className="lab-steps-track"
            style={{ transform: `translateX(-${stepPage * 100}%)` }}
          >
            {STEP_PAGES.map((page, pi) => (
              <div key={pi} className={`lab-steps-page ${pi === 1 ? 'is-tail' : 'is-head'}`}>
                {page.map((step, i) => {
                  const Icon = step.Icon
                  const active = i === 0
                  return (
                    <article key={step.n} className={`lab-step ${active ? 'is-on' : ''}`}>
                      <div className={`lab-step-icon ${active ? 'filled' : ''}`}>
                        <Icon size={16} strokeWidth={1.8} />
                      </div>
                      <span className="lab-step-num">STEP {step.n}</span>
                      <strong>{step.title}</strong>
                      <p>{step.desc}</p>
                    </article>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-block lab-designers">
        <div className="lab-head">
          <div>
            <h3>駐場設計師</h3>
            <p className="lab-sub">由真實作品與佩戴場景出發，找到最適合你的靈感方案</p>
          </div>
        </div>
        <div className="lab-designer-row">
          {DESIGNERS.map((d) => (
            <article key={d.name} className="lab-dcard">
              <div className="lab-dcard-body">
                <div className="lab-dcard-top">
                  <img className="lab-avatar" src={d.avatar} alt="" />
                  <div>
                    <h4>
                      {d.name}
                      {d.verified && <span className="lab-v">v</span>}
                    </h4>
                    <em>★ {d.rating}</em>
                  </div>
                </div>
                <p>{d.bio}</p>
                <div className="lab-stats">
                  <div>
                    <span>已發佈作品</span>
                    <b>{d.works}</b>
                  </div>
                  <div>
                    <span>累計收入</span>
                    <b>{d.income}</b>
                  </div>
                </div>
                <button type="button" onClick={() => onOpenDesigner?.(d)}>
                  查看主頁
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-block lab-process">
        <div className="lab-head">
          <div>
            <h3>下單與製作流程</h3>
            <p className="lab-sub">真實，是我們一直堅持的目標</p>
          </div>
        </div>
        <article className="lab-process-card">
          <img className="lab-process-guide" src="./home/guide.png" alt="下單後製作與確認流程" />
        </article>
      </section>
      <p className="page-powered">Powered by 珠珠客製</p>
      </div>
    </div>
  )
}

function BrandMark() {
  return (
    <div className="lab-logo">
      <img src="./logo.JPG" alt="" />
      <strong>珠珠客製</strong>
    </div>
  )
}
