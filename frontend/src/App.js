
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

import "./App.css";


function App() {
  const [favorites, setFavorites] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  const addToFavorites = (book) => {
  setFavorites((prev) => {
    if (prev.find((item) => item.id === book.id)) return prev; 
    return [...prev, book];
  });
};

const removeFromFavorites = (id) => {
  setFavorites((prev) => prev.filter((item) => item.id !== id));
};

  const addToCart = (book) => {
    setCartItems((prev) => [...prev, book]);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item, index) => index !== id));
  };

  return (
  <Router>
    <div className="app-container">
      <Navbar
        cartCount={cartItems.length}
        favoritesCount={favorites.length}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                favorites={favorites}
              />
            }
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/books"
            element={
              <Books
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                favorites={favorites}
              />
            }
          />

          <Route
            path="/books/:id"
            element={
              <BookDetails
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                favorites={favorites}
              />
            }
          />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                removeFromFavorites={removeFromFavorites}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  </Router>
);
}

export default App;
