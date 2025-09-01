import React, { useState, useEffect } from "react";

const quotes = [
  "Discipline is the bridge between goals and accomplishment.",
  "Small daily improvements lead to big results.",
  "Your habits decide your future.",
  "Don’t wish for it. Work for it.",
  "Success is the sum of small efforts repeated daily.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream big. Start small. Act now.",
  "Good habits formed today will shape your tomorrow.",
  "The secret of success is consistency of purpose.",
  "Winners are not people who never fail, but people who never quit."
];

function QuoteWidget() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      margin: "20px auto",
      maxWidth: "500px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h3>💡 Motivation of the Day</h3>
      <p style={{ fontStyle: "italic" }}>{quote}</p>
    </div>
  );
}

export default QuoteWidget;
