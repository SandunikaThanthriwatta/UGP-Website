// import dotenv from "dotenv";
import app from "./app.js";

// dotenv.config();

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on  ${process.env.PORT || 3000} `);
});
