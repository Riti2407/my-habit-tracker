import React from "react";
import "./About.css";

const About = ({darkMode}) => {
  return (
     <div className={`about-container ${darkMode ? "dark" : ""}`}>
      <h1>About HabitTracker</h1>
      <p>
        HabitTracker is a simple yet powerful tool to help you build good habits
        and break bad ones. Track your progress, stay motivated, and achieve
        your goals - one day at a time.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Track daily, weekly, and monthly habits.</li>
        <li>Set streak goals and reminders.</li>
        <li>View progress charts and statistics.</li>
        <li>Sync your data across devices.</li>
      </ul>

      <h2>Our Mission</h2>
      <p>
        We believe that small, consistent actions can lead to big changes.
        HabitTracker is designed to make habit building intuitive, motivating,
        and rewarding.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have questions, feedback, or suggestions ? Feel free to{" "}
        <a href="/contact" style={{ textDecoration: "underline" }}>
          reach out to us
        </a>
        . We’d love to hear from you..!!
      </p>
    </div>
  );
};

export default About;
