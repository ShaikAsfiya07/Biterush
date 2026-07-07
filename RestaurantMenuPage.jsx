import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, ArrowLeft, Search, Plus, Minus, Info } from 'lucide-react';
import { RESTAURANTS_DATA } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const RestaurantMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Find restaurant by ID
  useEffect(() => {
    // Simulate minor loading API delay
    const timer = setTimeout(() => {
      const foundRest = RESTAURANTS_DATA.find(r => r.id === id);
      setRestaurant(foundRest || null);
      setLoading(false);
      if (foundRest && foundRest.menu.length > 0) {
        // Set first category as default active
        const categories = [...new Set(foundRest.menu.map(item => item.category))];
        setActiveCategory(categories[0] || '');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner-wrapper">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading delicious menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="no-results-container animate-scale-up">
        <Info size={64} className="no-results-icon" />
        <h3 className="no-results-title">Restaurant Not Found</h3>
        <p className="no-results-desc">
          The restaurant you are looking for does not exist or has been removed.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Restaurants
        </Link>
      </div>
    );
  }

  // Extract menu categories
  const categories = [...new Set(restaurant.menu.map(item => item.category))];

  // Get quantity of a specific item currently in the cart
  const getItemQty = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCartClick = (item) => {
    addToCart(item, restaurant);
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const handleQtyChange = (itemId, currentQty, amount, itemName) => {
    const newQty = currentQty + amount;
    updateQuantity(itemId, newQty);
    if (amount > 0) {
      showToast(`Increased quantity of ${itemName}`, 'success');
    } else if (newQty === 0) {
      showToast(`Removed ${itemName} from cart`, 'info');
    } else {
      showToast(`Decreased quantity of ${itemName}`, 'info');
    }
  };

  // Filter menu items by search query
  const filteredMenu = restaurant.menu.filter(item => {
    const query = menuSearchQuery.toLowerCase().trim();
    return item.name.toLowerCase().includes(query) || 
           item.description.toLowerCase().includes(query) ||
           item.category.toLowerCase().includes(query);
  });

  // Smooth scroll to category
  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="menu-page-container animate-fade-in">
      {/* Back to Home Link */}
      <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '24px', padding: '8px 16px', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Restaurants
      </Link>

      {/* Restaurant Header Banner */}
      <div 
        className="menu-banner"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="menu-banner-overlay">
          <div className="menu-banner-content">
            <div>
              <h1 className="menu-restaurant-name">{restaurant.name}</h1>
              <div className="menu-restaurant-info">
                <span className="menu-meta-badge rating">
                  <Star size={16} /> {restaurant.rating} ({restaurant.ratingCount})
                </span>
                <span className="separator"></span>
                <span>{restaurant.cuisine}</span>
                <span className="separator"></span>
                <span className="menu-meta-badge">
                  <Clock size={16} /> {restaurant.deliveryTime}
                </span>
              </div>
            </div>
            <div>
              {/* Menu Inline Search */}
              <div 
                className="nav-search-bar" 
                style={{ 
                  margin: 0, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  maxWidth: '300px'
                }}
              >
                <Search size={18} style={{ color: 'white' }} />
                <input
                  type="text"
                  placeholder="Search in menu..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  style={{ color: 'white' }}
                  className="menu-inline-search-input"
                  aria-label="Search items inside menu"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Columns */}
      <div className="menu-layout">
        {/* Categories Sidebar Index */}
        <aside className="menu-sidebar" aria-label="Menu categories">
          <h2 className="menu-sidebar-title">Menu Sections</h2>
          <nav>
            <ul className="menu-category-links">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`menu-category-link ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => scrollToCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Menu Items Content Area */}
        <main className="menu-content-area" aria-label="Restaurant dishes list">
          {categories.map(category => {
            // Get items belonging to this category
            const categoryItems = filteredMenu.filter(item => item.category === category);
            
            // Skip displaying empty search categories
            if (categoryItems.length === 0) return null;

            return (
              <section 
                key={category} 
                id={`category-${category}`}
                className="menu-category-section"
              >
                <h2 className="menu-category-title">
                  {category}
                  <span className="menu-category-count">({categoryItems.length})</span>
                </h2>

                <div className="menu-items-grid">
                  {categoryItems.map(item => {
                    const qtyInCart = getItemQty(item.id);

                    return (
                      <article key={item.id} className="food-card animate-slide-up">
                        <div className="food-card-details">
                          <div className="food-badge-row">
                            {/* Veg / Non-Veg Indicator */}
                            <span 
                              className={`diet-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}
                              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                            >
                              <span className="diet-dot"></span>
                            </span>
                            <span className="food-item-category">{item.category}</span>
                          </div>

                          <h3 className="food-name">{item.name}</h3>
                          <div className="food-price">${item.price.toFixed(2)}</div>
                          <p className="food-desc">{item.description}</p>
                          
                          <div className="food-item-rating">
                            <Star size={14} />
                            <span>{item.rating || '4.5'}</span>
                          </div>
                        </div>

                        {/* Media Section & Cart Controls */}
                        <div className="food-card-media">
                          <img src={item.image} alt={item.name} loading="lazy" />
                          
                          {/* Cart Add / Qty controls overlay */}
                          <div className="cart-controls-wrapper">
                            {qtyInCart > 0 ? (
                              <div className="qty-counter">
                                <button 
                                  className="qty-btn"
                                  onClick={() => handleQtyChange(item.id, qtyInCart, -1, item.name)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="qty-value">{qtyInCart}</span>
                                <button 
                                  className="qty-btn"
                                  onClick={() => handleQtyChange(item.id, qtyInCart, 1, item.name)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary"
                                style={{ 
                                  borderRadius: 'var(--radius-full)', 
                                  padding: '6px 16px', 
                                  fontSize: '0.85rem',
                                  height: '36px',
                                  boxShadow: 'var(--shadow-md)'
                                }}
                                onClick={() => handleAddToCartClick(item)}
                              >
                                Add +
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {filteredMenu.length === 0 && (
            <div className="no-results-container animate-scale-up" style={{ padding: '40px 0' }}>
              <UtensilsCrossed size={48} className="no-results-icon" />
              <h3 className="no-results-title" style={{ fontSize: '1.2rem' }}>No Dishes Found</h3>
              <p className="no-results-desc">
                No items in this menu match "{menuSearchQuery}".
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Simple Fallback Icon inside component
const UtensilsCrossed = ({ size = 24, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m16 2-3 3M2 22l9-9M19 5l3-3M22 2l-3 3M19 5l-7 7M15 17h6M12 21h9M18 13h3M8 12v9M4 12v9M12 11a4 4 0 0 1-8 0V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v7Z"/>
  </svg>
);

export default RestaurantMenuPage;
