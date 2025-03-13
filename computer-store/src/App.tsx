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

function App() {
  return (
      <Router>
          <Navbar/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              {/*<Route path="/cart" element={<Cart />} />*/}
              {/*<Route path="/checkout" element={<Checkout />} />*/}
              {/*<Route path="/payment" element={<Payment />} />*/}
              {/*<Route path="/orders" element={<OrderHistory />} />*/}

              <Route path="/admin" element={<AdminDashboard/>}/>

          </Routes>
      </Router>
  )
}

export default App
