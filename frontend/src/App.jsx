
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Wishlist from './pages/Wishlist'
import Error from './pages/Error'
import BarNav from './components/BarNav'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import AdminProducts from './pages/AdminProducts'
import PageTransition from './components/PageTransition'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { current } from './JS/actions/auth.action'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(()=>
  // pour identifier le user authentifier dés le montage du App
  { dispatch(current()); }, [dispatch]);

  return (
    <div className="App">
      <BarNav />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/shop/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/order-confirmation/:orderNumber" element={<PageTransition><OrderConfirmation /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/admin/products" element={<PageTransition><AdminProducts /></PageTransition>} />
            <Route path="/*" element={<PageTransition><Error /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />

    </div>
  );
}

export default App;
