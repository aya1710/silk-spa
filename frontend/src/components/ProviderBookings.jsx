import '../styles/ProviderBookings.css';

import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function formatDateSafe(b) {
 
  if (b?.start_at) {
    const d = new Date(b.start_at);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    }
  }
 
  if (b?.date && b?.time) {
    const d2 = new Date(`${b.date}T${b.time}`);
    if (!isNaN(d2.getTime())) {
      return d2.toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    }
  }
  return "Datum nicht verfügbar";
}

function statusLabel(s) {
  if (s === "accepted") return "✅ Akzeptiert";
  if (s === "rejected") return "❌ Storniert";
  return "🕓 Ausstehend"; 
}

export default function ProviderBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function loadBookings() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        const j = await r.json();
        setBookings(Array.isArray(j) ? j : []);
        setMsg("");
      } else {
        setMsg("Fehler beim Laden");
      }
    } catch (err) {
      console.error("Fehler beim Laden der Buchungen", err);
      setMsg("Verbindungsfehler ❌");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const r = await fetch(`${API}/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (r.ok) {
       
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status } : b))
        );
        setMsg("");
      } else {
        const err = await r.json().catch(() => ({}));
        setMsg(err.error || "Aktualisierung fehlgeschlagen");
      }
    } catch (err) {
      console.error("Fehler beim Status-Update:", err);
      setMsg("Verbindungsfehler beim Aktualisieren");
    }
  }

  useEffect(() => {
    if (token) loadBookings();
  }, [token]);

  if (!token) {
    return <p className="muted">Bitte einloggen, um Buchungen zu sehen.</p>;
  }

  if (loading) return <p>⏳ Lade Buchungen...</p>;

  return (
    <div className="card">
      <h2>📋 Alle Buchungen</h2>
      <button className="btn tiny" onClick={loadBookings} disabled={loading}>
        🔄 Aktualisieren
      </button>

      {msg && <p className="muted">{msg}</p>}

      {bookings.length === 0 ? (
        <p>Keine Buchungen gefunden.</p>
      ) : (
        <ul className="list">
          {bookings.map((b) => (
            <li key={b.id} className="booking-item">
              <div>
                <strong>{b.service_title || "—"}</strong><br />
                Dauer: {b.duration_min ? `${b.duration_min} Min` : "–"}<br />
                Preis: {b.price != null && !isNaN(parseFloat(b.price))
                  ? `${parseFloat(b.price).toFixed(2)} €`
                  : "–"}<br />
               Status: <span className={`pill st-${b.status}`}>{statusLabel(b.status)}</span>
              </div>

              <div>
                Datum: {formatDateSafe(b)}
              </div>

              <div className="actions">
                <button
                  className="btn tiny green"
                 onClick={() => updateStatus(b.id, "accepted")}>
                  ✅ Akzeptieren
                </button>
                <button
                  className="btn tiny red"
                  onClick={() => updateStatus(b.id, "rejected")}>❌ Ablehnen</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
