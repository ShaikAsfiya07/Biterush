import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    itemTotal,
    taxAmount,
    deliveryFee,
    grandTotal 
  } = useCart();

  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleQtyChange = (itemId, currentQty, amount, itemName) => {
    const newQty = currentQty + amount;
    updateQuantity(itemId, newQty);
    if (newQty === 0) {
      showToast(`Removed ${itemName} from cart`, 'info');
    }
  };

  const handleRemoveClick = (itemId, itemName) => {
    removeFromCart(itemId);
    showToast(`Removed ${itemName} from cart`, 'info');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCoupon = couponCode.trim().toUpperCase();

    if (cleanCoupon === 'FOODKART20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      showToast('Coupon Applied! You saved 20% on items.', 'success');
    } else if (cleanCoupon === 'FREE5') {
      setDiscountPercent(5);
      setCouponApplied(true);
      showToast('Coupon Applied! You saved 5% on items.', 'success');
    } else {
      showToast('Invalid coupon code. Try FOODKART20!', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setCouponApplied(false);
    setCouponCode('');
    showToast('Coupon removed', 'info');
  };

  // Recalculate values based on discount
  const discountAmount = Number(((itemTotal * discountPercent) / 100).toFixed(2));
  const newSubTotal = Number((itemTotal - discountAmount).toFixed(2));
  const newTaxAmount = Number((newSubTotal * 0.05).toFixed(2));
  const finalGrandTotal = Number((newSubTotal + newTaxAmount + deliveryFee).toFixed(2));

  const handleProceedToCheckout = () => {
    // Save coupon discount state in sessionStorage to access on Payment Page
    if (couponApplied) {
      sessionStorage.setItem('foodkart_discount_amount', discountAmount);
      sessionStorage.setItem('foodkart_coupon_applied', couponCode);
    } else {
      sessionStorage.removeItem('foodkart_discount_amount');
      sessionStorage.removeItem('foodkart_coupon_applied');
    }
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-scale-up" style={{ padding: '40px 0' }}>
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <ShoppingBag size={54} strokeWidth={1.5} />
          </div>
          <h1 className="empty-cart-title">Your Cart is Empty</h1>
          <p className="empty-cart-desc">
            Looks like you haven't added anything to your cart yet. Go ahead and explore top restaurants nearby to satisfy your hunger!
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="cart-header-row" style={{ borderBottom: 'none', marginBottom: '10px' }}>
        <h1 className="cart-title">Shopping Cart</h1>
        <button className="clear-cart-btn" onClick={() => { clearCart(); showToast('Cart cleared', 'info'); }}>
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <main className="cart-items-container" aria-label="Selected cart items">
          <div className="cart-item-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row animate-slide-up">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <span className="cart-item-restaurant">from {item.restaurantName}</span>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-counter">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQtyChange(item.id, item.quantity, -1, item.name)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQtyChange(item.id, item.quantity, 1, item.name)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <span className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <button 
                    className="remove-item-btn" 
                    onClick={() => handleRemoveClick(item.id, item.name)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Cart Summary Panel */}
        <aside className="cart-summary-card" aria-label="Cart summary breakdown">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-row">
            <span>Items Subtotal</span>
            <span>${itemTotal.toFixed(2)}</span>
          </div>

          {couponApplied && (
            <div className="summary-row" style={{ color: 'var(--success)', fontWeight: 600 }}>
              <span>Discount ({discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>GST & Restaurant Tax (5%)</span>
            <span>${newTaxAmount.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Grand Total</span>
            <span className="total-price">${finalGrandTotal.toFixed(2)}</span>
          </div>

          {/* Coupon Code Section */}
          {!couponApplied ? (
            <form onSubmit={handleApplyCoupon} className="coupon-section">
              <input 
                type="text" 
                placeholder="Enter Coupon (FOODKART20)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                aria-label="Promo code input"
              />
              <button type="submit" className="btn btn-secondary">Apply</button>
            </form>
          ) : (
            <div className="coupon-section" style={{ justifyContent: 'space-between', alignItems: 'center', background: 'var(--success-light)', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--veg-color)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Tag size={14} /> Code {couponCode.toUpperCase()} Applied!
              </div>
              <button 
                type="button" 
                onClick={handleRemoveCoupon} 
                style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textDecoration: 'underline' }}
              >
                Remove
              </button>
            </div>
          )}

          <button 
            className="btn btn-primary btn-checkout" 
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          {deliveryFee > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
              Add <strong>${(40 - itemTotal).toFixed(2)}</strong> more to get <strong>FREE delivery</strong>!
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
