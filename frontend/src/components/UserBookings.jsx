import '../styles/UserBooking.css';
import { statusLabel } from "../utils/statusLabel";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function formatDateSafe(value) {
  if (!value) return "Datum nicht verfügbar";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Datum nicht verfügbar";
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function UserBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function loadBookings() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/bookings/me`, {
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
      setMsg("Server nicht erreichbar ❌");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadBookings();
  }, [token]);

  if (!token) {
    return <p className="muted">Bitte logge dich ein, um deine Buchungen zu sehen.</p>;
  }

  if (loading) return <p>⏳ Buchungen werden geladen...</p>;

  return (
    <div className="card">
      <h2>Meine Buchungen</h2>
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
                Dauer: {b.duration_min ? `${b.duration_min} Minuten` : "—"}<br />
                💶 {b.price != null && !isNaN(parseFloat(b.price))
                  ? `${parseFloat(b.price).toFixed(2)} €`
                  : "—"}
              </div>

              <div>
  {formatDateSafe(b.start_at)}<br />
  Status:{" "}
  <span className={`pill st-${b.status}`}>
    {statusLabel(b.status)}
  </span>
</div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
