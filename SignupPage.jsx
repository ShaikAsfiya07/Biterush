import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate slight loading latency
    setTimeout(() => {
      const response = signup(formData.name, formData.email, formData.password);
      setIsSubmitting(false);

      if (response.success) {
        showToast(response.message, 'success');
        navigate('/login');
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and start ordering delicious meals!</p>
        </div>

        {errors.submit && (
          <div className="payment-error-alert" style={{ marginBottom: '20px' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="password-input-wrapper">
              <input
                id="name"
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                disabled={isSubmitting}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-light)' }} />
            </div>
            {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
          </div>

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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-control"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                disabled={isSubmitting}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-light)' }} />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
