import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/v1/converter.routes";
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use("/api/v1/converter", router);
app.get("/", (req: Request, res: Response) => {
  const s = req.query.s;
  res
    .json({
      message: "Success",
    })
    .status(200);
  return s;
});

export default app;
