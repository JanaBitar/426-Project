import "../styles/BookDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetails({ addToCart, addToFavorites, favorites }) {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load book");
        setBook(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  if (loading) {
    return (
      <section className="book-details-page">
        <p>Loading book details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="book-details-page">
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  if (!book) return null;

  const isFav = favorites?.some((f) => f.id === book.id);

  return (
    <section className="book-details-page">
      <div className="book-details-card">
        {/* Image placeholder */}
        <div className="book-details-img-wrap">
          {book.image ? (
            <img src={book.image} alt={book.title} className="book-details-image" />
          ) : (
            <div className="book-details-img-placeholder">No Image</div>
          )}
        </div>

        <div className="book-details-info">
          <h2 className="book-details-title">{book.title}</h2>
          <p className="book-details-author">by {book.author}</p>
          <p className="book-details-genre">{book.category}</p>

          <p className="book-details-price">
            ${Number(book.price).toFixed(2)}
          </p>

          {book.description ? (
            <p className="book-details-desc">{book.description}</p>
          ) : (
            <p className="book-details-desc">
              No description yet (coming from DB later).
            </p>
          )}

          <div className="book-details-actions">
            <button
              className="details-add-cart-btn"
              onClick={() => addToCart(book)}
            >
              Add to Cart
            </button>

            <button
              className="details-fav-btn"
              onClick={() => addToFavorites(book)}
            >
              {isFav ? "In Favorites" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
