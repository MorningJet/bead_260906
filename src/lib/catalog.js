import raw from '../data/products.json'

export const PRODUCTS = raw.map((p) => ({
  ...p,
  image: encodeURI(`./${p.image}`),
}))

function uniqueInOrder(values) {
  const seen = new Set()
  const list = []
  values.forEach((value) => {
    if (!value || seen.has(value)) return
    seen.add(value)
    list.push(value)
  })
  return list
}

export const PRIMARY_TABS = uniqueInOrder(PRODUCTS.map((p) => p.category1)).map((id) => ({
  id,
  label: id,
}))

const BEAD_CATEGORY2_ORDER = [
  '紫水晶',
  '白水晶',
  '綠水晶',
  '黃水晶',
  '粉水晶',
  '紅水晶',
  '橙水晶',
  '茶水晶',
  '黑水晶',
  '彩水晶',
  '天然石',
]

function orderedUniques(values, preferredOrder = []) {
  const names = uniqueInOrder(values)
  if (!preferredOrder.length) return names
  const rank = new Map(preferredOrder.map((name, i) => [name, i]))
  return [...names].sort((a, b) => (rank.get(a) ?? 999) - (rank.get(b) ?? 999))
}

const SECONDARY_BY_PRIMARY = {}
PRIMARY_TABS.forEach(({ id }) => {
  SECONDARY_BY_PRIMARY[id] = orderedUniques(
    PRODUCTS.filter((p) => p.category1 === id).map((p) => p.category2),
    id === '珠子' ? BEAD_CATEGORY2_ORDER : [],
  ).map((name) => ({ id: name, label: name }))
})

export function secondaryTabs(primary, { hasZodiac } = {}) {
  const children = SECONDARY_BY_PRIMARY[primary] || []
  const allLabel = primary === '配飾' ? '全部配飾' : '全部珠子'
  const tabs = [{ id: 'all', label: allLabel }]
  if (primary === '珠子' && hasZodiac) {
    tabs.push({ id: 'zodiac', label: '星座推薦' })
  }
  return [...tabs, ...children]
}

export const DEFAULT_PRIMARY = PRIMARY_TABS[0]?.id || ''
export const DEFAULT_SECONDARY = 'all'

export function filterProducts(primary, secondary) {
  return PRODUCTS.filter((p) => {
    if (p.category1 !== primary) return false
    if (secondary === 'all') return true
    return p.category2 === secondary
  })
}

export function defaultSize(product) {
  return product.sizes[0]
}

export function picSrc(product) {
  return product.image
}

export function expandWorkBeads(recipe, makeId) {
  const beads = []
  recipe.forEach((item) => {
    const product = PRODUCTS.find((p) => p.name === item.name)
    if (!product) return
    const variant = item.diameter
      ? product.sizes.find((s) => s.diameter === item.diameter) || defaultSize(product)
      : defaultSize(product)
    const n = item.count || 1
    for (let i = 0; i < n; i += 1) {
      beads.push({
        id: makeId(),
        name: product.name,
        sku: variant.sku,
        image: picSrc(product),
        diameter: variant.diameter,
        price: variant.price,
        category2: product.category2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rot: 0,
      })
    }
  })
  return beads
}

export function recipePreviewPics(recipe) {
  const names = []
  recipe.forEach((item) => {
    if (!names.includes(item.name)) names.push(item.name)
  })
  return names
    .slice(0, 4)
    .map((name) => PRODUCTS.find((p) => p.name === name)?.image)
    .filter(Boolean)
}
