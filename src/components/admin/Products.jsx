import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from '../../common/apiConfig.js';
import AlertDialog from '../AlertDialog';
import ProductModal from './ProductModal';
import LoadingModal from '../LoadingModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const categoryInputRef = useRef(null);
  const productsPerPage = 10;
  const userId = localStorage.getItem('userId');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    setCurrentPage(1); // Reset page when category changes
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.fetchProducts.url, {
        method: SummaryApi.fetchProducts.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ userId: userId })
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("API data is not an array:", data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories from products
  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
  }, [products]);

  // Filter and paginate products
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      (product.name && product.name.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.price && product.price.toString().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(SummaryApi.removeProduct.url, {
          method: SummaryApi.removeProduct.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({ id: productToDelete._id })
        });

        if (response.ok) {
          toast.success('Product deleted successfully!');
          fetchProducts(); // Refresh the list
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product: ' + error.message);
      }
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      // Close modal first to show immediate feedback
      setIsModalOpen(false);
      setSelectedProduct(null);

      // Force refresh the products list
      await fetchProducts();

      toast.success(updatedProduct._id ? 'Product updated successfully!' : 'New product added successfully!');
    } catch (error) {
      console.error('Error handling product update:', error);
      toast.error('Failed to save product changes');
    }
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryInputRef.current && !categoryInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className="p-6 max-w-8xl mx-auto bg-transparent">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* Header with Filters, Search and Pagination */}
        <div className="mb-8 flex justify-between items-center bg-white/30 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* New Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 min-w-[300px]"
            />
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
          <button
            onClick={handleAddNewProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-200/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Update table headers with proper text color */}
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Discount (%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentProducts.map((product) => (
                  <tr key={product._id}
                    className={`hover:bg-gray-50 ${!product.inStock ? 'bg-red-50' :
                      product.quantity <= 5 ? 'bg-yellow-50' : 'bg-white'
                      }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image || ''}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'placeholder-image-url'; // Add a placeholder image URL
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{product.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">Rs.{product.price || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {product.discountPercentage || 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {product.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${!product.inStock
                        ? 'bg-red-100 text-red-800'
                        : product.quantity <= 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}>
                        {!product.inStock
                          ? 'Out of Stock'
                          : product.quantity <= 5
                            ? 'Low Stock'
                            : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Add empty rows to maintain consistent height */}
                {currentProducts.length < productsPerPage && Array(productsPerPage - currentProducts.length).fill(null).map((_, index) => (
                  <tr key={`empty-${index}`} className="h-[76px]"> {/* Match height of product rows */}
                    <td colSpan="5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
            setPreviewImage(null);
          }}
          onSave={
            handleUpdateProduct
          }
          product={selectedProduct}
          title={selectedProduct?.id ? "Edit Product" : "Add New Product"}
          categories={categories}
        />

        <AlertDialog
          isOpen={showDeleteDialog}
          message="Are you sure you want to delete this product?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div >
    </>
  );
};

export default Products;
