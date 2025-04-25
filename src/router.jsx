import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/home';
import Collection from './pages/collection.jsx';
import Product from './pages/product.jsx';
import Cart from './pages/cart.jsx';
import FormPage from './pages/customizedesign.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import OurStory from './pages/our_story.jsx';
import Contact from './pages/contact.jsx';
import Discounts from './pages/discounts.jsx';
import Checkout from './pages/checkout.jsx';
import PrivacyPolicy from './pages/privacypolicy.jsx';
import TermsAndService from './pages/termsandservice.jsx';
import ShippingDetails from './pages/shippingdetails.jsx'; // NEW IMPORT

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/collection',
        element: <Collection />
      },
      {
        path: '/customize-design',
        element: <FormPage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/admin',
        element: <Dashboard />
      },
      {
        path: '/our-story',
        element: <OurStory />
      },
      {
        path: '/:name',
        element: <Product />
      },
      {
        path: '/discounts',
        element: <Discounts />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/privacy policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/terms of service',
        element: <TermsAndService />
      },
      {
        path: '/shipping details',
        element: <ShippingDetails />
      }
    ]
  },
  {
    path: '/cart',
    element: <Cart />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/checkout',
    element: <Checkout />
  }
]);