import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, Wallet, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, itemTotal, deliveryFee, clearCart } = useCart();
  const { showToast } = useToast();

  const [activeMethod, setActiveMethod] = useState('card');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiData, setUpiData] = useState({ vpa: '' });
  const [formErrors, setFormErrors] = useState({});

  // Recalculate grand total taking coupon discount from sessionStorage into account
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    // If cart is empty, user shouldn't be here - redirect to home/cart
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const savedDiscount = sessionStorage.getItem('foodkart_discount_amount');
    const savedCoupon = sessionStorage.getItem('foodkart_coupon_applied');
    if (savedDiscount) {
      setDiscountAmount(Number(savedDiscount));
    }
    if (savedCoupon) {
      setAppliedCoupon(savedCoupon);
    }
  }, [cartItems, navigate]);

  const newSubTotal = Number((itemTotal - discountAmount).toFixed(2));
  const newTaxAmount = Number((newSubTotal * 0.05).toFixed(2));
  const calculatedGrandTotal = Number((newSubTotal + newTaxAmount + deliveryFee).toFixed(2));

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    // Format card number with spaces every 4 characters
    if (name === 'number') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        setCardData(prev => ({ ...prev, number: parts.join(' ') }));
      } else {
        setCardData(prev => ({ ...prev, number: v }));
      }
    } 
    // Format Expiry MM/YY
    else if (name === 'expiry') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        setCardData(prev => ({ ...prev, expiry: v.substring(0, 2) + '/' + v.substring(2, 4) }));
      } else {
        setCardData(prev => ({ ...prev, expiry: v }));
      }
    }
    // Standard inputs
    else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUpiChange = (e) => {
    setUpiData({ vpa: e.target.value });
    if (formErrors.vpa) {
      setFormErrors(prev => ({ ...prev, vpa: '' }));
    }
  };

  const validateCardForm = () => {
    const errors = {};
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      errors.number = 'Please enter a valid 16-digit card number';
    }
    if (!cardData.name.trim()) {
      errors.name = 'Cardholder name is required';
    }
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!cardData.expiry || !expiryRegex.test(cardData.expiry)) {
      errors.expiry = 'Enter valid expiry date (MM/YY)';
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      errors.cvv = 'CVV must be 3 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpiForm = () => {
    const errors = {};
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiData.vpa || !upiRegex.test(upiData.vpa)) {
      errors.vpa = 'Please enter a valid UPI ID (e.g. name@bank)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentError('');

    // 1. Validate Form Fields based on Active Method
    if (activeMethod === 'card' && !validateCardForm()) {
      showToast('Please complete the credit card form details', 'error');
      return;
    }
    if (activeMethod === 'upi' && !validateUpiForm()) {
      showToast('Please enter a valid UPI ID', 'error');
      return;
    }

    // 2. Validate Amount matching Grand Total
    const parsedAmount = parseFloat(enteredAmount);
    if (isNaN(parsedAmount)) {
      setPaymentError('Please enter a valid number for amount.');
      showToast('Invalid amount format', 'error');
      return;
    }

    if (parsedAmount !== calculatedGrandTotal) {
      const errorMsg = `Declined: The amount entered ($${parsedAmount.toFixed(2)}) must exactly match the Grand Total ($${calculatedGrandTotal.toFixed(2)}).`;
      setPaymentError(errorMsg);
      showToast('Amount mismatch. Please double check.', 'error');
      return;
    }

    // 3. Trigger Fake Payment Gateway delay
    setIsProcessing(true);
    showToast('Authorizing payment with bank...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      showToast('Payment Successful!', 'success');
      
      // Save order info to pass to Success Page
      const orderSummary = {
        orderId: 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        itemTotal,
        discountAmount,
        appliedCoupon,
        deliveryFee,
        taxAmount: newTaxAmount,
        grandTotal: calculatedGrandTotal,
        paymentMethod: activeMethod === 'card' ? 'Credit/Debit Card' : activeMethod === 'upi' ? 'UPI' : 'Net Banking',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      
      // Persist order details in sessionStorage for the success page
      sessionStorage.setItem('foodkart_latest_order', JSON.stringify(orderSummary));
      
      // Clear Cart Context
      clearCart();
      
      // Redirect
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <h1 className="cart-title" style={{ marginBottom: '24px' }}>Checkout & Payment</h1>

      <div className="payment-layout">
        {/* Left Column: Form Details */}
        <main className="payment-options-container" aria-label="Payment method details">
          <h2 className="summary-title" style={{ borderBottom: 'none', marginBottom: '16px' }}>Select Payment Method</h2>

          <div className="payment-methods">
            {/* Credit/Debit Card Option */}
            <div 
              className={`payment-method-card ${activeMethod === 'card' ? 'selected' : ''}`}
              onClick={() => { setActiveMethod('card'); setFormErrors({}); }}
            >
              <div className="payment-method-radio">
                <div className="payment-method-radio-inner"></div>
              </div>
              <CreditCard className="payment-method-icon" size={24} />
              <div className="payment-method-info">
                <span className="payment-method-title">Credit or Debit Card</span>
                <span className="payment-method-desc">Pay securely using Visa, Mastercard, or Amex</span>
              </div>
            </div>

            {/* UPI Option */}
            <div 
              className={`payment-method-card ${activeMethod === 'upi' ? 'selected' : ''}`}
              onClick={() => { setActiveMethod('upi'); setFormErrors({}); }}
            >
              <div className="payment-method-radio">
                <div className="payment-method-radio-inner"></div>
              </div>
              <Wallet className="payment-method-icon" size={24} />
              <div className="payment-method-info">
                <span className="payment-method-title">UPI / Instant Transfer</span>
                <span className="payment-method-desc">Pay instantly using GooglePay, PhonePe, or BHIM</span>
              </div>
            </div>

            {/* NetBanking Option */}
            <div 
              className={`payment-method-card ${activeMethod === 'netbanking' ? 'selected' : ''}`}
              onClick={() => { setActiveMethod('netbanking'); setFormErrors({}); }}
            >
              <div className="payment-method-radio">
                <div className="payment-method-radio-inner"></div>
              </div>
              <DollarSign className="payment-method-icon" size={24} />
              <div className="payment-method-info">
                <span className="payment-method-title">Net Banking</span>
                <span className="payment-method-desc">Log in securely to your personal bank portal</span>
              </div>
            </div>
          </div>

          {/* Form Input areas */}
          <form onSubmit={handlePaymentSubmit} className="payment-form-wrapper">
            {/* Card Form */}
            {activeMethod === 'card' && (
              <div className="animate-slide-down">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    name="number"
                    className="form-control"
                    placeholder="4000 1234 5678 9010"
                    maxLength="19"
                    value={cardData.number}
                    onChange={handleCardChange}
                    disabled={isProcessing}
                    aria-label="Card number"
                  />
                  {formErrors.number && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{formErrors.number}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="card-name">Cardholder Name</label>
                  <input
                    id="card-name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    value={cardData.name}
                    onChange={handleCardChange}
                    disabled={isProcessing}
                    aria-label="Cardholder name"
                  />
                  {formErrors.name && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="card-expiry">Expiry Date</label>
                    <input
                      id="card-expiry"
                      type="text"
                      name="expiry"
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      disabled={isProcessing}
                      aria-label="Card expiry date"
                    />
                    {formErrors.expiry && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{formErrors.expiry}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-cvv">CVV</label>
                    <input
                      id="card-cvv"
                      type="password"
                      name="cvv"
                      className="form-control"
                      placeholder="•••"
                      maxLength="3"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      disabled={isProcessing}
                      aria-label="CVV"
                    />
                    {formErrors.cvv && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{formErrors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {activeMethod === 'upi' && (
              <div className="form-group animate-slide-down">
                <label htmlFor="upi-vpa">Virtual Payment Address (VPA)</label>
                <input
                  id="upi-vpa"
                  type="text"
                  className="form-control"
                  placeholder="username@okaxis"
                  value={upiData.vpa}
                  onChange={handleUpiChange}
                  disabled={isProcessing}
                  aria-label="UPI ID"
                />
                {formErrors.vpa && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{formErrors.vpa}</span>}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
                  A payment request will be sent to this VPA/UPI ID.
                </span>
              </div>
            )}

            {/* NetBanking Information message */}
            {activeMethod === 'netbanking' && (
              <div className="payment-verify-container animate-slide-down">
                <div className="payment-verify-title">
                  <ShieldCheck size={16} /> NetBanking Redirection
                </div>
                <p className="payment-verify-desc" style={{ marginBottom: 0 }}>
                  You will be safely redirected to your secure bank's authorization gateway portal to verify login credentials.
                </p>
              </div>
            )}

            {/* MANDATORY: Enter exact amount verification block */}
            <div className="payment-verify-container" style={{ borderLeft: '4px solid #b45309', background: '#fffbeb' }}>
              <div className="payment-verify-title">
                <AlertTriangle size={16} /> Amount Matching Verification
              </div>
              <p className="payment-verify-desc">
                To confirm this simulated payment, you must input the exact checkout grand total of <strong>${calculatedGrandTotal.toFixed(2)}</strong> below.
              </p>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="entered-amount" style={{ color: '#b45309' }}>Enter Exact Amount ($)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="entered-amount"
                    type="text"
                    className="form-control"
                    placeholder="0.00"
                    value={enteredAmount}
                    onChange={(e) => setEnteredAmount(e.target.value)}
                    style={{ paddingLeft: '32px', borderColor: '#f59e0b' }}
                    disabled={isProcessing}
                    aria-label="Enter exact total amount to confirm"
                  />
                  <span style={{ position: 'absolute', left: '12px', fontWeight: 700, color: '#f59e0b' }}>$</span>
                </div>
              </div>
            </div>

            {/* Error alerts */}
            {paymentError && (
              <div className="payment-error-alert animate-scale-up">
                <AlertTriangle size={18} /> {paymentError}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', gap: '8px' }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                  Processing Transaction...
                </>
              ) : (
                <>
                  <Lock size={16} /> Pay ${calculatedGrandTotal.toFixed(2)} Securely
                </>
              )}
            </button>
          </form>
        </main>

        {/* Right Column: Receipt summary */}
        <aside className="cart-summary-card" aria-label="Checkout receipt details">
          <h2 className="summary-title">Order Summary</h2>
          <div className="cart-item-list" style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {item.name} <strong style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</strong>
                </span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ fontSize: '0.85rem' }}>
            <span>Subtotal</span>
            <span>${itemTotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
              <span>Coupon Discount ({appliedCoupon})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row" style={{ fontSize: '0.85rem' }}>
            <span>Delivery charges</span>
            <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>

          <div className="summary-row" style={{ fontSize: '0.85rem' }}>
            <span>GST & Tax (5%)</span>
            <span>${newTaxAmount.toFixed(2)}</span>
          </div>

          <div className="summary-row total" style={{ borderTopStyle: 'dashed', paddingValues: '12px 0 0 0', margin: '12px 0 0 0' }}>
            <span>Total to Pay</span>
            <span style={{ color: 'var(--primary-color)' }}>${calculatedGrandTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
