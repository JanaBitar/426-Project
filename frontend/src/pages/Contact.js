import "../styles/Contact.css";

function Contact() {
  return (
    <section>
      <h2>Contact Us</h2>
      <p>If you have any questions, feel free to reach out!</p>

      <form className="contact-form">
        <label>
          Name
          <input type="text" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input type="email" placeholder="Your email" required />
        </label>
        <label>
          Message
          <textarea rows="4" placeholder="Your message" required />
        </label>
        <button type="submit" className="primary-btn">
          Send Message
        </button>
      </form>
    </section>
  );
}

export default Contact;
