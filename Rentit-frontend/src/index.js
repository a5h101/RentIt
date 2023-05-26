import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/home/home';
import ErrorPage from './pages/errorPage/errorPage';
import Rent from './pages/rent/rent';
import Login from './pages/login/login';
import ItemDetails from './pages/itemDetail/itemDetails';
import { AppProvider } from './Context';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import EditPost from './pages/rent/edit';
import Footer from './components/Footer/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='user/:userId?' element={<Login />} />
        <Route path='rent' element={<Rent />} />
        <Route path='rent/edit/:id?' element={<EditPost />} />
        <Route path='ItemDetails/:id?' element={<ItemDetails />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AppProvider>
);
