import BraceletPreview from './BraceletPreview.jsx'
import { expandWorkBeads } from './lib/catalog.js'
import { DESIGNERS, WORKS } from './lib/designers.js'
import { wristCmOf } from './lib/geometry.js'

function workBeads(work) {
  let n = 0
  return expandWorkBeads(work.recipe, () => `${work.id}-${n++}`)
}

export default function InspirePage({ onOpenWork }) {
  return (
    <div className="inspire-page">
      <header className="me-bar">
        <div className="inspire-head">
          <h1>靈感</h1>
          <p className="lab-sub">瀏覽設計師真實作品，找到適合你的配搭靈感</p>
        </div>
      </header>

      <div className="design-grid">
        {WORKS.filter((work) => wristCmOf(workBeads(work)) >= 13).map((work) => {
          const designer = DESIGNERS.find((d) => d.name === work.designer)
          return (
            <article key={work.id} className="me-card me-design">
              <button
                type="button"
                className="inspire-shot"
                onClick={() => onOpenWork?.(work)}
                aria-label={`${work.title}商品詳情`}
              >
                <div className="me-design-shot">
                  <BraceletPreview beads={workBeads(work)} showMark />
                </div>
              </button>
              <h3 className="inspire-title">{work.title}</h3>
              <div className="inspire-who">
                <img src={designer?.avatar} alt="" />
                <div>
                  <h4>
                    {work.designer}
                    {designer?.verified && <span className="lab-v">v</span>}
                  </h4>
                  <em>★ {designer?.rating}</em>
                </div>
              </div>
              <p className="inspire-desc">{work.desc}</p>
            </article>
          )
        })}
      </div>
      <p className="page-powered">Powered by 珠珠客製</p>
    </div>
  )
}
