import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";


dotenv.config();
const corsOptions = {
  origin: "http://localhost:3000",
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ extended: false, limit: "3000kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(async (error, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.messaage,
    },
  });
});

export default app;
