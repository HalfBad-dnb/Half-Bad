import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [visibleLines, setVisibleLines] = useState([false, false, false]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  // Get default image based on product name
  const getDefaultImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('hoodie')) return '/images/hoodie.jpg';
    if (name.includes('shoes')) return '/images/shoez.jpg';
    return '/images/tshirt.jpg';
  };

  useEffect(() => {
    // Show lines one by one
    const lineDelays = [500, 2000, 3500];
    lineDelays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleLines(prev => {
          const newLines = [...prev];
          newLines[index] = true;
          return newLines;
        });
      }, delay);
    });

    // Show logo after all lines are visible
    setTimeout(() => {
      setLogoVisible(true);
    }, 4500);

    // Fetch products from the database
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/products');
        const data = await response.json();
        console.log('Featured products data:', data);
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    // Handle scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500; // Adjust this value to control how quickly the quote fades
      const newOpacity = Math.max(0.4, 1 - (scrollPosition / maxScroll));
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quoteLines = [
    "We, the unwilling, led by the unknowing, are doing the impossible for the ungrateful.",
    "We have done so much, for so long, with so little, we are now qualified to do anything with nothing.",
    "- Konstantin Josef Jireček"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white relative">
      {/* Background Quote */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          opacity: scrollOpacity,
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="max-w-4xl space-y-6 text-center px-4">
          {quoteLines.map((line, index) => (
            <div 
              key={index} 
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <p
                className={`${
                  index === quoteLines.length - 1
                    ? 'text-lg text-white font-bold tracking-wider'
                    : 'text-xl font-semibold tracking-wide text-[#FFD700] italic'
                } transition-all duration-1000 ease-in-out ${
                  visibleLines[index] 
                    ? 'opacity-100 scale-100 blur-0' 
                    : 'opacity-0 scale-150 blur-sm'
                }`}
                style={{
                  textShadow: visibleLines[index] 
                    ? '0 0 5px rgba(255,215,0,0.5)' 
                    : 'none',
                  transform: `perspective(1000px) ${visibleLines[index] ? 'translateZ(0)' : 'translateZ(50px)'}`,
                  transformStyle: 'preserve-3d',
                  WebkitTextStroke: index !== quoteLines.length - 1 ? '0.5px #FFD700' : '0.5px white'
                }}
              >
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 3s infinite linear;
        }
      `}</style>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative text-center py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Logo */}
            <div className={`mb-16 transition-all duration-1000 ease-in-out ${logoVisible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
              <div className="relative inline-block">
                <div className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-[url('/images/dust-particle.png')] bg-repeat opacity-20 animate-dust"></div>
                <img src="/images/l2.png" alt="My Logo" className="h-48" />
              </div>
            </div>

            {/* Quote */}
            {/* Removed Quote Section */}
          </div>
        </section>

        {/* Newest Music Section */}
        <section className="relative text-center py-20 px-8 z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-[#FFD700] mb-6">Newest Music</h2>
            <p className="text-2xl text-gray-300 mb-12">
              Check out the latest music albums and tracks that just dropped!
            </p>

            <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
              {/* Flex container to align the tracks side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* YouTube Embed */}
                <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                  <div className="w-full relative rounded-lg overflow-hidden shadow-2xl ring-4 ring-[#FFD700]/20">
                    <iframe
                      className="w-full h-80 rounded-lg"
                      src="https://www.youtube.com/embed/PBAedsWfoj8"
                      title="Cookie Tomorrow (Half Bad Remix)"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* SoundCloud Embed */}
                <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                  <div className="w-full relative rounded-lg overflow-hidden shadow-2xl ring-4 ring-[#FFD700]/20">
                    <iframe
                      className="w-full h-80 rounded-lg"
                      src="https://w.soundcloud.com/player/?url=https://soundcloud.com/halfbadx76/cookie-tomorrow-half-bad-remix?si=31575fa404b04059b1fe17d3c1d177f2&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
                      title="Cookie Tomorrow (Half Bad Remix)"
                      frameBorder="0"
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="mt-12 transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-[#FFD700] mb-4">Cookie Tomorrow (Half Bad Remix)</h3>
                <p className="text-xl text-gray-300">Artist: Half Bad</p>
                <button className="mt-6 bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105">
                  Listen Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="relative text-center py-20 px-8 z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-[#FFD700] mb-6">Our Story</h2>
            <p className="text-2xl text-gray-300 mb-12">A journey of passion and dedication</p>

            <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#FFD700] mb-4">Our Beginning</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Founded with a vision to bring unique and quality products to our customers, 
                    we started our journey in the heart of the music industry. Our passion for 
                    excellence and dedication to customer satisfaction has been our driving force.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Today, we continue to grow and evolve, always staying true to our core values 
                    of quality, innovation, and customer service. Every product in our collection 
                    is carefully selected to ensure it meets our high standards.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src="/images/kartu2.jpg" 
                    alt="Our Story" 
                    className="rounded-lg shadow-xl ring-4 ring-[#FFD700]/20 w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-story.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="relative text-center py-20 px-8 z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-[#FFD700] mb-6">Featured Products</h2>
            <p className="text-2xl text-gray-300 mb-12">Discover our exclusive collection</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105"
                >
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="mb-6 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                      <img
                        src={product.imageUrl || getDefaultImage(product.name)}
                        alt={product.name}
                        className="h-64 w-full object-cover object-center rounded-lg shadow-xl ring-4 ring-[#FFD700]/20"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getDefaultImage(product.name);
                        }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-4">{product.name}</h3>
                    <p className="text-gray-300 mb-4 text-lg">{product.description}</p>
                    <p className="text-2xl text-yellow-500 mb-6">${product.price}</p>
                    <button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105">
                      View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Shop With Us Section */}
        <section className="relative text-center py-20 px-8 z-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-[#FFD700] mb-6">Why Shop With Us</h2>
            <p className="text-2xl text-gray-300 mb-12">Experience the difference</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105">
                <div className="text-[#FFD700] text-4xl mb-6">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4">Fast Shipping</h3>
                <p className="text-gray-300 text-lg">Quick delivery to your doorstep with our premium shipping service.</p>
              </div>

              <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105">
                <div className="text-[#FFD700] text-4xl mb-6">
                  <i className="fas fa-medal"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4">Quality Products</h3>
                <p className="text-gray-300 text-lg">Premium materials and expert craftsmanship in every item.</p>
              </div>

              <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105">
                <div className="text-[#FFD700] text-4xl mb-6">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4">24/7 Support</h3>
                <p className="text-gray-300 text-lg">Always here to help with dedicated customer service.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 bg-black bg-opacity-60 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#FFD700]">Stay in Touch</h2>
            <p className="text-gray-300 mt-4 mb-6">
              Subscribe to our newsletter for the latest news and special offers!
            </p>
            {subscriptionStatus && (
              <p className={`mb-4 ${subscriptionStatus.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                {subscriptionStatus}
              </p>
            )}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!email) {
                setSubscriptionStatus('Please enter your email address');
                return;
              }
              try {
                const response = await fetch('http://localhost:8081/api/subscribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });
                
                if (response.ok) {
                  setSubscriptionStatus('Success! Thank you for subscribing!');
                  setEmail('');
                } else {
                  const data = await response.json();
                  setSubscriptionStatus(data.message || 'Failed to subscribe. Please try again.');
                }
              } catch (error) {
                console.error('Subscription error:', error);
                setSubscriptionStatus('Failed to subscribe. Please try again later.');
              }
            }} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="py-2 px-4 rounded-lg focus:outline-none w-full sm:w-auto bg-gray-800 text-white border border-[#FFD700]/20 focus:border-[#FFD700]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#FFD700] hover:bg-[#FFD700]/80 text-black py-2 px-6 rounded-lg transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-auto bg-black bg-opacity-90 text-gray-400 py-4 text-center">
        <p> 2025 All Rights Reserved. HALF BAD</p>
        <div className="mt-2">
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="mailto:your-email@example.com" className="hover:text-white">Email</a>
            </li>
            <li>
              <a href="https://www.facebook.com/pusiaublogas/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            </li>
            <li>
              <a href="https://www.instagram.com/half_bad_dnb/?locale=en%2F" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </li>
          </ul>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default HomePage;
