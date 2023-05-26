import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/v1/converter.routes";
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use("/api/v1/converter", router);

export default app;
