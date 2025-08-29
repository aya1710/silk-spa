require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const metaRoutes = require("./routes/meta");
const servicesRoutes = require("./routes/services");
const bookingsRoutes = require("./routes/bookings");

const app = express();


const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowed, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);        // register, login, profile
app.use("/api/meta", metaRoutes);        // opening hours, announcements
app.use("/api/services", servicesRoutes); // services + variants
app.use("/api/bookings", bookingsRoutes); // bookings (provider + user)




const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);
