import "../styles/Cart.css";
import { useState } from "react";

function Cart({ cartItems, removeFromCart }) {
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleCheckout = async () => {
  try {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: 2, // keep 2 for now (simple + works)
        total,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Checkout failed");
      return;
    }

    alert(`Order placed! Order ID: ${data.orderId}`);
  } catch (err) {
    alert("Server error while placing order");
  }
};


  return (
    <section className="cart-page">
      <h2>Your Cart</h2>

      <ul className="cart-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-img" />
            <div className="cart-info">
              <p className="cart-title">{item.title}</p>
              <p className="cart-author">{item.author}</p>
              <p className="cart-price">${item.price}</p>
            </div>
            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => removeFromCart(index)}
              disabled={loading}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-bottom">
        <div className="cart-total-row">
          <span>Total:</span>
          <span className="cart-total">${total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Placing order..." : "Proceed to Checkout"}
        </button>
      </div>
    </section>
  );
}

export default Cart;
