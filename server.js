const express = require("express");
const cors = require("cors");
const mongoConnect = require("./lib/db");
const cookie = require("cookie-parser");
const dotenv = require("dotenv").config();
const path = require("path");

mongoConnect();

const port = process.env.PORT || 5000;

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];
const corsOptions = {
  origin: (origin, callback) => {
    const origins = allowedOrigins.find((item) => {
      return item === origin;
    });
    if (!origin || origins) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS"));
    }
  },
};

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookie());

// anilist routes
app.use("/api/anime", require("./routes/anilistRoutes"));
app.use("/api/anime/:id", require("./routes/anilistRoutes"));

// user route
app.use("/api/users", require("./routes/userRoutes"));

// review route
app.use("/api/reviews", require("./routes/reviewRoutes"));

// favourite route
app.use("/api/favourites", require("./routes/favouriteRoutes"));

// public routes
app.use("/api/public", require("./routes/publicRoutes"));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
