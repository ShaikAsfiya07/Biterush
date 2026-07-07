import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ChevronDown, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { showToast } = useToast();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  
  const dropdownRef = useRef(null);

  // Sync search input with URL search parameters
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Handle cart items count badge animation bump
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  useEffect(() => {
    if (cartCount === 0) return;
    setCartBump(true);
    const timer = setTimeout(() => setCartBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Real-time filtering if already on the homepage
    if (location.pathname === '/') {
      if (val.trim()) {
        setSearchParams({ search: val.trim() });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  // Extract first letter of name for user avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <Utensils size={28} strokeWidth={2.5} />
          <span>FoodKart</span>
        </Link>

        {/* Search Bar (Centered) */}
        <form onSubmit={handleSearchSubmit} className="nav-search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>

        {/* Action Items */}
        <div className="nav-actions">
          {/* Cart Icon Button */}
          <Link to="/cart" className="cart-icon-btn" aria-label="Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className={`cart-badge ${cartBump ? 'bump' : ''}`}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="user-profile-menu" ref={dropdownRef}>
              <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{getInitials(user.name)}</div>
                <span className="user-name-label" style={{ fontWeight: 600, fontSize: '0.9rem', display: 'none' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </div>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{user.name}</div>
                    <div className="user-dropdown-email">{user.email}</div>
                  </div>
                  
                  <Link 
                    to="/cart" 
                    className="user-dropdown-item" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShoppingBag size={16} /> My Cart
                  </Link>

                  <button className="user-dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
