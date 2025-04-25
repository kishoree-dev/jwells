import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import { toast } from 'react-toastify';
import SummaryApi from '../common/apiConfig';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertDialog from './AlertDialog';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiData, setApiData] = useState([""]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Set the initial height of the menu to 0vh when the page loads
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.maxHeight = '0vh';
    }

    // Fetch data from API
    async function getData() {
      try {
        const response = await fetch(SummaryApi.category.url, {
          method: SummaryApi.category.method
        });
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setApiData(data.data);
        } else {
          console.error("API data is not an array of strings:", data);
        }
        console.log("API data fetched successfully:", data.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }

    // Call the initialization functions
    getData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearch]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchTerm('');
    setSearchResults([]);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        closeSearch();
      }
    }

    if (showSearch) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showSearch]);

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    setShowAlert(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include',
      });

      if (response.ok) {
        logout(); // Use context logout
        setShowProfileDropdown(false);
        toast.success('Logged out successfully');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('Error during logout');
    }
    setShowAlert(false);
  };

  const toggleMenu = () => {
    const menu = document.getElementById('menu');
    if (menu.style.maxHeight === '70vh') {
      menu.style.maxHeight = '0vh';
      setIsMenuOpen(false); // Remove "change" class
    } else {
      menu.style.maxHeight = '70vh';
      setIsMenuOpen(true); // Add "change" class
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.fetchProducts.url, {
        method: SummaryApi.fetchProducts.method
      });
      const data = await response.json();

      if (Array.isArray(data.data)) {
        const filtered = data.data.filter(product =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Error searching products');
    } finally {
      setIsLoading(false);
    }
  };

  const allCollectionsItems = [
    "Uncut Polki", "Antique Nakshi Kundan", "Diamond Finish Jewellery",
    "Antique nakshi kundan", "Diamond finish jewellery", "Haaram",
    "Necklace", "Chokers", "Pendant sets", "Statement earrings",
    "Bangles", "Waistbelts"
  ];

  const accountItems = [
    "Profile", "Help", "Logout"
  ];

  return (
    <>
      <AlertDialog
        isOpen={showAlert}
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowAlert(false)}
      />

      {showSearch && (
        <div className="fixed inset-0 backdrop-blur-sm z-50">
          <div className="w-full bg-white/95 py-4">
            <div className="max-w-7xl mx-auto px-4 relative">
              <div className="font-[cinzel] font-thin text-black text-[36px] text-center mb-4">HRIDHAYAM</div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg text-black shadow-[0_0_15px_rgba(180,151,90,0.15)] focus:shadow-[0_0_20px_rgba(180,151,90,0.3)] focus:border-[#B4975A] transition-shadow duration-300"
                  autoFocus
                />
                {/* Search icon inside input */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 absolute left-4 top-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Close button */}
                <button
                  onClick={closeSearch}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Search Results */}
                {searchTerm && (
                  <div className="absolute w-full bg-white mt-2 rounded-lg shadow-[0_4px_30px_-2px_rgba(180,151,90,0.35)] max-h-[80vh] overflow-y-auto p-6">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B4975A] mx-auto"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            to={`/${product.name}`}
                            state={{ productId: product._id }}
                            onClick={closeSearch}
                            className="flex flex-col bg-white rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 shadow-[0_2px_15px_rgba(180,151,90,0.2)] hover:shadow-[0_5px_25px_rgba(180,151,90,0.4)] hover:border-[#B4975A] border-2 border-transparent"
                          >
                            <div className="w-full h-28 bg-gray-50 relative group overflow-hidden">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-3 bg-white transition-colors duration-300 hover:bg-gray-50">
                              <h3 className="font-[cinzel] text-gray-900 text-[11px] font-medium truncate mb-1">{product.name || 'Unnamed Product'}</h3>
                              <p className="text-[#B4975A] text-[16px] font-semibold">
                                ₹{product.price?.toLocaleString() || 'Price not available'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-gray-400 text-sm mt-1">Try searching with different keywords</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col text-center justify-evenly shadow-[0_4px_30px_-4px_rgba(180,151,90,0.4)] h-[150px]">
        <div className="font-[cinzel] font-thin text-black text-[36px]">HRIDHAYAM</div>
        <nav>
          <ul id="menu" className="inline-block justify-center mt-[30px] list-none nav-links">
            <li className="inline block relative text-[#41444B] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]" ><Link to='/'>HOME</Link></li>
            <DropdownMenu
              title="ALL COLLECTIONS"
              items={apiData}
              endpoints={'collection'}
              renderItem={(item, index) => (
                <Link to="/collection" state={{ collectionName: item }}>
                  {item}
                </Link>
              )}
            />
            {/* Add Discounts link */}
            <li className="inline block relative text-[#41444B] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]">
              <Link to="/discounts">DISCOUNTS</Link>
            </li>
            <li className="inline block relative text-[#41444B] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]"><Link to={"/our-story"}>OUR STORY</Link></li>
            <li className="inline block relative text-[#41444B] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]"><Link to='/customize-design'>CUSTOMIZE DESIGN</Link></li>
            <li className="inline block relative text-[#41444B] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]" ><Link to='/contact' >CONTACT</Link></li>
            {/* Desktop profile icon */}

          </ul>
          <div className="inline block absolute text-[#41444B] top-[103px] right-[140px] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]">
            <button onClick={() => setShowSearch(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="inline block absolute text-[#41444B] top-[103px] right-[100px] hover:text-[#FFD700] font-[cinzel] font-medium text-[12px]"><Link to='/cart'><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2 12h13l2-7H5" />
          </svg></Link></div>
          <div className=" absolute top-[100px] right-[10px] inline-block ">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <Link
                  to="/profile"
                  className="inline-block p-2q rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#41444B] hover:text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="ml-1 p-1 rounded-full "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#41444B] hover:text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-[0_4px_20px_-3px_rgba(180,151,90,0.3)] py-2 z-50 border border-[#B4975A]/10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B4975A]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-[#B4975A] hover:text-[#8B7355]">
                Login
              </Link>
            )}
          </div>
        </nav>
        <div
          className={`container ${isMenuOpen ? "change" : ""}`}
          onClick={toggleMenu}
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </div >
    </>
  );
}

export default Header;
