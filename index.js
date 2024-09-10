import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routers/authRoutes.js"
import categoryRoutes from "./routers/categoryRoutes.js"
import publisherRoutes from "./routers/publisherRoutes.js"
import BookRoutes from "./routers/bookRoutes.js"
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

// connect database //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// middelwares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// router middelware //
app.use(authRoutes);
app.use(categoryRoutes);
app.use(publisherRoutes);
app.use(BookRoutes);

const port = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.send("Hi!!! Your are getting data");
});

app.listen(port, () => {
  console.log(`This is running ${port}`);
});
