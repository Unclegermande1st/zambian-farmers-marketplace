// frontend/src/utils/cartUtils.js

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Load cart from localStorage
export const loadCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Add to cart
export const addToCart = (product, quantity = 1) => {
  const cart = loadCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  return cart;
};

// Remove from cart
export const removeFromCart = (productId) => {
  const cart = loadCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem('cart');
};