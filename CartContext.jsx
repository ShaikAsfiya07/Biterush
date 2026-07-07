import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('foodkart_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('foodkart_cart', JSON.stringify(items));
  };

  // Add item to cart
  const addToCart = (item, restaurant) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    let updatedCart = [...cartItems];

    if (existingItemIndex > -1) {
      // Increase quantity of existing item
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item with restaurant details
      updatedCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        isVeg: item.isVeg,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        quantity: 1
      });
    }

    saveCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    saveCart(updatedCart);
  };

  // Update quantity of an item
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: Number(quantity) } : item
    );
    saveCart(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    saveCart([]);
  };

  // Calculate pricing breakdown
  const itemTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.05; // 5% tax
  const taxAmount = itemTotal * taxRate;
  
  // Delivery Fee is $4.99, but free for orders over $40 (incentive!)
  const deliveryFee = itemTotal > 0 && itemTotal < 40 ? 4.99 : 0;
  
  const grandTotal = itemTotal + taxAmount + deliveryFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemTotal: Number(itemTotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2))
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
