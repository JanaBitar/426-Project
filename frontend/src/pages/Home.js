import "../styles/Home.css";
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";

function Home({
  addToCart,
  addToFavorites,
  removeFromFavorites,
  favorites = [],
}) {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/books"); 
        if (!res.ok) {
          throw new Error(`Failed to fetch books (HTTP ${res.status})`);
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Failed to load books");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // New releases: first 3 books from DB
  const newReleases = useMemo(() => books.slice(0, 3), [books]);
  // Top sellers: books with topSeller flag or first 6 books
  const topSellers = useMemo(() => {
    const flagged = books.filter((b) => b.topSeller);
    return flagged.length > 0 ? flagged : books.slice(0, 6);
  }, [books]);

  const genres = useMemo(() => {
    return ["All", ...new Set(topSellers.map((b) => b.category).filter(Boolean))];
  }, [topSellers]);

  const filteredTopSellers = useMemo(() => {
    if (genre === "All") return topSellers;
    return topSellers.filter((b) => b.category === genre);
  }, [topSellers, genre]);

  return (
    <section className="home-page">
      {/* ---------- NEW RELEASES HERO ---------- */}
      <section className="new-releases-section">
        <div className="new-releases-text">
          <h1>New Releases This Week</h1>
          <p>
            It&apos;s time to refresh your reading list with some of the latest
            and greatest releases. From heart-pounding thrillers to inspiring
            non-fiction, this week&apos;s new books have something for everyone.
          </p>

          {loading && <p>Loading books...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>

        <div className="new-releases-books">
          {newReleases[0] && (
            <img
              src={newReleases[0].image}
              alt={newReleases[0].title}
              className="book-stack book-back"
            />
          )}
          {newReleases[2] && (
            <img
              src={newReleases[2].image}
              alt={newReleases[2].title}
              className="book-stack book-middle"
            />
          )}
          {newReleases[1] && (
            <img
              src={newReleases[1].image}
              alt={newReleases[1].title}
              className="book-stack book-front"
            />
          )}
        </div>
      </section>

      {/* ---------- TOP SELLERS SECTION ---------- */}
      <section className="top-sellers-section">
        <div className="top-sellers-header">
          <h2>Top Sellers</h2>

          <div className="top-genre-filter">
            <label>
              <span className="filter-label">Choose a genre</span>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="genre-select"
                disabled={loading}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="top-sellers-grid">
          {filteredTopSellers.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              addToCart={addToCart}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              favorites={favorites}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

export default Home;
