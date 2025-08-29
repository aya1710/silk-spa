import '../styles/Services.css';

import { useEffect, useState } from "react";


const API = "/api";

function getDayRow(hours, dateStr) {
  try {
    const dow = new Date(`${dateStr}T00:00:00`).getDay(); // 0=So .. 6=Sa
    return (hours || []).find(h => Number(h.dow) === dow);
  } catch {
    return null;
  }
}

export default function Services({ userToken, openingHours }) {
  const [list, setList] = useState([]);
  const [selVariant, setSelVariant] = useState({}); 
  const [draft, setDraft] = useState({}); 
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/services`);
        const j = await r.json();
        setList(Array.isArray(j) ? j : []);
      } catch {
        setMsg("Fehler beim Laden der Services ❌");
      }
    })();
  }, []);

  function setDraftField(sid, key, val) {
    setDraft(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), [key]: val } }));
  }

  async function book(service) {
    setMsg("");
    if (!userToken) {
      setMsg("Bitte melden Sie sich zuerst als Kunde an.");
      return;
    }
    const variantId = selVariant[service.id];
    if (!variantId) {
      setMsg("Bitte wählen Sie zuerst die Dauer.");
      return;
    }

    const d = draft[service.id] || {};
    if (!d.date || !d.time) {
      setMsg("Bitte Datum und Uhrzeit wählen.");
      return;
    }

    const dayRow = getDayRow(openingHours, d.date);
    if (!dayRow) {
      setMsg("Öffnungszeiten nicht definiert.");
      return;
    }
    if (dayRow.is_closed) {
      setMsg("An diesem Tag ist geschlossen.");
      return;
    }

    if (d.time < dayRow.open || d.time > dayRow.close) {
      setMsg(`Zeit außerhalb der Öffnungszeiten (${dayRow.open} - ${dayRow.close}).`);
      return;
    }


    const chosenVariant = (service.variants || []).find(v => v.id === variantId);
    const summary = [
      "Bitte bestätigen Sie Ihre Buchung:",
      "",
      `Leistung: ${service.title || "—"}`,
      chosenVariant
        ? `Variante: ${chosenVariant.duration_min} Min • €${chosenVariant.price}${chosenVariant.popular ? " ★" : ""}`
        : `Variante: #${variantId}`,
      `Datum: ${d.date}`,
      `Uhrzeit: ${d.time}`,
      d.notes ? `Notizen: ${d.notes}` : null,
      "",
      "Mit „OK“ bestätigen, mit „Abbrechen“ abbrechen."
    ].filter(Boolean).join("\n");

    const ok = window.confirm(summary);
    if (!ok) {
      setMsg("Buchung abgebrochen.");
      return;
    }




    try {
      const r = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          service_id: service.id,
          variant_id: variantId,
          date: d.date,
          time: d.time,
          notes: d.notes || ""
        })
      });
      const j = await r.json();
      if (!r.ok) {
        setMsg(j.error || "Fehler bei der Buchung");
        return;
      }
      setMsg("Buchung gesendet (wartend) ✅");
      setDraft(prev => ({ ...prev, [service.id]: { date: "", time: "", notes: "" } }));
      setSelVariant(prev => ({ ...prev, [service.id]: undefined }));
    } catch {
      setMsg("Server nicht erreichbar ❌");
    }
  }

  return (
    <section className="card">
      <h2>Leistungen</h2>
      <p className="muted">{msg}</p>

      <div className="services-grid">
        {list.length === 0 ? (
          <p>⏳ Lade Dienstleistungen...</p>
        ) : (
          list.map(service => {
            const d = draft[service.id] || {};
            const dayRow = d.date ? getDayRow(openingHours, d.date) : null;
            const isClosed = dayRow?.is_closed;

            return (
              <article className="service-card fade-in" key={service.id}>
                {service.image_url && (
                  <img
                    className="service-img"
                    src={service.image_url}
                    alt={service.image_alt || "Relaxation"}
                 
                  />
                )}
                <div className="service-content">
                <h3 className="service-title">{service.title}</h3>

                <div className="variant-row">
                  {service.variants?.map(v => (
                    <button
                      key={v.id}
                      className={`chip ${selVariant[service.id] === v.id ? "chip-on" : ""}`}
                      onClick={() => setSelVariant(prev => ({ ...prev, [service.id]: v.id }))}
                      title={v.popular ? "Am beliebtesten" : ""}
                    >
                      {v.duration_min} Min • €{v.price}{v.popular ? " ★" : ""}
                    </button>
                  ))}
                </div>

                <div className="service-form">
                  <label>Datum</label>
                  <input
                    type="date"
                    value={d.date || ""}
                    onChange={e => setDraftField(service.id, "date", e.target.value)}
                  />
                  </div>

                  <label>Uhrzeit</label>
                  <input
                    type="time"
                    value={d.time || ""}
                    onChange={e => setDraftField(service.id, "time", e.target.value)}
                  />

                  {d.date && dayRow && (
                    <p className="muted">
                      {isClosed
                        ? "Heute geschlossen"
                        : `Öffnungszeiten: ${dayRow.open} — ${dayRow.close}`}
                    </p>
                  )}

                  <label>Notizen (optional)</label>
                  <input
                    value={d.notes || ""}
                    onChange={e => setDraftField(service.id, "notes", e.target.value)}
                    placeholder="Vorlieben/Allergien..."
                  />

                  <button
                    className="btn primary"
                    onClick={() => book(service)}
                    disabled={!selVariant[service.id]}
                  >
                    Buchen
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  )};