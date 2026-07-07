import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Find redirect path or default to home
  const redirectPath = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate slight loader latency
    setTimeout(() => {
      const response = login(formData.email, formData.password);
      setIsSubmitting(false);

      if (response.success) {
        showToast(response.message, 'success');
        navigate(redirectPath, { replace: true });
      } else {
        showToast(response.message, 'error');
        setErrors({ submit: response.message });
      }
    }, 1000);
  };

  return (
    <div className="auth-page-wrapper animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <Utensils size={32} strokeWidth={2.5} />
            <span>FoodKart</span>
          </Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to track orders and satisfy your cravings!</p>
        </div>

        {errors.submit && (
          <div className="payment-error-alert" style={{ marginBottom: '20px' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="password-input-wrapper">
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                disabled={isSubmitting}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-light)' }} />
            </div>
            {errors.email && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                disabled={isSubmitting}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-light)' }} />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
