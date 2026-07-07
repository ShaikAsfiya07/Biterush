import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Clock, Search, Smile, Sparkles, UtensilsCrossed } from 'lucide-react';
import { RESTAURANTS_DATA } from '../data/restaurants';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredRestaurants, setFilteredRestaurants] = useState(RESTAURANTS_DATA);
  const [heroSearch, setHeroSearch] = useState('');

  // Update hero search text input when URL search changes
  useEffect(() => {
    setHeroSearch(searchQuery);
  }, [searchQuery]);

  // Categories list
  const categories = ['All', 'Burgers', 'Pizza', 'Asian', 'Healthy', 'Desserts', 'Mexican'];

  // Filter restaurants based on category AND search query
  useEffect(() => {
    let result = RESTAURANTS_DATA;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by Search Query (Restaurant Name, Cuisines, or specific Menu Items)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(restaurant => {
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesCuisine = restaurant.cuisine.toLowerCase().includes(query);
        const matchesMenuItem = restaurant.menu.some(item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
        );
        return matchesName || matchesCuisine || matchesMenuItem;
      });
    }

    setFilteredRestaurants(result);
  }, [selectedCategory, searchQuery]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchParams({ search: heroSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Clear search when changing category to avoid double filter confusion
    if (searchQuery) {
      setSearchParams({});
    }
  };

  return (
    <div className="landing-page-container animate-fade-in">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,87,34,0.1)', color: 'var(--primary-color)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
            <Sparkles size={14} /> Satisfy Your Cravings
          </div>
          <h1 className="hero-title">
            Order Food From Your <span>Favorite Restaurants</span>
          </h1>
          <p className="hero-subtitle">
            Get fresh, delicious meals delivered straight to your doorstep from top-rated kitchens in your neighborhood.
          </p>

          <form onSubmit={handleHeroSearchSubmit} className="hero-search-container">
            <input
              type="text"
              placeholder="What are you craving today?"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              aria-label="Craving search query"
            />
            <button type="submit" className="btn btn-primary">
              <Search size={18} /> Search
            </button>
          </form>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=450&q=80"
            alt="Delicious food arrangement"
            style={{ borderRadius: 'var(--radius-lg)' }}
          />
        </div>
      </header>

      {/* Category Tag Filters */}
      <section className="filters-section" aria-label="Cuisine categories filter">
        <div className="section-header">
          <h2 className="section-title">Explore by Cuisine</h2>
        </div>
        <div className="filter-pills-row">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Grid Section */}
      <section className="restaurants-section" aria-label="Restaurants list">
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Popular Restaurants' : `${selectedCategory} Spots`}
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {filteredRestaurants.length} places found
          </span>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="restaurants-grid">
            {filteredRestaurants.map((restaurant) => (
              <article key={restaurant.id} className="restaurant-card animate-slide-up">
                {restaurant.featured && (
                  <span className="card-featured-badge">Featured</span>
                )}
                
                <div className="card-img-wrapper">
                  <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
                </div>

                <div className="restaurant-card-content">
                  <div className="card-title-row">
                    <h3 className="card-title">{restaurant.name}</h3>
                  </div>

                  <div className="card-cuisines">
                    {restaurant.cuisine.split(', ').map((c, i) => (
                      <span key={i} className="cuisine-tag">{c}</span>
                    ))}
                  </div>

                  <div className="card-meta-info">
                    <div className="meta-item rating">
                      <Star size={16} />
                      <span>{restaurant.rating}</span>
                      <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>
                        ({restaurant.ratingCount})
                      </span>
                    </div>

                    <div className="meta-item delivery-time">
                      <Clock size={16} />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="card-btn-container">
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results-container animate-scale-up">
            <UtensilsCrossed size={64} className="no-results-icon" strokeWidth={1.5} />
            <h3 className="no-results-title">No Restaurants Found</h3>
            <p className="no-results-desc">
              We couldn't find any restaurants matching your search. Try searching for a different dish, cuisine, or restaurant!
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => {
                setSearchParams({});
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
