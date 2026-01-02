import React from "react";
import BookCard from "../components/BookCard";

function Favorites({ favorites, removeFromFavorites }) {
  return (
    <section className="favorites-page">
      <h2>Your Favorites ❤️</h2>

      {favorites.length === 0 ? (
        <p>You haven't liked any books yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              favorites={favorites}
              addToFavorites={() => {}} 
              removeFromFavorites={removeFromFavorites}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
