// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Navbar} from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Cart from "./pages/Cart.tsx";
import axios from "axios";
import Checkout from "./pages/Checkout.tsx";
import Payment from "./pages/Payment.tsx";

function App() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

  return (
      <Router>
          <Navbar/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              {/*<Route path="/orders" element={<OrderHistory />} />*/}

              <Route path="/admin" element={<AdminDashboard/>}/>

          </Routes>
      </Router>
  )
}

export default App
