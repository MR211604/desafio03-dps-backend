import express from "express";
import cors from "cors";

import resourceRoutes from "./routes/resourceRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost",
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/, // Permitir cualquier IP en la red local 192.168.x.x
      /^http:\/\/10\.0\.\d{1,3}\.\d{1,3}(:\d+)?$/, // Permitir cualquier IP en la red local 10.0.x.x
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use("/api/auth", userRoutes);
app.use("/api/resources", resourceRoutes);
// app.use(passport.initialize());
// app.use(passport.session())

function main() {
  try {
    app.listen(8080);
    console.log("Server running on port 8080");
  } catch (error) {
    console.log("An unknown error has occurred", error);
  }
}

main();
