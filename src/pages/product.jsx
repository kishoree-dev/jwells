import React, { useState, useEffect } from "react";
import BestOfHridhayamSection from '../components/BestOfHridhayamSection';
import ProductDetails from "../components/productdetails";
import { useLocation } from 'react-router-dom';
import SummaryApi from "../common/apiConfig";

const product = () => {
  const [product, setProductData] = useState({});
  const location = useLocation();
  const { productId } = location.state;
  console.log(productId);
  // Fetch data from your backend here
  // Use the productId to fetch the product details
  async function fetchProductData(productId) {
    try {
      const response = await fetch(SummaryApi.productDetails.url + productId);
      const productData = await response.json();
      setProductData(productData.data);
      console.log("Product data fetched successfully:", productData.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
  useEffect(() => {
    fetchProductData(productId);
  }, [productId]);


  return (
    <div>
      <ProductDetails
        productId={productId}
        image={product.image}
        productName={product.name}
        price={product.price}
        inStock={product.inStock}
        description={product.description}
        discountPercentage={product.discountPercentage}
      />
    </div>
  );
};

export default product;
