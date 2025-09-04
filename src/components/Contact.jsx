import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);

      // fake "sending" delay
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);

        // clear form after submission
        setFormData({ name: "", email: "", message: "" });

        // hide success message after 3s
        setTimeout(() => setSubmitted(false), 3000);
      }, 1500);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="floating-ring ring1"></div>
      <div className="floating-ring ring2"></div>
      <div className="floating-ring ring3"></div>

      <div className="contact-container" data-tilt>
        {submitted ? (
          <div className="success-message">
            <div className="checkmark">✔</div>
            <p>✅ Feedback Sent Successfully!</p>
          </div>
        ) : (
          <>
            <h2>📩 Contact Us</h2>
            <p>
              We’d love to hear your thoughts about{" "}
              <strong>My Weekly Habit Tracker</strong>!
            </p>
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-group">
                <label htmlFor="name">👤 Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  aria-label="Your name"
                  required
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">📧 Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-label="Your email"
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">💬 Message / Feedback</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Leave your feedback"
                  aria-label="Your message"
                  required
                />
                {errors.message && (
                  <span className="error">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
