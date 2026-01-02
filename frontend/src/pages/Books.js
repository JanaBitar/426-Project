import "../styles/Books.css";
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";

function Books({ addToCart, addToFavorites, favorites }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:5000/api/books");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load books");
        setBooks(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const genres = useMemo(() => ["All", ...new Set(books.map((b) => b.category))], [books]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === "All" || book.category === genre;
    return matchesSearch && matchesGenre;
  });

  return (
    <section className="books-page">
      <div className="books-header-row">
        <div>
          <h2>Browse Books</h2>
          <p>Search and explore our book collection.</p>
        </div>

        <div className="genre-filter">
          <label>
            Choose a genre:
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="genre-select"
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

      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="books-list-vertical">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            addToCart={addToCart}
            addToFavorites={addToFavorites}
            favorites={favorites}
          />
        ))}
      </div>
    </section>
  );
}

export default Books;
