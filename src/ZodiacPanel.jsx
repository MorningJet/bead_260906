import { useMemo, useState } from 'react'
import { daysInMonth, signBack, signFromBirth, signIcon, zodiacTone } from './lib/zodiac.js'

export function ZodiacCenterButton({ sign, onClick }) {
  const tone = sign ? zodiacTone(sign.element) : 'idle'
  const iconId = sign?.id || 'aquarius'
  return (
    <button
      type="button"
      className={`zodiac-center is-${tone} ${sign ? 'has-sign' : 'is-idle'}`}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={sign ? `目前星座 ${sign.name}，點擊可修改生日` : '點擊輸入生日，查看星座推薦'}
    >
      <span className="zodiac-center-face">
        <img className="zodiac-center-icon" src={signIcon(iconId)} alt="" />
      </span>
    </button>
  )
}

export function BirthdaySheet({ month: initMonth, day: initDay, onClose, onConfirm }) {
  const [month, setMonth] = useState(initMonth || 6)
  const [day, setDay] = useState(Math.min(initDay || 15, daysInMonth(initMonth || 6)))
  const preview = useMemo(() => signFromBirth(month, day), [month, day])
  const maxDay = daysInMonth(month)

  function changeMonth(next) {
    setMonth(next)
    setDay((d) => Math.min(d, daysInMonth(next)))
  }

  return (
    <div className="zodiac-mask" onClick={onClose} role="presentation">
      <div
        className="zodiac-sheet"
        role="dialog"
        aria-label="輸入出生日期"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <strong>輸入出生日期</strong>
          <button type="button" onClick={onClose} aria-label="關閉">
            ×
          </button>
        </header>
        <div className="zodiac-date-row">
          <label>
            <select value={month} onChange={(e) => changeMonth(Number(e.target.value))} aria-label="月">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <em>月</em>
          </label>
          <i className="zodiac-date-sep" aria-hidden>
            /
          </i>
          <label>
            <select value={Math.min(day, maxDay)} onChange={(e) => setDay(Number(e.target.value))} aria-label="日">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <em>日</em>
          </label>
        </div>
        {preview && (
          <div className={`zodiac-preview is-${zodiacTone(preview.element)}`}>
            <img src={signIcon(preview.id)} alt="" />
            <div>
              <strong>
                {preview.name} · {preview.element}
              </strong>
              <span>{preview.range}</span>
            </div>
            <button
              type="button"
              className="zodiac-preview-confirm"
              onClick={() => onConfirm(preview, month, Math.min(day, maxDay))}
            >
              確認
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ZodiacReading({ sign }) {
  if (!sign) return null
  const parts = sign.reading.split('。').map((s) => s.trim()).filter(Boolean)
  const blurb = `${parts[0]}。`
  const energy = parts.length > 1 ? `${parts.slice(1).join('。')}。` : ''
  const tone = zodiacTone(sign.element)

  return (
    <article className={`zodiac-card is-${tone}`}>
      <img className="zodiac-card-back" src={signBack(sign.id)} alt="" />
      <div className="zodiac-card-copy">
        <p className="zodiac-card-keys">
          <em>關鍵詞</em>
          {sign.keywords}
        </p>
        <p className="zodiac-card-blurb">{blurb}</p>
        {energy ? (
          <p className="zodiac-card-energy">
            <strong>能量特點</strong> {energy}
          </p>
        ) : null}
      </div>
    </article>
  )
}
