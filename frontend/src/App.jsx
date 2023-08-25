import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar';
import LandingPage from './routes/LandingPage';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import ListingHostPage from './routes/ListingHostPage';
import ListingNewPage from './routes/ListingNewPage';
import ListingEditPage from './routes/ListingEditPage';
import ListingBookPage from './routes/ListingBookPage';
import ListingPage from './routes/ListingPage';
import BookingOverviewPage from './routes/BookingOverviewPage';
import { UserContextProvider } from './userContext';

function App () {
  return (
    <div>
      <UserContextProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/listings/booking" element={<BookingOverviewPage />} />
            <Route path="/listings/host" element={<ListingHostPage />} />
            <Route path="/listings/new" element={<ListingNewPage />} />
            <Route path="/listings/:listingId" element={<ListingPage />} />
            <Route path="/listings/edit/:listingId" element={<ListingEditPage />} />
            <Route path="/listings/book/:listingId" element={<ListingBookPage />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Navigate to landing page if 404 */}
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  )
}

export default App;
