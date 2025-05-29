//All imports from dependencies
import express from "express";

//All imports from file
import "./database/connection";
import userRoute from "./routes/userRoute";

const app = express();
app.use(express.json());
app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.use("/api/auth", userRoute);

export { app, express };
