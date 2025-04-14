import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter, taskRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected to Database."))
  .catch((error) => console.log(error));

const port = process.env.PORT;

const app = express();

const corsOptions = {
  origin: "https://task-manager-shubham.netlify.app/",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port} => http://localhost:${port}/`);
});
