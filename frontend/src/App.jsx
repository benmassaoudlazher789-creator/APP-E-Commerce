
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Error from './pages/Error'
import BarNav from './components/BarNav'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { current } from './JS/actions/auth.action'

function App() {
  const dispatch = useDispatch()
useEffect(()=>
  // pour identifier le user authentifier dés le montage du App 
  { dispatch(current()); }, [dispatch]);

  return (
    <div>
      <BarNav />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Error />} />
      </Routes>
      <Footer />

    </div>
  );
}

export default App;
