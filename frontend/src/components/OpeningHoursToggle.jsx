
import '../styles/OpeningHoursToggle.css';
import { useState ,useRef} from "react";
import { WEEK_HOURS } from "../lib/openingHours"; 


export default function OpeningHoursToggle() {
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
    const wrapperRef = useRef();

  return (
    <div className="opening-hours-toggle"ref={wrapperRef} style={{ position: "relative" }}>
      <button className="btn tiny ghost" onClick={toggle}>
        {show ? "🕒 Schließen" : "🕒 Öffnungszeiten anzeigen"}
      </button>

      {show && (
        <div className="hours-popup-inline">
          <div className="popup-title">
            <strong>Wöchentliche Öffnungszeiten:</strong>
          </div>
          <ul className="hours-list">
            {WEEK_HOURS.map((day, index) => {
              const isToday = new Date().getDay() === index;
              return (
                <li
                  key={index}
                  className={`hours-item${isToday ? " today-row" : ""}`}
                >
                  {day.name} —{" "}
                  {day.is_closed
                    ? "Geschlossen"
                    : `${day.open} bis ${day.close}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
