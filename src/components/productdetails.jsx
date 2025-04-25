import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common/apiConfig';
import BestOfHridhayamSection from '../components/BestOfHridhayamSection';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = ({
  image,
  productName,
  price, // This is now the discounted price
  description,
  productId,
  inStock,
  discountPercentage = 0
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const navigate = useNavigate();

  // Calculate original price from discounted price
  const discountedPrice = Math.round(Number(price));
  const originalPrice = discountPercentage > 0
    ? Math.round(Number(price / (1 - discountPercentage / 100)))
    : discountedPrice;

  // Calculate partial payment for pre-order (rounded to whole number)
  const partialPayment = Math.round(discountedPrice / 2);

  const fetchCartQuantity = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(SummaryApi.getCartQuantity.url, {
        method: SummaryApi.getCartQuantity.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, productId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setCartQuantity(result.quantity);
      }
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
    }
  };

  useEffect(() => {
    fetchCartQuantity();
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login'); // Navigate to login page
      return;
    }

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity, // Now using the quantity state
          userId: userId,
          productId: productId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Product added to cart successfully!');
        setQuantity(1); // Reset quantity back to 1 after successful addition
        fetchCartQuantity(); // Refresh cart quantity after adding item
      } else {
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity,
          userId: userId,
          productId: productId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        navigate('/cart'); // Navigate to cart page after successful addition
      } else {
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
      console.error('Buy now error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreOrder = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    // Calculate the partial payment amount based on current quantity
    const currentPartialPayment = Math.round((discountedPrice * quantity) / 2);

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity,
          userId: userId,
          productId: productId,
          isPreOrder: true,
          partialPayment: currentPartialPayment
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        navigate('/cart');
      } else {
        toast.error(result.message || 'Failed to pre-order product');
      }
    } catch (error) {
      toast.error(error.message || 'Error processing pre-order');
      console.error('Pre-order error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    // Recalculate partial payment based on new quantity
    const newPartialPayment = Math.round((discountedPrice * newQuantity) / 2);
    setPartialPayment(newPartialPayment);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-8">
        {/* Product Image */}
        <div className="relative">
          <img
            className="w-full h-[600px] object-cover rounded-lg shadow-lg"
            src={image}
            alt={productName}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{productName}</h1>
          <div className="flex items-center space-x-2">
            {discountPercentage > 0 ? (
              <>
                <span className="text-2xl font-semibold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
                <span className="text-green-600 font-medium">{discountPercentage}% OFF</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-lg">{description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <h3 className="font-medium text-gray-900 text-lg">Quantity:</h3>
              <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 text-black font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`text-lg font-medium ${inStock ? 'text-green-600' : 'text-amber-600'}`}>
              {inStock ? 'In Stock' : 'Available for Pre-Order'}
            </div>

            {inStock ? (
              <>
                {/* Regular Add to Cart and Buy Now buttons */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg bg-black cursor-pointer text-white font-medium 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
                    transition duration-300`}
                >
                  {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg bg-blue-600 cursor-pointer text-white font-medium 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} 
                    transition duration-300`}
                >
                  {isLoading ? 'Processing...' : 'Buy Now'}
                </button>
              </>
            ) : (
              <>
                {/* Pre-order section */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-amber-800 mb-2">Pre-order with 50% advance payment</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Total Price:</span>
                      <span>₹{Math.round(discountedPrice * quantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Partial Payment (50%):</span>
                      <span>₹{Math.round((discountedPrice * quantity) / 2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-amber-800">
                      <span>Balance Due:</span>
                      <span>₹{Math.round((discountedPrice * quantity) / 2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePreOrder}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg bg-amber-600 text-white font-medium 
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-700'} 
                      transition duration-300`}
                  >
                    {isLoading ? 'Processing...' : 'Pre-order Now'}
                  </button>
                </div>
              </>
            )}

            {/* Cart Quantity Display */}
            {cartQuantity > 0 && (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FaShoppingCart className="text-xl" />
                <span className="font-medium">
                  {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'} in your cart
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <BestOfHridhayamSection
        className="section5 mt-16"
        title="YOU MAY ALSO LIKE"
        images={[
          '/src/assets/best-1.jpg',
          '/src/assets/best-2.jpg',
          '/src/assets/best-3.jpg',
          '/src/assets/best-4.jpg'
        ]}
        link="https://www.google.com"
      />
    </div>
  );
};

export default ProductDetails;
