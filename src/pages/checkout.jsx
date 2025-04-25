import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import SummaryApi from "../common/apiConfig";

const Checkout = () => {
  const navigate = useNavigate();
  const { error, isLoading, Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [cartData, setCartData] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchCartData();
  }, [userId]);

  useEffect(() => {
    // Add this check to redirect if cart is empty
    if (cartData && cartData.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cartData]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(SummaryApi.userProfile.url, {
        method: SummaryApi.userProfile.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || ''
        });
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Error loading user data");
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await fetch(SummaryApi.showCart.url, {
        method: SummaryApi.showCart.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCartData(data.data);
      } else {
        toast.error("Failed to fetch cart details");
      }
    } catch (error) {
      toast.error("Error loading cart data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (!cartData) return { regularTotal: 0, partialPaymentTotal: 0, balancePaymentTotal: 0, grandTotal: 0 };

    let totalAmount = 0;
    let totalPartialPayment = 0;
    let totalBalancePayment = 0;

    cartData.forEach(item => {
      const itemTotal = Math.round(item.productId.price * item.quantity);
      if (item.isPreOrder) {
        totalPartialPayment += Math.round(item.partialPayment);
        totalBalancePayment += Math.round(itemTotal - item.partialPayment);
      } else {
        totalAmount += itemTotal;
      }
    });

    return {
      regularTotal: Math.round(totalAmount),
      partialPaymentTotal: Math.round(totalPartialPayment),
      balancePaymentTotal: Math.round(totalBalancePayment),
      grandTotal: Math.round(totalAmount + totalPartialPayment)
    };
  };

  const validateForm = () => {
    const isPhoneValid = /^\d{10}$/.test(userData.phone);
    const isAddressValid =
      address.street.trim() !== "" &&
      address.city.trim() !== "" &&
      address.state.trim() !== "" &&
      address.zipcode.trim() !== "";

    setFormValid(isPhoneValid && isAddressValid);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setUserData({ ...userData, phone: value });
  };

  useEffect(() => {
    validateForm();
  }, [userData.phone, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.state || !address.zipcode || !userData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const formattedAddress = `${address.street}, ${address.city}, ${address.state} - ${address.zipcode}`;
      const totals = calculateTotals();

      const orderData = {
        userId,
        shippingAddress: formattedAddress,
        contactPhone: userData.phone,
        totalAmount: totals.grandTotal + totals.balancePaymentTotal,
        balanceDue: paymentMethod === 'cod' ? totals.grandTotal : totals.balancePaymentTotal,
        paidAmount: paymentMethod === 'cod' ? 0 : totals.grandTotal,
        paymentMethod: paymentMethod,
        transactionId: paymentMethod === 'cod' ? null : 'PENDING'
      };

      if (paymentMethod === 'online') {
        console.log(totals);
        const paymentResponse = await fetch(SummaryApi.payment.url, {
          method: SummaryApi.payment.method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ payAmount: orderData.paidAmount })
        });

        const response = await paymentResponse.json();

        if (response.success) {
          const paymentData = response.data;
          console.log("Payment data:", paymentData.orderId);
          const options = {
            key: "rzp_test_jw2Qi0BtmyvmdO",
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: "Hridhayam",
            description: "Payment for your order",
            order_id: paymentData.id,
            modal: {
              confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
              // This function is executed when checkout modal is closed
              // There can be 3 reasons when this modal is closed.
              ondismiss: async (reason) => {
                const {
                  reason: paymentReason, field, step, code,
                } = reason && reason.error ? reason.error : {};
                // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly. 
                if (reason === undefined) {
                  console.log('cancelled');
                }
                // Reason 2 - When modal is auto closed because of time out
                else if (reason === 'timeout') {
                  console.log('timedout');
                }
                // Reason 3 - When payment gets failed.
                else {
                  console.log('failed');
                }
              },
            },
            
            // This property allows to enble/disable retries.
            // This is enabled true by default. 
            retry: {
              enabled: false,
            },
            timeout: 300, // Time limit in Seconds
            handler: async (response) => {
              console.log(response)
              setShowProcessingModal(true);
              try {
                const verifyResponse = await fetch(SummaryApi.verifyPayment.url, {
                  method: SummaryApi.verifyPayment.method,
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                  orderData.transactionId = response.razorpay_payment_id;
                  await createOrder(orderData);
                } else {
                  setShowProcessingModal(false);
                  toast.error("Payment verification failed");
                  navigate("/cart", { replace: true });
                }
              } catch (error) {
                setShowProcessingModal(false);
                toast.error("Payment verification failed");
                console.error(error);
                navigate("/cart", { replace: true });
              }
            },
            prefill: {
              name: userData.name,
              email: userData.email,
              contact: userData.phone,
            },
            theme: {
              color: "#C17112",
            },
          };

          const rzp = new Razorpay(options);
          rzp.on('payment.failed', function (response) {
            if (options.modal?.ondismiss) {
              options.modal.ondismiss();
            }
            toast.error("Payment verification failed");
            console.error(response);
            navigate("/cart", { replace: true });
          });
          rzp.open();
          return;
        } else {
          toast.error(paymentData.message || "Failed to initiate payment");
          setSubmitting(false);
          return;
        }
      }

      // For COD, directly create order
      await createOrder(orderData);

    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Error processing your order");
    } finally {
      setSubmitting(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.orderId) {
        toast.success("Order created successfully!");
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Error processing your order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Processing Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-lg font-[cinzel] text-gray-800">Processing your order...</p>
            <p className="text-sm text-gray-600">Please do not close this window</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-[cinzel] text-amber-800 text-center mb-6">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
              {/* User Info Section */}
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-lg font-[cinzel] text-gray-800 mb-3">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="material-icons text-amber-600 text-sm">person</span>
                    {userData.name}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="material-icons text-amber-600 text-sm">email</span>
                    {userData.email}
                  </p>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter your 10-digit phone number"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="space-y-3">
                <h2 className="text-lg font-[cinzel] text-gray-800">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Street Address"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={address.zipcode}
                    onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
                    placeholder="ZIP Code"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-6">
              <h2 className="text-lg font-[cinzel] text-amber-800 mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-[250px] overflow-y-auto mb-4 pr-2">
                {cartData?.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.productId.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-medium text-gray-900">₹{item.productId.price * item.quantity}</p>
                      {item.isPreOrder && (
                        <div className="text-sm text-amber-600">
                          <p>Partial: ₹{item.partialPayment}</p>
                          <p>Balance: ₹{(item.productId.price * item.quantity) - item.partialPayment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Section - Moved inside summary */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-base font-[cinzel] text-amber-800 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'online'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                    }`}>
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-amber-900 flex items-center gap-2">
                        Pay Online Now
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                    }`}>
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-amber-900 flex items-center gap-2">
                        Cash on Delivery
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                {totals.regularTotal > 0 && (
                  <div className="flex justify-between text-amber-900">
                    <span>Regular Items</span>
                    <span>₹{totals.regularTotal}</span>
                  </div>
                )}
                {totals.partialPaymentTotal > 0 && (
                  <>
                    <div className="flex justify-between text-amber-900">
                      <span>Partial Payments</span>
                      <span>₹{totals.partialPaymentTotal}</span>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>Balance Due Later</span>
                      <span>₹{totals.balancePaymentTotal}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-base font-semibold text-amber-900">
                    <span>Total Due Now</span>
                    <span>₹{totals.grandTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !formValid}
                className={`w-full mt-4 px-4 py-3 rounded-lg text-white text-base font-medium transition-all
                  ${submitting || !formValid
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : !formValid ? (
                  'Complete Required Fields'
                ) : (
                  paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
