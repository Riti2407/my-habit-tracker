import React from "react";
import footerImage from './foot.jpg';
import './Footer.css';

export default function Footer() {
    return (
        <div className="footer" id="contact">
            {/* Image Section */}
            <div className="img-container">
                <img className="image object-cover" src={footerImage} alt="Footer" />
            </div>

 
            {/* Contact Section */}
            <div className="contact">
{/* 
                <div className="headings">
                    <h2>Contact Us</h2>
                    <h3>Every habit counts. Stay committed to your journey</h3>
                </div> */}

                <div className="connection">
                    {/* Left Text */}
                    <div className="left">
                        <p>
                            We’re here to support your habit-tracking journey! Whether you have questions, feedback, or just want to share your progress, reach out—we’d love to hear from you. Your input helps us improve and create a better experience for everyone. Let’s build better habits, together!
                        </p>
                    </div>

                    {/* Right Form */}
                    {/* <div className="right">
                        <form className="contact-form">
                            <label htmlFor="name">Name:</label>
                            <input id="name" type="text" placeholder="Enter your name" />

                            <label htmlFor="email">Email:</label>
                            <input id="email" type="email" placeholder="Enter your email" />

                            <label htmlFor="message">Message:</label>
                            <textarea id="message" placeholder="Write your message"></textarea>

                            <button type="submit">Contact</button>
                        </form>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
