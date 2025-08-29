
import '../styles/Header.css';
import { todayInfo } from "../lib/openingHours/";
import OpeningHoursToggle from "./OpeningHoursToggle";


export default function Header({ user, onLogout }) {
  const t = todayInfo();

  return (
    
        <header className="topbar" role="banner" aria-label="Silk Touch">
      <div
        className="container">
       
        <div className="header-top">
          <p className="subtitle">
            Heute: {t.name} – {t.text}
          </p>
             <OpeningHoursToggle />
           </div>
           <div className="row main">
<div className="brand">
          <img className="brand-logo" src="/images/logo.jpg" alt="Spa Logo" />

          <div className="brand-text">
            <h1 className="title">Silk Touch</h1>
            
            <h2>Spa & Massage</h2>
            <p className="subtitle">Entspannen • Balance • Wohlbefinden</p>
            <p className="welcome-text">
              Willkommen bei <strong>Silk Touch</strong> – Ihre Oase der
              Entspannung & Schönheit
            </p>
              
          </div>
        </div>

       
        <nav className="quick">
          <a className="btn ghost" href="tel:+4917632642446">
            Jetzt anrufen
          </a>
          <a
            className="btn ghost"
            href="https://wa.me/4917632642446"
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>

          {user ? (
            <>
              <span className="muted">
                {user.name} {user.role === "provider" && "💼"}
              </span>
              <button className="btn tiny" onClick={onLogout}>
                Abmelden
              </button>
            </>
          ) : (
            <span className="muted">Nicht angemeldet</span>
          )}
        </nav>
      </div>
      </div>
    </header>

  
  );
}
