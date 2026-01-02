
import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ cartCount }) {
  const linkStyle = ({ isActive }) => ({
    marginRight: "1rem",
    textDecoration: "none",
    color: isActive ? "#ff6b6b" : "#333",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        MyBookStore
      </Link>

      <div className="nav-links">
        <NavLink to="/" style={linkStyle} end>
          Home
        </NavLink>
        <NavLink to="/about" style={linkStyle}>
          About
        </NavLink>
        <NavLink to="/books" style={linkStyle}>
          Books
        </NavLink>
        <NavLink to="/contact" style={linkStyle}>
          Contact
        </NavLink>
        <NavLink to="/favorites" style={linkStyle}>
          Favorites
        </NavLink>


        <NavLink to="/cart" style={linkStyle}>
          Cart
          <span className="cart-badge">{cartCount}</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
