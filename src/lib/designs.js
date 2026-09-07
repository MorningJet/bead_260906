const KEY = 'bead-saved-designs'

export function loadSavedDesigns() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function persistSavedDesigns(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  return list
}

export function snapshotDesign(beads, extras = {}) {
  return {
    id: `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: extras.name || '我的設計',
    savedAt: new Date().toISOString(),
    count: beads.length,
    price: beads.reduce((s, b) => s + (b.price || 0), 0),
    wrist: extras.wrist || null,
    pics: [...new Set(beads.map((b) => b.image).filter(Boolean))].slice(0, 4),
    beads: beads.map((b) => ({
      name: b.name,
      sku: b.sku,
      image: b.image,
      diameter: b.diameter,
      price: b.price,
      category2: b.category2,
    })),
  }
}

export function formatSavedAt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  if (sameDay) return `今日 ${hh}:${mm}`
  return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')} ${hh}:${mm}`
}
