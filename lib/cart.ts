export interface CartItem {
  product_id: string
  name: string
  price: number
  image_url?: string
  quantity: number
}

export const DELIVERY_FEE = 8

const CART_KEY = 'cart'
const CART_EVENT = 'cart-updated'

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function getCart(): CartItem[] {
  return readCart()
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function addToCart(
  product: { id: string; name: string; price: number; image_url?: string },
  quantity = 1
) {
  const items = readCart()
  const existing = items.find((item) => item.product_id === product.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
    })
  }
  writeCart(items)
}

export function updateCartQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }
  writeCart(
    readCart().map((item) =>
      item.product_id === productId ? { ...item, quantity } : item
    )
  )
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((item) => item.product_id !== productId))
}

export function clearCart() {
  writeCart([])
}

export function onCartChange(callback: () => void) {
  window.addEventListener(CART_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CART_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
