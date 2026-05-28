import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        Посібники "Інтелект України" | 2-І | гімназія №4 | Дніпро
      </div>
      <nav className="nav">
        <a href="/">Головна</a>
        <a href="/statistics">Статистика</a>
        <a href="/admin">Адмін‑панель</a>
      </nav>
    </header>
  );
}

export default Header;
