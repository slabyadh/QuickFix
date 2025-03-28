import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the api gateway");
})

app.listen(3000, () => {
  console.log("API Gateway is running on port 3000");
});