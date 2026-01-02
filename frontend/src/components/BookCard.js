
import React from "react";
import { Link } from "react-router-dom";
import "../styles/BookCard.css";

function BookCard({
  book,
  addToCart,
  addToFavorites,
  removeFromFavorites,
  favorites = [],
}) {
  const isFavorite = favorites.some((f) => f.id === book.id);

  const handleFavClick = () => {
    if (isFavorite) {
      if (removeFromFavorites) removeFromFavorites(book.id);
    } else {
      if (addToFavorites) addToFavorites(book);
    }
  };

  const MAX_DESC_LENGTH = 120;
  const shortDescription =
    book.description.length > MAX_DESC_LENGTH
      ? book.description.slice(0, MAX_DESC_LENGTH) + "..."
      : book.description;

  return (
    <div className="book-card-horizontal">
      <div className="book-cover-wrapper">
        <img
          src={book.image}
          alt={book.title}
          className="book-img-horizontal"
        />
        <button
          type="button"
          className={`fav-btn ${isFavorite ? "fav-active" : ""}`}
          onClick={handleFavClick}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <span className="category-pill">{book.category}</span>
      </div>

      <div className="book-info-horizontal">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-desc">{shortDescription}</p>

        <div className="price-row">
          <span className="price">${book.price}</span>
          {book.oldPrice && (
            <span className="old-price">${book.oldPrice}</span>
          )}
        </div>

        <div className="book-actions-row">
          <button
            type="button"
            className="add-cart-btn"
            onClick={() => addToCart(book)}
          >
            🛒 Add to Cart
          </button>

          <Link to={`/books/${book.id}`} className="details-link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
