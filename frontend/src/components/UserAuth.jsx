import '../styles/UserAuth.css';
import { useState } from "react";

const API = "/api/auth";

export default function UserAuth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e){
    e.preventDefault();
    setMsg("...");
    const url = `${API}/${mode}`;
    const body = mode === "register"
      ? { name, phone, email, password }
      : { email, password };

    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(body)
      });
      const j = await r.json();
      if(!r.ok){ setMsg(j.error || "Fehler"); return; }

      onLogin(j.token, { ...j.user, token: j.token });
      setMsg(mode === "register" ? "Konto erstellt ✅" : "Erfolgreich angemeldet ✅");
    } catch (err) {
      setMsg("Server nicht erreichbar ❌");
    }
  }

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="card">
            <h2>Konto</h2>
            <div className="btn-group">
              <button
                className="btn tiny"
                onClick={()=>setMode("login")}
                disabled={mode==="login"}
              >
                Anmelden
              </button>
              <button
                className="btn tiny"
                onClick={()=>setMode("register")}
                disabled={mode==="register"}
              >
                Registrieren
              </button>
            </div>

            <form className="form" onSubmit={submit}>
              {mode === "register" && (
                <>
                  <label>
                    Name
                    <input
                      value={name}
                      onChange={e=>setName(e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Telefon (optional)
                    <input
                      value={phone}
                      onChange={e=>setPhone(e.target.value)}
                    />
                  </label>
                </>
              )}

              <label>
                E-Mail
                <input
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Passwort
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
              </label>

              <button className="btn primary" type="submit">
                {mode==="login" ? "Anmelden" : "Registrieren"}
              </button>
            </form>

            <p className="muted">{msg}</p>
          </div>
        </div>

        <div className="auth-right">
          <h2>Willkommen im Spa</h2>
          <p>Entspannen Sie sich und buchen Sie Ihre Wellness-Behandlung ganz einfach online.</p>
          <ul>
            <li>💆 Massagen</li>
            <li>🌿 Aromatherapie</li>
            <li>🧖‍♀️ Dampfbad</li>
          </ul>
          <div className="steam" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <footer className="auth-footer full-bleed">
        <div className="footer-inner">
          <h3 className="footer-title">Unser Spa in Bildern</h3>

          <div className="footer-gallery">
            <img src="/images/footer1.avif" alt="Massage Room" />
            <img src="/images/footer2.avif" alt="Aromatherapy" />
            <img src="/images/footer3.avif" alt="Steam Bath" />
          </div>

          <div className="footer-address">
            <p>📍 Silk Touch Spa</p>
            <p>Berliner Straße 22, 10117 Berlin</p>
            <p>Gebäude Nr. 3 – 1. Stock</p>
            <p className="insta-line">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                style={{ verticalAlign: 'middle', marginRight: '6px' }}
              >
                <path d="M7.5 2C4.46 2 2 4.46 2 7.5v9C2 19.54 4.46 22 7.5 22h9c3.04 0 5.5-2.46 5.5-5.5v-9C22 4.46 19.54 2 16.5 2h-9zM4 7.5C4 5.57 5.57 4 7.5 4h9c1.93 0 3.5 1.57 3.5 3.5v9c0 1.93-1.57 3.5-3.5 3.5h-9C5.57 20 4 18.43 4 16.5v-9zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-2a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              <a
                className="insta-link"
                href="https://www.instagram.com/ayaqof_o"
                target="_blank"
                rel="noopener noreferrer"
              >
                Folgen Sie uns auf Instagram
              </a>
            </p>
          </div>

          <p className="muted">Silk Touch Spa – Ihre Oase der Entspannung 🌸</p>
        </div>
      </footer>
    </>
  );
}
