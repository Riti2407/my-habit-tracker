import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef(null);

  // Auto-focus on first field
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const validate = () => {
    let tempErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email address";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitted(true);
        
        // Reset form after success
        setTimeout(() => {
          setFormData({ name: "", email: "", message: "" });
          setIsSubmitting(false);
        }, 3000);
      } catch (error) {
        console.error("Form submission error:", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="floating-ring ring1"></div>
      <div className="floating-ring ring2"></div>
      <div className="floating-ring ring3"></div>

      <div className="contact-container">
        {submitted ? (
          <div className="success-message">
            <div className="checkmark">✓</div>
            <h3>Thank You!</h3>
            <p>Your feedback has been sent successfully.</p>
            <p>We'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <div className="contact-header">
              <h2>📩 Contact Us</h2>
              <p>We'd love to hear your thoughts about <strong>My Weekly Habit Tracker</strong>!</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label htmlFor="name">
                  👤 Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  ref={nameInputRef}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">
                  📧 Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.message ? 'error' : ''}`}>
                <label htmlFor="message">
                  💬 Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please share your feedback, suggestions, or questions (minimum 10 characters)..."
                  className={errors.message ? 'error' : ''}
                />
                <div className="character-count">
                  {formData.message.length}/10 characters minimum
                </div>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Feedback'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;