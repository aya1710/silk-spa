import { useEffect, useState } from "react";
import Header from "./components/Header";

import OpeningHoursToggle from "./components/OpeningHoursToggle";
import UserAuth from "./components/UserAuth";
import Services from "./components/Services";
import ProviderBookings from "./components/ProviderBookings";
import UserBookings from "./components/UserBookings";
import './styles/Style.css';
import './styles/Header.css';
import './styles/Services.css';
import './styles/UserAuth.css';
import './styles/OpeningHoursToggle.css';
import './styles/UserBooking.css';
import './styles/ProviderBookings.css';







const API = "/api";

export default function App() {
  const [openingHours, setOpeningHours] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [user, setUser] = useState(null); 

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/meta`);
        if (r.ok) {
          const j = await r.json();
          setOpeningHours(j.opening_hours || []);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Öffnungszeiten:", err);
      }
    })();
  }, []);

  function handleLogin(token, user) {
    setUserToken(token);
    setUser(user);
  }

  function handleLogout() {
    setUser(null);
    setUserToken("");
  }

  return (
    
    <div className="container">
      <Header user={user} onLogout={handleLogout} />
     
     <div className="opening-toggle">
    
  </div>


      {!user && <UserAuth onLogin={handleLogin} />}

      {user?.role === "user" && (
        <>
          <Services userToken={userToken} openingHours={openingHours} />
          <UserBookings token={user.token} />
        </>
      )}

      {user?.role === "provider" && (
        <ProviderBookings token={user.token} />
      )}
      
      
    </div>
  );
}
