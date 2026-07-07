import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Home, Calendar, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Retrieve latest order information from sessionStorage
    const latestOrder = sessionStorage.getItem('foodkart_latest_order');
    if (latestOrder) {
      setOrder(JSON.parse(latestOrder));
    } else {
      // If direct route navigation without order context, send back to home
      navigate('/');
    }
  }, [navigate]);

  if (!order) {
    return (
      <div className="loading-spinner-wrapper">
        <div className="loading-spinner"></div>
        <p className="loading-text">Preparing order receipt...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <main className="success-page-container">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <Check size={48} strokeWidth={3} />
        </div>

        <h1 className="success-title">Order Placed!</h1>
        <p className="success-desc">
          Your payment was processed successfully. The kitchen has been notified and your rider is on their way!
        </p>

        {/* Delivery Estimate */}
        <div 
          style={{ 
            background: 'var(--primary-light)', 
            color: 'var(--primary-color)', 
            padding: '12px 24px', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: 700, 
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Sparkles size={18} /> Estimated Delivery Time: 25 - 35 mins
        </div>

        {/* Order Receipt Details Card */}
        <section className="success-summary" aria-label="Detailed order receipt">
          <h2 className="success-summary-title">Receipt Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div>
              <strong>Order ID:</strong> {order.orderId}
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Date:</strong> {order.date}
            </div>
            <div>
              <strong>Payment Mode:</strong> {order.paymentMethod}
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Status:</strong> Paid / Confirmed
            </div>
          </div>

          <ul className="success-summary-items">
            {order.items.map((item, idx) => (
              <li key={idx} className="success-summary-item">
                <span>
                  {item.name} <strong style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</strong>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>${order.itemTotal.toFixed(2)}</span>
            </div>
            
            {order.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Discount Applied ({order.appliedCoupon})</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax Amount (5%)</span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="success-summary-total">
            <span>Total Paid</span>
            <span>${order.grandTotal.toFixed(2)}</span>
          </div>
        </section>

        {/* Back to Home CTA */}
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 30px', gap: '8px' }}>
          <Home size={18} /> Continue Shopping <ChevronRight size={18} />
        </Link>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
