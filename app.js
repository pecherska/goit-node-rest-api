import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.js";

import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const app = express();

const { DB_HOST, PORT = 3000 } = process.env;
mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
    console.log("Server is running. Use our API on port: 3000");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });

export default app;
