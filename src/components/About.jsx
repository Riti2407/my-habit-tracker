import React from "react";
import "./About.css"; 

const About = ({ darkMode }) => {
  return (
    <div className={`about-container ${darkMode ? "dark" : ""}`}>
      <h1>✨ About HabitTracker</h1>
      <p>
        HabitTracker is a simple yet powerful tool designed to help you build good habits
        and break bad ones. Track your progress, stay motivated, and achieve
        your goals - one day at a time. Whether you're looking to develop new routines
        or maintain existing ones, HabitTracker provides the insights and motivation you need.
      </p>

      <h2>🚀 Features</h2>
      <ul>
        <li>Track daily, weekly, and monthly habits with ease</li>
        <li>Set personalized streak goals and timely reminders</li>
        <li>View comprehensive progress charts and statistics</li>
        <li>Visualize your growth with our interactive progress tree</li>
        <li>Dark mode support for comfortable viewing anytime</li>
        <li>Clean, intuitive interface that keeps you focused</li>
      </ul>

      <h2>🎯 Our Mission</h2>
      <p>
        We believe that small, consistent actions can lead to transformative changes.
        HabitTracker is designed to make habit building intuitive, motivating,
        and genuinely rewarding. Our goal is to empower you to become the best version
        of yourself through steady, incremental progress.
      </p>

      <h2>💡 Why Choose HabitTracker?</h2>
      <p>
        Unlike other habit trackers, we focus on simplicity and motivation. Every feature
        is thoughtfully designed to encourage consistency without overwhelming you. 
        Your journey to better habits starts here, with a tool that adapts to your lifestyle
        and celebrates every milestone along the way.
      </p>

      <h2>📬 Contact Us</h2>
      <p>
        Have questions, feedback, or suggestions? We're always excited to hear from our users!
        Feel free to <a href="/contact">reach out to us</a> and share your experience.
        Your input helps us make HabitTracker even better for everyone.
      </p>
    </div>
  );
};

export default About;