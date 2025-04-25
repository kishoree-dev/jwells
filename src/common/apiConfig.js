const backendDomain = "http://localhost:3000";

const SummaryApi = {
  category: {
    url: `${backendDomain}/product/category`,
    method: "get"
  },
  discount: {
    url: `${backendDomain}/product/discount`,
    method: "get"
  },
  categoryProduct: {
    url: `${backendDomain}/product/`,
    method: "get"
  },
  productDetails: {
    url: `${backendDomain}/product/info/`,
    method: "get"
  },
  login: {
    url: `${backendDomain}/user/login`,
    method: "post"
  },
  logout: {
    url: `${backendDomain}/user/logout`,
    method: "post"
  },
  register: {
    url: `${backendDomain}/user/register`,
    method: "post"
  },
  userProfile: {
    url: `${backendDomain}/user`,
    method: "post"
  },
  updateProfile: {
    url: `${backendDomain}/user/update`,
    method: "put"
  },
  addToCart: {
    url: `${backendDomain}/cart/add`,
    method: "post"
  },
  removeFromCart: {
    url: `${backendDomain}/cart/remove`,
    method: "delete"
  },
  getCartQuantity: {
    url: `${backendDomain}/cart/quantity`,
    method: "post"
  },
  showCart: {
    url: `${backendDomain}/cart/show`,
    method: "post"
  },
  fetchOrders: {
    url: `${backendDomain}/order`,
    method: "post"
  },
  fetchProducts: {
    url: `${backendDomain}/admin/product`,
    method: "post"
  },
  addProduct: {
    url: `${backendDomain}/admin/product/add`,
    method: "post"
  },
  updateProduct: {
    url: `${backendDomain}/admin/product/update`,
    method: "put"
  },
  removeProduct: {
    url: `${backendDomain}/admin/product/remove`,
    method: "delete"
  },
  customizeDesign: {
    url: `${backendDomain}/contact/designForm`,
    method: "post"
  },
  checkout: {
    url: `${backendDomain}/contact/checkout`,
    method: "post"
  },
  createOrder: {
    url: `${backendDomain}/order/create`,
    method: "post"
  },
  getAllOrders: {
    url: `${backendDomain}/admin/orders`,
    method: "get"
  },
  updateOrder: {
    url: `${backendDomain}/admin/order/status/`,
    method: "put"
  },
  getMyOrders: {
    url: `${backendDomain}/order/user`,
    method: "post"
  },
  getOrderDetails: {
    url: `${backendDomain}/order/`,
    method: "get"
  },
  payment: {
    url: `${backendDomain}/order/payment`,
    method: "post"
  },
  verifyPayment: {
    url: `${backendDomain}/order/verifyPayment`,
    method: "post"
  }

};

export default SummaryApi;
