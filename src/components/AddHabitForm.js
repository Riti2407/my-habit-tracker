// src/components/AddHabitForm.js
import React, { useState } from "react";
import "./AddHabitForm.css";

function AddHabitForm({ onAdd, darkMode }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <form className={`add-habit ${darkMode ? "add-habit--dark" : ""}`} onSubmit={handleSubmit}>
      <input
        className="add-habit__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new habit…"
        aria-label="Add a new habit"
      />
      <button className="add-habit__btn" type="submit">Save</button>
    </form>
  );
}

export default AddHabitForm;
