import { Activity, CirclePlus, LayoutGrid, User } from 'lucide-react'

const TABS = [
  { id: 'home', label: '首頁', Icon: LayoutGrid },
  { id: 'inspire', label: '靈感', Icon: Activity },
  { id: 'diy', label: 'DIY', Icon: CirclePlus },
  { id: 'me', label: '我的', Icon: User },
]

export default function TabBar({ tab, onChange }) {
  return (
    <nav className="lab-tabbar" aria-label="底部導航">
      {TABS.map((item) => {
        const Icon = item.Icon
        const on = tab === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={on ? 'on' : ''}
            onClick={() => onChange(item.id)}
          >
            <Icon size={18} strokeWidth={on ? 2.2 : 1.7} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
