import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Context from './context/index.js';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';

createRoot(document.getElementById('root')).render(
  <>
  <AuthProvider>
    <Context.Provider value={{}} />
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      enableMultiContainer={true}
    />
    <RouterProvider router={router} />
    </AuthProvider>
  </>
);
