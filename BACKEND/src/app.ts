//All imports from dependencies
import express from "express";

//All imports from file
import "./database/connection";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import orderRoute from "./routes/orderRoute";

const app = express();
app.use(express.json());
app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

export { app, express };
